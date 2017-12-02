<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui"  prefix="uix" %>
<% request.setCharacterEncoding("UTF-8");%>

<jsp:useBean  class="oracle.jbo.client.wm.WebMonitorBean"  id="wm"  scope="request" />
<uix:styleSheet/>
<uix:pageLayout>

<uix:productBranding>
  <uix:image source="/webapp/wm/bc4jadmin.jpg" />
</uix:productBranding>
<uix:location>
  <uix:breadCrumbs>
    <uix:contents>
    <uix:link text="BC4J" destination="bc4j.jsp" /> 
    </uix:contents>
  </uix:breadCrumbs>
</uix:location>
<uix:copyright>
  <uix:link text="Copyright 2002, Oracle Corp."/>
</uix:copyright>
<uix:privacy>
  <uix:link text="Privacy Statement" destination="http://www.oracle.com/html/index.html?privacy.html"/>
</uix:privacy>
<uix:contents>
 
<HEAD> 
  <TITLE>BC4J JSP Web Monitor</TITLE> 
</HEAD> 

 
<BODY>
<uix:stackLayout> 
<uix:contents> 
 
  <uix:header text="Business Component for Java"> 
  <uix:contents> 
     <uix:tableLayout width="100%"> 
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
 
     <uix:tableLayout width="100%" cellSpacing="20"> 
     <uix:contents> 
        <uix:rowLayout vAlign="top"> 
        <uix:contents> 
           <uix:header text="<%= wm.getLabel(\"GENERAL\") %>"> 
           <uix:contents> 
              <uix:borderLayout> 
              <uix:contents> 
                 <uix:tableLayout> 
                 <uix:contents> 
                    <uix:rowLayout vAlign="top"> 
                    <uix:contents> 
                       <uix:image source="images/trafficGreen.gif" />
                       <uix:labeledFieldLayout width="0" labelWidth="0" fieldWidth="0"> 
                       <uix:contents> 
                          <uix:styledText text="<%= wm.getLabel(\"CURRENT_STATUS\") %>" 
                             styleClass="OraPromptText"/> 
                          <oem:styledText text="<%= wm.getStatus() %>" 
                             styleClass="OraDataText"/> 
                       </uix:contents> 
                       </uix:labeledFieldLayout> 
                    </uix:contents> 
                    </uix:rowLayout> 
                 </uix:contents> 
                 </uix:tableLayout> 
                 <uix:spacer height="20"/> 
              </uix:contents> 
              <uix:left> 
              </uix:left> 
              <uix:bottom> 
              </uix:bottom> 
           </uix:borderLayout> 
           </uix:contents> 
           </uix:header> 
           <uix:header text="<%= wm.getLabel(\"STATUS\") %>"> 
           <uix:contents> 
              <uix:tableLayout> 
              <uix:contents> 
                 <uix:rowLayout> 
                 <uix:contents> 
                       <uix:labeledFieldLayout width="0" labelWidth="0" fieldWidth="0"> 
                       <uix:contents> 
                          <uix:styledText text="<%= wm.getLabel(\"TOTAL_JVM_MEM\") %>" 
                             styleClass="OraPromptText"/> 
                          <uix:styledText text="<%= wm.getTotalJVMMem() %>" 
                             styleClass="OraDataText"/> 
                          <uix:styledText text="<%= wm.getLabel(\"FREE_JVM_MEM\") %>" 
                             styleClass="OraPromptText"/> 
                          <uix:styledText text="<%= wm.getFreeJVMMem() %>" 
                             styleClass="OraDataText"/> 
                    </uix:contents> 
                    </uix:labeledFieldLayout> 
                 </uix:contents> 
                 </uix:rowLayout> 
              </uix:contents> 
              </uix:tableLayout> 
           </uix:contents> 
           </uix:header> 
 
        </uix:contents> 
        </uix:rowLayout> 
 
    
     </uix:contents> 
     </uix:tableLayout> 
  </uix:contents> 
  </uix:header> 
 
  <uix:header text="<%= wm.getLabel(\"APP_MOD_LIST\") %>"> 
  <uix:contents> 
     <uix:tableLayout width="99%" cellSpacing="20"> 
     <uix:contents> 
        <uix:rowLayout vAlign="top"> 
           <uix:contents> 
             <uix:table id="appModuleTable" >
             <%
                wm.showAMPool(appModuleTable);
             %>
             </uix:table>
	       </uix:contents> 
        </uix:rowLayout> 
     </uix:contents> 
     </uix:tableLayout> 
  </uix:contents>
  </uix:header> 
  
  <uix:header text="<%= wm.getLabel(\"ADMINISTRATION\") %>"> 
  <uix:contents> 
     <uix:tableLayout width="100%" cellSpacing="5"> 
     <uix:contents> 
        <uix:rowLayout> 
        <uix:contents> 
          <uix:link text="<%= wm.getLabel(\"BC4J_RT_PARAS\") %>" destination="runtime.jsp" />
        </uix:contents> 
        </uix:rowLayout> 
     </uix:contents> 
     </uix:tableLayout> 
  </uix:contents> 
  <uix:contents> 
     <uix:tableLayout width="100%" cellSpacing="5"> 
     <uix:contents> 
        <uix:rowLayout> 
        <uix:contents> 
          <uix:link text="<%= wm.getLabel(\"JAVA_RT_PARAS\") %>" destination="javart.jsp" />
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
