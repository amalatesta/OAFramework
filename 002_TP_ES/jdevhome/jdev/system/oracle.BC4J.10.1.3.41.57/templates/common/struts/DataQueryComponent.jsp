<%@ page language="java" import="oracle.jbo.html.*, org.apache.struts.util.RequestUtils" %>
<%@ taglib uri="/webapp/DataTags.tld" prefix="jbo" %>
<%@ taglib uri="/WEB-INF/struts-html.tld" prefix="html" %>
<%@ taglib uri="/WEB-INF/struts-bean.tld" prefix="bean" %>

<%-- This JSP component build query form to edit and process view criteria 
     on a bound datasource.
     It is called by the DataQuery tag --%>
<%
   String dsParam = request.getParameter("datasource");
   String amId = dsParam.substring(0, dsParam.indexOf('.'));
   BC4JContext bc4jContext = (BC4JContext) request.getAttribute(BC4JContext.ContextAttrName);

   String addEvent = RequestUtils.message(pageContext, null, null, "DataQuery.addCriteria"); 
   String deleteEvent = RequestUtils.message(pageContext, null, null, "DataQuery.removeCriteria"); 

   int index = 0;
   boolean addCriteria = false;
%>
<%-- Restore the data binding to the datasource passed as parameter --%>
<jbo:ViewObject id="voQuery" name="<%=dsParam%>"/>

<jbo:OnEvent name="<%=addEvent%>" >
   <% addCriteria = true; %>
</jbo:OnEvent>

<%-- Build a form with the current set of criterias --%>
<form name="<%=dsParam%>_Query" action="query.do" method="get">
<table cellspacing="0" cellpadding="1" border="1">
<tr>
<%-- Iterate through all the row criteria inside a ViewCriteria --%>
<jbo:ViewCriteriaIterate datasource="<%=dsParam%>" ><%
   if (index > 0)
   {
%><td>OR</td><%
   } %>
<td>
   <table border="0" cellspacing="1" cellpadding="1">
   <%-- Iterate through all the attributes of the current ViewCriteriaRow and display
        the name of the attribute followed by a field with the value of the criteria
        for this attribute --%>
   <jbo:AttributeIterate id="df1" datasource="<%=dsParam%>" queriableonly="true">
      <tr><%
      String critName = "row" + index + "_" + df1.getName();
      if (index == 0)
      {
%>      <td align="right" title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>"><jbo:ShowHint hintname="LABEL"></jbo:ShowHint></td><%
      }
%>      <td><input type="text" name="<%= critName %>" value="<jbo:ShowCriteria></jbo:ShowCriteria>" ></td>
      </tr>
   </jbo:AttributeIterate><%
   String extra = "&index=" + index; %>
   <tr><td colspan="2" align="right"><a href="<jbo:UrlEvent targeturlparam='targetURL' event='<%=deleteEvent%>' datasource='<%=dsParam%>' extraparameters='<%=extra%>' />"><bean:message key="DataQuery.removeCriteria" /></a></td></tr>
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
   <jbo:AttributeIterate id="df2" datasource="<%=dsParam%>" queriableonly="true">
      <tr>
<%    String critName = "row" + index + "_" + df2.getName();

      if (index == 0)
      {
%>        <td align="right" title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>"><jbo:ShowHint hintname="LABEL"></jbo:ShowHint></td><%
      }
%>        <td><input type="text" name="<%= critName %>" ></td>
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
<input type="hidden" name="jboEventVo" value="<%=voQuery.getFullName()%>" >
<html:submit property="jboEvent">
   <bean:message key="DataQuery.search"/>
</html:submit>
<html:submit property="jboEvent">
   <bean:message key="DataQuery.addCriteria"/>
</html:submit>
<html:submit property="jboEvent">
   <bean:message key="DataQuery.clearAll"/>
</html:submit>
<input type="hidden" name="nRows" value="<%=index+1%>">
<input type="hidden" name="currentPath" value="<%=bc4jContext.getCurrentPath()%>">
<input type="hidden" name="amId" value="<%=amId%>">
</form>
