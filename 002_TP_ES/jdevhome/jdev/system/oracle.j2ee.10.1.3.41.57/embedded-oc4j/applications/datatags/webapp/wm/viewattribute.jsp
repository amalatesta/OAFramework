<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui"  prefix="uix" %>
<% request.setCharacterEncoding("UTF-8");%>

<jsp:useBean  class="oracle.jbo.client.wm.WebMonitorBean"  id="wm"  scope="request" />
<uix:styleSheet/>

<uix:pageLayout>
<uix:productBranding>
  <uix:image source="/webapp/wm/bc4jadmin.jpg" />
</uix:productBranding>
<uix:copyright>
  <uix:link text="Copyright 2002, Oracle Corp."/>
</uix:copyright>
<uix:privacy>
  <uix:link text="Privacy Statement" destination="http://www.oracle.com/html/index.html?privacy.html"/>
</uix:privacy>

<% 
  String pID = request.getParameter("pID");
  if (pID != null) wm.setPoolID(pID);
  
  String appPoolName = request.getParameter("PoolName"); 
  if (appPoolName != null) wm.setAppModulePoolName(appPoolName); 
 
  String viewName = request.getParameter("ViewName"); 
  if (viewName != null) wm.setViewObjectName(viewName); 
 
  String AMName = request.getParameter("AMName"); 
  if (AMName != null) wm.setAMName(AMName); 

  String instNo = request.getParameter("Instance"); 
  if (instNo != null) wm.setInstanceIndex(instNo); 
%> 
 <uix:location>
  <uix:breadCrumbs>
    <uix:contents>
    <uix:link text="BC4J" destination="bc4j.jsp" /> 
    <uix:link text="<%= appPoolName + \": \" + wm.getLabel(\"APP_MOD_TITLE\") %>" 
          destination="<%= \"appmod.jsp?PoolName=\" + appPoolName%>"/> 
    <uix:link text="<%= AMName + \" \" + wm.getLabel(\"APP_MOD_INSTANCE\")  + \" \" + instNo +  \": \" + wm.getLabel(\"VIEWOBJECTS_NAME\") %>" 
          destination="<%= \"viewobject.jsp?PoolName=\" + appPoolName + \"&Instance=\" + instNo + \"&AMName=\" + AMName %>" /> 
    <uix:link text="<%= viewName + \": \" +  wm.getLabel(\"VO_ATTR\")%>" destination="viewAttriute.jsp" />
    </uix:contents>
  </uix:breadCrumbs>
</uix:location>
<uix:contents>

 
<HEAD> 
  <TITLE><%= viewName + ": " +  wm.getLabel("VO_ATTR")%></TITLE> 
</HEAD> 
 
<uix:stackLayout> 
<uix:contents> 
  <uix:header text="<%= viewName + \": \" +  wm.getLabel(\"VO_ATTR\")%>"> 
  <uix:contents> 
     <uix:tableLayout width="99%"> 
     <uix:contents> 
        <uix:rowLayout hAlign="right"> 
        <uix:contents> 
           <uix:flowLayout> 
           <uix:contents> 
              <uix:styledText text="<%= wm.getLabel(\"REFRESH_TIME\", new Object[] {wm.getTimestamp()}) %>"
                 styleClass="OraInlineInfoText"/> 
           </uix:contents> 
           </uix:flowLayout> 
        </uix:contents> 
        </uix:rowLayout> 
     </uix:contents> 
     </uix:tableLayout> 
 
     <uix:tableLayout width="99%" cellSpacing="20"> 
     <uix:contents> 
        <uix:rowLayout vAlign="top"> 
           <uix:contents> 
             <uix:table text="<%= wm.getLabel(\"VO_ATTR\") %>" id="viewObjectAttributeTable" > 
             <%
              wm.showViewObjectAttributes(viewObjectAttributeTable);
             %>
             </uix:table>
           </uix:contents> 
        </uix:rowLayout> 
     </uix:contents> 
     </uix:tableLayout> 
 
  </uix:contents> 
  </uix:header> 
</uix:contents> 
</uix:stackLayout> 
 
  </uix:contents>
</uix:pageLayout>

