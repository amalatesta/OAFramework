<%@ taglib uri="/webapp/taglib.tld" prefix="jbograph" %>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<%@ page contentType="text/html;charset=windows-1252"   import="oracle.dss.graph.*, oracle.adf.model.*, oracle.adf.model.binding.*, oracle.jbo.uicli.jui.JUPanelBinding"%>

<c:set var="bindings" value="${data.{%BINDING_CONTAINER_REF_NAME%}}"></c:set>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Graph page</title>
</head>
<body>
<H2>Graph page</H2>


<jbograph:Graph data="${bindings.{%GRAPH_DATA_ATTR%}}" >


</jbograph:Graph>




</body>
</html>
