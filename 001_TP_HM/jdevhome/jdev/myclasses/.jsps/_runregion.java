
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import oracle.apps.fnd.framework.webui.OAPageBean;
import java.io.File;
import java.io.PrintWriter;
import java.io.FileWriter;
import java.util.StringTokenizer;
import java.util.Properties;
import java.io.FileInputStream;
import oracle.apps.fnd.framework.webui.URLMgr;
import oracle.apps.fnd.security.HMAC;


public class _runregion extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations


  // ** End Declarations

  public void _jspService(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException {

    response.setContentType( "text/html;charset=windows-1252");
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
    _runregion page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      oracle.apps.fnd.framework.CreateIcxSession sessionBean;
      synchronized (request) {
        if ((sessionBean = (oracle.apps.fnd.framework.CreateIcxSession) pageContext.getAttribute( "sessionBean", PageContext.REQUEST_SCOPE)) == null) {
          sessionBean = (oracle.apps.fnd.framework.CreateIcxSession) new oracle.apps.fnd.framework.CreateIcxSession();
          pageContext.setAttribute( "sessionBean", sessionBean, PageContext.REQUEST_SCOPE);
          out.write(__oracle_jsp_text[1]);
        }
      }
      out.write(__oracle_jsp_text[2]);
      
        long time1 = System.currentTimeMillis();
      
        response.setHeader("Cache-Control", "no-cache");          // HTTP 1.1
        response.setHeader("Pragma", "no-cache");                 // HTTP 1.0
        response.setDateHeader("Expires", -1);                    // Prevent caching at the proxy server
        if (request.getHeader("User-Agent").indexOf("MSIE") >= 0) { 
           // HTTP 1.1.  Only way to force refresh in IE. For Others Bypass
           response.setStatus(HttpServletResponse.SC_RESET_CONTENT); 
        }
      
        ServletContext sc = session.getServletContext();
        String paramFile = sc.getRealPath("/runregion_params.txt");
        Properties urlParams = new Properties();
      
        try 
        {
          FileInputStream inFile = new FileInputStream(paramFile);
          urlParams.load(inFile);
          inFile.close();
          
        } catch (Exception ex) 
        {
          ex.printStackTrace();
        }
        
        //    CHANGE dbcName to your specific values
        //    CHANGE userName to your specific values (Ie vision)
        //    CHANGE userPassword to your specific values (Ie vision98)
        String dbcFullPathName      = application.getInitParameter("DBC_FULL_PATH_NAME");
        String dbcName              = urlParams.getProperty("akDbcFile");
        String userName             = urlParams.getProperty("akUsername");
        String userPassword         = urlParams.getProperty("akPassword");
        String applicationShortName = urlParams.getProperty("akAppShortName");
        String responsibilityKey    = urlParams.getProperty("akRespKey");
        String runOptions1          = urlParams.getProperty("akOpts1");
        String runOptions0          = urlParams.getProperty("akOpts0");
        String urlParam             = urlParams.getProperty("akUrlParam");
        String jradRegion           = urlParams.getProperty("region");
        String jradPage             = urlParams.getProperty("page");
        String xmlFolder            = urlParams.getProperty("JRAD_XML_PATH");
        String jradStartTime        = urlParams.getProperty("JRADStartTime");
      
        if ( jradStartTime != null )
        {
          session.setAttribute("JRADStartTime", jradStartTime);
        }
      
        if (xmlFolder == null || xmlFolder.length() <= 0)
          xmlFolder = "";
        else
        {
          File runOKFile = new File(xmlFolder, "runregion_run.txt");
          try
          {
              PrintWriter pw = new PrintWriter(new FileWriter(runOKFile));
              pw.println("The runregion.jsp is running fine.");
              pw.close();
          }
          catch (Exception e)
          {
          }
          xmlFolder = "&JRAD_XML_PATH=" + xmlFolder;
        }
      
        System.out.println("TIME: runregion: initialization [" + 
                           (System.currentTimeMillis() - time1) + " ms] ");
        time1 = System.currentTimeMillis();
      
        if ( dbcName != null && dbcName.length() > 0 )
        {
          OAPageBean.clearWebBeanCache(session, request);
      
          time1 = System.currentTimeMillis();
          String sessionId  = sessionBean.createSession(request,
                                                    response, 
                                                    dbcFullPathName, 
                                                    userName,
                                                    userPassword,
                                                    applicationShortName,
                                                    responsibilityKey);
          String transactionid = sessionBean.createTransaction(sessionBean.mRespInfo[0],
                                                     sessionBean.mRespInfo[1],
                                                     sessionBean.mRespInfo[2],
                                                     dbcFullPathName);
          HMAC hmac = sessionBean.getMACKey(session);
      
          System.out.println("TIME: runregion: session and transaction creation [" + 
                             (System.currentTimeMillis() - time1) + " ms] ");
          time1 = System.currentTimeMillis();
      
          if ( jradPage != null || jradRegion != null )
          {
            String redirectURL   = response.encodeRedirectURL("OA.jsp");
      
            if ( jradRegion != null )
                redirectURL += "?region=" + jradRegion;
            else if ( jradPage != null )
                redirectURL += "?page=" + jradPage;
      
            redirectURL += "&transactionid=" +
                            transactionid; // + xmlFolder;
      
            if ( urlParam != null && urlParam.length() > 0 )
                redirectURL = redirectURL + urlParam;
      
            // Run Options Cookies
            StringTokenizer tokens = new StringTokenizer(runOptions1, ";", false);
            String          token;
            while ( tokens.hasMoreTokens() )
            {
                token = tokens.nextToken();
                response.addCookie(new Cookie(token, "1"));
            }
            tokens = new StringTokenizer(runOptions0, ";", false);
            while ( tokens.hasMoreTokens() )
            {
                token = tokens.nextToken();
                response.addCookie(new Cookie(token, "0"));
            }
            redirectURL = URLMgr.processOutgoingURL(redirectURL, hmac);
            response.sendRedirect(redirectURL);
          }
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
    "\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n\r\n<HTML>\r\n<HEAD>\r\n<title>Test Page</title>\r\n</HEAD>\r\n\r\n<P>Please wait ...</P>\r\n\r\n</HTML>\r\n\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
