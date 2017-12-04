<%@ page errorPage="errorpage.jsp" contentType="text/html;charset={%charset%}"%>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui"  prefix="uix" %>
<%-- user interface begins here --%>
<uix:document>
<uix:head title="{|RES_HELPPAGE_TITLE|}" >
<uix:styleSheet/>
</uix:head>
<uix:body>
<uix:pageLayout>
   <uix:tabs>
      <uix:tabBar>
         <uix:link text="{|RES_HOME|}"  destination="{%HomePage%}" />
      </uix:tabBar>
   </uix:tabs>
   <uix:pageHeader>
      <uix:globalHeader text="{|RES_HELPPAGE_HEADER|}" />
   </uix:pageHeader>
   <uix:copyright>
      <uix:styledText text="{|RES_COPYRIGHT|}" />
   </uix:copyright>
   <uix:start>
      <uix:sideNav>
         <uix:link text="{|RES_HOME|}"  destination="{%HomePage%}" />
      </uix:sideNav>
   </uix:start>
   <%-- Main page contents go here --%>
   <uix:contents>
      <uix:header text="{|RES_HELPPAGE_HEADERTEXT|}" />
    </uix:contents>
</uix:pageLayout>
</uix:body>
</uix:document>







