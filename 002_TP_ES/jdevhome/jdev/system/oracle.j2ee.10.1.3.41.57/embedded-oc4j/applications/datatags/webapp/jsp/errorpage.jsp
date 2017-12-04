<%@ page language = "java" isErrorPage="true" import = "java.util.*, oracle.jbo.*, oracle.jdeveloper.html.*, oracle.jbo.html.databeans.*" %>
<html>
<head>
<META NAME="GENERATOR" CONTENT="Oracle JDeveloper">
<LINK REL=STYLESHEET TYPE="text/css" HREF="<%=session.getValue("CSSURL")%>">
</head>
<body>

<center><h2>Application Error</h2></center>
<div CLASS="errorText">
Error Message: <%= exception.getMessage() %>
<BR>
<%
if (exception instanceof oracle.jbo.JboException)
{
	oracle.jbo.JboException ex2 = (oracle.jbo.JboException)exception;
        
    Object[] details = ex2.getDetails();

    for (int i = 0; i < details.length; i++)
    {
		Object detail = details[i];

        Exception e = (Exception) detail;

        out.println("<H3>&nbsp;&nbsp;&nbsp;&nbsp;Error Message: "+ e.getLocalizedMessage() + "</H3><BR>");
    }
}
%>
</div>
</body>
</html>
