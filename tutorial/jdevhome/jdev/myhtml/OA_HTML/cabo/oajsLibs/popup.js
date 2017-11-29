/*=================================================================+
|               Copyright (c) 2009 Oracle Corporation              |
|                  Redwood Shores, California, USA                 |
|                       All rights reserved.                       |
+==================================================================+
| FILENAME                                                         |
|   popup.js                                                |
|                                                                  |
| HISTORY                                                          |
|   31-DEC-2010 BMETIKAL  Created                                   |
+==================================================================*/
/* $Header: popup.js 120.0.12010000.7 2010/05/14 10:06:38 sette noship $ */
var ie5=document.all&&document.getElementById;
var ns6=document.getElementById&&!document.all;
var currentElement;
var width = 500;
var height = 300;
var divid;
var iframeid;
var popupUrlId;
var detailsPopupURL;
//bug 8526057
var closeAnchorId;
var keyPress = true;
var tmr;
var oldTitle=document.title;
var t;
var popupDiv;
// bug 9255491
// Object containing the initial state of the popup
var initialPopupFormState;
var popupFormName;
var isParameterizedPopup = false;
var newPopupState ;
//ER 9406692:flexfields support in popup.
var popupEnabledItemId;
var hiddenPopupid;
//This variable is introduced to stop opening of another popup when 
//there user wants to retain exisitng popup with pending changes.
var openPopup = true;
//This will get called on each ppr event so as to retain popup
function showPopupOnPpr()
{
        //8824028 -bmetikal
        if(divid != null)
        popupDiv = document.getElementById(divid);
        if(popupDiv != null && popupDiv.style.display != '' )
        displayPopup();
}
//bug 9582958:bmetikal
function showPopupWithFlex(popupEnabledItemId)
{
    if(popupEnabledItemId != null)
    {
        hiddenPopupid = popupEnabledItemId.substr(popupEnabledItemId.indexOf("___")+3)
        popupEnabledItemId=popupEnabledItemId.substr(0,popupEnabledItemId.indexOf("___"))
    }
    currentElement=popupEnabledItemId;
    showPopupCommonCode(hiddenPopupid);
}
function showPopup(bean,popupId)
{
    if(bean.disabled) return;
    currentElement = bean.id;
    //required to close already open popup
    //bug 8721350-bmetikal
    if(divid != null)
    popupDiv = document.getElementById(divid);
    //we need to to call complete closeit method to close existing popup
    //previously we were just setting style:display to none
    if(popupDiv != null)
    eval(decodeURI(document.getElementById(closeAnchorId).href));
    
    if(openPopup)
    showPopupCommonCode(popupId);
}
function showPopupCommonCode(popupId)
{
    popupEnabledItemId = document.getElementById("popupEnabledItemId");
    if(popupEnabledItemId != null)
    popupEnabledItemId.name="popupEnabledItemId"+currentElement+"___"+popupId; 
    
    var pprIframe= document.getElementById("_pprIFrame");
    var arr =currentElement.split(":");
    var arrlength = arr.length;
        
    divid = "popup"+popupId;
    iframeid="iframe"+popupId;
    popupUrlId="hiddenUrl"+popupId;
    //bug 8526057
    closeAnchorId="closeAnchor"+popupId;
    if(arrlength==3){
    divid = divid+":"+arr[2];
    iframeid=iframeid+":"+arr[2];
    popupUrlId=popupUrlId+":"+arr[2];
    //bug 8526057
    closeAnchorId=closeAnchorId+":"+arr[2];
    }
    if(document.getElementById(popupUrlId) != null)
    isParameterizedPopup = true;
    //To avoid redunndant call to document.getElementById started using popupDiv
    if(divid != null)
    popupDiv = document.getElementById(divid);
    //8824028 -bmetikal
        if(pprIframe && !isParameterizedPopup){
            if(_agent.isIE)
            pprIframe.attachEvent("onload", showPopupOnPpr);
            else
            pprIframe.addEventListener("load", showPopupOnPpr, false);    
        }
    displayPopup();
    // bug 9255491
    // Save off the initial state of the embedded popup.
    if(!isParameterizedPopup)
    initialPopupFormState = getPopupFormState();
}
//To avoid code redundency this is  commen mehtod for showpopup and showpopuponppr.
function displayPopup()
{
    var winW = 630, winH = 460;
    t = document.getElementById(currentElement);
    if (parseInt(navigator.appVersion)>3) {
     if (navigator.appName=="Netscape") {
      winW = window.innerWidth;
      winH = window.innerHeight;
     }
     if (navigator.appName.indexOf("Microsoft")!=-1) {
      winW = document.body.offsetWidth;
      winH = document.body.offsetHeight;
     }
    }
     width=popupDiv.style.width;
     height=popupDiv.style.height;
     
    if (!ie5&&!ns6)
        window.open("","","width=width,height=height,scrollbars=1")
    else
    {
        popupDiv.style.position='absolute';
        //bug 8843840 
        var xp = findPosX(t);
        var yp = findPosY(t);
        var popupWinW =parseInt(xp)+parseInt(width);
        var popupWinH =parseInt(yp)+parseInt(height);
        // Bug 8716339: If bidi session, change the calculation of the popup left
        if (isBiDi())
        {
          popupDiv.style.left=(parseInt(xp)-(parseInt(width) - parseInt(t.offsetWidth)))+"px";
        }
        else 
        {
          if(popupWinW >winW && parseInt(width) < xp)
            popupDiv.style.left=(parseInt(xp)-parseInt(width))+"px";//left
          else
            popupDiv.style.left=(parseInt(xp)+20)+"px";//right
        }
        // End Bug 8716339
        
        if(popupWinH > winH && (parseInt(height)+15) < yp)
            popupDiv.style.top=(parseInt(yp)-parseInt(height)-15)+"px";//top
        else
            popupDiv.style.top=yp+"px";//bottom
        popupDiv.style.display='';
        popupDiv.style.width=initialwidth=parseInt(width)+"px";
        popupDiv.style.height=initialheight=parseInt(height)+"px";
        //bug 8774979
        //bug 8667442:malmishr
        var closeBarWidth=popupDiv.firstChild.style.width;
        if(document.getElementById("closeBar"))
            document.getElementById("closeBar").style.width=initialwidth=parseInt(closeBarWidth)+"px";
        //bug 8526057-bmetikal  
        if(keyPress == true && document.getElementById(closeAnchorId))        
           document.getElementById(closeAnchorId).focus();            
        if(isParameterizedPopup)
        {
            detailsPopupURL =document.getElementById(popupUrlId).value;
            document.getElementById(iframeid).src=detailsPopupURL;
        }
    }
}
function iecompattest(){
return (!window.opera && document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}
function getPopupFormName(popupIframeElement)
{
  var innerForm;
  if(popupIframeElement) 
  { 
    var doc = popupIframeElement.contentWindow ? popupIframeElement.contentWindow.document :popupIframeElement.contentDocument;  
    if(doc) 
    { 
      var frames = doc.getElementsByTagName('frame');  
      if(frames.length) 
      { 
        var innerIframe = frames[0]; 
        var innerDoc = innerIframe.contentWindow ? innerIframe.contentWindow.document : innerIframe.contentDocument; 
        if(innerDoc) 
        { 
          innerForm = innerDoc.getElementById('DefaultFormName'); 
        } 
      } 
    }  
  }
  return innerForm;
}
function closeit(message){
    //bug 9551575:Fix to avoid 'UNDEFINED' message warning box.
    if(!message)
    {
    eval(decodeURI(document.getElementById(closeAnchorId).href));
    return;
    }
    
    //bug 9697550
    message=unescape(message);
    
    var popupIframe=window.top.document.getElementById(iframeid);
    //bug 9696833
    if(!popupIframe)
    popupIframe = document.getElementById(iframeid);
    popupFormName = getPopupFormName(popupIframe);
    // bug 9255491
    if(isPopupDirty()){
        var confirmed = confirm(message);
        if(!confirmed)
        {
            openPopup= false;
            return;
        }
        if(!isParameterizedPopup)
        resetPopup();
    }
        keyPress = true;
        if(popupDiv != null)
        popupDiv.style.display="none";
        divid = null;
        popupDiv = null;
        isParameterizedPopup = false;
        openPopup = true;
        if(document.getElementById("popupEnabledItemId") != null)
        document.getElementById("popupEnabledItemId").value=null;
        popupEnabledItemId = null;
        hiddenPopupid= null;
        //bug 9005330:bmetikal
        if(document.getElementById(currentElement))
        document.getElementById(currentElement).focus();
        //bug 8883221:malmishr 
        //This is for Iframe not to show the old data while the iframe is loading.
        var popupIframe=window.top.document.getElementById(iframeid);
        //bug 9696833
        if(!popupIframe)
        popupIframe = document.getElementById(iframeid);
        if(popupIframe!=null)
          popupIframe.style.visibility="hidden";
}
/**
 * bug 8526117
 * Determines which key is pressed.  
 * Closes the popup if it is ESC key.
 * ESC=27,Enter=13, tab=9, space=32
 */
 function detectEventType(event)
 {
     if(window.event)
     event =  (window.event);
     var keyCode = event.which || event.keyCode;
        if(keyCode == 27) // Capture Esc key
         eval(decodeURI(document.getElementById(closeAnchorId).href));
 }

function resetPopup()
{
    var formElem;
    var val;
    for (var key in initialPopupFormState)
    {
        formElem = document.getElementById(key);
        val = initialPopupFormState[key];
        if (newPopupState[key] != initialPopupFormState[key])
        setPopupFormElementValue(formElem, val);
    }
}
/**
 * Determines if the popup is dirty, returning true if
 * the popup is dirty.  
 *
 * @return true if the popup is dirty
 */
function isPopupDirty()
{
  var popupDirty    = false;
  // Get the current state of the form
    newPopupState = getPopupFormState();
    // Compare it to the old state
    for (var key in newPopupState)
    {
      if (newPopupState[key] != initialPopupFormState[key])
      {
        popupDirty = true;
        break;
      }
    }
  return popupDirty;
}
/**
 * Store the current value of all elements in a Popup.
 * Ignores all hidden fields.
 * @return the state
 */
  function getPopupFormState()
  {
    var state = new Object();
    var elms;
    if(isParameterizedPopup)
      elms = popupFormName.elements;
    else
      elms = popupDiv.getElementsByTagName("*");
    var len = elms.length;
    for (var i = 0; i < len; i++)
    {
      var element = elms[i];
      if (element)
      {
        var name = element.name;
        if (name)
        {
          // Skip over hidden values
          var elmType = element.type;
          if (!elmType || (elmType != 'hidden'))
            state[name] = _getValue(element);
        }
      }
    }
    return state;
  }
  

function findPosX(obj)
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

  function findPosY(obj)
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
//start bug 8667455  
function checkMouseLeave (element, evt) {
  if (element.contains && evt.toElement) {
    return !element.contains(evt.toElement);
  }
  else if (evt.relatedTarget) {
    return !containsDOM(element, evt.relatedTarget);
  }
}
function containsDOM (container, containee) {
  var isParent = false;
  do {
    if ((isParent = container == containee))
      break;
    containee = containee.parentNode;
  }
  while (containee != null);
  return isParent;
}
//end bug 8667455
  function setPopupTimer(bean1,popupid1)
  {
    keyPress = false;
    var c1=function()
    {
      showPopup(bean1,popupid1);
    }
   
    tmr=setTimeout(c1,1500);
  }
  function clearPopupTimer()
  {
    clearTimeout(tmr);
    keyPress = true;
  }
  //Bug 	8431730:malmishr To set window title when the Parameterized Popup is invoked.
  function setTitle()
  {
    var newTitle=document.title;
    if(newTitle != oldTitle)
      document.title=oldTitle;
    //bug 8883221:malmishr 
    //This is for Iframe not to show the old data while the iframe is loading.
    if(divid != null)
    {
      var popupIframe=window.top.document.getElementById(iframeid);
      //bug 9696833
      if(!popupIframe)
      popupIframe = document.getElementById(iframeid);
      if(popupIframe!=null)
        popupIframe.style.visibility="visible";
      popupFormName = getPopupFormName(popupIframe);
      // bug 9255491
      // Save off the initial state of the parameterized popup form.
      initialPopupFormState = getPopupFormState();
    }      
    
  }
   
  // Bug 8546023 - tohkubo
  // Move back isBiDi to core library.

  //malmishr:bug 8711922
  function submitFormPgRefresh()
  {
    window.top.submitForm('DefaultFormName', 1, null);
    //bug 8883221:malmishr 
    //This is for Iframe not to show the old data while the iframe is loading.
    var popupIframe=window.top.document.getElementById(iframeid);
    //bug 9696833
    if(!popupIframe)
    popupIframe = document.getElementById(iframeid);
    if(popupIframe!=null)
      popupIframe.style.visibility="hidden"; 
  }

/**
 * Sets the value of a form element.
 */
function setPopupFormElementValue(formElement, value)
{
  var shadowElem = formElement;
  var elementType = formElement.type

  // When we're dealing with an array of elements, find the
  // real element type by looking inside the array.
  if (!elementType && formElement.length)
  {
    for (var i = 0; i < formElement.length; i++)
    {
      elementType = formElement[i].type;
      if (elementType != (void 0))
      {
        shadowElem = formElement[i];
        break;
      }
    }
  }
  if (elementType == "checkbox")
  {
    formElement.checked=value;
  }
  else if (elementType.substring(0,6) == "select")
  {
    // no selected value
    if(value == "")
    {
      formElement.selectedIndex = -1;
      //formElement.selectedIndex = null;
    }
     // selectedIndex exists and non-negative
    else if(!isNaN(parseInt(value)))
    {
        // If there's no value, it could be for two reasons:
        //  (1) The user has only specified "text".
        //  (2) The user explicitly wanted "value" to be empty.
        // We can't really tell the difference between the two,
        // unless we assume that users will be consistent with
        // all options of a choice.  So, if _any_ option
        // has a value, assume this one was possibility (2)
      for (var i = 0; i < formElement.options.length; i++)
        {
          if (formElement.options[i].value == value)
          {
            formElement.selectedIndex = i;
            break;
          }
        }
        // OK, none had a value set - this is option (1) - default
        // the "value" to the "text"
        // formElement.selectedIndex = 0;
    }
    // value is index
    else
      formElement.selectedIndex = value;
  }
  else if (elementType == "radio")
  {
    // no selected value
    if(value == "")
    {
      formElement.checked = false;
    }
    else if (formElement.length)
    {
      for (var i = 0; i < formElement.length; i++)
      {
        // See above for why we check each element's type
        if (formElement[i].type == "radio" && formElement[i].value == value)
        {
          formElement[i].checked = true;
        }
      }
    }
    else
      formElement.checked = value;
  }
  else
  {
    formElement.value = value;
  }
}