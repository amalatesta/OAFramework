<%@ page language = "java" errorPage="errorpage.jsp" import = "java.util.*, oracle.jbo.*, javax.naming.*, oracle.jdeveloper.html.*, oracle.jbo.html.databeans.*" contentType="text/html;charset=WINDOWS-1252"%>

<html>
<body>
<br>

<jsp:useBean id="ChartGenerator" class="oracle.jbo.html.databeans.ChartRenderer" 
            scope="request">
<%
	ChartGenerator.init(pageContext);

	ChartGenerator.execute(); 
    
%>

</jsp:useBean>

</body>
</html>


