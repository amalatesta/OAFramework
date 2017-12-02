<%--
   This is a global jsp page that will be included at the begining of all pages
   running in OC4J container.
   It will set the correct response and request encoding according to the
   site level ICX_CLIENT_IANA_ENCODING profile option value.
--%>

<%! public static final String __RCS_ID = "$Header: OAGlobal.jsp 120.20 2006/07/04 04:09:41 atgops1 noship $"; %>


<%! private static java.lang.reflect.Method __sHttpSetReqCharacterEncoding; %>
<%! private static java.lang.reflect.Method __sOJSPSetReqCharacterEncoding; %>

<%!
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
%>

<%
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
  
%>
