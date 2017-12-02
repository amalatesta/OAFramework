<%@ page
  language    = "java"
  import      = "java.util.*, oracle.jbo.*, javax.naming.*, oracle.jdeveloper.html.*, oracle.jbo.html.databeans.*, oracle.apps.fnd.framework.*, oracle.apps.fnd.framework.webui.*"
  contentType = "text/html"
%>
<%! public static final String RCS_ID = "$Header: OAErrorDetailPage.jsp 120.25 2006/09/09 17:56:23 atgops1 noship $"; %>
<%
  response.setHeader("Cache-Control", "no-cache,no-store,max-age=0"); // HTTP 1.1
  response.setHeader("Pragma", "no-cache");                           // HTTP 1.0
  response.setDateHeader("Expires", -1);                              // Prevent caching at the proxy server

  String logoutUrl = OAJSPHelper.getLogoutUrl(request);
%> 
<html lang="en-US">
<head>
  <title>Error Details</title>
<style type="text/css">

.globalHeader {
background: url(/OA_HTML/cabo/images/swan/headerBg.jpg);
background-repeat:repeat-x;background-color:#1963a9
}

.globalLink  {white-space:nowrap;font-size:9pt;font-family:Arial;color:#ffffff;text-decoration:none}

.pageLink A:link {color:#2b7c92}

.copyright {white-space:nowrap;font-family:Arial;font-size:7.5pt;color:#ffffff;text-decoration:none}

.errorHeader {
color:#ed1c24;
font-family:Arial;
font-weight:bold;
font-size:9pt;
vertical-align:middle;
border-bottom-width:1px;
border-bottom-style:solid;
border-bottom-color:#3a5a87;
margin-bottom:0px;
}

.errorText {
font-family:Tahoma,Arial,Helvetica,Geneva,sans-serif;
font-size:9pt;
}

</style> 
</head>
<body>  
<table style="padding-top:10px;"  class="globalheader" width="100%" border="0" cellspacing="0"  cellpadding="0">
  <tr> <td>&nbsp;&nbsp;<img src="/OA_MEDIA/FNDSSCORP.gif" alt=""> </td></tr>
  <tr>
       <% if  (logoutUrl != null)
      {
      %>
       <td align="right"; style="padding-right:5px;padding-bottom:5px"> <a href= <%=logoutUrl%> class="globalLink"> Logout </a></td>
      <% } %>
  </tr>

</table>
<br>

<%
  OAException e   = (OAException)session.getValue("OASevereException");
  session.removeValue("OASevereException");
%>
<%
   String displayErrorStack = (String)session.getValue("_displayErrorStack");
   session.removeValue("_displayErrorStack");
   if ("Y".equals(displayErrorStack))
   {
%>   

<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-left:5px;margin-right:5px">

  <tr> <td> <h1 class="ErrorHeader"> Error Page </h1> </td> </tr>
  <tr> <td> Exception Details. </td> </tr>
  <tr> <td> <xmp> <%= (e != null) ? e.getMessageStackTraces() : "" %> </xmp>

<%
   }
%>   
  </td></tr>
</table>

<table cellpadding="0" cellspacing="0" border="0" width="100%"
      style="background-image:url(/OA_HTML/cabo/images/swan/footerBg.gif);">
<tr>
   <td nowrap align="center">
     <table cellpadding="0" cellspacing="0" border="0" align="center">
       <tr>
         <td><a href="/OA_HTML/OALogout.jsp?menu=Y" class="globalLink">Logout</a></td>
       </tr>
     </table>
    </td>
</tr>

<tr>
<td>
  <table cellpadding="2" cellspacing="2" border="0" width="100%">
    <tr>
      <td align="right" nowrap width="100%" class="copyright">
         Copyright (c) 2006, Oracle. All rights reserved.
      </td>
    </tr>
   </table>
</td>
</tr>
</table>

<script>document.body.style.marginLeft="0px";document.body.style.marginRight="0px";document.body.style.marginTop="0px";</script>

</body>
</html>
