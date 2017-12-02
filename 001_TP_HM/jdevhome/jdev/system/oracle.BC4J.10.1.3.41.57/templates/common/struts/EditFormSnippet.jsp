<%@ taglib uri="/WEB-INF/struts-bean.tld" prefix="bean" %>
<%@ taglib uri="/WEB-INF/struts-html.tld" prefix="html" %>
<%@ taglib uri="/WEB-INF/struts-logic.tld" prefix="logic" %>

<html:form action="/{%Action%}.do">

<jbo:ViewObject id="vo" name="{%AppModuleShortName%}.{%ViewName%}"/>
<table border="0">
   <logic:iterate id="def" name="vo" property="attributeDefs" scope="page">
   <tr>
      <th align="right">
         <bean:write name="def" property="name" filter="true"/>
      </th>
      <td align="left">
         <html:text property="<%=((oracle.jbo.AttributeDef)def).getName()%>"/><%
         if (((oracle.jbo.AttributeDef)def).isMandatory()) { %>*<% } %>
      </td>
   </tr>
   </logic:iterate>
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
</html:form>

