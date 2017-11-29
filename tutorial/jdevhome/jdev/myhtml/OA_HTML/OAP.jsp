<%@ page
  language    = "java"
  contentType = "text/html"
  errorPage   = "OAErrorPage.jsp"
  import      = "oracle.apps.fnd.framework.webui.OAJSPHelper"
%>

<%! public static final String RCS_ID = "$Header: OAP.jsp 120.22 2005/09/13 09:47:03 atgops1 noship $"; %>

<jsp:useBean
  id          = "pageBean"
  class       = "oracle.apps.fnd.framework.webui.OAPageBean"
  scope       = "request">
</jsp:useBean>

<%
  // Bug 3184117: Non-ASCII parameters are turned into garbage even if it
  // encoded correctly.
  OAJSPHelper.setRequestCharacterEncoding(pageContext);

  //Bug5857608 - Synchronize threads within one session.  
  Object sessionLock = null;
  synchronized (session)
  {
    sessionLock = pageBean.getSessionLock(session);
  }

  synchronized (sessionLock)
  {
   String redirectURL = null;
   try
   {
    redirectURL = pageBean.preparePage(pageContext, true);

    if (redirectURL != null)
    {
%>
      <jsp:forward page="<%= redirectURL %>" />
<%
    }
    pageBean.renderDocument();
  }
  catch (Exception e)
  {
    pageBean.registerSevereException(e);
  }
  catch (Error err)
  {
    // Catastrophic error - print stack trace to logs to assist debugging
    err.printStackTrace();
    throw err;
  }
  finally
  {
    // Fix for bug 5584243 - Swallow the NPE.
    try
    {
      pageBean.finalizeRequest(request, redirectURL);
    }
    catch( Exception e ){}
  }
 } // end - synchronized (sessionLock)
%>
