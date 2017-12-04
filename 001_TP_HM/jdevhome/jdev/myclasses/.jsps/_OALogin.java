
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import oracle.apps.fnd.sso.SSOManager;


public class _OALogin extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: OALogin.jsp 120.14 2005/07/02 04:58:23 atgops1 noship $"; 
  private String decodeString(String inData, String encoding)
  {
    String returnStr = inData;

    if ((inData != null) && (!("".equals(inData))))
    {
      try
      {
        returnStr = new String(inData.getBytes("8859_1"), encoding);
      }
      catch(Exception e)
      {
        returnStr = inData;
      }
    }
    return returnStr;
  }

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
    PageContext pageContext = JspFactory.getDefaultFactory().getPageContext( this, request, response, null, true, JspWriter.DEFAULT_BUFFER, true);
    // Note: this is not emitted if the session directive == false
    HttpSession session = pageContext.getSession();
    int __jsp_tag_starteval;
    ServletContext application = pageContext.getServletContext();
    JspWriter out = pageContext.getOut();
    _OALogin page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      out.write(__oracle_jsp_text[2]);
      
        String pageEncoding = request.getParameter("IANA_ENCODING");
        if ((pageEncoding==null) || ("".equals(pageEncoding)))   pageEncoding = "iso-8859-1";
        response.setContentType("text/html;charset=" + pageEncoding);
      
        String redirectURL  = decodeString(request.getParameter("goToURL"), pageEncoding);
        String errorMessage = decodeString(request.getParameter("msg"),     pageEncoding);
        String redirectPHP  = request.getParameter("goToPHP");
        String cancelURL    = SSOManager.getLoginUrl();
      
        String loginUrl = ((redirectPHP == null || "".equals(redirectPHP.trim())) ? SSOManager.getLoginUrlWithErrText(redirectURL, cancelURL, null, errorMessage) : 
           // Once the SSO bug 3174633 is fixed, replace "APPSHOMEPAGE" with a null value.
           // Instead of hardcoding the login URL, we should have SSO resolve the login URL
           // for us from the profile options.  If we pass in "APPSHOMEPAGE", SSO resolves
           // the login URL for us.
           SSOManager.getLoginUrlWithErrText("APPSHOMEPAGE", cancelURL, null, errorMessage));
           //SSOManager.getLoginUrlWithErrText(request.getScheme() + "://" + request.getHeader("Host") + "/OA_HTML/OA.jsp?OAFunc=OAHOMEPAGE", cancelURL, null, errorMessage));
      
        response.sendRedirect(loginUrl);
      
      out.write(__oracle_jsp_text[3]);
      out.write(__oracle_jsp_text[4]);

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
  private static final char __oracle_jsp_text[][]=new char[5][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[4] = 
    "\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
