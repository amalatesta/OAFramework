
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
    "\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\n\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\n\n<html lang=\"en-US\">\n<head>\n<script>\nfunction ignoreWarnAboutChanges(url)\n{\n  document.location.href = url;\n}\n</script>  \n\n<style type=\"text/css\">\n\n.globalHeader {\nbackground: url(/OA_HTML/cabo/images/swan/headerBg.jpg);\nbackground-repeat:repeat-x;background-color:#1963a9\n}\n\n.globalLink  {white-space:nowrap;font-size:9pt;font-family:Arial;color:#ffffff;text-decoration:none}\n\n.pageLink A:link {color:#2b7c92}\n\n.copyright {white-space:nowrap;font-family:Arial;font-size:7.5pt;color:#ffffff;text-decoration:none}\n\n.errorHeader {\ncolor:#ed1c24;\nfont-family:Arial;\nfont-weight:bold;\nfont-size:9pt;\nvertical-align:middle;\nborder-bottom-width:1px;\nborder-bottom-style:solid;\nborder-bottom-color:#3a5a87;\nmargin-bottom:0px;\n}\n\n.errorText {\nfont-family:Tahoma,Arial,Helvetica,Geneva,sans-serif;\nfont-size:9pt;\n}\n\n</style>\n\n\n  <title>Error Page</title>\n  <META name=\"fwk-error\" content=\"Error occured while processing the request\">\n\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\n     <META name=\"fwk-error-detail\" content=\"".toCharArray();
    __oracle_jsp_text[4] = 
    "\">\n".toCharArray();
    __oracle_jsp_text[5] = 
    "\n\n</head>\n\n<body> \n\n".toCharArray();
    __oracle_jsp_text[6] = 
    "  \n\n<table   class=\"globalheader\" width=\"100%\" border=\"0\" cellspacing=\"0\"  cellpadding=\"0\">\n  <tr> <td style=\"padding-left:5px; padding-top:10px;\"><img src=\"/OA_MEDIA/FNDSSCORP.gif\" alt=\"\"> </td></tr>\n  <tr>\n      ".toCharArray();
    __oracle_jsp_text[7] = 
    "\n       <td align=\"right\"; style=\"padding-right:5px;padding-bottom:5px\"> <a href= ".toCharArray();
    __oracle_jsp_text[8] = 
    " class=\"globalLink\"> Logout </a></td>\n      ".toCharArray();
    __oracle_jsp_text[9] = 
    "\n  </tr>  \n  \n</table>\n\n<p>\n".toCharArray();
    __oracle_jsp_text[10] = 
    "\n\n\n<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-left:5px;margin-right:5px\">\n".toCharArray();
    __oracle_jsp_text[11] = 
    " \n      <tr> <td> <h1 class=\"errorHeader\"> Error Page </h1> </td> </tr>\n      <tr valign=\"top\"> <td class=\"errorText\" >You have encountered an unexpected error.  Please contact the System Administrator for assistance. </td> </tr>      \n".toCharArray();
    __oracle_jsp_text[12] = 
    "\n      <tr> \n      <td> <h1 class=\"errorHeader\"> Error Page </h1> </td> \n      </tr>\n      \n      <tr valign=\"top\"> \n      <td class=\"errorText\" >You have encountered an unexpected error.  Please contact the System Administrator for assistance. </td> \n      </tr>      \n".toCharArray();
    __oracle_jsp_text[13] = 
    "\n       <tr> \n       <td style=\"padding-bottom:15px\" class=\"errorText\"> Click <span class=\"pageLink\"> <a  href=\"/OA_HTML/OAErrorDetailPage.jsp\"> here </a></span> for exception details. </td>\n       </tr>\n".toCharArray();
    __oracle_jsp_text[14] = 
    "   \n        <tr> \n        <td  style=\"padding-bottom:15px\" class=\"errorText\"> Click <span class=\"pageLink\"><a href=javascript:ignoreWarnAboutChanges(\"/OA_HTML/OAErrorDetailPage.jsp\")> here </a></span> for exception details. </td>\n        </tr>\n".toCharArray();
    __oracle_jsp_text[15] = 
    "\n        <tr>\n        <td style=\"padding-bottom:25px\" class=\"errorText\">\n\n".toCharArray();
    __oracle_jsp_text[16] = 
    "\n        <span class=\"pageLink\"> <a href=\"".toCharArray();
    __oracle_jsp_text[17] = 
    "\">About Previous Page</a></span>\n".toCharArray();
    __oracle_jsp_text[18] = 
    "\n        &nbsp; \n".toCharArray();
    __oracle_jsp_text[19] = 
    "       \n        </td>\n        </tr>\n\n</table>\n\n<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"\n      style=\"background-image:url(/OA_HTML/cabo/images/swan/footerBg.gif);\">\n<tr>\n   <td nowrap align=\"center\">\n     <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n       <tr>\n         <td><a href=\"/OA_HTML/OALogout.jsp?menu=Y\" class=\"globalLink\">Logout</a></td>\n       </tr>\n     </table>\n    </td>\n</tr>\n\n<tr>\n<td>\n  <table cellpadding=\"2\" cellspacing=\"2\" border=\"0\" width=\"100%\">\n    <tr>\n      <td align=\"right\" nowrap width=\"100%\" class=\"copyright\">\n         Copyright (c) 2006, Oracle. All rights reserved.\n      </td>\n    </tr>\n   </table>\n</td>\n</tr>\n</table>\n<script>document.body.style.marginLeft=\"0px\";document.body.style.marginRight=\"0px\";document.body.style.marginTop=\"0px\";</script>\n\n</body>\n</html>\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
