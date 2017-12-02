/*=================================================================+
|               Copyright (c) 2009 Oracle Corporation              |
|                  Redwood Shores, California, USA                 |
|                       All rights reserved.                       |
+==================================================================+
| FILENAME                                                         |
|   lookAheadLOV.js                                                |
|                                                                  |
| HISTORY                                                          |
|   27-JAN-2009 grajago  Created.                                  |
+==================================================================*/
/* $Header: lookAheadLOV.js 120.0.12010000.34 2010/05/12 04:23:37 sette noship $ */

var Lsuggestions = new Array();
var LMACValues = new Array();
var Loutp;
var Ldata;
var Loldins;
var Lposi = 0; 
var Lwords = new Array();
var Linput;
var Lkey;
var LxmlHttp = null;
var LcurrentElement;
var LcurrentSearchString = "";
var LoutputElement = "LLAOutput";
var LtableElement = "lovSuggestTable";
var LsuggestTable;
var LviewAttrNames = new Array();
var LcolumnTypes = new Array();
var LcolumnNames = new Array();
var LsearchAttrName = "";
var LsearchAttrColumn = -1;
var LsearchDispColumn = -1;
var LcurrentCount = -1;
var LamName = "";
//var transactionid = -1;
var LfetchString = "";
var LresultItems = new Array();
var LresultViewAttrs = new Array();
var LcriteriaItems = new Array();
var LprevID;
var LloadDone = true;
var LlookAheadSize = 50;
var LcaseSensitive = false;  // Bug 8478126 - GRAJAGO
var LlookAheadSearchType = "startsWith";
var LclientSidePopulation = true;
var LcurrentFetchString = "";
var LbeginBody = "<params>";
var LendBody = "</params>";
var LparamTagStart = "<param>";
var LparamTagEnd = "</param>";
var LNoDataText = "";
var Lurl;
var LprocessingMessage = "";
var LnavigationItemClicked = false;
var LlovOnChangeData = -1;
var LhidePopup = true;
var LrangeStart = 0;
var LlovVOName = null;
var LlovAMName = null;
var LlovhasNextData = 'false';
var LlovRecordsNavList = 0;
var LlovNavSelectedRecord = 0;
var LwordsLength = new Array(); // ER 8508961 - Word length for wild card support.
var Loffset = 0; // Bug 8538238 - GRAJAGO - Scrolling when using up and down key
var LdataOffset = 0;
var LheaderOffset = 0;
var LlookAheadMinChars = 3; // Bug 8652203 - Min chars to initiate look ahead.
var LoutpMouseDown = 0; //Bug#8527804 - Scrollbar handling in IE
var LcloseFlag = 0;
var LtempBean = "";
var LtimeAccounted = false;
var LattrsFetched = false;
var LprocessingVisible = false;
var LprevParameterString = -1;
var LcurrParameterString = -1;
var LeventSwallowed = false;
var LinitIconText = true; // Bug 8893801 - GRAJAGO
var LIconTextArray = new Array(5); // Bug 8893801 - GRAJAGO
var LvisibleRows = 10; // ER 8527852 - Use visible records property set on LOV.
var LcurrDH = -1; // ER 8527852 - Calculate offset based on visible records.
var Lbody = ""; // Bug 8546023: Switch x coordinate calculation logic per session language - tohkubo
var LonclickFunc;
var LcurrFuncExec = null;
var LhasOutputRecords = false;

/*** Initialization methods ***/

  function Linit()
  {
     LinitVariables();
     
    // Bug 8824663 & 8604079 - GRAJAGO 
    // Attach an event to process/modify the elements and variables on an PPR.
    LattachClearEvent();
    
    if(_agent.isIE)
    {
      Loutp.attachEvent('onmousedown', LhandleOutpMouseDown);
    }
    else if (_agent.isSafari) // Bug 9293276 - Safari also has scrolling issue.
    {
      Loutp.addEventListener('mousedown', LhandleOutpMouseDown, false);
    }
      
    // Binding the event to document rather than setting is directly to avoid 
    // issue reported in the bug 9679894.
    /*document.onkeydown = Lkeygetter; //needed for Opera...
    document.onkeyup = LkeyHandler;
    document.onclick = LclosePopup;*/
    if(navigator.userAgent.indexOf("Gecko") > -1)
    {
      document.addEventListener("keydown", Lkeygetter, false);
      document.addEventListener("keyup", LkeyHandler, false);
      document.addEventListener("click", LclosePopup, false);
    }
    else
    {
      document.attachEvent('onkeydown', Lkeygetter);
      document.attachEvent('onkeyup', LkeyHandler);
      document.attachEvent('onclick', LclosePopup);
    }
        
    // Bug 8893801 - GRAJAGO
    // Init text for the icons;
    LIconTextArray[0] = "Next functionality disabled";
    LIconTextArray[1] = "Select to view next set";
    LIconTextArray[2] = "Previous functionality disabled";
    LIconTextArray[3] = "Select to view previous set";
    LIconTextArray[4] = "Refine search";
    
    // Initialize XML-HTTP object.
    LgetXmlHttpObject();
    /*if(!(_agent.isIE))
      LxmlHttp.overrideMimeType('text/xml');*/    
  }
  
  function LinitVariables()
  {
   Loutp = document.getElementById(LoutputElement);
   LsuggestTable = document.getElementById(LtableElement);
    
   if (Loutp != null)
   {
     Ldata = document.getElementById('suggestData');
     Loutp.style.visibility = 'hidden';
     // Initialize the div properly, else it occupies some empty space when 
     // page is loaded.
     Loutp.style.position = 'absolute';
     LsuggestTable.className = 'x1h';
   }
   //Loffset = 18; // Bug 8538238 - GRAJAGO - Offset for scrolling.
    
   //document.getElementById("loading").style.visibility = 'hidden';
   if(_agent.isIE || _agent.isSafari) // Bug 9293276 - Safari also has scrolling issue.
   {
     //tableBody = LsuggestTable.firstChild;
     //tableBody = LsuggestTable.find('thead');
     var children = LsuggestTable.childNodes;
     for (i = 0; i < LsuggestTable.childNodes.length; i++)
     {
       var results = null;
       var childName = children[i].nodeName;
       var regExp = new RegExp("tbody", "i")
       results = childName.match(regExp);
       if (results != null)
       {
         var tableBody = children[i];
         LsuggestTable = tableBody;
         //Stop when the first body tag is found
         break;
       }
     }
     //Loffset = 18; // Bug 8538238 - GRAJAGO - Offset for scrolling.
   }
   
   // Bug 8546023: Switch x coordinate calculation logic per session language - tohkubo
   Lbody = document.getElementsByTagName("BODY")[0];
   
  }
  
  function LhandleOutpMouseDown()
  {
    if(LoutpMouseDown  == 0)
      LoutpMouseDown = 1;
    else if(LoutpMouseDown == -1)
       LoutpMouseDown = 0;
  }
  
  function LgetXmlHttpObject()
  {
    LxmlHttp = null;
    try
    {
      // Firefox, Opera 8.0+, Safari, IE 7
      LxmlHttp = new XMLHttpRequest();
    }
    catch (e)
    {
      // Other Internet Explorer versions.
      try
      {
	LxmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
      }
      catch (e)
      {
	LxmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
  }

  function LresetVariables()
  {
    Lsuggestions = new Array();
    LMACValues = new Array();
    Loldins = -1;
    Lposi = 0;
    Lwords = new Array();
    Linput = -1;
    LsearchAttrColumn = -1;
    LsearchDispColumn = -1;
    LNoDataText = "";
    LcaseSensitive = false; // Bug 8478126 - GRAJAGO
    // Bug 8558949 - GRAJAGO
    // Not clearing this variable causes no data fetch for any other LOV, for 
    // the same characters.
    LfetchString = "";
    LwordsLength = new Array(); // ER 8508961 - Word length for wild card support.
    // ER 8508940 - GRAJAGO
    // Reset the data related to navigation items.
    LlovOnChangeData = -1;
    LhidePopup = true;
    LlovHasNextData = 'false';
    LlovRecordsNavList = 0;
    LlovNavSelectedRecord = 0;
    // Bug 8652203 - GRAJAGO - Minimum number of chars to initiate look ahead.
    LlookAheadMinChars = 3;
    LtimeAccounted = false;
    LprevParameterString = -1;
    LeventSwallowed = false;
    // ER 8527852 - GRAJAGO
    LvisibleRows = 10; 
    LcurrDH = -1;
    LdataOffset = 0;
    LheaderOffset = 0;
  }

  function LsetPopupPosition()
  {
    var t = document.getElementsByName(LcurrentElement)[0];
    if (Loutp != null)
    {
      Loutp.style.position = 'absolute';
      // Place the inline lov a little below the LOV field.
      Loutp.style.top =  LfindPosY(t) + 3 + "px";
      if (isBiDi()) // Bug 8546023: Switch x coordinate calculation logic per session language - tohkubo
      {
        Loutp.style.right = Lbody.clientWidth - LfindPosX(t) - t.offsetWidth + 3 + "px";
      }
      else
      {
        Loutp.style.left = LfindPosX(t) + 3 + "px";
      }

    }
  }
  
/*** Utililty Methods ***/

  // Bug 8551372 - GRAJAGO
  // Function to show a message indicating the Lov fetching.
  function LshowProcessingMessage()
  {
    LhasOutputRecords = false;
    LclearOutput();
    var row = document.createElement("tr");
    var col = document.createElement("td");
    col.appendChild(document.createTextNode(LprocessingMessage));
    col.className = 'x1r x4m';
    row.appendChild(col);
    LsuggestTable.appendChild(row);
    LsetVisible('visible');
  }
  
  function LaddHeading()
  {
    var colNo = -1;
    var row = document.createElement("tr");
    var header2 = document.createElement("th");
    header2.className = 'x1r x4m';
    header2.noWrap = 'true';
    // Bug 8544343 - GRAJAGO
    // Define the mouse cursor appropraitely.
    header2.style.cursor = 'default';
    for (i = 0; i < LviewAttrNames.length; i++)
    {
      if (LcolumnTypes[i] == 0) continue;
      colNo++;
      var header = document.createElement("th");
      header.className = 'x1r x4m';
      header.noWrap = 'true';
      // Bug 8544343 - GRAJAGO
      // Define the mouse cursor appropraitely.
      header.style.cursor = 'default';
      // Last view attribute is row count - __lovSuggestTableRowCount.
      if (i == LviewAttrNames.length - 1)
      {
        //header.style.visibility = 'collapse';
        header.style.display = 'none';
        header.style.visibility = 'hidden';
        header2.style.display = 'none';
        header2.style.visibility = 'hidden';
        row.appendChild(header2);
      }
      else
        header.appendChild(document.createTextNode(LcolumnNames[colNo]));
      
      row.appendChild(header);
    }
    LsuggestTable.appendChild(row);
    // ER 8527852 - GRAJAGO
    // Get the offset for scrolling.
    LheaderOffset = LsuggestTable.offsetHeight;
  }

  // Bug 8478096/8509276 - GRAJAGO
  // Add one more column to track the number of records, so that position can be 
  // calculated. This will be used for 
  // * onclick event 
  // * navigational synching for mouseover and Up/Down keys.
  function LaddRecord(record, count)
  {
    LhasOutputRecords = true;
    var n = LsearchAttrColumn;
    var row = document.createElement("tr");
    //row.className = 'OraTableCellText OraTableBorder1111';
    // Bug 8478096/8509276
    // Column for the position for onclick property as well as synching 
    // mouseOver & Up/Down key navigations.
    var col2 = document.createElement("td"); 
    col2.noWrap = 'true';
    for (i = 0; i < LviewAttrNames.length; i++)
    {
      if (LcolumnTypes[i] == 0) continue;
      var col = document.createElement("td");
      col.noWrap = 'true';
      if (i == LsearchAttrColumn)
      {
        boldString = document.createElement("b");
        lineString = document.createElement("u");
        
        // ER 8508961 - GRAJAGO
        // Wild card support.
        // The length of the characters to be shown as bold and underlined is 
        // stored in an array.
        lineString.appendChild(document.createTextNode(record[i].substring(0, LwordsLength[count-1])));
        boldString.appendChild(lineString);
        col.appendChild(boldString);
        col.appendChild(document.createTextNode(record[i].substring(LwordsLength[count-1], record[i].length)));
        spanTag = document.createElement("span");
        spanTag.appendChild(document.createTextNode(record[i]));
        // Hide the text added second time. This added text is used for mouse 
        // click and key up/down events.
        spanTag.style.visibility = 'hidden';
        //spanTag.style.visibility = 'collapse';
        spanTag.style.display = 'none';
        col.appendChild(spanTag);
      }
      else
      {
        if (record[i] == undefined)
          col.appendChild(document.createTextNode(' '));
        else
          col.appendChild(document.createTextNode(record[i]));
      }
        
      // Bug 8544343 - GRAJAGO
      // Define the mouse cursor appropraitely.
      col.style.cursor = 'pointer';  
      col.className = 'x1l x50';
      
      // Bug 8478096/8509276
      if (i == LviewAttrNames.length - 1)
      {
        //col.style.visibility = 'collapse';
        col.style.visibility = 'hidden';
        col.style.display = 'none';
        col2.style.visibility = 'hidden';
        col2.style.display = 'none';
        col2.appendChild(document.createTextNode(count));
        row.appendChild(col2);
      }
      row.appendChild(col);
    }
    row.onmouseover = LmouseHandler;
    row.onmouseout = LmouseHandlerOut;
    row.onclick = LmouseClick;
    if(_agent.isIE || _agent.isSafari) // Bug 9293276 - Safari also has scrolling issue.
      row.onmousedown = LmouseDown;
    LsuggestTable.appendChild(row);
    
    // ER 8527852 - GRAJAGO
    // Get the offset for scrolling.
    if (count == 1)
      LdataOffset = LsuggestTable.lastChild.offsetHeight;
    
    // ER 8527852 - Use visible records property set on LOV to calculate offset.
    if (count == LvisibleRows)
    {
      LcurrDH = Ldata.offsetHeight;
    }
  }
  	  
  // ER 8508940 - GRAJAGO
  // Method to add Navigation bar.
  function LaddNavigationBar()
  {
    // Bug 8546023 - tohkubo
    // Navigation Bar BiDi Handling - adding image prefix per session language
    var imagePostfix = (isBiDi()) ? "-r":"";

    // Previous Icon.
    var prevData = document.createElement("td");
    prevData.style.valign = "middle";
    var prevImage = new Image();
    if (LrangeStart == 0)
    {
      // Disabled previous icon.
      // Bug 8893801 - GRAJAGO
      prevImage.title = LIconTextArray[2]; //"Previous functionality disabled";
      prevImage.alt = LIconTextArray[2]; //"Previous functionality disabled";
      prevImage.border = "0";
      // Bug 8546023 - tohkubo
      prevImage.src = "/OA_HTML/cabo/images/cache/ctnavpd" + imagePostfix + ".gif";
      prevData.appendChild(prevImage);
    }
    else
    {
      // Enabled previous icon.
      // Bug 8893801 - GRAJAGO
      prevImage.title = LIconTextArray[3]; //"Select to view previous set";
      prevImage.alt = LIconTextArray[3]; //"Select to view previous set";
      prevImage.border = "0";
      // Bug 8546023 - tohkubo
      prevImage.src = "/OA_HTML/cabo/images/cache/ctnavp" + imagePostfix + ".gif";
      var prevItem = document.createElement("a");
      
      // Bug 8659784 - GRAJAGO
      // LclosePopup gets called and hence previous/next navigation events get 
      // cancelled. Use addEventListener for previous icon, next icon and search
      // link events and do stopPropagation to avoid LclosePopup getting called
      // for non-IE browsers.
      if(navigator.userAgent.indexOf("Gecko") > -1)
        prevItem.addEventListener("click", function (e) { LtriggerPrevious(); e.stopPropagation();}, false); // prevItem.setAttribute("onclick", "LtriggerPrevious()");
      else
        prevItem.attachEvent('onclick', LtriggerPrevious);
      
      // Bug 9482049 - GRAJAGO
      // Using href resets the page. So, dont use href but change the cursor syle.
      //prevItem.href = '#';
      prevItem.style.cursor = "pointer";
      
      if(navigator.userAgent.indexOf("Gecko") > -1)
        prevItem.addEventListener("mouseover", LtriggerPrevNavMouseOver, false); // prevItem.setAttribute("onmouseover", "LtriggerPrevNavMouseOver();");
      else
        prevItem.attachEvent('onmouseover', LtriggerPrevNavMouseOver);
      
      if(navigator.userAgent.indexOf("Gecko") > -1)
        prevItem.addEventListener("mouseout", LtriggerNavMouseOut, false); // prevItem.setAttribute("onmouseout", 'LtriggerNavMouseOut();');
      else
        prevItem.attachEvent('onmouseout', LtriggerNavMouseOut);
      prevItem.appendChild(prevImage);
      prevData.appendChild(prevItem);
    }
    
    // Next icon.
    var nextData = document.createElement("td");
    nextData.style.valign = "middle";
    var nextImage = new Image();//document.createElement("image");
    if (LlovhasNextData == 'false' || Lwords.length < LlookAheadSize)
    {
      // Disabled next icon.
      // Bug 8893801 - GRAJAGO
      nextImage.title = LIconTextArray[0]; //"Next functionality disabled";
      nextImage.alt = LIconTextArray[0]; //"Next functionality disabled";
      nextImage.border = "0";
      // Bug 8546023 - tohkubo
      nextImage.src = "/OA_HTML/cabo/images/cache/ctnavnd" + imagePostfix + ".gif";
      nextData.appendChild(nextImage);
    }
    else
    {
      // Enabled next icon.
      // Bug 8893801 - GRAJAGO
      nextImage.title = LIconTextArray[1]; //"Select to view next set";
      nextImage.alt = LIconTextArray[1]; //"Select to view next set";
      nextImage.border = "0";
      // Bug 8546023 - tohkubo
      nextImage.src = "/OA_HTML/cabo/images/cache/ctnavn" + imagePostfix + ".gif";
      var nextItem = document.createElement("a");

      // Bug 9482049 - GRAJAGO
      // Using href resets the page. So, dont use href but change the cursor syle.
      //nextItem.href = '#';
      nextItem.style.cursor = "pointer";
      
      nextItem.appendChild(nextImage);
      if(navigator.userAgent.indexOf("Gecko") > -1)
        nextItem.addEventListener("click", function (e) { LtriggerNext(); e.stopPropagation();}, false); // nextItem.setAttribute("onclick", "LtriggerNext()");
      else
        nextItem.attachEvent('onclick', LtriggerNext); // Bug 8625498 - Use attachEvent.
      
      if(navigator.userAgent.indexOf("Gecko") > -1)
        nextItem.addEventListener("mouseover", LtriggerNextNavMouseOver, false); // nextItem.setAttribute("onmouseover", "LtriggerNextNavMouseOver();"); 
      else
        nextItem.attachEvent("onmouseover", LtriggerNextNavMouseOver);
      
      if(navigator.userAgent.indexOf("Gecko") > -1)
        nextItem.addEventListener("mouseout", LtriggerNavMouseOut, false); // nextItem.setAttribute("onmouseout", "LtriggerNavMouseOut();");
      else
        nextItem.attachEvent("onmouseout", LtriggerNavMouseOut);
      nextData.appendChild(nextItem);
    }
    
    // Spacers between each of the items in the navigational bar.
    var imageItem = new Image();
    imageItem.width = 5;
    imageItem.height = 1;
    imageItem.src = "/OA_HTML/cabo/images/swan/t.gif";
    var spacerData = document.createElement("td");
    spacerData.appendChild(imageItem);
    var imageItem2 = new Image();
    imageItem2.width = 5;
    imageItem2.height = 1;
    imageItem2.src = "/OA_HTML/cabo/images/swan/t.gif";
    var spacerData2 = document.createElement("td");
    spacerData2.appendChild(imageItem2);
    var imageItem1 = new Image();
    imageItem1.width = 5;
    imageItem1.height = 1;
    imageItem1.src = "/OA_HTML/cabo/images/swan/t.gif";
    var spacerData1 = document.createElement("td");
    spacerData1.appendChild(imageItem1);    
    
    // Text to indicate the row range visible.
    var selectChoiceData = document.createElement("td");
    selectChoiceData.style.valign = "middle";
    selectChoiceData.noWrap = 'true'; // Corrected the noWrap attribute.
    // Bug 8546023 - tohkubo
    // Navigation Bar BiDi Handling - adding spaces for "-" to have browser handle it correctly
    var choiceText = (LrangeStart * LlookAheadSize + 1) + ' - ' + (LrangeStart * LlookAheadSize + Lwords.length);
    var moreTextNode = document.createTextNode(choiceText);
    selectChoiceData.appendChild(moreTextNode);
    // Set the cursor to default not text.
    selectChoiceData.style.cursor = "default";
    
    // Choice to select a particular range of records will be included later.
    /* var rowSelect = document.createElement("select");
    rowSelect.className = 'x4';
    if(navigator.userAgent.indexOf("Gecko") > -1)
      rowSelect.setAttribute("onmouseout", "LtriggerNavMouseOut()");
    else
      rowSelect.onmouseout = 'LtriggerNavMouseOut()';
    if(navigator.userAgent.indexOf("Gecko") > -1)
      rowSelect.setAttribute("onmouseover", "LtriggerNavMouseOver('')");
    else
      rowSelect.onmouseover = 'LtriggerNavMouseOver("")';
    if(navigator.userAgent.indexOf("Gecko") > -1)
      rowSelect.setAttribute("onfocus", "LhandleFocusOnSelect()");
    else
      rowSelect.onfocus = 'LhandleFocusOnSelect()';
    
    if(navigator.userAgent.indexOf("Gecko") > -1)
      rowSelect.setAttribute("onchange", "LtriggerSelect()");
    else
      rowSelect.onchange = "LtriggerSelect()";
      
    if(navigator.userAgent.indexOf("Gecko") > -1)
      rowSelect.setAttribute("onclick", "LmouseClickForNavigation");
    else
      rowSelect.attachEvent('onclick', LmouseClickForNavigation);
    rowSelect.onfocus = 'LhandleFocusOnSelect()';
    rowSelect.onchange = 'LtriggerSelect()';
    for (var choiceCount = 0; choiceCount <= LlovRecordsNavList; choiceCount++)
    {
      var option1 = document.createElement("OPTION");
      var choiceText = (choiceCount * LlookAheadSize + 1) + '-' + ((choiceCount + 1) * LlookAheadSize);
      var choiceTextNode = document.createTextNode(choiceText);
      option1.appendChild(choiceTextNode);
      option1.value = choiceCount;
      if (choiceCount == LrangeStart)
        option1.selected = true;
      rowSelect.appendChild(option1);
    }
    var option2 = document.createElement("OPTION");
    var moreTextNode = document.createTextNode("More...");
    option2.appendChild(moreTextNode);
    option2.value = LlovRecordsNavList + 1;
    rowSelect.appendChild(option2);
    selectChoiceData.appendChild(rowSelect);*/
    
    // ER  - GRAJAGO
    // Search link to launch LOV window - UX team recommendation.
    var searchLinkData = document.createElement("td");
    // Bug 8624095 - GRAJAGO
    // The search icon should be aligned to the left.
    searchLinkData.style.width = '95%';
    searchLinkData.style.valign = "middle";
    searchLinkData.noWrap = 'true'; // Corrected the noWrap attribute.
    var searchLink = document.createElement("a");
    searchLink.id = 'lovSearchLink';

    // Bug 9482049 - GRAJAGO
    // Using href resets the page. So, dont use href but change the cursor syle.
    //searchLink.href = '#';
    searchLink.style.cursor = "pointer";
    searchLink.className = 'x41';
    
    var searchIcon = document.getElementsByName(LcurrentElement)[0].parentNode.getElementsByTagName('A')[0];
    
    // Bug 9044218 - GRAJAGO
    // Setting onclick directly attribute causes issues. Instead attach it.
    //searchLink.onclick = searchIcon.onclick;
    LonclickFunc = searchIcon.onclick;
    if(navigator.userAgent.indexOf("Gecko") > -1)
      searchLink.addEventListener("click", LonclickFunc, false); // searchLink.setAttribute("onmouseover", "LsearchMouseover();");
    else
      searchLink.attachEvent('onclick', LonclickFunc);
    
    // Bug 8703327 - GRAJAGO
    // Search link on the inline LOV should have same UI as LOV search icon.
    searchLink.innerHTML = searchIcon.innerHTML;
    // Bug 8732840 - GRAJAGO
    // Change alt and title attributes for the search icon in inline LOV.
    searchLink.firstChild.alt = LIconTextArray[4]; // "Refine Search";
    searchLink.firstChild.title = LIconTextArray[4]; // "Refine Search";
    
    if(navigator.userAgent.indexOf("Gecko") > -1)
      searchLink.addEventListener("mouseover", LsearchMouseover, false); // searchLink.setAttribute("onmouseover", "LsearchMouseover();");
    else
      searchLink.attachEvent('onmouseover', LsearchMouseover);//'LlovOnChangeData='+searchIcon.onclick;
    
    if(navigator.userAgent.indexOf("Gecko") > -1)
      searchLink.addEventListener("mouseout", LsearchMouseout, false); // searchLink.setAttribute("onmouseout", "LsearchMouseout();");
    else
      searchLink.attachEvent('onmouseout', LsearchMouseout);//'LlovOnChangeData=-1;';
    
    // Bug 8703327 - GRAJAGO
    /*var searchTextNode = document.createTextNode("Search...");
    searchLink.appendChild(searchTextNode);*/
    searchLinkData.appendChild(searchLink);
    
    // Add the above elements created to the navigational row.
    var row = document.createElement("tr");
    row.appendChild(searchLinkData);
    row.appendChild(spacerData1);
    row.appendChild(prevData);
    row.appendChild(spacerData2);
    row.appendChild(selectChoiceData);
    row.appendChild(spacerData);
    row.appendChild(nextData);
    row.onclick = LmouseClickForNavigation;
    var linkTable = document.getElementById('navigationTable');
    var bodyTable = document.createElement('tbody');
    bodyTable.appendChild(row);
    linkTable.appendChild(bodyTable);
  }
  
  function LsearchMouseover() 
  { 
    var temp = this.onclick;
    LlovOnChangeData = "" + temp;
    //LlovOnChangeData = '_chain(\"Loutp.style.visibility = \'hidden\'\", ' + temp + ', this, event, true)'; 
    LhidePopup = true;
  }
  
  function LsearchMouseout()
  { 
    LlovOnChangeData = -1;
    LhidePopup = true;
  }
  
  function LtriggerPrevious()
  {
    // Update these values only after getting the result successfully. This will
    // avoid values getting changed when the REST call errors out.
    /*LrangeStart--;
    LlovRecordsNavList--;*/
    LcurrFuncExec = "prev";
    LfetchMoreData();
    
    // Bug 9701570 - GRAJAGO
    // Lost focus is causing Tab to behave unexpectedly. So, set focus again.
    document.getElementsByName(LcurrentElement)[0].focus();
  }
  
  function LtriggerNext()
  {
    // Update these values only after getting the result successfully. This will
    // avoid values getting changed when the REST call errors out.
    /*LrangeStart++;
    LlovRecordsNavList++;*/
    LcurrFuncExec = "next";
    LfetchMoreData();
    
    // Bug 9701570 - GRAJAGO
    // Lost focus is causing Tab to behave unexpectedly. So, set focus again.
    document.getElementsByName(LcurrentElement)[0].focus();
  }
  
  function LtriggerSelect()
  {
    LrangeStart = LlovNavSelectedRecord;
    LfetchMoreData();
  }
  
  function LhandleFocusOnSelect()
  {
    LlovOnChangeData = "";
    LlovNavSelectedRecord = this.selectedIndex;
    LhidePopup = false;
  }
    
  function LfetchMoreData()
  {
    LshowProcessingMessage();
    LlovOnChangeData = -1;
    LhidePopup = false;
    if (LxmlHttp == null)
    {
      LgetXmlHttpObject();
      /*if(!(_agent.isIE))
        LxmlHttp.overrideMimeType('text/xml');*/
    }
    
    // Update these values only after getting the result. This will 
    // avoid values getting changed when the REST call errors out.
    var rangeStartValue = LrangeStart;
    if (LcurrFuncExec == "prev")
      rangeStartValue--;
    else if (LcurrFuncExec == "next")
      rangeStartValue++;
    
    var paramMethod = LparamTagStart + 'getMoreData' + LparamTagEnd;
    var paramAM = LparamTagStart + LamName + LparamTagEnd;
    var paramLovAM = LparamTagStart + LlovAMName + LparamTagEnd;
    var paramLovVO = LparamTagStart + LlovVOName + LparamTagEnd;
    var paramRangeStart = LparamTagStart + rangeStartValue + LparamTagEnd;
    var paramRangeSize = LparamTagStart + LlookAheadSize + LparamTagEnd;
    var paramElementName = LparamTagStart + LcurrentElement + LparamTagEnd;
    var body = LbeginBody + paramMethod + paramAM + paramLovAM + paramLovVO + paramRangeStart + paramRangeSize + paramElementName + LgetMACList() + LendBody;
    
    LxmlHttp.onreadystatechange = LparseXML;
    LxmlHttp.open("POST", Lurl, true);
    LxmlHttp.setRequestHeader("Content-type", "application/xml"); //LxmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    LxmlHttp.send(body);
  }
  
  function LtriggerNextNavMouseOver()
  {
    // Save the function to be triggered for onchange.
    LlovOnChangeData = 'LtriggerNext()';
    LhidePopup = false;
  }
  
  function LtriggerPrevNavMouseOver()
  {
    // Save the function to be triggered for onchange.
    LlovOnChangeData = 'LtriggerPrevious()';
    LhidePopup = false;
  }
  
  function LtriggerNavMouseOut()
  {
    LlovOnChangeData = -1;
    LhidePopup = true;
  }
  
  var LmouseClickForNavigation = function()
  {
    LsetVisible('visible');
    LlovOnChangeData = "";
    LhidePopup = false;
  }
  
  function LaddNoData()
  {
    LhasOutputRecords = false;
    LclearOutput();
    LaddHeading();
    var row = document.createElement("tr");
    var col = document.createElement("td");
    col.appendChild(document.createTextNode(LNoDataText));
    col.className = 'x1l x50';
    row.appendChild(col);
    
    // Bug 8621030 - GRAJAGO
    // Since NoDataText is already added, skip adding first data column.
    var firstTime = true;
    for (i = 0; i < LviewAttrNames.length; i++)
    {
      if (LcolumnTypes[i] == 0) continue;
      if (firstTime === true)
      {
        firstTime = false;
        continue;
      }
      col = document.createElement("td");
      col.noWrap = 'true';
      col.appendChild(document.createElement("br"));
      col.className = 'x1l x50';
      
      if (i == LviewAttrNames.length - 1)
      {
        //col.style.visibility = 'collapse';
        col.style.visibility = 'hidden';
        col.style.display = 'none';
      }

      // Bug 8544343 - GRAJAGO
      // Define the mouse cursor appropraitely.
      col.style.cursor = 'default';
      row.appendChild(col);
    }
    LsuggestTable.appendChild(row);
    LsetVisible('visible');
  }
  
  function LshowErrorMessages(errMessages)
  {
    if (errMessages != null && errMessages.length > 0)
    {
      LclearOutput();
      for (var count = 0; count < errMessages.length; count++)
      {
        var row = document.createElement("tr");
        var col = document.createElement("td");
        col.appendChild(document.createTextNode(errMessages[count]));
        col.className = 'x1r x4m';
        row.appendChild(col);
        LsuggestTable.appendChild(row);
      }
    }
    LsetVisible('visible');
  }

  function LclearOutput()
  {
    while (LsuggestTable.hasChildNodes())
    {
      var noten = LsuggestTable.firstChild;
      LsuggestTable.removeChild(noten);
    }
    // ER 8508940 - GRAJAGO - Navigation Bar.
    var linkTable = document.getElementById('navigationTable');
    while (linkTable.hasChildNodes())
    {
      var noten = linkTable.firstChild;
      linkTable.removeChild(noten);
    }
    
    // ER 8527852 - GRAJAGO.
    // Reset the height and width property before adding the data so as to 
    // provide the same UI everytime.
    LcurrDH = -1;
    Ldata.style.height = "";
    Ldata.style.overflowX = "hidden"; // Bug 8684209 - GRAJAGO - No horizontal scroll.
    Ldata.style.overflow = "";
    LsuggestTable.style.marginRight = '';
    Ldata.scrollTop = '';
    // Lposi = -1;
    Lposi = 0;
  }
  
  function LclosePopup(event)
  {
    if(LcloseFlag > 0)
    {
      LcloseFlag = 0;
      return;
    }

    // Bug 8567172 - GRAJAGO
    // Clear the inline LOV events to avoid unncessary server fetch if user
    // clicks out of the LOV field.
    clearTimeout(LprevID);
    if (LxmlHttp != null) LxmlHttp.abort();

    if (LnavigationItemClicked == true)
    {
      LnavigationItemClicked = false;
      return;
    }

    LsetVisible("hidden");
    Lpos = -1;
    Loldins = "";
    // Bug 8825012 - GRAJAGO
    // Trigger server side event if required. 
    // For click on the current input field, do not fire the event.
    // Bug 8849444 - MMUHANNA
    // validate that event is not null or undefined

    // Bug 8865386 - GRAJAGO
    // Avoid custom form submission for mouse click on the current LOV input.
    //if (event && event.target && event.target.id == LcurrentElement) return;
    var focusInputId = (void 0);
    
    if (window.event)
      focusInputId = window.event.srcElement.id;
    else if (event)
      focusInputId = event.target.id;
   
    if (focusInputId == LcurrentElement) return;

    triggerCustomOnChangeJS();
  }

  function LfindPosX(obj)
  {
    var curleft = 0;
    if (obj == null)
      return curleft;
      
    if (obj.offsetParent)
    {
      while (obj.offsetParent)
      {
	curleft += obj.offsetLeft;
	obj = obj.offsetParent;
      }
    }
    else if (obj.x)
      curleft += obj.x;
    return curleft;
  }

  function LfindPosY(obj)
  {
    var curtop = 0;
    if (obj == null)
      return curtop;
    
    if (obj.offsetParent)
    {
      curtop += obj.offsetHeight;
      while (obj.offsetParent)
      {
	curtop += obj.offsetTop;
	obj = obj.offsetParent;
      }
    }
    else if (obj.y)
    {
      curtop += obj.y;
      curtop += obj.height;
    }
    return curtop;
  }
  
  
  function LgetURLParam(name)
  {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return "";
    else
      return results[1];
  }
	
  function LsetColor (_posi, _color, _forg)
  {
    var row = LsuggestTable.childNodes[_posi];
    var colNo = 0;
    for (i = 0; i < LviewAttrNames.length; i++)
    {
      if (LcolumnTypes[i] == 0) continue;
      row.childNodes[colNo].style.background = _color;
      row.childNodes[colNo].style.color = _forg;
      colNo++;
    }
  }
  
  function LsetUnselected(_posi)
  {
    var row = LsuggestTable.childNodes[_posi]
    for (i = 0; i < LviewAttrNames.length; i++)
    {
      if (LcolumnTypes[i] == 0) continue;
      row.className = 'x1l x50';
    }
    LsetColor(_posi, "#f2f2f5", "#3c3c3c");
  }
  
  function LsetSelected(_posi)
  {
    var row = LsuggestTable.childNodes[_posi]
    for (i = 0; i < LviewAttrNames.length; i++)
    {
      if (LcolumnTypes[i] == 0) continue;
      row.className = 'x1l x50';
    }
    LsetColor(_posi, "#316fba", "#ffffff");
  }

  function LsetVisible(visi)
  {
    var x = document.getElementById(LoutputElement);
    if (x != null)
    {
      LsetPopupPosition();
      if (visi == 'hidden' && LhidePopup == false)
        return;
      x.style.visibility = visi;
    }
  }
  
  // Bug 8542073 - GRAJAGO
  // Exact match is required. When input contains special characters, these
  // should be escaped inorder to perform exact match.
  function LescapeSpecialCharacters(rawString)
  {
    var outputString = rawString;
    var filterRE = new RegExp("[\[\\\\\^\$\.\|\?\*\+\(\)\{\}]");
    var replacementChars = new Array('\\', '\[', '\^', '\$', '\.', '\|', '\?', '\*', '\+', '\(', '\)', '\{', '\}');
    var charCount = 0;
    while (outputString.match(filterRE) != null && charCount < 13)
    {
      var searcRegEx = new RegExp("\\" + replacementChars[charCount],"g");
      var substitute = '\\' + replacementChars[charCount++];
      outputString = outputString.replace(searcRegEx, substitute);
    }
    
    // ER 8508961 - GRAJAGO
    // Wild card support for % and _ using RegExp.
    var regEx = new RegExp('%', 'g');
    outputString = outputString.replace(regEx, '\.\*');
    regEx = new RegExp('_', 'g');
    outputString = outputString.replace(regEx, '\.');
    return outputString;
  }
  
  // ER 8508961 - GRAJAGO
  // Wild card support - Trim multiple occurences of % to just one.
  function LtrimWildCardChar(rawString)
  {
    return rawString.replace(/[%]+/g, '%');
  }

  /*** Data Processing methods ***/ 

  // Bug 8546074 - GRAJAGO
  // This method will be called on key up on the LOV field which has been 
  // associated with a Controller in the LOV region. This method will fetch the 
  // LOV region attributes only first time user searches and then will continue
  // to fetch the results. Subsequent times, only results are fetched.
  function LproLookUp(bean, rfUrl, appModName, passiveCriteria, size, visibleSize, type, minChars, clientEvent, text, message)
  {
    Lurl = unescape(rfUrl);
    clearTimeout(LprevID);
    if (LxmlHttp == null)
    {
      LgetXmlHttpObject();
      /*if(!(_agent.isIE))
        LxmlHttp.overrideMimeType('text/xml');*/
    }
    
    LxmlHttp.abort();
    if (bean.id != null && bean.id != LcurrentElement)
    {
      LattrsFetched = false;
    }
    
    // Bug 8708093 - GRAJAGO
    // If the criteria changes, re-initiate the request to get the attributes.
    if (LattrsFetched && 
                (LprevParameterString == LgetCriteriaValuesAsParameterString()))
    {
      LtimeAccounted = false;
      LlookUp(bean, Lurl, LamName, LsearchAttrName, LviewAttrNames, LcolumnTypes, 
              LcolumnNames, LresultItems, LresultViewAttrs, LcriteriaItems, 
              LlookAheadSize, LvisibleRows, LlookAheadSearchType, LlookAheadMinChars, 
              LclientSidePopulation, LNoDataText, LprocessingMessage);
      return;
    }
    LresetVariables();
    LtimeAccounted = true;
    LtempBean = bean;
    LcurrentElement = bean.id;
    Lurl = unescape(rfUrl);
    LamName = appModName;
    LlookAheadSize = size;
    LvisibleRows = visibleSize; // ER 8527852 - Use visible records property set on LOV.
    LlookAheadSearchType = type;
    LlookAheadMinChars = minChars;
    LclientSidePopulation = clientEvent;
    LNoDataText = text;
    LprocessingMessage = message;
    
    var invalid = LvalidateInput();
    if (invalid) return;
    
    LcriteriaItems = passiveCriteria;
    LprevID = setTimeout("LfetchMoreAttr()", 1500);
  }
  
  function LfetchMoreAttr()
  {
    LshowProcessingMessage();
    LprocessingVisible = true;
    if (LxmlHttp == null)
    {
      LgetXmlHttpObject();
      /*if(!(_agent.isIE))
        LxmlHttp.overrideMimeType('text/xml');*/
    }
    
    var paramMethod = LparamTagStart + 'getMoreAttributes' + LparamTagEnd;
    var paramAM = LparamTagStart + LamName + LparamTagEnd;
    var paramElementName = LparamTagStart + LcurrentElement + LparamTagEnd;
    var body = LbeginBody + paramMethod + paramAM + paramElementName + LgetMACList();
    var paramCriterion = LgetCriteriaValuesAsParameterString();
    if (paramCriterion.length > 0)
      body = body + paramCriterion;
    body = body + LendBody;
    
    LxmlHttp.onreadystatechange = LparseAttributeXML;
    LxmlHttp.open("POST", Lurl, true);
    LxmlHttp.setRequestHeader("Content-type", "application/xml"); //LxmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    LxmlHttp.send(body);
  
  }
  
  function LparseAttributeXML()
  {
    if (LxmlHttp.readyState == 4) // 4 = "loaded"
    {
      if (LxmlHttp.status == 200)
      {
        attributeDoc = LxmlHttp.responseXML;
        if(!attributeDoc || attributeDoc.childNodes.length == 0)
        {
          var text = LxmlHttp.responseText;
          attributeDoc = LloadXmlContentString(text);
        }
        
        // Bug 9551688 - GRAJAGO
        // Session timeout error will be part of status 200 REST response, but 
        // differentiated with the tag, named error opposed to the tag named
        // response for valid output. So, check if the REST response received is
        // error or response.
        var responseDoc = attributeDoc.getElementsByTagName("response");
        if (responseDoc != null && responseDoc.length > 0)
        {
          var attributeList = null;
          if (responseDoc[0] != null)
          {
            var attributeXML = responseDoc[0].getElementsByTagName("Attributes");
            if (attributeXML != null && attributeXML[0].hasChildNodes())
            {
              attributeList = attributeXML[0].firstChild.nodeValue;
            }
            LxmlHttp = null;
            LattrsFetched = true;
          }
          if (attributeList)  
          {
            LcurrentElement = "";
            setTimeout(attributeList, 1);
          }
        }
        else
        {
          var errorDoc = attributeDoc.getElementsByTagName("error");
          if (errorDoc != null && errorDoc.length > 0)
          {
            var error = errorDoc[0];
            var code = error.getElementsByTagName("code")[0].firstChild.nodeValue;
            var messageName = error.getElementsByTagName("message")[0].firstChild.nodeValue;
            if (code == '401' && messageName == 'FND_SESSION_EXPIRED')
            {
              var errorMessages = new Array(1);
              errorMessages[0] = error.getElementsByTagName("messagetext")[0].firstChild.nodeValue;
              
              // Bug 9551688 - GRAJAGO
              // Do js redirect to the same page on session timeout, so that
              // server will inturn redirect to Login page.
              alert(errorMessages[0]);
              window.location = window.location.href;
              // LshowErrorMessages(errorMessages);
              LxmlHttp = null;
              
              // Bug 9063901 - GRAJAGO
              // Clear the cache to initiate server request for further query.
              LfetchString = "";
              LresetVariables();
            }
          }
          else
          {
            LhidePopup = true;
            LsetVisible('hidden');
          }
        }
      }
      else if (LxmlHttp.status == 400)
      {
        var errorMessages = new Array();
        xmlDoc = LxmlHttp.responseXML;
        if(!xmlDoc || xmlDoc.childNodes.length == 0)
        {
          var text = LxmlHttp.responseText;
          xmlDoc = LloadXmlContentString(text);
        }
        if (xmlDoc != null)
        {
          var error = xmlDoc.getElementsByTagName("error");
          if (error != null)
          {
            errorMessages = new Array(error.length);
            for (i = 0; i < error.length; i++)
            {
              errorMessages[i] = error[i].childNodes[0].nodeValue;
            }
          }
        }
        LshowErrorMessages(errorMessages);
        LxmlHttp = null;
      }
      else if (LxmlHttp.status == 500)
      {
        LhidePopup = true;
        LsetVisible('hidden');
      }
    }
    else if (LxmlHttp.readyState == 0)
    {
      LloadDone = true;
      LhidePopup = true;
      LsetVisible('hidden');
    }
  }
  
  function LinitAndLookUp(searchAttr, attrNames, colTypes, columns, results, resultAttrs, criterion)
  {
    LlookUp(LtempBean, Lurl, LamName, searchAttr, attrNames, colTypes, columns, results, 
            resultAttrs, criterion, LlookAheadSize, LvisibleRows, LlookAheadSearchType, 
            LlookAheadMinChars, LclientSidePopulation, LNoDataText, 
            LprocessingMessage);
  }
  
  //Bug#8516746:The function takes the RF URL as argument, which will be prepared
  //at server side and sent
  function LlookUp(bean, rfUrl, appModName, searchAttr, attrNames, colTypes, columns, 
                  results, resultAttrs, criterion, size, visibleSize, type, minChars, clientEvent, text, message)
  {
    Lurl = unescape(rfUrl);
    clearTimeout(LprevID);
    if (LxmlHttp == null)
    {
      LgetXmlHttpObject();
      /*if(!(_agent.isIE))
        LxmlHttp.overrideMimeType('text/xml');*/
    }
    
    LxmlHttp.abort();
    LloadDone = true;
    
    if (bean.id != null && bean.id != LcurrentElement)
    {
      LresetVariables();
      //transactionid = txnid;
      LcurrentElement = bean.id;
      LamName = appModName;
      LsearchAttrName = searchAttr;
      LviewAttrNames = attrNames;
      LviewAttrNames[LviewAttrNames.length] = "__lovSuggestTableRowCount";
      LcolumnTypes = colTypes;
      LcolumnTypes[LcolumnTypes.length] = 2; // Render it as hidden; 2 is to distinguish from the actual columns.
      LcolumnNames = columns;
      LresultItems = results;
      LresultViewAttrs = resultAttrs;
      LcriteriaItems = criterion;
      LlookAheadSize = size;
      LvisibleRows = visibleSize; // ER 8527852 - Use visible records property set on LOV.
      LlookAheadSearchType = type;
      // Bug 8652203 - GRAJAGO - Introduce minimum characters for look ahead.
      LlookAheadMinChars = minChars;
      if ("contains" == LlookAheadSearchType) LlookAheadMinChars = minChars + 1;
      LclientSidePopulation = clientEvent;
      LNoDataText = text;
      LprocessingMessage = message;
      LsetPopupPosition();
      var displayNo = -1;
      for (i = 0; i < LviewAttrNames.length; i++)
      {
        if (LcolumnTypes[i] == 1) displayNo++;
        
        // Bug 8869713 - GRAJAGO
        // It is possible that any hidden column has the same view attribute as
        // the search attribute. So, we need to point correctly to the required 
        // column, hence ensure that the column is displayed.
        if ((LsearchAttrName == LviewAttrNames[i]) && (LcolumnTypes[i] == 1))
        {
          LsearchAttrColumn = i;
          LsearchDispColumn = displayNo;
          break;
        }
      }
    }
    
    var invalid = LvalidateInput();
    if (invalid) return;
    
    // Bug 8753494 - GRAJAGO - Filter % only after min char check.
    // ER 8508961 - GRAJAGO
    // Support for wild card characters.
    // Filter multiple consecutive % sign to single %.
    LsearchString = LtrimWildCardChar(LsearchString);
    
    if (LsearchString == Loldins) return;
    
    // Bug 8621140 - GRAJAGO
    // Fetch the records again if user enters more characters when they are not 
    // in the first range (potentially more records exists across ranges).
    // Bug 8478075 - GRAJAGO
    // Do server fetch if there is any change in criteria.
    if ((LsearchString == LfetchString || ((LfetchString.length > 0) 
                                          && (LsearchString.length > LfetchString.length) 
                                          && (LsearchString.substring(0, LfetchString.length) == LfetchString) 
                                          && (LcurrentCount < LlookAheadSize)
                                          && LrangeStart == 0)) // Bug 8621140 
               && LprevParameterString == LgetCriteriaValuesAsParameterString())
    {
      LcreatePopup();
    }
    else
    {
      LhidePopup = true;
      if (!LprocessingVisible) LsetVisible('hidden');
      // Bug 8551372 - GRAJAGO
      // If Tab or Esc, do not do fetching even if no request done previously.
      if (Lkey == 27 || Lkey == 9)
      {
        Lposi = 0;
        return;
      }
      // Bug 8571303 - GRAJAGO - Increase the delay to 1500 ms.
      if (LtimeAccounted)
        LfetchRecords(LsearchString);
      else
        LprevID = setTimeout("LfetchRecords(LsearchString)", 1500);
    }
  }
  
  // Consolidation of the user input validation in a seperate method.
  function LvalidateInput()
  {
    Linput = document.getElementsByName(LcurrentElement)[0].value;
    LsearchString = Linput;
    
    if (LsearchString == "") 
    {
      LhidePopup = true;
      LsetVisible('hidden');
      Loldins = "";
      Lposi = 0;
      return true;
    }
    
    // ER 8508955 - GRAJAGO
    // Support for contains search. Just add a % in the beginning - Rest of the 
    // functionality has been taken care by wild card characters support.
    if ("contains" == LlookAheadSearchType)
      LsearchString = '%' + LsearchString;
    
    // Bug 8651577, 8652203 - GRAJAGO
    // Stop blind searches with just % or the leading % in the string. Also,
    // do not initiate look ahead if the input length is less than min chars. 
    // Bug 8824552 - GRAJAGO
    // Stop blind searches for '_' character as well.
    if ((LsearchString.length < LlookAheadMinChars) ||
                                           ("startsWith" == LlookAheadSearchType
                                            && ('%' == LsearchString.charAt(0)
                                            || '_' == LsearchString.charAt(0)))) 
    {
      LhidePopup = true;
      LsetVisible('hidden');
      Loldins = "";
      Lposi = 0;
      return true;
    }
  }
  
  function Lpause(millisecondi)
  {
    var now = new Date();
    var exitTime = now.getTime() + millisecondi;

    while(true)
    {
        now = new Date();
        if(now.getTime() > exitTime) return;
    }
  }
  
  function LfetchRecords(str)
  {
    if (!LloadDone)
    {
      Lpause(100);
      LloadDone = true;
    }
    
    // Bug 8551372 - GRAJAGO
    // Message to show the Lov fetching in progress.
    if (!LprocessingVisible) 
    {
      LshowProcessingMessage();
    }
    LprocessingVisible = false;
    
    if (str.length == 0)
    { 
      LhidePopup = true;
      LsetVisible('hidden');
      return;
    }
    
    LrangeStart = 0;
    LcurrentFetchString = str;
    
    var methodType = LparamTagStart + 'getSuggestions' + LparamTagEnd;
    var paramAM = LparamTagStart + LamName + LparamTagEnd;
    var paramElementName = LparamTagStart + LcurrentElement + LparamTagEnd;
    // For bug 9007850 and 8879344
    // Process search text to escape the unsafe characters for xml
    var paramSearchText = LparamTagStart + escapeXML(str) + LparamTagEnd;
    var paramInitIconText = LparamTagStart + LinitIconText + LparamTagEnd;
    //MACList is the fourth element
    var body = LbeginBody + methodType + paramAM + paramElementName + 
                            paramSearchText + LgetMACList() + paramInitIconText;
    var paramCriterion = LgetCriteriaValuesAsParameterString();
    // Bug 8478075 & 8708093 - GRAJAGO
    // Save the criteria string.
    LcurrParameterString = paramCriterion;
    if (paramCriterion.length > 0)
      body = body + paramCriterion;
    body = body + LendBody;
    
    //var Lurl = "RF.jsp?function_id=LOV_SUGGESTIONS&isReadOnlyCustomPopup=Y";
    
    LxmlHttp.onreadystatechange = LparseXML;
    LxmlHttp.open("POST", Lurl, true);
    LxmlHttp.setRequestHeader("Content-type", "application/xml"); //LxmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    LxmlHttp.send(body);
    LloadDone = false;
  }
  
  //Bug#8521354 -- MAC support
  function LgetMACList()
  {
    var macList = document.getElementById("FORM_MAC_LIST");
    if(macList == null || macList == undefined)
      return "<param name='maclist'></param>";
    else
      return "<param name='maclist'>" + macList.value + "</param>";
  }
  
  function LloadXmlContentString(xmlData) 
  {
    if (window.ActiveXObject) 
    {
      //for IE
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(xmlData);
      return xmlDoc;
    } 
    else if (document.implementation && document.implementation.createDocument) 
    {
      //for Mozilla
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlData, "application/xml");
      return xmlDoc;
    }
  }
  	  
  function LparseXML()
  {
    //LclearOutput();
    LcurrentCount = 0;
    if (LxmlHttp.readyState == 4) // 4 = "loaded"
    {
      if (LxmlHttp.status == 200)
      {
        LloadDone = false;
        Lsuggestions = new Array();
        LMACValues = new Array();
        xmlDoc = LxmlHttp.responseXML;
        if(!xmlDoc || xmlDoc.childNodes.length == 0)
        {
          var text = LxmlHttp.responseText;
          xmlDoc = LloadXmlContentString(text);
        }
        
        if (xmlDoc != null)
        {
          // Bug 9022737 - GRAJAGO
          // If response tag is available process the response.
          var responseDoc = xmlDoc.getElementsByTagName("response");
          if (responseDoc != null && responseDoc.length > 0)
          {
            xmlDoc = responseDoc[0];
            
            // Bug 8893801 - GRAJAGO
            // Get the translated texts for alt and title property of the icons.
            var i18nData = xmlDoc.getElementsByTagName("i18n");
            {
              if (i18nData != null && i18nData.length > 0)
              {
                var msgsData = i18nData[0].getElementsByTagName("msgs");
                if (msgsData != null && msgsData.length > 0)
                {
                  var lookUpRows = msgsData[0].getElementsByTagName("LookUpVORow");
                  for (var n = 0; n < lookUpRows.length; n++)
                  {
                    var code = lookUpRows[n].getElementsByTagName("LookupCode");
                    var meaning = lookUpRows[n].getElementsByTagName("Meaning");
                    if (code != null && code.length > 0 && meaning != null
                                                          && meaning.length > 0)
                    {
                      var meaningText = meaning[0].firstChild.nodeValue;
                      if ("NEXT_DISABLED" == code[0].firstChild.nodeValue)
                        LIconTextArray[0] = meaningText;
                      else if ("NEXT_ENABLED" == code[0].firstChild.nodeValue)
                        LIconTextArray[1] = meaningText;
                      else if ("PREV_DISABLED" == code[0].firstChild.nodeValue)
                        LIconTextArray[2] = meaningText;
                      else if ("PREV_ENABLED" == code[0].firstChild.nodeValue)
                        LIconTextArray[3] = meaningText;
                      else if ("REFINE_SEARCH" == code[0].firstChild.nodeValue)
                        LIconTextArray[4] = meaningText;
                    }
                  }
                  LinitIconText = false;
                }
              }
            }
          
            var noData = xmlDoc.getElementsByTagName("NoData");
            if (noData != null && noData.length == 1)
            {
              /*Lsuggestions[0] = new Array(LviewAttrNames.length);
              Lsuggestions[0][0] = noData.childNodes[0].nodeValue;*/
              /*for (var m = 1; m < LviewAttrNames.length - 1; n++)
                Lsuggestions[0][m] = ' ';*/
              
              if (noData[0].hasChildNodes())
              {
                LNoDataText = noData[0].childNodes[0].nodeValue;
                LaddNoData();
              }
              Loldins = LcurrentFetchString; // Bug 8477902 - GRAJAGO
              LloadDone = true;
              LfetchString = LcurrentFetchString;
              // Bug 8478075 & 8708093 - GRAJAGO
              // Save the criteria string.
              LprevParameterString = LcurrParameterString;
            }
            else
            {
              // Bug 8478126 - GRAJAGO
              // Get the case sensitive flag from response here for client side 
              // filtering.
              var caseMatch = xmlDoc.getElementsByTagName("CaseSensitive");
              if (caseMatch != null)
              {
                var caseLength = caseMatch.length;
                if (caseLength > 0 && caseMatch[caseLength - 1].hasChildNodes())
                  LcaseSensitive = caseMatch[caseLength - 1].firstChild.nodeValue;
              }
              
              var hasNextNode = xmlDoc.getElementsByTagName("lovHasNextData");
              if (hasNextNode != null)
              {
                var hasNextLength = hasNextNode.length;
                if (hasNextLength > 0 && hasNextNode[hasNextLength - 1].hasChildNodes())
                  LlovhasNextData = hasNextNode[hasNextLength - 1].firstChild.nodeValue;
              }
              
              var lovAMs = xmlDoc.getElementsByTagName("__lovAMName");
              if (lovAMs != null)
              {
                var lovAMLength = lovAMs.length;
                if (lovAMLength > 0 && lovAMs[lovAMLength - 1].hasChildNodes())
                  LlovAMName = lovAMs[lovAMLength - 1].firstChild.nodeValue;
              }
              
              var lovVOs = xmlDoc.getElementsByTagName("__lovVOName");
              if (lovVOs != null)
              {
                var lovVOLength = lovVOs.length;
                if (lovVOLength > 0 && lovVOs[lovVOLength - 1].hasChildNodes())
                  LlovVOName = lovVOs[lovVOLength - 1].firstChild.nodeValue;
              }
              
              // Bug 9578478 - GRAJAGO
              // Store the MAC'd values separately for each item.
              for (var n = 0; n < LresultItems.length; n++)
              {
                var x = xmlDoc.getElementsByTagName(LresultItems[n] + "__MAC__");
                if (x != null)
                {
                  for (i = 0; i < x.length; i++)
                  {
                    if (n == 0 || (LMACValues.length - 1) < i)
                    {
                      LMACValues[i] = new Array(LresultItems.length);
                    }
                    
                    if (x[i].hasChildNodes() && !(x[i].childNodes[0].nodeValue == undefined))
                      LMACValues[i][n] = x[i].childNodes[0].nodeValue;
                    else
                      LMACValues[i][n] = '';
                  }
                }
              }
              
              for (var n = 0; n < LviewAttrNames.length - 1; n++)
              {
                var x = xmlDoc.getElementsByTagName(LviewAttrNames[n]);
                if (x != null)
                {
                  for (i = 0; i < x.length; i++)
                  { 
                    if (n == 0 || (Lsuggestions.length - 1) < i)
                    {
                      Lsuggestions[i] = new Array(LviewAttrNames.length);
                    }
                    
                    // Bug 8546551 - GRAJAGO
                    // An Empty tag is generated for null objects now. So, check 
                    // for the presence of childnodes.
                    if (x[i].hasChildNodes() && !(x[i].childNodes[0].nodeValue == undefined))
                      Lsuggestions[i][n] = x[i].childNodes[0].nodeValue;
                    else
                      Lsuggestions[i][n] = '';
                    Lsuggestions[i][LviewAttrNames.length - 1] = i;
                  }
                }
              }
              if (Lsuggestions.length > 0)
              {
                // Update these values only after getting the result. This will 
                // avoid values getting changed when the REST call errors out.
                if (LcurrFuncExec == "prev")
                {
                  LrangeStart--;
                  LlovRecordsNavList--;
                }
                else if (LcurrFuncExec == "next")
                {
                  LrangeStart++;
                  LlovRecordsNavList++;
                }
                LcurrFuncExec = null;
                LcreatePopup();
                LcurrentCount = Lsuggestions.length;
                LfetchString = LcurrentFetchString;
                LloadDone = true;
                // Bug 8478075 & 8708093 - GRAJAGO
                // Save the criteria string.
                LprevParameterString = LcurrParameterString;
              }
              else
              {
                LhidePopup = true;
                LsetVisible('hidden');
              }
              LxmlHttp = null;
            }
          }
          else
          {
            // Bug 9022737 - GRAJAGO
            // If error tag is available, this will be for session tiumeout. 
            // Show session timeout message to the end user.
            var errorDoc = xmlDoc.getElementsByTagName("error");
            if (errorDoc != null && errorDoc.length > 0)
            {
              var error = errorDoc[0];
              var code = error.getElementsByTagName("code")[0].firstChild.nodeValue;
              var messageName = error.getElementsByTagName("message")[0].firstChild.nodeValue;
              if (code == '401' && messageName == 'FND_SESSION_EXPIRED')
              {
                var errorMessages = new Array(1);
                errorMessages[0] = error.getElementsByTagName("messagetext")[0].firstChild.nodeValue;
                
                // Bug 9551688 - GRAJAGO
                // Do js redirect to the same page on session timeout, so that
                // server will inturn redirect to Login page.
                alert(errorMessages[0]);
                window.location = window.location.href;
                // LshowErrorMessages(errorMessages);
                LxmlHttp = null;
                
                // Bug 9063901 - GRAJAGO
                // Clear the cache to initiate server request for further query.
                LfetchString = "";
                LresetVariables();
              }
            }
            else
            {
              LhidePopup = true;
              LsetVisible('hidden');
            }
          }
        }
      }
      else if (LxmlHttp.status == 400)
      {
        //fetchDataFailed();
        var errorMessages = new Array();
        xmlDoc = LxmlHttp.responseXML;
        if(!xmlDoc || xmlDoc.childNodes.length == 0)
        {
          var text = LxmlHttp.responseText;
          xmlDoc = LloadXmlContentString(text);
        }
        if (xmlDoc != null)
        {
          var error = xmlDoc.getElementsByTagName("error");
          if (error != null)
          {
            errorMessages = new Array(error.length);
            for (i = 0; i < error.length; i++)
            {
              errorMessages[i] = error[i].childNodes[0].nodeValue; 
            }
            
            // Bug 9063901 - GRAJAGO
            // Clear the cache to initiate server request for further query.
            LfetchString = "";
            LresetVariables();
          }
        }
        LshowErrorMessages(errorMessages);
        LxmlHttp = null;
      }
      else if (LxmlHttp.status == 500)
      {
        // Bug 9063901 - GRAJAGO
        // Clear the cache to initiate server request for further query.
        LfetchString = "";
        LhidePopup = true;
        LsetVisible('hidden');
        LresetVariables();
      }
    }
    else if (LxmlHttp.readyState == 0)
    {
      LloadDone = true;
      LhidePopup = true;
      LsetVisible('hidden');
    }
  }
  
  function LlookAt()
  {
    var ins = document.getElementsByName(LcurrentElement)[0].value;
    
    // ER 8508955 - GRAJAGO
    // Support for contians search. Just add a % in the beginning - Rest of the
    // functionality has been taken care by wild card characters support.
    if ("contains" == LlookAheadSearchType)
      ins = '%' + ins;
    
    // ER 8508961 - GRAJAGO
    // Support for wild card characters.
    // Filter multiple consecutive % sign to single %.
    ins = LtrimWildCardChar(ins);
    LcurrentSearchString = ins;
    // Bug 8542519 - GRAJAGO
    // Even if the record is highlighted, user can do filtering further.
    /*if (Loldins == ins) return;
    else if (Lposi > 0);
    else*/
    if (ins.length > 0)
    {
      Lwords = LgetRecord(ins);
      if (Lwords.length > 0)
      {
        LclearOutput();
        LaddHeading();
        
        // Bug 8478096/8509276 - GRAJAGO
        // To add one more column to track the number of records pass the 
        // record number.
        var recordCount = 1;
        for (var i = 0; i < Lwords.length; ++i) LaddRecord (Lwords[i], recordCount++);
        
        // ER 8527852 - GRAJAGO
        // If the height is still -1, there are less umber of records than the 
        // window size. So, take the current offset of the data.
        if (LcurrDH == -1)
          LcurrDH = Ldata.offsetHeight;
        
        // ER 8508940 - GRAJAGO
        // A new div is introduced to have scroll bar only for the data. So, set
        // the scrolling properties to the data div.
        if (Ldata != null)
        {
          // ER 8527852 - GRAJAGO
          // Use the calculated height and the visible records property set on LOV.
          Ldata.style.height = LcurrDH;
          //if (Lwords.length > 10)
          if (Lwords.length > LvisibleRows)
          {
            // ER 8527852 - GRAJAGO
            // Use the calculate height.
            /*Ldata.style.height = "205px";
            if(_agent.isIE)
              Ldata.style.height = "229px";
            else*/
            if(!_agent.isIE) // Bug 9308265 - Add 17px for FF and Safari.
              LsuggestTable.style.marginRight = "17px"; // To avoid scrollbar appearing over the part of the data.
            Ldata.style.overflow  = "auto";
          }
          else
          {
            /*Ldata.style.height = (19*(Lwords.length + 1))+"px";
            if(_agent.isIE)
              Ldata.style.height = (21*(Lwords.length + 1))+"px";*/
            Ldata.style.overflow  = "hidden";
          }
          // Bug 8508996 - GRAJAGO
          // Having width attribute occupies unnecessary space.
          // Bug 8684209 - GRAJAGO
          // No horizontal scroll bar.
          Ldata.style.overflowX = "hidden";
        }
        
        // ER 8508940 - GRAJAGO
        // Add the navigation bar.
        LaddNavigationBar();
        LsetVisible("visible");
      }
      else
      {
        LaddNoData();
      }
    }
    else
    {
      LhidePopup = true;
      LsetVisible("hidden");
      Lposi = 0;
    }
    Loldins = ins;
  }

  function LgetRecord(beginning)
  {
    Lwords = new Array();
    LwordsLength = new Array(); // ER 8508961 - Support for wild card characters.
    if (LsearchAttrColumn != -1)
    {
      var n = LsearchAttrColumn;
      
      // Bug 8542073 - GRAJAGO
      // Escape the special characters if any.
      beginning = LescapeSpecialCharacters(beginning);
      
      // Bug 8478126 - GRAJAGO
      // Match the string using the case sensitive flag.
      var rg = new RegExp("^"+beginning, "i");
      if (LcaseSensitive == 'true')
        rg = new RegExp("^"+beginning);
      
      for (var i = 0; i < Lsuggestions.length; i++)
      {
        var correct = null;
        
        if (Lsuggestions[i][n] != undefined) 
          correct = Lsuggestions[i][n].match(rg);
        
        if (correct != null)
        {
          var t = Lwords.length;
          Lwords[t] = new Array();
          
          // ER 8508961 - Get the length from RegExp result object.
          LwordsLength[t] = correct[0].length;
          for (var s = 0; s < LviewAttrNames.length; s++)
            Lwords[t][s] = Lsuggestions[i][s];
        }
      }
    }
    return Lwords;
  }

  function LcreatePopup()
  {
    // Handle the Esc and Backspace keys.
    if (Lkey == 27)
    {
      // Esc
      LhidePopup = true;
      LsetVisible("hidden");
      Lposi = 0;
      Loldins = Linput;
      return;
    }
    else if (Lkey == 8)
    {
      // Backspace
      Lposi = 0;
      Loldins = -1;
    }
    else if (Lkey == 9)
    {
      // Tab
      LhidePopup = true;
      clearTimeout(LprevID);
      LsetVisible("hidden");
      return;
    }
    LhidePopup = true;
    LlookAt();
  }

  function Lkeygetter(event)
  {
    if (!event && window.event) event = window.event;
    if (event) Lkey = event.keyCode;
    else Lkey = event.which;
  }
	
  function LkeyHandler(event)
  {
    // Trigger these events only if inline LOV window has atleast one record.
    event = (event) ? event : ((window.event) ? (window.event) : null);
    var resultElem = document.getElementById(LoutputElement);
    if (resultElem.style.visibility == "visible" && LhasOutputRecords)
    {
      var textfield = document.getElementsByName(LcurrentElement)[0];
      if (Lkey == 40)
      {
        //Key down
        if (Lwords.length > 0 && Lposi < Lwords.length)
        {
          if (Lposi >= 1)
          {
            LsetUnselected(Lposi);
            Loffset = LdataOffset;
          }
          else 
          {
            Linput = textfield.value;
            Loffset = LheaderOffset;
          }
          
          // Bug 8538238 - GRAJAGO
          // Do the scrolling when the selected records goes beyond visibility. 
          Ldata.scrollTop = Ldata.scrollTop + Loffset;
          LsetSelected(++Lposi);
          //textfield.value = LsuggestTable.childNodes[Lposi].childNodes[LsearchDispColumn].lastChild.firstChild.nodeValue;
        }
      }
      else if (Lkey == 38)
      {
        //Key up
        if (Lwords.length > 0 && Lposi >= 1)
        {
          if (Lposi >= 2)
          {
            // Unselect the existing selected choice.
            LsetUnselected(Lposi);
            // Select the n-1 choice.
            LsetSelected(--Lposi);
            Loffset = LdataOffset;
            //textfield.value = LsuggestTable.childNodes[Lposi].childNodes[LsearchDispColumn].lastChild.firstChild.nodeValue;
          }
          else
          {
            // Moving out. Unselect the existing selected choice.
            LsetUnselected(Lposi);
            textfield.value = Linput;
            textfield.focus();
            Lposi--;
            Loffset = LheaderOffset;
          }
          // Bug 8538238 - GRAJAGO
          // Do the scrolling when the selected records when the record 
          // highlighted is not one of the first 10 records.
          Ldata.scrollTop = Ldata.scrollTop - Loffset;
        }
      }
      else if (Lkey == 27)
      {
        // Esc
        textfield.value = Linput;
        LhidePopup = true;
        LsetVisible("hidden");
        Lposi = 0;
        Loldins = Linput;
      }
      else if (Lkey == 8)
      {
        // Backspace
        Lposi = 0;
        Loldins = -1;
      }
      else if (Lkey == 9)
      {
        // Tab
        clearTimeout(LprevID);
        LhidePopup = true;
        LsetVisible("hidden");
        if (Lposi > 0)
        {
          // Bug 8538312, 8794947 - GRAJAGO - Populate result fields.
          Lpopulate(Lposi); // Bug 8716680 - GRAJAGO
          LsetTextOnLOV();
        }
        Lposi = 0;
        //Loldins = textfield.value;
        Loldins = "";
        // Bug 8825012 - GRAJAGO
        // Trigger server side event if required.
        triggerCustomOnChangeJS();
      }
      else if (Lkey == 13)
      {
        clearTimeout(LprevID);
        LhidePopup = true;
        LsetVisible("hidden");
      }
      else if (Lkey == 188 && event && event.shiftKey && event.altKey)
      {
        // ER 9254710 - GRAJAGO
        // Keyboard Access for Previous icon.
        // "Alt - <" ==> "Alt + Shift - ," for invoking previous using keyboard.
        if (LrangeStart != 0)
          setTimeout(LtriggerPrevious, 300);
      }
      else if (Lkey == 190 && event && event.shiftKey && event.altKey)
      {
        // ER 9254710 - GRAJAGO
        // Keyboard Access for Next icon.
        // "Alt - >" ==> "Alt + Shift - ." for invoking previous using keyboard.
        if (LlovhasNextData == 'true')
          setTimeout(LtriggerNext, 300);
      }
      else if (Lkey == 82 && event && event.altKey)
      {
        // ER 9254710 - GRAJAGO
        // Keyboard Access for Refine Search icon.
        // "Alt - R" for invoking Refine Search using keyboard.
        if (Lwords.length > 0 && LonclickFunc)
          setTimeout(LonclickFunc , 1);
      }
    }
  }
  
  function Lpopulate(number)
  {
    if (LsuggestTable.hasChildNodes())
    {
      var position = LsuggestTable.childNodes[number].lastChild.firstChild.nodeValue;
      //if (LclientSidePopulation)
      LpopulateResultFields(position);
    }
  }
  
  function LsetTextOnLOV()
  {
    var textfield = document.getElementsByName(LcurrentElement)[0];
    // Bug 8509276 - GRAJAGO
    // Populating values for onclick event also.
    //if (Lkey == 9 && Lposi > 0)
    if (Lposi > 0)
      textfield.value = LsuggestTable.childNodes[Lposi].childNodes[LsearchDispColumn].lastChild.firstChild.nodeValue;
    /*else
    {
      if (this.childNodes != null && this.childNodes.length > LsearchDispColumn 
             && this.childNodes[LsearchDispColumn] != null
             && this.childNodes[LsearchDispColumn].lastChild != null
             && this.childNodes[LsearchDispColumn].lastChild.firstChild != null)
        textfield.value = this.childNodes[LsearchDispColumn].lastChild.firstChild.nodeValue;
    }*/
    Loldins = textfield.value;
    //Lposi = 0;
  }

  var LmouseHandler = function()
  {
    for (var i=0; i < Lwords.length; ++i)
      LsetColor (++i, "#f2f2f5", "#3c3c3c");

    var colNo = 0;
    for (i = 0; i < LviewAttrNames.length; i++)
    {
      if (LcolumnTypes[i] == 0) continue;
      if (this.childNodes.length > colNo)
      {
        this.childNodes[colNo].style.background = "#316fba";
        this.childNodes[colNo].style.color = "#ffffff";
      }
      colNo++;
    }
    // Bug 8478096 - GRAJAGO
    // Track the position for synching navigation between mouse and 
    // Up/Down keys.
    Lposi = this.lastChild.previousSibling.firstChild.nodeValue;
  }

  var LmouseHandlerOut = function()
  {
    var colNo = 0;
    for (i = 0; i < LviewAttrNames.length; i++)
    {
      if (LcolumnTypes[i] == 0) continue;
      if (this.childNodes.length > colNo)
      {
        this.childNodes[colNo].className = 'x1l x50';
        this.childNodes[colNo].style.background = "#f2f2f5";
        this.childNodes[colNo].style.color = "#3c3c3c";
      }
      colNo++;
    }
    // Bug 8478096 - GRAJAGO
    // Reset the position for synching navigation between mouse and 
    // Up/Down keys.
    Lposi = 0;
  }

  var LmouseDown = function()
  {
      LoutpMouseDown = -1;
  }

  var LmouseClick = function()
  {
    document.getElementsByName(LcurrentElement)[0].value = this.childNodes[LsearchDispColumn].lastChild.firstChild.nodeValue;
    LhidePopup = true;
    LsetVisible("hidden");
    // Bug 8716680 - GRAJAGO
    // Bug 8794908 - GRAJAGO - Populate result fields.
    var position = this.lastChild.firstChild.nodeValue;
    if (LclientSidePopulation)
      LpopulateResultFields(position);
    Lposi = -1;
    Loldins = this.childNodes[LsearchDispColumn].lastChild.firstChild.nodeValue;
    // Bug 8825012 - GRAJAGO
    // Trigger server side event if required.
    triggerCustomOnChangeJS();
  }
  
  function LpopulateResultFields(posit)
  {
    // Get the untransformed id of the bean. 
    var splitArray = LcurrentElement.split(":");
    if (splitArray.length > 3)
      return;
      
    var beanName = LcurrentElement;
    var tableName =  null;
    var rowNo = null;
    
    if (splitArray.length == 3)
    {
      tableName = splitArray[0];
      beanName = splitArray[1];
      rowNo = splitArray[2];
    }
    
    for (var resultCount = 0; resultCount < LresultViewAttrs.length; resultCount++)
    {
      var targetValue = LgetValueForAttr(LresultViewAttrs[resultCount], posit);
      
      // Bug 8478054 - GRAJAGO
      if (targetValue == undefined)
        targetValue = '';
        
      var targetElement = LresultItems[resultCount];
      if (tableName != null && rowNo != null)
        targetElement = new String(tableName + ":" + targetElement + ":" + rowNo);
      var target = document.getElementsByName(targetElement)[0];
      if (target != undefined)
      {
        // Bug 9063898 - GRAJAGO
        // SPAN tags are returned even by getElementsByName in case of IE. So, 
        // handle the issue in the bug 8584259 here as well.
        if ("SPAN" == target.nodeName)
          if (target.firstChild != undefined)
            target.firstChild.nodeValue = targetValue;
          else
            target.appendChild(document.createTextNode(targetValue));
        else 
        {
          // Bug 9578478 - GRAJAGO
          // If the result item is a formValue beans, get the value from 
          // MAC'd values store.
          if (target.type == "hidden")
          {
            var macdValue = LgetMACValueForItem(LresultItems[resultCount], posit);
            targetValue = (macdValue == null) ? targetValue : macdValue;
          }
            
          target.value = targetValue;
        }
      }
      else
      {
        // Bug 8584259 - GRAJAGO
        // If the messageStyledText does not have initial value, then create 
        // a new text node as child.
        // This is for Firefox. SPAN tags are returned even by getElementsByName
        // in case of IE. Bug 9063898 fixes the same issue for IE.
        target = document.getElementById(targetElement);
        if (target != undefined)
          if (target.firstChild != undefined)
            target.firstChild.nodeValue = targetValue;
          else
            target.appendChild(document.createTextNode(targetValue));
      }
    }
  }
  
  function LgetValueForAttr(viewAttr, position)
  {
    var returnValue = "";
    for (var attrCount = 0; attrCount < LviewAttrNames.length - 1; attrCount++)
    {
      if (viewAttr == LviewAttrNames[attrCount])
      {
        returnValue = Lsuggestions[position][attrCount];
        return returnValue;
      }
    }
    return returnValue;
  }
  
  // Bug 9578478 - GRAJAGO
  // API to fetch the MAC'd value for a given item. The MAC'd value is based on 
  // the item and not on the view attribute, because MAC'd value is different 
  // for different item.
  function LgetMACValueForItem(itemName, position)
  {
    var returnValue = "";
    for (var attrCount = 0; attrCount < LresultItems.length; attrCount++)
    {
      if (itemName == LresultItems[attrCount])
      {
        returnValue = LMACValues[position][attrCount];
        return returnValue;
      }
    }
    return returnValue;
  }
  
  function LgetCriteriaValuesAsParameterString()
  {
    // Get the untransformed id of the bean.
    var parameterString = "";
    var splitArray = LcurrentElement.split(":");
    if (splitArray.length > 3)
      return "";
      
    var beanName = LcurrentElement;
    var tableName =  null;
    var rowNo = null;
    
    if (splitArray.length == 3)
    {
      tableName = splitArray[0];
      beanName = splitArray[1];
      rowNo = splitArray[2];
    }
    
    for (var criteriaCount = 0; criteriaCount < LcriteriaItems.length; criteriaCount++)
    {
      var criteriaElement = LcriteriaItems[criteriaCount];
      if (tableName != null && rowNo != null)
        criteriaElement = new String(tableName + ":" + criteriaElement + ":" + rowNo);
      
      // Bug 8478075 & 8708093 - GRAJAGO
      // No need to add LOV as criteria because we specifically add search text.
      if (criteriaElement == LcurrentElement) continue;
      
      var criteriaValue = LgetValueForId(criteriaElement);
      if (criteriaValue == undefined || criteriaValue == null) continue;
      // Bug 8548221 - GRAJAGO
      // LgetValueForId itself returns the value-id param combination.
      parameterString = parameterString + criteriaValue;
    }
    return parameterString;
  }
  
  function LgetValueForId(id)
  {
    // Bug 8548221 - GRAJAGO
    // Introduced a variable to construct the id-value param string so that when
    // the criteria, for LOVs inside table, is outside the table, the id for the
    // value are created properly.
    var result;
    var element = document.getElementsByName(id)[0];
    if (element != undefined)
    {
      // Bug 8478087 - GRAJAGO
      // Checkbox should be handled seperately.
      if (element.type == 'checkbox')
        result = element.checked ? 'on' : null;
      else
        result = element.value;
    }
    else
    {
      element = document.getElementById(id);
      if (element != undefined && element.firstChild != undefined)
        result = element.firstChild.nodeValue;
      else
      {
        // If we have already checked for table above, check for just the bean, 
        // as the bean might have been present outside the table.
        // Bug 8595623 - GRAJAGO
        // If not returned with the null value, another LgetValueForId is called 
        // with 'undefined' as param resulting in js error.
        var splitArray = id.split(":");
        if (splitArray.length != 3)
          return null; // result = undefined;
        
        return LgetValueForId(splitArray[1]);
      }
    }
    
    if (result == undefined || result == null) return null;
    
    // ER 8508961 - GRAJAGO
    // Support for wild card characters.
    // Filter multiple consecutive % sign to single %.
    // Bug 8478075 - GRAJAGO
    // No need to do this as criteria may have any value. Also, search text is 
    // not going to be part of criteria item.
    // result = LtrimWildCardChar(result);
    return LparamTagStart + id + LparamTagEnd + LparamTagStart + escapeXML(result) + LparamTagEnd;
  }

  // Bug 8825012 - GRAJAGO
  function triggerCustomOnChangeJS()
  {
    // If onchange has not been disturbed already, ignore.
    if (LeventSwallowed == false) return;
    
    // Reset the flag.
    LeventSwallowed = false;
    var beanName = LcurrentElement;
    var splitArray = LcurrentElement.split(":");
    if (splitArray.length == 3)
    {
      beanName = splitArray[1];
    }
    // call the onchange LOV event.
    jsFuncName = "LcustomOnChange" + beanName + "()";
    setTimeout(jsFuncName, 1);
  }
  
  // Bug 8824663 & 8604079 - GRAJAGO
  function LattachClearEvent()
  {
    var pprIframe= document.getElementById("_pprIFrame");
    if(_agent.isIE)
      pprIframe.attachEvent("onload", LclearSuggestionsCache);
    else
      pprIframe.addEventListener("load", LclearSuggestionsCache, false); 
  }
  
  function LclearSuggestionsCache()
  {
    // Bug 8824663 - Clear the results on a PPR event.
    LfetchString = "";
    // Bug 8604079 - GRAJAGO - Hide the inline LOV on PPR refresh.
    LhidePopup = true;
    LsetVisible('hidden');
    
    //Bug 8795495:re initialize the variables on PPR event
    LinitVariables();
  }
  
  // Convert invalid characters to character entity reference.
  // For bug 9007850 and 8879344 
  function escapeXML(xmlStr) 
  {
    if (xmlStr == null || typeof(xmlStr) == "undefined") return ""; // invalid argument
    
    unsafeChars = "<>&'\u0022";
    cerefs = new Array("&lt;","&gt;","&amp;","&apos;","&quot;");
    outputString = "";
    
    for (i = 0; i < xmlStr.length; i++) 
    {
        c = unsafeChars.indexOf(xmlStr.charAt(i));
        if (c == -1)
        {
            outputString += xmlStr.charAt(i);
        }
        else
        {
            outputString += cerefs[c];
        }
    }
    return outputString;
  }
