<%@ page
  language    = "java"
  contentType = "text/html"
  errorPage   = "OAErrorPage.jsp"
  import      = "java.io.OutputStreamWriter,
                 java.io.BufferedReader,
                 java.io.InputStream,
                 java.io.InputStreamReader,
                 java.util.Dictionary,
                 oracle.apps.fnd.framework.OAApplicationModule,
                 oracle.apps.fnd.framework.OAViewObject,
                 oracle.apps.fnd.framework.webui.OAJSPHelper,
                 oracle.apps.fnd.framework.webui.OAWebBeanConstants,
                 oracle.apps.fnd.util.BrowserDetector,
                 oracle.jbo.domain.ClobDomain,
                 oracle.jbo.domain.BlobDomain,
                 oracle.jbo.Row"
%>

<%! public static final String RCS_ID = "$Header: OADownload.jsp 120.41.12010000.3 2010/01/25 10:27:08 sette ship $"; %>

<%
    try
    {
      boolean unused = OAJSPHelper.prepareSession(session, request);
      String transactionid = request.getParameter("transactionid");
      Dictionary sessionStore = OAJSPHelper.getSessionStore(transactionid, session);
      String downloadFileName = (String)sessionStore.get(OAWebBeanConstants.OA_DOWNLOAD_FILE_NAME_PARAM);
      String contentType = (String)sessionStore.get(OAWebBeanConstants.OA_DOWNLOAD_CONTENT_TYPE_PARAM);
      String charset = (String)sessionStore.get(OAWebBeanConstants.OA_DOWNLOAD_CHAR_SET);
      String amDefName = (String)sessionStore.get(OAWebBeanConstants.OA_DOWNLOAD_AM_DEF_NAME);
      String viewName = (String)sessionStore.get(OAWebBeanConstants.OA_DOWNLOAD_VIEW_USAGE_NAME);
      String viewAttr = (String)sessionStore.get(OAWebBeanConstants.OA_DOWNLOAD_VIEW_ATTR_NAME);
      OAApplicationModule downloadAM = null;
      if ( amDefName != null && !"".equals(amDefName) )
      {
        downloadAM = OAJSPHelper.registerDownloadApplicationModule(session, request, response, amDefName);
        if ( downloadAM != null )
        {
          OAViewObject downloadVO = (OAViewObject)downloadAM.findViewObject(viewName);
          if (downloadVO != null && downloadVO.getFetchedRowCount() > 0)
          {
            Row viewRow = downloadVO.getCurrentRow();
            if ( viewRow == null )
            {
              if ( downloadVO.getCurrentRowIndex() == -1 )
                viewRow = downloadVO.next();
            }
            // ER# 5212726 for IPM - cache transaction id and file_id of FND_LOBS
            // Note that OADownload.jsp is not being used for FND_LOBS only,
            // therefore, FileId view attribute may not exist in the VO.
            // We need to catch oracle.jbo.NoDefException.
            if ( viewRow != null )
            {
              Object fileId = null;
              try
              {
                fileId = viewRow.getAttribute("FileId");
              }
              catch (oracle.jbo.NoDefException ne) {}
              if (fileId != null )
              {
                request.getSession(false).putValue("IPM_TRANSACTION_ID", transactionid);
                request.getSession(false).putValue("IPM_FILE_ID", fileId);
              }
            }

            Object fileContent = viewRow.getAttribute(viewAttr);
            response.setContentType(contentType);
            // The OAATTACH_DISPLAY_HTML system property is special workaround for bug 3684659
            String isInlineAttachment = System.getProperty("OAATTACH_DISPLAY_HTML");
            if (!"inline".equals(isInlineAttachment) || !"text/html".equals(contentType))
            {
              // Fixed IPG bug 4711527
              BrowserDetector detector = new BrowserDetector(request);
              // Bug 9295580 - GRAJAGO
              // Firefox truncates the file name if it contains spaces till the 
              // first space. Note that the filename should be surrounded by
              // double quotes, per RFC 2231.
              if (detector.isFirefox() || detector.isMozzila())
                response.setHeader("Content-Disposition","Attachment; Filename*=\"" + downloadFileName + "\"");
              else
                response.setHeader("Content-Disposition","Attachment; Filename=" + downloadFileName);
            }
            ServletOutputStream outStream = response.getOutputStream(); 
            if ( fileContent instanceof String )
            {
              byte[] strBytes = ((String)fileContent).getBytes(charset);
              response.setContentLength(strBytes.length); 
              outStream.write(strBytes, 0, strBytes.length);
            }
            else if ( fileContent instanceof ClobDomain )
            {
              // Fixed bug 3262374
              oracle.sql.CLOB oracleClob = 
                  (oracle.sql.CLOB)((ClobDomain)fileContent).getData(); 
              long contentLength = ((ClobDomain)fileContent).getLength();
              Long lengthObj = new Long(contentLength);
              response.setContentLength(lengthObj.intValue());
              OutputStreamWriter writeStream = new 
                  OutputStreamWriter(outStream, charset);
              // CLOB may be null when the view attribute java type
              // is not ClobDomain (workaround added in for Hyun)
              if ( oracleClob != null )
              {
                BufferedReader instream = 
                    new BufferedReader(oracleClob.getCharacterStream());
                char [] charArray = new char [4 * 1024];
                int charsRead = 0;
                while ((charsRead =
                    instream.read(charArray,0,charArray.length))!= -1)
                  writeStream.write(charArray,0,charsRead);
                ((ClobDomain)fileContent).closeInputStream();
                writeStream.close();
              }
              else
              {
                char[] charArray = ((ClobDomain)fileContent).getStorageCharArray();
                if ( contentLength > 0 )
                {
                  writeStream.write(charArray, 0, lengthObj.intValue());
                  writeStream.close();
                }
              }
            }
            else if ( fileContent instanceof BlobDomain )
            {
              InputStream inStream =
                  ((BlobDomain)fileContent).getBinaryStream();
              long contentLength = ((BlobDomain)fileContent).getLength();
              Long lengthObj = new Long(contentLength);
              byte[] bytes = new byte[1024];
              response.setContentLength(lengthObj.intValue());
              
              // Bug 7271381 : Commented inStream.reset()
              // Bug 7028054
              // inStream.reset();
              int bytesRead = inStream.read(bytes);
              while ( bytesRead > 0 ) {
                outStream.write(bytes, 0 ,bytesRead);
                bytesRead = inStream.read(bytes);
              } // end while
              // bug 5177545: Call closeInputStream so that user can choose to 
              // write out the file multiple times
              ((BlobDomain)fileContent).closeInputStream();
            }
            outStream.close();
          }
        }
      }
    }
    catch (Exception e) 
    { 
      //pageBean.registerSevereException(e); 
    }
    finally
    {
      OAJSPHelper.finalizeDownloadRequest(session, request);
    }

%>