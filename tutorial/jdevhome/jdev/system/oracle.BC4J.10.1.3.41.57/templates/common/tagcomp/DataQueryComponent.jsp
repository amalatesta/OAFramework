<%@ page language="java" import = "oracle.jbo.html.*" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<%-- This JSP component build query form to edit and process view criteria 
     on a bound datasource.
     It is called by the DataQuery tag --%>
<%
   // Retrieve all request parameters using our routine to handle multipart encoding type
   RequestParameters params = HtmlServices.getRequestParameters(pageContext);
   
   String dsParam = params.getParameter("datasource");
   String targetParam = params.getParameter("targetURL");
   int index = 0;
   boolean addCriteria = false;
%>
<%-- Restore the data binding to the datasource passed as parameter --%>
<jbo:DataSourceRef id="dsQuery" reference="<%=dsParam%>"/>
<% String voName = dsQuery.getViewObjectName(); %>

<jbo:OnEvent name="Add Criteria" >
   <% addCriteria = true; %>
</jbo:OnEvent>

<%-- Build a form with the current set of criterias --%>
<form name="<%=dsParam%>_Query" action="<%=targetParam%>" method="get">
<table cellspacing="0" cellpadding="1" border="1">
<tr>
<%-- Iterate through all the row criteria inside a ViewCriteria --%>
<jbo:ViewCriteriaIterate datasource="dsQuery" ><%
   if (index > 0)
   {
%><td>OR</td><%
   } %>
<td>
   <table border="0" cellspacing="1" cellpadding="1">
   <%-- Iterate through all the attributes of the current ViewCriteriaRow and display
        the name of the attribute followed by a field with the value of the criteria
        for this attribute --%>
   <jbo:AttributeIterate id="df1" datasource="dsQuery" queriableonly="true">
      <tr><%
      String critName = "row" + index + "_" + df1.getName();
      if (index == 0)
      {
%>      <td align="right" title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>"><jbo:ShowHint hintname="LABEL"></jbo:ShowHint></td><%
      }
%>      <td><input type="text" name="<%= critName %>" value="<jbo:ShowCriteria></jbo:ShowCriteria>" ></td>
      </tr>
   </jbo:AttributeIterate>
   <tr><td colspan="2" align="right"><a href="<jbo:UrlEvent targeturlparam='targetURL' event='Del Criteria' datasource='dsQuery' extraparameters='<%="index=" + index%>' />">Delete</a></td></tr>
   </table>
   </td>
   <% index++; %>
</jbo:ViewCriteriaIterate>
<%-- When no Criteria has been defined yet or when the "Add Criteria" event
     has been issued, generate an empty set of attribute nmae and empty field  --%>
<% if (index == 0 || addCriteria)
  { 
    if (index > 0)
    {
%><td>OR</td><%
    } %>
   <td>
   <table border="0" cellspacing="1" cellpadding="1">
   <jbo:AttributeIterate id="df2" datasource="dsQuery" queriableonly="true">
      <tr>
<%    String critName = "row" + index + "_" + df2.getName();
      if (index == 0)
      {
%>        <td align="right" title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>"><jbo:ShowHint hintname="LABEL"></jbo:ShowHint></td><%
      }
%>        <td><input type="text" name="<%= critName %>"></td>
      </tr>
   </jbo:AttributeIterate>
<%    if (index > 0)
      {
%>      <tr><td colspan="2" align="right">&nbsp;</td></tr><%
      } %>
   </table>
</td><%
  } %>
</tr>
</table>
<%-- Instead of using FormEvent tag, individualy add the form fields --%>
<input type="hidden" name="jboEventVo" value="<%=voName%>" >
<input type="submit" name="jboEvent" value="Search">
<input type="submit" name="jboEvent" value="Add Criteria">
<input type="submit" name="jboEvent" value="Clear All">
<input type="hidden" name="nRows" value="<%=index+1%>">
</form>




