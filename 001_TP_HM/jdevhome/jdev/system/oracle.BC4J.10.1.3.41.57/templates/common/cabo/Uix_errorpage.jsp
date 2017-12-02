<%@ page isErrorPage="true" contentType="text/html;charset={%charset%}"%>
<%@ taglib  uri="http://xmlns.oracle.com/uix/ui"  prefix="uix" %>

<uix:document>
<uix:head title="{|RES_ERRORPAGE_TITLE|}">
<uix:styleSheet/>
</uix:head>
<uix:body>
<uix:header text="{|RES_ERRORPAGE_TITLE|}" />
<uix:messageBox message="<%= exception.getMessage() %>" />
<BR>
<%
if (exception instanceof oracle.jbo.JboException)
{
%>
<uix:separator />
<%
	oracle.jbo.JboException ex2 = (oracle.jbo.JboException)exception;
        
    Object[] details = ex2.getDetails();

    for (int i = 0; i < details.length; i++)
    {
		Object detail = details[i];

        Exception e = (Exception) detail;

%>
        <uix:inlineMessage message="<%= e.getLocalizedMessage() %>" />
<%
    }
}
  // print exception details
  java.io.ByteArrayOutputStream outstrm = new java.io.ByteArrayOutputStream();
  java.io.PrintWriter writer = new java.io.PrintWriter(outstrm);

  exception.printStackTrace(writer);
  writer.flush();
  String sExceptionDetails = outstrm.toString();
%>
<uix:separator />
<uix:inlineMessage message="{|RES_UIX_ERRORPAGE_DETAILS|}" />
<uix:rawText preText="<pre>" postText="</pre>"><%= sExceptionDetails %></uix:rawText>
<uix:contentFooter/>

</uix:body>
</uix:document>

