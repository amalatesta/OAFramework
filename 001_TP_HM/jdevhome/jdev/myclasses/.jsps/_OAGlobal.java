
import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;


public class _OAGlobal extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String __RCS_ID = "$Header: OAGlobal.jsp 120.20 2006/07/04 04:09:41 atgops1 noship $";  private static java.lang.reflect.Method __sHttpSetReqCharacterEncoding;  private static java.lang.reflect.Method __sOJSPSetReqCharacterEncoding; 
  static
  {
    __sHttpSetReqCharacterEncoding=null;
    __sOJSPSetReqCharacterEncoding=null;
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
    if(classLoader==null)
      classLoader = String.class.getClassLoader();
    try
    {
      Class c = classLoader.loadClass("javax.servlet.http.HttpServletRequest"); 
      Class[] parameterTypes = {String.class}; 
      __sHttpSetReqCharacterEncoding = c.getMethod("setCharacterEncoding", parameterTypes); 
    }
    catch(Exception e){}    
    try
    {
      Class c = classLoader.loadClass("oracle.jsp.util.PublicUtil"); 
      Class[] paramTypes = {HttpServletRequest.class, String.class}; 
      __sOJSPSetReqCharacterEncoding = c.getMethod("setReqCharacterEncoding", paramTypes); 
    }
    catch(Exception e){}
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
    _OAGlobal page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      out.write(__oracle_jsp_text[2]);
      out.write(__oracle_jsp_text[3]);
      out.write(__oracle_jsp_text[4]);
      
        final String __encodingKey = "oracle.apps.fnd.ICX_CLIENT_IANA_ENCODING";
      
        // Bug 5642756 Use Servlet Context, session is no longer needed
        //javax.servlet.http.HttpSession __session = request.getSession(true);
      
        String __encoding = null;
        try
        {
      // Bug 5642756 Use Servlet Context
      //    __encoding = (String)__session.getValue(__encodingKey);
          __encoding = (String) application.getAttribute(__encodingKey);
      
          if(__encoding==null || "".equals(__encoding)) 
          {
              oracle.apps.fnd.common.AppsContext ctx = null;
      
              try {
               ctx = new oracle.apps.fnd.common.AppsContext(oracle.apps.fnd.common.DBC.getFileName());
              } 
              catch (Exception npe) {} //ignore NullPointException getFileName may throw
      
            if(ctx!=null)  
              __encoding = ctx.getProfileStore().getProfile("ICX_CLIENT_IANA_ENCODING");
      
            if(__encoding==null || "".equals(__encoding))
              __encoding = "ISO-8859-1";
      
            // Bug 5642756 Use Servlet Context
            //__session.putValue(__encodingKey, __encoding);
            // set on servlet context
            application.setAttribute(__encodingKey, __encoding); 
      
            if(ctx!=null)  
              ctx.free();
           }
        }
        catch(Exception e){}
      
        try
        {
          if(__encoding!=null && !"".equals(__encoding))
          {
            //Set Request Encoding
            String reqCharacterEncoding = request.getCharacterEncoding(); 
            if(reqCharacterEncoding == null || (__encoding!=null && !reqCharacterEncoding.equals(__encoding)))
            {    
              if(__sHttpSetReqCharacterEncoding!=null)
              {
                try
                {
                  Object[] params = {__encoding};
                  __sHttpSetReqCharacterEncoding.invoke(request, params);
                }
                catch(Exception e)
                {
                  if(__sOJSPSetReqCharacterEncoding!=null)
                  {
                    try
                    {
                      Object[] params = {request, __encoding}; 
                      __sOJSPSetReqCharacterEncoding.invoke(null, params);             
                    }
                    catch(Exception e2){}
                  }
                }
              }          
              else if(__sOJSPSetReqCharacterEncoding!=null)
              {
                try
                {
                  Object[] params = {request, __encoding}; 
                  __sOJSPSetReqCharacterEncoding.invoke(null, params);         
                }
                catch(Exception e){}
              }
            }         
      
            //Set Response Encoding
            response.setContentType("text/html; charset=" + __encoding);
          }
        }
        catch(Exception e)
        {
           out.println("<PRE>");
           e.printStackTrace(new java.io.PrintWriter(out));
           out.println("</PRE>");
        }
        
      
      out.write(__oracle_jsp_text[5]);

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
  private static final char __oracle_jsp_text[][]=new char[6][];
  static {
    try {
    __oracle_jsp_text[0] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n\r\n\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n".toCharArray();
    __oracle_jsp_text[3] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[4] = 
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[5] = 
    "\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
