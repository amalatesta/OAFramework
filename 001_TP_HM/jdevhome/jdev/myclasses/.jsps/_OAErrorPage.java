
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import oracle.apps.fnd.common.URLTools;
import oracle.apps.fnd.common.WebRequestUtil;
import oracle.apps.fnd.common.WebAppsContext;
import java.util.*;
import oracle.jbo.*;
import javax.naming.*;
import oracle.jdeveloper.html.*;
import oracle.jbo.html.databeans.*;
import oracle.apps.fnd.framework.*;
import oracle.apps.fnd.framework.webui.*;


public class _OAErrorPage extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: OAErrorPage.jsp 120.41 2006/09/09 17:57:02 atgops1 noship $"; 
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
    PageContext pageContext = JspFactory.getDefaultFactory().getPageContext( this, request, response, null, true, JspWriter.DEFAULT_BUFFER, true);
    // Note: this is not emitted if the session directive == false
    HttpSession session = pageContext.getSession();
    int __jsp_tag_starteval;
    ServletContext application = pageContext.getServletContext();
    JspWriter out = pageContext.getOut();
    _OAErrorPage page = this;
    ServletConfig config = pageContext.getServletConfig();
    Throwable exception = (Throwable) request.getAttribute(PageContext.EXCEPTION);

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      
        String logoutUrl = OAJSPHelper.getLogoutUrl(request);
         
        // if _render_mode = 1, it means the request is for rendering a portlet.
        // (portlet render mode =  MODE_SHOW).
        boolean portletMode = ("1".equals(request.getParameter("_render_mode"))) ||
                              ("1".equals(request.getParameter("_mode")));
                              
      //Lauren bug #5549758 -- We need a WebAppsContext if we are going to MAC a URL.
      // added by gustavo - 
        WebAppsContext wctx = WebRequestUtil.validateContext(request, response);
      
        if( portletMode )
        {
          OAJSPHelper.incrementPortletCachingKey(request, session);
        }
        
        OAException e = null;
        try
        {
          if (exception == null)
          {
            e = OAException.wrapperException((Throwable)OAPageBean.getPPRException(session));
            if (e != null) 
              OAPageBean.removePPRException(session);
          }
          else
          {
            e = OAException.wrapperException((Throwable)exception);
          }
          OAApplicationModuleCache amCache = OAPageBean.getApplicationModuleCache(session);
          Hashtable amEntries = null;
          if (amCache != null)
            amEntries = amCache.getApplicationModuleEntries(session, request, response);  
          if (amEntries != null)
          {
            Enumeration amList       = amEntries.elements();
            OAApplicationModule am  = null;
            while (amList.hasMoreElements())
            {
              OASessionCookie sessionCookie = (OASessionCookie)amList.nextElement();
              if (sessionCookie != null)
                am = (OAApplicationModule)sessionCookie.useApplicationModule(false);
              if (am != null)
              {
                e.setApplicationModule(am);
                break;
              }
            }
          }
        }
        catch (Exception ex)
        {
          // If an exception is thrown here, just swallow it.  We don't want the 
          // original exception to get lost because of this side effect exception.
        }
      
        if (e != null)
          session.putValue("OASevereException", e);
      
        OAException ex   = (OAException)session.getValue("OASevereException");
        String displayErrorStack = (String)session.getValue("_displayErrorStack");
        if (displayErrorStack == null)
        {
         OAJSPHelper.handleErrorStackDisplay(null,null,request,session,ex);   
         displayErrorStack = (String)session.getValue("_displayErrorStack");  
        }    
      
      out.write(__oracle_jsp_text[2]);
      
        if ("Y".equals(displayErrorStack))
        {
          // Bug 6185337 - Encoding the error message to avoid script injection. 
          String err = (e != null) ? e.getMessageStackTraces() : "";
          err = oracle.apps.fnd.util.URLEncoder.encode(err);
      
      out.write(__oracle_jsp_text[3]);
      out.print( err );
      out.write(__oracle_jsp_text[4]);
      
         }   
      
      out.write(__oracle_jsp_text[5]);
       String severeErrorDuringRender = (String)session.getValue("severeErrorDuringRender");
         session.removeValue("severeErrorDuringRender");
         if (!"Y".equals(severeErrorDuringRender))
         {
      
      out.write(__oracle_jsp_text[6]);
       if  (logoutUrl != null)
            {
            
      out.write(__oracle_jsp_text[7]);
      out.print(logoutUrl);
      out.write(__oracle_jsp_text[8]);
       } 
      out.write(__oracle_jsp_text[9]);
            
         }
      
      out.write(__oracle_jsp_text[10]);
        
         if (!"Y".equals(severeErrorDuringRender))
         {
      
      out.write(__oracle_jsp_text[11]);
      
         }
         else
         {
      
      out.write(__oracle_jsp_text[12]);
        
         }
         if ("Y".equals(displayErrorStack))
         {
           //fix for bug 4115406 -- mbuk
           if (MobileUtils.getMobileUtils().isAgentPDA(pageContext))
           {
      
      out.write(__oracle_jsp_text[13]);
      
           }
           else 
           {
      
      out.write(__oracle_jsp_text[14]);
      
            }
      
      out.write(__oracle_jsp_text[15]);
          
            if ("Y".equals((String) session.getValue("_about_page_dataCollected")))
           
           
            {
              session.removeValue("_about_page_dataCollected");
      
       //Lauren bug #5549758 -- Build the URL programmatically
              // added by gustavo -         
              String url = "/OA_HTML/OA.jsp?page=/oracle/apps/fnd/framework/about/webui/OAAboutPG&OAMC=G";
              // and then add MAC encrypting stuff
              url = URLMgr.processOutgoingURL(url, wctx);        
      
      
      out.write(__oracle_jsp_text[16]);
      out.print( url );
      out.write(__oracle_jsp_text[17]);
      
            }
            else
            {
      
      out.write(__oracle_jsp_text[18]);
      
             }
          }
         
      
      out.write(__oracle_jsp_text[19]);
      
        //Lauren bug #5549758 -- We need a to free the WebAppsContext to free system resources
        // added by gustavo - 
      	wctx.freeWebAppsContext();
      

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
  private static final char __oracle_jsp_text[][]=new char[20][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n\r\n<html lang=\"en-US\">\r\n<head>\r\n<script>\r\nfunction ignoreWarnAboutChanges(url)\r\n{\r\n  document.location.href = url;\r\n}\r\n</script>  \r\n\r\n<style type=\"text/css\">\r\n\r\n.globalHeader {\r\nbackground: url(/OA_HTML/cabo/images/swan/headerBg.jpg);\r\nbackground-repeat:repeat-x;background-color:#1963a9\r\n}\r\n\r\n.globalLink  {white-space:nowrap;font-size:9pt;font-family:Arial;color:#ffffff;text-decoration:none}\r\n\r\n.pageLink A:link {color:#2b7c92}\r\n\r\n.copyright {white-space:nowrap;font-family:Arial;font-size:7.5pt;color:#ffffff;text-decoration:none}\r\n\r\n.errorHeader {\r\ncolor:#ed1c24;\r\nfont-family:Arial;\r\nfont-weight:bold;\r\nfont-size:9pt;\r\nvertical-align:middle;\r\nborder-bottom-width:1px;\r\nborder-bottom-style:solid;\r\nborder-bottom-color:#3a5a87;\r\nmargin-bottom:0px;\r\n}\r\n\r\n.errorText {\r\nfont-family:Tahoma,Arial,Helvetica,Geneva,sans-serif;\r\nfont-size:9pt;\r\n}\r\n\r\n</style>\r\n\r\n\r\n  <title>Error Page</title>\r\n  <META name=\"fwk-error\" content=\"Error occured while processing the request\">\r\n\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n     <META name=\"fwk-error-detail\" content=\"".toCharArray();
    __oracle_jsp_text[4] = 
    "\">\r\n".toCharArray();
    __oracle_jsp_text[5] = 
    "\r\n\r\n</head>\r\n\r\n<body> \r\n\r\n".toCharArray();
    __oracle_jsp_text[6] = 
    "  \r\n\r\n<table   class=\"globalheader\" width=\"100%\" border=\"0\" cellspacing=\"0\"  cellpadding=\"0\">\r\n  <tr> <td style=\"padding-left:5px; padding-top:10px;\"><img src=\"/OA_MEDIA/FNDSSCORP.gif\" alt=\"\"> </td></tr>\r\n  <tr>\r\n      ".toCharArray();
    __oracle_jsp_text[7] = 
    "\r\n       <td align=\"right\"; style=\"padding-right:5px;padding-bottom:5px\"> <a href= ".toCharArray();
    __oracle_jsp_text[8] = 
    " class=\"globalLink\"> Logout </a></td>\r\n      ".toCharArray();
    __oracle_jsp_text[9] = 
    "\r\n  </tr>  \r\n  \r\n</table>\r\n\r\n<p>\r\n".toCharArray();
    __oracle_jsp_text[10] = 
    "\r\n\r\n\r\n<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-left:5px;margin-right:5px\">\r\n".toCharArray();
    __oracle_jsp_text[11] = 
    " \r\n      <tr> <td> <h1 class=\"errorHeader\"> Error Page </h1> </td> </tr>\r\n      <tr valign=\"top\"> <td class=\"errorText\" >You have encountered an unexpected error.  Please contact the System Administrator for assistance. </td> </tr>      \r\n".toCharArray();
    __oracle_jsp_text[12] = 
    "\r\n      <tr> \r\n      <td> <h1 class=\"errorHeader\"> Error Page </h1> </td> \r\n      </tr>\r\n      \r\n      <tr valign=\"top\"> \r\n      <td class=\"errorText\" >You have encountered an unexpected error.  Please contact the System Administrator for assistance. </td> \r\n      </tr>      \r\n".toCharArray();
    __oracle_jsp_text[13] = 
    "\r\n       <tr> \r\n       <td style=\"padding-bottom:15px\" class=\"errorText\"> Click <span class=\"pageLink\"> <a  href=\"/OA_HTML/OAErrorDetailPage.jsp\"> here </a></span> for exception details. </td>\r\n       </tr>\r\n".toCharArray();
    __oracle_jsp_text[14] = 
    "   \r\n        <tr> \r\n        <td  style=\"padding-bottom:15px\" class=\"errorText\"> Click <span class=\"pageLink\"><a href=javascript:ignoreWarnAboutChanges(\"/OA_HTML/OAErrorDetailPage.jsp\")> here </a></span> for exception details. </td>\r\n        </tr>\r\n".toCharArray();
    __oracle_jsp_text[15] = 
    "\r\n        <tr>\r\n        <td style=\"padding-bottom:25px\" class=\"errorText\">\r\n\r\n".toCharArray();
    __oracle_jsp_text[16] = 
    "\r\n        <span class=\"pageLink\"> <a href=\"".toCharArray();
    __oracle_jsp_text[17] = 
    "\">About Previous Page</a></span>\r\n".toCharArray();
    __oracle_jsp_text[18] = 
    "\r\n        &nbsp; \r\n".toCharArray();
    __oracle_jsp_text[19] = 
    "       \r\n        </td>\r\n        </tr>\r\n\r\n</table>\r\n\r\n<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"\r\n      style=\"background-image:url(/OA_HTML/cabo/images/swan/footerBg.gif);\">\r\n<tr>\r\n   <td nowrap align=\"center\">\r\n     <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\r\n       <tr>\r\n         <td><a href=\"/OA_HTML/OALogout.jsp?menu=Y\" class=\"globalLink\">Logout</a></td>\r\n       </tr>\r\n     </table>\r\n    </td>\r\n</tr>\r\n\r\n<tr>\r\n<td>\r\n  <table cellpadding=\"2\" cellspacing=\"2\" border=\"0\" width=\"100%\">\r\n    <tr>\r\n      <td align=\"right\" nowrap width=\"100%\" class=\"copyright\">\r\n         Copyright (c) 2006, Oracle. All rights reserved.\r\n      </td>\r\n    </tr>\r\n   </table>\r\n</td>\r\n</tr>\r\n</table>\r\n<script>document.body.style.marginLeft=\"0px\";document.body.style.marginRight=\"0px\";document.body.style.marginTop=\"0px\";</script>\r\n\r\n</body>\r\n</html>\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
