
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import oracle.apps.fnd.sso.SessionMgr;
import oracle.apps.fnd.sso.SSOUtil;
import oracle.apps.fnd.common.WebAppsContext;
import oracle.apps.fnd.common.LangInfo;
import oracle.apps.fnd.sso.Utils;
import oracle.apps.fnd.login.LoginPage;
import oracle.apps.fnd.util.URLEncoder;
import java.util.Enumeration;
import java.sql.Connection;


public class _AppsLocalLogin extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations


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
    PageContext pageContext = JspFactory.getDefaultFactory().getPageContext( this, request, response, null, false, JspWriter.DEFAULT_BUFFER, true);
    // Note: session is false, so no session variable is defined.
    int __jsp_tag_starteval;
    ServletContext application = pageContext.getServletContext();
    JspWriter out = pageContext.getOut();
    _AppsLocalLogin page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      out.write(__oracle_jsp_text[2]);
      out.write(__oracle_jsp_text[3]);
      out.write(__oracle_jsp_text[4]);
      out.write(__oracle_jsp_text[5]);
      out.write(__oracle_jsp_text[6]);
      out.write(__oracle_jsp_text[7]);
      out.write(__oracle_jsp_text[8]);
      out.write(__oracle_jsp_text[9]);
      out.write(__oracle_jsp_text[10]);
      
        Utils.setRequestCharacterEncoding(request);
        String requestUrl = request.getParameter("requestUrl");
        
         WebAppsContext wctx = null;
         boolean alreadySet = false;
         
         Connection conn = null;
         if (Utils.isAppsContextAvailable()) {
           wctx = Utils.getAppsContext();
           alreadySet = true;
        } else {
           wctx = Utils.getAppsContext();
        }
        try {
              String params;
              StringBuffer tmp = new StringBuffer();
              tmp.append("requestUrl=");
              if( requestUrl != null && !requestUrl.equals(""))
               tmp.append(URLEncoder.encode(requestUrl,SessionMgr.getCharSet()));
              
              Enumeration paramNames = request.getParameterNames();
              while (paramNames != null && paramNames.hasMoreElements()) {
                String name = (String) paramNames.nextElement();
                if (!(name.equals("requestUrl")))
                {
                  String value = request.getParameter(name);
                  tmp.append("&");
                  tmp.append(oracle.apps.fnd.util.URLEncoder.encode(name,SessionMgr.getCharSet()));
                  tmp.append("=");
                  tmp.append(oracle.apps.fnd.util.URLEncoder.encode(value,SessionMgr.getCharSet()));
                }
              }        
              
              
              conn = Utils.getConnection();
              boolean getIcxLang = false;
              String langCode = request.getParameter("langCode");
              String sessionLang = null;
              if ( langCode != null)
              {
                  // This is from language selection bean
                  if (SessionMgr.isInstalledLanguage(langCode))
                  {
                      sessionLang = langCode;
                      Utils.writeToLog("sso/html", "Language: "+langCode+" is installed", wctx);
                  }
                  else
                  {
                      getIcxLang = true;
                      Utils.writeToLog("sso/html", "Language: "+langCode+" is not installed in apps", wctx);
                  }
             
              }
              else
              {
                  // try getting language from browser
                  Utils.writeToLog("sso/html", "trying to get browser's Language", wctx);
      
                  String browserLanguages = request.getHeader("Accept-Language");
                  Utils.writeToLog("sso/html", "Browser Language:"+browserLanguages, wctx);
            
                  sessionLang = LoginPage.getAppsLangFromBrowser(browserLanguages, wctx);
                  getIcxLang = (sessionLang == null || sessionLang.equals(""));
              }
              
              String cval = SessionMgr.getAppsCookie(request); 
              String pNlsLanguage = null;
              if(cval!= null && !cval.equals("-1") && !cval.equals("") )
              { 
              
                  Utils.writeToLog("sso/html", "Session exists:: "+cval+" setting lang :: "+langCode, wctx); 
                  LangInfo info = wctx.getLangInfo(sessionLang , null, conn);
                  pNlsLanguage = info.getNLSLanguage();
                  wctx.validateSession(cval); 
                  boolean check = wctx.setLanguageContext(pNlsLanguage, null, null, null, null, null, null); 
              } else {
                      SessionMgr.createGuestSession(request, response, false, sessionLang);
              }
      
              String returnUrl = SSOUtil.getLocalLoginRFUrl(tmp.toString());
              response.sendRedirect(returnUrl );
        } 
        catch(Exception e)
        {
         Utils.writeToLog("sso/html", "Exception occurred"+e.toString(), wctx); 
         throw new Exception(e.toString());
        }
        finally {
                if (alreadySet == false) {
                       Utils.releaseAppsContext();
                }
        }
      
      out.write(__oracle_jsp_text[11]);

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
  private static final char __oracle_jsp_text[][]=new char[12][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[4] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[5] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[6] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[7] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[8] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[9] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[10] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[11] = 
    "\r\n\r\n\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
