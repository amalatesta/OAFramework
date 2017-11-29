<%@ page language="java" import = "oracle.jbo.html.*" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<%-- This JSP component displays a single record bound to a datasource.
     It is called by the DataRecord tag --%>
<%
   // Retrieve all request parameters using our routine to handle multipart encoding type
   RequestParameters params = HtmlServices.getRequestParameters(pageContext);

   String rowParam = params.getParameter("jboRowKey");
   String rowAction = "Current";
%>
<%-- Restore the data binding to the datasource passed as parameter --%>
<jbo:DataSourceRef id="dsShow" reference='<%=params.getParameter("datasource")%>'/>

<%-- For any action of a given datasource, check if the Row information is
     part of the request parameter. If not, use the current Row --%>
<jbo:OnEvent name="*" datasource="dsShow">
   <% if (rowParam != null)
         rowAction = "Get";  %>
</jbo:OnEvent>

<%-- Retrieve the Row to display and iterate through all of its attributes --%>
<jbo:Row id="rowCur" datasource="dsShow" rowkey="<%=rowParam%>" action="<%=rowAction%>">
   <table class="clsViewCurrentRecord" cellspacing="1" cellpadding="3" border="0">
   <jbo:AttributeIterate id="def" datasource="dsShow">
      <tr class="clsTableRow">
         <td title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>"> <jbo:ShowHint hintname="LABEL">##Column</jbo:ShowHint> </td>
         <td title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>" class="clsFieldValue"> <jbo:RenderValue datasource="dsShow">##Cell</jbo:RenderValue> </td>
      </tr>
   </jbo:AttributeIterate>
   </table>
</jbo:Row>











