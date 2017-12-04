package _cabo._jsps;

import oracle.jsp.runtime.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;


public class _frameRedirect extends com.orionserver.http.OrionHttpJspPage {


  // ** Begin Declarations

 public static final String RCS_ID = "$Header: frameRedirect.jsp 120.0.12010000.3 2008/11/18 12:25:56 sette ship $"; 
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
    _frameRedirect page = this;
    ServletConfig config = pageContext.getServletConfig();

    try {


      out.write(__oracle_jsp_text[0]);
      out.write(__oracle_jsp_text[1]);
      
        String redirectString = request.getParameter("redirect");
        //7305015 - Redirect only if the redirect url starts with /  
        if (redirectString != null && redirectString.startsWith("/"))
        {
          out.println("<frameset rows=\"100%,*\" border=\"0\" onload=\"top.document.title = top.frames[0].document.title\" onunload=\"_checkUnload(event)\">");
          out.println("<frame src=\"" + redirectString + "?" + request.getQueryString() + "\">");
          out.println("</frameset>");
        }
      
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
    "\r\n\r\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\r\n\r\n\r\n<html>\r\n<head>\r\n<script>\r\n// Object containing information about the user agent\r\nvar _agent = new Object();\r\n\r\n\r\n/**\r\n * Returnt rue if the agent is atLeast the specified agent type and version.\r\n */\r\nfunction _atLeast(\r\n  kind,\r\n  version\r\n  )\r\n{  \r\n  return (!kind    || (kind    == _agent.kind))    &&\r\n         (!version || (version <= _agent.version));\r\n}\r\n\r\n/**\r\n * initialize information about the agent\r\n */\r\nfunction _agentInit()\r\n{\r\n  // convert all characters to lowercase to simplify testing \r\n  var agentString = navigator.userAgent.toLowerCase();\r\n    \r\n  var version = parseFloat(navigator.appVersion);\r\n\r\n  var isOpera = false;\r\n  var isIE    = false;\r\n  var isNav   = false;\r\n  var kind    = \"unknown\";\r\n  \r\n  if (agentString.indexOf(\"msie\") != -1)\r\n  {\r\n    isIE = true;\r\n    \r\n    // extract ie's version from the ie string\r\n    var matches = agentString.match(/msie (.*);/);\r\n    version = parseFloat(matches[1]);\r\n    kind = \"ie\";\r\n  }\r\n  else if (agentString.indexOf(\"opera\") != -1)\r\n  {\r\n    isOpera = true\r\n    kind = \"opera\";\r\n  }\r\n  else if ((agentString.indexOf('mozilla')    != -1) &&\r\n           (agentString.indexOf('spoofer')    == -1) &&\r\n           (agentString.indexOf('compatible') == -1))\r\n  {\r\n    isNav = true;\r\n    kind = \"nn\";\r\n  }\r\n  \r\n  _agent.isIE = isIE;\r\n  _agent.isNav = isNav;\r\n  _agent.isOpera = isOpera;\r\n  _agent.version = version\r\n  _agent.kind = kind;\r\n  \r\n  _agent.atLeast = _atLeast;\r\n}\r\n\r\n\r\n_agentInit();\r\n\r\n/**\r\n * Returns the object containing the dependent windows.\r\n */\r\nfunction _getDependents(\r\n  parentWindow,\r\n  createIfNecessary\r\n  )\r\n{\r\n  var depends;\r\n  \r\n  if (parentWindow)\r\n  {\r\n    depends = parentWindow[\"_dependents\"];\r\n    \r\n    if (depends == (void 0))\r\n    {\r\n      if (createIfNecessary)\r\n      {\r\n        depends = new Object();\r\n        parentWindow[\"_dependents\"] = depends;\r\n      }\r\n    }\r\n  }\r\n  \r\n  return depends;\r\n}\r\n\r\n/**\r\n * Get the named dependent\r\n */\r\nfunction _getDependent(\r\n  parentWindow,\r\n  dependentName\r\n  )\r\n{\r\n  var depends = _getDependents(parentWindow);\r\n  var dependent;\r\n  \r\n  if (depends)\r\n  {\r\n    dependent = depends[dependentName];\r\n  }\r\n  \r\n  return dependent;\r\n}\r\n\r\n\r\n/**\r\n * Sets the value of the named dependent\r\n */\r\nfunction _setDependent(\r\n  parentWindow,\r\n  dependentName,\r\n  dependentValue\r\n  )\r\n{\r\n  var depends = _getDependents(parentWindow, true);\r\n  \r\n  if (depends)\r\n  {\r\n    depends[dependentName] = dependentValue;\r\n  }\r\n}\r\n\r\n\r\n/**\r\n * Returns the dependent which is modal.\r\n */\r\nfunction _getModalDependent(\r\n  parentWindow\r\n  )\r\n{\r\n  return _getDependent(parentWindow, \"modalWindow\");\r\n}\r\n\r\n/**\r\n * Returns the dependent which is modal and is still open.\r\n */\r\nfunction _getValidModalDependent(\r\n  parentWindow\r\n  )\r\n{\r\n  var modalDependent = _getModalDependent(parentWindow);\r\n  \r\n  if (modalDependent)\r\n  {\r\n    if (modalDependent.closed)\r\n    {\r\n      _setDependent(parentWindow, \"modalWindow\", (void 0));\r\n      modalDependent = (void 0);\r\n    }\r\n  }\r\n  \r\n  return modalDependent;\r\n}\r\n\r\n\r\n/**\r\n * Returns true if the passed in dependent is the modal dependent\r\n * of the parent window,\r\n */\r\nfunction _isModalDependent(\r\n  parentWindow,\r\n  dependent\r\n  )\r\n{\r\n  return (dependent == _getModalDependent(parentWindow));\r\n}\r\n\r\n\r\n/**\r\n * Called by the unloda handler of modal windows to call the event\r\n * handler and make sure that the parent window is updated appropriately\r\n * to show that no modal window is up anymore.\r\n */\r\nfunction _checkUnload(\r\n  event\r\n  )\r\n{  \r\n  var parentWindow = top.opener;\r\n    \r\n  var unloader = _getDependent(parentWindow, self.name);\r\n \r\n  if (_isModalDependent(parentWindow, self))\r\n  {\r\n    // remove the modal window\r\n    _setDependent(parentWindow, \"modalWindow\", (void 0));\r\n\r\n    parentWindow.onfocus = null;\r\n    \r\n    // release the ie mouse grab\r\n    if (_agent.atLeast(\"ie\", 4))\r\n    {\r\n      parentWindow.document.body.releaseCapture();\r\n      parentWindow.document.body.style.filter = null;\r\n    }\r\n    \r\n    // release the netscape mouse grab\r\n    if (_agent.atLeast(\"nn\"))\r\n    {\r\n      parentWindow.releaseEvents(Event.CLICK);\r\n      \r\n      // stop eating all of the mouse clicks\r\n      parentWindow.onclick = null;\r\n    }\r\n  }\r\n  \r\n  if (unloader != (void 0))\r\n  {        \r\n    // remove our dependent info\r\n    _setDependent(parentWindow, self.name, (void 0));\r\n    \r\n    // try the passed in event (netscape way first), then\r\n    // try to get the event the IE way\r\n    if (event == (void 0))\r\n      event = self.event;\r\n    \r\n    // call the unloader with the unloading window and the event \r\n    unloader(top, event);\r\n  }\r\n}\r\n</script>\r\n</head>\r\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\r\n</html>\r\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
