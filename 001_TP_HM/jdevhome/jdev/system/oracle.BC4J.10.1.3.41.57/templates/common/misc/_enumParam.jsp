<%
   java.util.Enumeration names = request.getParameterNames();
   if (!names.hasMoreElements())
   {%>
no parameter
<% }
   for (; names.hasMoreElements();)
   {
      String name = (String) names.nextElement();%>
(<%=name%>=<%=request.getParameter(name)%>), <%
   }
%>
<br>


