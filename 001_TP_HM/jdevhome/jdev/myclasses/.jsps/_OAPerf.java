
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import oracle.apps.fnd.framework.webui.OAJSPHelper;


public class _OAPerf extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: OAPerf.jsp 120.14 2005/07/02 04:58:27 atgops1 noship $"; 
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
    _OAPerf page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      
        // Session values in this jsp need not be passivated, and hence values can
        // be put directly into session.
        String isRedirect = (String)session.getValue("redirect") == null ? "no" : (String)session.getValue("redirect");
        session.putValue("redirect", isRedirect);
        if (isRedirect.equals("no"))
        {
          System.gc();
          session.putValue("start",     new Long(System.currentTimeMillis()));
          session.putValue("totalmem1", new Long(Runtime.getRuntime().totalMemory()));
          session.putValue("freemem1",  new Long(Runtime.getRuntime().freeMemory()));
        }
      
      out.write(__oracle_jsp_text[1]);
      out.write(__oracle_jsp_text[2]);
      oracle.apps.fnd.framework.webui.OAPageBean pageBean;
      synchronized (request) {
        if ((pageBean = (oracle.apps.fnd.framework.webui.OAPageBean) pageContext.getAttribute( "pageBean", PageContext.REQUEST_SCOPE)) == null) {
          pageBean = (oracle.apps.fnd.framework.webui.OAPageBean) new oracle.apps.fnd.framework.webui.OAPageBean();
          pageContext.setAttribute( "pageBean", pageBean, PageContext.REQUEST_SCOPE);
          out.write(__oracle_jsp_text[3]);
        }
      }
      out.write(__oracle_jsp_text[4]);
      
      
        // Bug 3184117: Non-ASCII parameters are turned into garbage even if it 
        // encoded correctly.
        OAJSPHelper.setRequestCharacterEncoding(pageContext);
      
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
            redirectURL  = pageBean.preparePage(pageContext);
      
            if(redirectURL != null)
            {
              session.putValue("redirect", "yes");
      
      out.write(__oracle_jsp_text[5]);
      if (true) {
        String __url=OracleJspRuntime.toStr(redirectURL);
        // Forward 
        pageContext.forward( __url);
        return;
      }

      out.write(__oracle_jsp_text[6]);
      
            }
            else
            {
              session.putValue("redirect", "no");
            }
            pageBean.renderDocument();
      
      out.write(__oracle_jsp_text[7]);
      
            long end = System.currentTimeMillis();
            long start_long = ((Long)session.getValue("start")).longValue();
            out.println("<BR><BR>Time Elapsed = " + (end - start_long));
            out.println("<BR>");
      
            long totalMem1 = ((Long)session.getValue("totalmem1")).longValue();
            long freeMem1  = ((Long)session.getValue("freemem1")).longValue();
            long totalMem2 = Runtime.getRuntime().totalMemory();
            long freeMem2  = Runtime.getRuntime().freeMemory();
      
            out.println("<BR>Total Mem1 = " + totalMem1);
            out.println("<BR>Total Mem2 = " + totalMem2);
            out.println("<BR>Total MemDiff = " + (totalMem1 - totalMem2));
            out.println("<BR><BR>Free Mem1 = " + freeMem1);
            out.println("<BR>Free Mem2 = " + freeMem2);
            out.println("<BR>Free MemDiff = " + (freeMem2 - freeMem1));
      
            out.println("<BR>");
            out.println("<BR>");
      
      out.write(__oracle_jsp_text[8]);
      
          }
          catch (Exception e) 
          { 
            pageBean.registerSevereException(e); 
          }
          finally
          {
            pageBean.finalizeRequest(request, redirectURL);
          }
        } // end - synchronized (sessionLock)
      
      out.write(__oracle_jsp_text[9]);

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
  private static final char __oracle_jsp_text[][]=new char[10][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[4] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[5] = 
    "\r\n        ".toCharArray();
    __oracle_jsp_text[6] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[7] = 
    "\r\n\r\n<html>\r\n".toCharArray();
    __oracle_jsp_text[8] = 
    "\r\n\r\n</html>\r\n\r\n".toCharArray();
    __oracle_jsp_text[9] = 
    "\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
