<%@ page contentType="text/html;charset=windows-1252"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>untitled</title>
</head>
<body>
<%
   oracle.jbo.html.jsp.graph.GraphTag.generateImage(session, 
					request, response);
%>
</body>
</html>
