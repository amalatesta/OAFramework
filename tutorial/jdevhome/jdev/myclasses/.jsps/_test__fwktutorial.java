
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import oracle.apps.fnd.framework.webui.OAJSPHelper;
import oracle.apps.fnd.framework.webui.URLMgr;
import oracle.apps.fnd.common.WebAppsContext;


public class _test__fwktutorial extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: test_fwktutorial.jsp 115.5 2003/05/05 10:20:28 gmallesh noship $"; 
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
    _test__fwktutorial page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      oracle.apps.fnd.framework.CreateIcxSession sessionBean;
      synchronized (request) {
        if ((sessionBean = (oracle.apps.fnd.framework.CreateIcxSession) pageContext.getAttribute( "sessionBean", PageContext.REQUEST_SCOPE)) == null) {
          sessionBean = (oracle.apps.fnd.framework.CreateIcxSession) new oracle.apps.fnd.framework.CreateIcxSession();
          pageContext.setAttribute( "sessionBean", sessionBean, PageContext.REQUEST_SCOPE);
          out.write(__oracle_jsp_text[2]);
        }
      }
      out.write(__oracle_jsp_text[3]);
      
        response.setHeader("Cache-Control", "no-cache,no-store,max-age=0"); // HTTP 1.1
        response.setHeader("Pragma", "no-cache");                           // HTTP 1.0
        response.setDateHeader("Expires", -1);                              // Prevent caching at the proxy server
      
        //    Obtain the Runtime Connection directly from the Project Settings.
        //    NOTE: This option will not work under Apache/JServ. In order to run under Apache/JServ
        //    you will need to hard code these values as shown in the commented alternatives
        //    below.
      
        String dbcFullPathName     = oracle.apps.fnd.framework.webui.OAJSPHelper.getWebAppContextInitParameter(pageContext, "DBC_FULL_PATH_NAME"); // OAJSPHelper.getWebAppContextInitParameter(pageContext, "DBC_FULL_PATH_NAME");
        String userName            = OAJSPHelper.getWebAppContextInitParameter(pageContext, "OA_LOGIN_USERNAME");
        String userPassword        = OAJSPHelper.getWebAppContextInitParameter(pageContext, "OA_LOGIN_PASSWORD");
        String appShortName        = OAJSPHelper.getWebAppContextInitParameter(pageContext, "OA_RESPONSIBILITY_APPS_SHORT_NAME");
        String responsibilityKey   = OAJSPHelper.getWebAppContextInitParameter(pageContext, "OA_RESPONSIBILITY_KEY");
      
      //  String userName           = "< your user name >";
      //  String userPassword       = "< your password >";
      //  String appShortName       = "AK";
      //  String responsibilityKey  = "FWK_TBX_TUTORIAL";
      
        String sessionid          = sessionBean.createSession(request, response, dbcFullPathName, userName, userPassword, appShortName, responsibilityKey);
        String transactionid      = sessionBean.createTransaction(sessionBean.mRespInfo[0], sessionBean.mRespInfo[1], sessionBean.mRespInfo[2], dbcFullPathName);
        WebAppsContext wctx = sessionBean.getWebAppsContext();
      
      out.write(__oracle_jsp_text[4]);
      out.print(URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_HELLO&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_HELLO&transactionid=" + transactionid, wctx) );
      out.write(__oracle_jsp_text[5]);
      out.print(URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_PO_SEARCH&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_PO_SEARCH&transactionid=" + transactionid, wctx) );
      out.write(__oracle_jsp_text[6]);
      out.print(URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_SUPPLIER_SEARCH&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_SUPPLIER_SEARCH&transactionid=" + transactionid, wctx) );
      out.write(__oracle_jsp_text[7]);
      out.print(URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_PO_SUMMARY_DEL&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_PO_SUMMARY_DEL&transactionid=" + transactionid, wctx) );
      out.write(__oracle_jsp_text[8]);
      out.print(URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_PO_SUMMARY_UP&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_PO_SUMMARY_UP&transactionid=" + transactionid, wctx) );
      out.write(__oracle_jsp_text[9]);
      out.print(URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_PO_SUMMARY_CR&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_PO_SUMMARY_CR&transactionid=" + transactionid, wctx) );
      out.write(__oracle_jsp_text[10]);
      out.print(URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_HOME&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_HOME&transactionid=" + transactionid, wctx) );
      out.write(__oracle_jsp_text[11]);
      out.print(URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_SAMPLE_BROWSE&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_SAMPLE_BROWSE&transactionid=" + transactionid, wctx) );
      out.write(__oracle_jsp_text[12]);

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
  private static final char __oracle_jsp_text[][]=new char[13][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\n\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\n\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\n\n".toCharArray();
    __oracle_jsp_text[4] = 
    "\n\n<HTML>\n<HEAD>\n<title>Test Framework ToolBox Tutorial</title>\n<SCRIPT LANGUAGE=\"JavaScript\" TYPE=\"text/javascript\">\n  document.cookie = \"OADiagnostic=1\";\n  document.cookie = \"OADeveloperMode=1\";\n  document.cookie = \"OAPassivationTestMode=0\";\n  document.cookie = \"OAConnectionTestMode=0\";\n  document.cookie = \"OADumpUIXTree=0\";\n</SCRIPT>\n</HEAD>\n\n<BODY>\n\n<a href=\"".toCharArray();
    __oracle_jsp_text[5] = 
    "\">Hello, World!</a><br>\n<a href=\"".toCharArray();
    __oracle_jsp_text[6] = 
    "\">Search &amp; Drilldown</a><br>\n<a href=\"".toCharArray();
    __oracle_jsp_text[7] = 
    "\">Create (Single Step)</a><br>\n<a href=\"".toCharArray();
    __oracle_jsp_text[8] = 
    "\">Delete From Table</a><br>\n<a href=\"".toCharArray();
    __oracle_jsp_text[9] = 
    "\">Update </a><br>\n<a href=\"".toCharArray();
    __oracle_jsp_text[10] = 
    "\">Create (Multistep)</a><br>\n<a href=\"".toCharArray();
    __oracle_jsp_text[11] = 
    "\">Home Page</a><br>\n<a href=\"".toCharArray();
    __oracle_jsp_text[12] = 
    "\">Sample Library</a><br>\n\n</BODY>\n</HTML>\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
