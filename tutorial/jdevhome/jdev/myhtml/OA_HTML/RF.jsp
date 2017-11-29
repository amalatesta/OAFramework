<%--
/*===========================================================================+
 |      Copyright (c) 2002 Oracle Corporation, Redwood Shores, CA, USA       |
 |                         All rights reserved.                              |
 +===========================================================================+
 |  FILENAME                                                                 |
 |    RF.jsp                                                                 | 
 |                                                                           |
 |  DESCRIPTION                                                              |
 |    RF.jsp validates a session and determines whether a user has access    |
 |    to a specified function.  If the function is found to be accessible    |
 |    to the user, RF.jsp re-directs the user to the function's URL.         |
 |                                                                           |
 |  DEPENDENCIES                                                             |
 |                                                                           |
 |  HISTORY                                                                  |
 |    13-DEC-02  RTSE  Created.                                              |
 +===========================================================================*/
--%>

<%@ page import="java.io.*"%>
<%@ page import="java.net.*"%>
<%@ page import="oracle.apps.fnd.common.VersionInfo"%>
<%@ page import="oracle.apps.fnd.functionSecurity.Function"%>
<%@ page import="oracle.apps.fnd.functionSecurity.RunFunction"%>

<%! public static final String RCS_ID =
  "$Header: RF.jsp 120.1 2005/09/29 08:09:43 rosthoma ship $"; %>
<%! public static final boolean RCS_ID_RECORDED =
  VersionInfo.recordClassVersion(RCS_ID,"oa_html"); %>

<%

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
          %><jsp:forward page="<%= url.substring(index + 9) %>" /><%
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

%>
