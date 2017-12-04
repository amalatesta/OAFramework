<%@ page errorPage="errorpage.jsp" contentType="text/html;charset={%charset%}"%>

<%@ taglib  uri="http://xmlns.oracle.com/uix/ui/bc4j"  prefix="bc4juix" %>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui"  prefix="uix" %>

<uix:document>
<uix:head title="{%ViewName%} {|RES_BROWSEINSERTHIDESHOW_TITLE|}" >
<uix:styleSheet/>
</uix:head>
<uix:body>
<uix:globalHeader text="{%ViewName%} {|RES_BROWSE|}" ></uix:globalHeader>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<jbo:ApplicationModule id="{%AppModuleShortName%}" definition="{%ClientModelFullName%}" releasemode="Stateful" />
<jbo:DataSource id="ds1"  appid="{%AppModuleShortName%}"  viewobject="{%QualfiedViewName%}" rangesize="4" />

<bc4juix:Table datasource="ds1" >
   
   <jbo:AttributeIterate id="dsAttributes"  datasource="ds1" hideattributes="UixShowHide">
      <uix:styledText textBinding="<%=dsAttributes.getName()%>" />
   </jbo:AttributeIterate>
   
   <bc4juix:TableDetail>
      <jbo:AttributeIterate id="dsAttributes2"  datasource="ds1" hideattributes="UixShowHide">
         <uix:labeledFieldLayout columns="1" width="100%">
            <uix:styledText text="<%=dsAttributes2.getName() + ':'%>" />
            <uix:styledText textBinding="<%=dsAttributes2.getName()%>" />
         </uix:labeledFieldLayout>
      </jbo:AttributeIterate>
   </bc4juix:TableDetail>

   <uix:JboAddTableRow text="{|RES_NEW|}" />
</bc4juix:Table>

<jbo:ReleasePageResources  />

</uix:body>
</uix:document>

