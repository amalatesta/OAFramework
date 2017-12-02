<%@ page language = "java" errorPage="errorpage.jsp" import = "java.util.*, oracle.jbo.*, javax.naming.*, oracle.jdeveloper.html.*, oracle.jbo.html.databeans.*" contentType="text/html;charset=WINDOWS-1252" %>

<HTML>
<link rel="stylesheet" type="text/css" href="/webapp/cabo/images/cabo_styles.css">
<BODY class=APPSWINDOW link=blue vlink=blue alink=#ff0000 onSelectStart="return false;">
<script language=javascript>
top.<%=request.getParameter("tc")%>.render(window);
</script>
</BODY>
</HTML>

