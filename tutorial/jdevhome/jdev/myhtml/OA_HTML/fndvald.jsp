
<%-- $Header: fndvald.jsp 120.6 2006/09/08 13:57:46 rsantis ship $ --%>
<%@ page language="java" %>
<%
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Pragma", "no-cache");
  response.setDateHeader("Expires", 0);
%>
<jsp:forward page="/AuthenticateUser" />
