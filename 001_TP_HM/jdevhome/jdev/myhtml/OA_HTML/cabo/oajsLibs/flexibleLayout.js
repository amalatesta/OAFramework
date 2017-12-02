/*=================================================================+
|               Copyright (c) 2000 Oracle Corporation              |
|                  Redwood Shores, California, USA                 |
|                       All rights reserved.                       |
+==================================================================+
| FILENAME                                                         |
|   flexibleLayout.js                                              |
|                                                                  |
| HISTORY                                                          |
|   12-MAY-09 rmnatara Created for ER 8505590                      |
+==================================================================*/
/* $Header: flexibleLayout.js 120.0.12010000.3 2009/07/21 20:42:07 sette noship $ */

var FXh; 

/* function to handle the expand/collapse event */
function Ftogle(Felem, Fanchr, am, dRef, url)
{
    var ele = document.getElementById(Felem+'_hsitem_div');
    var img = document.getElementById(Fanchr);
    var state ='';
  
    if(ele.style.display == "block") 
    {
        state = "hidden";
        Fstore(Felem, am, dRef, state, url);
        ele.style.display = "none";
        img.src = "/OA_MEDIA/hideshow_infohidden.gif";
    }
    else 
    {
        state = "disclosed";
        Fstore(Felem, am, dRef, state, url);
        ele.style.display = "block";
        img.src = "/OA_MEDIA/hideshow_infoshown.gif";
    }
}

/* Intialize the flexible item state on page load */
function Finit(Fdiv, Fanchr, Fdisp)
{
    var ele = document.getElementById(Fdiv);
    var img = document.getElementById(Fanchr);
    
    if(Fdisp == "block")
    {
        ele.style.display = "block";
        img.src = "/OA_MEDIA/hideshow_infoshown.gif";
    }
    else if(Fdisp == "none")
    {
        ele.style.display = "none";
        img.src = "/OA_MEDIA/hideshow_infohidden.gif";
    }
}

/* Api to store the flexibleLayout item state in the MDS */
function Fstore(Fid, am, dRef, Fstate, url)
{
   //Need to use APIs provided in OARESTUtil to generate the URL
   //var url = "RF.jsp?function_id=CONFIG_PAGE_REST_SERVICE";
    
    var body = "<params><param name=\"Fid\">" + Fid + "</param>";
    body = body +  "<param name=\"am\">" + am + "</param>";
    body = body +  "<param name=\"dRef\">" + dRef + "</param>";
    body = body + "<param name=\"Fstate\">" + Fstate + "</param></params>";
    
    //xmlHttp.onreadystatechange = parseXML;
    if(FXh == null)
    {
        FXh = getObj();
    }
    FXh.open("POST", url, true);
    FXh.setRequestHeader("Content-type", "text/xml"); 
    FXh.send(body);
}

/* Creates a XML Request object depending on the browser type */
function getObj()
{
    var FXh = null;
    try
    {
        // Firefox, Opera 8.0+, Safari, IE 7
        FXh = new XMLHttpRequest();
    }
    catch (e)
    {
        // Other Internet Explorer versions.
        try
        {
            FXh = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e)
        {
            FXh = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return FXh
}

/* Returns true if the request is from IE browser */
function isIE()
{
    if(navigator.userAgent.indexOf("MSIE")!=-1)
    {
        return true;
    }
    return false;
}
