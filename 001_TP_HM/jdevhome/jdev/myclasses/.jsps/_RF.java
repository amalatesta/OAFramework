
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.io.*;
import java.net.*;
import oracle.apps.fnd.common.VersionInfo;
import oracle.apps.fnd.functionSecurity.Function;
import oracle.apps.fnd.functionSecurity.RunFunction;


public class _RF extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID =
  "$Header: RF.jsp 120.1 2005/09/29 08:09:43 rosthoma ship $";  public static final boolean RCS_ID_RECORDED =
  VersionInfo.recordClassVersion(RCS_ID,"oa_html"); 
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
    _RF page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      out.write(__oracle_jsp_text[2]);
      out.write(__oracle_jsp_text[3]);
      out.write(__oracle_jsp_text[4]);
      out.write(__oracle_jsp_text[5]);
      out.write(__oracle_jsp_text[6]);
      out.write(__oracle_jsp_text[7]);
      
      
        RunFunction rf = null;
        String url = null;
      
        try
        {
          rf = new RunFunction(request,response,
            new PrintWriter(new BufferedWriter(out)));
      
          if(rf.init())
          {
            url = rf.getURL();
            String type = rf.getFunction().getType();
      
            if(rf.isForwardable())
            {
              rf.close();
              int index = url.indexOf("/OA_HTML/");
      
              if("true".equalsIgnoreCase(request.getParameter("debug")))
              {
                out.println(url.substring(index + 9));
              }
              else
              {
                
      if (true) {
        String __url=OracleJspRuntime.toStr(url.substring(index + 9));
        // Forward 
        pageContext.forward( __url);
        return;
      }

      
              }
            }
            else
            {
              rf.close();
              response.sendRedirect(url);
            }
          }
          else
          {
            //
            // Check if an error URL was set in the RunFunction object -
            // if so, redirect to it.
            //
            url = rf.getErrorURL();
            if ( url != null ) response.sendRedirect(url);
          }
        }
        catch(Exception e)
        {
          response.getWriter().println("<pre>" + "An exception occured." + "\n");
          response.getWriter().println("<pre>" + "URL=" + url + "\n");
          response.getWriter().println("<pre>" + e.toString());
          e.printStackTrace();
        }
        finally
        {
          if(rf != null)
          {
            rf.close();
          }
        }
      
      
      out.write(__oracle_jsp_text[8]);

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
  private static final char __oracle_jsp_text[][]=new char[9][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\n\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\n".toCharArray();
    __oracle_jsp_text[4] = 
    "\n".toCharArray();
    __oracle_jsp_text[5] = 
    "\n\n".toCharArray();
    __oracle_jsp_text[6] = 
    "\n".toCharArray();
    __oracle_jsp_text[7] = 
    "\n\n".toCharArray();
    __oracle_jsp_text[8] = 
    "\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
