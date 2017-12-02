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
    "\n\n".toCharArray();
    __oracle_jsp_text[1] = 
    "\n\n\n<html>\n<head>\n<script>\n// Object containing information about the user agent\nvar _agent = new Object();\n\n\n/**\n * Returnt rue if the agent is atLeast the specified agent type and version.\n */\nfunction _atLeast(\n  kind,\n  version\n  )\n{  \n  return (!kind    || (kind    == _agent.kind))    &&\n         (!version || (version <= _agent.version));\n}\n\n/**\n * initialize information about the agent\n */\nfunction _agentInit()\n{\n  // convert all characters to lowercase to simplify testing \n  var agentString = navigator.userAgent.toLowerCase();\n    \n  var version = parseFloat(navigator.appVersion);\n\n  var isOpera = false;\n  var isIE    = false;\n  var isNav   = false;\n  var kind    = \"unknown\";\n  \n  if (agentString.indexOf(\"msie\") != -1)\n  {\n    isIE = true;\n    \n    // extract ie's version from the ie string\n    var matches = agentString.match(/msie (.*);/);\n    version = parseFloat(matches[1]);\n    kind = \"ie\";\n  }\n  else if (agentString.indexOf(\"opera\") != -1)\n  {\n    isOpera = true\n    kind = \"opera\";\n  }\n  else if ((agentString.indexOf('mozilla')    != -1) &&\n           (agentString.indexOf('spoofer')    == -1) &&\n           (agentString.indexOf('compatible') == -1))\n  {\n    isNav = true;\n    kind = \"nn\";\n  }\n  \n  _agent.isIE = isIE;\n  _agent.isNav = isNav;\n  _agent.isOpera = isOpera;\n  _agent.version = version\n  _agent.kind = kind;\n  \n  _agent.atLeast = _atLeast;\n}\n\n\n_agentInit();\n\n/**\n * Returns the object containing the dependent windows.\n */\nfunction _getDependents(\n  parentWindow,\n  createIfNecessary\n  )\n{\n  var depends;\n  \n  if (parentWindow)\n  {\n    depends = parentWindow[\"_dependents\"];\n    \n    if (depends == (void 0))\n    {\n      if (createIfNecessary)\n      {\n        depends = new Object();\n        parentWindow[\"_dependents\"] = depends;\n      }\n    }\n  }\n  \n  return depends;\n}\n\n/**\n * Get the named dependent\n */\nfunction _getDependent(\n  parentWindow,\n  dependentName\n  )\n{\n  var depends = _getDependents(parentWindow);\n  var dependent;\n  \n  if (depends)\n  {\n    dependent = depends[dependentName];\n  }\n  \n  return dependent;\n}\n\n\n/**\n * Sets the value of the named dependent\n */\nfunction _setDependent(\n  parentWindow,\n  dependentName,\n  dependentValue\n  )\n{\n  var depends = _getDependents(parentWindow, true);\n  \n  if (depends)\n  {\n    depends[dependentName] = dependentValue;\n  }\n}\n\n\n/**\n * Returns the dependent which is modal.\n */\nfunction _getModalDependent(\n  parentWindow\n  )\n{\n  return _getDependent(parentWindow, \"modalWindow\");\n}\n\n/**\n * Returns the dependent which is modal and is still open.\n */\nfunction _getValidModalDependent(\n  parentWindow\n  )\n{\n  var modalDependent = _getModalDependent(parentWindow);\n  \n  if (modalDependent)\n  {\n    if (modalDependent.closed)\n    {\n      _setDependent(parentWindow, \"modalWindow\", (void 0));\n      modalDependent = (void 0);\n    }\n  }\n  \n  return modalDependent;\n}\n\n\n/**\n * Returns true if the passed in dependent is the modal dependent\n * of the parent window,\n */\nfunction _isModalDependent(\n  parentWindow,\n  dependent\n  )\n{\n  return (dependent == _getModalDependent(parentWindow));\n}\n\n\n/**\n * Called by the unloda handler of modal windows to call the event\n * handler and make sure that the parent window is updated appropriately\n * to show that no modal window is up anymore.\n */\nfunction _checkUnload(\n  event\n  )\n{  \n  var parentWindow = top.opener;\n    \n  var unloader = _getDependent(parentWindow, self.name);\n \n  if (_isModalDependent(parentWindow, self))\n  {\n    // remove the modal window\n    _setDependent(parentWindow, \"modalWindow\", (void 0));\n\n    parentWindow.onfocus = null;\n    \n    // release the ie mouse grab\n    if (_agent.atLeast(\"ie\", 4))\n    {\n      parentWindow.document.body.releaseCapture();\n      parentWindow.document.body.style.filter = null;\n    }\n    \n    // release the netscape mouse grab\n    if (_agent.atLeast(\"nn\"))\n    {\n      parentWindow.releaseEvents(Event.CLICK);\n      \n      // stop eating all of the mouse clicks\n      parentWindow.onclick = null;\n    }\n  }\n  \n  if (unloader != (void 0))\n  {        \n    // remove our dependent info\n    _setDependent(parentWindow, self.name, (void 0));\n    \n    // try the passed in event (netscape way first), then\n    // try to get the event the IE way\n    if (event == (void 0))\n      event = self.event;\n    \n    // call the unloader with the unloading window and the event \n    unloader(top, event);\n  }\n}\n</script>\n</head>\n".toCharArray();
    __oracle_jsp_text[2] = 
    "\n</html>\n".toCharArray();
    }
    catch (Throwable th) {
      System.err.println(th);
    }
}
}
