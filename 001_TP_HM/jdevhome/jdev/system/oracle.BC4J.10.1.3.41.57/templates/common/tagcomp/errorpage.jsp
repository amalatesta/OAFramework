<%@ page language = "java" isErrorPage="true" import = "java.util.*, java.io.*, oracle.jbo.*, oracle.jdeveloper.html.*, oracle.jbo.html.databeans.*" contentType="text/html;charset={%/PageWizard/charset%}" %>
<html>
<head>
<META NAME="GENERATOR" CONTENT="Oracle JDeveloper">
<TITLE>{|NLS_ERROR_TITLE|}</TITLE>
</head>
<body>

<center><H2>{|NLS_ERROR_APPERROR|}</H2></center>

<a href="javascript:history.go(-1)" >{|NLS_ERROR_RETURN|}</a>

<div CLASS="errorText">
{|NLS_ERROR_MESSAGE|} <%= exception.getMessage() %>
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
%><H3>&nbsp;&nbsp;&nbsp;&nbsp;{|NLS_ERROR_MESSAGE|} <%=e.getLocalizedMessage()%></H3>
<BR><%
      }
   } %>
<%-- Un-comment the following lines to display the stack trace
<PRE><%
      StringWriter writer = new StringWriter();
      PrintWriter prn = new PrintWriter(writer);

      exception.printStackTrace(prn);
      prn.flush();

      out.print(writer.toString()); %>
</PRE>
--%>
</div>
</body>
</html>
