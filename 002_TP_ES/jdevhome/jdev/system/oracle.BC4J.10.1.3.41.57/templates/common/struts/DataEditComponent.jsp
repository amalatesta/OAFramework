<%@ page language="java" import="oracle.jbo.*, oracle.jbo.html.*" %>
<%@ taglib uri="/webapp/DataTags.tld" prefix="jbo" %>
<%@ taglib uri="/WEB-INF/struts-html.tld" prefix="html" %>
<%@ taglib uri="/WEB-INF/struts-bean.tld" prefix="bean" %>
<%@ taglib uri="/WEB-INF/struts-logic.tld" prefix="logic" %>

<%-- This JSP component build an edit form for a single record and
     generates an update submit event.
     It is called by the DataEdit tag --%>
<%
   String dsName = request.getParameter("datasource");
%>

<html:errors/>

<%-- Build a form with an editable field for each of the attributes of the row --%>

<html:form action='<%=request.getParameter("targetURL")%>' enctype='<%=request.getParameter("encType")%>' method="POST">

   <table border="0">
   <jbo:AttributeIterate id="def" datasource="<%=dsName%>">
      <tr>
         <th align="right" title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>">
            <jbo:ShowHint hintname="LABEL"></jbo:ShowHint>
         </th>
         <td align="left" title="<jbo:ShowHint hintname='TOOLTIP'></jbo:ShowHint>">
            <jbo:InputRender datasource="<%=dsName%>"  /><%
            // Mark all the mandatory attributes with '*'  
            if (def.isMandatory())
            {
           %>*<%
            } %>
         </td>
      </tr>
   </jbo:AttributeIterate>      
   </table>
<html:hidden property="jboEvent" />
<html:hidden property="jboEventVo" />
<html:hidden property="jboRowKey" />
<html:hidden property="amId" />
<html:submit>
   <bean:message key="DataEdit.update"/>
</html:submit>
<html:reset>
   <bean:message key="DataEdit.reset"/>
</html:reset>
&nbsp;
<html:cancel>
   <bean:message key="DataEdit.cancel"/>
</html:cancel>
</html:form>

