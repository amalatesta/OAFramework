<%@ page errorPage="errorpage.jsp" contentType="text/html;charset={%charset%}"%>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui/bc4j"  prefix="bc4juix" %>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui"  prefix="uix" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>

<%-- defined Application Module and DataSource --%>
<jbo:ApplicationModule id="{%AppModuleShortName%}" definition="{%ClientModelFullName%}" releasemode="Stateful" />
<jbo:DataSource id="ds1"  appid="{%AppModuleShortName%}"  viewobject="{%QualifiedViewName%}" rangesize="4" />
<%
    String sSelected = request.getParameter("ds1_TableNav:selected");
    String sKeyName = null;
    String sKey = null;
    String sEditTarget = null;
    
    // if we have a row selection, find out the row number
    // and get the Row Key
    if(sSelected != null)
    {
       sKeyName = "ds1_TableNav:RowKey:" + sSelected;
       sKey = request.getParameter(sKeyName);

       // build URL for our editing target
       sEditTarget = "{%UixEdit%}?RowKey=" + sKey;
    }
%>
<%-- handle the Row Create event --%>
<jbo:OnEvent name="Create">
   <jbo:Row id="newrow" datasource="ds1" action="Create" />
</jbo:OnEvent>

<%-- handle the Row Delete event --%>
<jbo:OnEvent name="Delete">
   <% if(sSelected != null)
   %>
      <jbo:Row id="delrow" datasource="ds1" rowkeyparam="<%=sKeyName%>" action="Delete" />
   <%
   %>
</jbo:OnEvent>

<%-- If we have an update event, forward to the editing page --%>
<jbo:OnEvent name="Update">
   <% if(sSelected != null) 
      { 
   %>
      <jsp:forward page="<%=sEditTarget%>" />
   <%
      }
      else
      {
          throw new javax.servlet.jsp.JspException("{|RES_SEL_ROW_BEFORE_UPDATE|}");
      }
   %>  
</jbo:OnEvent>

<jsp:include flush="true" page="GlobalDefs.jsp" >
  <jsp:param name="EventTarget" value="{%HomePage%}" />
</jsp:include>

<%-- all commit\rollback events are handled by this component --%>
<jbo:DataHandler appid="{%AppModuleShortName%}" />

<%-- user interface begins here --%>
<uix:document>
<uix:head title="{%ViewName%} {|RES_BROWSEHODESHOW_TITLE|}">
<uix:styleSheet/>
</uix:head>
<uix:body>
<uix:pageLayout>
   <uix:globalButtons>
         <uix:ref refID="GlobalToolBar" />
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
   <%-- Main page contents go here --%>
   <uix:contents>
      <uix:header text="{|RES_CONTENTS|}" />
      <uix:form name="form1" method="GET">
            <bc4juix:Table datasource="ds1" >

            <uix:columnHeaderStamp>
               <uix:styledText textBinding="LABEL"/>
            </uix:columnHeaderStamp>

            <jbo:AttributeIterate id="dsAttributes"  datasource="ds1" hideattributes="UixShowHide">
               <bc4juix:RenderValue datasource="ds1" dataitem="<%=dsAttributes.getName()%>" />
            </jbo:AttributeIterate>

            <uix:formValue name="RowKey" valueBinding="RowKey" />

            <uix:tableSelection>
              <uix:singleSelection>
               <uix:contents>
                  <%-- The button name needs to be JboEvent so that it triggers the use of the OnEvent tag --%>
                  <uix:submitButton name="jboEvent" text="{|RES_UPDATE|}" formName="form1" value="Update" />
                  <uix:submitButton name="jboEvent" text="{|RES_DELETE|}" formName="form1" value="Delete" />
                  <uix:submitButton name="jboEvent" text="{|RES_CREATE|}" formName="form1" value="Create" />
               </uix:contents>
              </uix:singleSelection>
            </uix:tableSelection>

            <bc4juix:TableDetail>
               <jbo:AttributeIterate id="dsAttributes2"  datasource="ds1" hideattributes="UixShowHide">
                  <uix:labeledFieldLayout columns="1" width="100%">
                     <bc4juix:LabelStyledText datasource="ds1" dataitem="<%=dsAttributes2.getName()%>" />
                     <bc4juix:RenderValue datasource="ds1" dataitem="<%=dsAttributes2.getName()%>" />
                  </uix:labeledFieldLayout>
               </jbo:AttributeIterate>
            </bc4juix:TableDetail>

            </bc4juix:Table>
      </uix:form>
   </uix:contents>
</uix:pageLayout>
</uix:body>
</uix:document>
<jbo:ReleasePageResources />






