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
  String appPoolName = request.getParameter("PoolName"); 
  wm.setAppModulePoolName(appPoolName); 
  String pID = request.getParameter("pID");
  if (pID != null) wm.setPoolID(pID);
%> 
 <uix:location>
  <uix:breadCrumbs>
    <uix:contents>
    <uix:link text="BC4J" destination="bc4j.jsp" /> 
    <uix:link text="<%= appPoolName + \": \" + wm.getLabel(\"APP_MOD_TITLE\") %>" destination="appmod.jsp" /> 
    </uix:contents>
  </uix:breadCrumbs>
</uix:location>
<uix:contents>
 
<HEAD> 
  <TITLE><%= appPoolName + ": " + wm.getLabel("APP_MOD_TITLE") %></TITLE> 
</HEAD> 

<uix:stackLayout> 
<uix:contents> 
  <uix:header text="<%= appPoolName + \": \" + wm.getLabel(\"APP_MOD_TITLE\") %>"> 
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
 
     <uix:header text="<%= wm.getLabel(\"APP_MOD_USER_DATA\") %>"> 
     <uix:tableLayout width="99%" cellSpacing="20"> 
     <uix:contents> 
        <uix:rowLayout vAlign="top"> 
           <uix:contents> 
              <uix:table id="appModuleUserData" > 
              <%
                wm.showAMPoolUserData(appModuleUserData);
              %>
              </uix:table>
           </uix:contents> 
        </uix:rowLayout> 
     </uix:contents> 
     </uix:tableLayout> 
     </uix:header> 
     
     <uix:header text="<%= wm.getLabel(\"APP_MOD_INST_TITLE\") %>"> 
     <uix:tableLayout width="99%" cellSpacing="20"> 
     <uix:contents> 
        <uix:rowLayout vAlign="top"> 
           <uix:contents> 
             <uix:table id="appModuleInstancesTable" > 
             <%
              wm.showAMInstance(appModuleInstancesTable);
             %>
             </uix:table>
           </uix:contents> 
        </uix:rowLayout> 
     </uix:contents> 
     </uix:tableLayout> 
     </uix:header> 
 
 
     <uix:header text="<%= wm.getLabel(\"PERFORMANCE\") %>"> 
     
     <uix:rowLayout> 
     <uix:tableLayout width="99%" cellSpacing="20"> 
     <uix:contents> 
        <uix:rowLayout hAlign="left"> 
          <uix:contents> 
             <uix:table text="<%= wm.getLabel(\"APP_MOD_LIFE\") %>" id="appModuleLifetimeDataTable" > 
             <%
              wm.showAMPoolDetail(appModuleLifetimeDataTable,1);
             %>
             </uix:table>
          </uix:contents> 
        </uix:rowLayout> 
        
        <uix:rowLayout hAlign="left"> 
           <uix:contents> 
             <uix:table text="<%= wm.getLabel(\"APP_POOL_USE\") %>" id="appPoolUseDataTable" > 
             <%
              wm.showAMPoolDetail(appPoolUseDataTable,3);
             %>
             </uix:table> 
          </uix:contents> 
        </uix:rowLayout> 
     </uix:contents> 
     </uix:tableLayout> 
 
     <uix:tableLayout width="99%" cellSpacing="20"> 
     <uix:contents> 
        <uix:rowLayout hAlign="left"> 
           <uix:contents> 
             <uix:table text="<%= wm.getLabel(\"STATE_MANAGEMENT\") %>" id="stateManagementDataTable" > 
             <%
              wm.showAMPoolDetail(stateManagementDataTable,2);
             %>
             </uix:table> 
           </uix:contents> 
        </uix:rowLayout> 
        
        <uix:rowLayout hAlign="left"> 
           <uix:contents> 
             <uix:table text="<%= wm.getLabel(\"APP_MOD_STATISTICS\") %>" id="appModuleDataTable" > 
             <%
              wm.showAMPoolDetail(appModuleDataTable,4);
             %>
             </uix:table> 
           </uix:contents> 
        </uix:rowLayout> 
     </uix:contents> 
     </uix:tableLayout> 
     </uix:rowLayout> 
 
     <uix:tableLayout width="99%" cellSpacing="20"> 
     <uix:contents> 
        <uix:rowLayout vAlign="top"> 
           <uix:contents> 
             <uix:table text="<%= wm.getLabel(\"APP_MOD_AGE\") %>" id="appModuleAgeDataTable" > 
             <%
              wm.showAMPoolDetail(appModuleAgeDataTable,5);
             %>
             </uix:table>
           </uix:contents> 
        </uix:rowLayout> 
     </uix:contents> 
     </uix:tableLayout> 
 
  </uix:header> 
  
  </uix:contents> 
  </uix:header> 
</uix:contents> 
</uix:stackLayout> 
 
  </uix:contents>
</uix:pageLayout>

