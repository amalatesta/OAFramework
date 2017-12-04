<%@ page language = "java" errorPage="errorpage.jsp" import = "java.util.*, oracle.jbo.*, javax.naming.*, oracle.jdeveloper.html.*, oracle.jbo.html.databeans.*" contentType="text/html;charset=WINDOWS-1252" %>

<HTML>
<link rel="stylesheet" type="text/css" href="/webapp/cabo/images/cabo_styles.css">
<BODY class=APPSWINDOW onSelectStart="return false;">
<script language=javascript>
if (top.<%=request.getParameter("tc")%>) top.<%=request.getParameter("tc")%>.renderbottom(window);
else top.panelbottom.render(window);
</script>

<!--table to contain the navigation buttons-->
<table width=100% cellpadding=3 cellspacing=0 border=0>
<tr><td align=right>

<jsp:useBean id="cancel" class="oracle.jdeveloper.jsp.wb.JSButton" scope="request">
<%
   cancel.initialize(pageContext);

   DHTMLButtonElement button = new DHTMLButtonElement("cancelbutton");
   button.setText("Cancel");
   button.setShape("RR");
   button.setActionType(DHTMLButtonElement.atFunction);
   button.setAction("history.go(-1)");
   button.setTargetFrame("_top");
   button.setGap("wide");

   cancel.setButton(button);
   cancel.render();
%>
</jsp:useBean>

</td></tr></table>



</BODY>
</HTML>

