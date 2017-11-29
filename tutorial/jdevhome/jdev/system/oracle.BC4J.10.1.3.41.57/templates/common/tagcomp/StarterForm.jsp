<%@ page language="java" errorPage="errorpage.jsp" contentType="text/html;charset={%/PageWizard/charset%}" %>
<%@ taglib uri="/webapp/DataTags.tld" prefix="jbo" %>
<html>
<head>
<META NAME="GENERATOR" CONTENT="Oracle JDeveloper">
<LINK REL=STYLESHEET TYPE="text/css" HREF="bc4j.css">
<TITLE>{|NLS_BROWSE_FORM|}</TITLE>
</head>
<body>
<jbo:ApplicationModule id="{%/PageWizard/AppModuleShortName%}" definition="{%/PageWizard/ClientModelFullName%}" releasemode="Stateful" />
<jbo:DataSource id="ds" appid="{%/PageWizard/AppModuleShortName%}" viewobject="{%/PageWizard/QualifiedViewName%}" rangesize="3"/>


<jbo:ReleasePageResources />
</body>
</html>


