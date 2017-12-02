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
    <uix:link text="<%= wm.getLabel(\"BC4J_RT_PARAS\") %>" destination="runtime.jsp" /> 
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
  <TITLE><%= wm.getLabel("BC4J_RT_PARAS") %></TITLE> 
</HEAD> 
 
<uix:stackLayout> 
<uix:contents> 
  <uix:header text="<%= wm.getLabel(\"BC4J_RT_PARAS\") %>"> 
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
            <uix:table id="runtimeDataTable" >
            <%
              wm.showBC4JRuntimeParameter(runtimeDataTable);
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

