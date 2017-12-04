<%@ page errorPage="errorpage.jsp" contentType="text/html;charset={%charset%}"%>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui"  prefix="uix" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<jbo:ApplicationModule id="{%AppModuleShortName%}" definition="{%ClientModelFullName%}" releasemode="Stateful" />
<jbo:DataSource id="ds1"  appid="{%AppModuleShortName%}"  viewobject="{%QualifiedViewName%}" rangesize="4" />

<%-- user interface begins here --%>
<uix:document>
<uix:head title="{|RES_PAGETEMPLATE_TITLE|}" >
<uix:styleSheet/>
</uix:head>
<uix:body>
<uix:pageLayout>
   <uix:tabs>
      <uix:tabBar>
         <uix:link text="{|RES_HOME|}"  destination="/site1/PageTemplate.jsp" />
      </uix:tabBar>
   </uix:tabs>
   <uix:location>
      <uix:train>
         <uix:link text="{|RES_STEP1|}"  destination="/site1/PageTemplate.jsp" />
         <uix:link text="{|RES_STEP2|}"  destination="/site1/PageTemplate.jsp" />
      </uix:train>
   </uix:location>
   <uix:pageHeader>
      <uix:globalHeader text="{|RES_GLOBALHEADER|}" />
   </uix:pageHeader>
   <uix:cobranding>
      <uix:styledText text="{|RES_COBRANDING|}" />
   </uix:cobranding>
   <uix:copyright>
      <uix:styledText text="{|RES_COPYRIGHT|}" />
   </uix:copyright>
   <uix:start>
      <uix:sideNav>
         <uix:link text="{|RES_HOME|}"  destination="/site1/PageTemplate.jsp" />
         <uix:link text="{|RES_HELP|}"  destination="/site1/PageTemplate.jsp" />
      </uix:sideNav>
   </uix:start>
   <uix:end>
      <uix:contentContainer>
         <uix:styledText text="{|RES_PAGEEND|}" />
      </uix:contentContainer>
   </uix:end>
   <%-- Main page contents go here --%>
   <uix:contents>
      <uix:header text="{|RES_CONTENTS|}" />
    </uix:contents>
</uix:pageLayout>
</uix:body>
</uix:document>







