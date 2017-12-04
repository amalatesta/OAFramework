
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import oracle.apps.fnd.framework.webui.OAJSPHelper;
import oracle.apps.fnd.framework.webui.OAPageBean;
import oracle.apps.fnd.framework.webui.OAGenericDispatcher;
import oracle.cabo.ui.jsps.GenericEntry;


public class _OA extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: OA.jsp 120.21 2005/09/13 09:46:53 atgops1 noship $"; 
  // ** End Declarations

  public void _jspService(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException, ServletException {

    response.setContentType( "text/html");
    /* set up the intrinsic variables using the pageContext goober:
    ** session = HttpSession
    ** application = ServletContext
    ** out = JspWriter
    ** page = this
    ** config = ServletConfig
    ** all session/app beans declared in globals.jsa
    */
    PageContext pageContext = JspFactory.getDefaultFactory().getPageContext( this, request, response, "OAErrorPage.jsp", true, JspWriter.DEFAULT_BUFFER, true);
    // Note: this is not emitted if the session directive == false
    HttpSession session = pageContext.getSession();
    int __jsp_tag_starteval;
    ServletContext application = pageContext.getServletContext();
    JspWriter out = pageContext.getOut();
    _OA page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      oracle.apps.fnd.framework.webui.OAPageBean pageBean;
      synchronized (request) {
        if ((pageBean = (oracle.apps.fnd.framework.webui.OAPageBean) pageContext.getAttribute( "pageBean", PageContext.REQUEST_SCOPE)) == null) {
          pageBean = (oracle.apps.fnd.framework.webui.OAPageBean) new oracle.apps.fnd.framework.webui.OAPageBean();
          pageContext.setAttribute( "pageBean", pageBean, PageContext.REQUEST_SCOPE);
        }
      }
      
        if (!((GenericEntry.getGenericDispatcher(pageContext)) instanceof OAGenericDispatcher))
          GenericEntry.setGenericDispatcher (pageContext, new OAGenericDispatcher());    
      
        OAJSPHelper.setRequestCharacterEncoding(pageContext);
      
        // Bug 2577443 - clear cache only after a hot-redeploy
        OAPageBean.clearWebBeanCache(session, request);
      
        // Synchronize threads within one session -- fix for bug 1911272
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
            redirectURL = pageBean.preparePage(pageContext);
      
            if (redirectURL != null)
            {
      
      out.write(__oracle_jsp_text[0]);
      if (true) {
        String __url=OracleJspRuntime.toStr(redirectURL);
        // Forward 
        pageContext.forward( __url);
        return;
      }

      out.write(__oracle_jsp_text[1]);
      
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
            pageBean.finalizeRequest(request, redirectURL);
          }
        } // end - synchronized (sessionLock)
      
      out.write(__oracle_jsp_text[2]);

    }
    catch (Throwable e) {
      if (!(e instanceof javax.servlet.jsp.SkipPageException)){
        try {
          if (out != null) out.clear();
        }
        catch (Exception clearException) {
        }
        pageContext.handlePageException(e);
      }
    }
    finally {
      OracleJspRuntime.extraHandlePCFinally(pageContext, true);
      JspFactory.getDefaultFactory().releasePageContext(pageContext);
    }

  }
  private static final char __oracle_jsp_text[][]=new char[3][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n        ".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
