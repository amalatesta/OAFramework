<%@ page language="java" import = "oracle.jbo.*, oracle.jbo.html.*, oracle.jbo.common.ampool.*, oracle.jbo.html.jsp.datatags.*" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<%-- This JSP component renders user selectable links to commit or rollback database transactions.
     It is called by the DataTransaction tag --%>
<%
   // Retrieve all request parameters using our routine to handle multipart encoding type
   RequestParameters params = HtmlServices.getRequestParameters(pageContext);
   String amId = params.getParameter("amId");

   // Given an ApplicationModule tag id passed as a request parameter, retrieve
   // the instance of the ApplicationModule.
   ApplicationModuleRef amRef = Utils.getAMRefFromContext(pageContext, amId);
   ApplicationModule am = amRef.useApplicationModule();
%>

<table class="clsToolBar" cellspacing="1" cellpadding="5" border="0" width="100%">
   <tr>
      <td width="100%">&nbsp;</td><%
   if (am.getTransaction().isDirty())
   { %>
      <td class="clsToolBarButton"><a href="<jbo:UrlEvent targeturlparam='targetURL' event='Commit'/>">Commit</a></td>
      <td class="clsToolBarButton"><a href="<jbo:UrlEvent targeturlparam='targetURL' event='Rollback'/>">Rollback</a></td><%
   }
   else
   { %>
      <td class="clsToolBarButton">Commit</td>
      <td class="clsToolBarButton">Rollback</td><%
   } %>
   </tr>
</table>
<hr noshade size="3" color="6699CC">
