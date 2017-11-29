/*=================================================================+
|               Copyright (c) 2009 Oracle Corporation              |
|                  Redwood Shores, California, USA                 |
|                       All rights reserved.                       |
+==================================================================+
| FILENAME                                                         |
|   OAFSlideoutMenu.js                                             |
|                                                                  |
| HISTORY                                                          |
|   01-JUN-2009 skothe  Created.                                   |
+==================================================================*/
/* $Header: OAFSlideoutMenu.js 120.0.12010000.29 2010/05/14 10:06:02 sette noship $ */

var oafsm={
  Shi: 900,Shioc: true,  
  SisRL:false,SisFL:false,ScRli: null,ScRK:-1,
  ScAP:-1,hideMenu:null,pgLen:15,pgLenF:15,
  StArrImN:null,SbArrImN:null,SuArrImN:null,SdArrImN:null,
  StArrImF:null,SbArrImF:null,SuArrImF:null,SdArrImF:null,
  SsgId:-1, Surl:-1, isF:false, itsResp:false, SrInf:[],   
  rLen:0, lis:[], fLi:[], noScr:false,
  xmlHttp:null,
  Stout:false, St:null, Sel:null, srLength:-1, srLengthF:-1, Sli:null, SvR: [],
  SvRI: -1, SiRLC:false, SiRMsAt:false,SiRMsAtF:false,
  manageNav:'Manage Navigator',
  manageFav:'Manage Favorites',
  addFav:'Add to Favorites',
  SmsgTxt:'Session Expired',
  noMngNav:false,
  SuArr:null,
  mgNavli:null, snTop:null, sfTop:null, isIE:null, sdAn:null, sdAf:null, suAn:null,
  suAf:null, StmId: [], StIt: {}, Ssul: {}, StItI: -1, Suli: -1, Shti: {}, 
  SblockNav:false, favRoot:null, favInfo:null, isJtt:false, mngNavUrl:null, mngFavUrl:null,
  addFavUrl:null,
  
  Sgoff:function(what, offsettype){
    return (what.offsetParent)? what[offsettype]+this.Sgoff(what.offsetParent, offsettype) : what[offsettype]
  },

  Sgoffo:function(el){
    el._offsets={left:this.Sgoff(el, "offsetLeft"), top:this.Sgoff(el, "offsetTop")}
  },

  Sgws:function(){
    this.docwidth=window.innerWidth? window.innerWidth-10 : this.standardbody.clientWidth-10
    this.docheight=window.innerHeight? window.innerHeight-15 : this.standardbody.clientHeight-18
  },

  Sgtid:function(){
    for (var m=0; m<this.StmId.length; m++){
      var topmenuid=this.StmId[m]
      for (var i=0; i<this.StIt[topmenuid].length; i++){
        var header=this.StIt[topmenuid][i]
        var submenu=document.getElementById(header.getAttribute('rel'))
        header._dimensions={w:header.offsetWidth, h:header.offsetHeight, submenuw:submenu.offsetWidth, submenuh:submenu.offsetHeight}
      }
    }
  },

  SiC:function(m, e){
    var e=window.event || e    
    var c=e.relatedTarget || ((e.type=="mouseover")? e.fromElement : e.toElement)
  	while (c && c!=m)try {c=c.parentNode} catch(e){c=m}
    if (c==m)
      return true
    else
      return false
  },

  css:function(el, targetclass, action){
    var needle=new RegExp("(^|\\s+)"+targetclass+"($|\\s+)", "ig")
  	if (action=="check")
    	return needle.test(el.className)
    else if (action=="remove")
  		el.className=el.className.replace(needle, " ")
    else if (action=="add" && !needle.test(el.className))
      el.className = el.className.replace(/\s*$/, "") + " " + targetclass // BiDi support: triming trailing space before adding new class    
  },

Sbm:function(mainmenuid, header, submenu, submenupos, istoplevel, dir, dropul){
    header._master=mainmenuid 
    header._pos=submenupos
    header._istoplevel=istoplevel
    String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };

    var Favorites = null;
    if (oafsm.isIE)
        Favorites = header.id.trim();              
    else
        Favorites = header.id.trim();
    if("SFAV" == Favorites)
    {
        if(submenu != null)
        {
          this.Ssul[mainmenuid][submenupos]=submenu
          header._dimensions={w:header.offsetWidth, h:header.offsetHeight, submenuw:submenu.offsetWidth, submenuh:submenu.offsetHeight}
          this.Sgoffo(header)
        }        
    }
    else
    {
        this.Ssul[mainmenuid][submenupos]=submenu
        if(submenu != null)
        {
          header._dimensions={w:header.offsetWidth, h:header.offsetHeight, submenuw:submenu.offsetWidth, submenuh:submenu.offsetHeight}
          this.Sgoffo(header)
        }            
    }
    
    if(istoplevel)
    {
      var isAlt = false; 
      var isShift = false;
      this.SaEv(header, function(e){ //click event
         if(oafsm.isIE)
         {
           var header = e.srcElement;
           if(!( (header.id =="SNAV") || (header.id=="SFAV")))
              header = header.parentNode;
           if(header)   
             oafsm.SmainMenu(mainmenuid,header,dir,dropul,e);
         }  
         else         
           oafsm.SmainMenu(mainmenuid,e.currentTarget,dir,dropul,e);
      }, "click")

      var functionref=function(e){ 
          var keyCode=-1; var event = e || window.event;
          if(event)
          {
            if(event.which)
                keyCode = event.which;
            else if(event.keyCode) 
                keyCode = event.keyCode;
          }
          if(keyCode==18)
            isAlt=false;
          if(keyCode==16)
            isShift=false;
      }
      
      var functRefKdn = function(e){ //ALT+N = Navigator and ALT+R= Favorites
          var keyCode=-1;  var event = e || window.event;
          if(event)
          {
            if(event.which)
                keyCode = event.which;
            else if(event.keyCode) 
                keyCode = event.keyCode;
          }
          if(keyCode==18)
            isAlt=true;
          if(keyCode==16)
            isShift=true;

          if(((keyCode==78)||(keyCode==79))&&(isAlt)&&(!isShift))
          {
            if(keyCode==78)
              header = document.getElementById("SNAV");
            if(keyCode==79)  
              header = document.getElementById("SFAV");
            if(header)
            {
              isAlt=false;
              oafsm.Shioc=true;
              oafsm.SmainMenu(mainmenuid,header,dir,dropul,e);
            }
          }
      }

      if (document.addEventListener)
		document.addEventListener('keyup', functionref, false);
      else if (document.attachEvent)
		document.attachEvent('onkeyup', functionref);

      if (document.addEventListener)
		document.addEventListener('keydown', functRefKdn, false);
      else if (document.attachEvent)
		document.attachEvent('onkeydown', functRefKdn);
    }      
    else
    {    
      if(!("SFAV" == Favorites.trim()) && ( header.id != "FUNCTION"))
      {
        this.SaEv(header, function(e){ //mouseover event          
          var Sr=function()
          {
            oafsm.SsubMenu(mainmenuid,header,dir,dropul,e);        
          }
          oafsm.Sli=this;
          oafsm.Sel = e.srcElement
          oafsm.Ssp(e);
          oafsm.St = setTimeout(Sr,300);       
        }, "mouseover")
        
        this.SaEv(header, function(e){ // Keyup event
          var keyCode=-1; var event = e || window.event;
          if(event)
          {
            if(event.which)
                keyCode = event.which;
            else if(event.keyCode) 
                keyCode = event.keyCode;
          }
          oafsm.Sli=this;
          oafsm.Sel = e.srcElement
          oafsm.Ssp(e);
          if(keyCode == 39) // -> Key
            oafsm.SsubMenu(mainmenuid,header,dir,dropul,e); 
          else if((keyCode == 27)||(keyCode == 37))
          {
              if(oafsm.hideMenu)
              var pMenu = oafsm.hideMenu.parentNode;
              if(pMenu)
                if(pMenu.firstChild)
                  pMenu.firstChild.focus();
              oafsm.Shide(event,true);
          }
        }, "keyup")
      }
      
      this.SaEv(header, function(e){ // Key Down events
        var Favorites = null;
        if(header.shortDesc)
          Favorites = header.shortDesc.trim();
        var keyCode=-1;
        var event = e || window.event;
        if(event)
        {
            if(event.which)
                keyCode = event.which;
            else if(event.keyCode) 
                keyCode = event.keyCode;
        }
        oafsm.Sli=this;
        oafsm.Sel = e.srcElement
        var scrLen = null;    
        var scrList = [];

        if(keyCode == 38) // Up.
        {          
          oafsm.Ssp(e);  
          if(header.previousSibling)
          {
            if(header.previousSibling.firstChild)
            {
              if(header.previousSibling.style.display=="none")
              {
                oafsm.direction = 1;                
                if(!("SFAV" == Favorites))
                {
                  oafsm.animate(false,true);
                  oafsm.pgLen--;
                }
                else
                {
                  oafsm.animate(true,true);
                  oafsm.pgLenF--;
                }
              }
              header.previousSibling.firstChild.focus();
            }
          }
          else
          {
            if(!("SFAV" == Favorites))
            {
              if(oafsm.suAn)
              {
                oafsm.SuArrImN.src='/OA_MEDIA/shuttle_moveup_disabled.gif';           
                oafsm.StArrImN.src='/OA_MEDIA/shuttle_movetotop_disabled.gif';
              }  
            }
            else
            {
              if(oafsm.suAf)
              {
                oafsm.SuArrImF.src='/OA_MEDIA/shuttle_moveup_disabled.gif';           
                oafsm.StArrImF.src='/OA_MEDIA/shuttle_movetotop_disabled.gif';
              }
            }
          }
        }
        else if(keyCode == 40) // Down.
        {         
          oafsm.Ssp(e);
          if(header.nextSibling)
          {            
            if(header.nextSibling.firstChild)
            {
              if(header.nextSibling.style.display=="none")
              {
                oafsm.direction = 0;
                if(!("SFAV" == Favorites))
                {
                    oafsm.animate(false,true);
                    oafsm.pgLen++;
                }
                else
                {
                    oafsm.animate(true,true);
                    oafsm.pgLenF++;
                }
              }
              header.nextSibling.firstChild.focus();
            }
          }
          else
          {
            if(!("SFAV" == Favorites))
            {
              if(oafsm.sdAn)
              {
                oafsm.SdArrImN.src='/OA_MEDIA/shuttle_movedown_disabled.gif';
                oafsm.SbArrImN.src='/OA_MEDIA/shuttle_movetobottom_disabled.gif';
              }
            }
            else
            {
              if(oafsm.sdAf)
              {
                oafsm.SdArrImF.src='/OA_MEDIA/shuttle_movedown_disabled.gif';
                oafsm.SbArrImF.src='/OA_MEDIA/shuttle_movetobottom_disabled.gif';
              }
            }          
          }
        }
        else if( (keyCode == 33) && ((oafsm.suAn)||(oafsm.suAf)) ) // Page Up.
        {
          oafsm.Ssp(e);          
          var scrLen = null;
          var scrList = null;
          var pgLen = null;
          if(!("SFAV" == Favorites))
          {
            oafsm.hideonScr();
            pgLen = oafsm.pgLen;
            scrLen = oafsm.srLength;
            scrList = oafsm.lis;
          }
          else
          {
            pgLen = oafsm.pgLenF;
            scrLen = oafsm.srLengthF;
            scrList = oafsm.fLi;
          }
          if(pgLen == scrLen)
          {
            if(!("SFAV" == Favorites))
            {
              oafsm.SdArrImN.src='/OA_MEDIA/shuttle_movedown_enabled.gif';
              oafsm.SbArrImN.src='/OA_MEDIA/shuttle_movetobottom_enabled.gif';
            }
            else
            {
              oafsm.SdArrImF.src='/OA_MEDIA/shuttle_movedown_enabled.gif';
              oafsm.SbArrImF.src='/OA_MEDIA/shuttle_movetobottom_enabled.gif';
            }
          }
          if((scrLen <= 15)||(pgLen <= 0)) // No Scroll          
            return;
          if(pgLen>15)  
            pgLen = pgLen-15;
          var delta = pgLen;
          var diff = 15;          
          if(delta < diff)
          {
            diff = delta;
            delta = 15;
          }
          if(delta+diff > scrLen)
          {
            for(var i=delta;i<(scrLen);i++)
            {
              scrList[i].style.display='none';
            }
          }
          else
          {
            for(var i=delta;i<(delta+diff);i++)
            {
                scrList[i].style.display='none';
            }
          }
          if(diff < 15) delta = diff;
          for(var i=delta-diff;i<delta;i++)
          {
            if (oafsm.isIE)
                scrList[i].style.display='inline';
            else
                scrList[i].style.display='block';            
          }            
          if(pgLen <= 15)
          {
            pgLen=15;
            if(!("SFAV" == Favorites))
            {
              oafsm.ScIndN=0;
              oafsm.SuArrImN.src='/OA_MEDIA/shuttle_moveup_disabled.gif';           
              oafsm.StArrImN.src='/OA_MEDIA/shuttle_movetotop_disabled.gif';              
            }
            else
            {
              oafsm.ScIndF=0;
              oafsm.SuArrImF.src='/OA_MEDIA/shuttle_moveup_disabled.gif';           
              oafsm.StArrImF.src='/OA_MEDIA/shuttle_movetotop_disabled.gif';              
            }
            if(scrList[0].firstChild)
                scrList[0].firstChild.focus();
          }
          else if(scrList[pgLen-15].firstChild)
          {
             if(!("SFAV" == Favorites))
               oafsm.ScIndN=pgLen-15; 
             else
               oafsm.ScIndF=pgLen-15; 
             scrList[pgLen-15].firstChild.focus();              
          }
          if(!("SFAV" == Favorites))
            oafsm.pgLen = pgLen;
          else
            oafsm.pgLenF = pgLen;
        }
        else if( (keyCode == 34) && ((oafsm.suAn)||(oafsm.suAf)) )// Page Down.
        {
          oafsm.Ssp(e);          
          var scrLen = null;
          var scrList = null;
          var pgLen = null;
          if(!("SFAV" == Favorites))
          {
            oafsm.hideonScr();
            pgLen = oafsm.pgLen;
            scrLen = oafsm.srLength;
            scrList = oafsm.lis;
            if(pgLen >=15 )
            {
                oafsm.SuArrImN.src='/OA_MEDIA/shuttle_moveup_enabled.gif';
                oafsm.StArrImN.src='/OA_MEDIA/shuttle_movetotop_enabled.gif';
            }            
          }
          else
          {
            pgLen = oafsm.pgLenF;
            scrLen = oafsm.srLengthF;
            scrList = oafsm.fLi;
            if(pgLen >=15 )
            {
                oafsm.SuArrImF.src='/OA_MEDIA/shuttle_moveup_enabled.gif';
                oafsm.StArrImF.src='/OA_MEDIA/shuttle_movetotop_enabled.gif';
            }
          }
          if(pgLen<=0) pgLen = 15;
          var delta = pgLen;
          var diff = 15;
          if((scrLen <= 15)||(delta >= scrLen)) // No Scroll
          {
            if(!("SFAV" == Favorites))
            {
                oafsm.SdArrImN.src='/OA_MEDIA/shuttle_movedown_disabled.gif';
                oafsm.SbArrImN.src='/OA_MEDIA/shuttle_movetobottom_disabled.gif';
            }
            else
            {
                oafsm.SdArrImF.src='/OA_MEDIA/shuttle_movedown_disabled.gif';
                oafsm.SbArrImF.src='/OA_MEDIA/shuttle_movetobottom_disabled.gif';
            }
            return;
          }
          else if((pgLen+15) > scrLen)
          {           
            diff = scrLen - pgLen;
            pgLen = scrLen;
          }
          for(var i=delta-15;i<(delta+diff-15);i++)
          {
            scrList[i].style.display='none';
          }            
          for(var i=delta;i<(delta+diff);i++)
          {
            if (oafsm.isIE)
                scrList[i].style.display='inline';
            else
                scrList[i].style.display='block';        
          }
          if(pgLen >= scrLen)
          {
            if(scrList[pgLen-15].firstChild)
                scrList[pgLen-15].firstChild.focus();
            if(!("SFAV" == Favorites))
            {
              oafsm.SdArrImN.src='/OA_MEDIA/shuttle_movedown_disabled.gif';
              oafsm.SbArrImN.src='/OA_MEDIA/shuttle_movetobottom_disabled.gif';
              oafsm.ScIndN=pgLen-15;
            }
            else  
            {
              oafsm.SdArrImF.src='/OA_MEDIA/shuttle_movedown_disabled.gif';
              oafsm.SbArrImF.src='/OA_MEDIA/shuttle_movetobottom_disabled.gif';
              oafsm.ScIndF=pgLen-15;
            }
          }
          else if(scrList[pgLen].firstChild)
          {
              scrList[pgLen].firstChild.focus();
              if(!("SFAV" == Favorites))
                oafsm.ScIndN=pgLen;
              else
                oafsm.ScIndF=pgLen;
              pgLen = pgLen+15;
          }
          if(!("SFAV" == Favorites))
            oafsm.pgLen = pgLen;
          else
            oafsm.pgLenF = pgLen;
        }
      }, "keydown")      
    }
    this.SaEv(header, function(e){ //mouseout event		                
          clearTimeout(oafsm.St);
    }, "mouseout")        
},
SmainMenu:function(mainmenuid,header,dir,dropul,e){
      String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };      
      //For Esc Key      
      if(oafsm.isIE)
        document.onkeyup=function(evt){ oafsm.Shide(evt,false);}        
      else
        window.onkeyup=function(evt){ oafsm.Shide(evt,false);}
      var Favorites = header.id.trim();
      if(("SFAV" == Favorites.trim()) || ("SNAV" == Favorites.trim()))
        if(e.type=="click")
          oafsm.Shioc= false;
      else  
        oafsm.Shioc= true;
        
      if("SFAV" == Favorites.trim())
      {        
        var SmenuTop = oafsm.sfTop;
        if(SmenuTop != null)
        {
          if (oafsm.isIE)
            SmenuTop.style.display='inline';
          else
            SmenuTop.style.display='block';
        }
        var snTop = oafsm.snTop;
        if(snTop != null)
          oafsm.Shm(snTop, true,false);
        var menuUL = document.getElementById("MenuList");
        if(menuUL != null)
        {
            var Ssul=menuUL.getElementsByTagName("ul")
            if(Ssul != null)
            {
              for (var c=0; c<Ssul.length; c++)
              {
                  oafsm.Shm(Ssul[c], false,false)
              }
            } 
        }   
        var url = unescape(oafsm.Surl);
        var body = "<params><param>FAVLIST</param>"        
        body = body + "<param>SLIDEOUT</param></params>"
        oafsm.xmlHttp.open("POST", url, false)
        oafsm.xmlHttp.setRequestHeader("Content-type", "application/xml")        
        oafsm.xmlHttp.send(body)
        oafsm.SpFXml();
      }
      else
      {       
        var snTop = oafsm.snTop; 
        if(snTop != null)
        {
          if (oafsm.isIE)     
            snTop.style.display='inline';
          else
            snTop.style.display='block';
        }      
        var menuUL = oafsm.sfTop;
        if(menuUL != null)
          oafsm.Shm(menuUL,false,true);

        var url = unescape(oafsm.Surl);
        var body = "<params><param>RESPLIST</param>"
        body = body + "<param>SLIDEOUT</param></params>"
        oafsm.xmlHttp.open("POST", url, false)
        oafsm.xmlHttp.setRequestHeader("Content-type", "application/xml")
        oafsm.xmlHttp.send(body)
        oafsm.SpXml();
      }				
      var submenu=oafsm.Ssul[header._master][parseInt(header._pos)]
        
       if("SFAV" == Favorites.trim() && !(oafsm.Stout))
         oafsm.ScrFL(submenu)
       else if(!("SFAV" == Favorites.trim()) && !(oafsm.Stout) )
         oafsm.ScrRL(submenu)
       else if (oafsm.Stout)
       {
         oafsm.Shioc = true;
         oafsm.Shide();
       }
         
       if (header._istoplevel)
       {
         oafsm.css(header, "selected", "add")
         clearTimeout(oafsm.Shti[header._master][header._pos])
       }
      	oafsm.Sgoffo(header)
      	var scrollX=window.pageXOffset? window.pageXOffset : oafsm.standardbody.scrollLeft
        var scrollY=window.pageYOffset? window.pageYOffset : oafsm.standardbody.scrollTop
        var Ssmred=header._dimensions.submenuw + (header._istoplevel && dir=="topbar"? 0 : header._dimensions.w)
        var Ssmbed=header._dimensions.submenuh
        
        var menuleft=0;        
        // BiDi hanlding in menu rendering preparation
        var menuright=0;
        oafsm.css(header, "gainlayout", "add");
        oafsm.Sgoffo(header); // recalc the offsets after the gain of layout
        // End BiDi        
        if("SFAV" == Favorites.trim())
        {
          // BiDi hanlding in menu - x coordinate calculation for BiDi session
          var fT = oafsm.sfTop;          
          if (oafsm.isIE)     
          {             
              var upArr =fT.childNodes[0]; 
              var dnArr =fT.childNodes[2];
              var nT = oafsm.snTop;
              if(nT == null)  //For Homepage
              {              
                menuleft = header.offsetLeft+(header._istoplevel? (dir=="sidebar"? header._dimensions.w : 0) : header._dimensions.w)
                menuright = header.offsetParent.offsetWidth - header.offsetLeft - header.offsetWidth;
              }
              else
              {
                menuleft=header.offsetLeft+(header._istoplevel? (dir=="sidebar"? header._dimensions.w : 0) : header._dimensions.w)
                if (Ssmred-scrollX>oafsm.docwidth)
                {
                    menuleft+= -header._dimensions.submenuw + (header._istoplevel && dir=="topbar" ? header._dimensions.w : -header._dimensions.w)
                }            
                menuright = header.offsetParent.offsetWidth - header.offsetLeft - header.offsetWidth;
              }
              if((upArr != null) && (dnArr != null))
              {
                if(isBiDi())
                {
                    upArr.style.right=menuright+"px";
                    dnArr.style.right=menuright+"px";
                }
                else
                {
                    upArr.style.left=menuleft+"px";
                    dnArr.style.left=menuleft+"px";
                }
              }
          }
          else if (navigator.userAgent.toLowerCase().indexOf('safari')!=-1)
          {            
            menuright = oafsm.standardbody.clientWidth - header._offsets.left - header.offsetWidth;
          }  
          else
            menuright = oafsm.standardbody.clientWidth - header._offsets.left + (dir=="sidebar"? header._dimensions.w : 0); 
          if(!isBiDi())
          {
            if(oafsm.isIE)
              submenu.style.left= menuleft;              
            else
              fT.style.left= header._offsets.left;
          }
          else
          {                
            if(oafsm.isIE)
              submenu.style.right= menuright;
            else
              fT.style.right = menuright;
          }
          // End BiDi
        }
        else
        {
          //Sub menu starting left position
          // BiDi hanlding in menu - x coordinate calculation for BiDi session
          // This calculation is done against offsetParent, not client window             
          var snTop = oafsm.snTop; 
          if (oafsm.isIE)   
          {
            //menuleft = this._offsets.left-header.offsetLeft-255;            
            menuleft=(header._istoplevel? (dir=="sidebar"? header._dimensions.w : 0) : header._dimensions.w)
            if (Ssmred-scrollX>oafsm.docwidth)
            {
                menuleft+= -header._dimensions.submenuw + (header._istoplevel && dir=="topbar" ? header._dimensions.w : -header._dimensions.w)
            }            
            var upArr =snTop.childNodes[0]; 
            var dnArr =snTop.childNodes[2];
            menuleft=menuleft+60;
            menuright = header.offsetParent.offsetWidth - header.offsetLeft - header.offsetWidth;
            if((upArr != null) && (dnArr != null))
            {
                if(isBiDi())
                {
                    upArr.style.right=menuright+"px";
                    dnArr.style.right=menuright+"px";
                }
                else
                {
                    upArr.style.left=menuleft+"px";
                    dnArr.style.left=menuleft+"px";
                }
            }
          }
          else if (navigator.userAgent.toLowerCase().indexOf('safari')!=-1)
          {            
            menuright = oafsm.standardbody.clientWidth - header._offsets.left - header.offsetWidth;
          }  
          else
          {             
            menuright = oafsm.standardbody.clientWidth - header._offsets.left + (dir=="sidebar"? header._dimensions.w : 0);
          }
          if(isBiDi())
          {
              if(oafsm.isIE)
                submenu.style.right= menuright;
              else
                snTop.style.right= menuright;
          }
          else
          {
              if(!(oafsm.isIE))
                snTop.style.left= header._offsets.left;
          }
          // End Bidi
          if( (oafsm.isIE) && (!isBiDi()))
            submenu.style.left=menuleft+"px";
        }
        //Sub menu starting top position
        var menutop= 0;        
        if("SFAV" == Favorites.trim())
        {
          menutop=(header._istoplevel? (dir=="sidebar"? 0 : header._dimensions.h) : header.offsetTop)
          if (Ssmbed-scrollY>oafsm.docheight)
          { //no room downwards?
            if (header._dimensions.submenuh<header._offsets.top+(dir=="sidebar"? header._dimensions.h : 0)-scrollY)
            { //move up?          
              menutop+= - header._dimensions.submenuh + (header._istoplevel && dir=="topbar"? -header._dimensions.h : header._dimensions.h)
            }
            else
            { //top of window edge
              menutop+= header._istoplevel && dir=="topbar"? -header._dimensions.h : 0
            }
          }
          var fT = oafsm.sfTop;
          fT.style.top = header.style.top;
          var upArrt = oafsm.suAf;
          if(upArrt != null)
          {
            upArrt.style.top=menutop-9+"px"
            if (oafsm.isIE)
                menutop = menutop+45;
            else
                menutop = menutop+39;
          }
          else 
            menutop = 9;
        }
        else
        {        
          menutop=(header._istoplevel? (dir=="sidebar"? 0 : header._dimensions.h) : header.offsetTop)
          if (Ssmbed-scrollY>oafsm.docheight)
          { //no room downwards?
            if (header._dimensions.submenuh<header._offsets.top+(dir=="sidebar"? header._dimensions.h : 0)-scrollY)
            { //move up?          
              menutop+= - header._dimensions.submenuh + (header._istoplevel && dir=="topbar"? -header._dimensions.h : header._dimensions.h)
            }
            else
            { //top of window edge
              menutop+= header._istoplevel && dir=="topbar"? -header._dimensions.h : 0
            }
          }
          oafsm.snTop.style.top = header.style.top;
          var upArrt = oafsm.suAn;
          if(upArrt != null)
          {
             upArrt.style.top=menutop-9+"px"          
             if (oafsm.isIE)
                menutop = menutop+45;
             else
                menutop = menutop+39;
           }
           else
             menutop=9;
        }
        submenu.style.top=menutop+"px"
        submenu.FFscrollInfo={x:scrollX, y:scrollY}     
        
       if(!(oafsm.Stout))
       {
         oafsm.hideMenu = submenu;
         var respLis = submenu.getElementsByTagName('li');
         var tInd = 0;
         if(respLis)
         {             
             while(respLis[tInd].style.display == "none")
               tInd++             
         }
         if(!("SFAV" == Favorites.trim()))
         {
           if(!(oafsm.SiRMsAt)) 
           {
             for(var i=0; i<respLis.length; i++)
             {
               oafsm.Sbm(mainmenuid, respLis[i], null, oafsm.Suli+1, false, dir, dropul) //build sub level menus           
             }         
             oafsm.SiRMsAt = true; 
           }
           oafsm.Ssm(header, submenu, dir,false,true)
         }
         else
         {
           if(!(oafsm.SiRMsAtF)) 
           {
             for(var i=0; i<respLis.length; i++)
             {
               oafsm.Sbm(mainmenuid, respLis[i], null, oafsm.Suli+1, false, dir, dropul) //build sub level menus           
             }
             oafsm.SiRMsAtF = false;
           }  
             oafsm.Ssm(header, submenu, dir,true,true)
         }
         respLis[tInd].firstChild.focus();         
        }
},

SsubMenu:function(mainmenuid,header,dir,dropul,e){
        oafsm.Shioc = true
        if(oafsm.Sli)
          clearTimeout(oafsm.Shti[oafsm.Sli._master][oafsm.Sli._pos])
        
        String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };
        var ScuRoM = null;                
        if (oafsm.isIE)
        {
          var Sttl = oafsm.Sel.title;
          if(Sttl.length > 36)
           ScuRoM = Sttl.trim();
          else 
           ScuRoM = oafsm.Sel.innerText.trim();           
        }
        else
        {
          var Sttl = e.target.title;
          if(Sttl.length > 36)
           ScuRoM = Sttl.trim();
          else 
           ScuRoM = e.target.textContent.trim();        
        }                                   
        var respText = null;
        var currsubmenu = null;
        var menuli = null;
        if(e.target != null)
            menuli = e.target.parentNode;
        else
            menuli = oafsm.Sel.parentNode;
        var itsFunction = false;
        
        // Bug 	8582787.
        // Mouse overing on the "Manage Navigator" link should hide currently visisble submenu list.
        if(oafsm.manageNav == ScuRoM)
        {
            var siblings = menuli.parentNode.childNodes
            for (var i=0; i<siblings.length; i++)
            {
	        if(siblings[i] != menuli)
		{
                  if(siblings[i] != null)
                  {
                    if(siblings[i].tagName == "LI")
                    {
                      var sibChilds = siblings[i].getElementsByTagName('ul');                      
                      if(sibChilds != null)
                      {
                        for(var ind=0;ind<sibChilds.length;ind++)
                        {
                          oafsm.Shm(sibChilds[ind], false,false);
                        }
                      }
                    }
                  }                       
              }
            }
        }        
        if(oafsm.ScRli != null)
        {  
            if("FUNCTION"==menuli.id) 
              itsFunction = true;
            if(menuli.tagName=="DIV")  
              itsFunction = true;
        }
        if(!itsFunction)
        {                
        // If it's menu Li it will have ID defined. It means current mouse focus is on Menu.
        var isRestCall = false;
        var noRestCall = false;
        if((menuli.id != null)&&( menuli.id != "")&&("ScrollResp"!= menuli.id))
        {
            if(oafsm.manageNav != ScuRoM)        
            {
                oafsm.itsResp=false;
                oafsm.ScRli = menuli;        

                var menuKey = menuli.id;
                var url = unescape(oafsm.Surl);
                var body = "<params><param>"+oafsm.ScRK+"</param>"
                body = body + "<param>"+oafsm.ScAP+"</param>"   
                body = body + "<param>"+menuKey+"</param>"
                body = body + "<param>"+oafsm.SsgId+"</param>"
                body = body + "<param>SLIDEOUT</param></params>"  
                
                if(oafsm.xmlHttp != null)
                    oafsm.xmlHttp.abort();
                
                oafsm.xmlHttp.open("POST", url, false);
                oafsm.xmlHttp.setRequestHeader("Content-type", "application/xml");                            
                var liFuncList = oafsm.ScRli.getElementsByTagName('ul');                
                if(oafsm.ScRli.shortDesc == "noChild")
                  noRestCall = true;
                for(var j=0; j<liFuncList.length; j++)
                {
                  if("sFuncList"==liFuncList[j].id)
                  {
                    noRestCall = true;
                    break;
                  }
                }   
                if(!noRestCall)
                {
                  oafsm.xmlHttp.send(body);
                  oafsm.SpMXml();
                }
                isRestCall = true;
             }
        }
        else                                                   
        {
            oafsm.itsResp=true;
        // See if ScuRoM has ID specified. If Yes, then it's menu Id        
        if(oafsm.SrInf[0] != null)
        {          
          var respli = null;
          for(var i=0; i<oafsm.SrInf[0].length; i++)                                
          {   
            if (oafsm.isIE)
            {
                respText = oafsm.SrInf[0][i].text;
            }
            else
            {
              respText = oafsm.SrInf[0][i].textContent;
            }
            if(respText == ScuRoM)
            {            
              var respKey = null;
              var applName = null;
              var SsgId = null;
              if (oafsm.isIE)
              {
                  respKey = oafsm.SrInf[1][i].text
                  applName = oafsm.SrInf[2][i].text
                  SsgId = oafsm.SrInf[3][i].text
              }
              else
              {
                  respKey = oafsm.SrInf[1][i].textContent
                  applName = oafsm.SrInf[2][i].textContent   
                  SsgId = oafsm.SrInf[3][i].textContent
              }            
              if(e.target != null)
                respli = e.target.parentNode;
              else
                respli = oafsm.Sel.parentNode;
                
              oafsm.ScRli = respli;                                                                             
              
              var menuKey = -1; // With mouseover on Resp menuKey will be -1.  
              oafsm.ScRK = respKey;
              oafsm.ScAP = applName;
              oafsm.SsgId = SsgId;
                
              var url = unescape(oafsm.Surl);
              var body = "<params><param>"+respKey+"</param>"
              body = body + "<param>"+applName+"</param>"    
              body = body + "<param>"+menuKey+"</param>"                  
              body = body + "<param>"+SsgId+"</param>"
              body = body + "<param>SLIDEOUT</param></params>"

              if(oafsm.xmlHttp != null)
                oafsm.xmlHttp.abort();
              
              oafsm.xmlHttp.open("POST", url, false);
              oafsm.xmlHttp.setRequestHeader("Content-type", "application/xml");

              var liFuncList = oafsm.ScRli.getElementsByTagName('ul');              
              if(oafsm.ScRli.shortDesc == "noChild")
                noRestCall = true;
              for(var j=0; j<liFuncList.length; j++)
              {
                if("sFuncList"==liFuncList[j].id)
                {
                  noRestCall = true;
                  break;
                }
              }
              if(!noRestCall)
              {
                oafsm.xmlHttp.send(body);
                oafsm.SpMXml();
              }
              isRestCall = true;
              oafsm.SvRI++;
              oafsm.SvR[oafsm.SvRI]=ScuRoM;
              break;  
          }
        }    
      }
      }
      if(isRestCall)
      {
        if(oafsm.ScRli != null)
        {
          // Associate mouseover with menu's only not functions.
          var menuItems = oafsm.ScRli.getElementsByTagName('LI');
          var submenus = oafsm.ScRli.getElementsByTagName('UL');
          if(submenus != null)
            currsubmenu = submenus[0];
          if(!noRestCall)
          {
            for (var c=0; c<menuItems.length; c++)
            {            
              if((menuItems[c].id != null)&&(menuItems[c].id != ""))
              {
                oafsm.Sbm(mainmenuid, menuItems[c], menuItems[c], this.Suli+1, false, dir, dropul) //build sub level menus
              }
            }
          }
        }          
        // On mouseovering the resp get the function list.                  
        oafsm.Shioc = true        
        if(currsubmenu != null)
        {
          var submenu=oafsm.Ssul[oafsm.Sli._master][parseInt(oafsm.Sli._pos)]
          if(submenu)
            if(submenu.tagName != "UL")
              submenu = null;
          if(submenu == null)
          {
            //it means build menu is called with respli. (li tag)
            submenu = currsubmenu;
            oafsm.Sli._dimensions={w:header.offsetWidth, h:header.offsetHeight, submenuw:submenu.offsetWidth, submenuh:submenu.offsetHeight}
            oafsm.Sgoffo(header)
            // BiDi hanlding in menu rendering
            if (isBiDi())
              submenu.style.right=0
            else
              submenu.style.left=0
            // End BiDi
            submenu.style.top=0
            submenu.style.visibility="hidden";
          }                    
          if (oafsm.Sli._istoplevel){
                oafsm.css(this, "selected", "add")
                clearTimeout(oafsm.Shti[this._master][this._pos])
          }
          oafsm.Sgoffo(header)
            var scrollX=window.pageXOffset? window.pageXOffset : oafsm.standardbody.scrollLeft
            var scrollY=window.pageYOffset? window.pageYOffset : oafsm.standardbody.scrollTop
            if(oafsm.Sli._offsets != null)
              var Ssmred=oafsm.Sli._offsets.left + oafsm.Sli._dimensions.submenuw + (oafsm.Sli._istoplevel && dir=="topbar"? 0 : oafsm.Sli._dimensions.w)
            var Ssmbed=oafsm.Sli._dimensions.submenuh
            // BiDi hanlding in menu rendering
            // In BiDi case, look for the space for left side first, then look for right
            if (isBiDi())
            {
                var menuright=(oafsm.Sli._istoplevel?(dir=="sidebar"? oafsm.Sli._dimensions.w : 0) : oafsm.Sli._dimensions.w)
                // Check the spece for left and flip the submenu if there is not enough space
                if (oafsm.Sli._offsets.left < oafsm.Sli._dimensions.submenuw){
                    menuright+= -oafsm.Sli._dimensions.submenuw + (oafsm.Sli._istoplevel && dir=="topbar" ? oafsm.Sli._dimensions.w : -oafsm.Sli._dimensions.w)
      		}                
                submenu.style.right=menuright+"px"
            }            
            else
            {
                //Sub menu starting left position
                var menuleft=(oafsm.Sli._istoplevel?(dir=="sidebar"? oafsm.Sli._dimensions.w : 0) : oafsm.Sli._dimensions.w)
  				
                if (Ssmred-scrollX>oafsm.docwidth){
                    if((oafsm.Sli._offsets.left - oafsm.Sli._dimensions.submenuw) > 0)
                      menuleft+= -oafsm.Sli._dimensions.submenuw + (oafsm.Sli._istoplevel && dir=="topbar" ? oafsm.Sli._dimensions.w : -oafsm.Sli._dimensions.w)
                }                
                submenu.style.left=menuleft+"px"
             }    
             // End Bidi   
                //Sub menu starting top position
                var menutop = 0;
                if(oafsm.Sli._offsets != null)
                  menutop=(oafsm.Sli._istoplevel? oafsm.Sli._offsets.top + (dir=="sidebar"? 0 : oafsm.Sli._dimensions.h) : oafsm.Sli.offsetTop)
                if (Ssmbed-scrollY>oafsm.docheight)
                { //no room downwards?
                    if (oafsm.Sli._dimensions.submenuh<(dir=="sidebar"? oafsm.Sli._dimensions.h : 0)-scrollY){ //move up?
                        menutop+= - oafsm.Sli._dimensions.submenuh + (oafsm.Sli._istoplevel && dir=="topbar"? -oafsm.Sli._dimensions.h : oafsm.Sli._dimensions.h)
                    }
                    else{ //top of window edge
                        if(oafsm.Sli._offsets != null) 
                          menutop+= -(oafsm.Sli._offsets.top-scrollY) + (oafsm.Sli._istoplevel && dir=="topbar"? -oafsm.Sli._dimensions.h : 0)
                    }
    		}
                submenu.style.top=menutop+"px";                            
                submenu.FFscrollInfo={x:scrollX, y:scrollY}				
                var currentNode = null
                if(e.target == null)
                { 
                    currentNode  =oafsm.Sel.parentNode
                }
                else
                {
                    currentNode = e.target.parentNode
                }
                var siblings = currentNode.parentNode.childNodes
                for (var i=0; i<siblings.length; i++)
                {
                  if( (siblings[i] != currentNode) && (siblings[i] != menuli) && (siblings[i] != null) && (siblings[i].tagName == "LI") )
                  {
                    var sibChilds = siblings[i].getElementsByTagName('ul');
                    if(sibChilds != null)
                    for(var ind=0;ind<sibChilds.length;ind++)
                        oafsm.Shm(sibChilds[ind], false,false);
                  }
                }
                oafsm.hideMenu = submenu;
                if (oafsm.isIE)
                {					                                        
                  oafsm.Ssm(header, submenu, dir,false,false)
                }
                else
                {
                  if("hidden"==submenu.style.visibility)
                      oafsm.Ssm(header, submenu, dir,false,false)
                }
                if(menuItems[0])
                {
                  if(menuItems[0].firstChild)
                    menuItems[0].firstChild.focus();
                }
                  
              }
            }
         }//ItsFunction
         else
         {
            var currentNode = null
            if(e.target == null)
            { 
                currentNode  =oafsm.Sel.parentNode
            }
            else
            {
                currentNode = e.target.parentNode
            }
            var siblings = currentNode.parentNode.childNodes
            for (var i=0; i<siblings.length; i++)
            {
                if( (siblings[i] != currentNode) && (siblings[i] != menuli) && (siblings[i] != null) && (siblings[i].tagName == "LI") )
                {
                  var sibChilds = siblings[i].getElementsByTagName('ul');
                  if(sibChilds != null)
                  for(var ind=0;ind<sibChilds.length;ind++)
                    oafsm.Shm(sibChilds[ind], false,false);
                }
            }				                
         }
},
Ssm:function(header, submenu, dir, isFav,isTop){		    
    submenu.style.visibility="visible";    
    var sfTop = oafsm.sfTop;
    var upArr = null;
    var dnArr = null;
    if(!isTop)
       submenu.style.zIndex=2001;       
    if(isTop)
    {
        var snTop = oafsm.snTop;
        if ((!isFav) && (snTop != null))
        {
          snTop.style.visibility ="visible";
          if(! (oafsm.isIE))
          {
            snTop.style.width = "278px";
            submenu.style.width = "278px";
          }
          upArr = snTop.childNodes[0];
          dnArr = snTop.childNodes[2];          
          if((upArr != null) && (dnArr != null))
          {                    
            upArr.style.visibility="visible"
            dnArr.style.visibility="visible"
          }
        }
        else if ((sfTop != null) && (isFav) )
        {
          sfTop.style.visibility ="visible";
          if(! (oafsm.isIE))
          {
            sfTop.style.width = "278px";
            submenu.style.width = "278px";
          }
          upArr = sfTop.childNodes[0];
          dnArr = sfTop.childNodes[2];
          if((upArr != null) && (dnArr != null))
          {                    
            upArr.style.visibility="visible"
            dnArr.style.visibility="visible"
          }
        }
    }    
},

Shm:function(submenu,iSclick,isFav){
    if(submenu != null)
    {
        if (typeof submenu._pos!="undefined")
            this.css(this.StIt[submenu._master][parseInt(submenu._pos)], "selected", "remove")
        clearInterval(submenu._animatetimer)
        var sfTop = oafsm.sfTop;
        var snTop = oafsm.snTop;
        
        // BiDi hanlding in menu
        if (isBiDi())
        {
           if(oafsm.isIE)
           {
               if((sfTop != submenu) && (snTop != submenu) )
                    submenu.style.right=0
           }
           else         
               submenu.style.right=0
        }
        else
        {
            if(oafsm.isIE)
            {
                if((sfTop != submenu) && (snTop != submenu) )
                    submenu.style.left=0
            }
            else
                submenu.style.left=0
        }
        // End BiDi
        submenu.style.top="-1000px"
        submenu.style.visibility="hidden"
        if(iSclick)
        {          
          var upArr = null;
          var dnArr = null;
          if(isFav)
          {
              upArr = sfTop.childNodes[0];
              dnArr = sfTop.childNodes[2];
          }
          else
          { 
              upArr = snTop.childNodes[0];
              dnArr = snTop.childNodes[2];
          }
          if((upArr != null) && (dnArr != null))
          {
            upArr.style.visibility="hidden";        
            dnArr.style.visibility="hidden";
          }
        }                
  }
},

SaEv:function(target, functionref, tasktype) {
	if (target.addEventListener)
		target.addEventListener(tasktype, functionref, false);
	else if (target.attachEvent)
		target.attachEvent('on'+tasktype, function(){return functionref.call(target, window.event)});
},

SrEv:function(target, functionref, tasktype) {
	if (target.removeEventListener)
		target.removeEventListener(tasktype, functionref, false);
	else if (target.detachEvent)            
		target.detachEvent('on'+tasktype, function(){return functionref.call(target, window.event)});
},

Sinit:function(mainmenuid, dir){
	// AJX request
	oafsm.SgXmlHO()
		
	this.standardbody=(document.compatMode=="CSS1Compat")? document.documentElement : document.body
	this.StItI=-1
	this.Suli=-1
	this.StmId.push(mainmenuid)
	this.StIt[mainmenuid]=[] //declare array on object
	this.Ssul[mainmenuid]=[] //declare array on object
	this.Shti[mainmenuid]=[] //declare hide entire menu timer
        oafsm.snTop = document.getElementById("SDivTop");
        oafsm.sfTop = document.getElementById("SFavTop");           
	var menubar=document.getElementById(mainmenuid)
	var alllinks=menubar.getElementsByTagName("a")
	this.Sgws()
	var ShmOnc = null
	for (var i=0; i<alllinks.length; i++){
		if (alllinks[i].getAttribute('rel')){
			this.StItI++
			this.Suli++
			var menuitem=alllinks[i]
			this.StIt[mainmenuid][this.StItI]=menuitem //store ref to main menu links
			var dropul=document.getElementById(menuitem.getAttribute('rel'))

                        if(dropul != null)
                        {
                            this.SaEv(dropul, function(e){                                  
                                  oafsm.Shioc = false;
                            }, "click")
                        }			
			document.body.appendChild(dropul) //move main ULs to end of document
                        var favList = document.getElementById('FavList');
                        if(favList != null)
                        {
                          this.SaEv(favList, function(e){                             
                    	    oafsm.Shioc = false;      
			  }, "click")                          
                        }
			dropul._master=mainmenuid  //Indicate which main menu this main UL is associated with
			dropul._pos=this.StItI //Indicate which main menu item this main UL is associated with
			ShmOnc = dropul

			this.Sbm(mainmenuid, menuitem, dropul, this.Suli, true, dir,null) //build top level menu

			this.SaEv(dropul, function(e){ //hide menu if mouse moves out of main UL element into open space				
				if (!oafsm.SiC(this, e) && !oafsm.SiC(oafsm.StIt[this._master][parseInt(this._pos)], e)){
                                    var dropul=this				
                                    oafsm.Shti[this._master][this._pos]=setTimeout(function(){
                                    }, oafsm.Shi)
				}					
			}, "mouseout")                    
 		}
    }	  
    this.SaEv(window, function(){oafsm.Sgws(); oafsm.Sgtid()}, "resize")
},

  SpXml:function()
  {
        var loadDone = false        
        currentCount = 0
        xmlDoc = oafsm.xmlHttp.responseXML
        if(!xmlDoc || xmlDoc.childNodes.length==0)
        {
          var text = oafsm.xmlHttp.responseText          
          xmlDoc = oafsm.SlXmlCS(text)
        }        
        if (xmlDoc != null)       
        {
         var error = xmlDoc.getElementsByTagName("error");
         if ((error != null) && (error.length > 0) )
         {
            oafsm.sessExpire(error);
         }
         else if(!(oafsm.SiRLC))
         {
           if(!oafsm.SisRL)
           {
             var temp = xmlDoc.childNodes[0];
             var temp1 = temp.childNodes[0];           
             var respNames = xmlDoc.getElementsByTagName("RESPNAME");           
             var respKeys = xmlDoc.getElementsByTagName('RESPID');
             var applNames = xmlDoc.getElementsByTagName("APPLID");
             var SsgId = xmlDoc.getElementsByTagName("SECGRPID");             
             if(oafsm.isIE)
               oafsm.mngNavUrl = xmlDoc.getElementsByTagName("MNGNAVURL")[0].text;
             else
               oafsm.mngNavUrl = xmlDoc.getElementsByTagName("MNGNAVURL")[0].textContent;
             var mngNav = xmlDoc.getElementsByTagName("LookupCode");
             if(mngNav != null)
             {                         
               for(var ind=0; ind<mngNav.length; ind++)
               {
                 if (oafsm.isIE)
                 {
                   if(mngNav[ind].text == "MNG_NAV")
                   {
                     oafsm.manageNav = mngNav[ind].nextSibling.text;
                     break;
                   }
                 }
                 else
                 {
                   if(mngNav[ind].textContent == "MNG_NAV")
                   {
                     oafsm.manageNav = mngNav[ind].nextSibling.textContent;
                     break;
                   }                   
                 }                
                }
              }            
              oafsm.SrInf[0] = new Array() // to Store respName information
              oafsm.SrInf[1] = new Array() // to store respKey information
              oafsm.SrInf[2] = new Array() // to store applName information
              oafsm.SrInf[3] = new Array() // to store SecGrp information
           
              for(var ind=0; ind<respNames.length; ind++)
              {     
                oafsm.SrInf[0][ind]= respNames[ind];
                oafsm.SrInf[1][ind]= respKeys[ind];
                oafsm.SrInf[2][ind]= applNames[ind];
                oafsm.SrInf[3][ind]= SsgId[ind];
              }
              oafsm.SiRLC = true;
            }
          }
        }    
  },
  sessExpire:function(error)
  {
    if( (error[0].childNodes[0] != null) && (error[0].childNodes[1] != null) )
    {
      var code = null;
      var message = null;
      if (oafsm.isIE)
      {
        code = error[0].childNodes[0].text;
        message = error[0].childNodes[1].text;
        if(error[0].childNodes[2] != null)
        oafsm.SmsgTxt = error[0].childNodes[2].text;
      }
      else
      {
        code = error[0].childNodes[0].textContent;
        message = error[0].childNodes[1].textContent;
        if(error[0].childNodes[2] != null)
          oafsm.SmsgTxt = error[0].childNodes[2].textContent;
      }           
      if( ("401" == code) && ("FND_SESSION_EXPIRED" == message) )
      {
        oafsm.Stout = true;
        oafsm.Shioc = true;
        oafsm.Shide();               
        alert(oafsm.SmsgTxt);
        window.location.reload();
      }
    }  
  },
  SpFXml:function()
  {
    var loadDone = false   
    currentCount = 0
    xmlDoc = oafsm.xmlHttp.responseXML
    if(!xmlDoc || xmlDoc.childNodes.length==0)
    {
          var text = oafsm.xmlHttp.responseText        
          xmlDoc = oafsm.SlXmlCS(text)
          
    }
        
    if (xmlDoc != null)       
    {        
         var error = xmlDoc.getElementsByTagName("error");
         if ((error != null) && (error.length > 0) )
         {
           oafsm.sessExpire(error);
         }
         else
         {
           var favs = xmlDoc.getElementsByTagName("Favorites");
           var favIn = xmlDoc.getElementsByTagName("AddInfo");
           if(xmlDoc.getElementsByTagName("Favorites") != null)
           {
             favs = favs[0]             
           }
           if(xmlDoc.getElementsByTagName("AddInfo") != null)
           {
             favIn = favIn[0]             
           }
           if(favs != null)
              oafsm.favRoot = favs;              
           if(favIn != null)
              oafsm.favInfo = favIn;
           if (oafsm.isIE)
           {
             oafsm.mngFavUrl = xmlDoc.getElementsByTagName("MNGFAVURL")[0].text;
             oafsm.addFavUrl = xmlDoc.getElementsByTagName("ADDFAVURL")[0].text;
           }
           else
           {
             oafsm.mngFavUrl = xmlDoc.getElementsByTagName("MNGFAVURL")[0].textContent;
             oafsm.addFavUrl = xmlDoc.getElementsByTagName("ADDFAVURL")[0].textContent;
           }
           var mngFav = xmlDoc.getElementsByTagName("LookupCode");
           if(mngFav != null)
           {                         
               for(var ind=0; ind<mngFav.length; ind++)
               {
                 if (oafsm.isIE)
                 {
                   if(mngFav[ind].text == "MNG_FAV")
                     oafsm.manageFav = mngFav[ind].nextSibling.text;                     
                   if(mngFav[ind].text == "ADD_FAV")
                     oafsm.addFav = mngFav[ind].nextSibling.text;
                 }
                 else
                 {
                   if(mngFav[ind].textContent == "MNG_FAV")
                     oafsm.manageFav = mngFav[ind].nextSibling.textContent;
                   if(mngFav[ind].textContent == "ADD_FAV")
                     oafsm.addFav = mngFav[ind].nextSibling.textContent;
                 }                
                }
           }            
         }
    }  
  },
  SpMXml:function()
  {    
    var loadDone = false   
    currentCount = 0
    xmlDoc = oafsm.xmlHttp.responseXML
    if(!xmlDoc || xmlDoc.childNodes.length==0)
    {
          var text = oafsm.xmlHttp.responseText        
          xmlDoc = oafsm.SlXmlCS(text)
    }
        
    if (xmlDoc != null)       
    {        
         var error = xmlDoc.getElementsByTagName("error");
         if ((error != null) && (error.length > 0) )
         {
           oafsm.sessExpire(error);
         }
         else
         {    
           var rootMenu = xmlDoc.getElementsByTagName("ROOTMENU");
           if(xmlDoc.getElementsByTagName("ROOTMENU") != null)
           {
             rootMenu = rootMenu[0]
           }
           if(rootMenu != null)
              oafsm.SgFunc(rootMenu);             
         }
     }
  },
  
  SgFunc:function(menu)
  {    
    var ind = 0
    if(menu != null)
    {
        var menuItemList = menu.childNodes;
        var childCount = menuItemList.length;
        var innerdiv = null;
        var functionList = null;
        var menuList = [];
        menuList[0] = new Array();  // Menu Prompt. 
        menuList[1] = new Array();  // Menu Id.

        var funcList = [];
        funcList[0] = new Array();  // Function name. 
        funcList[1] = new Array();  // Function URL.
        funcList[2] = new Array();  // Function Type. 

        var menuListInd = 0;
        var funcListInd = 0;        
        var ulAdded = false;
        var maxWidth = 0;
        var menuItemLength = 0;
        
        // Loop to find out max width of menu item.
        if(childCount == 0)
          oafsm.ScRli.shortDesc="noChild";
        for (var i = 0; i < childCount; i++)
        {                 
            if(menuItemList[i].tagName=="FUNCTIONNAME")
            {   
                var functionName = null;
                if (oafsm.isIE)
                  functionName = menuItemList[i].text;
                else
                  functionName = menuItemList[i].textContent;
                  
                menuItemLength = functionName.length*9; 
            }            
            else if(menuItemList[i].tagName=="MENU")
            {
                var menuPrompt = null;            
                if (oafsm.isIE)
                  menuPrompt = menuItemList[i].childNodes[0].text;
                else
                  menuPrompt = menuItemList[i].childNodes[0].textContent;
                menuItemLength = menuPrompt.length*9 
            }            
            if(menuItemLength > maxWidth)
            {
              maxWidth =  menuItemLength;
            }            
        }        
        if(maxWidth > 270)
          maxWidth=270;        
        if(maxWidth < 90)
          maxWidth=90;            
        for (var i = 0; i < childCount; i++)
        {                 
           if(!ulAdded)
           {
               ulAdded=true;
               functionList = document.createElement("ul");
               functionList.id='sFuncList';
               if (oafsm.isIE)
               {
                   oafsm.ScRli.appendChild(functionList)
               }
               else
               {
                   var shiftcontainer = document.createElement("div")
                   shiftcontainer.className='shiftcontainer'
                   var shadowcontainer = document.createElement("div")
                   shadowcontainer.className='shadowcontainer'
                   innerdiv = document.createElement("div")
                   innerdiv.className='innerdiv'
                   oafsm.ScRli.appendChild(functionList)
                   functionList.appendChild(shiftcontainer)
                   shiftcontainer.appendChild(shadowcontainer)
                   shadowcontainer.appendChild(innerdiv)    
               }    
            }
            if(menuItemList[i].tagName=="FUNCTIONNAME")
            {   
                //Get next siblings for functionURL and functionType.                
                var functionName = null;
                var functionUrlNode = null;
                var functionUrl = null;
                var functionType = null;
                if (oafsm.isIE)
                {
                   functionName = menuItemList[i].text;
                   functionUrlNode = menuItemList[i].nextSibling;
                   functionUrl = functionUrlNode.text;
                   functionType = functionUrlNode.nextSibling.text;                  
                }
                else
                {
                  functionName = menuItemList[i].textContent;
                  functionUrlNode = menuItemList[i].nextSibling;
                  functionUrl = functionUrlNode.textContent;
                  functionType = functionUrlNode.nextSibling.textContent;
                }
                if((oafsm.SblockNav)&&(functionType != "FORM"))
                  functionUrl = "javascript:_submitNav('DefaultFormName','"+functionUrl+"')";
                funcList[0][funcListInd] = functionName;
                funcList[1][funcListInd] = functionUrl;
                funcList[2][funcListInd] = functionType;
                funcListInd = funcListInd + 1;
            }
            else if(menuItemList[i].tagName=="FUNCTIONURL")
            {
               continue;
            }
            else if(menuItemList[i].tagName=="FUNCTIONTYPE")
            {
               continue;
            }
            else
            {             
               if(menuItemList[i].tagName=="MENU")
               {
                    var menuId = -1;
                    if (oafsm.isIE)
                        menuId = menuItemList[i].childNodes[1].text;
                    else
                        menuId = menuItemList[i].childNodes[1].textContent; 
                    menuList[0][menuListInd] = menuItemList[i];
                    menuList[1][menuListInd] = menuId 
                    menuListInd = menuListInd + 1;
               }
            }
        }    
        
        for(var j=0; j<menuList[0].length; j++)
        {
            var childMenu =  menuList[0][j];
            var menuPrompt = null;
            var menuId = null;
            if (oafsm.isIE)
              menuPrompt = menuList[0][j].childNodes[0].text;            
            else            
              menuPrompt = menuList[0][j].childNodes[0].textContent;            
           
           var menuLi = document.createElement('li');
           menuLi.id = menuList[1][j];           
           var anchorTag = document.createElement("a");
           anchorTag.href= '#';           
           menuLi.style.width = maxWidth+'px';    
            
           var menuImgTag = document.createElement("img")
           menuImgTag.className='image'
           menuImgTag.src = '/OA_MEDIA/fwkhp_folder.gif'
           anchorTag.appendChild(menuImgTag)          
           anchorTag.appendChild(document.createTextNode("\u00a0 \u00a0"+menuPrompt)); 
           
           menuLi.appendChild(anchorTag);
           if (oafsm.isIE)
                functionList.appendChild(menuLi);           
           else
                innerdiv.appendChild(menuLi);           
        }        
        for(var j=0; j<funcList[0].length; j++)
        {
                var liTag = document.createElement("li")
                liTag.id="FUNCTION";
                
                liTag.style.width = maxWidth+'px';
                var anchorTag = document.createElement("a");
                anchorTag.href= funcList[1][j];
                var funcImgTag = document.createElement("img")
                funcImgTag.className='image'
                
                if("FORM" == funcList[2][j])
                  funcImgTag.src = '/OA_MEDIA/fwkhp_formsfunc.gif'
                else 
                  funcImgTag.src = '/OA_MEDIA/fwkhp_sswafunc.gif'
    
                anchorTag.appendChild(funcImgTag)          
                anchorTag.appendChild(document.createTextNode("\u00a0 \u00a0"+funcList[0][j])); 
           
                liTag.appendChild(anchorTag)
                if (oafsm.isIE)
                    functionList.appendChild(liTag)
                else
                    innerdiv.appendChild(liTag)                                                                
        }        
    }
  },
  addFavE:function(favName,favUrl,favType,isNW,Scroll)
  {
            var liTag = document.createElement("li")
            liTag.style.width=270+'px';
            if("Y"==Scroll)
              liTag.id='ScrollResp';
            liTag.shortDesc = "SFAV";  
            var anchorTag = document.createElement("a")
            if((oafsm.SblockNav)&&(favType != "FORM"))
                  favUrl = "javascript:_submitNav('DefaultFormName','"+favUrl+"')";
            anchorTag.href = favUrl;
            if(isNW == "Y")
              anchorTag.target="_blank";
            var favImgTag = document.createElement("img")
            favImgTag.className='image'
            if("XXX"==favType)
              favImgTag.src = '/OA_MEDIA/fwkhp_webpage.gif'
            else if ("FORM"==favType) 
              favImgTag.src = '/OA_MEDIA/fwkhp_formsfunc.gif'
            else    
              favImgTag.src = '/OA_MEDIA/fwkhp_sswafunc.gif'
            anchorTag.appendChild(favImgTag)          
            if(favName.length > 36)
            {
                anchorTag.title = favName;
                favName = favName.substring(0,33) +'...';
            }
            anchorTag.appendChild(document.createTextNode("\u00a0 \u00a0"+favName))
            liTag.appendChild(anchorTag)            
            return liTag;
  },
  mgFlink:function(isScr)
  {
        var manageFav = document.createElement("li");
        manageFav.style.width=270+'px';
        manageFav.id = 'mngFav';
        var anchor = document.createElement("a");
        manageFav.id = "CustomAppsNavLink";
        anchor.id = "CustomAppsNavLink";
        if ((oafsm.isIE) && (isScr) )
            manageFav.style.marginLeft="-18px";
        var mngUrl = oafsm.mngFavUrl;
        if(oafsm.SblockNav)
            anchor.href = "javascript:_submitNav('DefaultFormName','"+mngUrl+"')";
        else
            anchor.href = mngUrl;
                
        var image = document.createElement("img");
        image.className='image';
        image.src='/OA_MEDIA/manageobject_enabled.gif';
        image.align='absmiddle';
        anchor.appendChild(image);
        
        anchor.appendChild(document.createTextNode("\u00a0 \u00a0"+oafsm.manageFav));
        manageFav.appendChild(anchor);
        return manageFav;
  },
  adFlink:function(isScr)
  {
        var addFav = null;
        var isdirty = null;
        var isGlobalPage = null;
        var addFavorite = null;
        if (oafsm.isIE)        
        {
            isdirty = oafsm.favInfo.childNodes[0].text;
            isGlobalPage = oafsm.favInfo.childNodes[1].text;
            addFavorite = oafsm.favInfo.childNodes[2].text;
        }
        else
        {
            isdirty = oafsm.favInfo.childNodes[0].textContent;
            isGlobalPage = oafsm.favInfo.childNodes[1].textContent;
            addFavorite = oafsm.favInfo.childNodes[2].textContent;
        }
        if(("N"==isdirty)&&("Y"==addFavorite)&&("N"==isGlobalPage)&&(!oafsm.isJtt))
        {
            addFav = document.createElement("li");
            addFav.style.width=270+'px';
            addFav.id = 'addFav';
            var anchorAF = document.createElement("a");
            anchorAF.id = "CustomAppsNavLink";
            addFav.id = "CustomAppsNavLink";
            if( (oafsm.isIE) &&(isScr) )
                addFav.style.marginLeft="-18px";            
            var addUrl = oafsm.addFavUrl;
            if(oafsm.SblockNav)
                anchorAF.href = "javascript:_submitNav('DefaultFormName','"+addUrl+"')";
            else
                anchorAF.href = addUrl;
                
            var imageAF = document.createElement("img");
            imageAF.className='image';
            imageAF.src='/OA_MEDIA/addFavorites.gif';
            imageAF.align='absmiddle';
            anchorAF.appendChild(imageAF);
        
            anchorAF.appendChild(document.createTextNode("\u00a0 \u00a0"+oafsm.addFav));
            addFav.appendChild(anchorAF);
        }
        return addFav;
  },
  ScrFL:function(submenu)
  {
    var fCon = document.getElementById('fContainer');
    oafsm.isF=true;
    if(fCon == null)
    {
        var fChilds = oafsm.favRoot.childNodes; 
        var favLength = fChilds.length;
        var shiftcontainer = document.createElement("div")
        shiftcontainer.className='shiftcontainer'
        var shadowcontainer = document.createElement("div")
        shadowcontainer.className='shadowcontainer'
        var innerdiv = document.createElement("div")
        innerdiv.className='innerdiv'                    
        innerdiv.style.borderStyle="none solid solid solid";
        if (!(oafsm.isIE))
          submenu.appendChild(shiftcontainer)
        shiftcontainer.appendChild(shadowcontainer)
        shadowcontainer.appendChild(innerdiv)

        var favName = null;
        var favUrl = null;
        var favType = null;
        var isNW = null;
        if(favLength > 15)
        {            
            var SFavTop = oafsm.sfTop;
            var SuArr = oafsm.addScrUp(true);
            oafsm.suAf = SuArr;
            SFavTop.appendChild(SuArr);          
            var scrollCont = document.createElement('div');           
            scrollCont.id='fContainer';          
            submenu.style.height=300+'px';          
            scrollCont.appendChild(submenu);            
            SFavTop.appendChild(scrollCont);
            for(var i=0; i<favLength; i++)
            {                
                if (oafsm.isIE)
                {
                  favName = fChilds[i].childNodes[0].text;
                  favUrl =  fChilds[i].childNodes[1].text;
                  favType = fChilds[i].childNodes[2].text;
                  isNW =    fChilds[i].childNodes[3].text;
                }
                else
                {
                  favName = fChilds[i].childNodes[0].textContent;
                  favUrl =  fChilds[i].childNodes[1].textContent;
                  favType = fChilds[i].childNodes[2].textContent;
                  isNW =    fChilds[i].childNodes[3].textContent;
                }                
                var liTag = oafsm.addFavE(favName,favUrl,favType,isNW,"Y"); 
                if(i >= 15)
                  liTag.style.display='none';

                if (oafsm.isIE)
                {
                    submenu.style.borderStyle="none none none none";
                    submenu.appendChild(liTag)
                }
                else
                {
                    innerdiv.appendChild(liTag)                
                }
            }
            oafsm.SisFL = true;
            //Down arrow
            var SdArr = document.createElement('div');
            SdArr.id='SdownArrow';
            oafsm.sdAf = SdArr;
            var SdArrIm = document.createElement('img');
            SdArrIm.src='/OA_MEDIA/shuttle_movedown_enabled.gif';
            var SbArrIm = document.createElement('img');
            SbArrIm.src='/OA_MEDIA/shuttle_movetobottom_enabled.gif';          
            SdArrIm.className = 'scrImg';
            SdArrIm.id='SdArrIm';
            SbArrIm.className = 'scrImg';
            SbArrIm.id='SbArrIm';
            SbArrIm.title='Move to bottom';

            oafsm.SdArrImF=SdArrIm; oafsm.SbArrImF=SbArrIm;
        
            var separator = document.createElement("li");
            separator.className='separator';
            var line = document.createElement("HR");
            separator.appendChild(line);
            var manageFav = oafsm.mgFlink(true);
            var addFav = oafsm.adFlink(true);
            var lbreak1 = document.createElement("div");        
            lbreak1.style.size=0;
            if (!(oafsm.isIE))                    
                lbreak1.style.height="9px";
            else
                lbreak1.style.height="1px";
            var scrSep = document.createElement("HR");           
            scrSep.style.height="0.1px";
            var Sdinnerdiv = null;
            if (oafsm.isIE)
            {    
                SdArr.style.width=270+"px";
                SdArr.style.border="1px solid #c9cbd3";
                SdArr.style.borderStyle="none solid solid solid";            
                SdArr.appendChild(line);
                SdArr.appendChild(manageFav);  
                if(addFav != null)
                  SdArr.appendChild(addFav);  
                scrSep.style.color="#CCCCCC";
                SdArr.appendChild(scrSep);
                SdArr.appendChild(SdArrIm);        
                SdArr.appendChild(lbreak1);            
                SdArr.appendChild(SbArrIm);              
                SFavTop.appendChild(SdArr);            
            }
            else
            {
                var Sshiftcontainer = document.createElement("div")
                Sshiftcontainer.className='shiftcontainer'
                var Sshadowcontainer = document.createElement("div")
                Sshadowcontainer.className='shadowcontainer'
                Sdinnerdiv = document.createElement("div")
                Sdinnerdiv.className='innerdiv'        
                Sdinnerdiv.style.borderStyle="none solid solid solid";                   
                        
                Sdinnerdiv.appendChild(separator);
                Sdinnerdiv.appendChild(manageFav);   
                if(addFav != null)
                  Sdinnerdiv.appendChild(addFav); 
                scrSep.style.color="#FFFFFF";
                Sdinnerdiv.appendChild(scrSep);
                Sdinnerdiv.appendChild(SdArrIm);
                Sdinnerdiv.appendChild(lbreak1); 
                Sdinnerdiv.appendChild(SbArrIm);            
        
                SFavTop.appendChild(SdArr)
                Sshiftcontainer.appendChild(Sshadowcontainer)
                Sshadowcontainer.appendChild(Sdinnerdiv)
                SdArr.appendChild(Sshiftcontainer);
            }
            var fl = document.getElementById("FavList");
            oafsm.fLi = fl.getElementsByTagName('li');
            oafsm.srLengthF = favLength;
            oafsm.scroll(true);
            // Scroll wheel
            oafsm.isF = true;
            var fCon = document.getElementById("fContainer");
            if (fCon.addEventListener)
            /** DOMMouseScroll is for mozilla. */
                fCon.addEventListener('DOMMouseScroll', oafsm.wheel, false);
            fCon.onmousewheel=function()
            {
                oafsm.wheel();
            }
            // Scroll wheel end
            var SdArrF = oafsm.sdAf;
            if(SdArrF != null)
            {
                this.SaEv(SdArrF, function(e){                     
                    oafsm.Shioc = false;
                }, "click")                          
            }
            var SuArrF = oafsm.suAf;
            if(SuArrF != null)
            {
                this.SaEv(SuArrF, function(e){                     
                    oafsm.Shioc = false;
                }, "click")                          
            }            
        }
        else
        {      
          var SFavTop = oafsm.sfTop;
          var scrollCont = document.createElement('div');           
          scrollCont.id='fContainer';
          scrollCont.appendChild(submenu);            
          SFavTop.appendChild(scrollCont);

          for(var i=0; i<favLength; i++)
          {               
            if (oafsm.isIE)
            {
              favName = fChilds[i].childNodes[0].text;
              favUrl =  fChilds[i].childNodes[1].text;
              favType = fChilds[i].childNodes[2].text;
              isNW =    fChilds[i].childNodes[3].text;
            }
            else
            {
              favName = fChilds[i].childNodes[0].textContent;
              favUrl =  fChilds[i].childNodes[1].textContent;
              favType = fChilds[i].childNodes[2].textContent;
              isNW =    fChilds[i].childNodes[3].textContent;
            }    
            var liTag = oafsm.addFavE(favName,favUrl,favType,isNW,"N")
            if (oafsm.isIE)
                submenu.appendChild(liTag)
            else
                innerdiv.appendChild(liTag)                
          }          
          //AddInfo Node
          var separator = document.createElement("li");
          separator.className='separator';
          var line = document.createElement("HR");        
          separator.appendChild(line);
        
          var manageFav = oafsm.mgFlink(false);
          var addFav = oafsm.adFlink(false);
          
          if (oafsm.isIE)
          {
              submenu.appendChild(separator);
              submenu.appendChild(manageFav);
              if(addFav != null)
                submenu.appendChild(addFav);
          }
          else
          {
            innerdiv.appendChild(separator); 
            innerdiv.appendChild(manageFav);          
            if(addFav != null)
                innerdiv.appendChild(addFav);
          }
        }
    }
  },
  addScrUp:function(isFav)
  {
    var SuArr = document.createElement('div');
    SuArr.id='SupArrow';
    var SuArrIm = document.createElement('img');
    SuArrIm.align='center';
    SuArrIm.src='/OA_MEDIA/shuttle_moveup_disabled.gif';
    SuArrIm.id='SuArrIm';
    SuArrIm.className='scrImgUp';   
          
    var StArrIm = document.createElement('img');
    StArrIm.align='center';
    StArrIm.title='Move to top';
    StArrIm.src='/OA_MEDIA/shuttle_movetotop_disabled.gif';
    StArrIm.id='StArrIm';
    StArrIm.className='scrImg';
    
    if(isFav)
    {
      oafsm.StArrImF=StArrIm; oafsm.SuArrImF=SuArrIm;
    }
    else
    {
      oafsm.StArrImN=StArrIm; oafsm.SuArrImN=SuArrIm;
    }
    var lbreak = document.createElement("div");        
    lbreak.style.size=0;
    if (!(oafsm.isIE))
        lbreak.style.height="9px";
    else
        lbreak.style.height="1px";
    var scrSepUp = document.createElement("HR");           
    scrSepUp.style.height="0.1px";
    var Sinnerdiv = null;
    if (oafsm.isIE)
    {
        SuArr.style.border="1px solid #c9cbd3";                      
        SuArr.style.width=270+"px";
        SuArr.appendChild(StArrIm);
        SuArr.appendChild(lbreak);            
        SuArr.appendChild(SuArrIm);
        scrSepUp.style.color="#CCCCCC";
        SuArr.appendChild(scrSepUp);
    }
    else
    {
        var Sshiftcontainer = document.createElement("div")
        Sshiftcontainer.className='shiftcontainer'
        var Sshadowcontainer = document.createElement("div")
        Sshadowcontainer.className='shadowcontainer'
        Sinnerdiv = document.createElement("div")
        Sinnerdiv.className='innerdiv'
        Sinnerdiv.appendChild(StArrIm);
        Sinnerdiv.appendChild(lbreak);
        Sinnerdiv.appendChild(SuArrIm);   
        scrSepUp.style.color="#FFFFFF";
        Sinnerdiv.appendChild(scrSepUp);
        Sshiftcontainer.appendChild(Sshadowcontainer)
        Sshadowcontainer.appendChild(Sinnerdiv)
        SuArr.appendChild(Sshiftcontainer);
    }   
    return SuArr;
  },
  addResp:function(innerdiv,i,Scroll)
  {
              oafsm.SisRL=true
              var liTag = document.createElement("li")
              liTag.style.width=270+'px';
              if("Y"==Scroll)
               liTag.id='ScrollResp';    
              var anchorTag = document.createElement("a")
              anchorTag.href="#";
              
              var respImgTag = document.createElement("img")
              respImgTag.className='image'
              respImgTag.src = '/OA_MEDIA/fwkhp_folder.gif'
    
              anchorTag.appendChild(respImgTag)          
              if (oafsm.isIE)
              {            
                var respText = oafsm.SrInf[0][i].text;                        
                if(respText.length > 36)
                {
                  anchorTag.title = respText;
                  respText = respText.substring(0,33) +'...';
                }
                anchorTag.appendChild(document.createTextNode("\u00a0 \u00a0"+respText))                      
              }
              else
              { 
                var Srt = oafsm.SrInf[0][i].textContent;
                if(Srt.length > 36)
                {
                  anchorTag.title = Srt;
                  Srt = Srt.substring(0,33) +'...';
                }            
                anchorTag.appendChild(document.createTextNode("\u00a0 \u00a0"+Srt))          
              }
              liTag.appendChild(anchorTag)
          
              if(i >= 15)
                liTag.style.display='none';
              if (oafsm.isIE)
              {
                if("Y"==Scroll)
                  innerdiv.style.borderStyle="none none none none";
                innerdiv.appendChild(liTag);
              }
              else
                innerdiv.appendChild(liTag);
  },
  addMngnav:function()
  {
    oafsm.mgNavli = document.createElement("li");
    var mgNav = document.createElement("a");          
    oafsm.mgNavli.id = "CustomAppsNavLink";
    if (oafsm.isIE)
       oafsm.mgNavli.style.marginLeft="-18px";
    mgNav.id = "CustomAppsNavLink"; 
    var mgUrl = oafsm.mngNavUrl
    if(oafsm.SblockNav)
        mgNav.href = "javascript:_submitNav('DefaultFormName','"+mgUrl+"')";
    else
        mgNav.href = mgUrl;
    mgNav.style.textDecoration="none";      
    mgNav.style.color="#013d74"; 
    var image = document.createElement("img");
    image.className='image';
    image.src='/OA_MEDIA/manageobject_enabled.gif';
    image.align='absmiddle';
    mgNav.appendChild(image);        
    mgNav.appendChild(document.createTextNode("\u00a0 \u00a0"+oafsm.manageNav ));
    oafsm.mgNavli.appendChild(mgNav);  
  },
  ScrRL:function(submenu)
  {
    var sChilds = submenu.childNodes; 
    oafsm.noMngNav = false;
    oafsm.isF=false;
    var innerdiv = null;
    for(var k=0; k<sChilds.length; k++)
    {
     if((sChilds[k].className=="shiftcontainer")||("mngResp" == sChilds[k].id)) 
        oafsm.noMngNav = true;
    }
    if(!oafsm.SisRL)
    {
      if(oafsm.SrInf[0] != null)
      {
        var innerdiv = null;
        if (!(oafsm.isIE))
        {
            var shiftcontainer = document.createElement("div")
            shiftcontainer.className='shiftcontainer'
            var shadowcontainer = document.createElement("div")
            shadowcontainer.className='shadowcontainer'
            innerdiv = document.createElement("div")
            innerdiv.className='innerdiv'                    
            innerdiv.style.borderStyle="none solid solid solid";
        
            if(!oafsm.noMngNav)
            {        
              submenu.appendChild(shiftcontainer)
              shiftcontainer.appendChild(shadowcontainer)
              shadowcontainer.appendChild(innerdiv)
            }
        } 
        var respLength = oafsm.SrInf[0].length;
        oafsm.rLen=respLength;        
        if(respLength > 15)
        {
          var SDivTop = oafsm.snTop;
          var SuArr = oafsm.addScrUp(false);
          oafsm.suAn = SuArr;
          SDivTop.appendChild(SuArr);          
          var scrollCont = document.createElement('div');           
          scrollCont.id='sContainer';          
          submenu.style.height=300+'px';          
          scrollCont.appendChild(submenu);
          SDivTop.appendChild(scrollCont);
          
          for(var i=0; i<respLength; i++)
          {
            if (oafsm.isIE)
              oafsm.addResp(submenu,i,"Y");
            else
              oafsm.addResp(innerdiv,i,"Y");
          } 
          //Down arrow
          var SdArr = document.createElement('div');
          SdArr.id='SdownArrow';          
          oafsm.sdAn = SdArr;
          var SdArrIm = document.createElement('img');
          SdArrIm.src='/OA_MEDIA/shuttle_movedown_enabled.gif';
          var SbArrIm = document.createElement('img');
          SbArrIm.src='/OA_MEDIA/shuttle_movetobottom_enabled.gif';          
          SdArrIm.className = 'scrImg';
          SdArrIm.id='SdArrIm';
          SbArrIm.className = 'scrImg';
          SbArrIm.id='SbArrIm';
          SbArrIm.title='Move to bottom';

          oafsm.SdArrImN=SdArrIm; oafsm.SbArrImN=SbArrIm;

          var separator = document.createElement("li");
          separator.className='separator';
          var line = document.createElement("HR");        
          separator.appendChild(line);
          
          oafsm.addMngnav();          
          var lbreak1 = document.createElement("div");        
          lbreak1.style.size=0;
          if (!(oafsm.isIE))
            lbreak1.style.height="9px";
          else
            lbreak1.style.height="1px";
          var scrSep = document.createElement("HR");           
          scrSep.style.height="0.1px";            
          var Sdinnerdiv = null;
          if (oafsm.isIE)
          {    
            SdArr.style.width=270+"px";
            SdArr.style.border="1px solid #c9cbd3";
            SdArr.style.borderStyle="none solid solid solid";            
            SdArr.appendChild(line);
            SdArr.appendChild(oafsm.mgNavli);  
            scrSep.style.color="#CCCCCC";
            SdArr.appendChild(scrSep);
            SdArr.appendChild(SdArrIm);
            SdArr.appendChild(lbreak1);
            SdArr.appendChild(SbArrIm);
            SDivTop.appendChild(SdArr);
          }
          else
          {
            var Sshiftcontainer = document.createElement("div")
            Sshiftcontainer.className='shiftcontainer'
            var Sshadowcontainer = document.createElement("div")
            Sshadowcontainer.className='shadowcontainer'
            Sdinnerdiv = document.createElement("div")
            Sdinnerdiv.className='innerdiv'        
            Sdinnerdiv.style.borderStyle="none solid solid solid";                   
                        
            Sdinnerdiv.appendChild(separator);
            Sdinnerdiv.appendChild(oafsm.mgNavli);   
            scrSep.style.color="#FFFFFF";
            Sdinnerdiv.appendChild(scrSep);
            Sdinnerdiv.appendChild(SdArrIm);
            Sdinnerdiv.appendChild(lbreak1); 
            Sdinnerdiv.appendChild(SbArrIm);            
        
            SDivTop.appendChild(SdArr)
            Sshiftcontainer.appendChild(Sshadowcontainer)
            Sshadowcontainer.appendChild(Sdinnerdiv)
            SdArr.appendChild(Sshiftcontainer);
          }
          oafsm.SlCon = document.getElementById("MenuList");
          var lisOld = oafsm.SlCon.getElementsByTagName('li');
          var j = 0;
          for(var i=0;i<lisOld.length;i++)
          {        
            if(lisOld[i].id == "ScrollResp") 
            {
              oafsm.lis[j] = lisOld[i];
              j++;
            }
          }
          oafsm.srLength = oafsm.lis.length;
          oafsm.scroll(false);          
          //Scroll wheel
          oafsm.isF = false;
          var sCon = document.getElementById("sContainer");
          if (sCon.addEventListener)
          /** DOMMouseScroll is for mozilla. */
              sCon.addEventListener('DOMMouseScroll', oafsm.wheel, false);
          sCon.onmousewheel=function()
          {
              oafsm.wheel();
          }
          //End 
          var SdArrN = oafsm.sdAn;
          if(SdArrN != null)
          {
            this.SaEv(SdArrN, function(e){                 
                oafsm.Shioc = false;
            }, "click")                          
          }
          var SuArrN = oafsm.suAn;
          if(SuArrN != null)
          {
            this.SaEv(SuArrN, function(e){                 
                oafsm.Shioc = false;
            }, "click")                          
          }          
        }
        else
        {
            var SDivTop = oafsm.snTop;
            var scrollCont = document.createElement('div');
            scrollCont.id='sContainer';
            scrollCont.appendChild(submenu);
            SDivTop.appendChild(scrollCont);
            oafsm.noScr = true;
            for(var i=0; i<respLength; i++)
            {
                if (oafsm.isIE)
                    oafsm.addResp(submenu,i,"N");
                else
                    oafsm.addResp(innerdiv,i,"N");
            }
            // Manage Navigator link.
            if(!oafsm.noMngNav)
            {
                var separator = document.createElement("li");
                separator.className='separator';
                var line = document.createElement("HR");        
                separator.appendChild(line);
                var manageResp = document.createElement("li");
                manageResp.style.width=270+'px';
                manageResp.id = 'mngResp';
                var anchor = document.createElement("a");
                anchor.id = "CustomAppsNavLink";
                var mngUrl = oafsm.mngNavUrl;
                if(oafsm.SblockNav)
                    anchor.href = "javascript:_submitNav('DefaultFormName','"+mngUrl+"')";
                else
                    anchor.href = mngUrl;                
                var image = document.createElement("img");
                image.className='image';
                image.src='/OA_MEDIA/manageobject_enabled.gif';
                image.align='absmiddle';
                anchor.appendChild(image);
        
                anchor.appendChild(document.createTextNode("\u00a0 \u00a0"+oafsm.manageNav));
                manageResp.appendChild(anchor);
                                
                if (oafsm.isIE)
                {
                    submenu.appendChild(separator);
                    submenu.appendChild(manageResp);
                }
                else
                {
                    innerdiv.appendChild(separator);
                    innerdiv.appendChild(manageResp);
                }
            }                  
        }
      }        
    }
  },
	  
  SgXmlHO:function()
  {
    try
    {
      // Firefox, Opera 8.0+, Safari, IE 7
      oafsm.xmlHttp = new XMLHttpRequest()
    }
    catch (e)
    {
      // Other Internet Explorer versions.
      try
      {
		oafsm.xmlHttp = new ActiveXObject("Msxml2.XMLHTTP")
      }
      catch (e)
      {
		oafsm.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
      }
    }
  },
  
  SlXmlCS:function(xmlData) 
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
  },

  Ssp:function(e) 
  {     
    var e = window.event || e;
    if(e.stopPropagation)
      e.stopPropagation();
    if(e.preventDefault)
      e.preventDefault();
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
  }, 

SlCon:null, zInterval:null,
direction:null,	        // direction we're scrolling the UL. 0==up, 1==down
ScInd:0, ScIndF:0, ScIndN:0,
MIN_LIST_HEIGHT:330,	// contracted height of the list

hideonScr:function() {
    var menuList = document.getElementById('MenuList');    
    var Ssul=menuList.getElementsByTagName("ul")
    if(Ssul != null)
    {
      for (var c=0; c<Ssul.length; c++)
      {
          oafsm.Shm(Ssul[c], false,false)
      }
    }                                 
},

scroll:function(isFav) {
    if(!document.getElementById)return; // bail out if this is an older browser
    var up,down,top,bottom = null;
    if(isFav)
    {
      up = oafsm.SuArrImF; down = oafsm.SdArrImF; 
      top = oafsm.StArrImF; bottom = oafsm.SbArrImF;
    }
    else
    {
        up = oafsm.SuArrImN; down = oafsm.SdArrImN; 
        top = oafsm.StArrImN; bottom = oafsm.SbArrImN;
    }
    if(!isFav)
    {
        mngNav = document.getElementById("CustomAppsNavLink");
        mngNav.onmouseover=function(){
        oafsm.hideonScr();
        }
    }
    down.onmouseover=function(){
        if(!isFav)
          oafsm.hideonScr();
        oafsm.scrollObjects(0, true,isFav,false);
    }
    down.onmouseout=function(){
        oafsm.stopScroll(0);
    }	
    up.onmouseover=function(){
    if(!isFav)
      oafsm.hideonScr();
    oafsm.scrollObjects(1, true, isFav,false);}
    up.onmouseout=function(){oafsm.stopScroll(1);}
    top.onclick=function()
    {
      oafsm.stopScroll(0,isFav);
      var scrLen = null;    
      var scrList = [];
      if(!isFav)
      {
        oafsm.hideonScr();
        scrLen = oafsm.srLength;
        scrList = oafsm.lis;
        oafsm.pgLen = 15;
      }
      else  
      {
        scrLen = oafsm.srLengthF;
        scrList = oafsm.fLi;
        oafsm.pgLenF = 15;
      }
      for(var i=15;i<scrLen;i++)
      {
        scrList[i].style.display='none';
      }            
      for(var i=0;i<15;i++)
      {
        if (oafsm.isIE)
          scrList[i].style.display='inline';
        else
          scrList[i].style.display='block';          
      }
      scrList[0].firstChild.focus();
      top.src='/OA_MEDIA/shuttle_movetotop_disabled.gif';      
      up.src='/OA_MEDIA/shuttle_moveup_disabled.gif';
      bottom.src='/OA_MEDIA/shuttle_movetobottom_enabled.gif';
      down.src='/OA_MEDIA/shuttle_movedown_enabled.gif';      
      if(isFav)
        oafsm.ScIndF = 0;
      else
        oafsm.ScIndN = 0;
    }
    bottom.onclick=function()
    {    
      var scrLen = null;    
      var scrList = [];
      oafsm.stopScroll(0,isFav);
      if(!isFav)
      {
        oafsm.hideonScr();        
        scrLen = oafsm.srLength;
        scrList = oafsm.lis;
        oafsm.pgLen = scrLen;
      }
      else  
      {
        scrLen = oafsm.srLengthF;
        scrList = oafsm.fLi;
        oafsm.pgLenF = scrLen;
      }          
      for(var i=0;i<scrLen-14;i++)
      {
        scrList[i].style.display='none';
      }
      for(var i=scrLen-15;i<scrLen;i++)
      {
        if (oafsm.isIE)     
          scrList[i].style.display='inline';
        else
          scrList[i].style.display='block';
      }      
      scrList[scrLen-15].firstChild.focus();
      top.src='/OA_MEDIA/shuttle_movetotop_enabled.gif';
      up.src='/OA_MEDIA/shuttle_moveup_enabled.gif';      
      bottom.src='/OA_MEDIA/shuttle_movetobottom_disabled.gif';
      down.src='/OA_MEDIA/shuttle_movedown_disabled.gif';
      if(isFav)
        oafsm.ScIndF = oafsm.srLengthF-15;
      else      
        oafsm.ScIndN=oafsm.srLength-15;
    }
    if(isFav)
    {
      var fCon = document.getElementById("fContainer");
      fCon.style.height=oafsm.MIN_LIST_HEIGHT+"px";
    }
    else  
    {
      var sCon = document.getElementById("sContainer");
      sCon.style.height=oafsm.MIN_LIST_HEIGHT+"px";
    }
},

wheel:function(event) {
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {
          delta = event.wheelDelta/120;
          if (window.opera) delta = -delta;
        } else if (event.detail) {
           delta = -event.detail/3;
        }
        if (delta)
           oafsm.scrWheel(delta,oafsm.isF);
           
        if(event.stopPropagation)
            event.stopPropagation();
        if(event.preventDefault)
            event.preventDefault();
        event.cancelBubble = true;
        event.cancel = true;
        event.returnValue = false;
},
scrWheel:function(delta,isFav) {
    if(!isFav)
      oafsm.hideonScr();
    if(delta < 0 )
        oafsm.scrollObjects(0, true, isFav,true)
    else
        oafsm.scrollObjects(1, true, isFav,true)  
},
stopScroll:function(dir,isFav) {
	clearInterval(oafsm.zInterval);
	oafsm.scrollObjects(dir,false,isFav,false);
},
	
scrollObjects:function(dir,scroll,isFav,isWheel) {
	if(!scroll)return;
	oafsm.direction=dir;
        if(isWheel)
          oafsm.animate(isFav);
        else
	  oafsm.zInterval=setInterval("oafsm.animate("+isFav+")",90);
},

animate:function (isFav,onKey) {
      var scrLen = null;    
      var scrList = [];
      var SuArrIm = null;
      var StArrIm = null;
      var SdArrIm = null;
      var SbArrIm = null;
      if(!isFav)
      {
        scrLen = oafsm.srLength;
        scrList = oafsm.lis;
        oafsm.ScInd = oafsm.ScIndN; 
        SuArrIm = oafsm.SuArrImN;  SdArrIm = oafsm.SdArrImN;
        StArrIm = oafsm.StArrImN;  SbArrIm = oafsm.SbArrImN;
      }
      else  
      {
        scrLen = oafsm.srLengthF;
        scrList = oafsm.fLi;
        oafsm.ScInd = oafsm.ScIndF;
        SuArrIm = oafsm.SuArrImF;  SdArrIm = oafsm.SdArrImF;
        StArrIm = oafsm.StArrImF;  SbArrIm = oafsm.SbArrImF;
      }          
      if(!(oafsm.direction))
      {
        if(oafsm.ScInd >= 0)
        {
           SuArrIm.src='/OA_MEDIA/shuttle_moveup_enabled.gif';           
           StArrIm.src='/OA_MEDIA/shuttle_movetotop_enabled.gif';
        }
        if(oafsm.ScInd >= scrList.length-15)
        {
          SdArrIm.src='/OA_MEDIA/shuttle_movedown_disabled.gif';
          SbArrIm.src='/OA_MEDIA/shuttle_movetobottom_disabled.gif';
          oafsm.stopScroll(0,isFav);
          return;
        }
        scrList[oafsm.ScInd].style.display='none';
        if((15+oafsm.ScInd) <= (scrLen -1))
        {
            scrList[15+oafsm.ScInd].style.width=270+'px';
            if (oafsm.isIE)     
                scrList[15+oafsm.ScInd].style.display='inline';
            else
                scrList[15+oafsm.ScInd].style.display='block';
        }   
        if(isFav)
        {
          oafsm.ScIndF++; 
          if(!onKey) oafsm.pgLenF++;
        }
        else 
        {
          oafsm.ScIndN++; 
          if(!onKey) oafsm.pgLen++;
        }
      }
      else
      {
        if(oafsm.ScInd > 0)
        {
            scrList[oafsm.ScInd-1].style.width=270+'px';
            if (oafsm.isIE)
                  scrList[oafsm.ScInd-1].style.display='inline';
            else
                scrList[oafsm.ScInd-1].style.display='block';
            scrList[15+oafsm.ScInd-1].style.display='none';              
            SdArrIm.src='/OA_MEDIA/shuttle_movedown_enabled.gif';
            SbArrIm.src='/OA_MEDIA/shuttle_movetobottom_enabled.gif';
            if(isFav)
            {
              oafsm.ScIndF--;
              if(!onKey) oafsm.pgLenF--;
            }
            else 
            {
              oafsm.ScIndN--;
              if(!onKey) oafsm.pgLen--;
            }
        }
        else
        {
           SuArrIm.src='/OA_MEDIA/shuttle_moveup_disabled.gif';
           StArrIm.src='/OA_MEDIA/shuttle_movetotop_disabled.gif';
           oafsm.stopScroll(1,isFav);
           return;
        }
      }	
},
Shide:function(evt,fromList){
        //Identifying the Escape key event. 
        var event=evt||window.event;
        var keyCode=-1;
        if(event)
        {
            if(event.which)
                keyCode = event.which;
            else if(event.keyCode) 
                keyCode = event.keyCode;
            if((event.type=="keyup")&&(keyCode != 27)&&(!fromList))
              return;
        }
        if((keyCode == 27) || (fromList))
        {
          var hMenu = oafsm.hideMenu;
          if(hMenu != null)
          {
            if((hMenu.id=="MenuList")||(hMenu.id=="FavList"))
            {
                if(keyCode != 37)//Main list should not hide on -> key.
                if(hMenu.id=="MenuList")
                {
                  document.getElementById("SNAV").focus();
                  oafsm.Shm(hMenu,true,false);
                  oafsm.hideMenu=null;
                }
                if(hMenu.id=="FavList")
                {
                  document.getElementById("SFAV").focus();
                  oafsm.Shm(hMenu,true,true);
                  oafsm.hideMenu=null;
                }
            }
            else
            {
                oafsm.Shm(hMenu,false,false);
                hMenu = hMenu.parentNode;
                while(hMenu.tagName!="UL") 
                  hMenu = hMenu.parentNode; 
                oafsm.hideMenu = hMenu;
            }
          }
        }
        else if(oafsm.Shioc)
        {
            var menuList = document.getElementById('MenuList');
            var favList = document.getElementById('FavList');
             
            var SdivTop = oafsm.snTop;
            if(SdivTop!= null)
              SdivTop.style.display='none';
            var SFavTop = oafsm.sfTop;
            if(SFavTop!= null)
              SFavTop.style.display='none';

            if(menuList != null)
            {
                if("visible"== menuList.style.visibility)    
                    oafsm.Shm(menuList,true,false);	
            }
            if(favList != null)
            {
                if("visible"== favList.style.visibility)        
                    oafsm.Shm(favList,true,true);	
            }   
            if(menuList != null)
            {
              var Ssul=menuList.getElementsByTagName("ul")
              if(Ssul != null)
              {
                 for (var c=0; c<Ssul.length; c++)
                 {
                   oafsm.Shm(Ssul[c], false,false)	
                 }
               }                               
             }
        }    
        else
            oafsm.Shioc = true;      
},
setup:function(mainmenuid, dir, mUrl, blockNav,isJtt){
        oafsm.Surl = mUrl;
        oafsm.isJtt = isJtt;
        if("true"==blockNav)
          oafsm.SblockNav = true;
        else
          oafsm.SblockNav = false;
        oafsm.isIE = /MSIE (\d+\.\d+);/.test(navigator.userAgent);          
        if (oafsm.isIE)     
            this.SaEv(document, function(){oafsm.Shide()}, "click")
        else
            this.SaEv(window, function(){oafsm.Shide()}, "click")
       
	this.SaEv(window, function(){oafsm.Sinit(mainmenuid, dir)}, "load")
}
}