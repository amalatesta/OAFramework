
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
    "\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\n".toCharArray();
    __oracle_jsp_text[2] = 
    " \n<html lang=\"en-US\">\n<head>\n  <title>Error Details</title>\n<style type=\"text/css\">\n\n.globalHeader {\nbackground: url(/OA_HTML/cabo/images/swan/headerBg.jpg);\nbackground-repeat:repeat-x;background-color:#1963a9\n}\n\n.globalLink  {white-space:nowrap;font-size:9pt;font-family:Arial;color:#ffffff;text-decoration:none}\n\n.pageLink A:link {color:#2b7c92}\n\n.copyright {white-space:nowrap;font-family:Arial;font-size:7.5pt;color:#ffffff;text-decoration:none}\n\n.errorHeader {\ncolor:#ed1c24;\nfont-family:Arial;\nfont-weight:bold;\nfont-size:9pt;\nvertical-align:middle;\nborder-bottom-width:1px;\nborder-bottom-style:solid;\nborder-bottom-color:#3a5a87;\nmargin-bottom:0px;\n}\n\n.errorText {\nfont-family:Tahoma,Arial,Helvetica,Geneva,sans-serif;\nfont-size:9pt;\n}\n\n</style> \n</head>\n<body>  \n<table style=\"padding-top:10px;\"  class=\"globalheader\" width=\"100%\" border=\"0\" cellspacing=\"0\"  cellpadding=\"0\">\n  <tr> <td>&nbsp;&nbsp;<img src=\"/OA_MEDIA/FNDSSCORP.gif\" alt=\"\"> </td></tr>\n  <tr>\n       ".toCharArray();
    __oracle_jsp_text[3] = 
    "\n       <td align=\"right\"; style=\"padding-right:5px;padding-bottom:5px\"> <a href= ".toCharArray();
    __oracle_jsp_text[4] = 
    " class=\"globalLink\"> Logout </a></td>\n      ".toCharArray();
    __oracle_jsp_text[5] = 
    "\n  </tr>\n\n</table>\n<br>\n\n".toCharArray();
    __oracle_jsp_text[6] = 
    "\n".toCharArray();
    __oracle_jsp_text[7] = 
    "   \n\n<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-left:5px;margin-right:5px\">\n\n  <tr> <td> <h1 class=\"ErrorHeader\"> Error Page </h1> </td> </tr>\n  <tr> <td> Exception Details. </td> </tr>\n  <tr> <td> <xmp> ".toCharArray();
    __oracle_jsp_text[8] = 
    " </xmp>\n\n".toCharArray();
    __oracle_jsp_text[9] = 
    "   \n  </td></tr>\n</table>\n\n<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\"\n      style=\"background-image:url(/OA_HTML/cabo/images/swan/footerBg.gif);\">\n<tr>\n   <td nowrap align=\"center\">\n     <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n       <tr>\n         <td><a href=\"/OA_HTML/OALogout.jsp?menu=Y\" class=\"globalLink\">Logout</a></td>\n       </tr>\n     </table>\n    </td>\n</tr>\n\n<tr>\n<td>\n  <table cellpadding=\"2\" cellspacing=\"2\" border=\"0\" width=\"100%\">\n    <tr>\n      <td align=\"right\" nowrap width=\"100%\" class=\"copyright\">\n         Copyright (c) 2006, Oracle. All rights reserved.\n      </td>\n    </tr>\n   </table>\n</td>\n</tr>\n</table>\n\n<script>document.body.style.marginLeft=\"0px\";document.body.style.marginRight=\"0px\";document.body.style.marginTop=\"0px\";</script>\n\n</body>\n</html>\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
