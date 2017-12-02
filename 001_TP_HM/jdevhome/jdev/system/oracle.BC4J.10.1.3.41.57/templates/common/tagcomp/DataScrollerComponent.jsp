<%@ page language="java" import = "oracle.jbo.html.*,oracle.jbo.*" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<%-- This JSP component display a toolbar use to navigate through the RowSet
     by scrolling of the datasource range of rows.
     It is called by the DataRecord tag --%>
<%
   // Retrieve all request parameters using our routine to handle multipart encoding type
   RequestParameters params = HtmlServices.getRequestParameters(pageContext);
   String targetURL = params.getParameter("targetURL");
%>
<%-- Restore the data binding to the datasource passed as parameter --%>
<jbo:DataSourceRef id="dsScroll" reference='<%=params.getParameter("datasource")%>'/>

<jsp:useBean id="jboScroller" class="oracle.jbo.html.jsp.datatags.DataScroller" scope="session" />
<% String v1 = "window.self.location.href = '";
   String v2 = "&value=' + this.options[this.selectedIndex].value"; %>

<table class="clsScroller" cellspacing="2" cellpadding="3">
<tr>
<% if (jboScroller.getRangeStart() > 1)
   {
%>  <td><a href="<jbo:UrlEvent targeturlparam='targetURL' event='previousSet' datasource='dsScroll'/>">Previous</a></td><%
   }
   else
   { 
%>  <td>Previous</td><%
   }
%>
<form name="form1" style="margin:0px" method="GET" action="<%=targetURL%>">
<td align="center">
<select onchange="<%=v1%><jbo:UrlEvent targeturlparam='targetURL' event='gotoSet' datasource='dsScroll'/><%=v2%>"
        onfocus="this._lastValue = this.selectedIndex">
<% for (int i=0; i<jboScroller.getSteps(); i++)
   { %>
<option <%=jboScroller.getSelected(i)%> value="<%=jboScroller.getValue(i)%>"><%=jboScroller.getStart(i)%>-<%=jboScroller.getEnd(i)%> of <%=jboScroller.getTotalCount()%></option>
<% } %>
</select>
</td>
</form>
<% if (jboScroller.getLeftOver() > 0)
   {
%>  <td><a href="<jbo:UrlEvent targeturlparam='targetURL' event='nextSet' datasource='dsScroll'/>">Next</a></td><%
   }
   else
   {
%>  <td>Next</td><%
   } %>
</tr>
</table>