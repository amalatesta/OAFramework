
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import oracle.apps.fnd.framework.webui.OAPageBean;
import oracle.apps.fnd.sso.SSOManager;


public class _OALogout extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: OALogout.jsp 120.24 2005/08/15 09:25:14 atgops1 noship $"; 
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
    _OALogout page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      
        // 02-Jul-02 nbajpai
        // Fix to Enh No 2262230.
        String closeWindow = request.getParameter("closeWindow");
        // Comment out ... variable is not referenced anywhere.  
        // String redirectURL = request.getParameter("startOverURL");
        session.removeValue("CallFromForm"); 
        // Fix for bug 2980017, get translated message from session
        String closeGlobalButtonMsg = 
          (String)session.getValue("CloseGlobalButtonMsg"); 
      
        // Fix for bug 3957341 - When the user clicks on global Logout
        // button, USER-Level profile should take precedence over
        // site level profile. So, use getLogoutUrl which takes 
        // WebAppsContext as param. Since WebAppsContext handle is not 
        // available here, we get the logout url in OAPageLayoutHelper
        // and add it to session.
        String logoutUrl = (String)session.getValue("FWK_ICX_LOGOUT_URL"); 
        session.removeValue("FWK_ICX_LOGOUT_URL");
        //String logoutUrl = (String)session.getAttribute("FWK_ICX_LOGOUT_URL");  
        //session.removeAttribute("FWK_ICX_LOGOUT_URL");
      
      out.write(__oracle_jsp_text[2]);
      
      if (closeWindow != null && closeWindow.equals("true"))
      {
      
      out.write(__oracle_jsp_text[3]);
      out.print( closeGlobalButtonMsg );
      out.write(__oracle_jsp_text[4]);
      
      }
      else
      {
          OAPageBean.invalidateServletSession(session, true /* disableSessionPassivation */);
          if(logoutUrl == null){
              oracle.apps.fnd.common.WebAppsContext ctx = new oracle.apps.fnd.common.WebAppsContext(System.getProperty("JTFDBCFILE"));
                boolean chk = ctx.validateSession(oracle.apps.fnd.framework.webui.OAJSPHelper.getIcxCookie(request, false));
                if(chk){
                      logoutUrl = SSOManager.getLogoutUrl(request,ctx);
                }else{
                      logoutUrl = SSOManager.getLogoutUrl(request);
                }
              ctx.freeWebAppsContext();
          }
          //String logoutUrl = SSOManager.getLogoutUrl(request);
          response.sendRedirect(logoutUrl);
      }
      
      out.write(__oracle_jsp_text[5]);

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
  private static final char __oracle_jsp_text[][]=new char[6][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n\r\n<html>\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n  <head>\r\n    <title>Logout</title>\r\n    <script TYPE=\"text/javascript\">\r\n      if (navigator.userAgent.indexOf(\"MSIE\") != -1)\r\n      {     \r\n         window.close();\r\n         history.back();\r\n      }\r\n      else\r\n      {\r\n        if(confirm(\"".toCharArray();
    __oracle_jsp_text[4] = 
    "\"))\r\n          window.close();\r\n        else\r\n          history.back();  \r\n      }\r\n    </script>\r\n    <noscript> \r\n    <p>This product requires use of a browser that supports JavaScript \r\n       1.2, and the scripting should be enabled in the browser\r\n    </noscript> \r\n\r\n  </head>\r\n  <body></body>\r\n".toCharArray();
    __oracle_jsp_text[5] = 
    "\r\n</html>\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
