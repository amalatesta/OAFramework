/*=================================================================+
|               Copyright (c) 2009 Oracle Corporation              |
|                  Redwood Shores, California, USA                 |
|                       All rights reserved.                       |
+==================================================================+
| FILENAME                                                         |
|   mainMenuTree.js                                                |
|                                                                  |
| HISTORY                                                          |
|   11-JUN-2009 syada  Created.                                    |    
+==================================================================*/
/* $Header: mainMenuTree.js 120.0.12010000.19 2010/05/14 10:05:16 sette noship $ */

var Mpersist=new Object();
var Mplus="/OA_MEDIA/hideshow_infohidden.gif"; 
var Mminus="/OA_MEDIA/hideshow_infoshown.gif"; 
var Mresp = new Array();
var treeid;
var Mxml = null;
var MisResp = false
var gtreeTag
var gparentTag
var Murl
var Mmode = "HOMEPAGE"
var Mexpand = "expand"
var Mcollapse = "collapse"
		var submenu1 = null
		var ulelement1 = null

function McreateTree(ltreeid, url, enablepersist, persistdays) {
	var treeTag = document.getElementById(ltreeid)
	var ultags=document.getElementById(ltreeid).getElementsByTagName("li")[0]
	treeid = ltreeid
        Murl = unescape(url)
	if (typeof Mpersist[treeid]=="undefined")
		Mpersist[treeid]=(enablepersist==true && getCookie(treeid)!="")
									? getCookie(treeid).split(",") : ""
	if (ultags) {
		var img = document.createElement('IMG')
		img.src = Mplus
        img.alt = Mexpand
		ultags.insertBefore(img, ultags.getElementsByTagName('img')[0]);
		ultags.onclick=function(e){
			var childMem = e.currentTarget.getElementsByTagName("ul")
			if (childMem.length == 0){

			}
		}
	} else if (treeTag) {
		getResp(treeid,treeTag)                
	}
	if (enablepersist==true){ //if enable persist feature
	var durationdays=(typeof persistdays=="undefined")? 1 : parseInt(persistdays)
	dotask(window, function()
		{rememberstate(treeid, durationdays)}, "unload") //save opened UL indexes on body unload
	}
}
  
function getMainMenuXmlHttpObject()
{
	try
	{
	  // Firefox, Opera 8.0+, Safari, IE 7
	  Mxml = new XMLHttpRequest()
	}
	catch (e)
	{
	  // Other Internet Explorer versions.
	  try
	  {
		Mxml = new ActiveXObject("Msxml2.XMLHTTP")
	  }
	  catch (e)
	  {
		Mxml = new ActiveXObject("Microsoft.XMLHTTP")
	  }
	}
}

function loadMainMenuXmlContentString(xmlData) 
{
	if (window.ActiveXObject) 
	{
		//for IE
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
		xmlDoc.async = "false"
		xmlDoc.loadXML(xmlData)
		return xmlDoc
	} 
	else if (document.implementation && document.implementation.createDocument) 
	{
		//for Mozilla
		parser = new DOMParser()
		xmlDoc = parser.parseFromString(xmlData, "application/xml")
		return xmlDoc
	}
}

function getResp( treeid,treeTag ) 
{
	getMainMenuXmlHttpObject()
	var body = "<params><param>RESPLIST</param>"
	body = body + "<param>HOMEPAGE</param></params>"
	gtreeTag = treeTag
	Mxml.onreadystatechange = parseRespXML
	Mxml.open("POST", Murl, true)
	Mxml.setRequestHeader("Content-type", "application/xml")
	Mxml.send(body)	
}

function parseRespXML()
{
    if (Mxml.readyState == 0 ) {
        getResp(treeid,gtreeTag)
    }
    
    if (Mxml.readyState == 4 ) // 4 = "loaded"
    {    
      if (Mxml.status == 200)
      {     
        xmlDoc = Mxml.responseXML
        if(!xmlDoc || xmlDoc.childNodes.length==0)
        {
          var text = Mxml.responseText          
          xmlDoc = loadMainMenuXmlContentString(text)
        }
        
        if (xmlDoc != null)       
        {
            var MisErr = false;
            if(!MisResp)
            {
            var err = xmlDoc.getElementsByTagName("error");
            if ((err != null) && (err.length > 0))
             {
                MisErr = true;
                cursor_clear();
                if ( err[0].childNodes.length >= 2) {
                     var Mcode = null;
                     var Mmsg = null;
                     var MmsgTxt = null;
                     if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
                     {
                       Mcode = err[0].childNodes[0].text;
                       Mmsg = err[0].childNodes[1].text;
                       if (err[0].childNodes.length >= 3)
                        MmsgTxt = err[0].childNodes[2].text;
                     }
                     else
                     {
                       Mcode = err[0].childNodes[0].textContent;
                       Mmsg = err[0].childNodes[1].textContent;
                       if (err[0].childNodes.length >= 3)
                        MmsgTxt = err[0].childNodes[2].textContent;               
                     }           
                     if( ("401" == Mcode) && ("FND_SESSION_EXPIRED" == Mmsg) )
                     {
                       alert(MmsgTxt);
                       window.location.reload();
                       return;
                     }
                }
             }
             if (!MisErr) {
                    var temp = xmlDoc.childNodes[0];
                    var temp1 = temp.childNodes[0];           
                    var respNames = xmlDoc.getElementsByTagName("RESPNAME");           
                    var respKeys = xmlDoc.getElementsByTagName('RESPID');
                    var applNames = xmlDoc.getElementsByTagName("APPLID");
                    var secGrpIds = xmlDoc.getElementsByTagName("SECGRPID");
                    
                    Mresp[0] = new Array() // to Store respName information
                    Mresp[1] = new Array() // to store respKey information
                    Mresp[2] = new Array() // to store applName information
                    Mresp[3] = new Array() // to store secGrpId information
                    for(var ind=0; ind<respNames.length; ind++)
                    {     
                       Mresp[0][ind]= respNames[ind];
                       Mresp[1][ind]= respKeys[ind];
                       Mresp[2][ind]= applNames[ind];
                       Mresp[3][ind]= secGrpIds[ind];
                    }
                    createRespList( treeid,gtreeTag)

              var expandList = xmlDoc.getElementsByTagName("EXPANDEDLIST"); 
              if (expandList.length > 0) {
              var list = ""
              if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                list = expandList[0].childNodes[0].text
              } else {
                list = expandList[0].childNodes[0].textContent
              }

              var respKeys = list.split(',') 
              for (var k=0; k < respKeys.length; k++) {
                var respId = respKeys[k]
                respId = respId.replace(/^\s*/, "").replace(/\s*$/, "")
                var parentNode = document.getElementById(respId)
                if (parentNode) {
                    var keystr = parentNode.id
                    var keys = keystr.split(':')                                        
                    var respKey = keys[0]
                    var applName = keys[1]
                    var menuId = keys[2]
                    var secGrpId = keys[3]
                    gparentTag = parentNode
                    var body = "<params><param>"+respKey+"</param>"
                    body = body + "<param>"+applName+"</param>"
                    body = body + "<param>"+menuId+"</param>"
                    body = body + "<param>"+secGrpId+"</param>"                                
                    body = body + "<param>"+Mmode+"</param></params>"
                    getMainMenuXmlHttpObject()
                    cursor_wait()
                    Mxml.onreadystatechange = parseMenuXML                                   
                    Mxml.open("POST", Murl, true)
                    Mxml.setRequestHeader("Content-type", "application/xml")
                    Mxml.send(body)                                      
            }
           }
          }
        }    
      }
    }
    }
    else if (Mxml.status == 404)
		alert("Request URL does not exist, Please contact your System Administrator.");
    else if (Mxml.status == 500 || Mxml.status == 400) {		
        xmlDoc = Mxml.responseXML;
        if(!xmlDoc || xmlDoc.childNodes.length == 0)
        {
          var text = Mxml.responseText;
          xmlDoc = loadXmlContentString(text);
        }
        if (xmlDoc != null)
        {
          var error = xmlDoc.getElementsByTagName("error");
          if (error != null)
          {
            errorMessages = new Array(error.length);
            for (i = 0; i < error.length; i++)
            {
              errorMessages[i] = error[i].childNodes[0].nodeValue 
              var liTag = document.createElement("li")
              liTag.appendChild(document.createTextNode(error[i].childNodes[0].nodeValue))
              liTag.className="error"
              gtreeTag.appendChild(liTag)
            }
          }
        }                
    }
    }
}
  
function parseMenuXML()
{
    if (Mxml.readyState == 4) // 4 = "loaded"
    {
      if (Mxml.status == 200)
      {
        xmlDoc = Mxml.responseXML
        if(!xmlDoc || xmlDoc.childNodes.length==0)
        {
          var text = Mxml.responseText
          xmlDoc = loadMainMenuXmlContentString(text)
        }
        if (xmlDoc != null)       
        {      
            var MisErr = false;
            var err = xmlDoc.getElementsByTagName("error");
            if ((err != null) && (err.length > 0))
             {
                MisErr = true;
                cursor_clear();
                if ( err[0].childNodes.length >= 2) {
                     var Mcode = null;
                     var Mmsg = null;
                     var MmsgTxt = null;
                     if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
                     {
                       Mcode = err[0].childNodes[0].text;
                       Mmsg = err[0].childNodes[1].text;
                       if (err[0].childNodes.length >= 3)
                        MmsgTxt = err[0].childNodes[2].text;
                     }
                     else
                     {
                       Mcode = err[0].childNodes[0].textContent;
                       Mmsg = err[0].childNodes[1].textContent;
                       if (err[0].childNodes.length >= 3)
                        MmsgTxt = err[0].childNodes[2].textContent;               
                     }           
                     if( ("401" == Mcode) && ("FND_SESSION_EXPIRED" == Mmsg) )
                     {
                       alert(MmsgTxt);
                       window.location.reload();                       
                       return;
                     }
                }
             }
        
         if (!MisErr) {
          var urlNode = xmlDoc.getElementsByTagName("URL"); 
          if (urlNode.length > 0) {
              var url = null;
              if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                url = urlNode[0].childNodes[0].text
              } else {
                url = urlNode[0].childNodes[0].textContent
              }
              if (url != null && url != "") {
                window.location = url;
              }
              return;
          }           
        
           var rootMenu = xmlDoc.getElementsByTagName("ROOTMENU");
           if(xmlDoc.getElementsByTagName("ROOTMENU") != null)
           {
             rootMenu = rootMenu[0]
			 getFunctions(gparentTag,rootMenu,true);
           }
        } 
        }
      }
      cursor_clear()
      }
}
  
function getFunctions(parentNode,menu,buildTree)
{

	var ind = 0
	if(menu != null)
    {
        var menuItemList = menu.childNodes;
        var childCount = menuItemList.length;
        var menuList = new Array();
        var menuListInd = 0;
        var ulNode = document.createElement("ul")
		parentNode.appendChild(ulNode )
        for (var i = 0; i < childCount; i++)
        {                 
            if(menuItemList[i].tagName=="FUNCTIONNAME")
            {   
                //Get next siblings for functionURL and functionType.
                var functionName = null;
                var functionUrlNode = menuItemList[i].nextSibling;
                var functionUrl = null;
                var functionTypeNode = functionUrlNode.nextSibling;
                var functionType = null;
                var liTag = document.createElement("li")
                if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                  functionName = menuItemList[i].text;
                  functionUrl = functionUrlNode.text;
                  functionType = functionTypeNode.text; 
                  liTag.id = parentNode.text
                  ulNode.id = parentNode.text
                }
                else {
                  functionName = menuItemList[i].textContent;
                  functionUrl = functionUrlNode.textContent;
                  functionType = functionTypeNode.textContent;
                  liTag.id = parentNode.textContent
                  ulNode.id = parentNode.textContent
                }
                i = i+2;                
				
                var anchorTag = document.createElement("a");
                anchorTag.href= functionUrl;
    
                var funcImgTag = document.createElement("img")
                funcImgTag.className='image'
                
                if("FORM" == functionType)
                  funcImgTag.src = '/OA_MEDIA/fwkhp_formsfunc.gif'
                else 
                  funcImgTag.src = '/OA_MEDIA/fwkhp_sswafunc.gif'
    
                anchorTag.appendChild(funcImgTag)          
                anchorTag.appendChild(document.createTextNode(functionName)); 
           
                liTag.appendChild(anchorTag)
                ulNode.appendChild(liTag)    
            }
            else if(menuItemList[i].tagName=="FUNCTIONURL")
            {
               continue;
            }
            else if(menuItemList[i].tagName=="FUNCTIONTYPE")
            {
               continue;
            }
            else if(menuItemList[i].tagName=="MENU")
            {
                menuList[menuListInd] = menuItemList[i];
                menuListInd = menuListInd + 1;

            }
        }    
        
        for(var j=0; j<menuList.length; j++)
        {
			var childMenu =  menuList[j];
			var menuPrompt = null;
            var menuId = null;
            var menuKey = null;
            var isMenuOpen = null;
            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
              menuPrompt = menuList[j].childNodes[0].text;
              menuId = menuList[j].childNodes[1].text;
              isMenuOpen = menuList[j].childNodes[2].text;
            }
            else {
				
              menuPrompt = menuList[j].childNodes[0].textContent;
              menuId = menuList[j].childNodes[1].textContent;
              isMenuOpen = menuList[j].childNodes[2].textContent;
            }
			
			var parentId = parentNode.id
			var keys = parentId.split(':')   
                        
            var respKey = keys[0]
            var applName = keys[1]
            var pmenuId = keys[2]
            var secGrpId = keys[3]
            menuKey = respKey+":"+applName+":"+menuId+":"+secGrpId                                   
			var menuLi = document.createElement('li');
			menuLi.id = menuKey
			var anchorTag = document.createElement("a");
			anchorTag.href= '#';
    
            var treeImgTag = document.createElement("img");
            treeImgTag.className='image';
            //syada added for the performance issue
            if (isMenuOpen == "True") {
                treeImgTag.src = Mplus; 
                treeImgTag.alt = Mexpand
            } else {
                treeImgTag.src = Mminus; 
                treeImgTag.alt = Mcollapse
            }
            
            //menuLi.appendChild(treeImgTag)
        
			var menuImgTag = document.createElement("img")
			menuImgTag.className='image'
			menuImgTag.src = '/OA_MEDIA/fwkhp_folder.gif'
			menuImgTag.alt = ""
            anchorTag.appendChild(treeImgTag) 
			anchorTag.appendChild(menuImgTag)          
			anchorTag.appendChild(document.createTextNode(menuPrompt)); 
			menuLi.appendChild(anchorTag);
			ulNode.appendChild(menuLi)   
			menuLi.onclick=function(e){
				var targ;
				if (!e) {
				e=window.event;
				}
				if (e.target)  {
				targ = e.currentTarget
				}
				else if (e.srcElement) {
					if (e.srcElement.id.indexOf(":") != -1) 
						targ = e.srcElement
					else if (e.srcElement.parentNode.id.indexOf(":") != -1)
						//<a> tag is under li tag. For li tag need the parent node
						targ = e.srcElement.parentNode
					else if (e.srcElement.parentNode.parentNode.id.indexOf(":") != -1)
						//expand/collapse images are under <a> tag. Hence, for li tag need the parent parent node
						targ = e.srcElement.parentNode.parentNode
				}
				var childMem = targ.getElementsByTagName("ul")
				if (childMem.length == 0) {					
					var keystr = targ.id
					var keys = keystr.split(':')                                        
					var respKey = keys[0]
					var applName = keys[1]
					var menuId = keys[2]
                                        var secGrpId = keys[3]
					gparentTag = targ
					// REST call to retrieve the menu list
					//var url = "RF.jsp?function_id=MAINMENUREST"
					var body = "<params><param>"+respKey+"</param>"
					body = body + "<param>"+applName+"</param>"
                                        body = body + "<param>"+menuId+"</param>"
                                        body = body + "<param>"+secGrpId+"</param>"                                
                                        body = body + "<param>"+Mmode+"</param></params>"
                                        
					getMainMenuXmlHttpObject()
					 cursor_wait()
					Mxml.onreadystatechange = parseMenuXML                                   
					Mxml.open("POST", Murl, true)
					Mxml.setRequestHeader("Content-type", "application/xml")
					Mxml.send(body)
				}
				else  {
                    //alert("has issue while getting childs "+childMem.id)                                
				}
			  }            
			if (childMenu.childNodes.length > 3) 
				getFunctions(menuLi,childMenu,true);
        }
        if (buildTree)
          buildSubTree(treeid, ulNode, 0)
    }  
  }

function createRespList(treeid,treeTag)
{
    if(!MisResp)
    {
      if(Mresp[0] != null)
      {
        for(var i=0; i<Mresp[0].length; i++)
        {
            MisResp = true;
			var liTag = document.createElement("li")	  
			var anchorTag = document.createElement("a")
			var respImgTag = document.createElement("img")
			respImgTag.className='image'
            respImgTag.src = '/OA_MEDIA/fwkhp_folder.gif'
			respImgTag.alt = ""
            anchorTag.href='#'
			var treeImgTag = document.createElement("img")
			treeImgTag.className='image'
			treeImgTag.src = Mplus
            treeImgTag.alt = Mexpand
			//liTag.appendChild(treeImgTag)
            anchorTag.appendChild(treeImgTag)
			anchorTag.appendChild(respImgTag)          
	        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	            anchorTag.appendChild(document.createTextNode(""+Mresp[0][i].text))  
                liTag.id = Mresp[1][i].text+":"+Mresp[2][i].text+":-1"+":"+Mresp[3][i].text
                
            }
	        else {
	           anchorTag.appendChild(document.createTextNode(""+Mresp[0][i].textContent))          
               liTag.id = Mresp[1][i].textContent+":"+Mresp[2][i].textContent+":-1"+":"+Mresp[3][i].textContent
            }
            
			liTag.appendChild(anchorTag)
			liTag.onclick=function(e){
				var targ;
				if (!e) {
				e=window.event;
				}
				if (e.target) {
				targ = e.currentTarget
				}
				else if (e.srcElement) {
					if (e.srcElement.id.indexOf(":") != -1) 
						targ = e.srcElement
					else if (e.srcElement.parentNode.id.indexOf(":") != -1)
						//<a> tag is under li tag. For li tag need the parent node
						targ = e.srcElement.parentNode
					else if (e.srcElement.parentNode.parentNode.id.indexOf(":") != -1)
						//expand/collapse images are under <a> tag. Hence, for li tag need the parent parent node
						targ = e.srcElement.parentNode.parentNode                                
				}
				var childMem = targ.getElementsByTagName("ul")
				if (childMem.length == 0) {					
					var keystr = targ.id
					var keys = keystr.split(':')                                        
					var respKey = keys[0]
					var applName = keys[1]
					var menuId = keys[2]
                                        var secGrpId = keys[3]
					gparentTag = targ
					// REST call to retrieve the menu list
					//var url = "RF.jsp?function_id=MAINMENUREST"
					var body = "<params><param>"+respKey+"</param>"
					body = body + "<param>"+applName+"</param>"
                                        body = body + "<param>"+menuId+"</param>"
                                        body = body + "<param>"+secGrpId+"</param>"                                
                                        body = body + "<param>"+Mmode+"</param></params>"

					getMainMenuXmlHttpObject()
					 cursor_wait()
					Mxml.onreadystatechange = parseMenuXML                                   
					Mxml.open("POST", Murl, true)
					Mxml.setRequestHeader("Content-type", "application/xml")
					Mxml.send(body)
				}
				else  {
                                    //alert("has issue while getting childs "+childMem.id)                                
				}
			  }
			liTag.className="rootmenu"
			treeTag.appendChild(liTag)	
            if (Mresp[3][i].nextSibling != null )
                if (Mresp[3][i].nextSibling.tagName == "ROOTMENU") {
                    
                    getFunctions(liTag,Mresp[3][i].nextSibling,true)
                }
		}
        //buildSubTree(treeid,treeTag,0)
      }        
    }
  }

function buildSubTree(treeid, ulelement, index)
{
	if(document.getElementById(treeid) == ulelement.parentNode.parentNode)
	{
	  ulelement.parentNode.className="rootmenu"
	}
	else
	{
	  ulelement.parentNode.className="submenu"
	}
	//ulelement.parentNode.className="submenu"
	var parentType = ulelement.parentNode;
	if (typeof Mpersist[treeid]=="object"){ //if cookie exists (Mpersist[treeid] is an array versus "" string)
	if (searcharray(Mpersist[treeid], index)){
	var aTag = ulelement.parentNode.getElementsByTagName('IMG')[0]
	if(aTag.src.indexOf(Mplus)>=0) {
		aTag.src = aTag.src.replace(Mplus,Mminus);
        aTag.alt = Mcollapse
		ulelement.setAttribute("rel", "open")
		ulelement.style.display="block"
	} else if(aTag.src.indexOf(Mminus)>=0) {
		aTag.src = aTag.src.replace(Mminus,Mplus);
        aTag.alt = Mexpand;
		ulelement.setAttribute("rel", "closed")
		ulelement.style.display="none"
	} else {
		var img = document.createElement('IMG')
		img.src = Mminus
        img.alt = Mcollapse
		ulelement.parentNode.insertBefore(img, ulelement.parentNode.getElementsByTagName('img')[0]);
                //ulelement.parentNode.getElementsByTagName('A')[0].appendChild(img);
		ulelement.setAttribute("rel", "open")
		ulelement.style.display="block"
	}

	//ulelement.parentNode.style.backgroundImage="url("+Mminus+")"
	}
	else {
	var aTag = ulelement.parentNode.getElementsByTagName('IMG')[0]
	if(aTag.src.indexOf(Mminus)>=0) {
		aTag.src = aTag.src.replace(Mminus,Mplus);
        aTag.alt = Mexpand
		ulelement.setAttribute("rel", "closed")
		ulelement.style.display="none"
	} else if(aTag.src.indexOf(Mplus)>=0) {
		aTag.src = aTag.src.replace(Mplus,Mminus);
        aTag.alt = Mcollapse
	  	ulelement.setAttribute("rel", "open")
		ulelement.style.display="block"
	}else {
		var img = document.createElement('IMG')
		img.src = Mplus
        img.alt = Mexpand
        ulelement.parentNode.insertBefore(img, ulelement.parentNode.getElementsByTagName('img')[0])
        ulelement.setAttribute("rel", "closed")
		ulelement.style.display="none"
	}
	}
	} //end cookie persist code
	else if (ulelement.getAttribute("rel")==null || ulelement.getAttribute("rel")==false) //if no cookie and UL has NO rel attribute explicted added by user
	{
	var aTag = ulelement.parentNode.getElementsByTagName('IMG')[0]
	if(aTag.src.indexOf(Mminus)>=0) {
		aTag.src = aTag.src.replace(Mminus,Mplus)
        aTag.alt = Mexpand
		ulelement.setAttribute("rel", "closed")
		ulelement.style.display="none"
	} else if(aTag.src.indexOf(Mplus)>=0) {
		aTag.src = aTag.src.replace(Mplus,Mminus)
        aTag.alt = Mcollapse
	  	ulelement.setAttribute("rel", "open")
		ulelement.style.display="block"
	}else {
		var img = document.createElement('IMG')
		img.src = Mplus
        img.alt = Mexpand
		ulelement.parentNode.insertBefore(img, ulelement.parentNode.getElementsByTagName('img')[0])
	    ulelement.setAttribute("rel", "closed")
		ulelement.style.display="none"
	        
	}
	//ulelement.setAttribute("rel", "closed")
	}
	else if (ulelement.getAttribute("rel")=="open") //else if no cookie and this UL has an explicit rel value of "open"
	{
	expandSubTree(treeid, ulelement) //expand this UL plus all parent ULs (so the most inner UL is revealed!)
	}
	ulelement.parentNode.onclick=function(e){
		var targ;
		if (!e) {
		e=window.event;
		}
		if (e.target)  {

		targ = e.currentTarget
		}
		else if (e.srcElement) {
			if (e.srcElement.id.indexOf(":") != -1) 
				targ = e.srcElement
			else if (e.srcElement.parentNode.id.indexOf(":") != -1)
				//<a> tag is under li tag. For li tag need the parent node
				targ = e.srcElement.parentNode
			else if (e.srcElement.parentNode.parentNode.id.indexOf(":") != -1)
				//expand/collapse images are under <a> tag. Hence, for li tag need the parent parent node
				targ = e.srcElement.parentNode.parentNode               
		}
		var childMem = targ.getElementsByTagName("ul")
		var expandOrContact = "none"
		var submenu=this.getElementsByTagName("ul")[0]
		if (submenu.getAttribute("rel")=="closed"){
			expandOrContact = "EXPAND"
		}
		else if (submenu.getAttribute("rel")=="open"){
			expandOrContact = "CONTACT"
		}

		// REST call to update the expandlist
		//var url = "RF.jsp?function_id=MAINMENUREST"
		var body = "<params><param>"+expandOrContact+"</param>"
		body = body + "<param>"+targ.id+"</param></params>"
                getMainMenuXmlHttpObject()
		submenu1 = submenu
		ulelement1 = ulelement
		Mxml.onreadystatechange = processOuput                                   
		Mxml.open("POST", Murl, true)
		Mxml.setRequestHeader("Content-type", "application/xml")
		Mxml.send(body)	                                                        		
	}
	noProcessMethod = function() {
        
	}
	ulelement.onclick=function(e){
            preventpropagate(e)
	}
}

function processOuput() {
    if (Mxml.readyState == 4) // 4 = "loaded"
    {
      if (Mxml.status == 200)
      {
         xmlDoc = Mxml.responseXML
		var MisErr = false;
		var err = xmlDoc.getElementsByTagName("error");
		if ((err != null) && (err.length > 0))
		{
			MisErr = true;
                        cursor_clear();
			if ( err[0].childNodes.length >= 2) {
				 var Mcode = null;
				 var Mmsg = null;
				 var MmsgTxt = null;
				 if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
				 {
				   Mcode = err[0].childNodes[0].text;
				   Mmsg = err[0].childNodes[1].text;
				   if (err[0].childNodes.length >= 3)
					MmsgTxt = err[0].childNodes[2].text;
				 }
				 else
				 {
				   Mcode = err[0].childNodes[0].textContent;
				   Mmsg = err[0].childNodes[1].textContent;
				   if (err[0].childNodes.length >= 3)
					MmsgTxt = err[0].childNodes[2].textContent;               
				 }           
				 if( ("401" == Mcode) && ("FND_SESSION_EXPIRED" == Mmsg) )
				 {
				   alert(MmsgTxt);
				   window.location.reload();
				   return;
				 }
			}
		}
		if (!MisErr) 
		{
	        if(!xmlDoc || xmlDoc.childNodes.length==0)
	        {
	          var text = Mxml.responseText
	          xmlDoc = loadMainMenuXmlContentString(text)
	        }
	        if (xmlDoc != null)       
	        {      
	          var urlNode = xmlDoc.getElementsByTagName("URL"); 
	          if (urlNode.length > 0) {
	              var url = null;
	              if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	                url = urlNode[0].childNodes[0].text
	              } else {
	                url = urlNode[0].childNodes[0].textContent
	              }
	              if (url != null && url != "") {
	                window.location = url;
	              }
	              return;
				}   
			}
		}
		if (submenu1.getAttribute("rel")=="closed"){
		submenu1.style.display="block"
		submenu1.setAttribute("rel", "open")
		thisNode = ulelement1.parentNode.getElementsByTagName('IMG')[0]; 
		if(thisNode.src.indexOf(Mplus)>=0){
		thisNode.src = thisNode.src.replace(Mplus,Mminus);        
        thisNode.alt = Mcollapse
		}
		}
		else if (submenu1.getAttribute("rel")=="open"){
		submenu1.style.display="none"
		submenu1.setAttribute("rel", "closed")
		thisNode = ulelement1.parentNode.getElementsByTagName('IMG')[0]; 
		if(thisNode.src.indexOf(Mminus)>=0){
		thisNode.src = thisNode.src.replace(Mminus,Mplus);
        thisNode.alt = Mexpand;
		}		
		}
		
		}			
	}
}
function expandSubTree(treeid, ulelement){ 
	var rootnode=document.getElementById(treeid)
	var currentnode=ulelement
	currentnode.style.display="block"	
	var img = document.createElement('IMG');
	img.src = Mminus;
    img.alt = Mcollapse;
	var aTag = ulelement.parentNode.getElementsByTagName('IMG')[0];
	ulelement.parentNode.insertBefore(img, ulelement.parentNode.getElementsByTagName('img')[0]);
	while (currentnode!=rootnode){
		if (currentnode.tagName=="UL"){ //if parent node is a UL, expand it too
		currentnode.style.display="block"
		currentnode.setAttribute("rel", "open") //indicate it's open
		var img = document.createElement('IMG');
		img.src = Mminus;
        img.alt = Mcollapse;
		var aTag = ulelement.parentNode.getElementsByTagName('IMG')[0];
		ulelement.parentNode.insertBefore(img, ulelement.parentNode.getElementsByTagName('img')[0]);
		}
		currentnode=currentnode.parentNode
	}
}

function flatten(treeid, action){ //expand or contract all UL elements
	var ultags=document.getElementById(treeid).getElementsByTagName("ul")
	for (var i=0; i<ultags.length; i++){
		ultags[i].style.display=(action=="expand")? "block" : "none"
		var relvalue=(action=="expand")? "open" : "closed"
		ultags[i].setAttribute("rel", relvalue)
		//ultags[i].parentNode.style.backgroundImage=(action=="expand")? "url("+Mminus+")" : "url("+Mplus+")"
		var aTag = ultags[i].parentNode.getElementsByTagName('IMG')[0]
		if (action == 'expand')
		{
			if(aTag.src.indexOf(Mplus)>=0) {
				aTag.src = aTag.src.replace(Mplus,Mminus);
                aTag.alt = Mcollapse;
			    ultags[i].style.display="block"
			}	 
		}
		else {
			if(aTag.src.indexOf(Mminus)>=0) {
			aTag.src = aTag.src.replace(Mminus,Mplus);
            aTag.alt = Mexpand;
			}
		}
	}
}

function rememberstate(treeid, durationdays){ //store index of opened ULs relative to other ULs in Tree into cookie
	var ultags=document.getElementById(treeid).getElementsByTagName("ul")
	var openuls=new Array()
	for (var i=0; i<ultags.length; i++){
	if (ultags[i].getAttribute("rel")=="open")
	openuls[openuls.length]=i //save the index of the opened UL (relative to the entire list of ULs) as an array element
	}
	if (openuls.length==0) //if there are no opened ULs to save/persist
	openuls[0]="none open" //set array value to string to simply indicate all ULs should persist with state being closed
	setCookie(treeid, openuls.join(","), durationdays) 
	//populate cookie with value treeid=1,2,3 etc (where 1,2... are the indexes of the opened ULs)
}

function getCookie(Name){ //get cookie value
	var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
	if (document.cookie.match(re)) //if cookie found
	return document.cookie.match(re)[0].split("=")[1] //return its value
	return ""
}

function setCookie(name, value, days){ //set cookei value
	var expireDate = new Date()
	//set "expstring" to either future or past date, to set or delete cookie, respectively
	var expstring=expireDate.setDate(expireDate.getDate()+parseInt(days))
	document.cookie = name+"="+value+"; expires="+expireDate.toGMTString()+"; path=/";
}

function searcharray(thearray, value){ //searches an array for the entered value. If found, delete value from array
	var isfound=false
	for (var i=0; i<thearray.length; i++){
		if (thearray[i]==value){
			isfound=true
			thearray.shift() //delete this element from array for efficiency sake
			break
		}
	}
	return isfound
}

function preventpropagate(e)
{ 
	//prevent action from bubbling upwards
	if (typeof e!="undefined")
	e.stopPropagation()
	else
	event.cancelBubble=true
}

function dotask(target, functionref, tasktype)
{ //assign a function to execute to an event handler (ie: onunload)
	var tasktype=(window.addEventListener)? tasktype : "on"+tasktype
	if (target.addEventListener)
	target.addEventListener(tasktype, functionref, false)
	else if (target.attachEvent)
	target.attachEvent(tasktype, functionref)
}

// Changes the cursor to an hourglass
function cursor_wait() {
	document.body.style.cursor = "wait";
}

// Returns the cursor to the default pointer
function cursor_clear() {
	document.body.style.cursor = 'default';
}
