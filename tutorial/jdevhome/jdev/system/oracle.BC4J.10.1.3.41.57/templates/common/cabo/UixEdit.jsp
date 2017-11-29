<%@ page errorPage="errorpage.jsp" contentType="text/html;charset={%charset%}"%>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui/bc4j"  prefix="bc4juix" %>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui"  prefix="uix" %>

<%-- Define Application Module and DataSource--%>
<jbo:ApplicationModule id="{%AppModuleShortName%}" definition="{%ClientModelFullName%}" releasemode="Stateful" />
<jbo:DataSource id="ds1"  appid="{%AppModuleShortName%}"  viewobject="{%QualifiedViewName%}" rangesize="4" />

<%
    // locate the current row using a scriptlet. 
    String sRowKey = request.getParameter("RowKey");
    
    if(sRowKey != null)
    {
      oracle.jbo.AttributeDef adefs[] = ds1.getRowSet().getViewObject().getKeyAttributeDefs();
      oracle.jbo.Key key = new oracle.jbo.Key(sRowKey, adefs);
      oracle.jbo.Row rows[] = ds1.getRowSet().findByKey(key, 1);

      if(rows.length > 0)
      {
        ds1.getRowSet().setCurrentRow(rows[0]);
      }
    }
%>
<%-- if we have an update event, update the row --%>
<jbo:OnEvent name="Update" >
  <jbo:Row id="UpdateRow" datasource="ds1" action="current">
    <jbo:SetAttribute dataitem="*" />
  </jbo:Row>
</jbo:OnEvent>

<%
    // if our current row is null, goto the first row
    if(ds1.getRowSet().getCurrentRow() == null)
    {
      ds1.getRowSet().first();
      oracle.jbo.Row row = ds1.getRowSet().getCurrentRow();

      if(row != null)
        sRowKey = row.getKey().toStringFormat(true);
    }
%>

<%-- user interface begins here --%>
<uix:document>
<uix:head title="{%ViewName%} {|RES_UIXEDIT_TITLE|}" >
<uix:styleSheet/>
</uix:head>
<uix:body>
<uix:pageLayout>
   <uix:globalButtons>
         <uix:globalButtonBar>
            <uix:globalButton text="{|RES_GLOBAL_HELP|}" destination="{%HelpPage%}"  icon="/webapp/images/globalhelp.gif" />
         </uix:globalButtonBar>
   </uix:globalButtons>
   <uix:tabs>
      <uix:tabBar>
         <uix:link text="{|RES_HOME|}"  destination="{%HomePage%}" />
      </uix:tabBar>
   </uix:tabs>
   <uix:location>
      <uix:train>
         <uix:link text="{|RES_STEP1|}"  destination="{%HomePage%}" />
         <uix:link text="{|RES_STEP2|}"  destination="{%HelpPage%}" />
      </uix:train>
   </uix:location>
   <uix:pageHeader>
      <uix:globalHeader text="{|RES_GLOBALHEADER|}" />
   </uix:pageHeader>
   <uix:copyright>
      <uix:styledText text="{|RES_COPYRIGHT|}" />
   </uix:copyright>
   <uix:start>
      <uix:sideNav>
         <uix:link text="{|RES_HOME|}"  destination="{%HomePage%}" />
         <uix:link text="{|RES_HELP|}"  destination="{%HelpPage%}" />
      </uix:sideNav>
   </uix:start>
   <uix:end>
      <uix:contentContainer>
         <uix:styledText text="{|RES_PAGEEND|}" />
      </uix:contentContainer>
   </uix:end>
    <%-- Main page contents go here --%>
   <uix:contents>
      <uix:form name="form1" method="POST">
         <uix:labeledFieldLayout>
            <jbo:AttributeIterate id="dsAttributes"  datasource="ds1" hideattributes="UixShowHide">
               <bc4juix:LabelStyledText datasource="ds1" dataitem="<%=dsAttributes.getName()%>" />
               <bc4juix:InputRender  datasource="ds1" dataitem="<%=dsAttributes.getName()%>" />
            </jbo:AttributeIterate>
            <uix:submitButton name="jboEvent" text="{|RES_UPDATE|}" formName="form1" value="Update" />
            <uix:resetButton text="{|RES_RESET|}" formName="form1" />
         </uix:labeledFieldLayout>
         <uix:formValue name="RowKey" value='<%=request.getParameter("RowKey")%>' />
      </uix:form>
   </uix:contents>
</uix:pageLayout>
</uix:body>
</uix:document>
<jbo:ReleasePageResources />


