<%@ page language="java" contentType="text/html;charset=ISO-8859-1" %>
<%@ taglib  uri="/webapp/DataTags.tld"  prefix="jbo" %>
<%
   String frameType = request.getParameter("frame");
   String appModId = request.getParameter("appModId");
   String lovVO = request.getParameter("lovvo");
%>   
<jbo:DataSource id="ds" appid="<%=appModId%>" viewobject="<%=lovVO%>" />
<% if (frameType == null || request.getParameter("frame").length() == 0)
   {
%>
<HTML>
<HEAD>
<script language=javascript>
document.write("<title>" + opener.modalWin.windowTitle + "</title>");
</script>
<LINK REL=STYLESHEET TYPE="text/css" HREF="/webapp/cabo/images/cabo_styles.css">
<script language="javascript" src="/webapp/cabo/jslib/cabo_utilities.js"></script>
<script language=javascript>
image_dir="/webapp/cabo/" + image_dir;
jslib_dir="/webapp/cabo/" + jslib_dir;
</script>
<script language="javascript" src="/webapp/cabo/jslib/modal_page_content.js"></script>
</HEAD>

<FRAMESET cols="6,*,6" frameborder=no border=0 framespacing=0 onLoad="if (opener) opener.blockEvents(); forceFocus()" onUnload="closeme()" onFocus="forceFocus()">
<FRAME SRC="javascript:top.blankframe()" name="border1" marginwidth=0 marginheight=0 scrolling=no>
<FRAMESET rows="90,*,70">
<FRAME name="LOVSearch"  SRC="/webapp/jsp/lov.jsp?appModId=<%=appModId%>&lovvo=<%=lovVO%>&attr=<%=request.getParameter("attr")%>&dattr=<%=request.getParameter("dattr")%>&frame=lovsearch" marginwidth=0 scrolling=no>
<FRAME name="LOVData"    SRC="/webapp/jsp/lov.jsp?appModId=<%=appModId%>&lovvo=<%=lovVO%>&attr=<%=request.getParameter("attr")%>&dattr=<%=request.getParameter("dattr")%>&frame=lovdata" scrolling=auto>
<FRAME name="LOVButtons" SRC="/webapp/jsp/lov.jsp?appModId=<%=appModId%>&lovvo=<%=lovVO%>&attr=<%=request.getParameter("attr")%>&dattr=<%=request.getParameter("dattr")%>&frame=lovbutton" marginwidth=0 scrolling=no>
</FRAMESET>
<FRAME SRC="javascript:top.blankframe()" name="border2" marginwidth=0 scrolling=no>
</FRAMESET>
</HTML>
<%
   }
   else if (frameType.equals("lovsearch"))
   {
%>
<HTML>
<HEAD>
<LINK REL=STYLESHEET TYPE="text/css" HREF="/webapp/cabo/images/cabo_styles.css">
<script src="/webapp/cabo/jslib/cabo_utilities.js" language="javascript"></script>
<script language=javascript>
image_dir="/webapp/cabo/" + image_dir;
jslib_dir="/webapp/cabo/" + jslib_dir;
</script>
<script src="/webapp/cabo/jslib/button_constructor.js" language="javascript"></script>
</HEAD>
<BODY class=appswindow TOPMARGIN=5>
<FORM NAME="sform" METHOD="POST" action="/webapp/jsp/lov.jsp" target="LOVData">
<script language="javascript">
fd = new button("text:Find; gap:wide; actiontype:function; action:document.sform.submit()");
</script>
<TABLE CELLPADDING=0 CELLSPACING=0 BORDER=0 WIDTH=100%>
<TR class=panel><TD ROWSPAN=2 colspan=2><IMG SRC=/webapp/cabo/images/panel_top_left.gif height=5 width=5></TD><TD WIDTH=1000 HEIGHT=1 class=highlight><IMG SRC=/webapp/cabo/images/pixel_color6.gif></TD><TD ROWSPAN=2 colspan=2><IMG SRC=/webapp/cabo/images/panel_top_right.gif height=5 width=5></TD></TR>
<TR><TD height=4 class=panel><img src=/webapp/cabo/images/pixel_gray5.gif></td></tr>
<TR><TD width=1 class=highlight><img src=/webapp/cabo/images/pixel_color6.gif></td><td width=4 class=panel><img src=/webapp/cabo/images/pixel_gray5.gif></td>
<TD class=panel COLSPAN=3 HEIGHT=100 valign=top>
<TABLE cellpadding=0 border=0 width=100%>
<tr><td colspan=2>
<FONT class=datablack>
<%=request.getParameter("attr")%> (<%=ds.getRowSet().getEstimatedRowCount()%> possible)
</font>
</td></tr>
<input type="HIDDEN" name="appModId" value="<%=appModId%>">
<input type="HIDDEN" name="lovvo" value="<%=lovVO%>">
<input type="HIDDEN" name="attr" value="<%=request.getParameter("attr")%>">
<input type="HIDDEN" name="dattr" value="<%=request.getParameter("dattr")%>">
<input type="HIDDEN" name="frame" value="lovdata">
<tr>
  <td align=left><input type="text" name="svalue" size=30 value="%"></td>
  <td align=left width=66%><script language=javascript>fd.render(window);</script></td>
</tr>
<tr><td height=2></td></tr>
<tr><td colspan=2 bgcolor=black height=0><img src=/webapp/cabo/images/pixel_color1.gif></td></tr>
<tr><td colspan=2 align=right></td></tr>
</table>
</TD></TR></TABLE>
</FORM>
</BODY>
</HTML>
<%
   }
   else  if (frameType.equals("lovdata"))
   {
%>
<HTML>
<HEAD>
<LINK REL=STYLESHEET TYPE="text/css" HREF="/webapp/cabo/images/cabo_styles.css">
</HEAD>
<BODY class=panel>
<jbo:DataWebBean id="ldata" datasource="ds" wbclass="oracle.jbo.html.databeans.JSLOV" >
<%
   ldata.setFilter(request.getParameter("svalue"));
   ldata.setReturnValue(request.getParameter("attr"));
   ldata.setDisplayAttributes(request.getParameter("dattr"));
%>   
</jbo:DataWebBean>
<% ldata.render(); %>
</BODY>
</HTML>
<%
   }
   else  if (frameType.equals("lovbutton"))
   {
%>
<HTML>
<HEAD>
<LINK REL=STYLESHEET TYPE="text/css" HREF="/webapp/cabo/images/cabo_styles.css">
<script language="javascript" src="/webapp/cabo/jslib/cabo_utilities.js"></script>
<script language=javascript>
image_dir="/webapp/cabo/" + image_dir;
jslib_dir="/webapp/cabo/" + jslib_dir;
</script>
<script src="/webapp/cabo/jslib/button_constructor.js" language="javascript"></script>
<script language=javascript>
cancel = new button("shape:RR; text:Cancel; gap:wide; defaultbutton:true; actiontype:function; action:parent.handleCancel();");
<%--
prev = new button("shape:RS; text:Previous Set; gap:wide; url:/webapp/jsp/lov.jsp?lovvo=<%=lovVO%>&attr=<%=request.getParameter("attr")%>&dattr=<%=request.getParameter("dattr")%>&frame=lovdata; targetframe:LOVData");
next = new button("shape:SR; text:Next Set; gap:wide; url:/webapp/jsp/lov.jsp?lovvo=<%=lovVO%>&attr=<%=request.getParameter("attr")%>&dattr=<%=request.getParameter("dattr")%>&frame=lovdata; targetframe:LOVData");
navbar = new buttonRow(prev,next);
 --%>
</script>
</HEAD>
<BODY class=appswindow>

<FORM name=navigation>
<!--
<TABLE WIDTH=100% class=panel CELLPADDING=0 CELLSPACING=0 BORDER=0>
<TR><TD ALIGN=middle VALIGN=middle>
<script language=javascript>
navbar.render(window);
</script>
</TD></TR>
</TABLE>
-->
<TABLE width=100% cellpadding=0 cellspacing=0 border=0>
<TR>
<TD class=panel rowspan=3 align=left valign=bottom width=10><IMG src='/webapp/cabo/images/container_bottom_left.gif' height=5 width=5></TD>
<TD class=panel height=5 width=1000><IMG src='/webapp/cabo/images/pixel_gray5.gif' height=2></TD>
<TD class=panel rowspan=3 align=right valign=bottom width=10><IMG src='/webapp/cabo/images/container_bottom_right.gif' height=5 width=5></TD>
</TR>
<TR><TD class=panel nowrap><IMG src='/webapp/cabo/images/pixel_gray5.gif' width=1></TD></TR>
<TR><TD class=panel><IMG src='/webapp/cabo/images/pixel_gray5.gif' height=1></TD></TR>
</TABLE>
<TABLE WIDTH=100% class=appswindow CELLPADDING=0 CELLSPACING=0 BORDER=0>
<TR><TD HEIGHT=3><IMG SRC=/webapp/cabo/images/pixel_color3.gif></TD></TR>
<TR><TD ALIGN=right VALIGN=middle>
<script language=javascript>
cancel.render(window);
</script>
</TD></TR>
</TABLE>
</FORM>

</BODY>
</HTML>
<jbo:ReleasePageResources releasemode="Stateless" />
<%
   }
%>
