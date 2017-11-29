<%-- $Header: AppsLocalLogin.jsp 120.9 2006/09/28 00:22:57 scheruku ship $ --%>

<%@ page import='oracle.apps.fnd.sso.SessionMgr'%>
<%@ page import='oracle.apps.fnd.sso.SSOUtil'%>
<%@ page import='oracle.apps.fnd.common.WebAppsContext'%>
<%@ page import='oracle.apps.fnd.common.LangInfo'%>
<%@ page import='oracle.apps.fnd.sso.Utils'%>
<%@ page import='oracle.apps.fnd.login.LoginPage'%>
<%@ page import='oracle.apps.fnd.util.URLEncoder'%>
<%@ page import='java.util.Enumeration'%>
<%@ page import='java.sql.Connection'%>
<%@ page session="false" %>

<%
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
%>


