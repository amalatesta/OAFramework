<%@ page
  language    = "java"
  isErrorPage = "true"
  import      = "oracle.apps.fnd.common.URLTools, oracle.apps.fnd.common.WebRequestUtil, oracle.apps.fnd.common.WebAppsContext, java.util.*, oracle.jbo.*, javax.naming.*, oracle.jdeveloper.html.*, oracle.jbo.html.databeans.*, oracle.apps.fnd.framework.*, oracle.apps.fnd.framework.webui.*"
  contentType = "text/html"
%>
<%! public static final String RCS_ID = "$Header: OAErrorPage.jsp 120.41 2006/09/09 17:57:02 atgops1 noship $"; %>

<%
  String logoutUrl = OAJSPHelper.getLogoutUrl(request);
   
  // if _render_mode = 1, it means the request is for rendering a portlet.
  // (portlet render mode =  MODE_SHOW).
  boolean portletMode = ("1".equals(request.getParameter("_render_mode"))) ||
                        ("1".equals(request.getParameter("_mode")));
                        
//Lauren bug #5549758 -- We need a WebAppsContext if we are going to MAC a URL.
// added by gustavo - 
  WebAppsContext wctx = WebRequestUtil.validateContext(request, response);

  if( portletMode )
  {
    OAJSPHelper.incrementPortletCachingKey(request, session);
  }
  
  OAException e = null;
  try
  {
    if (exception == null)
    {
      e = OAException.wrapperException((Throwable)OAPageBean.getPPRException(session));
      if (e != null) 
        OAPageBean.removePPRException(session);
    }
    else
    {
      e = OAException.wrapperException((Throwable)exception);
    }
    OAApplicationModuleCache amCache = OAPageBean.getApplicationModuleCache(session);
    Hashtable amEntries = null;
    if (amCache != null)
      amEntries = amCache.getApplicationModuleEntries(session, request, response);  
    if (amEntries != null)
    {
      Enumeration amList       = amEntries.elements();
      OAApplicationModule am  = null;
      while (amList.hasMoreElements())
      {
        OASessionCookie sessionCookie = (OASessionCookie)amList.nextElement();
        if (sessionCookie != null)
          am = (OAApplicationModule)sessionCookie.useApplicationModule(false);
        if (am != null)
        {
          e.setApplicationModule(am);
          break;
        }
      }
    }
  }
  catch (Exception ex)
  {
    // If an exception is thrown here, just swallow it.  We don't want the 
    // original exception to get lost because of this side effect exception.
  }

  if (e != null)
    session.putValue("OASevereException", e);

  OAException ex   = (OAException)session.getValue("OASevereException");
  String displayErrorStack = (String)session.getValue("_displayErrorStack");
  if (displayErrorStack == null)
  {
   OAJSPHelper.handleErrorStackDisplay(null,null,request,session,ex);   
   displayErrorStack = (String)session.getValue("_displayErrorStack");  
  }    
%>

<html lang="en-US">
<head>
<script>
function ignoreWarnAboutChanges(url)
{
  document.location.href = url;
}
</script>  

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


  <title>Error Page</title>
  <META name="fwk-error" content="Error occured while processing the request">

<%
  if ("Y".equals(displayErrorStack))
  {
    // Bug 6185337 - Encoding the error message to avoid script injection. 
    String err = (e != null) ? e.getMessageStackTraces() : "";
    err = oracle.apps.fnd.util.URLEncoder.encode(err);
%>
     <META name="fwk-error-detail" content="<%= err %>">
<%
   }   
%>

</head>

<body> 

<% String severeErrorDuringRender = (String)session.getValue("severeErrorDuringRender");
   session.removeValue("severeErrorDuringRender");
   if (!"Y".equals(severeErrorDuringRender))
   {
%>  

<table   class="globalheader" width="100%" border="0" cellspacing="0"  cellpadding="0">
  <tr> <td style="padding-left:5px; padding-top:10px;"><img src="/OA_MEDIA/FNDSSCORP.gif" alt=""> </td></tr>
  <tr>
      <% if  (logoutUrl != null)
      {
      %>
       <td align="right"; style="padding-right:5px;padding-bottom:5px"> <a href= <%=logoutUrl%> class="globalLink"> Logout </a></td>
      <% } %>
  </tr>  
  
</table>

<p>
<%      
   }
%>


<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-left:5px;margin-right:5px">
<%  
   if (!"Y".equals(severeErrorDuringRender))
   {
%> 
      <tr> <td> <h1 class="errorHeader"> Error Page </h1> </td> </tr>
      <tr valign="top"> <td class="errorText" >You have encountered an unexpected error.  Please contact the System Administrator for assistance. </td> </tr>      
<%
   }
   else
   {
%>
      <tr> 
      <td> <h1 class="errorHeader"> Error Page </h1> </td> 
      </tr>
      
      <tr valign="top"> 
      <td class="errorText" >You have encountered an unexpected error.  Please contact the System Administrator for assistance. </td> 
      </tr>      
<%  
   }
   if ("Y".equals(displayErrorStack))
   {
     //fix for bug 4115406 -- mbuk
     if (MobileUtils.getMobileUtils().isAgentPDA(pageContext))
     {
%>
       <tr> 
       <td style="padding-bottom:15px" class="errorText"> Click <span class="pageLink"> <a  href="/OA_HTML/OAErrorDetailPage.jsp"> here </a></span> for exception details. </td>
       </tr>
<%
     }
     else 
     {
%>   
        <tr> 
        <td  style="padding-bottom:15px" class="errorText"> Click <span class="pageLink"><a href=javascript:ignoreWarnAboutChanges("/OA_HTML/OAErrorDetailPage.jsp")> here </a></span> for exception details. </td>
        </tr>
<%
      }
%>
        <tr>
        <td style="padding-bottom:25px" class="errorText">

<%    
      if ("Y".equals((String) session.getValue("_about_page_dataCollected")))
     
     
      {
        session.removeValue("_about_page_dataCollected");

 //Lauren bug #5549758 -- Build the URL programmatically
        // added by gustavo -         
        String url = "/OA_HTML/OA.jsp?page=/oracle/apps/fnd/framework/about/webui/OAAboutPG&OAMC=G";
        // and then add MAC encrypting stuff
        url = URLMgr.processOutgoingURL(url, wctx);        

%>
        <span class="pageLink"> <a href="<%= url %>">About Previous Page</a></span>
<%
      }
      else
      {
%>
        &nbsp; 
<%
       }
    }
   
%>       
        </td>
        </tr>

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
<%
  //Lauren bug #5549758 -- We need a to free the WebAppsContext to free system resources
  // added by gustavo - 
	wctx.freeWebAppsContext();
%>