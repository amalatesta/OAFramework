<%@ page language="java" import = "oracle.jbo.html.*, oracle.jbo.*" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<%-- This JSP component display a table bound to a datasource and optionally
     links to an edit form.
     It is called by the DataTable tag --%>
<%
   // Retrieve all request parameters using our routine to handle multipart encoding type
   RequestParameters params = HtmlServices.getRequestParameters(pageContext);

   String editTargetParam = params.getParameter("edittarget");
   if ("null".equalsIgnoreCase(editTargetParam))
   {
      editTargetParam = null; 
   }
%>
<%-- Restore the data binding to the datasource passed as parameter --%>
<jbo:DataSourceRef id="dsBrowse" reference='<%=params.getParameter("datasource")%>' />

<%-- Display the current range of rows in a grid with a column for each attribute --%>
<table class="clsTable" cellspacing="1" cellpadding="3" border="0">
  <tr class="clsTableRow"><%
  if (editTargetParam != null)
  {
%>
    <th class="clsTableHeader">&nbsp;</th>
    <th class="clsTableHeader"><a href="<jbo:UrlEvent targeturlparam='edittarget' event='Create' datasource='dsBrowse' extraparameters='<%="originURL=" + params.getParameter("originURL")%>'/>">New</a></th><%
  }
%>      
  <%-- Display all the attribute names in the table header --%>
  <jbo:AttributeIterate id="df" datasource="dsBrowse">
    <th class="clsTableHeader" title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>"><jbo:ShowHint hintname="LABEL">##Column</jbo:ShowHint></th>
  </jbo:AttributeIterate>
  </tr><%
  // Retrieve the current row to match it again all the other row of the range
  // and display it in a different color.
  Row currentRow = dsBrowse.getRowSet().getCurrentRow();
%>
  <%-- Iterate through all the rows in the range without changing the currency --%>
  <jbo:RowsetIterate datasource="dsBrowse" changecurrentrow="false" userange="true">
  <jbo:Row id="aRow" datasource="dsBrowse" action="Active"/><%
  String rowStyle;
  if (aRow == currentRow)
     rowStyle = "clsCurrentTableRow";
  else
     rowStyle = "clsTableRow";
%>
  <tr class="<%=rowStyle%>"><%
  if (editTargetParam != null)
  {
%>
    <td> <a href="<jbo:UrlEvent targeturlparam='originURL' event='Delete' datasource='dsBrowse' addrowkey='true'/>">Delete</a> </td>
    <td> <a href="<jbo:UrlEvent targeturlparam='edittarget' event='Edit' datasource='dsBrowse' addrowkey='true' extraparameters='<%="originURL=" + params.getParameter("originURL")%>'/>">Edit</a> </td><%
  }
%><%-- Iterate through all the attribute of the row and Render their value --%>
  <jbo:AttributeIterate id="dfv" datasource="dsBrowse">
    <td title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>" > <jbo:RenderValue datasource="dsBrowse">##Cell</jbo:RenderValue> </td>
  </jbo:AttributeIterate>
  </tr>
  </jbo:RowsetIterate>
</table>
