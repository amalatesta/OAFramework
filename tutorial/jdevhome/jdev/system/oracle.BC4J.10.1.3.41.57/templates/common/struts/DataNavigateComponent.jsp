<%@ page language="java" import = "oracle.jbo.html.*" %>
<%@ taglib uri="/webapp/DataTags.tld" prefix="jbo" %>
<%@ taglib uri="/WEB-INF/struts-bean.tld" prefix="bean" %>

<%-- This JSP component display a rowset navigation bar.
     It is called by the DataNavigate tag --%>
<%
   String dsParam = request.getParameter("datasource");
%>
<jbo:ViewObject id="voNav" name="<%=dsParam%>" />
<% if (voNav.getCurrentRow() == null)
   { %>
<jbo:RowsetNavigate datasource="<%=dsParam%>" action="First"/>
<% } %>


<%-- Display a toolbar with 4 square buttons for the action First, Previous, Next, and Last --%>
<table class="clsToolBar" cellspacing="1" cellpadding="5" border="0">
<tr>
<%-- Button "First" --%>
<td class="clsToolBarButton"><a href="<jbo:UrlEvent targeturlparam='targetURL' event='first' datasource='<%=dsParam%>' />"><bean:message key="DataNavigate.first" /></a></td>
<%-- Button "Previous"
     The button is enabled depending on the state of the currency on the RowSet--%>
<td class="clsToolBarButton"><%
   if (voNav.hasPrevious())
   {
%><a href="<jbo:UrlEvent targeturlparam='targetURL' event='previous' datasource='<%=dsParam%>' />"><bean:message key="DataNavigate.previous" /></a><%
   }
   else
   {
%><bean:message key="DataNavigate.previous" /><%
   } %></td>
<%-- Button "Next"
     The button is enabled depending on the state of the currency on the RowSet--%>
<td class="clsToolBarButton"><% if (voNav.hasNext())
   {
%><a href="<jbo:UrlEvent targeturlparam='targetURL' event='next' datasource='<%=dsParam%>' />"><bean:message key="DataNavigate.next" /></a><%
   }
   else
   {
%><bean:message key="DataNavigate.next" /><%
   } %></td>
<%-- Button "Last" --%>
<td class="clsToolBarButton"><a href="<jbo:UrlEvent targeturlparam='targetURL' event='last' datasource='<%=dsParam%>' />"><bean:message key="DataNavigate.last" /></a></td>
</tr>
</table>
