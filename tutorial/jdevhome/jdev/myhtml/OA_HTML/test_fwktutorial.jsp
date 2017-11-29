<%@ page
  language    = "java"
  errorPage   = "OAErrorPage.jsp"
  contentType = "text/html"  
  import      = "oracle.apps.fnd.framework.webui.OAJSPHelper, 
                 oracle.apps.fnd.framework.webui.URLMgr, 
                 oracle.apps.fnd.common.WebAppsContext"
%>

<%! public static final String RCS_ID = "$Header: test_fwktutorial.jsp 115.5 2003/05/05 10:20:28 gmallesh noship $"; %>

<jsp:useBean
  id          = "sessionBean"
  class       = "oracle.apps.fnd.framework.CreateIcxSession"
  scope       = "request">
</jsp:useBean>

<%
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
%>

<HTML>
<HEAD>
<title>Test Framework ToolBox Tutorial</title>
<SCRIPT LANGUAGE="JavaScript" TYPE="text/javascript">
  document.cookie = "OADiagnostic=1";
  document.cookie = "OADeveloperMode=1";
  document.cookie = "OAPassivationTestMode=0";
  document.cookie = "OAConnectionTestMode=0";
  document.cookie = "OADumpUIXTree=0";
</SCRIPT>
</HEAD>

<BODY>

<a href="<%=URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_HELLO&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_HELLO&transactionid=" + transactionid, wctx) %>">Hello, World!</a><br>
<a href="<%=URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_PO_SEARCH&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_PO_SEARCH&transactionid=" + transactionid, wctx) %>">Search &amp; Drilldown</a><br>
<a href="<%=URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_SUPPLIER_SEARCH&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_SUPPLIER_SEARCH&transactionid=" + transactionid, wctx) %>">Create (Single Step)</a><br>
<a href="<%=URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_PO_SUMMARY_DEL&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_PO_SUMMARY_DEL&transactionid=" + transactionid, wctx) %>">Delete From Table</a><br>
<a href="<%=URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_PO_SUMMARY_UP&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_PO_SUMMARY_UP&transactionid=" + transactionid, wctx) %>">Update </a><br>
<a href="<%=URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_PO_SUMMARY_CR&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_PO_SUMMARY_CR&transactionid=" + transactionid, wctx) %>">Create (Multistep)</a><br>
<a href="<%=URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_HOME&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_HOME&transactionid=" + transactionid, wctx) %>">Home Page</a><br>
<a href="<%=URLMgr.processOutgoingURL("OA.jsp?OAFunc=FWK_TOOLBOX_SAMPLE_BROWSE&OAPB=FWK_TOOLBOX_BRAND&OAHP=FWK_TOOLBOX_TUTORIAL_APP&OASF=FWK_TOOLBOX_SAMPLE_BROWSE&transactionid=" + transactionid, wctx) %>">Sample Library</a><br>

</BODY>
</HTML>
