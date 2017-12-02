/*=================================================================+
|               Copyright (c) 2009 Oracle Corporation              |
|                  Redwood Shores, California, USA                 |
|                       All rights reserved.                       |
+==================================================================+
| FILENAME                                                         |
|   attachmentPopup.js                                                |
|                                                                  |
| HISTORY                                                          |
|   21-APR-2009 deepjain  Created                                   |
+==================================================================*/
/* $Header: attachmentPopup.js 120.0.12010000.33 2010/05/14 10:04:29 sette noship $ */

var AMaddWTitle;
var AMaddAnBtn;
var AMalertEmptyFileField;
var AMalertEmptyText;
var AMalertEmptyUrl;
var AMxmlHttpUnsupported;
var AMfile;
var AMattType;
var AMtext;
var AMurl;
var AMcancelBtn;
var AMcategory;
var AMdeleteTooltip;
var AMdeleteIcon;
var AMdetails;
var AMdisabledNextTooltip;
var AMdisabledPrevTooltip;
var AMenabledNextTooltip;
var AMenabledPrevTooltip;
var AMmore;
var AMnext5;
var AMnext;
var AMprev5;
var AMprev;
var AMsaveBtn;
var AMtitle;
var AMundefined;
var AMtype;
var AMupdateiconTooltip;
var AMupdateBtn;
var AMupdateCol;
var AMupdateWTitle;
var AMviewWTitle;
var AMconfirmText;
var AMcloseButtonText;
var open_first=false;
var open_second=false;
var exist=false;
var exist1=false;
var addButton=false;
var parentN
var prevSelected;
var entityInfo;
var AfullInfo;
var categoryId='1';
var categoryName='Miscellaneous';
var multiCategory = false;
var uniqueKey;
var splitInfo1;
var z;
var x;
var numOfAttachments = 0;
var object;
var information;
var baseAM;
var whereClauseParam;
var refreshListOfFiles;
var ArefreshAddArea = false;
var inform;
var ttx;
var tty;
var tableId;
var userId;
var userName;
var rest_url;
var AxmlHttp
var voArray;
//8648409
var AttUpdTxt;
var AttUpdUrl;
var AttUpdAction;
//8660141
var attAddAction;
var att_attType, att_attachedDocumentId, att_categoryId, att_i, att_j
var AT_autoCommit;
var AT_itemStyle;
var AstartIndex = 0;
var AnoOfRows = 6;
var AisPrevEnabled = false;
var AisNextEnabled = false;
var Atmr;
var AisTmrSet = false;
var Acurrfield = '';
var AisMsgsSet = 'N';
var AreadingStyle = '1'; // 1 - Left To Right Reading, 2 - Right To Left Reading
var AfileOptionSelected = 'N';
var Aoperation;
var Aaction='';
var AupdateCnfMsg='';

function showFiles(obj,info,amName,whereClause,tableI,user,urlString)
{
  if ( AisTmrSet == true ) return;
  if(open_first ==true && object == obj && refreshListOfFiles != true) return;
  //8844657 -- gteella
  if((open_second==false && attAddAction != 'AddAttachment') || refreshListOfFiles==true) {
    var a1=function()
    { 
      if(open_first ==true && refreshListOfFiles != true) {
        tt_HideInit();
      }
      if ( refreshListOfFiles != true )  {
        ttx = parseInt(AfindPosX(obj));
        tty = parseInt(AfindPosY(obj));
      }
      open_first=true;
      numOfAttachments = 0;
      
      object = obj;
      information = info;
      baseAM = amName;
      whereClauseParam = whereClause;
      tableId=tableI;
      userId=user;
      rest_url = urlString;
      showUser(info,amName,whereClause);
    }
    if ( refreshListOfFiles==true)
       Atmr=setTimeout(a1,0);
    else
       Atmr=setTimeout(a1,1000);
  }
}

function showFilesForMsgInline(obj,info,amName,whereClause,tableI,user,urlString, addInfo)
{
  AfullInfo = addInfo;
  showFiles(obj,info,amName,whereClause,tableI,user,urlString);
}

function refreshAttachments()
{
    if(AT_itemStyle == 'ATTACHMENT_TABLE')
        return;
    if(refreshListOfFiles == true)
        showFiles(object,information,baseAM,whereClauseParam,tableId,userId,rest_url)
}

function clearAttTimer()
{
  clearTimeout(Atmr);
  AisTmrSet = false;
}


function addText(obj,amName,info)
{
  if(open_second == false && (open_first==false ||  AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT' )){
    var a1=function()
    {

      if( AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT' ) 
        info = AfullInfo;
        
      if ( ArefreshAddArea != true ) {
      
        if( AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT' ) {
          open_second = true;
          info = AfullInfo;
          ddx = parseInt(AfindPosX(obj));
          ddy = parseInt(AfindPosY(obj));
        }
        else {
          open_first = true;      
          ttx = parseInt(AfindPosX(obj));
          tty = parseInt(AfindPosY(obj));
        }
      }
      baseAM=amName;

      AisTmrSet = false;
      entityInfo=info;
      
      AxmlHttp=GetXmlHttpObject()
      if (AxmlHttp==null)
      {
        alert (AMxmlHttpUnsupported);
        return;
      }
      
      // Get the last index of :: 
      // Get the URL which is after indexR
      AfullInfo = entityInfo;
      var indexR = AfullInfo.lastIndexOf('::');
      rest_url =  AfullInfo.substring(indexR+2);
      entityInfo = AfullInfo.substring(0,indexR);
      var body= "<params> <param>"+amName+"</param><param>getCategoryNames</param><param>"+entityInfo+"</param><param>CREATE</param><param>"+AisMsgsSet+"</param></params>";
      AxmlHttp.onreadystatechange=stateChanged3
      
      AxmlHttp.open("POST",rest_url,true);
      AxmlHttp.setRequestHeader("OAFunc","FND_DIALOG_PAGE");
      AxmlHttp.setRequestHeader("Content-type", "application/xml");
      AxmlHttp.send(body)
    }
    if ( ArefreshAddArea==true  ||  AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT')
      Atmr=setTimeout(a1,0);
    else {
      AisTmrSet = true;
      Atmr=setTimeout(a1,1000);
    }
  }
}



function AloadXmlContentString(xmlData) 
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

function AvalidateResponse( AxmlDoc )
{
  if ( AxmlDoc == null )
    return 'true';

  // Session Timeout Validation
  var errorXML =  xmlDoc.getElementsByTagName('error');
  if ( errorXML != null && errorXML.length > 0 )
  {
     var errorMessage = errorXML[0].getElementsByTagName('message');
     if ( errorMessage != null && errorMessage.length > 0 && errorMessage[0].childNodes[0].nodeValue == 'FND_SESSION_EXPIRED' )
     {
	var messageText = errorXML[0].getElementsByTagName('messagetext')[0].childNodes[0].nodeValue;
	alert(messageText);
        window.location.reload();
        return 'true';
     }
  } 


  var responseXML = xmlDoc.getElementsByTagName('response');
  if ( responseXML == null || responseXML.length == 0 )
    return 'true';
  return 'false';
}


function stateChanged3(){

 if (AxmlHttp.readyState==4 || AxmlHttp.readyState=="complete")
 {
  xmlDoc = AloadXmlContentString(AxmlHttp.responseText);
  var failure = AvalidateResponse(xmlDoc);
  if (failure == 'true' ){
    if( AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT' )
      open_second = false;
    else 
      open_first = false;
    return;
  }
  
  var splitInfo = entityInfo.split('::');
  uniqueKey = splitInfo[1];
  userName = splitInfo[3];
  tableId = splitInfo[6];
  AT_itemStyle = splitInfo[7];
  
  var fndCatNameVOXml =  xmlDoc.getElementsByTagName('response')[0].childNodes;
  if(AisMsgsSet == 'N') {
    var i18n = xmlDoc.getElementsByTagName('response')[0].getElementsByTagName('i18n');
    if(i18n != null && i18n.length > 0) {
        var lookupVORow = i18n[0].childNodes[0].childNodes[0].childNodes;
        setAllMsgs(lookupVORow);
        AisMsgsSet = 'Y';
    }
    if(isBiDi())
        AreadingStyle = 2;
  }
  if(AreadingStyle == 2)
  {
    config. TitleAlign		= 'right';
    config1. TitleAlign		= 'right';
  }
  if( fndCatNameVOXml != null)
    categoryMapXML = fndCatNameVOXml[0].getElementsByTagName('FndCategoryNameVORow');
  var popList="";
  var numOfCategories=categoryMapXML.length;
  if(categoryMapXML != null && categoryMapXML.length > 1){
    popList=popList+"<select id=categoryList>";
    for(var i=0;i<numOfCategories;i++)
    {
      var index= 8 + 2*i;
      popList=popList+"<option value="+categoryMapXML[i].childNodes[1].childNodes[0].nodeValue+">"+categoryMapXML[i].childNodes[0].childNodes[0].nodeValue+"</option>";
    }
    popList=popList+"</select>";
    multiCategory = true;
  }
  else if ( categoryMapXML != null && categoryMapXML.length == 1 ){
    popList = popList + "<input type=text style=border:0px;background-color:#f2f2f5 id=categoryList value=\""+categoryMapXML[0].childNodes[0].childNodes[0].nodeValue+"\" readonly=readonly />";
    categoryId = categoryMapXML[0].childNodes[1].childNodes[0].nodeValue;
    categoryName = categoryMapXML[0].childNodes[0].childNodes[0].nodeValue;
  }
  else
    popList=popList +  + "<input type=text style=border:0px;font:bold;background-color:#f2f2f5 id=categoryList value=Miscellaneous readonly=readonly />";

  var align = '';
  if(AreadingStyle == 1)  
    align = 'right';
  else
    align = 'left';
    
  var selectText = 'selected';
  var selectFile = '';
  var hideFile = 'STYLE="display: none"';
  var hideText = '';
  if(AfileOptionSelected == 'Y')
  {
    selectText = '';
    selectFile = 'selected';
    hideFile = '';
    hideText = 'STYLE="display: none"';
    AfileOptionSelected = 'N';
  }
  var cnfMsgDiv = '<div id=cnfMsgDiv>'+getConfirmationMsgDiv()+'</div>'

  //gteella - 8623844
  //8667267 - made cell padding to zero so there wont be more space between cells.
  var addTextAreaIE = cnfMsgDiv + '<table cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" border = "0" id=\"table1\">' +
      '			<tr>' + 
      '				<td height=\"22\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMattType+'</td>' + 
      '				<td height=\"22\">&nbsp;</td>' + 
      '                           <td VALIGN = Top height=\"22\"><select id=attType onchange=\"onSelection();\"><option '+selectFile+'>'+AMfile+'</option><option>'+AMurl+'</option><option '+selectText+'>'+AMtext+'</option></select></td>' +
      '                           <td height="22" width="19">&nbsp;</td>'+
      '			</tr>' + 
      '			<tr>' + 
      '				<td height=\"22\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMtitle+'</td>' + 
      '				<td height=\"22\">&nbsp;</td>' + 
      '				<td VALIGN = Top height=\"22\"><input type=\"text\" size=\"29\" maxlength=\"80\" class=x4 id=\"attachTitle\" > </td>' +
      '                           <td height="22" width="19">&nbsp;</td>'+
      '			</tr>' + 
      '			<tr>' + 
      '				<td height=\"22\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMcategory+'</td>' + 
      '				<td height=\"22\">&nbsp;</td>' + 
      '				<td VALIGN = Top height=\"22\">'+popList+'</td>' +
      '                           <td height="22" width="19">&nbsp;</td>'+
      '			</tr>' + 
      '     <tr id=\"tridfile\" '+hideFile+'>' + 
      '				<td height=\"22\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMfile+'</td>' + 
      '				<td height=\"22\">&nbsp;</td>' + 
      '				<td VALIGN = Top height=\"22\"><input type=file  name=\"FileInput\" id=\"FileInput\" size=\"20\" maxlength=4000 / ></td>' +
      '                           <td height="22" width="19">&nbsp;</td>'+
      '			</tr>' + 
      '     <tr id=\"tridurl\" STYLE=\"display: none\">' + 
      '				<td height=\"22\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMurl+'</td>' + 
      '				<td height=\"22\">&nbsp;</td>' + 
      '				<td VALIGN = Top height=\"22\"><input type=text  name=\"UrlInput\" id=\"UrlInput\" size=\"29\" class=x4  maxlength=4000 / ></td>' +
      '                           <td height="22" width="19">&nbsp;</td>'+
      '			</tr>' + 
      '			<tr id="tridshorttextt" '+hideText+'>' + 
      '				<td width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMtext+'</td>' + 
      '				<td valign=top>' + 
      '					&nbsp;</td>' + 
      '				<td valign=top>' + 
      '					<p><textarea rows=\"6\" cols=\"30\" name=\"shorttextt\" id=\"shorttextt\" class=x4   onkeypress=\"return _checkLength(this,4000,event)\" onchange=\"return _checkLength(this,4000,event)\" ></textarea>' + 
      '                                        </p>' + 
      '				</td>' + 
      '                           <td height="22" width="19">&nbsp;</td>'+
      '			</tr>' + 
      '		</table>' + 
      '           <table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" id=\"table2\" class=\"x1n x50\">' +
      '			<tr>' + 
      '				<td width=\"100\">&nbsp;</td>' + 
      '				<td><input type=\"submit\" align=left value='+AMsaveBtn+' class=\"x7g\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif);\" onclick=\"showUser1()\"></td>' + 
      '				<td><input type=\"submit\" align=left value=\"'+AMaddAnBtn+'\" class=\"x7g\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif);\" onclick=showUser1(\"AddAnother\")></td>' + 
      '				<td><input type=\"reset\"  align=left value='+AMcancelBtn+' class=\"x7g\" onclick=\"cancel_Add_HideInit()\" style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\"></td>' + 
      '                         <td>&nbsp;</td>' +
      '			</tr>' +
      '		</table>' ;
  
  var addTextAreaMoz = cnfMsgDiv + '<table cellspacing=\"1\" cellpadding=\"0\" width=\"100%\" border = "0" id=\"table1\">' +
      '			<tr>' + 
      '				<td height=\"18\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMattType+'</td>' + 
      '				<td height=\"18\">&nbsp;</td>' + 
      '                           <td VALIGN = Top height=\"18\"><select id=attType onchange=\"onSelection();\"><option '+selectFile+'>'+AMfile+'</option><option>'+AMurl+'</option><option '+selectText+'>'+AMtext+'</option></select></td>' +
      '                           <td height="18" width="19">&nbsp;</td>'+
      '			</tr>' + 
      '			<tr>' + 
      '				<td height=\"18\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMtitle+'</td>' + 
      '				<td height=\"18\">&nbsp;</td>' + 
      '				<td VALIGN = Top height=\"18\"><input type=\"text\" size=\"33\" maxlength=\"80\" class=x4 id=\"attachTitle\" > </td>' +
      '                           <td height="18" width="19">&nbsp;</td>'+
      '			</tr>' + 
      '			<tr>' + 
      '				<td height=\"18\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMcategory+'</td>' + 
      '				<td height=\"18\">&nbsp;</td>' + 
      '				<td VALIGN = Top height=\"18\">'+popList+'</td>' +
      '       <td height="18" width="19">&nbsp;</td>'+
      '			</tr>' +
      '     <tr id="tridfile" '+hideFile+'>' +
      '				<td height=\"18\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMfile+'</td>' + 
      '				<td height=\"18\">&nbsp;</td>' + 
      '				<td VALIGN = Top height=\"18\"><input type=file  name=\"FileInput\" id=\"FileInput\" size=\"25\" maxlength=4000 / ></td>' +
      '       <td height="18" width="19">&nbsp;</td>'+
      '			</tr>' +
      '     <tr id="tridurl" STYLE=\"display: none\">' +
      '				<td height=\"18\" width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMurl+'</td>' + 
      '				<td height=\"18\">&nbsp;</td>' + 
      '				<td VALIGN = Top height=\"18\"><input type=text  name=\"UrlInput\" id=\"UrlInput\" size=\"33\" class=x4  maxlength=4000 / ></td>' +
      '       <td height="18" width="19">&nbsp;</td>'+
      '			</tr>' +
      '			<tr id="tridshorttextt" '+hideText+'>' + 
      '				<td width=\"110\" valign=top align='+align+' class=OraFieldText>'+AMtext+'</td>' +
      '				<td valign=top>' + 
      '					&nbsp;</td>' + 
      '				<td valign=top>' + 
      '					<p><textarea rows=\"6\" cols=\"30\" name=\"shorttextt\" id=\"shorttextt\" class=x4   onkeypress=\"return _checkLength(this,4000,event)\" onchange=\"return _checkLength(this,4000,event)\" ></textarea>' + 
      '                                        </p>' + 
      '				</td>' + 
      '                           <td height="18" width="19">&nbsp;</td>'+
      '			</tr>' +
      '		</table>' + 
      '           <table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" id=\"table2\" class=\"x1n x50\">' +
      '			<tr>' + 
      '				<td width=\"100\">&nbsp;</td>' + 
      '				<td><input type=\"submit\" align=left value='+AMsaveBtn+' class=\"x7g\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif);\" onclick=\"showUser1()\"></td>' + 
      '				<td><input type=\"submit\" align=left value=\"'+AMaddAnBtn+'\" class=\"x7g\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif);\" onclick=showUser1(\"AddAnother\")></td>' + 
      '				<td><input type=\"reset\"  align=left value=\"'+AMcancelBtn+'\" class=\"x7g\" onclick=\"cancel_Add_HideInit()\" style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\"></td>' + 
      '                         <td>&nbsp;</td>' +
      '			</tr>' +
      '		</table> ' ;
      
  var addTextArea;
  var browserT = new Browser();
      if(browserT.isIE) {
           addTextArea = addTextAreaIE;
      } else {
           addTextArea = addTextAreaMoz;
      }
  //8660141 -- gteella    
  attAddAction= "AddAttachment";
  if(AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT') {
    ddTip(addTextArea,TITLE, AMaddWTitle, 
    STICKY, 1, CLOSEBTN, true)
    showOfDiv("ddTtDiV");
  }
  else {
    Tip(addTextArea,TITLE, AMaddWTitle, 
    STICKY, 1, CLOSEBTN, true)
    showOfDiv("WzTtDiV");
  }
  }

}


function showOfDiv(div) {
        if(!div) {
        return;
      }
      div = typeof div === "string" ? document.getElementById(div) : div;
      var elms = div.getElementsByTagName("*");
      outerloop:
      for(var i = 0, maxI = elms.length; i < maxI; ++i) {
        
        var elm = elms[i];
        var element = elm;
        switch(elm.type) {
          case "text":
          case "textarea":
          case "button":
          case "reset":
          case "submit":
          case "file":
          case "hidden":
          case "password":
          case "image": 
          case "radio":
          case "checkbox":
          case "select-one": if( element.type != "hidden" && element.style.display != "none"  && !element.disabled ) {
                                        setFocusForElement(element)
                                        break outerloop;
                       }
          case "select-multiple":
        }
      }
    }
    
function setFocusForElement(element) {
    if( element.type != "hidden" && element.style.display != "none"  && !element.disabled ) {
                                        Acurrfield = element;
                                        setTimeout("Acurrfield.focus()", 1);
     }
}
//gteella - 8628300
function onSelection() {
  var browserTo = new Browser();
    if(browserTo.isIE) {
         if(document.getElementById("attType") != null) {
            var dropDownListRef =  document.getElementById("attType");
            var selectedIndex = dropDownListRef.selectedIndex;
            var selectedText = dropDownListRef.options[selectedIndex].text;
            if(selectedText == AMurl) {
                document.getElementById("tridshorttextt").style.display="none";
                document.getElementById("tridfile").style.display="none";
                document.getElementById("tridurl").style.display = '';
            }
            else if(selectedText == AMtext) {
                document.getElementById("tridfile").style.display="none";
                document.getElementById("tridurl").style.display="none";
                document.getElementById("tridshorttextt").style.display = '';
            }
            else if(selectedText == AMfile) {
                document.getElementById("tridshorttextt").style.display="none";
                document.getElementById("tridurl").style.display="none";
                document.getElementById("tridfile").style.display = '';
            }
        }
    } else { 
    
    if(document.getElementById("attType") != null) {
            
                if(document.getElementById("attType").value == AMurl) {
                    document.getElementById("tridshorttextt").style.display="none";
                    document.getElementById("tridfile").style.display="none";
                    document.getElementById("tridurl").style.display = '';
                }
                if(document.getElementById("attType").value == AMtext) {
                    document.getElementById("tridfile").style.display="none";
                    document.getElementById("tridurl").style.display="none";
                    document.getElementById("tridshorttextt").style.display = '';
                }
                if(document.getElementById("attType").value == AMfile) {
                    document.getElementById("tridshorttextt").style.display="none";
                    document.getElementById("tridurl").style.display="none";
                    document.getElementById("tridfile").style.display = '';
                }
      }
  }
   
}
function showUser(info,amName,whereClause)
{
  AxmlHttp=GetXmlHttpObject()
  if (AxmlHttp==null)
  {
    alert (AMxmlHttpUnsupported);
    return;
  }
 
  splitInfo1 = info.split('::');
  var splitInfo = info.split('::');
  uniqueKey = splitInfo[1];
  userName = splitInfo[3];
  var body= "<params> <param>"+amName+"</param><param>getListOfFiles</param><param>"+info+"</param><param>"+whereClause+"</param><param>"+AstartIndex+"</param><param>"+AnoOfRows+"</param><param>"+AisMsgsSet+"</param></params>";

  AxmlHttp.onreadystatechange=stateChanged
  AxmlHttp.open("POST",rest_url,true);
  AxmlHttp.setRequestHeader("OAFunc","FND_DIALOG_PAGE");
  AxmlHttp.setRequestHeader("Content-type", "application/xml");
  AxmlHttp.send(body)
}

//8626934 - gteella
function showUser1(isAddAnother)
{
  // Form Validation
  var attType =  document.getElementById('attType').options[document.getElementById('attType').selectedIndex].text
  var urlValue = document.getElementById("UrlInput");
  var shorttext = document.getElementById("shorttextt");
  var filePath = document.getElementById("FileInput");

  if ( attType == AMurl )
  {
   if (urlValue.value == "")
   {
     alert(AMalertEmptyUrl);
     return;
   }
  }
  else if ( attType == AMtext )
  {
   if (shorttext.value == "")
   {   
     alert(AMalertEmptyText);
     return;
   }
  }
  else if ( attType == AMfile )
  {
   if (filePath.value == "")
   {   
     alert(AMalertEmptyFileField);
     return;
   }
  }

  AxmlHttp=GetXmlHttpObject()
  if (AxmlHttp==null)
  {
    alert (AMxmlHttpUnsupported);
   return;
  }
 
  var title = document.getElementById("attachTitle");
  if( multiCategory)
  {
    categoryId = document.getElementById('categoryList').options[document.getElementById('categoryList').selectedIndex].value
    categoryName =  document.getElementById('categoryList').options[document.getElementById('categoryList').selectedIndex].text
  }

  if(AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT' )
    refreshListOfFiles = true;

  var attType =  document.getElementById('attType').options[document.getElementById('attType').selectedIndex].text

  // Bug 8609265
  entityInfo = unescape(entityInfo);
  if ( attType == AMurl ) 
  {
    _submitPartialChange('DefaultFormName',0,{event:'AddInlineAttachment',attType:'Url',entityInfo:entityInfo,urlInput:urlValue.value,title:title.value,categoryId:categoryId,categoryName:categoryName,attachmentStyle:AT_itemStyle,partialTargets:tableId+' cnfMsg'});
  }
  else if ( attType == AMtext ) 
  {
    _submitPartialChange('DefaultFormName',0,{event:'AddInlineAttachment',attType:'Text',entityInfo:entityInfo,shortText:shorttext.value,title:title.value,categoryId:categoryId,categoryName:categoryName,attachmentStyle:AT_itemStyle,partialTargets:tableId+' cnfMsg'});
  }
  else if ( attType == AMfile ) 
  {
    var fileTypeInput = document.getElementById('FileInput');
    document.forms['DefaultFormName'].appendChild(fileTypeInput);
    var isEnctypeSet = false;
    if( document.forms['DefaultFormName'].enctype != 'multipart/form-data')
    {
      isEnctypeSet = true;
      document.forms['DefaultFormName'].enctype='multipart/form-data';
      document.forms['DefaultFormName'].encoding='multipart/form-data';
    }

    _submitPartialChange('DefaultFormName',0,{event:'AddInlineAttachment',attType:'File',entityInfo:entityInfo,title:title.value,categoryId:categoryId,categoryName:categoryName,attachmentStyle:AT_itemStyle,partialTargets:tableId+' cnfMsg'});
    if ( isEnctypeSet == true )
    {
      document.forms['DefaultFormName'].enctype='';
    }
    document.forms['DefaultFormName'].removeChild(fileTypeInput);
  }

  //gteella- 8626934 -- incase of add another button clicked it submiots the request and after 2 seconds it clears the data on popup for adding another.
  //if it is save action only then it invokes the hideinit function.
  if(isAddAnother == "AddAnother") 
  {
    Aaction = "AddAnother";
    if (  attType == AMfile ) 
    { 
      ArefreshAddArea = true;
      if(AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT' )
        cancel_HideInit();
      else
        cancel_Add_HideInit();
      AfileOptionSelected = 'Y';
    }
    else
    {
      setTimeout("document.getElementById(\"FileInput\").value=\"\";",2000);
      setTimeout("document.getElementById(\"attachTitle\").value=\"\";",2000);
      setTimeout("document.getElementById(\"shorttextt\").value=\"\";",2000);
      setTimeout("document.getElementById(\"UrlInput\").value=\"\";",2000);   
    }
  } 
  else 
  {
      Aaction = "Add";
  }
}

function stateChanged()
{

if (AxmlHttp.readyState==4 || AxmlHttp.readyState=="complete")
 {
xmlDoc = AloadXmlContentString(AxmlHttp.responseText);
var failure = AvalidateResponse(xmlDoc);
if (failure == 'true') {
  open_first = false;
  return;
}
var isInsertAllowed = splitInfo1[5];
var isDeleteAllowed = true;
var isUpdateAllowed = true;
var isAutoCommit = splitInfo1[8];
AT_autoCommit = isAutoCommit;
AT_itemStyle = splitInfo1[9];

var x1 = xmlDoc.getElementsByTagName('response');
if(AisMsgsSet == 'N') {
    var i18n = xmlDoc.getElementsByTagName('response')[0].getElementsByTagName('i18n');
    if(i18n != null && i18n.length > 0) {
        var lookupVORow = i18n[0].childNodes[0].childNodes[0].childNodes;
        setAllMsgs(lookupVORow);
        AisMsgsSet = 'Y';
    }
    if(isBiDi())
        AreadingStyle = 2;
}
var align = 'left';
if(AreadingStyle == 2)
{
  config. TitleAlign		= 'right';
  config1. TitleAlign		= 'right';
  align = 'right';
}

x = x1[0].getElementsByTagName(uniqueKey+'FndAttachedDocumentsDomExtensionVO');
z =  x[0].getElementsByTagName('ShortText');
urlXml = x[0].getElementsByTagName('UrlLink');

var updateAllowedArray = x[0].getElementsByTagName('UpdateAllowed');
var deleteAllowedArray = x[0].getElementsByTagName('DeleteAllowed');

var totalAtt = -1; 
var textCount = -1;
var urlCount = -1;
//if( (z != null  && z.length > 0)  || ( urlXml != null  && urlXml.length > 0)){
if ( x != null ) {
x = x[0].getElementsByTagName('FndAttachedDocumentsDomExtensionVORow');
if(x.length == 0 && 'MESSAGE_INLINE_ATTACHMENT' != AT_itemStyle)
{
  open_first = false;
  return;
}

if( AstartIndex == 0 )
  AisPrevEnabled = false;
else
  AisPrevEnabled = true;
if ( x.length > 5 )
{
  AisNextEnabled = true; 
}
else
  AisNextEnabled = false; 

var prevNextArea = "<tr>" +
"   <td>" +
"       <table  class=x1j border=0 cellpadding=0 cellspacing=0 width=100% >" + 
"           <tbody>" + 
"               <tr>" +
"                   <td width=100%></td>"+
"                   <td align=right valign=middle>" +
"                       <table border=0 cellpadding=0 cellspacing=0>" +
"                           <tbody>" +
"                               <tr>";
// 1 - left to right reading
if(AreadingStyle == 1) {
  if ( AisPrevEnabled )
  {
    prevNextArea = prevNextArea + 
  "                                   <td valign=middle><a onclick=\"viewPreviousAttachments()\" href=\"javascript:Adummy()\"><img src=\"/OA_HTML/cabo/images/tnavp.gif\" title=\""+AMenabledPrevTooltip+"\" alt=\""+AMenabledPrevTooltip+"\" border=\"0\"></a></td>"+
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>" +
  "                                   <td valign=\"middle\" nowrap=\"nowrap\"><a  onclick=\"viewPreviousAttachments()\" href=\"javascript:Adummy()\" class=\"x41\">"+AMprev5+"</a></td><td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" width=\"5\" height=\"1\"></td>";
  }
  else
  {
    prevNextArea = prevNextArea + 
  "                                   <td valign=middle><img src=/OA_HTML/cabo/images/tnavpd.gif title='"+AMdisabledPrevTooltip+"' alt='"+AMdisabledPrevTooltip+"' border=0></td>"+
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>" +
  "                                   <td valign=\"middle\" nowrap=\"nowrap\"><span class=\"x42\">"+AMprev+"</span></td><td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" width=\"5\" height=\"1\"></td>"; 
  }
  
  prevNextArea = prevNextArea + 
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>";
  
  if ( AisNextEnabled )
  {
    prevNextArea = prevNextArea + 
  "                                   <td valign=\"middle\" nowrap=\"nowrap\"><a  onclick=\"viewNextAttachments()\" href=\"javascript:Adummy()\" class=\"x41\">"+AMnext5+"</a></td>" +
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>" +
  "                                   <td valign=\"middle\"><a  href=\"javascript:Adummy()\" onclick=\"viewNextAttachments()\"><img src=\"/OA_HTML/cabo/images/tnavn.gif\" title=\""+AMenabledNextTooltip+"\" alt=\""+AMenabledNextTooltip+"\" border=\"0\"></a></td>";
  }
  else
  {
    prevNextArea = prevNextArea + 
  "                                   <td valign=\"middle\" nowrap=\"nowrap\"><span class=\"x42\">"+AMnext+"</span></td>" +
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>" +
  "                                   <td valign=\"middle\"><a ><img src=\"/OA_HTML/cabo/images/tnavnd.gif\"  title=\""+AMdisabledNextTooltip+"\" alt=\""+AMdisabledNextTooltip+"\"  border=\"0\"></a></td>";
  }
}
else { // 2 - right to left reading
  if ( AisPrevEnabled )
  {
    prevNextArea = prevNextArea + 
  "                                   <td valign=middle><a onclick=\"viewPreviousAttachments()\" href=\"javascript:Adummy()\"><img src=\"/OA_HTML/cabo/images/tnavn.gif\" title=\""+AMenabledPrevTooltip+"\" alt=\""+AMenabledPrevTooltip+"\" border=\"0\"></a></td>"+
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>" +
  "                                   <td valign=\"middle\" nowrap=\"nowrap\"><a  onclick=\"viewPreviousAttachments()\" href=\"javascript:Adummy()\" class=\"x41\">"+AMprev5+"</a></td><td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" width=\"5\" height=\"1\"></td>";
  }
  else
  {
    prevNextArea = prevNextArea + 
  "                                   <td valign=middle><img src=/OA_HTML/cabo/images/tnavnd.gif title='"+AMdisabledPrevTooltip+"' alt='"+AMdisabledPrevTooltip+"' border=0></td>"+
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>" +
  "                                   <td valign=\"middle\" nowrap=\"nowrap\"><span class=\"x42\">"+AMprev+"</span></td><td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" width=\"5\" height=\"1\"></td>"; 
  }
  
  prevNextArea = prevNextArea + 
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>";
  
  if ( AisNextEnabled )
  {
    prevNextArea = prevNextArea + 
  "                                   <td valign=\"middle\" nowrap=\"nowrap\"><a  onclick=\"viewNextAttachments()\" href=\"javascript:Adummy()\" class=\"x41\">"+AMnext5+"</a></td>" +
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>" +
  "                                   <td valign=\"middle\"><a  href=\"javascript:Adummy()\" onclick=\"viewNextAttachments()\"><img src=\"/OA_HTML/cabo/images/tnavp.gif\" title=\""+AMenabledNextTooltip+"\" alt=\""+AMenabledNextTooltip+"\" border=\"0\"></a></td>";
  }
  else
  {
    prevNextArea = prevNextArea + 
  "                                   <td valign=\"middle\" nowrap=\"nowrap\"><span class=\"x42\">"+AMnext+"</span></td>" +
  "                                   <td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" alt=\"\" width=\"5\" height=\"1\"></td>" +
  "                                   <td valign=\"middle\"><a ><img src=\"/OA_HTML/cabo/images/tnavpd.gif\"  title=\""+AMdisabledNextTooltip+"\" alt=\""+AMdisabledNextTooltip+"\"  border=\"0\"></a></td>";
  }

}
prevNextArea = prevNextArea + 
"                               </tr>" +
"                           </tbody>" +
"                       </table>" +
"                   </td>" +
"               </tr>" +
"           </tbody>" +
"     </table>" +
"   </td>" +
"</tr>";

var cnfMsgDiv = getConfirmationMsgDiv();

var filelist = cnfMsgDiv +"<table  border=1  class=\"x1h\" cellpadding=0 cellspacing=0  width=\"100%\">" + prevNextArea;
//gteella - 8623859
filelist=filelist+"<table border=\"1\" class=\"x1h\">"
//gteella -- 8656392
filelist=filelist+
   '<tr>' + 
   '<td  class=\"x1r x4m\"><span class=\"x24\">' + 
       AMtitle + '</span></td>' + 
   '<td class=\"x1r x4m\"><span class=\"x24\">' + 
       AMtype + '</span></td>' + 
   '<td VALIGN = Top Align = Left width=150 colspan=15 class=\"x1r x4m\"><span class=\"x24\">' + 
       AMdetails + '</span></td>' + 
   '<td class=\"x1t x4m\"><span class=\"x24\">' + 
       AMupdateCol + '</span></td>' + 
   '<td class=\"x1t x4m\"><span class=\"x24\">' + 
       AMdeleteCol + '</span></td>' + 
   '</tr>';
voArray = x;
for(var i=0;i<x.length;i++)
{
 var y=x[i];
 
//if ( y.getElementsByTagName('DatatypeName')[0].childNodes[0].nodeValue == 'Short Text' || y.getElementsByTagName('DatatypeName')[0].childNodes[0].nodeValue == 'Web Page')
if ( y != null )
{
numOfAttachments++;
//gteella
filelist=filelist;
//filelist=filelist+"<tr><td  class=x4 VALIGN = Top Align = middle>";
var categoryIdForUpdate =  y.getElementsByTagName('AttachmentCategoryId')[0].childNodes[0].nodeValue;
var documentId = y.getElementsByTagName('DocumentId')[0].childNodes[0].nodeValue;
var attachedDocumentId = y.getElementsByTagName('AttachedDocumentId')[0].childNodes[0].nodeValue;
var usageType = 'O';
var usageTypeElement = y.getElementsByTagName('UsageType');
if ( usageTypeElement != null && usageTypeElement.length > 0 && usageTypeElement[0].childNodes.length > 0 )
  usageType = usageTypeElement[0].childNodes[0].nodeValue;
  
var entityName = y.getElementsByTagName('EntityName')[0].childNodes[0].nodeValue;
var datatypeName = y.getElementsByTagName('DatatypeName')[0].childNodes[0].nodeValue;
var datatypeId = y.getElementsByTagName('DatatypeId')[0].childNodes[0].nodeValue;
var jradmode = 'Y';
var operation = 'DELETE';

var updateColumn = "";
var deleteColumn = "";
var attTypeColumn = "";
var ttt1=y.getElementsByTagName('Title');
var title
var shorttext

isUpdateAllowed = updateAllowedArray[i].childNodes[0].nodeValue;
isDeleteAllowed = deleteAllowedArray[i].childNodes[0].nodeValue;
if ( y.getElementsByTagName('DatatypeId')[0].childNodes[0].nodeValue == '1')
{
  var mediaId = y.getElementsByTagName('MediaId')[0].childNodes[0].nodeValue; 
  textCount++;
  if(isUpdateAllowed == 'true' && usageType == 'O') {
       updateColumn = '<a href=javascript:Adummy() onclick=javascript:displayEditWindow(this,\"Text\",\"'+attachedDocumentId+'\",\"'+
       categoryIdForUpdate+'\",\"'+i+'\",\"'+textCount+'\")><img src="/OA_MEDIA/updateicon_enabled.gif" title="'+AMupdateiconTooltip+'" border="0" align="middle"/></a>'
  } else {
        updateColumn = '<img src="/OA_MEDIA/updateicon_disabled.gif" title="'+AMdisabledUpdateTooltip+'" border="0" align="middle"/>'
  }
  if(isDeleteAllowed == 'true') {
      deleteColumn = '<a href=javascript:deleteAttachment(\"'+documentId+'\",\"'+attachedDocumentId+'\",\"'+
      mediaId+'\",\"'+entityName+'\",\"'+datatypeId+'\",\"'+jradmode+'\",\"'+operation+'\")><img src="/OA_MEDIA/deleteicon_enabled.gif" title="'+AMdeleteTooltip+'" border="0" align="middle"/></a>'
  } else {
      deleteColumn = '<img src="/OA_MEDIA/deleteicon_disabled.gif" title="'+AMdisabledDeleteTooltip+'"  border="0" align="middle"/>'
  }
      

  shorttext=z[textCount].childNodes[0].nodeValue
  
  var shorttextpart2,shorttextpart1=shorttext;
  
  if(shorttext.length > 50) {
    shorttext=shorttext.substring(0,43)+"...<a class=OraLinkText href=\"javascript:Adummy()\" onclick=\"showAttachmentContent(this,"+i+","+textCount+")\">"+AMmore+"</a>";
  }

  if(ttt1.length==0 || ttt1[0].childNodes.length==0)
      title=AMundefined;
  else 
  {
    title=y.getElementsByTagName('Title')[0].childNodes[0].nodeValue
    var wordArray = title.split(' ');
    title= "";
    // Bug 8579476
    for( var l=0; l<wordArray.length; l++)
    {
      var word = wordArray[l];
      var wordLeft = wordArray[l];
      while ( wordLeft.length > 13)
      {
        word = wordLeft.substring(0,13) + ' ';
        title = title + word;
        wordLeft =  wordLeft.substring(13);
      }
      title = title + wordLeft + ' ';              
    }
  }

  attTypeColumn = '<td  class=x4  VALIGN = Top Align = Left>'+datatypeName+'</td>'
}
else if (y.getElementsByTagName('DatatypeId')[0].childNodes[0].nodeValue == '5')
{
  urlCount++;
  var urlStr = urlXml[urlCount].childNodes[0].nodeValue;
  var urlDisp = urlStr;
  if(isUpdateAllowed == 'true' && usageType == 'O')  {
       updateColumn = '<a href=javascript:Adummy() onclick=javascript:displayEditWindow(this,\"Url\",\"'+attachedDocumentId+'\",\"'+
       categoryIdForUpdate+'\",\"'+i+'\",\"'+urlCount+'\")><img src="/OA_MEDIA/updateicon_enabled.gif" title="'+AMupdateiconTooltip+'" border="0" align="middle"/></a>'
  } else {
        updateColumn = '<img src="/OA_MEDIA/updateicon_disabled.gif" title="'+AMdisabledUpdateTooltip+'" border="0" align="middle"/>'
  }

  if(isDeleteAllowed == 'true')  {
      deleteColumn = '<a href=javascript:deleteAttachment(\"'+documentId+'\",\"'+attachedDocumentId+'\",\"'+
      mediaId+'\",\"'+entityName+'\",\"'+datatypeId+'\",\"'+jradmode+'\",\"'+operation+'\")><img src="/OA_MEDIA/deleteicon_enabled.gif" title="'+AMdeleteTooltip+'" border="0" align="middle"/></a>'
  } else {
      deleteColumn = '<img src="/OA_MEDIA/deleteicon_disabled.gif" title="'+AMdisabledDeleteTooltip+'" border="0" align="middle"/>'
  }
  
  if( urlStr.length > 40 )
    urlDisp = urlStr.substring(0,37) + '...';
  shorttext="<a class=OraLinkText href="+urlStr+" target=_blank>"+urlDisp+"</a>";

  if(ttt1.length==0 || ttt1[0].childNodes.length==0)
      title=AMundefined;
  else 
  {
    title=y.getElementsByTagName('Title')[0].childNodes[0].nodeValue
    var wordArray = title.split(' ');
    title= "";
    for( var l=0; l<wordArray.length; l++)
    {
      var word = wordArray[l];
      var wordLeft = wordArray[l];
      while ( wordLeft.length > 13)
      {
        word = wordLeft.substring(0,13) + ' ';
        title = title + word;
        wordLeft =  wordLeft.substring(13);
      }
      title = title + wordLeft + ' ';              
    }
  }

attTypeColumn = '<td  class=x4  VALIGN = Top Align = Left>'+datatypeName+'</td>'
}
else if (y.getElementsByTagName('DatatypeId')[0].childNodes[0].nodeValue == '6')
{
  var mediaId = y.getElementsByTagName('MediaId')[0].childNodes[0].nodeValue;

  if(isUpdateAllowed == 'true' && usageType == 'O') {
       updateColumn = '<a href=javascript:Adummy() onclick=javascript:displayEditWindow(this,\"File\",\"'+attachedDocumentId+'\",\"'+
       categoryIdForUpdate+'\",\"'+i+'\",\"0\")><img src="/OA_MEDIA/updateicon_enabled.gif" title="'+AMupdateiconTooltip+'" border="0" align="middle"/></a>'
  } else {
        updateColumn = '<img src="/OA_MEDIA/updateicon_disabled.gif" title="'+AMdisabledUpdateTooltip+'" border="0" align="middle"/>'
  }

  if(isDeleteAllowed == 'true') {
      deleteColumn = '<a href=javascript:deleteAttachment(\"'+documentId+'\",\"'+attachedDocumentId+'\",\"'+
      mediaId+'\",\"'+entityName+'\",\"'+datatypeId+'\",\"'+jradmode+'\",\"'+operation+'\")><img src="/OA_MEDIA/deleteicon_enabled.gif" title="'+AMdeleteTooltip+'"  border="0" align="middle"/></a>'
  } else {
      deleteColumn = '<img src="/OA_MEDIA/deleteicon_disabled.gif" title="'+AMdisabledDeleteTooltip+'" border="0" align="middle"/>'
  }

  var fileName = y.getElementsByTagName('FileName')[0].childNodes[0].nodeValue
  shorttext="<a class=OraLinkText href=javascript:Adummy() onclick=\"viewFileContent("+mediaId+")\" >"+fileName+"</a>";

  if(ttt1.length==0 || ttt1[0].childNodes.length==0) {
      //8943568
      title=y.getElementsByTagName('FileName')[0].childNodes[0].nodeValue;
      if(title.length > 13) {
        title = title.substring(0,11)+'..';
      }
  } else 
  {
    title=y.getElementsByTagName('Title')[0].childNodes[0].nodeValue
    var wordArray = title.split(' ');
    title= "";
    for( var l=0; l<wordArray.length; l++)
    {
      var word = wordArray[l];
      var wordLeft = wordArray[l];
      while ( wordLeft.length > 13)
      {
        word = wordLeft.substring(0,13) + ' ';
        title = title + word;
        wordLeft =  wordLeft.substring(13);
      }
      title = title + wordLeft + ' ';              
    }
  }
 
 attTypeColumn = '<td  class=x4  VALIGN = Top Align = Left>'+datatypeName+'</td>' 
}
filelist = filelist;
//gteella - 8623859
filelist=filelist+"<tr bgcolor=\"#f2f2f5\">"+"<td   style=\"max-width:100px\" class=x4 VALIGN = Top Align="+align+"><table><tr><td  class=x4  Align="+align+">"+title+"</td></tr></table></td><td  VALIGN = Top Align="+align+"><table><tr>"+attTypeColumn+"</tr></table></td><td  VALIGN = Top Align="+align+" width=150 colspan=15  class=x4><table><tr><td  class=x4  Align="+align+">"+shorttext+"</td></tr></table></td>"+"<td class=\"x1p x50\">"+updateColumn+"</td><td  class=\"x1p x50\">"+deleteColumn+"</td></tr>";
}

// To display only five rows
if ( i == 4 )
  break;
}
filelist = filelist + "</table>" + prevNextArea;

filelist=filelist+"</table>";//class=\"x1n x50\"
////gteella
if( AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT' )
{
  var addAttLink = '<a class=OraLinkText style=cursor:pointer onclick=\'javascript:addText(this , \"'+baseAM+'\")\' ><U>'+AMaddWTitle+'</U></a>';

  filelist = filelist+'<table cellspacing=0 width=100% id=table2 >' +
      '			<tr>' + 
      '				<td >'+addAttLink+'</td>' + 
      '				 <td>&nbsp;</td>' +
      '			</tr>' +
      '		</table>' ;
}
  Tip(filelist,TITLE, AMviewWTitle,
  STICKY, 1, CLOSEBTN, true)
}

}

}

function viewPreviousAttachments()
{
  if(open_second == true)
    return;
  refreshListOfFiles = true;
  tt_HideInit()
  AstartIndex = AstartIndex - 5;
  if ( AstartIndex > 0 )
    AisPrevEnabled = true;
  else 
    AisPrevEnabled = false;
  showUser(information,baseAM,whereClauseParam);
}

function viewNextAttachments()
{
  if(open_second == true)
    return;
  refreshListOfFiles = true;
  tt_HideInit()
  AstartIndex = AstartIndex + 5;
  if ( AstartIndex > 0 )
    AisPrevEnabled = true;
  showUser(information,baseAM,whereClauseParam);
}

function setAllMsgs(lookupVORows)
{
    if(lookupVORows != null && lookupVORows.length > 0) {
        for(var i=0;i<lookupVORows.length;i++)
        {   
            var lookupCode = lookupVORows[i].getElementsByTagName('LookupCode')[0].childNodes[0].nodeValue;
            
            switch(lookupCode){
                            
                case "ATT_ADDANOTHER_BTN_PROMPT" : AMaddAnBtn = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_ADD_WINDOW_TITLE" : AMaddWTitle = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                     
                case "ATT_ALERT_EMPTY_FILEFIELD" : AMalertEmptyFileField = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_ALERT_EMPTY_TEXT" : AMalertEmptyText  = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_ALERT_EMPTY_URL" : AMalertEmptyUrl = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_ALERT_XMLHTTP_UNSUPPORTED" : AMxmlHttpUnsupported = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_ATTACHMENT_TYPE_FILE" : AMfile = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_ATTACHMENT_TYPE_PROMPT" : AMattType = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_ATTACHMENT_TYPE_TEXT" : AMtext = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_ATTACHMENT_TYPE_URL" : AMurl = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_CANCEL_BTN_PROMPT" : AMcancelBtn = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_CATEGORY_PROMPT" : AMcategory = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;

                case "ATT_CLOSE_CONFIRM" : AMcloseWindowConfirmation = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;

                case "ATT_DELETE_CONFIRM" : AMdeleteConfirmation = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_DELETEICON_TITLE" : AMdeleteTooltip = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_DELETE_COLUMN_PROMPT" : AMdeleteCol = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_DETAILS_COLUMN_PROMPT" : AMdetails = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;

                case "ATT_DISABLED_DELETE_TITLE" : AMdisabledDeleteTooltip = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_DISABLED_NEXTICON_TITLE" : AMdisabledNextTooltip = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_DISABLED_PREVICON_TITLE" : AMdisabledPrevTooltip = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_DISABLED_UPDATEICON_TITLE" : AMdisabledUpdateTooltip = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;

                case "ATT_ENABLED_NEXTICON_TITLE" : AMenabledNextTooltip = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_ENABLED_PREVICON_TITLE" : AMenabledPrevTooltip = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_MORE_LINK_PROMPT" : AMmore = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_NEXT_5_PROMPT" : AMnext5 = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_NEXT_LINK_PROMPT" : AMnext = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_PREV_5_PROMPT" : AMprev5 = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_PREV_LINK_PROMPT" : AMprev = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_SAVE_BTN_PROMPT" : AMsaveBtn = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_TITLE_PROMPT" : AMtitle = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_TITLE_UNDEFINED" : AMundefined = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_TYPE_COLUMN_PROMPT" : AMtype = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_UPDATEICON_TITLE" : AMupdateiconTooltip = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_UPDATE_BTN_PROMPT" : AMupdateBtn = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_UPDATE_COLUMN_PROMPT" : AMupdateCol = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_UPDATE_WINDOW_TITLE" : AMupdateWTitle = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
                case "ATT_VIEW_WINDOW_TITLE" : AMviewWTitle = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;

                case "ATT_CONFIRM_TEXT" : AMconfirmText = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;

                case "ATT_CLOSE_TEXT" : AMcloseButtonText = lookupVORows[i].getElementsByTagName('Meaning')[0].childNodes[0].nodeValue;
                                                   break;
                                                   
            }
        }
    }  
}

function viewFileContent (mediaId)
{
  _submitPartialChange('DefaultFormName',0,{event:'ViewFileContent', entityInfo:information, mediaId:mediaId, attachmentStyle:AT_itemStyle});
}

function attachmentTableOperation( obj, info, amName, attType, urlString, operation )
{
  
  var a1=function()
  { 
    if(open_first == true) return;
    
    object = obj;
    Aoperation = operation;
    information = info;
    rest_url = urlString;
    if("1" == attType)
      attType = 'Text';
    else if("5" == attType)
      attType = 'Url';
    else if("6" == attType)
      attType = 'File';
    baseAM = amName;    
    var splitInfo = info.split('::');
    
    tableId = splitInfo[0];
    uniqueKey = splitInfo[1];
    var attachedDocumentId = splitInfo[3];
    AT_itemStyle = splitInfo[4]; 
    userId = splitInfo[5]; 
    userName = splitInfo[6]; 
    AT_autoCommit = splitInfo[7]; 
    
    var documentId = splitInfo[8];
    var mediaId = splitInfo[9];
    var  categoryId = splitInfo[10];
    var entityName = splitInfo[11];
    var jradmode = 'Y';
    if('UPDATE' == operation) 
    {
      if(open_second == true)
        return;
      displayEditWindow( obj, attType, attachedDocumentId, categoryId, 0, 0 );
    }
    else if ('DELETE' == operation && AisMsgsSet == 'Y')
    {
      if(open_second == true)
        return;
      deleteAttachment(documentId, attachedDocumentId, mediaId,entityName, attType, jradmode, operation);
    }
    else if ('DELETE' == operation && AisMsgsSet == 'N')
    {
      if(open_second == true)
        return;
      AxmlHttp=GetXmlHttpObject()
      if (AxmlHttp==null)
      {
        alert (AMxmlHttpUnsupported);
        return;
      }
      var body= "<params> <param>"+amName+"</param><param>getLookupMsgs</param><param>"+AisMsgsSet+"</param></params>";
      
      AxmlHttp.onreadystatechange=setLookupValues
      AxmlHttp.open("POST",rest_url,true);
      AxmlHttp.setRequestHeader("OAFunc","FND_DIALOG_PAGE");
      AxmlHttp.setRequestHeader("Content-type", "application/xml");
      AxmlHttp.send(body)      
    }  
    else if ('VIEWTEXT' == operation)    
    {
      AxmlHttp=GetXmlHttpObject()
      if (AxmlHttp==null)
      {
        alert (AMxmlHttpUnsupported);
        return;
      }
      var body= "<params> <param>"+baseAM+"</param><param>getCategoryNames</param><param>"+information+"</param><param>EDIT</param><param>"+AisMsgsSet+"</param></params>";
      
      AxmlHttp.onreadystatechange=setLookupValues
      AxmlHttp.open("POST",rest_url,true);
      AxmlHttp.setRequestHeader("OAFunc","FND_DIALOG_PAGE");
      AxmlHttp.setRequestHeader("Content-type", "application/xml");
      AxmlHttp.send(body)      
    }
  }
  Atmr=setTimeout(a1,1000);
}

function setLookupValues()
{
 if (AxmlHttp.readyState==4 || AxmlHttp.readyState=="complete")
 {
  xmlDoc = AloadXmlContentString(AxmlHttp.responseText);
  
      if(AisMsgsSet == 'N') {
      var i18n = xmlDoc.getElementsByTagName('response')[0].getElementsByTagName('i18n');
      if(i18n != null && i18n.length > 0) 
      {
          var lookupVORow = i18n[0].childNodes[0].childNodes[0].childNodes;
          setAllMsgs(lookupVORow);
          AisMsgsSet = 'Y';
      }
    }
    
    var splitInfo = information.split('::');
    tableId = splitInfo[0];
    uniqueKey = splitInfo[1];
    var attachedDocumentId = splitInfo[3];
    AT_itemStyle = splitInfo[4]; 
    userId = splitInfo[5]; 
    userName = splitInfo[6]; 
    AT_autoCommit = splitInfo[7]; 
    
    var documentId = splitInfo[8];
    var mediaId = splitInfo[9];
    var categoryId = splitInfo[10];
    var entityName = splitInfo[11];
    var jradmode = 'Y';
    
   if(Aoperation == 'VIEWTEXT') 
   {  
      var fndCatNameVOXml =  xmlDoc.getElementsByTagName('response')[0].childNodes;
      z = fndCatNameVOXml[0].getElementsByTagName('ShortText');
      x = fndCatNameVOXml;
      urlXml = fndCatNameVOXml[0].getElementsByTagName('UrlLink');
      showAttachmentContent(object,0,0);
   }
   else if (Aoperation == 'DELETE')
    deleteAttachment(documentId, attachedDocumentId, mediaId,entityName, att_attType, jradmode, 'DELETE');
}
}

function displayEditWindow( obj, attType, attachedDocumentId, categoryId, i, j )
{
    if (open_second == true) return;
    
    ddx = parseInt(AfindPosX(obj))
    ddy = parseInt(AfindPosY(obj))
    att_attType = attType;
    att_attachedDocumentId = attachedDocumentId;
    att_categoryId = categoryId;
    att_i = i;
    att_j = j;
    //gteella -- 8648409
    AttUpdAction="update";
    AxmlHttp=GetXmlHttpObject()
    if (AxmlHttp==null)
     {
     alert (AMxmlHttpUnsupported);
     return;
     }
    var body= "<params> <param>"+baseAM+"</param><param>getCategoryNames</param><param>"+information+"</param><param>EDIT</param><param>"+AisMsgsSet+"</param></params>";
    AxmlHttp.onreadystatechange = updateWindow;
    AxmlHttp.open("POST",rest_url,true);
    AxmlHttp.setRequestHeader("Content-type", "application/xml");
    AxmlHttp.send(body)
    
}


function updateWindow( )
{

    var attachedDocumentId = att_attachedDocumentId;
    var categoryId = att_categoryId;
    var i = att_i;
    var j  = att_j;

    if (AxmlHttp.readyState==4 || AxmlHttp.readyState=="complete")
    {
       xmlDoc = AloadXmlContentString(AxmlHttp.responseText);
       var failure = AvalidateResponse(xmlDoc);
       if (failure == 'true') {
          open_second = false;	
          return;
    }
    
    var fndCatNameVOXml =  xmlDoc.getElementsByTagName('response')[0].childNodes;
    //var fndCatNameVOXml = xmlDoc.getElementsByTagName(uniqueKey+'FndCategoryNameVO');

    var fndCatNameVOXml =  xmlDoc.getElementsByTagName('response')[0].childNodes;
     
    if(AisMsgsSet == 'N') 
    {
      var i18n = xmlDoc.getElementsByTagName('response')[0].getElementsByTagName('i18n');
      if(i18n != null && i18n.length > 0) 
      {
          var lookupVORow = i18n[0].childNodes[0].childNodes[0].childNodes;
          setAllMsgs(lookupVORow);
          AisMsgsSet = 'Y';
      }
      if(isBiDi())
        AreadingStyle = 2;
    }

    if( fndCatNameVOXml != null)
        categoryMapXML = fndCatNameVOXml[0].getElementsByTagName('FndCategoryNameVORow');
    if(AT_itemStyle == 'ATTACHMENT_TABLE') 
    {  
      
        z = fndCatNameVOXml[0].getElementsByTagName('ShortText');
        x = fndCatNameVOXml;
        urlXml = fndCatNameVOXml[0].getElementsByTagName('UrlLink');
    }
    
var popList="";
var numOfCategories=categoryMapXML.length;
if(categoryMapXML != null && categoryMapXML.length > 1){
  popList=popList+"<select id=categoryList>";
var updateCategoryFound = false;  
  for(var k=0;k<numOfCategories;k++)
  {
  var index= 8 + 2*k;
 
  if (categoryId == categoryMapXML[k].childNodes[1].childNodes[0].nodeValue) {
     popList=popList+"<option value="+categoryMapXML[k].childNodes[1].childNodes[0].nodeValue+" selected>"+categoryMapXML[k].childNodes[0].childNodes[0].nodeValue+"</option>";
     updateCategoryFound = true;
  }
  else
     popList=popList+"<option value="+categoryMapXML[k].childNodes[1].childNodes[0].nodeValue+">"+categoryMapXML[k].childNodes[0].childNodes[0].nodeValue+"</option>";
  }
  popList=popList+"</select>";
  multiCategory = true;
}
else if ( categoryMapXML != null && categoryMapXML.length == 1 ){
  if (categoryId == categoryMapXML[0].childNodes[1].childNodes[0].nodeValue) {
    updateCategoryFound = true;
    popList = popList + "<input type=text style=border:0px;background-color:#f2f2f5 id=categoryList value=\""+categoryMapXML[0].childNodes[0].childNodes[0].nodeValue+"\" readonly=readonly />";
    categoryId = categoryMapXML[0].childNodes[1].childNodes[0].nodeValue;
    categoryName = categoryMapXML[0].childNodes[0].childNodes[0].nodeValue;
  }
}  
else
  popList=popList + "<input type=text style=border:0px;font:bold;background-color:#f2f2f5 id=categoryList value=Miscellaneous readonly=readonly />";

if (updateCategoryFound == false) { 
  open_second = false;
  return;
}

  if ( att_attType == 'Text' )
  {
    var titleText=""
    var shortText = z[j].childNodes[0].nodeValue
    //gteella -- 8648409
    AttUpdTxt = shortText;
    var titleArr = x[i].getElementsByTagName('Title');
   
    if(titleArr.length != 0 && titleArr[0].childNodes.length != 0)
       titleText = titleArr[0].childNodes[0].nodeValue;
    
    var align = '';
    if(AreadingStyle == '1')
      align = 'right';
    else 
      align = 'left';
   //gteella -- 8635661
   //8667267 - made cell padding to zero so there will be no spacing between cells
    var textInfoMOZ= '		<table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" border = "0" id=\"table1\">' +
    '			<tr>' + 
    '				<td height=\"18\" width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMtitle+'</td>' +
    '				<td height=\"18\">&nbsp;</td>' + 
    '				<td VALIGN = Top height=\"18\"><input type=\"text\" size=\"33\" maxlength=\"80\" class=x4 id=\"attachTitle\" value=\"'+ titleText+'\" > </td>' +
    '                           <td height="18" width="10">&nbsp;</td>'+
    '			</tr>' +
    '			<tr>' + 
    '				<td height=\"18\" width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMcategory+'</td>' +
    '				<td height=\"18\">&nbsp;</td>' + 
    '				<td VALIGN = Top height=\"18\">'+popList+'</td>' +
    '                           <td height="18" width="10">&nbsp;</td>'+
    '			</tr>' + 
    '			<tr>' + 
    '				<td width=\"70\" valign=top align='+align+' class=OraFieldText>*'+AMtext+'</td>' +
    '				<td valign=top>' + 
    '					&nbsp;</td>' + 
    '				<td valign=top>' + 
    '					<p><textarea rows=\"6\" cols=\"30\" name=\"shorttextt\" id=\"shorttextt\" class=x4   onkeypress=\"return _checkLength(this,4000,event)\" onchange=\"return _checkLength(this,4000,event)\" >'+shortText+'</textarea>' +
    '                                        </p>' + 
    '				</td>' + 
    '                           <td height="18" width="10">&nbsp;</td>'+
    '			</tr>' +
    '                   <tr>' +
    '			</tr>' +
    '		</table>' + 
    '           <table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" id=\"table4\" border=\"0\" class=\"x1n x50\">' +
    '			<tr>' + 
    '				<td width=\"70\">&nbsp;</td>' + 
    '				<td><input type=\"submit\" value=\"'+AMupdateBtn+'\" class=\"x7g\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\" onclick=updateAttachment("'+att_attType+'","'+attachedDocumentId+'","'+categoryId+'") /></td>' +
    '				<td><input type=\"reset\" value=\"'+AMcancelBtn+'\" id=\"Att_Cancel\" class=\"x7g\" onclick=\"cancel_HideInit()\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\"  /></td>' +
    '                           <td>&nbsp;</td>' +
    '			</tr>' +
    '		</table>' ;
    
    var textInfoIE= '		<table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" border = "0" id=\"table1\">' +
    '			<tr>' + 
    '				<td height=\"20\" width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMtitle+'</td>' +
    '				<td height=\"20\">&nbsp;</td>' + 
    '				<td VALIGN = Top height=\"20\"><input type=\"text\" size=\"29\" maxlength=\"80\"  class=x4 id=\"attachTitle\" value=\"'+ titleText+'\" > </td>' +
    '                           <td height="20" width="10">&nbsp;</td>'+
    '			</tr>' +
    '			<tr>' + 
    '				<td height=\"20\" width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMcategory+'</td>' +
    '				<td height=\"20\">&nbsp;</td>' + 
    '				<td VALIGN = Top height=\"20\">'+popList+'</td>' +
    '                           <td height="20" width="10">&nbsp;</td>'+
    '			</tr>' + 
    '			<tr>' + 
    '				<td width=\"70\" valign=top align='+align+' class=OraFieldText>*'+AMtext+'</td>' +
    '				<td valign=top>' + 
    '					&nbsp;</td>' + 
    '				<td valign=top>' + 
    '					<p><textarea rows=\"6\" cols=\"30\" name=\"shorttextt\" id=\"shorttextt\" class=x4   onkeypress=\"return _checkLength(this,4000,event)\" onchange=\"return _checkLength(this,4000,event)\" >'+shortText+'</textarea>' +
    '                                        </p>' + 
    '				</td>' + 
    '                           <td height="20" width="10">&nbsp;</td>'+
    '			</tr>' +
    '                   <tr>' +
    '			</tr>' +
    '		</table>' + 
    '           <table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" id=\"table4\" border=\"0\" class=\"x1n x50\">' +
    '			<tr>' + 
    '				<td width=\"70\">&nbsp;</td>' + 
    '				<td><input type=\"submit\" value=\"'+AMupdateBtn+'\" class=\"x7g\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\" onclick=updateAttachment("'+att_attType+'","'+attachedDocumentId+'","'+categoryId+'") /></td>' +
    '				<td><input type=\"reset\" value=\"'+AMcancelBtn+'\" id=\"Att_Cancel\" class=\"x7g\" onclick=\"cancel_HideInit()\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\"  /></td>' +
    '                           <td>&nbsp;</td>' +
    '			</tr>' +
    '		</table>' ;  
    var textInfo;
    var browserTE = new Browser();
    if(browserTE.isIE) {
         textInfo = textInfoIE;
    } else {
         textInfo = textInfoMOZ;
    }
    open_second=true;
    ddTip( textInfo,  TITLE, AMupdateWTitle, 
    STICKY, 1, CLOSEBTN, true )
  } // end of if ( att_attType == AMtext)
  
  else if ( att_attType == 'Url' )
  {
    var titleText=""
    var urlStr = urlXml[j].childNodes[0].nodeValue;
    AttUpdUrl = urlStr;
    var titleArr=x[i].getElementsByTagName('Title');
   
    if( titleArr.length != 0 && titleArr[0].childNodes.length != 0 )
       titleText=titleArr[0].childNodes[0].nodeValue;

    
    var urlInfo= '		<table cellspacing=\"1\" width=\"100%\" border = "0" id=\"table1\">' +
    '			<tr>' + 
    '				<td height=\"20\" width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMtitle+'</td>' +
    '				<td height=\"20\">&nbsp;</td>' + 
    '				<td VALIGN = Top height=\"20\"><input type=\"text\" size=\"33\" class=x4 id=\"attachTitle\" value=\"'+ titleText+'\" > </td>' +
    '                           <td height="20" width="10">&nbsp;</td>'+
    '			</tr>' +
    '			<tr>' + 
    '				<td height=\"20\" width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMcategory+'</td>' +
    '				<td height=\"20\">&nbsp;</td>' + 
    '				<td VALIGN = Top height=\"20\">'+popList+'</td>' +
    '                           <td height="20" width="10">&nbsp;</td>'+
    '			</tr>' + 
    '			<tr>' + 
    '				<td width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMurl+'</td>' +
    '				<td valign=top>' + 
    '					&nbsp;</td>' + 
    '				<td valign=top>' + 
    '					<input type=text  name=\"URLInput\" id=\"URLInput\" class=x4 size=34 maxlength=4000  value=\"'+urlStr+'\"/ >' +
    '				</td>' +
    '                           <td height="20" width="10">&nbsp;</td>'+
    '			</tr>' +
    '                   <tr>' +
    '			</tr>' +
    '		</table>' + 
    '           <table cellspacing=\"0\" width=\"100%\" id=\"table4\" border=\"0\" class=\"x1n x50\">' +
    '			<tr>' + 
    '				<td width=\"70\">&nbsp;</td>' + 
    '				<td><input type=\"submit\" value=\"'+AMupdateBtn+'\" class=\"x7g\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\" onclick=updateAttachment("'+att_attType+'","'+attachedDocumentId+'","'+categoryId+'") /></td>' +
    '				<td><input type=\"reset\" value=\"'+AMcancelBtn+'\" id=\"Att_Cancel\" class=\"x7g\" onclick=\"cancel_HideInit()\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\"  /></td>' +
    '                           <td>&nbsp;</td>' +
    '			</tr>' +
    '		</table>' ; 
    open_second=true;
    ddTip( urlInfo,  TITLE, AMupdateWTitle, 
    STICKY, 1, CLOSEBTN, true)
    
  }
  else if ( att_attType == 'File' )
  {
    var titleText=""
    var titleArr=x[i].getElementsByTagName('Title');
   
    if( titleArr.length != 0 && titleArr[0].childNodes.length != 0 )
       titleText=titleArr[0].childNodes[0].nodeValue;


    var fileInfo= '		<table cellspacing=\"1\" width=\"100%\" border = "0" id=\"table1\">' +
    '			<tr>' + 
    '				<td height=\"20\" width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMtitle+'</td>' +
    '				<td height=\"20\">&nbsp;</td>' + 
    '				<td VALIGN = Top height=\"20\"><input type=\"text\" size=\"33\" class=x4 id=\"attachTitle\" value=\"'+ titleText+'\" > </td>' +
    '                           <td height="20" width="10">&nbsp;</td>'+
    '			</tr>' +
    '			<tr>' + 
    '				<td height=\"20\" width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMcategory+'</td>' +
    '				<td height=\"20\">&nbsp;</td>' + 
    '				<td VALIGN = Top height=\"20\">'+popList+'</td>' +
    '                           <td height="20" width="10">&nbsp;</td>'+
    '			</tr>' + 
    '     <tr>' + 
    '				<td height=\"22\" width=\"70\" valign=top align='+align+' class=OraFieldText>'+AMfile+'</td>' + 
    '				<td height=\"22\">&nbsp;</td>' + 
    '				<td VALIGN = Top height=\"22\"><input type=file  name=\"FileInput\" id=\"FileInput\" size=\"20\" maxlength=4000 / ></td>' +
    '                           <td height="22" width="19">&nbsp;</td>'+
    '			</tr>' + 
    '     <tr>' +
    '			</tr>' +
    '		</table>' + 
    '           <table cellspacing=\"0\" width=\"100%\" id=\"table4\" border=\"0\" class=\"x1n x50\">' +
    '			<tr>' + 
    '				<td width=\"70\">&nbsp;</td>' + 
    '				<td><input type=\"submit\" value=\"'+AMupdateBtn+'\" class=\"x7g\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\" onclick=updateAttachment("'+att_attType+'","'+attachedDocumentId+'","'+categoryId+'") /></td>' +
    '				<td><input type=\"reset\" value=\"'+AMcancelBtn+'\" id=\"Att_Cancel\" class=\"x7g\" onclick=\"cancel_HideInit()\"  style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\"  /></td>' +
    '                           <td>&nbsp;</td>' +
    '			</tr>' +
    '		</table>' ; 
    open_second=true;
    ddTip( fileInfo,  TITLE, AMupdateWTitle, 
    STICKY, 1, CLOSEBTN, true)
    
  }
  }
}

function updateAttachment(attType, attachedDocumentId, categoryIdForUpdate)
{
  refreshListOfFiles = true;
  AxmlHttp=GetXmlHttpObject()
  if (AxmlHttp==null)
   {
   alert (AMxmlHttpUnsupported);
   return;
   }
 
  if ( attType == 'Text')
  {
     var shorttext = document.getElementById("shorttextt");
     if (shorttext.value == "")
     {
      // 8667515 -- gteella 
      alert(AMalertEmptyText);
     return
     }
    var title = document.getElementById("attachTitle");
    if( multiCategory )
    {
      categoryIdForUpdate = document.getElementById('categoryList').options[document.getElementById('categoryList').selectedIndex].value
    }

    var body= "<params> <param>"+baseAM+"</param><param>updateAttachment</param><param>"+attachedDocumentId+"</param><param>"+uniqueKey+"</param><param>"+userId+"</param><param>"+userName+"</param><param>"+categoryIdForUpdate+"</param><param>"+title.value+"</param><param>"+shorttext.value+"</param><param>"+att_attType+"</param><param>"+AT_autoCommit+"</param><param>"+information+"</param></params>";


    AxmlHttp.onreadystatechange=afterUpdate
    
    AxmlHttp.open("POST",rest_url,true);
    AxmlHttp.setRequestHeader("Content-type", "application/xml");
    AxmlHttp.send(body)
  }
  else if ( attType == 'Url')
  {
     var urlValue = document.getElementById("URLInput");
     if (urlValue.value == "")
     {
      // 8667515 - gteella
      alert(AMalertEmptyUrl);
     return
     }
    var title = document.getElementById("attachTitle");
    if( multiCategory )
    {
      categoryIdForUpdate = document.getElementById('categoryList').options[document.getElementById('categoryList').selectedIndex].value
    }
    
    var body= "<params> <param>"+baseAM+"</param><param>updateAttachment</param><param>"+attachedDocumentId+"</param><param>"+uniqueKey+"</param><param>"+userId+"</param><param>"+userName+"</param><param>"+categoryIdForUpdate+"</param><param>"+title.value+"</param><param>"+urlValue.value+"</param><param>"+att_attType+"</param><param>"+AT_autoCommit+"</param><param>"+information+"</param></params>";
    AxmlHttp.onreadystatechange=afterUpdate

    AxmlHttp.open("POST",rest_url,true);
    AxmlHttp.setRequestHeader("Content-type", "application/xml");
    AxmlHttp.send(body)
  }
  else if ( attType == 'File')
  {
    var title = document.getElementById("attachTitle");
    if( multiCategory )
    {
      categoryIdForUpdate = document.getElementById('categoryList').options[document.getElementById('categoryList').selectedIndex].value
    }
    var fileTypeInput = document.getElementById('FileInput');
    document.forms['DefaultFormName'].appendChild(fileTypeInput);
    var isEnctypeSet = false;
    if( document.forms['DefaultFormName'].enctype != 'multipart/form-data')
    {
     isEnctypeSet = true;
     document.forms['DefaultFormName'].enctype='multipart/form-data';
     document.forms['DefaultFormName'].encoding='multipart/form-data';
    }
    _submitPartialChange('DefaultFormName',0,{event:'UpdateFileAttachment',entityInfo:information,attachedDocumentId:attachedDocumentId,vuKey:uniqueKey,userId:userId,userName:userName,categoryId:categoryIdForUpdate,title:title.value,attType:'File',attachmentStyle:AT_itemStyle,partialTargets:tableId+' cnfMsg'});  
    if ( isEnctypeSet == true )
    {
      document.forms['DefaultFormName'].enctype='';
    }
    document.forms['DefaultFormName'].removeChild(fileTypeInput); 
    cancel_HideInit();
    Aaction = 'UpdateFileAttachment';
    refreshListOfFiles = true;
  }
  
}
function afterUpdate()
{
  if (AxmlHttp.readyState==4 || AxmlHttp.readyState=="complete")
  {
    cancel_HideInit();
    Aaction = 'UpdateNonFileAttachment';
    xmlDoc = AloadXmlContentString(AxmlHttp.responseText);
    AupdateCnfMsg = xmlDoc.getElementsByTagName('response')[0].childNodes[0].childNodes[0].nodeValue
    if(AT_itemStyle == 'ATTACHMENT_TABLE') 
      _submitPartialChange('DefaultFormName',0,{partialTargets:tableId});
    else 
      showConfirmation();
  }
}

function deleteAttachment(documentId, attachedDocumentId, mediaId,entityName, datatypeId, jradmode, operation)
{
    if (open_second == true) return;
    
     
    //gteella - confirmation while deleting - 8626930
    //8667358 - Appending "?" at the end of the message
    input_box=confirm(AMdeleteConfirmation + "?");
    if (input_box==false)    
    { 
        return;
    }

    numOfAttachments--;
    if(numOfAttachments > 0 || (numOfAttachments == 0 && AstartIndex > 0))
    {
      if(numOfAttachments % 5 == 0)
        AstartIndex = AstartIndex - AnoOfRows + 1;
      refreshListOfFiles = true;
      AxmlHttp=GetXmlHttpObject()
      if (AxmlHttp==null)
      {
        alert (AMxmlHttpUnsupported);
        return;
      }
      var body= "<params> <param>"+baseAM+"</param><param>deleteAttachmentFromVOs</param><param>"+documentId+"</param><param>"+attachedDocumentId+"</param><param>"+mediaId+"</param><param>"+entityName+"</param><param>"+datatypeId+"</param><param>"+uniqueKey+"</param><param>"+jradmode+"</param><param>"+operation+"</param></params>";
      AxmlHttp.onreadystatechange=afterDelete
      AxmlHttp.open("POST",rest_url,true);
      AxmlHttp.setRequestHeader("OAFunc","FND_DIALOG_PAGE");
      AxmlHttp.setRequestHeader("Content-type", "application/xml");
      AxmlHttp.send(body)
     }
    else 
    {
      tt_HideInit();
      _submitPartialChange('DefaultFormName',0,{event:'DeleteInlineAttachment',entityInfo:information,documentId:documentId, attachedDocumentId:attachedDocumentId, mediaId:mediaId,entityName:entityName, datatypeId:datatypeId,vuKey:uniqueKey,jradMode:jradmode,operation:operation,attachmentStyle:AT_itemStyle,partialTargets:tableId});
    }
}

function afterDelete()
{
  if (AxmlHttp.readyState==4 || AxmlHttp.readyState=="complete")
  {
    if( refreshListOfFiles == true )
    {
      if( AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT' || AT_itemStyle == 'ATTACHMENT_TABLE')
      _submitPartialChange('DefaultFormName',0,{partialTargets:tableId});
      if(AT_itemStyle != 'ATTACHMENT_TABLE')   
        showFiles(object,information,baseAM,whereClauseParam,tableId,userId,rest_url)
    }
  }
}

function showAttachmentContent(obj,i,j)
{
    if ( open_second == true && 'ATTACHMENT_TABLE' != AT_itemStyle) return;
    
    ddx = parseInt(AfindPosX(obj))
    ddy = parseInt(AfindPosY(obj))
    
var titleText=""
var descText=""
 var shortText=z[j].childNodes[0].nodeValue
var titleArr=x[i].getElementsByTagName('Title');
 if(titleArr.length != 0 && titleArr[0].childNodes.length != 0)
  titleText=titleArr[0].childNodes[0].nodeValue;
  
  if( titleText == null || "" == titleText) {
    titleText='Undefined';
  } else if(titleText.length >20) {
    //gteella -- 8667438
    titleText = titleText.substring(0,20)+'...';
  }

//gteella    
var textInfo= "<table><tr><td><textarea rows=\"6\" cols=\"31\"  style=\"border:none; width :211px; height :137px;\"  name=\"shorttextt\" id=\"shorttextt\" class=x4 readonly=readonly>"+shortText+"</textarea></td></tr></table>"; 
    
open_second=true;
ddTip(textInfo,  TITLE, titleText, 
STICKY, 1, CLOSEBTN, true)
}

function stateChanged1()
{
if (AxmlHttp.readyState==4 || AxmlHttp.readyState=="complete")
 {

  _submitPartialChange('DefaultFormName',0,null);    
 }

}

function showConfirmation()
{
    var confirmMsg = document.getElementById('cnfMsg');
    
    // if there is no msg set through REST or formSubmit then return
    if(AupdateCnfMsg == '' && (confirmMsg == null || confirmMsg.value.length < 15) && Aaction != 'AddAnother')
        return;

    if(Aaction=='AddAnother')
    {
        if(AfileOptionSelected == 'Y')
        {   
            if(AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT')
            {
                ArefreshAddArea = false;
                return;
            }
            ArefreshAddArea = true;
            addText(null, baseAM, AfullInfo);
        }
        else
        {
            var cnfMsgDiv = getConfirmationMsgDiv();
            document.getElementById('cnfMsgDiv').innerHTML=cnfMsgDiv;
        }
    }
    else if(Aaction == 'UpdateNonFileAttachment' && AT_itemStyle != 'ATTACHMENT_TABLE')
    {
        showFiles(object,information,baseAM,whereClauseParam,tableId,userId,rest_url)
    }
    else if((Aaction == 'UpdateNonFileAttachment' || Aaction == 'UpdateFileAttachment' ) && AT_itemStyle == 'ATTACHMENT_TABLE')
    {
        Aaction = '';
        confirmMsg = confirmMsg.value;
        // Added the separator '::;;' in java layer to separate the message from MAC
        var indexOfSep = confirmMsg.indexOf('::;;');
        if(indexOfSep > 0)
        {
            confirmMsg = confirmMsg.substr(0,indexOfSep);
        }
        if(AupdateCnfMsg != '')
        {
            confirmMsg = AupdateCnfMsg;
            AupdateCnfMsg = '';
        }
        var align = 'right';
        if(isBiDi())
            align = 'left';
        
        var displayArea = '<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tbody><tr><td width=\"100%\"><h1 class=\"x18\">'+AMconfirmText+'</h1></td></tr></tbody></table>'+
          '   <br>'+
          '                <table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" id=\"table2\" >' +
          '                     <tr>' + 
          '                             <td class=x4 style=max-width:400px>'+confirmMsg+'</td>' + 
          '                     </tr>' +
          '    		   </table>' +
          '   <br>' +
          '   <br>' +
          '   <br>' +
          '   <br>' +
          '   <br>' +
          '   <br>' +
          '               <table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" id=\"table2\" class=\"x1n x50\">' +
          '			<tr>' + 
          '				<td  align='+align+'><input type=\"reset\" value='+AMcloseButtonText+' class=\"x7g\" onclick=\"cancel_HideInit()\" style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\"></td>' + 
          '			</tr>' +
          '		  </table>';
        
          ddTip(displayArea, TITLE, AMupdateWTitle, STICKY, 1, CLOSEBTN, true);

    }
    else if(Aaction == 'Add')
    {
        Aaction = '';
        confirmMsg = confirmMsg.value;
        var indexOfSep = confirmMsg.indexOf('::;;');
        if(indexOfSep > 0)
        {
            confirmMsg = confirmMsg.substr(0,indexOfSep);
        }

        var align = 'right';
        if(isBiDi())
            align = 'left';
        
         var displayArea = '<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tbody><tr><td width=\"100%\"><h1 class=\"x18\">'+AMconfirmText+'</h1></td></tr></tbody></table>'+
          '   <br>'+
          '                <table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" id=\"table2\" >' +
          '                     <tr>' + 
          '                             <td class=x4 style=max-width:400px>'+confirmMsg+'</td>' + 
          '                     </tr>' +
          '    		   </table>' +
          '   <br>' +
          '   <br>' +
          '   <br>' +
          '   <br>' +
          '   <br>' +
          '   <br>' +
          '               <table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" id=\"table2\" class=\"x1n x50\">' +
          '			<tr>' + 
          '				<td  align='+align+'><input type=\"reset\" value='+AMcloseButtonText+' class=\"x7g\" onclick=\"cancel_Add_HideInit()\" style=\"background-image:url(/OA_HTML/cabo/images/swan/btn-bg1.gif)\"></td>' + 
          '			</tr>' +
          '		  </table>';
          
         if(AT_itemStyle != 'MESSAGE_INLINE_ATTACHMENT')  
            Tip(displayArea, TITLE, AMaddWTitle, STICKY, 1, CLOSEBTN, true);
         else
            ddTip(displayArea, TITLE, AMaddWTitle, STICKY, 1, CLOSEBTN, true);
    }
}

function getConfirmationMsgDiv()
{
  var cnfMsgDiv = '';
  if(Aaction!=null && Aaction.length > 0)   
  {
    var confirmMsg = '';
    if(AupdateCnfMsg != '')
    {
        confirmMsg = AupdateCnfMsg;
        AupdateCnfMsg = '';
        Aaction = '';
    }
    else
    {
        confirmMsg = document.getElementById('cnfMsg');
        if(confirmMsg == null || confirmMsg.value.length < 15) 
        {
            Aaction = '';
            return '';
        }
        else 
        {
            confirmMsg = confirmMsg.value;
            var indexOfSep = confirmMsg.indexOf('::;;');
            if(indexOfSep > 0)
            {
                confirmMsg = confirmMsg.substr(0,indexOfSep);
            }
        }
    }
    var align = 'left';
    if(isBiDi())
        align = 'right';
    var browserT = new Browser();
    var cnfDivStyle = '';
    if(browserT.isIE) 
    {
          cnfDivStyle = 'width:370px';
    } 
    else 
    {
          cnfDivStyle = 'max-width:370px'
    }
        
    cnfMsgDiv =   '<div style=\"'+cnfDivStyle+'\" class=\"x1n x50\">'+
                '	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">'+
                '		<tbody>'+
                '			<tr valign=\"bottom\">'+
                '				<td><img src=\"/OA_HTML/cabo/images/swan/confl.gif\" alt=\"\" border=\"0\" width=\"18\" height=\"18\"></td>'+
                '				<td><img src=\"/OA_HTML/cabo/images/swan/t.gif\" width=\"5\" height=\"0\"></td>'+
                '				<td width=\"100%\">'+
                '					<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tbody><tr><td width=\"100%\"><h1 class=\"x76\">'+AMconfirmText+'</h1></td></tr></tbody></table>'+
                '                           </td>'+            
                '			</tr>'+
                '		</tbody>'+
                '	</table>'+
                ' <div> <table width=100% border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td width=100% align='+align+' class=\"x3z\">'+confirmMsg+'</td></tr></table>'+            
                '</div></div><br>'
    Aaction = '';
    
  }
  return cnfMsgDiv;
}

function GetXmlHttpObject()
{
var xmlHttp=null;
try
 {
 // Firefox, Opera 8.0+, Safari
 xmlHttp=new XMLHttpRequest();
 }
catch (e)
 {
 //Internet Explorer
 try
  {
  xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
  }
 catch (e)
  {
  xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
 }
return xmlHttp;
}


var config = new Object();


//===================  GLOBAL TOOLTIP CONFIGURATION  =========================//
var tt_Debug	= false		// false or true - recommended: false once you release your page to the public
var tt_Enabled	= true		// Allows to (temporarily) suppress tooltips, e.g. by providing the user with a button that sets this global variable to false
var TagsToTip	= true		// false or true - if true, HTML elements to be converted to tooltips via TagToTip() are automatically hidden;
							// if false, you should hide those HTML elements yourself

// For each of the following config variables there exists a command, which is
// just the variablename in uppercase, to be passed to Tip() or TagToTip() to
// configure tooltips individually. Individual commands override global
// configuration. Order of commands is arbitrary.
// Example: onmouseover="Tip('Tooltip text', LEFT, true, BGCOLOR, '#FF9900', FADEIN, 400)"

config. Above			= false		// false or true - tooltip above mousepointer
config. BgColor			= '#ffffff'//'#f2f2f5'
config. BgImg			= ''		// Path to background image, none if empty string ''
config. BorderColor		= '#c9cbd3'
config. BorderStyle		= 'solid'	// Any permitted CSS value, but I recommend 'solid', 'dotted' or 'dashed'
config. BorderWidth		= 1
config. CenterMouse		= false		// false or true - center the tip horizontally below (or above) the mousepointer
config. ClickClose		= false		// false or true - close tooltip if the user clicks somewhere
config. ClickSticky		= false		// false or true - make tooltip sticky if user left-clicks on the hovered element while the tooltip is active
config. CloseBtn		= false		// false or true - closebutton in titlebar
config. CloseBtnColors	=''// ['#990000', '#FFFFFF', '#DD3333', '#FFFFFF']	// [Background, text, hovered background, hovered text] - use empty strings '' to inherit title colours
config. CloseBtnText	= '&nbsp;X'	// Close button text (may also be an image tag)
config. CopyContent		= true		// When converting a HTML element to a tooltip, copy only the element's content, rather than converting the element by its own
config. Delay			= 0		// Time span in ms until tooltip shows up
config. Duration		= 0			// Time span in ms after which the tooltip disappears; 0 for infinite duration, < 0 for delay in ms _after_ the onmouseout until the tooltip disappears
config. Exclusive		= false		// false or true - no other tooltip can appear until the current one has actively been closed
config. FadeIn			= 100		// Fade-in duration in ms, e.g. 400; 0 for no animation
config. FadeOut			= 100
config. FadeInterval	= 30		// Duration of each fade step in ms (recommended: 30) - shorter is smoother but causes more CPU-load
config. Fix				= null		// Fixated position, two modes. Mode 1: x- an y-coordinates in brackets, e.g. [210, 480]. Mode 2: Show tooltip at a position related to an HTML element: [ID of HTML element, x-offset, y-offset from HTML element], e.g. ['SomeID', 10, 30]. Value null (default) for no fixated positioning.
config. FollowMouse		= false		// false or true - tooltip follows the mouse
config. FontColor		= '#000044'
config. FontFace		= 'Verdana,Geneva,sans-serif'
config. FontSize		= '8pt'		// E.g. '9pt' or '12px' - unit is mandatory
config. FontWeight		= 'normal'	// 'normal' or 'bold';
config. Height			= -300			// Tooltip height; 0 for automatic adaption to tooltip content, < 0 (e.g. -100) for a maximum for automatic adaption
config. JumpHorz		= true		// false or true - jump horizontally to other side of mouse if tooltip would extend past clientarea boundary
config. JumpVert		= true		// false or true - jump vertically		"
config. Left			= false		// false or true - tooltip on the left of the mouse
config. OffsetX			= 14		// Horizontal offset of left-top corner from mousepointer
config. OffsetY			= 8			// Vertical offset
config. Opacity			= 100		// Integer between 0 and 100 - opacity of tooltip in percent
config. Padding			= 7			// Spacing between border and content
config. Shadow			= true		//8635699 // false or true
config. ShadowColor		= '#C0C0C0'
config. ShadowWidth		= 3  //8635699 
config. Sticky			= false		// false or true - fixate tip, ie. don't follow the mouse and don't hide on mouseout
config. TextAlign		= 'left'	// 'left', 'right' or 'justify'
config. Title			= ''		// Default title text applied to all tips (no default title: empty string '')
config. TitleAlign		= 'left'	// 'left' or 'right' - text alignment inside the title bar
config. TitleBgColor	= ''		// If empty string '', BorderColor will be used
config. TitleFontColor	= '#000000'	// Color of title text - if '', BgColor (of tooltip body) will be used
config. TitleFontFace	= ''		// If '' use FontFace (boldified)
config. TitleFontSize	= '9pt'		// If '' use FontSize
config. TitlePadding	= 1
config. Width			= 0			// Tooltip width; 0 for automatic adaption to tooltip content; < -1 (e.g. -240) for a maximum width for that automatic adaption;
									// -1: tooltip width confined to the width required for the titlebar
//=======  END OF TOOLTIP CONFIG//





function Tip()
{
	tt_Tip(arguments, null);
}
function TagToTip()
{
	var t2t = tt_GetElt(arguments[0]);
	if(t2t)
		tt_Tip(arguments, t2t);
}
function UnTip()
{
	tt_OpReHref();
	if(tt_aV[DURATION] < 0 && (tt_iState & 0x2))
		tt_tDurt.Timer("tt_HideInit()", -tt_aV[DURATION], true);
	else if(!(tt_aV[STICKY] && (tt_iState & 0x2)))
		tt_HideInit();
}


var tt_aElt = new Array(10), // Container DIV, outer title & body DIVs, inner title & body TDs, closebutton SPAN, shadow DIVs, and IFRAME to cover windowed elements in IE
tt_aV = new Array(),	// Caches and enumerates config data for currently active tooltip
tt_sContent,			// Inner tooltip text or HTML
tt_t2t, tt_t2tDad,		// Tag converted to tip, and its DOM parent element
tt_musX, tt_musY,
tt_over,
tt_x, tt_y, tt_w, tt_h; // Position, width and height of currently displayed tooltip
function tt_Extension()
{
	tt_ExtCmdEnum();
	tt_aExt[tt_aExt.length] = this;
	return this;
}
function tt_SetTipPos(xPos, yPos)
{
	var css = tt_aElt[0].style;
    
	tt_x = ttx;
	tt_y = tty;

if((refreshListOfFiles == true || ArefreshAddArea == true )&& xPos != 0)
{
  tt_x = ttx;
  tt_y = tty;
  refreshListOfFiles = false;
  refreshAddArea = false;
}
if(xPos != 0) {
    xPos = ttx;
    yPos = tty;
    var winW = 630, winH = 460;
    var attDiv = document.getElementById('WzTtDiV');
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
    var width=attDiv.offsetWidth;
    var height=attDiv.offsetHeight;
    var ie5=document.all&&document.getElementById;
    var ns6=document.getElementById&&!document.all;
    if (!ie5&&!ns6)
        window.open("","","width=width,height=height,scrollbars=1")
    else
    {
        var popupWinW =parseInt(xPos)+parseInt(width);
        var popupWinH =parseInt(yPos)+parseInt(height);
        
        //Bug 9322144 - BiDi handling in Popup Position
        if (isBiDi()) {
          if(parseInt(width) < xPos)
            xPos=(parseInt(xPos)-parseInt(width) + 10);//left
          else
            xPos=(parseInt(xPos)+5);//right
        }
        else 
        {
        // End 9322144
          if(popupWinW >winW && parseInt(width) < xPos)
            xPos=(parseInt(xPos)-parseInt(width) + 10);//left
          else
            xPos=(parseInt(xPos)+5);//right
        }
        
        if(popupWinH > winH && (parseInt(height)+10) < yPos)
            yPos=(parseInt(yPos)-parseInt(height)-10);//top
    }
    tt_x = xPos;
    tt_y = yPos;
}

	css.left = xPos + "px";
	css.top = yPos + "px";
	if(tt_ie56)
	{
		var ifrm = tt_aElt[tt_aElt.length - 1];
		if(ifrm)
		{
			ifrm.style.left = css.left;
			ifrm.style.top = css.top;
		}
	}
}
function tt_HideInit()
{
//gteella -- 8660141
if(attAddAction == "AddAttachment") {
    
    if(document.getElementById("shorttextt") != null) {
        var textValue = document.getElementById("shorttextt").value;
        if(textValue != null && textValue.length != 0)  {
                var confirm_box=confirm(AMcloseWindowConfirmation + "?");
                if (confirm_box==false)    
                { 
                   return;
                }        
         }
     }
     if(document.getElementById("UrlInput") != null) {
        var urlValue = document.getElementById("UrlInput").value;
        if(urlValue != null && urlValue.length != 0)  {
                var confirm_box=confirm(AMcloseWindowConfirmation + "?");
                if (confirm_box==false)    
                { 
                   return;
                }        
         }
     }
     if(document.getElementById("FileInput") != null) {
        var fileValue = document.getElementById("FileInput").value;
        if(fileValue != null && fileValue.length != 0)  {
                var confirm_box=confirm(AMcloseWindowConfirmation + "?");
                if (confirm_box==false)    
                { 
                   return;
                }        
         }
     }     
}
if(open_second==false){
 
  if( refreshListOfFiles != true )
  {
    open_first=false;
    AstartIndex = 0;
    AisPrevEnabled = false;
    AisNextEnabled = false;
    multiCategory = false;
    attAddAction = "";
  }    
	if(tt_iState)
	{
		tt_ExtCallFncs(0, "HideInit");
		tt_iState &= ~(0x4 | 0x8);
		if(tt_flagOpa && tt_aV[FADEOUT])
		{
			tt_tFade.EndTimer();
			if(tt_opa)
			{
				var n = Math.round(tt_aV[FADEOUT] / (tt_aV[FADEINTERVAL] * (tt_aV[OPACITY] / tt_opa)));
				tt_Fade(tt_opa, tt_opa, 0, n);
				return;
			}
		}
		tt_tHide.Timer("tt_Hide();", 1, false);
	}
  }
}
function cancel_Add_HideInit()
{
  
  if( AT_itemStyle == 'MESSAGE_INLINE_ATTACHMENT' ){
    cancel_HideInit();
    return;
  }
  //gteella -- 8660141
  if(open_second==false){
    open_first=false;
    if( refreshListOfFiles != true )
    {
      AstartIndex = 0;
      AisPrevEnabled = false;
      AisNextEnabled = false;
      multiCategory = false;
      attAddAction = "";
    }    
    if(tt_iState)
    {
      tt_ExtCallFncs(0, "HideInit");
      tt_iState &= ~(0x4 | 0x8);
      if(tt_flagOpa && tt_aV[FADEOUT])
      {
        tt_tFade.EndTimer();
        if(tt_opa)
        {
          var n = Math.round(tt_aV[FADEOUT] / (tt_aV[FADEINTERVAL] * (tt_aV[OPACITY] / tt_opa)));
          tt_Fade(tt_opa, tt_opa, 0, n);
          return;
        }
      }
      tt_tHide.Timer("tt_Hide();", 1, false);
    }
  }
}

function tt_Hide()
{

	if(tt_db && tt_iState)
	{
		tt_OpReHref();
		if(tt_iState & 0x2)
		{
			tt_aElt[0].style.visibility = "hidden";
			tt_ExtCallFncs(0, "Hide");
		}
		tt_tShow.EndTimer();
		tt_tHide.EndTimer();
		tt_tDurt.EndTimer();
		tt_tFade.EndTimer();
		if(!tt_op && !tt_ie)
		{
			tt_tWaitMov.EndTimer();
			tt_bWait = false;
		}
		if(tt_aV[CLICKCLOSE] || tt_aV[CLICKSTICKY])
			tt_RemEvtFnc(document, "mouseup", tt_OnLClick);
		tt_ExtCallFncs(0, "Kill");
		// In case of a TagToTip tip, hide converted DOM node and
		// re-insert it into DOM
		if(tt_t2t && !tt_aV[COPYCONTENT])
			tt_UnEl2Tip();
		tt_iState = 0;
		tt_over = null;
		tt_ResetMainDiv();
		if(tt_aElt[tt_aElt.length - 1])
			tt_aElt[tt_aElt.length - 1].style.display = "none";
	}
}
function tt_GetElt(id)
{
	return(document.getElementById ? document.getElementById(id)
			: document.all ? document.all[id]
			: null);
}
function tt_GetDivW(el)
{
	return(el ? (el.offsetWidth || el.style.pixelWidth || 0) : 0);
}
function tt_GetDivH(el)
{
	return(el ? (el.offsetHeight || el.style.pixelHeight || 0) : 0);
}
function tt_GetScrollX()
{
	return(window.pageXOffset || (tt_db ? (tt_db.scrollLeft || 0) : 0));
}
function tt_GetScrollY()
{
	return(window.pageYOffset || (tt_db ? (tt_db.scrollTop || 0) : 0));
}
function tt_GetClientW()
{
	return tt_GetWndCliSiz("Width");
}
function tt_GetClientH()
{
	return tt_GetWndCliSiz("Height");
}
function tt_GetEvtX(e)
{
	return (e ? ((typeof(e.pageX) != tt_u) ? e.pageX : (e.clientX + tt_GetScrollX())) : 0);
}
function tt_GetEvtY(e)
{
	return (e ? ((typeof(e.pageY) != tt_u) ? e.pageY : (e.clientY + tt_GetScrollY())) : 0);
}
function tt_AddEvtFnc(el, sEvt, PFnc)
{
	if(el)
	{
		if(el.addEventListener)
			el.addEventListener(sEvt, PFnc, false);
		else
			el.attachEvent("on" + sEvt, PFnc);
	}
}
function tt_RemEvtFnc(el, sEvt, PFnc)
{
	if(el)
	{
		if(el.removeEventListener)
			el.removeEventListener(sEvt, PFnc, false);
		else
			el.detachEvent("on" + sEvt, PFnc);
	}
}
function tt_GetDad(el)
{
	return(el.parentNode || el.parentElement || el.offsetParent);
}
function tt_MovDomNode(el, dadFrom, dadTo)
{
	if(dadFrom)
		dadFrom.removeChild(el);
	if(dadTo)
		dadTo.appendChild(el);
}

//======================  PRIVATE  ===========================================//
var tt_aExt = new Array(),	// Array of extension objects

tt_db, tt_op, tt_ie, tt_ie56, tt_bBoxOld,	// Browser flags
tt_body,
tt_ovr_,				// HTML element the mouse is currently over
tt_flagOpa,				// Opacity support: 1=IE, 2=Khtml, 3=KHTML, 4=Moz, 5=W3C
tt_maxPosX, tt_maxPosY,
tt_iState = 0,			// Tooltip active |= 1, shown |= 2, move with mouse |= 4, exclusive |= 8
tt_opa,					// Currently applied opacity
tt_bJmpVert, tt_bJmpHorz,// Tip temporarily on other side of mouse
tt_elDeHref,			// The tag from which we've removed the href attribute
// Timer
tt_tShow = new Number(0), tt_tHide = new Number(0), tt_tDurt = new Number(0),
tt_tFade = new Number(0), tt_tWaitMov = new Number(0),
tt_bWait = false,
tt_u = "undefined";


function tt_Init()
{
	tt_MkCmdEnum();
	// Send old browsers instantly to hell
	if(!tt_Browser() || !tt_MkMainDiv())
		return;
	tt_IsW3cBox();
	tt_OpaSupport();
	//tt_AddEvtFnc(document, "mousemove", tt_Move);
	// In Debug mode we search for TagToTip() calls in order to notify
	// the user if they've forgotten to set the TagsToTip config flag
	if(TagsToTip || tt_Debug)
		tt_SetOnloadFnc();
	// Ensure the tip be hidden when the page unloads
	tt_AddEvtFnc(window, "unload", tt_Hide);
}
// Creates command names by translating config variable names to upper case
function tt_MkCmdEnum()
{
	var n = 0;
	for(var i in config)
		eval("window." + i.toString().toUpperCase() + " = " + n++);
	tt_aV.length = n;
}
function tt_Browser()
{
	var n, nv, n6, w3c;

	n = navigator.userAgent.toLowerCase(),
	nv = navigator.appVersion;
	tt_op = (document.defaultView && typeof(eval("w" + "indow" + "." + "o" + "p" + "er" + "a")) != tt_u);
	tt_ie = n.indexOf("msie") != -1 && document.all && !tt_op;
	if(tt_ie)
	{
		var ieOld = (!document.compatMode || document.compatMode == "BackCompat");
		tt_db = !ieOld ? document.documentElement : (document.body || null);
		if(tt_db)
			tt_ie56 = parseFloat(nv.substring(nv.indexOf("MSIE") + 5)) >= 5.5
					&& typeof document.body.style.maxHeight == tt_u;
	}
	else
	{
		tt_db = document.documentElement || document.body ||
				(document.getElementsByTagName ? document.getElementsByTagName("body")[0]
				: null);
		if(!tt_op)
		{
			n6 = document.defaultView && typeof document.defaultView.getComputedStyle != tt_u;
			w3c = !n6 && document.getElementById;
		}
	}
	tt_body = (document.getElementsByTagName ? document.getElementsByTagName("body")[0]
				: (document.body || null));
	if(tt_ie || n6 || tt_op || w3c)
	{
		if(tt_body && tt_db)
		{
			if(document.attachEvent || document.addEventListener)
				return true;
		}
		else
			tt_Err("wz_tooltip.js must be included INSIDE the body section,"
					+ " immediately after the opening <body> tag.", false);
	}
	tt_db = null;
	return false;
}
function tt_MkMainDiv()
{
	// Create the tooltip DIV
	if(tt_body.insertAdjacentHTML)
		tt_body.insertAdjacentHTML("afterBegin", tt_MkMainDivHtm());
	else if(typeof tt_body.innerHTML != tt_u && document.createElement && tt_body.appendChild)
		tt_body.appendChild(tt_MkMainDivDom());
	if(window.tt_GetMainDivRefs /* FireFox Alzheimer */ && tt_GetMainDivRefs())
		return true;
	tt_db = null;
	return false;
}
function tt_MkMainDivHtm()
{
	return(
		'<div id="WzTtDiV"></div>' +
		(tt_ie56 ? ('<iframe id="WzTtIfRm" src="javascript:false" scrolling="no" frameborder="0" style="filter:Alpha(opacity=0);position:absolute;top:0px;left:0px;display:none;"></iframe>')
		: '')
	);
}
function tt_MkMainDivDom()
{
	var el = document.createElement("div");
	if(el)
		el.id = "WzTtDiV";
	return el;
}
function tt_GetMainDivRefs()
{
	tt_aElt[0] = tt_GetElt("WzTtDiV");
	if(tt_ie56 && tt_aElt[0])
	{
		tt_aElt[tt_aElt.length - 1] = tt_GetElt("WzTtIfRm");
		if(!tt_aElt[tt_aElt.length - 1])
			tt_aElt[0] = null;
	}
	if(tt_aElt[0])
	{
		var css = tt_aElt[0].style;

		css.visibility = "hidden";
		css.position = "absolute";
		css.overflow = "hidden";
		return true;
	}
	return false;
}
function tt_ResetMainDiv()
{
	tt_SetTipPos(0, 0);
	tt_aElt[0].innerHTML = "";
	tt_aElt[0].style.width = "0px";
	tt_h = 0;
}
function tt_IsW3cBox()
{
	var css = tt_aElt[0].style;

	css.padding = "10px";
	css.width = "40px";
	tt_bBoxOld = (tt_GetDivW(tt_aElt[0]) == 40);
	css.padding = "0px";
	tt_ResetMainDiv();
}
function tt_OpaSupport()
{
	var css = tt_body.style;

	tt_flagOpa = (typeof(css.KhtmlOpacity) != tt_u) ? 2
				: (typeof(css.KHTMLOpacity) != tt_u) ? 3
				: (typeof(css.MozOpacity) != tt_u) ? 4
				: (typeof(css.opacity) != tt_u) ? 5
				: (typeof(css.filter) != tt_u) ? 1
				: 0;
}
// Ported from http://dean.edwards.name/weblog/2006/06/again/
// (Dean Edwards et al.)
function tt_SetOnloadFnc()
{
	tt_AddEvtFnc(document, "DOMContentLoaded", tt_HideSrcTags);
	tt_AddEvtFnc(window, "load", tt_HideSrcTags);
	if(tt_body.attachEvent)
		tt_body.attachEvent("onreadystatechange",
			function() {
				if(tt_body.readyState == "complete")
					tt_HideSrcTags();
			} );
	if(/WebKit|KHTML/i.test(navigator.userAgent))
	{
		var t = setInterval(function() {
					if(/loaded|complete/.test(document.readyState))
					{
						clearInterval(t);
						tt_HideSrcTags();
					}
				}, 10);
	}
}
function tt_HideSrcTags()
{
	if(!window.tt_HideSrcTags || window.tt_HideSrcTags.done)
		return;
	window.tt_HideSrcTags.done = true;
	if(!tt_HideSrcTagsRecurs(tt_body))
		tt_Err("There are HTML elements to be converted to tooltips.\nIf you"
				+ " want these HTML elements to be automatically hidden, you"
				+ " must edit wz_tooltip.js, and set TagsToTip in the global"
				+ " tooltip configuration to true.", true);
}
function tt_HideSrcTagsRecurs(dad)
{
	var ovr, asT2t;
	// Walk the DOM tree for tags that have an onmouseover or onclick attribute
	// containing a TagToTip('...') call.
	// (.childNodes first since .children is bugous in Safari)
	var a = dad.childNodes || dad.children || null;

	for(var i = a ? a.length : 0; i;)
	{--i;
		if(!tt_HideSrcTagsRecurs(a[i]))
			return false;
		ovr = a[i].getAttribute ? (a[i].getAttribute("onmouseover") || a[i].getAttribute("onclick"))
				: (typeof a[i].onmouseover == "function") ? (a[i].onmouseover || a[i].onclick)
				: null;
		if(ovr)
		{
			asT2t = ovr.toString().match(/TagToTip\s*\(\s*'[^'.]+'\s*[\),]/);
			if(asT2t && asT2t.length)
			{
				if(!tt_HideSrcTag(asT2t[0]))
					return false;
			}
		}
	}
	return true;
}
function tt_HideSrcTag(sT2t)
{
	var id, el;

	// The ID passed to the found TagToTip() call identifies an HTML element
	// to be converted to a tooltip, so hide that element
	id = sT2t.replace(/.+'([^'.]+)'.+/, "$1");
	el = tt_GetElt(id);
	if(el)
	{
		if(tt_Debug && !TagsToTip)
			return false;
		else
			el.style.display = "none";
	}
	else
		tt_Err("Invalid ID\n'" + id + "'\npassed to TagToTip()."
				+ " There exists no HTML element with that ID.", true);
	return true;
}
function tt_Tip(arg, t2t)
{
	if(!tt_db || (tt_iState & 0x8))
		return;
	//if(tt_iState)
		//tt_Hide();
	if(!tt_Enabled)
		return;
	tt_t2t = t2t;
	if(!tt_ReadCmds(arg))
		return;
	tt_iState = 0x1 | 0x4;
  
	tt_AdaptConfig1();
  
	tt_MkTipContent(arg);
  
	tt_MkTipSubDivs();
  
	tt_FormatTip();
  
	tt_bJmpVert = false;
	tt_bJmpHorz = false;
	tt_maxPosX = tt_GetClientW() + tt_GetScrollX() - tt_w - 1;
	tt_maxPosY = tt_GetClientH() + tt_GetScrollY() - tt_h - 1;
	tt_AdaptConfig2();
  
	// Ensure the tip be shown and positioned before the first onmousemove
	tt_OverInit();
  
	tt_ShowInit();
  
	tt_Move();
  
}
function tt_ReadCmds(a)
{
	var i;

	// First load the global config values, to initialize also values
	// for which no command is passed
	i = 0;
	for(var j in config)
		tt_aV[i++] = config[j];
	// Then replace each cached config value for which a command is
	// passed (ensure the # of command args plus value args be even)
	if(a.length & 1)
	{
		for(i = a.length - 1; i > 0; i -= 2)
			tt_aV[a[i - 1]] = a[i];
		return true;
	}
	tt_Err("Incorrect call of Tip() or TagToTip().\n"
			+ "Each command must be followed by a value.", true);
	return false;
}
function tt_AdaptConfig1()
{
	tt_ExtCallFncs(0, "LoadConfig");
	// Inherit unspecified title formattings from body
	if(!tt_aV[TITLEBGCOLOR].length)
		tt_aV[TITLEBGCOLOR] = tt_aV[BORDERCOLOR];
	if(!tt_aV[TITLEFONTCOLOR].length)
		tt_aV[TITLEFONTCOLOR] = tt_aV[BGCOLOR];
	if(!tt_aV[TITLEFONTFACE].length)
		tt_aV[TITLEFONTFACE] = tt_aV[FONTFACE];
	if(!tt_aV[TITLEFONTSIZE].length)
		tt_aV[TITLEFONTSIZE] = tt_aV[FONTSIZE];
	if(tt_aV[CLOSEBTN])
	{
		// Use title colours for non-specified closebutton colours
		if(!tt_aV[CLOSEBTNCOLORS])
			tt_aV[CLOSEBTNCOLORS] = new Array("", "", "", "");
		for(var i = 4; i;)
		{--i;
			if(!tt_aV[CLOSEBTNCOLORS][i].length)
			tt_aV[CLOSEBTNCOLORS][i] = (i & 1) ? tt_aV[TITLEFONTCOLOR] : tt_aV[TITLEBGCOLOR];
		}
		// Enforce titlebar be shown
		if(!tt_aV[TITLE].length)
			tt_aV[TITLE] = " ";
	}
	// Circumvents broken display of images and fade-in flicker in Geckos < 1.8
	if(tt_aV[OPACITY] == 100 && typeof tt_aElt[0].style.MozOpacity != tt_u && !Array.every)
		tt_aV[OPACITY] = 99;
	// Smartly shorten the delay for fade-in tooltips
	if(tt_aV[FADEIN] && tt_flagOpa && tt_aV[DELAY] > 100)
		tt_aV[DELAY] = Math.max(tt_aV[DELAY] - tt_aV[FADEIN], 100);
}
function tt_AdaptConfig2()
{
	if(tt_aV[CENTERMOUSE])
	{
		tt_aV[OFFSETX] -= ((tt_w - (tt_aV[SHADOW] ? tt_aV[SHADOWWIDTH] : 0)) >> 1);
		tt_aV[JUMPHORZ] = false;
	}
}
// Expose content globally so extensions can modify it
function tt_MkTipContent(a)
{
	if(tt_t2t)
	{
		if(tt_aV[COPYCONTENT])
			tt_sContent = tt_t2t.innerHTML;
		else
			tt_sContent = "";
	}
	else
		tt_sContent = a[0];
	tt_ExtCallFncs(0, "CreateContentString");
}
var iii=0
function tt_MkTipSubDivs()
{
var sCss = 'position:relative;margin:0px;padding:0px;border-width:0px;left:0px;top:0px;line-height:normal;width:auto;';
	var sCss1 = 'position:relative;margin:0px;padding:0px;border-width:0px;left:0px;top:0px;line-height:normal;width:auto;background-image:url(/OA_HTML/cabo/images/swan/headingBarBg.gif);';
	var sTbTrTd = ' cellspacing="0" cellpadding="0" border="0" style="' + sCss + '"><tbody style="' + sCss + '"><tr  style="' + sCss+'" ><td ';
  var sTbTrTd1 = ' cellspacing="0" cellpadding="0" border="0" style="' + sCss1 + '"><tbody style="' + sCss1 + '"><tr  style="' + sCss1+'" ><td ';
  //gteella - 8474177
  var sTbTrTd2 = ' cellspacing="0" cellpadding="0" border="0" style="' + sCss + '"><tbody style="' + sCss + '"><tr  style="' + sCss+'" ><td onmousedown="dragStart(event,\'WzTtDiV\')"';

	tt_aElt[0].style.width = tt_GetClientW() + "px";
    
  if (AreadingStyle == 1)   {
    tt_aElt[0].innerHTML =
      (''
      + (tt_aV[TITLE].length ?
        ('<div id="WzTiTl" style="position:relative;z-index:1;">'
        + '<table id="WzTiTlTb" ' + sTbTrTd2 + 'id="WzTiTlI" style="' + sCss1 + 'border:0px;"><h1 class=x75>'
        + tt_aV[TITLE]
        + '</h1></td>'
        + (tt_aV[CLOSEBTN] ?
          ('<td align="right" style="' + sCss1
          + 'text-align:right;">'
          + '<span id="WzClOsE" style="position:relative;left:2px;padding-left:2px;padding-right:2px;'
          + 'cursor:' + (tt_ie ? 'hand' : 'pointer')
          + ';" onclick="tt_HideInit()">'
          + '<img src=\"/OA_MEDIA/popup_close.gif\" />'
          + '</span></td>')
          : '')
        + '</tr></tbody></table></div>')
        : '')
      + '<div id="WzBoDy" style="position:relative;z-index:0;style="'+sCss+'">'
      + '<table' + sTbTrTd + 'id="WzBoDyI" style="' + sCss + '">'
      + tt_sContent
      + '</td></tr></tbody></table></div>'
      + (tt_aV[SHADOW]
        ? ('<div id="WzTtShDwR" style="position:absolute;overflow:hidden;"></div>'
          + '<div id="WzTtShDwB" style="position:relative;overflow:hidden;"></div>')
        : '')
      );
  } 
  else {
    tt_aElt[0].innerHTML =
      (''
      + (tt_aV[TITLE].length ?
        ('<div id="WzTiTl" style="position:relative;z-index:1;">'
        + '<table id="WzTiTlTb" ' + sTbTrTd2 + 'id="WzTiTlI" style="' + sCss1 + 'border:0px;"><h1 class=x75>'
        + tt_aV[TITLE]
        + '</h1></td>'
        + (tt_aV[CLOSEBTN] ?
          ('<td align="left" style="' + sCss1
          + 'text-align:left;">'
          + '<span id="WzClOsE" style="position:relative;left:2px;padding-left:2px;padding-right:2px;'
          + 'cursor:' + (tt_ie ? 'hand' : 'pointer')
          + ';" onclick="tt_HideInit()">'
          + '<img src=\"/OA_MEDIA/popup_close.gif\" />'
          + '</span></td>')
          : '')
        + '</tr></tbody></table></div>')
        : '')
      + '<div id="WzBoDy" style="position:relative;z-index:0;style="'+sCss+'">'
      + '<table' + sTbTrTd + 'id="WzBoDyI" style="' + sCss + '">'
      + tt_sContent
      + '</td></tr></tbody></table></div>'
      + (tt_aV[SHADOW]
        ? ('<div id="WzTtShDwR" style="position:absolute;overflow:hidden;"></div>'
          + '<div id="WzTtShDwB" style="position:relative;overflow:hidden;"></div>')
        : '')
      );  
  }

	tt_GetSubDivRefs();

	// Convert DOM node to tip
	if(tt_t2t && !tt_aV[COPYCONTENT])
		tt_El2Tip();

	tt_ExtCallFncs(0, "SubDivsCreated");
}
function tt_GetSubDivRefs()
{
	var aId = new Array("WzTiTl", "WzTiTlTb", "WzTiTlI", "WzClOsE", "WzBoDy", "WzBoDyI", "WzTtShDwB", "WzTtShDwR");

	for(var i = aId.length; i; --i)
		tt_aElt[i] = tt_GetElt(aId[i - 1]);
}
function tt_FormatTip()
{
	var css, w, h, pad = tt_aV[PADDING], padT, wBrd = tt_aV[BORDERWIDTH],
	iOffY, iOffSh, iAdd = (pad + wBrd) << 1;

	//--------- Title DIV ----------
	if(tt_aV[TITLE].length)
	{
		padT = tt_aV[TITLEPADDING];
		css = tt_aElt[1].style;
		css.background = tt_aV[TITLEBGCOLOR];
		css.paddingTop = css.paddingBottom = padT + "px";
		css.paddingLeft = css.paddingRight = (padT + 2) + "px";
		css = tt_aElt[3].style;
		css.color = tt_aV[TITLEFONTCOLOR];
		if(tt_aV[WIDTH] == -1)
			css.whiteSpace = "nowrap";
		css.fontFamily = tt_aV[TITLEFONTFACE];
		css.fontSize = tt_aV[TITLEFONTSIZE];
		css.fontWeight = "bold";
		css.textAlign = tt_aV[TITLEALIGN];
		// Close button DIV
		if(tt_aElt[4])
		{
			css = tt_aElt[4].style;
			//css.background = tt_aV[CLOSEBTNCOLORS][0];
			css.color = tt_aV[CLOSEBTNCOLORS][1];
			css.fontFamily = tt_aV[TITLEFONTFACE];
			css.fontSize = tt_aV[TITLEFONTSIZE];
			css.fontWeight = "bold";
		}
		if(tt_aV[WIDTH] > 0)
			tt_w = tt_aV[WIDTH];
		else
		{
			tt_w = tt_GetDivW(tt_aElt[3]) + tt_GetDivW(tt_aElt[4]);
			// Some spacing between title DIV and closebutton
			if(tt_aElt[4])
				tt_w += pad;
			// Restrict auto width to max width
			if(tt_aV[WIDTH] < -1 && tt_w > -tt_aV[WIDTH])
				tt_w = -tt_aV[WIDTH];
		}
		// Ensure the top border of the body DIV be covered by the title DIV
		iOffY = -wBrd;
	}
	else
	{
		tt_w = 0;
		iOffY = 0;
	}

	//-------- Body DIV ------------
	css = tt_aElt[5].style;
	css.top = iOffY + "px";
	if(wBrd)
	{
		css.borderColor = tt_aV[BORDERCOLOR];
		css.borderStyle = tt_aV[BORDERSTYLE];
		css.borderWidth = wBrd + "px";
	}
	if(tt_aV[BGCOLOR].length)
	css.background = tt_aV[BGCOLOR];
	if(tt_aV[BGIMG].length)
		css.backgroundImage = "url(" + tt_aV[BGIMG] + ")";
	css.padding = pad + "px";
	css.textAlign = tt_aV[TEXTALIGN];
	if(tt_aV[HEIGHT])
	{
		css.overflow = "auto";
		if(tt_aV[HEIGHT] > 0)
			css.height = (tt_aV[HEIGHT] + iAdd) + "px";
		else
			tt_h = iAdd - tt_aV[HEIGHT];
	}
	// TD inside body DIV
	css = tt_aElt[6].style;
	css.color = tt_aV[FONTCOLOR];
	css.fontFamily = tt_aV[FONTFACE];
	css.fontSize = tt_aV[FONTSIZE];
	css.fontWeight = tt_aV[FONTWEIGHT];
	css.textAlign = tt_aV[TEXTALIGN];
	if(tt_aV[WIDTH] > 0)
		w = tt_aV[WIDTH];
	// Width like title (if existent)
	else if(tt_aV[WIDTH] == -1 && tt_w)
		w = tt_w;
	else
	{
		// Measure width of the body's inner TD, as some browsers would expand
		// the container and outer body DIV to 100%
		w = tt_GetDivW(tt_aElt[6]);
		// Restrict auto width to max width
		if(tt_aV[WIDTH] < -1 && w > -tt_aV[WIDTH])
			w = -tt_aV[WIDTH];
	}
	if(w > tt_w)
		tt_w = w;
	tt_w += iAdd;

	//--------- Shadow DIVs ------------
	if(tt_aV[SHADOW])
	{
		tt_w += tt_aV[SHADOWWIDTH];
		iOffSh = Math.floor((tt_aV[SHADOWWIDTH] * 4) / 3);
		// Bottom shadow
		css = tt_aElt[7].style;
		css.top = iOffY + "px";
		css.left = iOffSh + "px";
		css.width = (tt_w - iOffSh - tt_aV[SHADOWWIDTH]) + "px";
		css.height = tt_aV[SHADOWWIDTH] + "px";
		css.background = tt_aV[SHADOWCOLOR];
		// Right shadow
		css = tt_aElt[8].style;
		css.top = iOffSh + "px";
		css.left = (tt_w - tt_aV[SHADOWWIDTH]) + "px";
		css.width = tt_aV[SHADOWWIDTH] + "px";
		css.background = tt_aV[SHADOWCOLOR];
	}
	else
		iOffSh = 0;

	//-------- Container DIV -------
	tt_SetTipOpa(tt_aV[FADEIN] ? 0 : tt_aV[OPACITY]);
	tt_FixSize(iOffY, iOffSh);
}
// Fixate the size so it can't dynamically change while the tooltip is moving.
function tt_FixSize(iOffY, iOffSh)
{
	var wIn, wOut, h, add, pad = tt_aV[PADDING], wBrd = tt_aV[BORDERWIDTH], i;

	tt_aElt[0].style.width = tt_w + "px";
	tt_aElt[0].style.pixelWidth = tt_w;
	wOut = tt_w - ((tt_aV[SHADOW]) ? tt_aV[SHADOWWIDTH] : 0);
	// Body
	wIn = wOut;
	if(!tt_bBoxOld)
		wIn -= (pad + wBrd) << 1;
	tt_aElt[5].style.width = wIn + "px";
	// Title
	if(tt_aElt[1])
	{
		wIn = wOut - ((tt_aV[TITLEPADDING] + 2) << 1);
		if(!tt_bBoxOld)
			wOut = wIn;
		tt_aElt[1].style.width = wOut + "px";
		tt_aElt[2].style.width = wIn + "px";
	}
	// Max height specified
	if(tt_h)
	{
		h = tt_GetDivH(tt_aElt[5]);
		if(h > tt_h)
		{
			if(!tt_bBoxOld)
				tt_h -= (pad + wBrd) << 1;
			tt_aElt[5].style.height = tt_h + "px";
		}
	}
	tt_h = tt_GetDivH(tt_aElt[0]) + iOffY;
	// Right shadow
	if(tt_aElt[8])
		tt_aElt[8].style.height = (tt_h - iOffSh) + "px";
	i = tt_aElt.length - 1;
	if(tt_aElt[i])
	{
		tt_aElt[i].style.width = tt_w + "px";
		tt_aElt[i].style.height = tt_h + "px";
	}
}
function tt_DeAlt(el)
{
	var aKid;

	if(el)
	{
		if(el.alt)
			el.alt = "";
		if(el.title)
			el.title = "";
		aKid = el.childNodes || el.children || null;
		if(aKid)
		{
			for(var i = aKid.length; i;)
				tt_DeAlt(aKid[--i]);
		}
	}
}
// This hack removes the native tooltips over links in Opera
function tt_OpDeHref(el)
{
	if(!tt_op)
		return;
	if(tt_elDeHref)
		tt_OpReHref();
	while(el)
	{
		if(el.hasAttribute && el.hasAttribute("href"))
		{
			el.t_href = el.getAttribute("href");
			el.t_stats = window.status;
			el.removeAttribute("href");
			el.style.cursor = "hand";
			tt_AddEvtFnc(el, "mousedown", tt_OpReHref);
			window.status = el.t_href;
			tt_elDeHref = el;
			break;
		}
		el = tt_GetDad(el);
	}
}
function tt_OpReHref()
{
	if(tt_elDeHref)
	{
		tt_elDeHref.setAttribute("href", tt_elDeHref.t_href);
		tt_RemEvtFnc(tt_elDeHref, "mousedown", tt_OpReHref);
		window.status = tt_elDeHref.t_stats;
		tt_elDeHref = null;
	}
}
function tt_El2Tip()
{

	var css = tt_t2t.style;

	// Store previous positioning
	tt_t2t.t_cp = css.position;
	tt_t2t.t_cl = css.left;
	tt_t2t.t_ct = css.top;
	tt_t2t.t_cd = css.display;
	// Store the tag's parent element so we can restore that DOM branch
	// when the tooltip is being hidden
	tt_t2tDad = tt_GetDad(tt_t2t);
	tt_MovDomNode(tt_t2t, tt_t2tDad, tt_aElt[6]);
	css.display = "block";
	css.position = "static";
	css.left = css.top = css.marginLeft = css.marginTop = "0px";
}
function tt_UnEl2Tip()
{
	// Restore positioning and display
	var css = tt_t2t.style;

	css.display = tt_t2t.t_cd;
	tt_MovDomNode(tt_t2t, tt_GetDad(tt_t2t), tt_t2tDad);
	css.position = tt_t2t.t_cp;
	css.left = tt_t2t.t_cl;
	css.top = tt_t2t.t_ct;
	tt_t2tDad = null;
}
function tt_OverInit()
{
	if(window.event)
		tt_over = window.event.target || window.event.srcElement;
	else
		tt_over = tt_ovr_;
	tt_DeAlt(tt_over);
	tt_OpDeHref(tt_over);
}
function tt_ShowInit()
{
	tt_tShow.Timer("tt_Show()", tt_aV[DELAY], true);
	if(tt_aV[CLICKCLOSE] || tt_aV[CLICKSTICKY])
		tt_AddEvtFnc(document, "mouseup", tt_OnLClick);
}
function tt_Show()
{
	var css = tt_aElt[0].style;
        var browser1 = new Browser();
	// Override the z-index of the topmost wz_dragdrop.js D&D item
        //gteella -Zindex  - 8574473
        if(browser1.isIE) {
            css.zIndex = Math.max((window.dd && dd.z) ? (dd.z + 2) : 0, 1010);//8970471;
        } else {
            css.zIndex = Math.max((window.dd && dd.z) ? (dd.z + 2) : 0, 1010);
        }
	if(tt_aV[STICKY] || !tt_aV[FOLLOWMOUSE])
		tt_iState &= ~0x4;
	if(tt_aV[EXCLUSIVE])
		tt_iState |= 0x8;
	if(tt_aV[DURATION] > 0)
		tt_tDurt.Timer("tt_HideInit()", tt_aV[DURATION], true);
	tt_ExtCallFncs(0, "Show")
	css.visibility = "visible";
	tt_iState |= 0x2;
	if(tt_aV[FADEIN])
		tt_Fade(0, 0, tt_aV[OPACITY], Math.round(tt_aV[FADEIN] / tt_aV[FADEINTERVAL]));
	tt_ShowIfrm();
}
function tt_ShowIfrm()
{
	if(tt_ie56)
	{
		var ifrm = tt_aElt[tt_aElt.length - 1];
		if(ifrm)
		{
			var css = ifrm.style;
			css.zIndex = tt_aElt[0].style.zIndex - 1;
			css.display = "block";
		}
	}
}
function tt_Move(e)
{
	if(e)
		tt_ovr_ = e.target || e.srcElement;
	e = e || window.event;
	if(e)
	{
		tt_musX = tt_GetEvtX(e);
		tt_musY = tt_GetEvtY(e);
	}
	if(tt_iState & 0x4)
	{
		// Prevent jam of mousemove events
		if(!tt_op && !tt_ie)
		{
			if(tt_bWait)
				return;
			tt_bWait = true;
			tt_tWaitMov.Timer("tt_bWait = false;", 1, true);
		}
		if(tt_aV[FIX])
		{
			tt_iState &= ~0x4;
			tt_PosFix();
		}
		else if(!tt_ExtCallFncs(e, "MoveBefore"))
			tt_SetTipPos(tt_Pos(0), tt_Pos(1));
		tt_ExtCallFncs([tt_musX, tt_musY], "MoveAfter")
	}
}
function tt_Pos(iDim)
{
	var iX, bJmpMod, cmdAlt, cmdOff, cx, iMax, iScrl, iMus, bJmp;

	// Map values according to dimension to calculate
	if(iDim)
	{
		bJmpMod = tt_aV[JUMPVERT];
		cmdAlt = ABOVE;
		cmdOff = OFFSETY;
		cx = tt_h;
		iMax = tt_maxPosY;
		iScrl = tt_GetScrollY();
		iMus = tt_musY;
		bJmp = tt_bJmpVert;
	}
	else
	{
		bJmpMod = tt_aV[JUMPHORZ];
		cmdAlt = LEFT;
		cmdOff = OFFSETX;
		cx = tt_w;
		iMax = tt_maxPosX;
		iScrl = tt_GetScrollX();
		iMus = tt_musX;
		bJmp = tt_bJmpHorz;
	}
	if(bJmpMod)
	{
		if(tt_aV[cmdAlt] && (!bJmp || tt_CalcPosAlt(iDim) >= iScrl + 16))
			iX = tt_PosAlt(iDim);
		else if(!tt_aV[cmdAlt] && bJmp && tt_CalcPosDef(iDim) > iMax - 16)
			iX = tt_PosAlt(iDim);
		else
			iX = tt_PosDef(iDim);
	}
	else
	{
		iX = iMus;
		if(tt_aV[cmdAlt])
			iX -= cx + tt_aV[cmdOff] - (tt_aV[SHADOW] ? tt_aV[SHADOWWIDTH] : 0);
		else
			iX += tt_aV[cmdOff];
	}
	// Prevent tip from extending past clientarea boundary
	if(iX > iMax)
		iX = bJmpMod ? tt_PosAlt(iDim) : iMax;
	// In case of insufficient space on both sides, ensure the left/upper part
	// of the tip be visible
	if(iX < iScrl)
		iX = bJmpMod ? tt_PosDef(iDim) : iScrl;
	return iX;
}
function tt_PosDef(iDim)
{
	if(iDim)
		tt_bJmpVert = tt_aV[ABOVE];
	else
		tt_bJmpHorz = tt_aV[LEFT];
	return tt_CalcPosDef(iDim);
}
function tt_PosAlt(iDim)
{
	if(iDim)
		tt_bJmpVert = !tt_aV[ABOVE];
	else
		tt_bJmpHorz = !tt_aV[LEFT];
	return tt_CalcPosAlt(iDim);
}
function tt_CalcPosDef(iDim)
{
	return iDim ? (tt_musY + tt_aV[OFFSETY]) : (tt_musX + tt_aV[OFFSETX]);
}
function tt_CalcPosAlt(iDim)
{
	var cmdOff = iDim ? OFFSETY : OFFSETX;
	var dx = tt_aV[cmdOff] - (tt_aV[SHADOW] ? tt_aV[SHADOWWIDTH] : 0);
	if(tt_aV[cmdOff] > 0 && dx <= 0)
		dx = 1;
	return((iDim ? (tt_musY - tt_h) : (tt_musX - tt_w)) - dx);
}
function tt_PosFix()
{
	var iX, iY;

	if(typeof(tt_aV[FIX][0]) == "number")
	{
		iX = tt_aV[FIX][0];
		iY = tt_aV[FIX][1];
	}
	else
	{
		if(typeof(tt_aV[FIX][0]) == "string")
			el = tt_GetElt(tt_aV[FIX][0]);
		// First slot in array is direct reference to HTML element
		else
			el = tt_aV[FIX][0];
		iX = tt_aV[FIX][1];
		iY = tt_aV[FIX][2];
		// By default, vert pos is related to bottom edge of HTML element
		if(!tt_aV[ABOVE] && el)
			iY += tt_GetDivH(el);
		for(; el; el = el.offsetParent)
		{
			iX += el.offsetLeft || 0;
			iY += el.offsetTop || 0;
		}
	}
	// For a fixed tip positioned above the mouse, use the bottom edge as anchor

	if(tt_aV[ABOVE])
		iY -= tt_h;
    
    //dj
   
if(refreshListOfFiles == true)
{

iX = ttx;
	iY = tty;
  refreshListOfFiles = false;

}
	tt_SetTipPos(iX, iY);
}
function tt_Fade(a, now, z, n)
{
	if(n)
	{
		now += Math.round((z - now) / n);
		if((z > a) ? (now >= z) : (now <= z))
			now = z;
		else
			tt_tFade.Timer(
				"tt_Fade("
				+ a + "," + now + "," + z + "," + (n - 1)
				+ ")",
				tt_aV[FADEINTERVAL],
				true
			);
	}
	now ? tt_SetTipOpa(now) : tt_Hide();
}
function tt_SetTipOpa(opa)
{
	// To circumvent the opacity nesting flaws of IE, we set the opacity
	// for each sub-DIV separately, rather than for the container DIV.
	tt_SetOpa(tt_aElt[5], opa);
	if(tt_aElt[1])
		tt_SetOpa(tt_aElt[1], opa);
	if(tt_aV[SHADOW])
	{
		opa = Math.round(opa * 0.8);
		tt_SetOpa(tt_aElt[7], opa);
		tt_SetOpa(tt_aElt[8], opa);
	}
}
function tt_OnCloseBtnOver(iOver)
{
	var css = tt_aElt[4].style;

	iOver <<= 1;
	css.background = tt_aV[CLOSEBTNCOLORS][iOver];
	css.color = tt_aV[CLOSEBTNCOLORS][iOver + 1];
}
function tt_OnLClick(e)
{
	//  Ignore right-clicks
	e = e || window.event;
	if(!((e.button && e.button & 2) || (e.which && e.which == 3)))
	{
		if(tt_aV[CLICKSTICKY] && (tt_iState & 0x4))
		{
			tt_aV[STICKY] = true;
			tt_iState &= ~0x4;
		}
		else if(tt_aV[CLICKCLOSE])
			tt_HideInit();
	}
}
function tt_Int(x)
{
	var y;

	return(isNaN(y = parseInt(x)) ? 0 : y);
}
Number.prototype.Timer = function(s, iT, bUrge)
{
	if(!this.value || bUrge)
		this.value = window.setTimeout(s, iT);
}
Number.prototype.EndTimer = function()
{
	if(this.value)
	{
		window.clearTimeout(this.value);
		this.value = 0;
	}
}
function tt_GetWndCliSiz(s)
{
	var db, y = window["inner" + s], sC = "client" + s, sN = "number";
	if(typeof y == sN)
	{
		var y2;
		return(
			// Gecko or Opera with scrollbar
			// ... quirks mode
			((db = document.body) && typeof(y2 = db[sC]) == sN && y2 &&  y2 <= y) ? y2 
			// ... strict mode
			: ((db = document.documentElement) && typeof(y2 = db[sC]) == sN && y2 && y2 <= y) ? y2
			// No scrollbar, or clientarea size == 0, or other browser (KHTML etc.)
			: y
		);
	}
	// IE
	return(
		// document.documentElement.client+s functional, returns > 0
		((db = document.documentElement) && (y = db[sC])) ? y
		// ... not functional, in which case document.body.client+s 
		// is the clientarea size, fortunately
		: document.body[sC]
	);
}
function tt_SetOpa(el, opa)
{
	var css = el.style;

	tt_opa = opa;
	if(tt_flagOpa == 1)
	{
		if(opa < 100)
		{
			// Hacks for bugs of IE:
			// 1.) Once a CSS filter has been applied, fonts are no longer
			// anti-aliased, so we store the previous 'non-filter' to be
			// able to restore it
			if(typeof(el.filtNo) == tt_u)
				el.filtNo = css.filter;
			// 2.) A DIV cannot be made visible in a single step if an
			// opacity < 100 has been applied while the DIV was hidden
			var bVis = css.visibility != "hidden";
			// 3.) In IE6, applying an opacity < 100 has no effect if the
			//	   element has no layout (position, size, zoom, ...)
			css.zoom = "100%";
			if(!bVis)
				css.visibility = "visible";
			css.filter = "alpha(opacity=" + opa + ")";
			if(!bVis)
				css.visibility = "hidden";
		}
		else if(typeof(el.filtNo) != tt_u)
			// Restore 'non-filter'
			css.filter = el.filtNo;
	}
	else
	{
		opa /= 100.0;
		switch(tt_flagOpa)
		{
		case 2:
			css.KhtmlOpacity = opa; break;
		case 3:
			css.KHTMLOpacity = opa; break;
		case 4:
			css.MozOpacity = opa; break;
		case 5:
			css.opacity = opa; break;
		}
	}
}
function tt_Err(sErr, bIfDebug)
{
	if(tt_Debug || !bIfDebug){}
		//alert("Tooltip Script Error Message:\n\n" + sErr);
}

//============  EXTENSION (PLUGIN) MANAGER  ===============//
function tt_ExtCmdEnum()
{
	var s;

	// Add new command(s) to the commands enum
	for(var i in config)
	{
		s = "window." + i.toString().toUpperCase();
		if(eval("typeof(" + s + ") == tt_u"))
		{
			eval(s + " = " + tt_aV.length);
			tt_aV[tt_aV.length] = null;
		}
	}
}
function tt_ExtCallFncs(arg, sFnc)
{
	var b = false;
	for(var i = tt_aExt.length; i;)
	{--i;
		var fnc = tt_aExt[i]["On" + sFnc];
		// Call the method the extension has defined for this event
		if(fnc && fnc(arg))
			b = true;
	}
	return b;
}


var config1 = new Object();


//===================  GLOBAL TOOLTIP config1URATION  =========================//
var dd_Debug	= false		// false or true - recommended: false once you release your page to the public
var dd_Enabled	= true		// Allows to (temporarily) suppress tooltips, e.g. by providing the user with a button that sets this global variable to false
var TagsToTip1	= true		// false or true - if true, HTML elements to be converted to tooltips via TagToTip() are automatically hidden;
							// if false, you should hide those HTML elements yourself

// For each of the following config1 variables there exists a command, which is
// just the variablename in uppercase, to be passed to Tip() or TagToTip() to
// config1ure tooltips individually. Individual commands override global
// config1uration. Order of commands is arbitrary.
// Example: onmouseover="Tip('Tooltip text', LEFT, true, BGCOLOR, '#FF9900', FADEIN, 400)"

config1. Above			= false		// false or true - tooltip above mousepointer
config1. BgColor		= '#ffffff'//gteella//'#f2f2f5'	// Background colour (HTML colour value, in quotes)
config1. BgImg			= ''		// Path to background image, none if empty string ''
config1. BorderColor		= '#c9cbd3'
config1. BorderStyle		= 'solid'	// Any permitted CSS value, but I recommend 'solid', 'dotted' or 'dashed'
config1. BorderWidth		= 1
config1. CenterMouse		= false		// false or true - center the tip horizontally below (or above) the mousepointer
config1. ClickClose		= false		// false or true - close tooltip if the user clicks somewhere
config1. ClickSticky		= false		// false or true - make tooltip sticky if user left-clicks on the hovered element while the tooltip is active
config1. CloseBtn		= false		// false or true - closebutton in titlebar
config1. CloseBtnColors	= ''//['#990000', '#FFFFFF', '#DD3333', '#FFFFFF']	// [Background, text, hovered background, hovered text] - use empty strings '' to inherit title colours
config1. CloseBtnText	= '&nbsp;X'	// Close button text (may also be an image tag)
config1. CopyContent		= true		// When converting a HTML element to a tooltip, copy only the element's content, rather than converting the element by its own
config1. Delay			= 1000		// Time span in ms until tooltip shows up
config1. Duration		= 0			// Time span in ms after which the tooltip disappears; 0 for infinite duration, < 0 for delay in ms _after_ the onmouseout until the tooltip disappears
config1. Exclusive		= false		// false or true - no other tooltip can appear until the current one has actively been closed
config1. FadeIn			= 100		// Fade-in duration in ms, e.g. 400; 0 for no animation
config1. FadeOut			= 100
config1. FadeInterval	= 30		// Duration of each fade step in ms (recommended: 30) - shorter is smoother but causes more CPU-load
config1. Fix				= null		// Fixated position, two modes. Mode 1: x- an y-coordinates in brackets, e.g. [210, 480]. Mode 2: Show tooltip at a position related to an HTML element: [ID of HTML element, x-offset, y-offset from HTML element], e.g. ['SomeID', 10, 30]. Value null (default) for no fixated positioning.
config1. FollowMouse		= false		// false or true - tooltip follows the mouse
config1. FontColor		= '#000044'
config1. FontFace		= 'Verdana,Geneva,sans-serif'
config1. FontSize		= '8pt'		// E.g. '9pt' or '12px' - unit is mandatory
config1. FontWeight		= 'normal'	// 'normal' or 'bold';
config1. Height			= -300			// Tooltip height; 0 for automatic adaption to tooltip content, < 0 (e.g. -100) for a maximum for automatic adaption
config1. JumpHorz		= true		// false or true - jump horizontally to other side of mouse if tooltip would extend past clientarea boundary
config1. JumpVert		= true		// false or true - jump vertically		"
config1. Left			= false		// false or true - tooltip on the left of the mouse
config1. OffsetX			= 14		// Horizontal offset of left-top corner from mousepointer
config1. OffsetY			= 8			// Vertical offset
config1. Opacity			= 100		// Integer between 0 and 100 - opacity of tooltip in percent
config1. Padding			= 7			// Spacing between border and content
config1. Shadow			= true	// 8635699 	// false or true
config1. ShadowColor		= '#C0C0C0'
config1. ShadowWidth		= 3 //8635699 
config1. Sticky			= false		// false or true - fixate tip, ie. don't follow the mouse and don't hide on mouseout
config1. TextAlign		= 'left'	// 'left', 'right' or 'justify'
config1. Title			= ''		// Default title text applied to all tips (no default title: empty string '')
config1. TitleAlign		= 'left'	// 'left' or 'right' - text alignment inside the title bar
config1. TitleBgColor	= ''		// If empty string '', BorderColor will be used
config1. TitleFontColor	= '#000000'	// Color of title text - if '', BgColor (of tooltip body) will be used
config1. TitleFontFace	= ''		// If '' use FontFace (boldified)
config1. TitleFontSize	= '9pt'		// If '' use FontSize
config1. TitlePadding	= 1
config1. Width			= 0			// Tooltip width; 0 for automatic adaption to tooltip content; < -1 (e.g. -240) for a maximum width for that automatic adaption;
									// -1: tooltip width confined to the width required for the titlebar
//=======  END OF TOOLTIP config1//





function ddTip()
{
	dd_Tip(arguments, null);
}
function ddTagToTip()
{
	var t2t = dd_GetElt(arguments[0]);
	if(t2t)
		dd_Tip(arguments, t2t);
}
function ddUnTip()
{
	dd_OpReHref();
	if(dd_aV[DURATION] < 0 && (dd_iState & 0x2))
		dd_tDurt.Timer("dd_HideInit()", -dd_aV[DURATION], true);
	else if(!(dd_aV[STICKY] && (dd_iState & 0x2)))
		dd_HideInit();
}


var dd_aElt = new Array(10), // Container DIV, outer title & body DIVs, inner title & body TDs, closebutton SPAN, shadow DIVs, and IFRAME to cover windowed elements in IE
dd_aV = new Array(),	// Caches and enumerates config1 data for currently active tooltip
dd_sContent,			// Inner tooltip text or HTML
dd_t2t, dd_t2tDad,		// Tag converted to tip, and its DOM parent element
dd_musX, dd_musY,
dd_over,
ddx, ddy, dd_x, dd_y, dd_w, dd_h; // Position, width and height of currently displayed tooltip

function dd_Extension()
{
	dd_ExtCmdEnum();
	dd_aExt[dd_aExt.length] = this;
	return this;
}
function dd_SetTipPos(xPos, yPos)
{
	var css = dd_aElt[0].style;

	dd_x = ddx;
	dd_y = ddy;

if(xPos != 0) {
    xPos = ddx;
    yPos = ddy;
    var winW = 630, winH = 460;
    var attDiv = document.getElementById('ddTtDiV');
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
    var width=attDiv.offsetWidth;
    var height=attDiv.offsetHeight;
    var ie5=document.all&&document.getElementById;
    var ns6=document.getElementById&&!document.all;
    if (!ie5&&!ns6)
        window.open("","","width=width,height=height,scrollbars=1")
    else
    {
        var popupWinW =parseInt(xPos)+parseInt(width);
        var popupWinH =parseInt(yPos)+parseInt(height);
        
        //Bug 9322144 - BiDi handling in Popup Position
        if (isBiDi()) {
          if(parseInt(width) < xPos)
            xPos=(parseInt(xPos)-parseInt(width) + 10);//left
          else
            xPos=(parseInt(xPos)+5);//right
        }
        else
        {
        // End 9322144
          if(popupWinW >winW && parseInt(width) < xPos)
            xPos=(parseInt(xPos)-parseInt(width) + 10);//left
          else
            xPos=(parseInt(xPos)+5);//right
        }
        
        if(popupWinH > winH && (parseInt(height)+5) < yPos)
            yPos=(parseInt(yPos)-parseInt(height)-5);//top
    }
    dd_x = xPos;
    dd_y = yPos;
    
}
	css.left = xPos + "px";
	css.top = yPos + "px";
	if(dd_ie56)
	{
		var ifrm = dd_aElt[dd_aElt.length - 1];
		if(ifrm)
		{
			ifrm.style.left = css.left;
			ifrm.style.top = css.top;
		}
	}
}


function dd_HideInit()
{
  if(attAddAction == "AddAttachment") {
      if(document.getElementById("shorttextt") != null) {
          var textValue = document.getElementById("shorttextt").value;
          if(textValue != null && textValue.length != 0)  {
                  var confirm_box=confirm(AMcloseWindowConfirmation + "?");
                  if (confirm_box==false)    
                  { 
                     return;
                  }        
           }
       }
       if(document.getElementById("UrlInput") != null) {
          var urlValue = document.getElementById("UrlInput").value;
          if(urlValue != null && urlValue.length != 0)  {
                  var confirm_box=confirm(AMcloseWindowConfirmation + "?");
                  if (confirm_box==false)    
                  { 
                     return;
                  }        
           }
       }
       if(document.getElementById("FileInput") != null) {
          var fileValue = document.getElementById("FileInput").value;
          if(fileValue != null && fileValue.length != 0)  {
                  var confirm_box=confirm(AMcloseWindowConfirmation + "?");
                  if (confirm_box==false)    
                  { 
                     return;
                  }        
           }
       }     
  }
  
  //gteella -- 8648409
  if(AttUpdAction == "update") {
    
     var css = document.getElementById("WzTtDiV").style;
     var css3 = document.getElementById("ddTtDiV").style;
     
     if(document.getElementById("shorttextt") != null) {
        if(!(AttUpdTxt == document.getElementById("shorttextt").value))  {
                var confirm_box=confirm(AMcloseWindowConfirmation + "?");
                if (confirm_box==false)    
                { 
                   var css2 = document.getElementById("ddTtDiV").style;
                    return;
                }              
         }
     }
     if(document.getElementById("URLInput") != null) {
        if(!(AttUpdUrl == document.getElementById("URLInput").value))  {
                var confirm_box=confirm(AMcloseWindowConfirmation + "?");
                if (confirm_box==false)    
                { 
                   var css2 = document.getElementById("ddTtDiV").style;
                    return;
                }
         }
     }
     if(document.getElementById("FileInput") != null) {
        if(!("" == document.getElementById("FileInput").value))  {
                var confirm_box=confirm(AMcloseWindowConfirmation + "?");
                   var css2 = document.getElementById("ddTtDiV").style;
                if (confirm_box==false)    
                { 
                   var css2 = document.getElementById("ddTtDiV").style;
                    return;
                }
         }
     }
     
}
attAddAction = "";
AttUpdAction = "";
open_second=false;

	if(dd_iState)
	{
		dd_ExtCallFncs(0, "HideInit");
		dd_iState &= ~(0x4 | 0x8);
		if(dd_flagOpa && dd_aV[FADEOUT])
		{
			dd_tFade.EndTimer();
			if(dd_opa)
			{
				var n = Math.round(dd_aV[FADEOUT] / (dd_aV[FADEINTERVAL] * (dd_aV[OPACITY] / dd_opa)));
				dd_Fade(dd_opa, dd_opa, 0, n);
				return;
			}
		}
		dd_tHide.Timer("dd_Hide();", 1, false);
	}
}
function cancel_HideInit()
{
//gteella -- 8648409
attAddAction = "";
AttUpdAction = "";
open_second=false;

	if(dd_iState)
	{
		dd_ExtCallFncs(0, "HideInit");
		dd_iState &= ~(0x4 | 0x8);
		if(dd_flagOpa && dd_aV[FADEOUT])
		{
			dd_tFade.EndTimer();
			if(dd_opa)
			{
				var n = Math.round(dd_aV[FADEOUT] / (dd_aV[FADEINTERVAL] * (dd_aV[OPACITY] / dd_opa)));
				dd_Fade(dd_opa, dd_opa, 0, n);
				return;
			}
		}
		dd_tHide.Timer("dd_Hide();", 1, false);
	}
}
function dd_Hide()
{

	if(dd_db && dd_iState)
	{
		dd_OpReHref();
		if(dd_iState & 0x2)
		{
			dd_aElt[0].style.visibility = "hidden";
			dd_ExtCallFncs(0, "Hide");
		}
		dd_tShow.EndTimer();
		dd_tHide.EndTimer();
		dd_tDurt.EndTimer();
		dd_tFade.EndTimer();
		if(!dd_op && !dd_ie)
		{
			dd_tWaitMov.EndTimer();
			dd_bWait = false;
		}
		if(dd_aV[CLICKCLOSE] || dd_aV[CLICKSTICKY])
			dd_RemEvtFnc(document, "mouseup", dd_OnLClick);
		dd_ExtCallFncs(0, "Kill");
		// In case of a TagToTip tip, hide converted DOM node and
		// re-insert it into DOM
		if(dd_t2t && !dd_aV[COPYCONTENT])
			dd_UnEl2Tip();
		dd_iState = 0;
		dd_over = null;
		dd_ResetMainDiv();
		if(dd_aElt[dd_aElt.length - 1])
			dd_aElt[dd_aElt.length - 1].style.display = "none";
	}
}
function dd_GetElt(id)
{
	return(document.getElementById ? document.getElementById(id)
			: document.all ? document.all[id]
			: null);
}
function dd_GetDivW(el)
{
	return(el ? (el.offsetWidth || el.style.pixelWidth || 0) : 0);
}
function dd_GetDivH(el)
{
	return(el ? (el.offsetHeight || el.style.pixelHeight || 0) : 0);
}
function dd_GetScrollX()
{
	return(window.pageXOffset || (dd_db ? (dd_db.scrollLeft || 0) : 0));
}
function dd_GetScrollY()
{
	return(window.pageYOffset || (dd_db ? (dd_db.scrollTop || 0) : 0));
}
function dd_GetClientW()
{
	return dd_GetWndCliSiz("Width");
}
function dd_GetClientH()
{
	return dd_GetWndCliSiz("Height");
}
function dd_GetEvtX(e)
{
	return (e ? ((typeof(e.pageX) != dd_u) ? e.pageX : (e.clientX + dd_GetScrollX())) : 0);
}
function dd_GetEvtY(e)
{
	return (e ? ((typeof(e.pageY) != dd_u) ? e.pageY : (e.clientY + dd_GetScrollY())) : 0);
}
function dd_AddEvtFnc(el, sEvt, PFnc)
{
	if(el)
	{
		if(el.addEventListener)
			el.addEventListener(sEvt, PFnc, false);
		else
			el.attachEvent("on" + sEvt, PFnc);
	}
}
function dd_RemEvtFnc(el, sEvt, PFnc)
{
	if(el)
	{
		if(el.removeEventListener)
			el.removeEventListener(sEvt, PFnc, false);
		else
			el.detachEvent("on" + sEvt, PFnc);
	}
}
function dd_GetDad(el)
{
	return(el.parentNode || el.parentElement || el.offsetParent);
}
function dd_MovDomNode(el, dadFrom, dadTo)
{
	if(dadFrom)
		dadFrom.removeChild(el);
	if(dadTo)
		dadTo.appendChild(el);
}

//======================  PRIVATE  ===========================================//
var dd_aExt = new Array(),	// Array of extension objects

dd_db, dd_op, dd_ie, dd_ie56, dd_bBoxOld,	// Browser flags
dd_body,
dd_ovr_,				// HTML element the mouse is currently over
dd_flagOpa,				// Opacity support: 1=IE, 2=Khtml, 3=KHTML, 4=Moz, 5=W3C
dd_maxPosX, dd_maxPosY,
dd_iState = 0,			// Tooltip active |= 1, shown |= 2, move with mouse |= 4, exclusive |= 8
dd_opa,					// Currently applied opacity
dd_bJmpVert, dd_bJmpHorz,// Tip temporarily on other side of mouse
dd_elDeHref,			// The tag from which we've removed the href attribute
// Timer
dd_tShow = new Number(0), dd_tHide = new Number(0), dd_tDurt = new Number(0),
dd_tFade = new Number(0), dd_tWaitMov = new Number(0),
dd_bWait = false,
dd_u = "undefined";


function dd_Init()
{
	dd_MkCmdEnum();
	// Send old browsers instantly to hell
	if(!dd_Browser() || !dd_MkMainDiv())
		return;
	dd_IsW3cBox();
	dd_OpaSupport();
	//dd_AddEvtFnc(document, "mousemove", dd_Move);
	// In Debug mode we search for TagToTip() calls in order to notify
	// the user if they've forgotten to set the TagsToTip1 config1 flag
	if(TagsToTip1 || dd_Debug)
		dd_SetOnloadFnc();
	// Ensure the tip be hidden when the page unloads
	dd_AddEvtFnc(window, "unload", dd_Hide);
}
// Creates command names by translating config1 variable names to upper case
function dd_MkCmdEnum()
{
	var n = 0;
	for(var i in config1)
		eval("window." + i.toString().toUpperCase() + " = " + n++);
	dd_aV.length = n;
}
function dd_Browser()
{
	var n, nv, n6, w3c;

	n = navigator.userAgent.toLowerCase(),
	nv = navigator.appVersion;
	dd_op = (document.defaultView && typeof(eval("w" + "indow" + "." + "o" + "p" + "er" + "a")) != dd_u);
	dd_ie = n.indexOf("msie") != -1 && document.all && !dd_op;
	if(dd_ie)
	{
		var ieOld = (!document.compatMode || document.compatMode == "BackCompat");
		dd_db = !ieOld ? document.documentElement : (document.body || null);
		if(dd_db)
			dd_ie56 = parseFloat(nv.substring(nv.indexOf("MSIE") + 5)) >= 5.5
					&& typeof document.body.style.maxHeight == dd_u;
	}
	else
	{
		dd_db = document.documentElement || document.body ||
				(document.getElementsByTagName ? document.getElementsByTagName("body")[0]
				: null);
		if(!dd_op)
		{
			n6 = document.defaultView && typeof document.defaultView.getComputedStyle != dd_u;
			w3c = !n6 && document.getElementById;
		}
	}
	dd_body = (document.getElementsByTagName ? document.getElementsByTagName("body")[0]
				: (document.body || null));
	if(dd_ie || n6 || dd_op || w3c)
	{
		if(dd_body && dd_db)
		{
			if(document.attachEvent || document.addEventListener)
				return true;
		}
		else
			dd_Err("wz_tooltip.js must be included INSIDE the body section,"
					+ " immediately after the opening <body> tag.", false);
	}
	dd_db = null;
	return false;
}
function dd_MkMainDiv()
{
	// Create the tooltip DIV
	if(dd_body.insertAdjacentHTML)
		dd_body.insertAdjacentHTML("afterBegin", dd_MkMainDivHtm());
	else if(typeof dd_body.innerHTML != dd_u && document.createElement && dd_body.appendChild)
		dd_body.appendChild(dd_MkMainDivDom());
	if(window.dd_GetMainDivRefs /* FireFox Alzheimer */ && dd_GetMainDivRefs())
		return true;
	dd_db = null;
	return false;
}
function dd_MkMainDivHtm()
{
	return(
		'<div id="ddTtDiV" style="position:relative;z-index:10;"></div>' +
		(dd_ie56 ? ('<iframe id="ddTtIfRm" src="javascript:false" scrolling="no" frameborder="0" style="filter:Alpha(opacity=0);position:absolute;top:0px;left:0px;display:none;"></iframe>')
		: '')
	);
}
function dd_MkMainDivDom()
{
	var el = document.createElement("div");
	if(el)
		el.id = "ddTtDiV";
	return el;
}
function dd_GetMainDivRefs()
{
	dd_aElt[0] = dd_GetElt("ddTtDiV");
	if(dd_ie56 && dd_aElt[0])
	{
		dd_aElt[dd_aElt.length - 1] = dd_GetElt("ddTtIfRm");
		if(!dd_aElt[dd_aElt.length - 1])
			dd_aElt[0] = null;
	}
	if(dd_aElt[0])
	{
		var css = dd_aElt[0].style;

		css.visibility = "hidden";
		css.position = "absolute";
		css.overflow = "hidden";
		return true;
	}
	return false;
}
function dd_ResetMainDiv()
{
	dd_SetTipPos(0, 0);
	dd_aElt[0].innerHTML = "";
	dd_aElt[0].style.width = "0px";
	dd_h = 0;
}
function dd_IsW3cBox()
{
	var css = dd_aElt[0].style;

	css.padding = "10px";
	css.width = "40px";
	dd_bBoxOld = (dd_GetDivW(dd_aElt[0]) == 40);
	css.padding = "0px";
	dd_ResetMainDiv();
}
function dd_OpaSupport()
{
	var css = dd_body.style;

	dd_flagOpa = (typeof(css.KhtmlOpacity) != dd_u) ? 2
				: (typeof(css.KHTMLOpacity) != dd_u) ? 3
				: (typeof(css.MozOpacity) != dd_u) ? 4
				: (typeof(css.opacity) != dd_u) ? 5
				: (typeof(css.filter) != dd_u) ? 1
				: 0;
}
// Ported from http://dean.edwards.name/weblog/2006/06/again/
// (Dean Edwards et al.)
function dd_SetOnloadFnc()
{
	dd_AddEvtFnc(document, "DOMContentLoaded", dd_HideSrcTags);
	dd_AddEvtFnc(window, "load", dd_HideSrcTags);
	if(dd_body.attachEvent)
		dd_body.attachEvent("onreadystatechange",
			function() {
				if(dd_body.readyState == "complete")
					dd_HideSrcTags();
			} );
	if(/WebKit|KHTML/i.test(navigator.userAgent))
	{
		var t = setInterval(function() {
					if(/loaded|complete/.test(document.readyState))
					{
						clearInterval(t);
						dd_HideSrcTags();
					}
				}, 10);
	}
}
function dd_HideSrcTags()
{
	if(!window.dd_HideSrcTags || window.dd_HideSrcTags.done)
		return;
	window.dd_HideSrcTags.done = true;
	if(!dd_HideSrcTagsRecurs(dd_body))
		dd_Err("There are HTML elements to be converted to tooltips.\nIf you"
				+ " want these HTML elements to be automatically hidden, you"
				+ " must edit dd_tooltip.js, and set TagsToTip1 in the global"
				+ " tooltip config1uration to true.", true);
}
function dd_HideSrcTagsRecurs(dad)
{
	var ovr, asT2t;
	// Walk the DOM tree for tags that have an onmouseover or onclick attribute
	// containing a TagToTip('...') call.
	// (.childNodes first since .children is bugous in Safari)
	var a = dad.childNodes || dad.children || null;

	for(var i = a ? a.length : 0; i;)
	{--i;
		if(!dd_HideSrcTagsRecurs(a[i]))
			return false;
		ovr = a[i].getAttribute ? (a[i].getAttribute("onmouseover") || a[i].getAttribute("onclick"))
				: (typeof a[i].onmouseover == "function") ? (a[i].onmouseover || a[i].onclick)
				: null;
		if(ovr)
		{
			asT2t = ovr.toString().match(/TagToTip\s*\(\s*'[^'.]+'\s*[\),]/);
			if(asT2t && asT2t.length)
			{
				if(!dd_HideSrcTag(asT2t[0]))
					return false;
			}
		}
	}
	return true;
}
function dd_HideSrcTag(sT2t)
{
	var id, el;

	// The ID passed to the found TagToTip() call identifies an HTML element
	// to be converted to a tooltip, so hide that element
	id = sT2t.replace(/.+'([^'.]+)'.+/, "$1");
	el = dd_GetElt(id);
	if(el)
	{
		if(dd_Debug && !TagsToTip1)
			return false;
		else
			el.style.display = "none";
	}
	else
		dd_Err("Invalid ID\n'" + id + "'\npassed to TagToTip()."
				+ " There exists no HTML element with that ID.", true);
	return true;
}
function dd_Tip(arg, t2t)
{
	if(!dd_db || (dd_iState & 0x8))
		return;
	//if(dd_iState)
		//dd_Hide();
	if(!dd_Enabled)
		return;
	dd_t2t = t2t;
	if(!dd_ReadCmds(arg))
		return;
	dd_iState = 0x1 | 0x4;
  
	dd_Adaptconfig11();
  
	dd_MkTipContent(arg);
  
	dd_MkTipSubDivs();
  
	dd_FormatTip();
  
	dd_bJmpVert = false;
	dd_bJmpHorz = false;
	dd_maxPosX = dd_GetClientW() + dd_GetScrollX() - dd_w - 1;
	dd_maxPosY = dd_GetClientH() + dd_GetScrollY() - dd_h - 1;
	dd_Adaptconfig12();
  
	// Ensure the tip be shown and positioned before the first onmousemove
	dd_OverInit();
  
	dd_ShowInit();
  
	dd_Move();
  
}
function dd_ReadCmds(a)
{
	var i;

	// First load the global config1 values, to initialize also values
	// for which no command is passed
	i = 0;
	for(var j in config1)
		dd_aV[i++] = config1[j];
	// Then replace each cached config1 value for which a command is
	// passed (ensure the # of command args plus value args be even)
	if(a.length & 1)
	{
		for(i = a.length - 1; i > 0; i -= 2)
			dd_aV[a[i - 1]] = a[i];
		return true;
	}
	dd_Err("Incorrect call of Tip() or TagToTip().\n"
			+ "Each command must be followed by a value.", true);
	return false;
}
function dd_Adaptconfig11()
{
	dd_ExtCallFncs(0, "Loadconfig1");
	// Inherit unspecified title formattings from body
	if(!dd_aV[TITLEBGCOLOR].length)
		dd_aV[TITLEBGCOLOR] = dd_aV[BORDERCOLOR];
	if(!dd_aV[TITLEFONTCOLOR].length)
		dd_aV[TITLEFONTCOLOR] = dd_aV[BGCOLOR];
	if(!dd_aV[TITLEFONTFACE].length)
		dd_aV[TITLEFONTFACE] = dd_aV[FONTFACE];
	if(!dd_aV[TITLEFONTSIZE].length)
		dd_aV[TITLEFONTSIZE] = dd_aV[FONTSIZE];
	if(dd_aV[CLOSEBTN])
	{
		// Use title colours for non-specified closebutton colours
		if(!dd_aV[CLOSEBTNCOLORS])
			dd_aV[CLOSEBTNCOLORS] = new Array("", "", "", "");
		for(var i = 4; i;)
		{--i;
			if(!dd_aV[CLOSEBTNCOLORS][i].length)
				dd_aV[CLOSEBTNCOLORS][i] = (i & 1) ? dd_aV[TITLEFONTCOLOR] : dd_aV[TITLEBGCOLOR];
		}
		// Enforce titlebar be shown
		if(!dd_aV[TITLE].length)
			dd_aV[TITLE] = " ";
	}
	// Circumvents broken display of images and fade-in flicker in Geckos < 1.8
	if(dd_aV[OPACITY] == 100 && typeof dd_aElt[0].style.MozOpacity != dd_u && !Array.every)
		dd_aV[OPACITY] = 99;
	// Smartly shorten the delay for fade-in tooltips
	if(dd_aV[FADEIN] && dd_flagOpa && dd_aV[DELAY] > 100)
		dd_aV[DELAY] = Math.max(dd_aV[DELAY] - dd_aV[FADEIN], 100);
}
function dd_Adaptconfig12()
{
	if(dd_aV[CENTERMOUSE])
	{
		dd_aV[OFFSETX] -= ((dd_w - (dd_aV[SHADOW] ? dd_aV[SHADOWWIDTH] : 0)) >> 1);
		dd_aV[JUMPHORZ] = false;
	}
}
// Expose content globally so extensions can modify it
function dd_MkTipContent(a)
{
	if(dd_t2t)
	{
		if(dd_aV[COPYCONTENT])
			dd_sContent = dd_t2t.innerHTML;
		else
			dd_sContent = "";
	}
	else
		dd_sContent = a[0];
	dd_ExtCallFncs(0, "CreateContentString");
}
var iii=0
function dd_MkTipSubDivs()
{
	var sCss = 'position:relative;margin:0px;padding:0px;border-width:0px;left:0px;top:0px;line-height:normal;width:auto;';
		var sCss1 = 'position:relative;margin:0px;padding:0px;border-width:0px;left:0px;top:0px;line-height:normal;width:auto;background-image:url(/OA_HTML/cabo/images/swan/headingBarBg.gif);';
	var sTbTrTd = ' cellspacing="0" cellpadding="0" border="0" style="' + sCss + '"><tbody style="' + sCss + '"><tr  style="' + sCss+'" ><td ';
  var sTbTrTd1 = ' cellspacing="0" cellpadding="0" border="0" style="' + sCss1 + '"><tbody style="' + sCss1 + '"><tr  style="' + sCss1+'" ><td ';
  //gteella - 8474177
  var sTbTrTd2 = ' cellspacing="0" cellpadding="0" border="0" style="' + sCss + '"><tbody style="' + sCss + '"><tr  style="' + sCss+'" ><td onmousedown="dragStart(event,\'ddTtDiV\')"';

	dd_aElt[0].style.width = dd_GetClientW() + "px";

  if (AreadingStyle == 1)   {  
    dd_aElt[0].innerHTML =
      (''
      + (dd_aV[TITLE].length ?
        ('<div id="ddTiTl" style="position:relative;z-index:1;">'
        + '<table id="ddTiTlTb"' + sTbTrTd2 + 'id="ddTiTlI" style="' + sCss1 + '"><h1 class=x75>'
        + dd_aV[TITLE]
        + '</h1></td>'
        + (dd_aV[CLOSEBTN] ?
          ('<td align="right" style="' + sCss1
          + 'text-align:right;">'
          + '<span id="ddClOsE" style="position:relative;left:2px;padding-left:2px;padding-right:2px;'
          + 'cursor:' + (dd_ie ? 'hand' : 'pointer')
          + ';" onclick="dd_HideInit()">'
          + '<img src=\"/OA_MEDIA/popup_close.gif\" />'
          + '</span></td>')
          : '')
        + '</tr></tbody></table></div>')
        : '')
      + '<div id="ddBoDy" style="position:relative;z-index:0;">'
      + '<table' + sTbTrTd + 'id="ddBoDyI" style="' + sCss + '">'
      + dd_sContent
      + '</td></tr></tbody></table></div>'
      + (dd_aV[SHADOW]
        ? ('<div id="ddTtShDwR" style="position:absolute;overflow:hidden;"></div>'
          + '<div id="ddTtShDwB" style="position:relative;overflow:hidden;"></div>')
        : '')
      );
  }
  else {
    dd_aElt[0].innerHTML =
      (''
      + (dd_aV[TITLE].length ?
        ('<div id="ddTiTl" style="position:relative;z-index:1;">'
        + '<table id="ddTiTlTb"' + sTbTrTd2 + 'id="ddTiTlI" style="' + sCss1 + '"><h1 class=x75>'
        + dd_aV[TITLE]
        + '</h1></td>'
        + (dd_aV[CLOSEBTN] ?
          ('<td align="left" style="' + sCss1
          + 'text-align:left;">'
          + '<span id="ddClOsE" style="position:relative;left:2px;padding-left:2px;padding-right:2px;'
          + 'cursor:' + (dd_ie ? 'hand' : 'pointer')
          + ';" onclick="dd_HideInit()">'
          + '<img src=\"/OA_MEDIA/popup_close.gif\" />'
          + '</span></td>')
          : '')
        + '</tr></tbody></table></div>')
        : '')
      + '<div id="ddBoDy" style="position:relative;z-index:0;">'
      + '<table' + sTbTrTd + 'id="ddBoDyI" style="' + sCss + '">'
      + dd_sContent
      + '</td></tr></tbody></table></div>'
      + (dd_aV[SHADOW]
        ? ('<div id="ddTtShDwR" style="position:absolute;overflow:hidden;"></div>'
          + '<div id="ddTtShDwB" style="position:relative;overflow:hidden;"></div>')
        : '')
      );
  }
  
	dd_GetSubDivRefs();

	// Convert DOM node to tip
	if(dd_t2t && !dd_aV[COPYCONTENT])
		dd_El2Tip();

	dd_ExtCallFncs(0, "SubDivsCreated");
}
function dd_GetSubDivRefs()
{
	var aId = new Array("ddTiTl", "ddTiTlTb", "ddTiTlI", "ddClOsE", "ddBoDy", "ddBoDyI", "ddTtShDwB", "ddTtShDwR");

	for(var i = aId.length; i; --i)
		dd_aElt[i] = dd_GetElt(aId[i - 1]);
}
function dd_FormatTip()
{
	var css, w, h, pad = dd_aV[PADDING], padT, wBrd = dd_aV[BORDERWIDTH],
	iOffY, iOffSh, iAdd = (pad + wBrd) << 1;

	//--------- Title DIV ----------
	if(dd_aV[TITLE].length)
	{
		padT = dd_aV[TITLEPADDING];
		css = dd_aElt[1].style;
		css.background = dd_aV[TITLEBGCOLOR];
		css.paddingTop = css.paddingBottom = padT + "px";
		css.paddingLeft = css.paddingRight = (padT + 2) + "px";
		css = dd_aElt[3].style;
		css.color = dd_aV[TITLEFONTCOLOR];
		if(dd_aV[WIDTH] == -1)
			css.whiteSpace = "nowrap";
		css.fontFamily = dd_aV[TITLEFONTFACE];
		css.fontSize = dd_aV[TITLEFONTSIZE];
		css.fontWeight = "bold";
		css.textAlign = dd_aV[TITLEALIGN];
		// Close button DIV
		if(dd_aElt[4])
		{
			css = dd_aElt[4].style;
			//css.background = dd_aV[CLOSEBTNCOLORS][0];
			css.color = dd_aV[CLOSEBTNCOLORS][1];
			css.fontFamily = dd_aV[TITLEFONTFACE];
			css.fontSize = dd_aV[TITLEFONTSIZE];
			css.fontWeight = "bold";
		}
		if(dd_aV[WIDTH] > 0)
			dd_w = dd_aV[WIDTH];
		else
		{
			dd_w = dd_GetDivW(dd_aElt[3]) + dd_GetDivW(dd_aElt[4]);
			// Some spacing between title DIV and closebutton
			if(dd_aElt[4])
				dd_w += pad;
			// Restrict auto width to max width
			if(dd_aV[WIDTH] < -1 && dd_w > -dd_aV[WIDTH])
				dd_w = -dd_aV[WIDTH];
		}
		// Ensure the top border of the body DIV be covered by the title DIV
		iOffY = -wBrd;
	}
	else
	{
		dd_w = 0;
		iOffY = 0;
	}

	//-------- Body DIV ------------
	css = dd_aElt[5].style;
	css.top = iOffY + "px";
	if(wBrd)
	{
		css.borderColor = dd_aV[BORDERCOLOR];
		css.borderStyle = dd_aV[BORDERSTYLE];
		css.borderWidth = wBrd + "px";
	}
	if(dd_aV[BGCOLOR].length)
	css.background = dd_aV[BGCOLOR];
	if(dd_aV[BGIMG].length)
		css.backgroundImage = "url(" + dd_aV[BGIMG] + ")";
	css.padding = pad + "px";
	css.textAlign = dd_aV[TEXTALIGN];
	if(dd_aV[HEIGHT])
	{
		css.overflow = "auto";
		if(dd_aV[HEIGHT] > 0)
			css.height = (dd_aV[HEIGHT] + iAdd) + "px";
		else
			dd_h = iAdd - dd_aV[HEIGHT];
	}
	// TD inside body DIV
	css = dd_aElt[6].style;
	css.color = dd_aV[FONTCOLOR];
	css.fontFamily = dd_aV[FONTFACE];
	css.fontSize = dd_aV[FONTSIZE];
	css.fontWeight = dd_aV[FONTWEIGHT];
	css.textAlign = dd_aV[TEXTALIGN];
	if(dd_aV[WIDTH] > 0)
		w = dd_aV[WIDTH];
	// Width like title (if existent)
	else if(dd_aV[WIDTH] == -1 && dd_w)
		w = dd_w;
	else
	{
		// Measure width of the body's inner TD, as some browsers would expand
		// the container and outer body DIV to 100%
		w = dd_GetDivW(dd_aElt[6]);
		// Restrict auto width to max width
		if(dd_aV[WIDTH] < -1 && w > -dd_aV[WIDTH])
			w = -dd_aV[WIDTH];
	}
	if(w > dd_w)
		dd_w = w;
	dd_w += iAdd;

	//--------- Shadow DIVs ------------
	if(dd_aV[SHADOW])
	{
		dd_w += dd_aV[SHADOWWIDTH];
		iOffSh = Math.floor((dd_aV[SHADOWWIDTH] * 4) / 3);
		// Bottom shadow
		css = dd_aElt[7].style;
		css.top = iOffY + "px";
		css.left = iOffSh + "px";
		css.width = (dd_w - iOffSh - dd_aV[SHADOWWIDTH]) + "px";
		css.height = dd_aV[SHADOWWIDTH] + "px";
		css.background = dd_aV[SHADOWCOLOR];
		// Right shadow
		css = dd_aElt[8].style;
		css.top = iOffSh + "px";
		css.left = (dd_w - dd_aV[SHADOWWIDTH]) + "px";
		css.width = dd_aV[SHADOWWIDTH] + "px";
		css.background = dd_aV[SHADOWCOLOR];
	}
	else
		iOffSh = 0;

	//-------- Container DIV -------
	dd_SetTipOpa(dd_aV[FADEIN] ? 0 : dd_aV[OPACITY]);
	dd_FixSize(iOffY, iOffSh);
}
// Fixate the size so it can't dynamically change while the tooltip is moving.
function dd_FixSize(iOffY, iOffSh)
{
	var wIn, wOut, h, add, pad = dd_aV[PADDING], wBrd = dd_aV[BORDERWIDTH], i;

	dd_aElt[0].style.width = dd_w + "px";
	dd_aElt[0].style.pixelWidth = dd_w;
	wOut = dd_w - ((dd_aV[SHADOW]) ? dd_aV[SHADOWWIDTH] : 0);
	// Body
	wIn = wOut;
	if(!dd_bBoxOld)
		wIn -= (pad + wBrd) << 1;
	dd_aElt[5].style.width = wIn + "px";
	// Title
	if(dd_aElt[1])
	{
		wIn = wOut - ((dd_aV[TITLEPADDING] + 2) << 1);
		if(!dd_bBoxOld)
			wOut = wIn;
		dd_aElt[1].style.width = wOut + "px";
		dd_aElt[2].style.width = wIn + "px";
	}
	// Max height specified
	if(dd_h)
	{
		h = dd_GetDivH(dd_aElt[5]);
		if(h > dd_h)
		{
			if(!dd_bBoxOld)
				dd_h -= (pad + wBrd) << 1;
			dd_aElt[5].style.height = dd_h + "px";
		}
	}
	dd_h = dd_GetDivH(dd_aElt[0]) + iOffY;
	// Right shadow
	if(dd_aElt[8])
		dd_aElt[8].style.height = (dd_h - iOffSh) + "px";
	i = dd_aElt.length - 1;
	if(dd_aElt[i])
	{
		dd_aElt[i].style.width = dd_w + "px";
		dd_aElt[i].style.height = dd_h + "px";
	}
}
function dd_DeAlt(el)
{
	var aKid;

	if(el)
	{
		if(el.alt)
			el.alt = "";
		if(el.title)
			el.title = "";
		aKid = el.childNodes || el.children || null;
		if(aKid)
		{
			for(var i = aKid.length; i;)
				dd_DeAlt(aKid[--i]);
		}
	}
}
// This hack removes the native tooltips over links in Opera
function dd_OpDeHref(el)
{
	if(!dd_op)
		return;
	if(dd_elDeHref)
		dd_OpReHref();
	while(el)
	{
		if(el.hasAttribute && el.hasAttribute("href"))
		{
			el.t_href = el.getAttribute("href");
			el.t_stats = window.status;
			el.removeAttribute("href");
			el.style.cursor = "hand";
			dd_AddEvtFnc(el, "mousedown", dd_OpReHref);
			window.status = el.t_href;
			dd_elDeHref = el;
			break;
		}
		el = dd_GetDad(el);
	}
}
function dd_OpReHref()
{
	if(dd_elDeHref)
	{
		dd_elDeHref.setAttribute("href", dd_elDeHref.t_href);
		dd_RemEvtFnc(dd_elDeHref, "mousedown", dd_OpReHref);
		window.status = dd_elDeHref.t_stats;
		dd_elDeHref = null;
	}
}
function dd_El2Tip()
{

	var css = dd_t2t.style;

	// Store previous positioning
	dd_t2t.t_cp = css.position;
	dd_t2t.t_cl = css.left;
	dd_t2t.t_ct = css.top;
	dd_t2t.t_cd = css.display;
	// Store the tag's parent element so we can restore that DOM branch
	// when the tooltip is being hidden
	dd_t2tDad = dd_GetDad(dd_t2t);
	dd_MovDomNode(dd_t2t, dd_t2tDad, dd_aElt[6]);
	css.display = "block";
	css.position = "static";
	css.left = css.top = css.marginLeft = css.marginTop = "0px";
}
function dd_UnEl2Tip()
{
	// Restore positioning and display
	var css = dd_t2t.style;

	css.display = dd_t2t.t_cd;
	dd_MovDomNode(dd_t2t, dd_GetDad(dd_t2t), dd_t2tDad);
	css.position = dd_t2t.t_cp;
	css.left = dd_t2t.t_cl;
	css.top = dd_t2t.t_ct;
	dd_t2tDad = null;
}
function dd_OverInit()
{
	if(window.event)
		dd_over = window.event.target || window.event.srcElement;
	else
		dd_over = dd_ovr_;
	dd_DeAlt(dd_over);
	dd_OpDeHref(dd_over);
}
function dd_ShowInit()
{
	dd_tShow.Timer("dd_Show()", dd_aV[DELAY], true);
	if(dd_aV[CLICKCLOSE] || dd_aV[CLICKSTICKY])
		dd_AddEvtFnc(document, "mouseup", dd_OnLClick);
}
function dd_Show()
{
	var css = dd_aElt[0].style;
        var browser2 = new Browser();
	// Override the z-index of the topmost dd_dragdrop.js D&D item
	//gteella - ZIndex - 8574473
        if(browser2.isIE) {
            css.zIndex = Math.max((window.dd && dd.z) ? (dd.z + 2) : 0, 1020);//8970471 -- previous value is css.zIndex = 15 and modified to 1020;
        } else {
            css.zIndex = Math.max((window.dd && dd.z) ? (dd.z + 2) : 0, 1020);
        }
        //css.zIndex = Math.max((window.dd && dd.z) ? (dd.z + 2) : 0, 1010);
	if(dd_aV[STICKY] || !dd_aV[FOLLOWMOUSE])
		dd_iState &= ~0x4;
	if(dd_aV[EXCLUSIVE])
		dd_iState |= 0x8;
	if(dd_aV[DURATION] > 0)
		dd_tDurt.Timer("dd_HideInit()", dd_aV[DURATION], true);
	dd_ExtCallFncs(0, "Show")
	css.visibility = "visible";
	dd_iState |= 0x2;
	if(dd_aV[FADEIN])
		dd_Fade(0, 0, dd_aV[OPACITY], Math.round(dd_aV[FADEIN] / dd_aV[FADEINTERVAL]));
	dd_ShowIfrm();
}
function dd_ShowIfrm()
{
	if(dd_ie56)
	{
		var ifrm = dd_aElt[dd_aElt.length - 1];
		if(ifrm)
		{
			var css = ifrm.style;
			css.zIndex = dd_aElt[0].style.zIndex - 1;
			css.display = "block";
		}
	}
}
function dd_Move(e)
{
	if(e)
		dd_ovr_ = e.target || e.srcElement;
	e = e || window.event;
	if(e)
	{
		dd_musX = dd_GetEvtX(e);
		dd_musY = dd_GetEvtY(e);
	}
	if(dd_iState & 0x4)
	{
		// Prevent jam of mousemove events
		if(!dd_op && !dd_ie)
		{
			if(dd_bWait)
				return;
			dd_bWait = true;
			dd_tWaitMov.Timer("dd_bWait = false;", 1, true);
		}
		if(dd_aV[FIX])
		{
			dd_iState &= ~0x4;
			dd_PosFix();
		}
		else if(!dd_ExtCallFncs(e, "MoveBefore"))
			dd_SetTipPos(dd_Pos(0), dd_Pos(1));
		dd_ExtCallFncs([dd_musX, dd_musY], "MoveAfter")
	}
}
function dd_Pos(iDim)
{
	var iX, bJmpMod, cmdAlt, cmdOff, cx, iMax, iScrl, iMus, bJmp;

	// Map values according to dimension to calculate
	if(iDim)
	{
		bJmpMod = dd_aV[JUMPVERT];
		cmdAlt = ABOVE;
		cmdOff = OFFSETY;
		cx = dd_h;
		iMax = dd_maxPosY;
		iScrl = dd_GetScrollY();
		iMus = dd_musY;
		bJmp = dd_bJmpVert;
	}
	else
	{
		bJmpMod = dd_aV[JUMPHORZ];
		cmdAlt = LEFT;
		cmdOff = OFFSETX;
		cx = dd_w;
		iMax = dd_maxPosX;
		iScrl = dd_GetScrollX();
		iMus = dd_musX;
		bJmp = dd_bJmpHorz;
	}
	if(bJmpMod)
	{
		if(dd_aV[cmdAlt] && (!bJmp || dd_CalcPosAlt(iDim) >= iScrl + 16))
			iX = dd_PosAlt(iDim);
		else if(!dd_aV[cmdAlt] && bJmp && dd_CalcPosDef(iDim) > iMax - 16)
			iX = dd_PosAlt(iDim);
		else
			iX = dd_PosDef(iDim);
	}
	else
	{
		iX = iMus;
		if(dd_aV[cmdAlt])
			iX -= cx + dd_aV[cmdOff] - (dd_aV[SHADOW] ? dd_aV[SHADOWWIDTH] : 0);
		else
			iX += dd_aV[cmdOff];
	}
	// Prevent tip from extending past clientarea boundary
	if(iX > iMax)
		iX = bJmpMod ? dd_PosAlt(iDim) : iMax;
	// In case of insufficient space on both sides, ensure the left/upper part
	// of the tip be visible
	if(iX < iScrl)
		iX = bJmpMod ? dd_PosDef(iDim) : iScrl;
	return iX;
}
function dd_PosDef(iDim)
{
	if(iDim)
		dd_bJmpVert = dd_aV[ABOVE];
	else
		dd_bJmpHorz = dd_aV[LEFT];
	return dd_CalcPosDef(iDim);
}
function dd_PosAlt(iDim)
{
	if(iDim)
		dd_bJmpVert = !dd_aV[ABOVE];
	else
		dd_bJmpHorz = !dd_aV[LEFT];
	return dd_CalcPosAlt(iDim);
}
function dd_CalcPosDef(iDim)
{
	return iDim ? (dd_musY + dd_aV[OFFSETY]) : (dd_musX + dd_aV[OFFSETX]);
}
function dd_CalcPosAlt(iDim)
{
	var cmdOff = iDim ? OFFSETY : OFFSETX;
	var dx = dd_aV[cmdOff] - (dd_aV[SHADOW] ? dd_aV[SHADOWWIDTH] : 0);
	if(dd_aV[cmdOff] > 0 && dx <= 0)
		dx = 1;
	return((iDim ? (dd_musY - dd_h) : (dd_musX - dd_w)) - dx);
}
function dd_PosFix()
{
	var iX, iY;

	if(typeof(dd_aV[FIX][0]) == "number")
	{
		iX = dd_aV[FIX][0];
		iY = dd_aV[FIX][1];
	}
	else
	{
		if(typeof(dd_aV[FIX][0]) == "string")
			el = dd_GetElt(dd_aV[FIX][0]);
		// First slot in array is direct reference to HTML element
		else
			el = dd_aV[FIX][0];
		iX = dd_aV[FIX][1];
		iY = dd_aV[FIX][2];
		// By default, vert pos is related to bottom edge of HTML element
		if(!dd_aV[ABOVE] && el)
			iY += dd_GetDivH(el);
		for(; el; el = el.offsetParent)
		{
			iX += el.offsetLeft || 0;
			iY += el.offsetTop || 0;
		}
	}
	// For a fixed tip positioned above the mouse, use the bottom edge as anchor
	// (recommended by Christophe Rebeschini, 31.1.2008)
	if(dd_aV[ABOVE])
		iY -= dd_h;
	dd_SetTipPos(iX, iY);
}
function dd_Fade(a, now, z, n)
{
	if(n)
	{
		now += Math.round((z - now) / n);
		if((z > a) ? (now >= z) : (now <= z))
			now = z;
		else
			dd_tFade.Timer(
				"dd_Fade("
				+ a + "," + now + "," + z + "," + (n - 1)
				+ ")",
				dd_aV[FADEINTERVAL],
				true
			);
	}
	now ? dd_SetTipOpa(now) : dd_Hide();
}
function dd_SetTipOpa(opa)
{
	// To circumvent the opacity nesting flaws of IE, we set the opacity
	// for each sub-DIV separately, rather than for the container DIV.
	dd_SetOpa(dd_aElt[5], opa);
	if(dd_aElt[1])
		dd_SetOpa(dd_aElt[1], opa);
	if(dd_aV[SHADOW])
	{
		opa = Math.round(opa * 0.8);
		dd_SetOpa(dd_aElt[7], opa);
		dd_SetOpa(dd_aElt[8], opa);
	}
}
function dd_OnCloseBtnOver(iOver)
{
	var css = dd_aElt[4].style;

	iOver <<= 1;
	css.background = dd_aV[CLOSEBTNCOLORS][iOver];
	css.color = dd_aV[CLOSEBTNCOLORS][iOver + 1];
}
function dd_OnLClick(e)
{
	//  Ignore right-clicks
	e = e || window.event;
	if(!((e.button && e.button & 2) || (e.which && e.which == 3)))
	{
		if(dd_aV[CLICKSTICKY] && (dd_iState & 0x4))
		{
			dd_aV[STICKY] = true;
			dd_iState &= ~0x4;
		}
		else if(dd_aV[CLICKCLOSE])
			dd_HideInit();
	}
}
function dd_Int(x)
{
	var y;

	return(isNaN(y = parseInt(x)) ? 0 : y);
}
Number.prototype.Timer = function(s, iT, bUrge)
{
	if(!this.value || bUrge)
		this.value = window.setTimeout(s, iT);
}
Number.prototype.EndTimer = function()
{
	if(this.value)
	{
		window.clearTimeout(this.value);
		this.value = 0;
	}
}
function dd_GetWndCliSiz(s)
{
	var db, y = window["inner" + s], sC = "client" + s, sN = "number";
	if(typeof y == sN)
	{
		var y2;
		return(
			// Gecko or Opera with scrollbar
			// ... quirks mode
			((db = document.body) && typeof(y2 = db[sC]) == sN && y2 &&  y2 <= y) ? y2 
			// ... strict mode
			: ((db = document.documentElement) && typeof(y2 = db[sC]) == sN && y2 && y2 <= y) ? y2
			// No scrollbar, or clientarea size == 0, or other browser (KHTML etc.)
			: y
		);
	}
	// IE
	return(
		// document.documentElement.client+s functional, returns > 0
		((db = document.documentElement) && (y = db[sC])) ? y
		// ... not functional, in which case document.body.client+s 
		// is the clientarea size, fortunately
		: document.body[sC]
	);
}
function dd_SetOpa(el, opa)
{
	var css = el.style;

	dd_opa = opa;
	if(dd_flagOpa == 1)
	{
		if(opa < 100)
		{
			// Hacks for bugs of IE:
			// 1.) Once a CSS filter has been applied, fonts are no longer
			// anti-aliased, so we store the previous 'non-filter' to be
			// able to restore it
			if(typeof(el.filtNo) == dd_u)
				el.filtNo = css.filter;
			// 2.) A DIV cannot be made visible in a single step if an
			// opacity < 100 has been applied while the DIV was hidden
			var bVis = css.visibility != "hidden";
			// 3.) In IE6, applying an opacity < 100 has no effect if the
			//	   element has no layout (position, size, zoom, ...)
			css.zoom = "100%";
			if(!bVis)
				css.visibility = "visible";
			css.filter = "alpha(opacity=" + opa + ")";
			if(!bVis)
				css.visibility = "hidden";
		}
		else if(typeof(el.filtNo) != dd_u)
			// Restore 'non-filter'
			css.filter = el.filtNo;
	}
	else
	{
		opa /= 100.0;
		switch(dd_flagOpa)
		{
		case 2:
			css.KhtmlOpacity = opa; break;
		case 3:
			css.KHTMLOpacity = opa; break;
		case 4:
			css.MozOpacity = opa; break;
		case 5:
			css.opacity = opa; break;
		}
	}
}
function dd_Err(sErr, bIfDebug)
{
	if(dd_Debug || !bIfDebug){}
		//alert("Tooltip Script Error Message:\n\n" + sErr);
}

//============  EXTENSION (PLUGIN) MANAGER  ===============//
function dd_ExtCmdEnum()
{
	var s;

	// Add new command(s) to the commands enum
	for(var i in config1)
	{
		s = "window." + i.toString().toUpperCase();
		if(eval("typeof(" + s + ") == dd_u"))
		{
			eval(s + " = " + dd_aV.length);
			dd_aV[dd_aV.length] = null;
		}
	}
}
function dd_ExtCallFncs(arg, sFnc)
{
	var b = false;
	for(var i = dd_aExt.length; i;)
	{--i;
		var fnc = dd_aExt[i]["On" + sFnc];
		// Call the method the extension has defined for this event
		if(fnc && fnc(arg))
			b = true;
	}
	return b;
}



function Browser() {

var ua, s, i;

this.isIE = false;
this.isNS = false;
this.version = null;

ua = navigator.userAgent;

s = "MSIE";
if ((i = ua.indexOf(s)) >= 0) {
this.isIE = true;
this.version = parseFloat(ua.substr(i + s.length));
return;
}

s = "Netscape6/";
if ((i = ua.indexOf(s)) >= 0) {
this.isNS = true;
this.version = parseFloat(ua.substr(i + s.length));
return;
}

// Treat any other "Gecko" browser as NS 6.1.

s = "Gecko";
if ((i = ua.indexOf(s)) >= 0) {
this.isNS = true;
this.version = 6.1;
return;
}
}

var browser = new Browser();

// Global object to hold drag information.

var dragObj = new Object();
dragObj.zIndex = 0;

function dragStart(event, id) {

var el;
var x, y;

// If an element id was given, find it. Otherwise use the element being
// clicked on.

if (id)
dragObj.elNode = document.getElementById(id);
else {
if (browser.isIE)
dragObj.elNode = window.event.srcElement;
if (browser.isNS)
dragObj.elNode = event.target;

// If this is a text node, use its parent element.

if (dragObj.elNode.nodeType == 3)
dragObj.elNode = dragObj.elNode.parentNode;
}

// Get cursor position with respect to the page.

if (browser.isIE) {
x = window.event.clientX + document.documentElement.scrollLeft
+ document.body.scrollLeft;
y = window.event.clientY + document.documentElement.scrollTop
+ document.body.scrollTop;
}
if (browser.isNS) {
x = event.clientX + window.scrollX;
y = event.clientY + window.scrollY;
}

// Save starting positions of cursor and element.

dragObj.cursorStartX = x;
dragObj.cursorStartY = y;
dragObj.elStartLeft = parseInt(dragObj.elNode.style.left, 10);
dragObj.elStartTop = parseInt(dragObj.elNode.style.top, 10);

if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
if (isNaN(dragObj.elStartTop)) dragObj.elStartTop = 0;

// Update element's z-index.


// Capture mousemove and mouseup events on the page.

if (browser.isIE) {
document.attachEvent("onmousemove", dragGo);
document.attachEvent("onmouseup", dragStop);
window.event.cancelBubble = true;
window.event.returnValue = false;
}
if (browser.isNS) {
document.addEventListener("mousemove", dragGo, true);
document.addEventListener("mouseup", dragStop, true);
event.preventDefault();
}
}

function dragGo(event) {

var x, y;

// Get cursor position with respect to the page.

if (browser.isIE) {
x = window.event.clientX + document.documentElement.scrollLeft
+ document.body.scrollLeft;
y = window.event.clientY + document.documentElement.scrollTop
+ document.body.scrollTop;
}
if (browser.isNS) {
x = event.clientX + window.scrollX;
y = event.clientY + window.scrollY;
}

// Move drag element by the same amount the cursor has moved.

dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
dragObj.elNode.style.top = (dragObj.elStartTop + y - dragObj.cursorStartY) + "px";

if (browser.isIE) {
window.event.cancelBubble = true;
window.event.returnValue = false;
}
if (browser.isNS)
event.preventDefault();
}

function dragStop(event) {

// Stop capturing mousemove and mouseup events.

if (browser.isIE) {
document.detachEvent("onmousemove", dragGo);
document.detachEvent("onmouseup", dragStop);
}
if (browser.isNS) {
document.removeEventListener("mousemove", dragGo, true);
document.removeEventListener("mouseup", dragStop, true);
}
}

function Ainit()
{
    tt_Init();
    dd_Init();
  
    var pprIframe= document.getElementById("_pprIFrame");    
    var browserTE = new Browser();
    if(browserTE.isIE) 
    {
      pprIframe.attachEvent("onload", showConfirmation);
      pprIframe.attachEvent("onload", refreshAttachments);
    }
    else
    {
      pprIframe.addEventListener("load", showConfirmation, false); 
      pprIframe.addEventListener("load", refreshAttachments, false); 
    }
}

function AfindPosX(obj)
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

function AfindPosY(obj)
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

// Bug 9063240
// This dummy function is being used for href property of <a> tags
// so that the item still remains a focussable item
function Adummy(){}