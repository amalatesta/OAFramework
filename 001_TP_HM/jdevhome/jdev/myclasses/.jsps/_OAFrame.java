
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.io.File;
import java.util.StringTokenizer;
import oracle.cabo.ui.ServletRenderingContext;
import oracle.cabo.ui.beans.layout.FrameBorderLayoutBean;
import oracle.cabo.ui.beans.layout.FrameBean;
import oracle.apps.fnd.framework.webui.OAWebBeanConstants;
import oracle.apps.fnd.framework.server.OAUtility;
import oracle.apps.fnd.common.WebAppsContext;
import oracle.apps.fnd.framework.OAException;
import oracle.apps.fnd.security.HMAC;
import oracle.apps.fnd.framework.webui.URLMgr;
import oracle.apps.fnd.framework.webui.OAJSPHelper;
import oracle.apps.fnd.framework.webui.OAMACUtils;
import oracle.apps.fnd.common.WebRequestUtil;
import oracle.apps.fnd.framework.OACommonUtils;;


public class _OAFrame extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations


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
    _OAFrame page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      
        final String APPLICATION_JSP = "OA.jsp";
        final String FRAMEFUNCTIONS_DELIMETER = ":";
        final String ICX_SESSION_VALID = "VALID";
      
        // String dbcFile = System.getProperty("JTFDBCFILE");
        // WebAppsContext wac = new WebAppsContext(dbcFile);
        //Fix for bug 3589148: Do not pass the dbc parameter
        // String dbcName = request.getParameter("dbc");
        String transactionid = request.getParameter("transactionid");
        String sessionid = request.getParameter("sessionid");
        String frameSources = request.getParameter("OAFunc");
        String frameDimensions = request.getParameter(OAWebBeanConstants.FRAME_DIMENSIONS);
      
        StringBuffer baseUrl = new StringBuffer(50);
        baseUrl.append(request.getScheme()).append("://").append(
          request.getHeader("Host")).append("/OA_HTML/");
      
        StringBuffer parameters = new StringBuffer(100);
        // parameters.append("&dbc=").append(dbcName);
        parameters.append("&transactionid=").append(transactionid);
        parameters.append("&sessionid=").append(sessionid);
          
        ServletRenderingContext rContext = new ServletRenderingContext(pageContext);
      
      
      out.write(__oracle_jsp_text[2]);
      
        String[] frameFuncs = new String[3];
        StringTokenizer funcTokens =
          new StringTokenizer(frameSources, FRAMEFUNCTIONS_DELIMETER);
      
        int funcCount = funcTokens.countTokens();
        for(int i=0; i < funcCount;  i++ )
        {
          frameFuncs[i] = funcTokens.nextToken();
        }  
      
        // Determine the width of the start frame and height of the top frame.
        String[] frameDims = {"20%", "175"};
        if( frameDimensions != null && !"".equals(frameDimensions) )
        {
          StringTokenizer frameDimTokens =
            new StringTokenizer(frameDimensions, FRAMEFUNCTIONS_DELIMETER);
      
          int dimCount = frameDimTokens.countTokens();
          for(int i=0; i < dimCount;  i++ )
          {
            frameDims[i] = frameDimTokens.nextToken().toLowerCase();
            frameDims[i] = (frameDims[i].indexOf("p") != -1) ?
                            frameDims[i].replace('p', '%') :
                            frameDims[i];
          }
        }
      
        // Start MAC change
        WebAppsContext ctx = null;
        HMAC hmac = null;
      
        if (OAMACUtils.isMacEnabled(request) || OAMACUtils.isMacLiteEnabled(request))
        {
        
          ctx = OAUtility.getWebAppsContext(OAUtility.getDbcName());
      
          String sessionStatus =
            WebRequestUtil.validateContext(request, response, ctx);
      
          if ( ! ICX_SESSION_VALID.equals(sessionStatus) )
          {
            // Redirect to login page and do not proceed further.
            return;
          }
          else if (sessionStatus == null) // Unexpected error occurred.
          {
            // Get the error stack and throw exception if error stack is not empty.
            OAException oaException =
              OACommonUtils.processAOLJErrorStack(ctx.getErrorStack());
            if (oaException != null)
              throw oaException;
          }
      
          hmac = new HMAC(HMAC.HMAC_MD5);
          hmac.setKey(ctx.getMacKey());
          boolean check = URLMgr.processIncomingURL(request, hmac);
      
          if(check == false)
            throw new OAException("FND", "FND_INSUFF_PRIVILEGES");
      
          ctx.freeWebAppsContext();
        }
        // End MAC change
      
        FrameBorderLayoutBean frameBorderLayout = new FrameBorderLayoutBean();
        
        FrameBean topFrame = new FrameBean();
        topFrame.setName(OAWebBeanConstants.TOPFRAME_NAME);
        topFrame.setHeight(frameDims[1]);
        if( frameFuncs[0] != null )
        {
          // top frame should just have the header
          if (OAMACUtils.isMacEnabled(request) || OAMACUtils.isMacLiteEnabled(request))
          {
            topFrame.setSource(
              URLMgr.processOutgoingURL(
              (new StringBuffer(baseUrl.toString()).append(APPLICATION_JSP).append(
                "?OAFunc=").append(frameFuncs[0]).append(parameters.toString()).append(
                '&').append(OAWebBeanConstants.OA_PAGELAYOUT_RENDER_STYLE).append(
                "=").append(OAWebBeanConstants.PAGELAYOUT_HEADER_ONLY)).toString()
              , hmac) );
          }
          else
          {
            topFrame.setSource(
              (new StringBuffer(baseUrl.toString()).append(APPLICATION_JSP).append(
                "?OAFunc=").append(frameFuncs[0]).append(parameters.toString()).append(
                '&').append(OAWebBeanConstants.OA_PAGELAYOUT_RENDER_STYLE).append(
                "=").append(OAWebBeanConstants.PAGELAYOUT_HEADER_ONLY)).toString() );
          }
        }
        
        FrameBean startFrame = new FrameBean();
        startFrame.setName(OAWebBeanConstants.STARTFRAME_NAME);
        startFrame.setWidth(frameDims[0]);
        if( frameFuncs[1] != null )
        {
          if (OAMACUtils.isMacEnabled(request) || OAMACUtils.isMacLiteEnabled(request))
          {
            startFrame.setSource(
              URLMgr.processOutgoingURL(
              (new StringBuffer(baseUrl.toString()).append(APPLICATION_JSP).append(
                "?OAFunc=").append(frameFuncs[1]).append(parameters.toString())).toString()
              , hmac) );
          }
          else
          {
            startFrame.setSource(
              (new StringBuffer(baseUrl.toString()).append(APPLICATION_JSP).append(
                "?OAFunc=").append(frameFuncs[1]).append(parameters.toString())).toString() );
          }
        }
        
        FrameBean centerFrame = new FrameBean();
        centerFrame.setName(OAWebBeanConstants.CENTERFRAME_NAME);
        if( frameFuncs[2] != null )
        {
          // center/content frame should not contain the header
          if (OAMACUtils.isMacEnabled(request) || OAMACUtils.isMacLiteEnabled(request))
          {
            centerFrame.setSource(
              URLMgr.processOutgoingURL(
              (new StringBuffer(baseUrl.toString()).append(APPLICATION_JSP).append(
                "?OAFunc=").append(frameFuncs[2]).append(parameters.toString()).append(
                '&').append(OAWebBeanConstants.OA_PAGELAYOUT_RENDER_STYLE).append(
                "=").append(OAWebBeanConstants.PAGELAYOUT_NO_HEADER)).toString()
              , hmac) );
          }
          else
          {
            centerFrame.setSource(
              (new StringBuffer(baseUrl.toString()).append(APPLICATION_JSP).append(
                "?OAFunc=").append(frameFuncs[2]).append(parameters.toString()).append(
                '&').append(OAWebBeanConstants.OA_PAGELAYOUT_RENDER_STYLE).append(
                "=").append(OAWebBeanConstants.PAGELAYOUT_NO_HEADER)).toString() );
          }
        }
        
        frameBorderLayout.setCenter(centerFrame);
        frameBorderLayout.setStart(startFrame);
      
        frameBorderLayout.setTop(topFrame);  
      
        frameBorderLayout.render(rContext);
        
      
      out.write(__oracle_jsp_text[3]);

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
  private static final char __oracle_jsp_text[][]=new char[4][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "<!-- $Header: OAFrame.jsp 120.14 2005/07/02 04:58:17 atgops1 noship $ -->\r\n<!-- Author : Kandasamy P Athimoolam -->\r\n<!-- Created : 09/24/2003 -->\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n\r\n<html>\r\n<head>\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n\r\n</head>\r\n\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n</html>".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
