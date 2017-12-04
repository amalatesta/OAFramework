<% 
  String enc = request.getParameter("enc");
  if ((enc == null) || "".equals(enc) || enc.indexOf("\r") != -1 || enc.indexOf("\n") != -1)
    response.setContentType("text/html");
  else
    response.setContentType("text/html;charset=" + enc);
%>
<%@ page language="java" import="java.util.*" %>
<HTML>
<HEAD>
<LINK REL=STYLESHEET TYPE="text/css" HREF="/webapp/css/bc4j.css">
<TITLE>Calendar</TITLE>
<SCRIPT>
  function doCancel()
  {
    top.returnValue = (void 0);
    top.close();
    
    return false;
  }
  
  function selectDate(dateTime)
  {    
    top.returnValue = dateTime;
    top.close();
    
    return false;
  }
</SCRIPT>
</HEAD>
<BODY class="appswindow" leftMargin="5" topMargin="5" onunload="_checkUnload(event)">
<script src="/webapp/cabo/jsLibs/MarlinCore.js"></script>

<jsp:useBean id="cal"  class="oracle.jdeveloper.jsp.wb.CalendarWB" scope="request" >
<% cal.initialize(pageContext); %>
</jsp:useBean>
<table cellpadding="0" cellspacing="0" border="0" class="CalendarEnabled">
<tr class="CalendarTitle">
  <td align="left"><%
    boolean isEnabled = cal.isPreviousMonthEnable();

    if (isEnabled)
    {
%><a href="<%=cal.getPreviousMonthUrl()%>"><%
    }
%><img border="0" src="/webapp/cabo/images/icon_previous.gif" width="24" height="24"><%
    if (isEnabled)
    {
%></a><%
    }
%></td>
  <td colspan="<%=cal.dowCount-2%>" class="CalendarTitle"><%=cal.getMonth()%> <%=cal.getYear()%></td>
  <td align="right"><%
    isEnabled = cal.isNextMonthEnable();

    if (isEnabled)
    {
%><a href="<%=cal.getNextMonthUrl()%>"><%
    }
%><img border="0" src="/webapp/cabo/images/icon_next.gif" width="24" height="24"><%
    if (isEnabled)
    {
%></a><%
    } %>    
  </td>
</tr>
<tr class="CalendarHeader"><%
  String[] shortWeekdays = cal.dateSymbols.getShortWeekdays();
    
  for (int i = cal.firstDOW; i <= cal.lastDOW; i++)
  {
%><th class="CalendarHeader"><%=shortWeekdays[i]%></th><%
  }
%></tr>
<tr><%
   cal.getCalendar().set(Calendar.DAY_OF_MONTH, cal.getFirstDOM());

   // output the days from the previous month in the first week
   int firstDOWInMonth = cal.firstDOW - cal.getCalendar().get(Calendar.DAY_OF_WEEK);

   if (firstDOWInMonth < 0)
   {
      // move to the previous month
      cal.getCalendar().add(Calendar.MONTH, -1);
      
      // get the count of the last day of the the previous month
      int prevLastDOM = cal.getActualMaximumDayOfMonth() -
                        cal.getActualMinimumDayOfMonth() + 1;      
      
      int firstPrevLastDOM = prevLastDOM + firstDOWInMonth + 1;
      
      for (int i = firstPrevLastDOM; i <= prevLastDOM; i++)
      {
%><td><span class="CalendarDisabled"><%=i%></span></td><%
      } 
 
      // move back to the current month
      cal.getCalendar().add(Calendar.MONTH, 1);
    }

    int  currDOM    = cal.getFirstDOM();
    long currTime   = cal.getCalendar().getTime().getTime();
    cal.getCalendar().add(Calendar.DATE,1);
    long nextTime   = cal.getCalendar().getTime().getTime(); 

    int currLastDOW = firstDOWInMonth + cal.dowCount; 
                                                        
    // output the days in this month
    do
    {
      for (; (currDOM <= currLastDOW) && (currDOM <= cal.getLastDOM()); currDOM++)
      {
        boolean enabledDay = cal.isDayEnable(currTime);
%><td><%
        String styleClass = "CalendarEnabled";
        
        if (enabledDay)
        {
          if (cal.isSelectedDay(currTime, nextTime))
          {          
            // use the style for the selected day
            styleClass = "CalendarSelected";
          }
          
          //
          // even though the selected day doesn't show a link,
          // a link is generated to handle the case where the
          // user wants to select todays date, but hasn't supplied
          // a date in the date field. (see bug #1482511)
          //
          String currFormatedTime = cal.getFormatedTime(currTime);
%><a href="" onclick="return selectDate(<%=currFormatedTime%>)"><%
        }
        else
        {
          // use the style for the disabled day
          styleClass = "CalendarDisabled";
        }
%><span class="<%=styleClass%>"><%=currDOM%></span><%
        if (enabledDay)
        {
%></a><%
        }
%></td><%
        // move to the next day in time
        currTime = nextTime;
        cal.getCalendar().add(Calendar.DATE,1); 
        nextTime = cal.getCalendar().getTime().getTime(); 
      }
      
      if (currDOM <= cal.getLastDOM())
      {
        // end the current week row and start next week's row
%></tr>
<tr><%        
        currLastDOW += cal.dowCount;
      }
      else
      {
        break;
      }
    } while (true);

    // output the days from the next month in the last week
    int lastDOWInMonth = currLastDOW - currDOM + 1;
    
    if (lastDOWInMonth > 0)
    {
      // move to the next month
      cal.getCalendar().add(Calendar.MONTH, 1);
      
      // get the count of the last day of the the previous month
      int nextFirstDOM = cal.getActualMinimumDayOfMonth();      
      int nextLastDOM  = nextFirstDOM + lastDOWInMonth - 1;
      
      for (int i = nextFirstDOM; i <= nextLastDOM; i++)
      {
%><td><span class="CalendarDisabled"><%=i%></span></td><%
      } 
    }
%></tr>
</table>

</BODY>
</HTML>