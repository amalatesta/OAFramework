<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>

<%
String sModel = request.getParameter("model").replace('/','.');
%>
<table class="clsViewCurrentRecord" cellspacing="1" cellpadding="3" border="0">
<jbo:AttributeIterate id="def" model='<%=sModel%>'>
  <tr class="clsTableRow">
  <td title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>"> <jbo:ShowHint hintname="LABEL">##Column</jbo:ShowHint> </td>
  <td title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>" class="clsFieldValue"> <jbo:RenderValue >##Cell</jbo:RenderValue> </td>
  </tr>
</jbo:AttributeIterate>
</table>









