<%@ page language="java" import = "oracle.jbo.html.*" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<%-- This JSP component display a rowset navigation bar.
     It is called by the DataNavigate tag --%>
<%
   // Retrieve all request parameters using our routine to handle multipart encoding type
   RequestParameters params = HtmlServices.getRequestParameters(pageContext);
   String dsParam = params.getParameter("datasource");
%>
<%-- Restore the data binding to the datasource passed as parameter --%>
<jbo:DataSourceRef id="dsNav" reference="<%=dsParam%>"/>

<%-- Display a toolbar with 4 square buttons for the action First, Previous, Next, and Last --%>
<table class="clsToolBar" cellspacing="1" cellpadding="5" border="0">
<tr>
<%-- Button "First" --%>
<td class="clsToolBarButton"><a href="<jbo:UrlEvent targeturlparam='targetURL' event='First' datasource='dsNav'/>">First</a></td>
<%-- Button "Previous"
     The button is enabled depending on the state of the currency on the RowSet--%>
<td class="clsToolBarButton"><%
   if (dsNav.getRowSet().hasPrevious())
   {
%><a href="<jbo:UrlEvent targeturlparam='targetURL' event='Previous' datasource='dsNav'/>">Previous</a><%
   }
   else
   {
%>Previous<%
   } %></td>
<%-- Button "Next"
     The button is enabled depending on the state of the currency on the RowSet--%>
<td class="clsToolBarButton"><% if (dsNav.getRowSet().hasNext())
   {
%><a href="<jbo:UrlEvent targeturlparam='targetURL' event='Next' datasource='dsNav'/>">Next</a><%
   }
   else
   {
%>Next<%
   } %></td>
<%-- Button "Last" --%>
<td class="clsToolBarButton"><a href="<jbo:UrlEvent targeturlparam='targetURL' event='Last' datasource='dsNav'/>">Last</a></td>
</tr>
</table>
