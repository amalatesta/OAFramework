
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.io.File;
import java.util.Properties;
import java.io.FileInputStream;
import oracle.apps.fnd.framework.webui.OAJSPHelper;
import oracle.apps.fnd.framework.webui.URLMgr;
import oracle.apps.fnd.security.HMAC;


public class _OASvcTester extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: OASvcTester.jsp 115.0 2003/05/05 10:19:10 vapuri noship $"; 
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
    _OASvcTester page = this;
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
      
        // Read the runtime params from OASvcTesterParams.txt
        
        ServletContext sc = session.getServletContext();
        String paramFile = sc.getRealPath("/OASvcTesterParams.txt");
        Properties svcTestParams = new Properties();
      
        try 
        {
          FileInputStream inFile = new FileInputStream(paramFile);
          svcTestParams.load(inFile);
          inFile.close();
          
        } catch (Exception ex) 
        {
          ex.printStackTrace();
        }  
      
        String testFileName         = svcTestParams.getProperty("testFileName");
        String serviceBeanName      = svcTestParams.getProperty("serviceBeanName");
        String action               = svcTestParams.getProperty("action");
      
      /*
        Here are the valid values for action (Bug 4128841): 
          AddTstScrptJprCmd 
          AddTstScrptSvcCmd 
          EdtTstScrptXmlCmd 
          RunTstScrptXmlCmd 
          DbgTstScrptXmlCmd 
      
          From the point of view of the Testing Framework UI, it needs to distinguish
          between the three types of actions: 
          1. Edit action (Since Create, Delete always happens from the IDE)
          2. Run action
          3. Debug action
      */
        String testAction = "Edit"; // This is the default
      
        action = action.substring(0,3);
        if (action.equals("Run"))
          testAction = "Run";
        else if (action.equals("Dbg"))
          testAction = "Debug";
      
        //    Obtain the Runtime Connection directly from the Project Settings.
        //    NOTE: This option will not work under Apache/JServ. In order to run under Apache/JServ
        //    you will need to hard code these values as shown in the commented alternatives
        //    below.
      
        String dbcFullPathName     = OAJSPHelper.getWebAppContextInitParameter(pageContext, "DBC_FULL_PATH_NAME");
        String userName            = OAJSPHelper.getWebAppContextInitParameter(pageContext, "OA_LOGIN_USERNAME");
        String userPassword        = OAJSPHelper.getWebAppContextInitParameter(pageContext, "OA_LOGIN_PASSWORD");
        String appShortName        = OAJSPHelper.getWebAppContextInitParameter(pageContext, "OA_RESPONSIBILITY_APPS_SHORT_NAME");
        String responsibilityKey   = OAJSPHelper.getWebAppContextInitParameter(pageContext, "OA_RESPONSIBILITY_KEY");
      
        String sessionid          = sessionBean.createSession(request, response, dbcFullPathName, userName, userPassword, appShortName, responsibilityKey);
        String transactionid      = sessionBean.createTransaction(sessionBean.mRespInfo[0], sessionBean.mRespInfo[1], sessionBean.mRespInfo[2], dbcFullPathName);
        HMAC macKey = sessionBean.getMACKey(session);
      
        String redirectURL   = response.encodeRedirectURL("OA.jsp");
        String jradPage      = "/oracle/apps/fnd/framework/svctester/webui/TesterSummaryPG";
        redirectURL += "?page=" + jradPage;
        redirectURL += "&transactionid=" + transactionid; // + xmlFolder;
        redirectURL += "&fileName=" + testFileName;  
        redirectURL += "&testAction=" + testAction;    
        if (serviceBeanName!=null)
          redirectURL += "&serviceBeanName=" + serviceBeanName;
        if ("Edit".equals(testAction))
          redirectURL += "&addBreadCrumb=Y";
        
        redirectURL = URLMgr.processOutgoingURL(redirectURL, macKey);
        response.sendRedirect(redirectURL);
        
      
      out.write(__oracle_jsp_text[4]);

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
  private static final char __oracle_jsp_text[][]=new char[5][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[4] = 
    "\r\n\r\n<HTML>\r\n<HEAD>\r\n<title>Service Testing Framework</title>\r\n</HEAD>\r\n\r\n<BODY>\r\n<P>Launching Service Testing Framework ...</P>\r\n</BODY>\r\n</HTML>\r\n\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
