
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.*;
import oracle.jbo.*;
import javax.naming.*;
import oracle.jdeveloper.html.*;
import oracle.jbo.html.databeans.*;
import oracle.apps.fnd.framework.*;
import oracle.apps.fnd.framework.webui.*;


public class _OAErrorDetailPage extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: OAErrorDetailPage.jsp 120.25 2006/09/09 17:56:23 atgops1 noship $"; 
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
    _OAErrorDetailPage page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      
        response.setHeader("Cache-Control", "no-cache,no-store,max-age=0"); // HTTP 1.1
        response.setHeader("Pragma", "no-cache");                           // HTTP 1.0
        response.setDateHeader("Expires", -1);                              // Prevent caching at the proxy server
      
        String logoutUrl = OAJSPHelper.getLogoutUrl(request);
      
      out.write(__oracle_jsp_text[2]);
       if  (logoutUrl != null)
            {
            
      out.write(__oracle_jsp_text[3]);
      out.print(logoutUrl);
      out.write(__oracle_jsp_text[4]);
       } 
      out.write(__oracle_jsp_text[5]);
      
        OAException e   = (OAException)session.getValue("OASevereException");
        session.removeValue("OASevereException");
      
      out.write(__oracle_jsp_text[6]);
      
         String displayErrorStack = (String)session.getValue("_displayErrorStack");
         session.removeValue("_displayErrorStack");
         if ("Y".equals(displayErrorStack))
         {
      
      out.write(__oracle_jsp_text[7]);
      out.print( (e != null) ? e.getMessageStackTraces() : "" );
      out.write(__oracle_jsp_text[8]);
      
         }
      
      out.write(__oracle_jsp_text[9]);

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
  private static final char __oracle_jsp_text[][]=new char[10][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    " \r\n<html lang=\"en-US\">\r\n<head>\r\n  <title>Error Details</title>\r\n<style type=\"text/css\">\r\n\r\n.globalHeader {\r\nbackground: url(/OA_HTML/cabo/images/swan/headerBg.jpg);\r\nbackground-repeat:repeat-x;background-color:#1963a9\r\n}\r\n\r\n.globalLink  {white-space:nowrap;font-size:9pt;font-family:Arial;color:#ffffff;text-decoration:none}\r\n\r\n.pageLink A:link {color:#2b7c92}\r\n\r\n.copyright {white-space:nowrap;font-family:Arial;font-size:7.5pt;color:#ffffff;text-decoration:none}\r\n\r\n.errorHeader {\r\ncolor:#ed1c24;\r\nfont-family:Arial;\r\nfont-weight:bold;\r\nfont-size:9pt;\r\nvertical-align:middle;\r\nborder-bottom-width:1px;\r\nborder-bottom-style:solid;\r\nborder-bottom-color:#3a5a87;\r\nmargin-bottom:0px;\r\n}\r\n\r\n.errorText {\r\nfont-family:Tahoma,Arial,Helvetica,Geneva,sans-serif;\r\nfont-size:9pt;\r\n}\r\n\r\n</style> \r\n</head>\r\n<body>  \r\n<table style=\"padding-top:10px;\"  class=\"globalheader\" width=\"100%\" border=\"0\" cellspacing=\"0\"  cellpadding=\"0\">\r\n  <tr> <td>&nbsp;&nbsp;<img src=\"/OA_MEDIA/FNDSSCORP.gif\" alt=\"\"> </td></tr>\r\n  <tr>\r\n       ".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n       <td align=\"right\"; style=\"padding-right:5px;padding-bottom:5px\"> <a href= ".toCharArray();
    __oracle_jsp_text[4] = 
    " class=\"globalLink\"> Logout </a></td>\r\n      ".toCharArray();
    __oracle_jsp_text[5] = 
    "\r\n  </tr>\r\n\r\n</table>\r\n<br>\r\n\r\n".toCharArray();
    __oracle_jsp_text[6] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[7] = 
    "   \r\n\r\n<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-left:5px;margin-right:5px\">\r\n\r\n  <tr> <td> <h1 class=\"ErrorHeader\"> Error Page </h1> </td> </tr>\r\n  <tr> <td> Exception Details. </td> </tr>\r\n  <tr> <td> <xmp> ".toCharArray();
    __oracle_jsp_text[8] = 
    " </xmp>\r\n\r\n".toCharArray();
    __oracle_jsp_text[9] = 
    "   \r\n  </td></tr>\r\n</table>\r\n\r\n<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"\r\n      style=\"background-image:url(/OA_HTML/cabo/images/swan/footerBg.gif);\">\r\n<tr>\r\n   <td nowrap align=\"center\">\r\n     <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\r\n       <tr>\r\n         <td><a href=\"/OA_HTML/OALogout.jsp?menu=Y\" class=\"globalLink\">Logout</a></td>\r\n       </tr>\r\n     </table>\r\n    </td>\r\n</tr>\r\n\r\n<tr>\r\n<td>\r\n  <table cellpadding=\"2\" cellspacing=\"2\" border=\"0\" width=\"100%\">\r\n    <tr>\r\n      <td align=\"right\" nowrap width=\"100%\" class=\"copyright\">\r\n         Copyright (c) 2006, Oracle. All rights reserved.\r\n      </td>\r\n    </tr>\r\n   </table>\r\n</td>\r\n</tr>\r\n</table>\r\n\r\n<script>document.body.style.marginLeft=\"0px\";document.body.style.marginRight=\"0px\";document.body.style.marginTop=\"0px\";</script>\r\n\r\n</body>\r\n</html>\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
