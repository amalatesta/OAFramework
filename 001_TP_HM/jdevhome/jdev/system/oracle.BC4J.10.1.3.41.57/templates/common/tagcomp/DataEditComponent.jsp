<%@ page language="java" import = "oracle.jbo.html.*" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<%-- This JSP component build an edit form for a single record and
     generates an update submit event.
     It is called by the DataEdit tag --%>
<%
   // Retrieve all request parameters using our routine to handle multipart encoding type
   RequestParameters params = HtmlServices.getRequestParameters(pageContext);
 
   String dsParam = params.getParameter("datasource");
   String formName = dsParam + "_form";
   String rowAction = "Current";
   String event = "Update";
%>
<%-- Restore the data binding to the datasource passed as parameter --%>
<jbo:DataSourceRef id="dsEdit" reference="<%=dsParam%>" />

<%-- Select the way to retrieve the row to edit based on the event --%>
<jbo:OnEvent name="edit" datasource="dsEdit">
   <% rowAction = "Get"; %>
</jbo:OnEvent>

<jbo:OnEvent name="create" datasource="dsEdit">
   <% rowAction = "CreateOnly"; event = "Create"; %>
</jbo:OnEvent>

<%-- Build a form with an editable field for each of the attributes of the row --%>
<form name="<%=formName%>" action="<%=params.getParameter("targetURL")%>" enctype="<%=params.getParameter("encType")%>" method="POST">
<%-- Retrieve the row to edit --%>
<jbo:Row id="rowEdit" datasource="dsEdit" rowkeyparam="jboRowKey" action="<%=rowAction%>">
   <table border="0">
   <%-- Iterate through all the Attribute of the row --%>
   <jbo:AttributeIterate id="def" datasource="dsEdit">
      <tr>
         <td title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>" align="right"><jbo:ShowHint hintname="LABEL"></jbo:ShowHint><%
         // Mark all the mandatory attributes with '*'  
         if (def.isMandatory())
         {
        %>*<%
         } %>
         </td>
         <td title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>"><jbo:InputRender datasource="dsEdit" formname="<%=formName%>" />
         </td>
      </tr>
   </jbo:AttributeIterate>
   </table>
   <%-- Generate an "Update" event as part of the Form --%>
   <jbo:FormEvent event='<%=event%>' datasource='dsEdit' addrowkey='true' />
</jbo:Row>
<jbo:OnEvent name="create">
  <%  rowEdit.remove(); %> 
</jbo:OnEvent>

<%-- Pass along originURL request parameters using a hidden field--%>
<input type="hidden" name="originURL" value="<%=params.getParameter("originURL")%>">
<input type="submit" value="Update">
<input type="reset" value="Reset">
</form>
