
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.util.Hashtable;
import java.util.Vector;
import java.util.Enumeration;
import java.util.StringTokenizer;
import oracle.cabo.share.agent.Agent;
import oracle.apps.fnd.framework.webui.OAJSPHelper;


public class _OAExport extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: OAExport.jsp 120.17.12010000.2 2010/02/23 09:37:46 sette ship $"; 
  // ** End Declarations

  public void _jspService(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException {

    response.setContentType( "text/html");
    /* set up the intrinsic variables using the pageContext goober:
    ** session = HttpSession
    ** application = ServletContext
    ** out = JspWriter
    ** page = this
    ** config = ServletConfig
    ** all session/app beans declared in globals.jsa
    */
    PageContext pageContext = JspFactory.getDefaultFactory().getPageContext( this, request, response, "OAErrorPage.jsp", true, JspWriter.DEFAULT_BUFFER, true);
    // Note: this is not emitted if the session directive == false
    HttpSession session = pageContext.getSession();
    int __jsp_tag_starteval;
    ServletContext application = pageContext.getServletContext();
    JspWriter out = pageContext.getOut();
    _OAExport page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      out.write(__oracle_jsp_text[2]);
      
        try 
        {
          // Implemented ER#3979223 - need to handle character set different when it's UTF8.
          boolean isExplorer = false;
          if ( Agent.APPLICATION_IEXPLORER == ((Integer)OAJSPHelper.getExportUserAgent(session)).intValue() )
            isExplorer = true;
          boolean isExcelInstalled = false;
          if ( isExplorer )
          {
            // Don't bother to check if Excel is installed when browser is not IE
            // because the information would not be in Accept header.
            String accepts = request.getHeader("Accept");
            StringTokenizer acceptTokens = new StringTokenizer(accepts, ", ");
            while (acceptTokens.hasMoreTokens())
            {
              String acceptApps = acceptTokens.nextToken();
              if ( "application/vnd.ms-excel".equals(acceptApps) )
                isExcelInstalled = true;
            }
          }
          String charSet = OAJSPHelper.getExportCharSet(session);
          if ("UTF8".equals(charSet) || "UTF-8".equals(charSet)) 
          {
            // ER 6753955 - Refer FND_UNCODE_IN_EXPORT profile otpion
            int unicodeMode = ((Integer) OAJSPHelper.getUnicodeMode(session)).intValue();
            switch (unicodeMode) 
            {
              case 0: // UnicodeLittle If Excel Exists
              default:
                if ( isExplorer && isExcelInstalled) // fix for bug 5586488
                  charSet = "UnicodeLittle";
                break;
              case 1: // Always UnicodeLittle
                charSet = "UnicodeLittle";
                break;
              case 2: // Always UTF-8 
                break; // use UTF-8 as is
            }
          }
          // End ER 6753955
      
          // Support for passivation
          boolean unused = OAJSPHelper.prepareSession(session, request);
          
          String exportMimeType = OAJSPHelper.getExportMimeType(session);
          String separator = "";
          String fileExtension = "";
          if (exportMimeType.indexOf("text/tab-separated-values") != -1) 
          {
            separator = "\t";
            fileExtension = ".txt";
          }
          else 
          {
            exportMimeType = "text/comma-separated-values";
            fileExtension = ".csv";
            separator = ",";
          }
      
          // Support all Java char sets. Set charset on output stream only. Bug#2942780
          // fix for 3294035 - setting the content type as "text/comma-separated-values"
          if (charSet != null)
            response.setContentType(exportMimeType);
      
          response.setHeader("Content-disposition","attachment; filename=export" + fileExtension); 
          // End ER 6753955
      
          ServletOutputStream outputStream  = response.getOutputStream();
          BufferedWriter bufferedWriter     = new BufferedWriter(new OutputStreamWriter(outputStream, charSet));
          Hashtable exportData              = OAJSPHelper.getExportData(session);
          Vector hashKeys                   = OAJSPHelper.getPageResultsKeys(session);
          int keysSize                      = ((hashKeys == null) ? 0 : hashKeys.size());
          int rowCount                      = 0;
          int index                         = 0;
          int token                         = 0;
          String data                       = null;
          StringBuffer outStrBuffer         = null;
          String outStr                     = null;
          Vector resultFile                 = null;
          Vector cellData                   = null;
          Enumeration enumRowData           = null;
          Enumeration enumCellData          = null;
      
          // ER 6753955 - Add utf-8 BOM only when charset is utf-8
          if ("UTF8".equals(charSet) || "UTF-8".equals(charSet)) 
          {
            bufferedWriter.write("\ufeff", 0 ,1);
          }
      
          // Loop through each View Object
          for (int key=0; key < keysSize; key++)
          {
            resultFile  = (Vector)exportData.get(hashKeys.elementAt(key));
            enumRowData = resultFile.elements();
      
            // Loop through each Row for this View Object
            while (enumRowData.hasMoreElements())
            {
              enumCellData = ((Vector)enumRowData.nextElement()).elements();
              // Loop through each cell for this row.
              while (enumCellData.hasMoreElements())
              {
                //fix to Bug # 2339031. Each occurance of " should be replaced with "" .
                data          = (String)enumCellData.nextElement();
                outStrBuffer  = new StringBuffer(data);
                index         = -1;
                token         = 0;
      
                while ((index = data.indexOf('\"', index+1))  != -1 )
                {
                  outStrBuffer.replace(index + token, index + token + 1, "\"\"");
                  token++;
                }
      
                outStr = new StringBuffer(outStrBuffer.length() + 2).append("\"").append(outStrBuffer.toString()).append("\"").toString();
                bufferedWriter.write(outStr, 0, outStr.length());
                // ER 6753955: Export Enhancement
                bufferedWriter.write (separator, 0 , 1);
                // End ER 6753955
              }
              bufferedWriter.write("\n", 0 , 1);
            }
            bufferedWriter.write("\n", 0 ,1);
            bufferedWriter.write("\n", 0, 1);
            bufferedWriter.flush();
             // fix for bug 5612338
          }
          bufferedWriter.close(); //fix for bug 5706605
        }
        finally
        {
            // Call the finalize method to clear session data
            OAJSPHelper.finalizeExportRequest(session, request);
        }    
      
      out.write(__oracle_jsp_text[3]);

    }
    catch (Throwable e) {
      if (!(e instanceof javax.servlet.jsp.SkipPageException)){
        try {
          if (out != null) out.clear();
        }
        catch (Exception clearException) {
        }
        pageContext.handlePageException(e);
      }
    }
    finally {
      OracleJspRuntime.extraHandlePCFinally(pageContext, true);
      JspFactory.getDefaultFactory().releasePageContext(pageContext);
    }

  }
  private static final char __oracle_jsp_text[][]=new char[4][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
