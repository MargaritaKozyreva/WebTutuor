//WebTutor Core 
var coreVersion='1.5.5';
var coreBuildDate ='22-Jun-2006';
//(c)2002-2004 Websoft Ltd. http://www.websoft.ru/

var MPlayer1=null;
var XMLDocument=null;
var root;
var uproot;
var timeOn=0;
var moveobj=new Array;
var forobj=new Array;
var varobj=new Array;
var globalVarobj=new Array;
var actionTimers=new Array;
var IE_6=false;
var xmlContainer=new Array;
var imageContainer=new Array;
var taskContainer=new Array;
var skipImages=false;
var imagesRef=0;
var imagesOverall=0;
var historyArray=new Array(0);
var windowWidth=screen.availWidth;
var windowHeight=screen.availHeight;
var eventAttribute='-1';
var far_jumping=false;
var appunid="";
var course_id="";
var startid="";
if(navigator.appVersion.indexOf("MSIE 6.0")!=-1 || navigator.appVersion.indexOf("MSIE 5.5")!=-1 ) IE_6=true;

var semaphore=0;
var obj_semaphore=false;
var sTimer=0;
var lTimer=0;
var tasks=null;
var gTimer;
var task_objects=null;
var cur_task=null;
var sub_task=null;
var cur_object=null;
var NEXT_TASK=-1;
var NEXT_OBJECT=-2;
var PREV_TASK=-4;
var PREV_OBJECT=-6;
var CUR_TASK=-5;
var CUR_OBJECT=-3;
var MOVE_TICK=10;
var CRITICAL_TICK=1;
var PROGRAM_TICK=10;
var FOR_TICK=10;
var newTimer = 0;
var mousex=0;
var mousey=0;
var areaFired=false;
var imageLoading=false;
var soundLoading=false;

var highLightObject="";
var soundContainer=new Array;
var skipSounds=false;
var soundRef=0;
var soundOverall=0;
var FPlayer1=null;
var everythingLoaded=false;

preButton = new Image(166,31);
preButton.src = "../../systemimages/button_start1.gif";


function waitForUser() {
	everythingLoaded=true;
	if (document.getElementById('zastgo')) {
		document.getElementById('zastgo').src = eval("preButton.src");
	}
}

function comOn() {
	if(everythingLoaded) {
		document.getElementById('preDiv').style.display="none";
		startSlides(true);
	} else {
//		alert('Не все элементы загружены. Подождите...');
		return false;
	}
	return false;
}

function checkDescXMLload() {
	switch (DescXMLDocument.readyState) {
case 1:
	document.getElementById('progressCount').innerHTML="Идет загрузка";
	break;
case 2:
	document.getElementById('progressCount').innerHTML="Идет обработка";
	break;
case 3:
	document.getElementById('progressCount').innerHTML="Идет взаимодействие с сервером";
	break;
case 4:
	var err = DescXMLDocument.parseError;
    if (err.errorCode != 0) {
    	document.getElementById('progressCount').innerHTML=err.reason;
		alert(err.reason);
	} else {
		document.getElementById('progressCount').innerHTML="Завершенo";
		document.getElementById('progressDiv').style.display="none";
		anodes=DescXMLDocument.documentElement.childNodes;
		document.getElementById('zback').innerHTML = anodes[0].text;
		document.getElementById('coursepicture').innerHTML = anodes[1].text;
		document.getElementById('chaptername').innerHTML = anodes[2].text;
		document.getElementById('buttonsdiv').innerHTML = anodes[3].text;
		document.getElementById('generaldescription').innerHTML = anodes[4].text;
		document.getElementById('generalhelp').innerHTML = anodes[5].text;
		document.title=document.getElementById('chaptername').innerText;
		};
	break;
default:
	document.body.all["progressCount"].innerHTML="Неизвестен";
	break;
}
}


function waitForXML()
{
document.body.all["_xml_warning"].style.display="inline";
switch (XMLDocument.readyState)
{
case 1:
	document.body.all["_xml_status"].innerHTML="Загрузка";
	break;
case 2:
	document.body.all["_xml_status"].innerHTML="Обработка";
	break;
case 3:
	document.body.all["_xml_status"].innerHTML="Взаимодействие с сервером";
	break;
case 4:
	var err = XMLDocument.parseError;
    	if (err.errorCode != 0)
      document.body.all["_xml_status"].innerHTML=err.reason;
	else {
		document.body.all["_xml_status"].innerHTML="Завершенo";
		document.body.all["_xml_warning"].style.display="none";
		startPresentation(true); 		
		};
	break;
default:
	document.body.all["_xml_status"].innerHTML="Неизвестен";
	break;
}
}

function startPresentation()
{
document.body.all["_xml_warning"].style.display="none";
  xml_document = XMLDocument;
  upxml_document = UpXMLDocument;
  root=xml_document.documentElement;
  uproot=xml_document.createElement("UPDATA");
  upxml_document.documentElement=uproot;

try
{
 xml_document.setProperty("SelectionLanguage","XPath");
  upxml_document.setProperty("SelectionLanguage","XPath");
}
catch(x) {
};

	tasks=root.childNodes;
//	qwBuildTree(tasks);
	document.body.all["_xml_warning"].style.display="none";
	document.body.all["_images_warning"].style.display="inline";
	loadImages(root);
	waitForLoaded();
}

function startSlides() {
	document.body.all["_images_warning"].style.display="none";
	document.body.all["_identity_"].style.display="none";
	document.body.all["_authentic_"].style.display="none";
	document.attachEvent('onclick',processEvent);
	document.attachEvent('onkeypress',processEvent);
	document.attachEvent('onmousemove',getCoords);
	document.attachEvent('oncontextmenu',processContext);
	if (def(root.getAttribute("mask"),"0")=="1")  {
		document.attachEvent('onkeydown',cancelKeys);
	}
	if (def(root.getAttribute("unloadpost"),"0")=="1")  {
		window.attachEvent('onunload',unloadfunc);
	}
	if(startid!="") {
		var attrs=new Array;
		attrs['pid']=startid;
		processGoto(null,attrs);
		sendMessage(CUR_TASK);
	}
  	gTimer=setTimeout("sendMessage("+NEXT_TASK+")",PROGRAM_TICK);
}


function sendMessage(id,param)
{
	if (!semaphore && !imageLoading && !soundLoading)
	{
	switch(id)	
	{
	case NEXT_TASK:
		nextTask();		
		break;
	case PREV_TASK:
		prevTask();		
		break;
	case NEXT_OBJECT:
		if(!cur_object) {nextTask();break;}
		cur_object=cur_object.nextSibling;
		if(!cur_object) {nextTask();break;}
		xmlProcess(cur_object);
		break;
	case CUR_OBJECT:
		if(!cur_object) return false;		
		xmlProcess(cur_object);
		break;
	case PREV_OBJECT:break;

	case CUR_TASK:		
		if(!cur_task) return false;
		if (def(cur_task.getAttribute("navigation"),null)) 
			createNavigatorObject(cur_task);
		task_objects=cur_task.childNodes;		
		cur_object=task_objects[0];
		xmlProcess(cur_object);
		break;

	case id:break;
	}
	clearTimeout(gTimer);
	if(reEnterDispatch)	
	{
		reEnterDispatch=false;
		gTimer=setTimeout("sendMessage(CUR_OBJECT)",PROGRAM_TICK);		
	}
	else
		gTimer=setTimeout("sendMessage(NEXT_OBJECT)",PROGRAM_TICK);
		
	}
	else
	{	
	clearTimeout(gTimer);
	gTimer=setTimeout("sendMessage("+id+")",PROGRAM_TICK);
	}

	return true;
}

function nextTask(skip) {
	var next_task;
	if(!cur_task) {
		next_task=tasks[0];
		cur_task=next_task;
	} else {
		next_task=cur_task.nextSibling;				//if(!next_task) return false;
	}
	if(cur_task.nodeName=="SUBTASK") {
		cur_task=popArray(taskContainer);
		nextTask();
		return;
	}
	while(next_task && next_task.nodeName!="TASK" ) {
		next_task=next_task.nextSibling;
	}
	if(def(skip,null)) {
		while(next_task && (def(next_task.getAttribute("keep"),"0")=="3" || next_task.nodeName!="TASK")) {
			next_task=next_task.nextSibling;
		}
	}
	if(!next_task) {
		return false;
	}
//		if(next_task.nodeName=="SATTELITE") return false;
	processAutocloses(cur_task,next_task);
	if (def(next_task.getAttribute("keep"),"")!="1") {
		if(def(document.all['navig_'+cur_task.getAttribute('id')],null) && !def(document.all['navig_'+next_task.getAttribute('id')],null)) {
			document.all['navig_'+cur_task.getAttribute('id')].id= "navig_"+next_task.getAttribute('id');
			updatePopup(document.all['navig_'+next_task.getAttribute('id')]);
		} else {
			createNavigatorObject(next_task);	
		}
	}
	cur_task=next_task;
//		if(trackVisited) {
			if(curSelectorIndex!=-1) {
				if(document.getElementById('selector')) {
					var tskList=document.getElementById('selector');
					if(tskList.selectedIndex!=NaN) {
						curSelectorIndex=tskList.selectedIndex;
					}
				}
			} else {
				curSelectorIndex=0;
			}
			var visitNode=cur_task.getAttribute("id");
			var trackNode=false;
			var trackCounter=0;
			for(var i=0;i<q_visited.length;i++) {
				if(q_visited[i].name==visitNode) {
					trackNode=true;
					if(q_visited[i].value==0) {
						q_visited[i].value=1;
					}
				}
				trackCounter++;
			}
			if(!trackNode) {
				q_visited[trackCounter] = new Object;
				q_visited[trackCounter].name=visitNode;
				q_visited[trackCounter].value=1;
			}
//		}
// Red code inserted by weblin to track already visited slides
//	qwUpdateSelector(cur_task);
	if (def(cur_task.getAttribute("keep"),"")=="1") {
		createNavigatorObject(cur_task);
	}
	task_objects=cur_task.childNodes;		
	cur_object=task_objects[0];	
	xmlProcess(cur_object);
}

function prevTask(skip)
{
		var prev_task;
		if(!cur_task) return false;
		if(cur_task.nodeName=="SUBTASK") {cur_task=popArray(taskContainer);prevTask();return;};
		prev_task=cur_task.previousSibling;
		while(prev_task && prev_task.nodeName!="TASK") prev_task=prev_task.previousSibling;		
		if(def(skip,null))
			while(prev_task && (def(prev_task.getAttribute("keep"),"0")=="3" || prev_task.nodeName!="TASK")) prev_task=prev_task.previousSibling;
		if(!prev_task) return false;
		processAutocloses(cur_task,prev_task);	
		if (def(prev_task.getAttribute("keep"),"")!="1") 
			if(def(document.all['navig_'+cur_task.getAttribute('id')],null) && !def(document.all['navig_'+prev_task.getAttribute('id')],null))
				{
				document.all['navig_'+cur_task.getAttribute('id')].id= "navig_"+prev_task.getAttribute('id');	
				updatePopup(document.all['navig_'+prev_task.getAttribute('id')]);
				}
			else
			createNavigatorObject(prev_task);
		cur_task=prev_task;
//		qwUpdateSelector(cur_task);
		if (def(cur_task.getAttribute("keep"),"")=="1") 
			createNavigatorObject(cur_task);
		task_objects=cur_task.childNodes;
		cur_object=task_objects[0];
		xmlProcess(cur_object);
}

function xmlProcess(child)
{
	if(!child) return;
	if (child.nodeType!=1) return;
	attrs=getTagVars(child);

	switch (child.nodeName)
		{
		case "IMAGE":
		 processImage(child,attrs);
		 break;		 
		case "TEXT":		
		 processText(child,attrs);
		 break;
		case "VIDEO":
		 break;
		case "ACTION":
		 processAction(child,attrs);
		break;
		case "BLOCK":		 
		 processBlock(child,attrs);
		break;
		case "BUTTON":
		 processButton(child,attrs);
		 break;		 
		case "RECTANGLE":		
		 processRectangle(child,attrs);
		 break;		
		case "INPUT":		
		 processInput(child,attrs);
		 break;
		case "LABEL":		
		 processLabel(child,attrs);
		 break;
		case "MEDIA":		
		  //processMedia(child,attrs);
		 break;
		case "ISLAND":
		 processIsland(child,attrs);
		break;
		case "XSL":
		 processXSL(child,attrs);
		break;
		case "SUBTASK":
		 processSUBTASK(child,attrs);
		break;
		case "BALLOON":
			processBalloon(child,attrs);
			break;
		}
}

function processBalloon(child,attrs)
{
	var spec=new Object;
	var data=child.selectSingleNode("DATA")	
	spec.text=data ? unescape(data.text):"";
	spec.objtype="balloon";
	processObject(child,attrs,spec);
	return true;
}

function setArrow(ar) {
	document.getElementById('ar_tl').style.display='none';
	document.getElementById('ar_tc').style.display='none';
	document.getElementById('ar_tr').style.display='none';
	document.getElementById('ar_rt').style.display='none';
	document.getElementById('ar_rm').style.display='none';
	document.getElementById('ar_rb').style.display='none';
	document.getElementById('ar_br').style.display='none';
	document.getElementById('ar_bc').style.display='none';
	document.getElementById('ar_bl').style.display='none';
	document.getElementById('ar_lb').style.display='none';
	document.getElementById('ar_lm').style.display='none';
	document.getElementById('ar_lt').style.display='none';
	switch(ar) {
		case "tl":
			document.getElementById('ar_tl').style.display='inline';
			break;
		case "tc":
			document.getElementById('ar_tc').style.display='inline';
			break;
		case "tr":
			document.getElementById('ar_tr').style.display='inline';
			break;
		case "rt":
			document.getElementById('ar_rt').style.display='inline';
			break;
		case "rm":
			document.getElementById('ar_rm').style.display='inline';
			break;
		case "rb":
			document.getElementById('ar_rb').style.display='inline';
			break;
		case "br":
			document.getElementById('ar_br').style.display='inline';
			break;
		case "bc":
			document.getElementById('ar_bc').style.display='inline';
			break;
		case "bl":
			document.getElementById('ar_bl').style.display='inline';
			break;
		case "lb":
			document.getElementById('ar_lb').style.display='inline';
			break;
		case "lm":
			document.getElementById('ar_lm').style.display='inline';
			break;
		case "lt":
			document.getElementById('ar_lt').style.display='inline';
			break;
		default:
			break;
	}

}

function processAction(elem)
{	
	if (!elem.hasChildNodes) return false;
	var i=0;
	var j=0;
	var target=null;
	var childs=elem.childNodes;	
	for (i=0;i<childs.length;i++)
	{
	var attrs=getTagVars(childs[i]);
	if (attrs && !def(attrs['norelate'],null) )
	{
		target=root.selectSingleNode('.//BLOCK[@id="'+attrs['pid']+'"]');
		if (target && target.hasChildNodes) 
			{
				var tchilds=target.childNodes;								
				for(j=0;j<tchilds.length;j++)				
				if(tchilds[j].getAttribute('id'))
				{
				childs[i].setAttribute("pid",tchilds[j].getAttribute('id'));
				processAction(elem);
				childs[i].setAttribute("pid",attrs['pid']);
				}
			}		
	}	
	if(!target)	
	switch (childs[i].nodeName)
	{			
		case "MOVE": processMove(childs[i],attrs);break;
		case "SOUND": processSound(childs[i],attrs);break;
		case "DISPLAY":processDisplay(childs[i],attrs);break;
		case "CANCELMOVE":processCancelMove(childs[i],attrs);break;
		case "WAIT":processWait(childs[i],attrs);break;
		case "FOR":processFor(childs[i],attrs);break;
		case "CHANGE_PROPERTY":processChangeProperty(childs[i],attrs);break;
		case "CHANGE_ATTRIBUTE":processChangeAttribute(childs[i],attrs);break;
		case "VARIABLE":processVariable(childs[i],attrs);break;
		case "GOTO":processGoto(childs[i],attrs);break;
		case "TRANSITION":processTransition(childs[i],attrs);break;
		case "IMAGELIST":getImageList(childs[i],attrs); break;
		case "MSGBOX":processMsgBox(childs[i],attrs); break;
		case "JUMP":processJump(childs[i],attrs); break;
		case "IF":processIF(childs[i],attrs); break;
		case "TIMER":processTimer(childs[i],attrs); break;
		case "POST":processPost(childs[i],attrs); break;
		case "ALARM":processAlarm(childs[i],attrs); break;
		case "JAVASCRIPT":processJavascript(childs[i],attrs); break;
		case "EXIT":window.close();break;
		case "MEDIAPLAY":MediaPlay(childs[i],attrs);break;
		case "TRANSFORMXSL": processTransformXSL(childs[i],attrs);	break;
		case "CHECKHIT": processIFCheckHit(childs[i],attrs);	break;
		case "DROP": processDrop(childs[i],attrs);	break;
	}
	}

}

var	reEnterDispatch=false;
function processGoto(child,attrs,nopushing) {	
	var i=0;
	var id=def(attrs["pid"],null);
	var m=def(attrs["target"],null);
	if(!id)	{
		switch (m) {
			case "prev":
				semaphore=0;
				return sendMessage(PREV_TASK);
			case "next":		
				semaphore=0;
				return sendMessage(NEXT_TASK);
			case "first":
				semaphore=0;
				var target=root.selectSingleNode('./TASK[1]');
				attrs["pid"]=target.getAttribute("id");
				attrs["m"]=null;
				return processGoto(child,attrs);
			case "last":
				semaphore=0;
				var target=root.selectSingleNode('./TASK[last()]');
				attrs["pid"]=target.getAttribute("id");
				attrs["m"]=null;
				return processGoto(child,attrs);
			default:
				m=null;
				break;
		}
	}
	if (!id && !m) {
		return false;
	}
	var target=root.selectSingleNode('.//*[@id="'+id+'"]');	
	if (!target) {
		return false;
	}
	var parent=target;
	while(parent && parent.nodeName!="TASK" && parent.nodeName!="SUBTASK" )  {
		parent=parent.parentNode;
	}
	if(!parent) {
		return false;
	}
	if (cur_task!=parent) {
		processAutocloses(cur_task,parent);
	}
	cur_object=target;
	if (parent.nodeName=="SUBTASK" && !def(nopushing,false)) {
		pushArray(taskContainer,cur_task);
	}
	cur_task=parent;
	if(def(attrs['keep'],"0")=="0")  {
		semaphore=0;
	}
//	qwBuildTree(tasks);
//	if(cur_task==firstSlide) {
//		togglePrev('off');
//	}
//	qwUpdateSelector(cur_task);
//	gTimer=setTimeout("sendMessage(CUR_OBJECT)",PROGRAM_TICK);

	reEnterDispatch=true;
	if(!cur_object) cur_object=cur_task.firstChild;
	else
		if(cur_object.nodeName=="TASK" || cur_object.nodeName=="SUBTASK" ) cur_object=cur_task.firstChild;
	
	/*
	clearTimeout(newTimer);
	if (target.nodeName!="TASK") {
		if(aicc_jump && tasks[tasks.length-1]==cur_task) {
			newTimer = setTimeout("sendMessage(CUR_OBJECT)",PROGRAM_TICK*50);
			aicc_jump = false;
		} else {
			sendMessage(CUR_OBJECT);
		}
	} else {
		if(aicc_jump && tasks[tasks.length-1]==cur_task) {
//			clearTimeout(gTimer);
			newTimer = setTimeout("sendMessage(CUR_TASK)",PROGRAM_TICK*50);
			aicc_jump = false;
		} else {
			sendMessage(CUR_TASK);
		}
	}
	*/
	
}

function processAutocloses(elem,target)
{

	if(elem && target && !far_jumping && elem!=target)
	{
	historyArray[historyArray.length-1]=elem.getAttribute("id");
	historyArray.length+=1;
	}

	clearTimeout(lTimer);
	lTimer=0;
	if(MPlayer1) 	
	{
	MPlayer1.SendPlayStateChangeEvents=false;
	MPlayer1.Stop();
	MPlayer1.SendPlayStateChangeEvents=true;
	}
	if(FPlayer1!=null) 	
	{
		if(FPlayer1.object==null) {
			try {
				FPlayer1.Stop();
			} catch(x) {}
		} else {
			try {
				FPlayer1.object.Stop();
			} catch(x) {}
		}
	}

	if (elem && elem!=target)
	{
		updateVariables(elem);
		var e= new Enumerator(actionTimers) 
		for (;!e.atEnd();e.moveNext())           //Enumerate drives collection.
		{
		         	var x = e.item();
	 			if (x) clearTimeout(x.timer);
		}		
		actionTimers=new Array;

		var autocloses=root.selectNodes('.//BLOCK[@autoclose="1" and .//*[@tempdisplay]]');
		//var autocloses=root.selectNodes('.//BLOCK[@autoclose="1"]');
		var j;
		var attrs=new Array;
		 if (autocloses!=null)  
		{ 	
			for(j=0;j<autocloses.length;j++) 
			{				
				var scope=autocloses[j].selectSingleNode('./SCOPE[@sid="'+target.getAttribute("id")+'"]');
				if(!def(scope,null) && autocloses[j].getAttribute("id"))
				{				
				var action=xml_document.createElement("ACTION");
				var disaction=xml_document.createElement("DISPLAY");
				disaction.setAttribute("display","none");
				disaction.setAttribute("remove","1");				
				disaction.setAttribute("pid",autocloses[j].getAttribute("id"));
				action.appendChild(disaction);
				processAction(action);
				autocloses[j].removeAttribute("tempdisplay");
				}
			}
	 	}
		
		var autocloses=root.selectNodes('.//*[@autoclose="1" and @tempdisplay]');
		//var autocloses=root.selectNodes('.//*[@autoclose="1"]');
		var j;
		var attrs=new Array;
		 if (autocloses!=null)  
		{ 	
			for(j=0;j<autocloses.length;j++) 
			{				
				var scope=autocloses[j].selectSingleNode('./SCOPE[@sid="'+target.getAttribute("id")+'"]');
				if(!def(scope,null) && autocloses[j].getAttribute("id"))
				{				
				var action=xml_document.createElement("ACTION");
				var disaction=xml_document.createElement("DISPLAY");
				disaction.setAttribute("display","none");
				disaction.setAttribute("remove","1");
				disaction.setAttribute("pid",autocloses[j].getAttribute("id"));
				action.appendChild(disaction);
				processAction(action);
				autocloses[j].removeAttribute("tempdisplay");
				}
			}
	 	}
		
		
		var oNavig=document.all["navig_" + elem.getAttribute("id")];
		if (def(oNavig,null)) 
		if (def(oNavig.nodeName,null)) 
		{
			var keep=def(target.getAttribute("keep"),"0");			
			if(keep!="2")
			{
				//document.body.removeChild(oNavig);			
				oNavig.style.display='none';
			}
			
			
		}
		
		var closeresp=elem.selectNodes('.//RESPONSE[(not(@dis) or @dis!="1") and @type="closetask" and not(@global="1")]');
		var attrs=new Array;
		 if (closeresp!=null)  		
			for(j=0;j<closeresp.length;j++) 			
			processResponse(closeresp[j]);

		var closeresp=root.selectNodes('.//RESPONSE[(not(@dis) or @dis!="1") and @type="closetask" and @global="1"]');
		var attrs=new Array;
		 if (closeresp!=null) 
			for(j=0;j<closeresp.length;j++) 			
			processResponse(closeresp[j]);		
	}

	xmlContainer=new Array;
	if(target)
	{
	updateXMLVariables(target);

	var title=(def(root.getAttribute("course"),"")!="" ? root.getAttribute("course")+" : "+root.getAttribute("name")+" : " :"") +def(target.getAttribute("name"),"");	document.title=title;
	var autoopens=root.selectNodes('.//*[@autoopen="1" and (not(@tempdisplay) or @tempdisplay="none")]');
		var j;
		var attrs=new Array;	
		 if (autoopens!=null)  
		{ 	
			for(j=0;j<autoopens.length;j++) 
			{				
				var scope=autoopens[j].selectSingleNode('./SCOPE[@sid="'+target.getAttribute("id")+'"]');
				if(def(scope,null) && autoopens[j].getAttribute("id"))
				{
				var action=xml_document.createElement("ACTION");
				var disaction=xml_document.createElement("DISPLAY");
				disaction.setAttribute("display","inline");
				disaction.setAttribute("pid",autoopens[j].getAttribute("id"));
				action.appendChild(disaction);
				processAction(action);
				}

			}
	 	}
	
	var opensresp=target.selectNodes('.//RESPONSE[(not(@dis) or @dis!="1") and @type="opentask" and not(@global="1") ]');	
	var attrs=new Array;
		 if (opensresp!=null) 
			{
				var savetask=cur_task;
				cur_task=target;
			for(j=0;j<opensresp.length;j++)
				processResponse(opensresp[j]);			
			cur_task=savetask;			
			}

	var opensresp=root.selectNodes('.//RESPONSE[(not(@dis) or @dis!="1") and @type="opentask" and @global="1"]');
		var attrs=new Array;
		 if (opensresp!=null) 
			{
			var savetask=cur_task;
			cur_task=target;
			for(j=0;j<opensresp.length;j++)
				processResponse(opensresp[j]);			
				cur_task=savetask;			
			}

	if (target.nodeName!="SUBTASK") {taskLoadImages(target);
	if(MPlayer1 && soundFlag) taskLoadSound(target);
	if(FPlayer1!=null && soundFlag) taskLoadSound(target);}
	}		
	//recalcFormulas();		
}
function processBlock(child,attrs)
{
	if (!child.hasChildNodes) return false;
	var i=0;
	if (def(attrs['processing'],null)=="0") return false;
	var childs=child.childNodes;	
	for (i=0;i<childs.length;i++)
	xmlProcess(childs[i]);
}


function processImage(child,attrs)
{
	if (!attrs) return false;	
	var x=def(attrs["x"],0);
	var y=def(attrs["y"],0);
	var w=def(attrs["w"],0);	
	var h=def(attrs["h"],0);
		
	x=def(attrs["tx"],x);
	y=def(attrs["ty"],y);
	w=def(attrs["tw"],w);	
	h=def(attrs["th"],h);
	var src=def(attrs['src'],null);
	if(!src) return false;
	var border=def(attrs["border"],"0");
	
	var oDiv=document.all[def(attrs['id'],null)];
	if (typeof(oDiv)=="undefined") 
	{
	var oImg=document.createElement("IMG");	
	}
	else
	{
	var oImg=oDiv.firstChild;
	}
	
	oImg.src=src;
	oImg.border=border;
	if (w!=0) oImg.width=w;
	if (h!=0) oImg.height=h;
	
	oImg.objtype="image";
	processObject(child,attrs,oImg);	
	return true;
}

var firstflag=true;
function processText(child,attrs)
{
	var spec=new Object;
	var data=child.selectSingleNode("DATA")	
	spec.text=data ? unescape(data.text):"";
	spec.objtype="text";
	processObject(child,attrs,spec);
	if(firstflag)
	{
		firstflag=false;
		var cArray=new Array('contents','help','calc','settings','about');
		for (i=0;i<cArray.length;i++)		
		{
			var oDiv=def(document.all[cArray[i]],null);
			if(oDiv)		
			{
				var cDiv=oDiv.cloneNode(true);
				document.body.appendChild(cDiv);
				oDiv.parentNode.removeChild(oDiv);
				oDiv=null;
			}
		}
	}
	return true;
}

function processInput(child,attrs)
{
	var spec;
	if (def(attrs['multiline'],"0")=="1") 
		{
		spec=document.createElement("textArea");	
		}
	else
		{
		spec=document.createElement('<INPUT NAME="'+def(attrs["name"],"defname")+'">' );
		spec.type=def(attrs["type"],"text");				
		/*
		if(def(attrs["type"],"text")=="radio")
			spec=document.createElement('<INPUT TYPE="radio" NAME="'+def(attrs["name"],"defname")+'">' );
		else
		{
			spec=document.createElement("INPUT");	
			spec.type=def(attrs["type"],"text");				
		}		
		*/
		}

	spec.expression=def(attrs["expression"],"0");	
	spec.value=def(attrs["value"],"");
	spec.size=def(attrs["size"],"5");
	spec.objtype="input";
	spec.variable=def(attrs["variable"],attrs["id"]);	
	//spec.name=def(attrs["name"],"defname");	
	spec.attachEvent("onkeypress",voidfunc);
	spec.attachEvent("onclick",voidfunc);
	spec.attachEvent("onblur",acceptInput);
	if (def(attrs["nopaste"],"0")=="1")
		spec.attachEvent("onbeforepaste",cancelPaste);
	spec.expression=def(attrs["expression"],"0");
	processObject(child,attrs,spec);
	return true;
}

function processLabel(child,attrs)
{
	var spec=new Object;
	
	 if (def(attrs['expression'],null)) 
	{
		var value=recalcExpr(def(attr["value"],""));
	}
	else	
		if(def(attrs["variable"],null))
			var value=recalcExpr("#"+attrs["variable"]);
		else 
			var value=def(attr["value"],"");
		
	spec.text=value;
	spec.objtype="label";		
	processObject(child,attrs,spec);
	return true;
}

function processObject(child,attrs,spec)
{
	if (!attrs) return false;	
	var i=0;		
	
	var x=def(attrs["x"],0);
	var y=def(attrs["y"],0);
	var w=def(attrs["w"],0);	
	var h=def(attrs["h"],0);
	
	x=def(attrs["tx"],x);
	y=def(attrs["ty"],y);
	w=def(attrs["tw"],w);	
	h=def(attrs["th"],h);
		
	var id=def(attrs["id"],null);	
	var display=def(attrs["display"],"none");
	var existflag=true;

	var oDiv=document.all[id];
	if (!def(oDiv,null)) 
		{
		oDiv=document.createElement("DIV");
		child.setAttribute("tx",def(child.getAttribute("x"),x));
		child.setAttribute("ty",def(child.getAttribute("y"),y));
		child.setAttribute("tw",def(child.getAttribute("w"),w));
		child.setAttribute("th",def(child.getAttribute("h"),h));
		existflag=false;
		}
			
	oDiv.id=id;
	
	if(spec.objtype=='balloon') {
		var arrowtype=def(attrs["arrow"],"tl");
		var curBalloon=document.getElementById('baseBalloon');
		var balloonInnerW=parseInt(w,10)-20;
		switch(arrowtype) {
			case "tl":
				h=parseInt(h,10)+40;
				x=parseInt(x,10)-10;
				break;
			case "tc":
				h=parseInt(h,10)+40;
				x=parseInt(x,10)-Math.round(parseInt(w,10)/2)+5;
				break;
			case "tr":
				h=parseInt(h,10)+40;
				x=parseInt(x,10)-parseInt(w)+10;
				break;
			case "bl":
				h=parseInt(h,10)+40;
				x=parseInt(x,10)-10;
				break;
			case "bc":
				h=parseInt(h,10)+40;
				x=parseInt(x,10)-Math.round(parseInt(w,10)/2)+5;
				break;
			case "br":
				h=parseInt(h,10)+40;
				x=parseInt(x,10)-parseInt(w,10)+10;
				break;
			case "lt":
				w=parseInt(w,10)+40;
				break;
			case "lm":
				w=parseInt(w,10)+40;
				break;
			case "lb":
				w=parseInt(w,10)+40;
				break;
			case "rt":
				w=parseInt(w,10)+40;
				break;
			case "rm":
				w=parseInt(w,10)+40;
				break;
			case "rb":
				w=parseInt(w,10)+40;
				break;
			default:
				break;
		}
		document.getElementById('baseBalloonText').style.width = balloonInnerW;
		document.getElementById('baseBalloon').style.width = w;
		document.getElementById('baseBalloon').style.top = y;
		document.getElementById('baseBalloon').style.left = x;
		setArrow(arrowtype);
	}
	
	if(def(attrs['incorporate'],"0")=="1") 	
	{		
	 if (!def(document.all[id],null))
		{
		var rect=null;
		 if (def(attrs["pid"],null)) 	rect=getRect(def(attrs["pid"],null),attrs["position"]);
		 if(rect && rect.link)
		{			
			var parlink=rect.link.parentElement;
			if (parlink.nodeName=="P" && parlink.parentElement.nodeName=="DIV")  
			{
				var removedlink=parlink.removeNode(false);
								
			}
	   	 	rect.link.insertAdjacentHTML('beforebegin',oDiv.outerHTML);
			 var oDiv=document.all[id];
			oDiv.incorporate="1";
			existflag=false;
		}
		}
	}
	else
	{	
	var parentdoc=def(document.all.BODY,document.body);
	if(!parentdoc.contains(oDiv)) {parentdoc.appendChild(oDiv);}
	oDiv.style.position="absolute";
	}		
	
	//oDiv.style.posHeight=h;
	//oDiv.style.posWidth=w;
	
	oDiv.style.display="inline";
	oDiv.style.visibility="hidden";
	oDiv.className="revFilter";
	
	/*
	var zIndex=def(attrs['zIndex'],"");
	if (zIndex=="") zIndex=def(attrs['z-index'],""); else oDiv.style.zIndex=zIndex;	
	if(zIndex!="") oDiv.style.zIndex=zIndex;
	
	if(def(attrs['zIndex'],0)!=0) 
		oDiv.style.zIndex=def(attrs['zIndex'],0,1);
	else
		oDiv.style.zIndex=def(attrs['z-index'],0,1);
	*/
	oDiv.style.zIndex=0;
	oDiv.style.color=def(attrs['color'],"");
	oDiv.style.borderColor= def(attrs['bordercolor'],"");
	oDiv.style.backgroundColor= def(attrs['backgroundColor'],"");
	def(attrs["font"],"")!="" ? 	oDiv.style.font=attrs["font"] : "";
	
	var rect=new Object;
	rect.shiftx=0;
	rect.shifty=0;
	rect.shiftw=0;
	rect.shifth=0;
	
	if (def(attrs["pid"],null)) 	var rect=getRect(def(attrs["pid"],null),attrs["position"]);	
	if (!rect) return false;

	if (w=="width") w=def(rect.shiftw,0);//else w=Number(w);
	if (h=="height") h=def(rect.shifth,0);//else h=Number(h);

	oDiv.style.width=w;
 	oDiv.style.height=h;

	switch(spec.objtype)
	{
 	case "image":if(!oDiv.contains(spec)) oDiv.appendChild(spec);break;
 	case "button":if(!oDiv.contains(spec)) oDiv.appendChild(spec);break;
	case "input":if(!existflag) 
		{
		oDiv.appendChild(spec);
		spec.style.posWidth=w;
		spec.style.posHeight=h;
		//spec.style.fontSize=  h!=0 ? h-6+"px" : "";
		}break;
	case "text":document.all[id].innerHTML=spec.text;break;
	case "label":document.all[id].innerHTML=spec.text;break;
	case "balloon":
		document.getElementById('baseBalloonText').innerHTML=spec.text;
		document.getElementById(id).innerHTML=document.getElementById('baseBalloon').innerHTML;
		break;
	case "rect":if(!oDiv.contains(spec)) 
		{
		spec.innerHTML='<v:rect filled="false" stroke="true" strokeweight="'+spec.thick+'px" strokecolor="'+spec.rectcolor+'"  style="position:absolute;top:0;left:0;width:'+w+';height:'+h+'"></v:rect>';
		oDiv.appendChild(spec);
		};break;
	}
	
	if (document.all[id].offsetHeight==0 || document.all[id].offsetWidth==0)  {
	enterCritical();
	setTimeout("createWaitLoader('"+id+"')",MOVE_TICK);
	}	

	oDiv.posHeight=oDiv.offsetHeight;
	oDiv.posWidth=oDiv.offsetWidth;
		
	if (!def(attrs["pid"],null)) 
	{
		if(x=="center") rect.shiftx=windowWidth/2-oDiv.posWidth/2;
		if(y=="center") rect.shifty=windowHeight/2-oDiv.posHeight/2;		
				
	}else
	{
		if(x=="center") rect.shiftx=rect.cshiftx-oDiv.posWidth/2;
		if(y=="center") rect.shifty=rect.cshifty-oDiv.posHeight/2;
	}

	if(def(attrs['incorporate'],0)!=1)
	{
	oDiv.style.posLeft=rect.shiftx+def(x,x,1);
	oDiv.style.posTop=rect.shifty+def(y,y,1);
	}
	else
	{
	var parent=oDiv;
	var linkx=0;
	var linky=0;
	while(parent) { 
			if(parent.nodeName=="DIV" && parent.id=="") parent=parent.parentNode;
			linkx+=parent.offsetLeft;
			linky+=parent.offsetTop;				
			if(parent.nodeName=="TD") parent=parent.parentNode;
			if(parent.nodeName=="BODY") break;
			parent=parent.parentNode;
			}
	oDiv.style.posLeft=linkx;
	oDiv.style.posTop=linky;
	}
	
	processAreas(oDiv);
//	processInnerInputs(oDiv);
	
	if (def(attrs["rectangle"],"0")=="1")
	{
	var thick=new Number(def(attrs["thickness"],1));
	var rw=oDiv.posWidth;
	var rh=oDiv.posHeight;
	oDiv.posWidth+=thick;
	oDiv.posHeight+=thick;
	
	var rectcolor=def(attrs['rectcolor'],"red");
		
	var oRect=document.all["rect_"+id];
	if (def(oRect,null)) document.body.removeChild(oRect);
	oRect=document.createElement("DIV");

	oRect.innerHTML='<v:rect filled="false" stroke="true" strokeweight="'+thick+'px" strokecolor="'+rectcolor+'"  style="position:absolute;top:1;left:1;width:'+rw+';height:'+rh+'"></v:rect>';
	oDiv.appendChild(oRect);
	}
	
	//if(!existflag) 
		updateFieldsFromVariables(oDiv);
	
	var transit=def(attrs['transition'],0,1);
	if(display=="inline")	
	{
	var autosound=def(attrs['sound'],0,1);
	/*
	if(autosound && MPlayer1 && soundFlag)
	{			
		var filename=def(attrs['soundsrc'],null);
		var playing="1";
		if(filename) 
		{
		MPlayer1.SendPlayStateChangeEvents=false;
		MPlayer1.Stop();	
		MPlayer1.FileName=filename;
		MPlayer1.Play();
		MPlayer1.SendPlayStateChangeEvents=true;
		}
	}
	*/

	if(autosound && FPlayer1!=null && soundFlag)
	{			
		var filename=def(attrs['soundsrc'],null);
		var playing="1";
		if(filename) 
		{
		/*
		var mySoundObj1 = new FlashSound();		
		mySoundObj1.embedSWF(filename);
		//mySoundObj1.TPlay("/");	
		*/
		if(FPlayer1.object!=null) {
			try {
				prevSoundFile = FPlayer1.object.Movie;
				FPlayer1.object.Movie = filename;
				FPlayer1.object.Play();
			} catch(x) {}
		} else {
			try {
				prevSoundFile = FPlayer1.Movie;
				FPlayer1.Movie = filename;
				FPlayer1.Play();
			} catch(x) {}
		}
		}
	}

	if(transit) 
	{	
	 attrs['pid']=id;
 	 processTransition(child,attrs);	 
	}	
	else
	{
	oDiv.style.display=display;
	oDiv.style.visibility="visible";
	child.setAttribute("tempdisplay",display);
	}

	}
	else
	{
	oDiv.style.display=display;
	oDiv.style.visibility="visible";
	child.setAttribute("tempdisplay",display);
	}
	
	if(def(attrs['draggable'],0)==1) 
	{
		oDiv.draggable=1;
		oDiv.onmousedown=new Function("drags("+oDiv.id+")");
	}

	if (def(attrs['wait'],null)==1) 
		processWait(child,attrs);			
	return true;
}

 

function processAreas(elem)
{
	var areas=elem.all.tags("AREA");
	var i=0;
	
	var linkx=0;
	var linky=0;
	/*
	var parent=elem;
	while(parent) 
	{ 
	linkx+=parent.offsetLeft;
	linky+=parent.offsetTop;
	parent=parent.parentNode; 	
	if(parent.nodeName=="BODY") 	break;
	}
	*/

	for ( i=0;i<areas.length;i++)
	{
		areas[i].id=def(areas[i].id1,areas[i].id);
		processHighlight(areas[i],true,elem);		
		areas[i].id=areas[i].id.substring(5,elem.id.length);
		if (def(areas[i].rectangle,"0")=="1" && areas[i].shape=="RECT") 
		{			
			var coord=new String(areas[i].coords);
			var coords=coord.split(",");
			if (coords.length<4) return false;
					
			var thick=new Number(def(elem.thickness,1));
			var rectcolor=def(elem.rectcolor,"red");
			var posLeft=linkx+Number(coords[0])-thick;
			var posTop=linky+Number(coords[1])-thick;					
			var rw=Number(coords[2])-Number(coords[0])+thick;
			var rh=Number(coords[3])-Number(coords[1])+thick;

			oRect=document.createElement("DIV");
	
			oRect.style.width=rw;
			oRect.style.height=rh;
			oRect.style.position="absolute";
			oRect.style.display=elem.style.display;
			oRect.style.posLeft=posLeft;
			oRect.style.posTop=posTop;	
			oRect.innerHTML='<v:rect filled="false" stroke="true" strokeweight="'+thick+'px" strokecolor="'+rectcolor+'"  style="position:absolute;top:1;left:1;width:'+rw+';height:'+rh+'"></v:rect>';
			elem.appendChild(oRect);
		}
		
	}
	
}

function createWaitLoader(id)
{
  if(!def(document.all[id],null)) {leaveCritical();return true;}
  if ( document.all[id].offsetHeight!=0 || document.all[id].offsetWidth!=0)  {leaveCritical();return true;}
  setTimeout("createWaitLoader('"+id+"')",MOVE_TICK);
}

function processButton(child,attrs)
{
	if (!attrs) return false;	

	var value=def(attrs["value"],"");		
	var id=def(attrs["id"],null);
		
	var oDiv=document.all[id];
	var oButton;
	if (typeof(oDiv)=="undefined") 
	{
		oButton=document.createElement("INPUT");
	}
	else
	oButton=oDiv.firstChild;
	if (!oButton) oButton=document.createElement("INPUT");
	oButton.value=value;
	oButton.type="button";
	oButton.objtype="button";
	oButton.name=id;	
	processObject(child,attrs,oButton);	
	return true;
}

function processRectangle(child,attrs)
{
	if (!attrs) return false;	
	var i=0;		
	var w=new Number(def(attrs["w"],0));	
	var h=new Number(def(attrs["h"],0));
	var thick=new Number(def(attrs["thickness"],1));
	var color=def(attrs['color'],"red");	
	w=new Number(def(attrs["tw"],w));
	h=new Number(def(attrs["th"],h));
	
	var id=def(attrs["id"],null);	
	var display=def(attrs["display"],"none");
	
	var oRect=document.all[id];	
	if (def(oRect,null)) document.body.removeChild(oRect);
	oRect=document.createElement("DIV");	
	oRect.thick=thick;
	oRect.rectcolor=color;	
	/*
	oRect.innerHTML='<v:shape style="LEFT:0;top:0;position:static;width:'+w+';height:'+h+';" filled="false" stroke="true" strokeweight="'+thick+'px" strokecolor="'+color+'"  path="m 0,0 l 0,'+h+', '+w+','+h+','+w+',0 x e" coordsize="'+w+','+h+'" ></v:rect>';
	*/
	
	oRect.objtype="rect";
	processObject(child,attrs,oRect);
	return true;
}

function getRect(id,position,x,y,w,h)
{	
	var oDiv=document.all[id];
	if (typeof(oDiv)=="undefined") 
	{
		var target=root.selectSingleNode('.//*[@id="'+id+'"]');
		if(!target) return null;
		var display=def(target.getAttribute("display"),"none");
		
		//target.setAttribute("display","none");
		xmlProcess(target);
		//target.setAttribute("display",display);

		oDiv=document.all[id];
		if (typeof(oDiv)=="undefined") return null;
	}
	
	var linkx=0;
	var linky=0;
	var parent=oDiv;
	//while(parent) { linkx+=parent.offsetLeft;linky+=parent.offsetTop;parent=parent.offsetParent;}

	//var parent=elem.parentNode;
	//while(parent) { linkx+=parent.offsetLeft;linky+=parent.offsetTop;parent=parent.offsetParent; if(parent.nodeName=="BODY") break;}
	linkx=parent.style.posLeft;
	linky=parent.style.posTop;
	
	this.shiftw=oDiv.posWidth;
	this.shifth=oDiv.posHeight;

	this.cshiftx=linkx+oDiv.offsetWidth/2;
	this.cshifty=linky+oDiv.offsetHeight/2;

	switch (position)
	{
	case "0":		
		this.shiftx=linkx;
		this.shifty=linky;
		break;
	case "1":
		this.shiftx=linkx;
		this.shifty=linky;
		break;
	case "2":		
		this.shiftx=linkx;
		this.shifty=linky+oDiv.posHeight;

		break;
	case "3":
		this.shiftx=linkx+oDiv.posWidth;
		this.shifty=linky;
		break;
	case "4":
		this.shiftx=linkx+oDiv.posWidth;
		this.shifty=linky+oDiv.posHeight;
		break;
	default:	
		var link=oDiv.all.item(position);		
		if(!link) return null;
		linkx=0;
		linky=0;
		var addlinkx=0;
		var addlinky=0;
		var parent=link;

		if (link.nodeName=="AREA" && IE_6) 
		{
			var map=link.parentNode;
			var e= new Enumerator(oDiv.all) 
			for (;!e.atEnd();e.moveNext())           //Enumerate drives collection.
		      {
		         	var x = e.item();
	 			if (x.nodeName=="IMG" && def(x.useMap,"-")=="#"+map.name) {
					addlinkx=x.offsetLeft;
					addlinky=x.offsetTop;
					break;
					}
		      }				
		}
		
		
		while(parent) { 
			linkx+=parent.offsetLeft;
			linky+=parent.offsetTop;			
			//if(parent.nodeName=="DIV" && parent.id=="") parent=parent.parentNode;
			if (def(parent.incorporate,null)=="1") parent=parent.parentNode;
			if(parent.nodeName=="TD") parent=parent.parentNode;
			if(parent.nodeName=="BODY") break;
			parent=parent.parentNode;
			}
		
		this.shiftx=addlinkx+linkx;
		this.shifty=addlinky+linky;		
		this.link=link;
		this.shiftw=link.offsetWidth;
		this.shifth=link.offsetHeight;
		this.cshiftx=linkx+link.offsetWidth/2;
		this.cshifty=linky+link.offsetHeight/2;	
	}
	return this;
}

function processTransition(child,attrs)
{	
	
	var i=0;
	var id=def(attrs["pid"],null);
	if (!id) return false;
	
	var target=document.all[id];
	if (!def(target,null)) return false;

	var xmlObject=null;

	if (def(attrs['fid'],null)) {target=target.all[attrs['fid']];if(!def(target,null)) return false} else xmlObject=root.selectSingleNode('.//*[@id="'+id+'"]');
	//var f="filter:revealTrans(transition="+attrs['transition']+",duration="+attrs['duration']+")";
	//target.style.filter=f;
	target.filters[0].transition=def(attrs['transition'],6);
	target.filters[0].duration=def(attrs['duration'],2);
	target.filters[0].Apply();	
	
	if (def(attrs['thread'],"1")=="0")
	{	 
	 target.onStart=enterCritical;
	 target.onExit=leaveCritical;
	}
	else
	{
	 target.onStart=voidfunc;
	 target.onExit=voidfunc;
	}
	
	target.onStart();
	target.attachEvent('onfilterchange',transitionEvent);
	if(def(attrs['display'],"inline")=="none")
	{	
	target.style.visibility="hidden";
	target.displayOff=1;
	}
	else	
	{
	target.style.display="inline";
	target.style.visibility="visible";
	}
	target.filters[0].Play();	
	if(def(xmlObject,null)) xmlObject.setAttribute("tempdisplay",target.style.display);
	
}

function transitionEvent()
{

 if (window.event.srcElement.filters.revealTrans.status==0) 
{
if(def(window.event.srcElement.displayOff,0)==1) window.event.srcElement.style.display="none";
window.event.srcElement.onExit();
}
}

function processMove(elem,attrs)
{
	if (!attrs) return false;

	var i=0;			
	var x=def(attrs["x"],0);
	var y=def(attrs["y"],0);
	var w=def(attrs["w"],0);
	var h=def(attrs["h"],0);
	var id=def(attrs["pid"],null);	
	var thread=def(attrs["thread"],"0");
	var speed=def(attrs["speed"],1);
	var smooth=def(attrs["smooth"],"1");
	var reach=def(attrs["reach"],"");
	var cid=def(attrs["cid"],"");
	
	var parent=elem.parentNode;
	while(!id && parent) { id=parent.getAttribute("id");parent=parent.parentNode;}
	
	if(typeof(document.all[id])=="undefined") 
	{
		xmlProcess(target);
		if(typeof(document.all[id])=="undefined") return false;
	}
	
	var target=root.selectSingleNode('.//*[@id="'+id+'"]');

	if(smooth=="1")
	{ 
	 if(moveobj.length==0) index=0;else index=moveobj.length;
	 moveobj[index]=new createMoveObject(id,x,y,speed,cid,reach);	 
	 moveobj[index].index=index;
	 moveobj[index].xmlelem=target;

	 if(thread=="0")
	 {
	 moveobj[index].onStart=enterCritical;
	 moveobj[index].onEnd=leaveCritical;
	 }
	 else
	 {
	 moveobj[index].onStart=voidfunc;
	 moveobj[index].onEnd=voidfunc;
	 }

	 moveobj[index].onStart();	 
	 moveobj[index].timeOn=setTimeout("move(moveobj["+index+"])",MOVE_TICK);
	 
	} else
	{
	 
	  if (reach!="")
	  {
	  var rect=getRect(cid,reach);
	  if (rect)
	 {
		 x=Number(x)+Number(rect.shiftx);
		 y=Number(y)+Number(rect.shifty);
	 }  
	 }
	
	 if (def(attrs['jump'],null))
	{
		document.all[id].removeNode(true);	
		target.setAttribute("position",reach);
		xmlProcess(target);
		return false;
	}
	 document.all[id].style.posLeft=x;
	 document.all[id].style.posTop=y;
	
	 target.setAttribute("x",x);
	 target.setAttribute("y",y);
	 target.setAttribute("w",w);
	 target.setAttribute("h",h);

	}

}

function processCancelMove(elem,attrs)
{
	if (!attrs) return false;
	
	var i=0;
	var id;	
	id=def(attrs["pid"],null);	
	var all=def(attrs["all"],"0");
	
	if (all!="1")
	{
	var parent=elem.parentNode;	
	while(!id && parent) { id=parent.getAttribute("id");parent=parent.parentNode;}	
	for (int=0;i<moveobj.length;i++)
	if(moveobj[i].id=id) clearTimeout(moveobj[i].timeOn);
	}
	else
	{
	for (int=0;i<moveobj.length;i++)
	 clearTimeout(moveobj[i].timeOn);
	}
}

function processWait(elem,attrs)
{
	if (!attrs) return false;

	var i=0;
	var id=def(attrs["pid"],null);	
	var mil=def(attrs["mil"],0,1);
	var check=def(attrs["check"],null);	
	
	//var index=0;
	//if(criticalobj.length==0) index=0;else index=criticalobj.length;

	if (check==null) 
	{
	 enterCritical();	 
	 lTimer=setTimeout("leaveCritical()",Number(mil));
	};
	if (check=="1") 	enterCritical();
	if (check=="0") leaveCritical();		
	if (mil!=0) lTimer=setTimeout("leaveCritical()",Number(mil));
}

function createMoveObject(id,x,y,speed,cid,reach)
{
  this.moveFunc=move;
  this.curx=document.all[id].offsetLeft;
  this.cury=document.all[id].offsetTop;
  if (reach!="")
  {
  var rect=getRect(cid,reach);
  if (rect)
 {
 x=Number(x)+Number(rect.shiftx);
 y=Number(y)+Number(rect.shifty);
 }  
  }
  this.x=x;
  this.y=y;
  this.id=id;
  this.speed=speed;
  this.obj=document.all[id];
  if (this.curx<this.x) this.stepx=1*this.speed;else this.stepx=-1*this.speed;
  if (this.cury<this.y) this.stepy=1*this.speed;else this.stepy=-1*this.speed;
  this.target=false;
  this.tx=false;
  this.ty=false;	 
  this.kx=this.stepx/Math.abs(this.stepx);
  this.ky=this.stepy/Math.abs(this.stepy);  
  return this;
}

function move(elem)
{	
	
	if(!elem.tx && elem.kx*elem.curx<=elem.kx*elem.x) elem.curx+=elem.stepx;else {elem.tx=true;elem.curx=elem.x;}
	if(!elem.ty && elem.ky*elem.cury<=elem.ky*elem.y) elem.cury+=elem.stepy;else {elem.ty=true; elem.cury=elem.y;}
	elem.obj.style.posLeft=elem.curx;
	elem.obj.style.posTop=elem.cury;
	if(elem.tx && elem.ty) 
	{
		elem.target=true;
		elem.onEnd(); 
		clearTimeout(elem.timeOn);		
		delete elem;
		return true;
	}	
	elem.xmlelem.setAttribute("x",elem.curx);
	elem.xmlelem.setAttribute("y",elem.cury);
	//elem.xmlelem.setAttribute("w",w);
	//elem.xmlelem.setAttribute("h",h);
	elem.timeOn = setTimeout("move(moveobj["+elem.index+"])",MOVE_TICK);
}

function enterCritical()
{  
 semaphore+=1; 
 clearTimeout(sTimer);
 sTimer=setTimeout("tickCritical()",CRITICAL_TICK);
}

function tickCritical()
{ 
 clearTimeout(sTimer);
 sTimer=setTimeout("tickCritical()",CRITICAL_TICK);
}

function leaveCritical()
{
 semaphore-=1;
 if(semaphore<0) semaphore=0;
 clearTimeout(sTimer);
 clearTimeout(lTimer);
 lTimer=0;
};

function voidfunc(cancel)
{ 
  if(def(window.event,null)) 
{
	window.event.cancelBubble=true; 
	var elem=window.event.srcElement;
	if (def(elem,null) && elem.type=="radio") 
	{
		//elem.checked=elem.checked ? false:true;
		
	}
}

}

function cancelPaste(cancel)
{ 
window.event.returnValue=false;
}


function acceptInput()
{ 
	 var elem=window.event.srcElement;
	window.event.cancelBubble=true;
	 if (def(elem.variable,null)) 
	{
	if (elem.expression=="1")
		var value=recalcExpr(elem.value);
	else	
		var value=elem.value;
	
	if (value!="")
	{
	var nvalue=new Number(value);
	value=isNaN(nvalue) ? value:nvalue;
	}

	switch(elem.type)
	{
		case "checkbox":
			if(def(elem.id,"")=="") {var datas=new Array(elem);} else var datas=document.all[elem.id];
			var i=0;
			var strvalue=new String;
			for(i=0;i<datas.length;i++)
				if (datas[i].checked) strvalue+=(datas[i].value+":");else strvalue+=("0:");
			strvalue=strvalue.substring(0,strvalue.length-1);
			if (strvalue!="")
			{
			var nvalue=new Number(strvalue);
			value=isNaN(nvalue) ? strvalue:nvalue;
			}
			break;
	}			
	
	var v=new Object;
	v.value=value;
	v.name=elem.variable;
	 varobj[elem.variable]=v;
	var targets=root.selectNodes('.//LABEL[@variable="'+elem.variable+'"]');
	
	for (var i=0;i<targets.length;i++)
	{
	var target=document.all[targets[i].getAttribute('id')];
	if (!def(target,null)) 
	{
	var xtarget=targets[i];
	xmlProcess(xtarget);	
	var target=document.all[xtarget.getAttribute('id')];
	}
	if(def(target,null)) target.innerHTML=value;
	}	

	}
}

function processSound(elem,attrs)
{	
	if (!attrs) return false;

	var i=0;		
	var src=def(attrs["src"],"");
	var loop=def(attrs["loop"],1);

	document.all['_sound_'].loop = loop;
    document.all['_sound_'].src = src;
}

function processDisplay(elem,attrs)
{
	if (!attrs) return false;
	
	var i=0;	
	var id=def(attrs["pid"],null);	
	var display=def(attrs["display"],"none");
	if(!id)
	{
	for (int=0;i<document.all.length;i++)
	{
	  id=def(document.all[i].id,null);
	  if(id && id!="" && root.selectSingleNode('.//*[@id="'+id+'"]')) document.all[i].style.display=display;
	}
	return false;
	}

	var target=root.selectSingleNode('.//*[@id="'+id+'"]');
	
	if (def(attrs['remove'],null)) {if(def(document.all[id],null)) document.all[id].removeNode(true);return false;}
	if(typeof(document.all[id])=="undefined") 
	{
		xmlProcess(target);
		if(typeof(document.all[id])=="undefined") return false;
	}	
	
	var refineid=def(attrs["refineid"],null);
	if(refineid)
	{
	var object=document.all[id];
	var refobject=object.all[refineid]
	if(!def(refobject,null)) return false;	
	}
	else
	var refobject=document.all[id];
	if(def(attrs['visibility'],"0")=="1") 
	{
	if (display=="switch") 
		if (refobject.style.visibility=="visible") display="none";
		else display="inline";
	refobject.style.visibility=(display=="inline") ? "visible": "hidden";	
	}
	else
	{
	if (display=="switch") 
		if (refobject.style.display=="inline") display="none";
		else display="inline";
	refobject.style.display=display;	
	}
	if(def(attrs['focus'],"")=="1") refobject.focus();
	var tattrs=getTagVars(target);
	var autosound=def(tattrs['sound'],0,1);	
	if(autosound && FPlayer1!=null && soundFlag)
	{			
		var filename=def(tattrs['soundsrc'],null);
		var playing="1";
		if(filename) 
		{		
		if(display=="inline")
		{
			if(FPlayer1.object!=null) {
				try {
					prevSoundFile=FPlayer1.object.Movie;
					FPlayer1.object.Stop();
					FPlayer1.object.Movie=filename;
					FPlayer1.object.Play();
				} catch(x) {}
			} else {
				try {
					prevSoundFile=FPlayer1.Movie;
					FPlayer1.Stop();
					FPlayer1.Movie=filename;
					FPlayer1.Play();
				} catch(x) {}
			}
		}
		else
		{
			if(FPlayer1.object!=null) {
				try {
					FPlayer1.object.Stop();
				} catch(x) {}
			} else {
				try {
					FPlayer1.Stop();
				} catch(x) {}
			}
		}
		}
	}	

	var i=0;
	if (def(refobject.id,null))
	{
		var sattelites=root.selectNodes('./SATTELITE[@pid="'+refobject.id+'"]');
		for (i=0;i<sattelites.length;i++)
		{
		try
		{
		document.all[sattelites[i].getAttribute("sid")].style.display=display;
		}
		catch(x)
		{

		}

		}
	}
	if(def(attrs['nomodified'],"0")!="1") target.setAttribute("tempdisplay",display);
}

function processChangeProperty(elem,attrs)
{	
	if (!attrs) return false;
	
	var i=0;
	var name=def(attrs["name"],"");	
	var value=def(attrs["value"],"");
	var id=def(attrs["pid"],null);	
	if(!id) return false;
	if(typeof(document.all[id])=="undefined") return false;
	eval("document.all['"+id+"']."+name+"="+value);
}

function processMsgBox(elem,attrs)
{
 	alert(def(attrs["value"],""));
} 


function processChangeAttribute(elem,attrs)
{	
	if (!attrs) return false;
	
	var i=0;
	var name=def(attrs["name"],"");	
	var value=def(attrs["value"],"");
	var id=def(attrs["pid"],null);	
	if(!id) return false;
	
	var target=root.selectSingleNode('.//*[@id="'+id+'"]');
	if(target) target.setAttribute(name,value);	
}


function processVariable(elem,attrs)
{
	if (!attrs) return false;
	
	var i=0;
	var name=def(attrs["name"],"");	
	var value=def(attrs["value"],"");
	if (value!="")
	{
	var nvalue=new Number(value);
	value=isNaN(nvalue) ? value:nvalue;
	}
	var v=new Object;
	v.value=value;
	v.name=name;
	v.xml=def(attrs['xml'],null);
	varobj[name]=v;
  
	var targets=cur_task.selectNodes('.//LABEL[@variable="'+name+'"]');
	for (i=0;i<targets.length;i++)
	{
	var target=document.all[targets[i].getAttribute('id')];
	if (!def(target,null)) 
	{
	xmlProcess(targets[i]);
	var target=document.all[targets[i].getAttribute('id')];
	}
	if(def(target,null)) target.innerHTML=value;
	}	
}

function processFor(elem,attrs)
{	
	if (!attrs) return false;
	
	var i=0;
	var from=new Number(def(attrs["from"],0));	
	var to=new Number(def(attrs["to"],0));
	var step=new Number(def(attrs["step"],1));	
	var thread=def(attrs["thread"],"1");		
	var index;

	if(forobj.length==0) index=0;else index=forobj.length;	 	 
	 forobj[index]=new createForObject(from,to,step);
	 forobj[index].index=index;
	 forobj[index].xmlelem=elem;

	 if(thread=="0")
	 {
	 forobj[index].onStart=enterCritical;
	 forobj[index].onEnd=leaveCritical;
	 }
	 else
	 {
	 forobj[index].onStart=voidfunc;
	 forobj[index].onEnd=voidfunc;
	 }

	 forobj[index].onStart();	 
	 forobj[index].timeOn=setTimeout("foring(forobj["+index+"])",FOR_TICK);
}

function processResponse(child)
{
	var subresp=child.childNodes[0];
	var savetask=cur_task;
	while(subresp)
	{
	processAction(subresp);
	if(savetask!=cur_task) return false;
	subresp=subresp.nextSibling;
	}
}

function checkOrder(elem1,elem2)
{
 
	var sibling=elem1;	
	while(sibling && sibling!=elem2) {sibling=sibling.nextSibling;}
	if (sibling && sibling==elem2) return false;else return true;

}

function processEvent(excl,container,eventflag) {
if(!cur_task) return false;

if(def(eventflag,false))
{
  return processCustomEvent(excl,container);
}

if(def(container,null)) {
	var res_task=root.selectSingleNode(".//TASK[descendant-or-self::*[@id='"+container+"']]")
	if (!res_task) res_task=cur_task;
} else {
	var res_task=cur_task;
}

 var j=0;
 var k=0;
 var max=0;
 var fired=false;
 var attrs;

 var event=window.event;
 if(event && typeof(excl)!="string") {
	var parent=event.srcElement;
	while(parent) { 	
		if((parent.nodeName=="A" || parent.nodeName=="AREA") && !parent.disabled) {
			var posdhtml=parent.href.indexOf("/localdhtml/");	
			var poslink=parent.href.indexOf("/locallink/");
			if(posdhtml!=-1) {
				var ref=parent.href.substring(posdhtml+12,parent.href.length);
				processNavigation(-1,ref);
				event.cancelBubble=true;
				return false;
			}
			if(poslink!=-1) {
				var ref=parent.href.substring(poslink+11,parent.href.length);
				var excl=ref;
				break;
			}
		}
		if(parent.nodeName=="BODY") break;	
		parent=parent.parentNode; 	
	}	
	event.cancelBubble=true;
 }
 destroyPopup();
 if (typeof(excl)=="string") {
	processHighdark(document.all['high_link_'+excl]);
	var responses=res_task.selectNodes('.//*[@tempdisplay="inline"]/RESPONSE[(not(@dis) or @dis!="1") and @type="link" and (@name="'+excl+'" or @error="'+eventAttribute+'")]'); 
	if (!responses) return false;
	if (responses.length==0) {
  		var cresponse=res_task.selectSingleNode('./RESPONSE[(not(@dis) or @dis!="1") and @type="link" and (@name="'+excl+'" or @error="'+eventAttribute+'")]');
 		if(!cresponse) {
			if(!sub_task) return false;
			cresponse=sub_task.selectSingleNode('./RESPONSE[(not(@dis) or @dis!="1") and @type="link" and (@name="'+excl+'" or @error="'+eventAttribute+'")]');
			if (!cresponse) return false;
		}
		var k=0;
		var i=0;
		var responses=new Array(cresponse);
	}
 } else {
 	var responses=res_task.selectNodes('.//*[@tempdisplay="inline"]/RESPONSE[(not(@dis) or @dis!="1") and @type="'+event.type+'"]');
 }
 if (responses!=null) { 
	for(j=0;j<responses.length;j++) {
		var z=Number(def(responses[j].getAttribute("z-index"),0));
		if(max<z) max=z;
	}
	for(j=0;j<responses.length;j++)	{
		var curz=Number(def(responses[j].getAttribute("z-index"),0));	
		if (curz>=max && checkHit(responses[j])) {
			fired=true;
			//event.cancelBubble=true;
			//window.status+=" "+responses[j].parentNode.getAttribute("id");
			//if (window.status=="true") 
			//	document.body.innerHTML=responses[j].getAttribute("tempdisplay")+event.type;
			processResponse(responses[j]);
		}
	}
 }
 if(sub_task) {
	var presp=sub_task.selectNodes('./RESPONSE[(not(@dis) or @dis!="1") and @type!="link"]');
 } else {
	var presp=res_task.selectNodes('./RESPONSE[(not(@dis) or @dis!="1") and @type!="link"]');
 }
 if (presp!=null) {
 	for(j=0;j<presp.length;j++) {
		if (checkOrder(cur_object,presp[j])) {
			if(checkHit(presp[j])) {
				if (def(presp[j].getAttribute("z-index"),0)>=max && !fired) {
					processResponse(presp[j]);
				}
			}
		}
	}
 }
// event.cancelBubble=false;
//23.01.2006 - true
 event.cancelBubble=true;
 return false;
}

function checkHit(child)
{
	var ev=window.event;
	if (!child.hasChildNodes) return false;		
	var parent=child.parentNode;
	if (child.getAttribute("type")=="link" || child.getAttribute("type")=="context") return true;
	try
	{
	if (def(ev,null) && def(ev.srcElement,null) && def(ev.srcElement.type,null))
		if (ev.srcElement.type=="button" && parent.getAttribute("id")==ev.srcElement.name) return true;
	}
	catch(x)
	{
	return false;
	}

	var flag=false;	

	switch(ev.type)
	{
	case 'click':		
	var x1=new Number(def(child.getAttribute("x"),0));
	var y1=new Number(def(child.getAttribute("y"),0));
	var h1=new Number(def(child.getAttribute("h"),0));
	var w1=new Number(def(child.getAttribute("w"),0));

	var x=new Number(def(parent.getAttribute("x"),0));
	var y=new Number(def(parent.getAttribute("y"),0));
	var h=new Number(def(parent.getAttribute("h"),0));
	var w=new Number(def(parent.getAttribute("w"),0));

	if(w1==0) w1=w;
	if(h1==0) h1=h;
	//alert(child.parentNode.getAttribute("id")+"("+ev.x+","+ev.y+") ("+(x+x1)+","+(y+y1)+") ("+(x+x1+w)+","+(y+y1+h)+")");
	if (ev.x>=(x+x1) && ev.x<=(x+x1)+w1 && ev.y>=(y+y1) && ev.y<=(y+y1)+h1) flag=true;
	break;
	
	case 'contextmenu':		
	/*
	var x1=parseInt(def(child.getAttribute("x"),0));
	var y1=parseInt(def(child.getAttribute("y"),0));
	var h1=parseInt(def(child.getAttribute("h"),0));
	var w1=parseInt(def(child.getAttribute("w"),0));

	var x=parseInt(def(parent.getAttribute("x"),0));
	var y=parseInt(def(parent.getAttribute("y"),0));
	var h=parseInt(def(parent.getAttribute("h"),0));
	var w=parseInt(def(parent.getAttribute("w"),0));

	if(w1==0) w1=w;
	if(h1==0) h1=h;
	//alert(child.parentNode.getAttribute("id")+"("+ev.x+","+ev.y+") ("+(x+x1)+","+(y+y1)+") ("+(x+x1+w)+","+(y+y1+h)+")");
	if (ev.x>=(x+x1) && ev.x<=(x+x1)+w1 && ev.y>=(y+y1) && ev.y<=(y+y1)+h1) flag=true;
	*/
	flag=true;
	break;

	case 'keypress':	
	 var key=child.getAttribute("key");	 
	 if (key==ev.keyCode || key=="any" ) flag=true;
	break;
	}
					
	return flag;
}

function createForObject(from,to,step)
{ 
 this.from=from;
 this.to=to;
 this.step=step;
 this.cc=from;
}

function foring(elem)
{		
	var child=elem.xmlelem.firstChild;
	while(child)
	{
	var v=new Object;
	v.value=parseInt(elem.cc);
	v.name="cc";
	varobj[v.name]=v;		
	child.setAttribute("cc",elem.cc);
	xmlProcess(child);
	child=child.nextSibling;
	}
	var k=elem.step/Math.abs(elem.step);
	if (elem.cc*k>=elem.to*k) {elem.onEnd();clearTimeout(elem.timeOn);delete elem;return true;}			
	elem.xmlelem.setAttribute("cc",elem.cc);
	elem.cc+=elem.step;
	
	forobj[elem.index].timeOn=setTimeout("foring(forobj["+elem.index+"])",FOR_TICK);
}

function getTagVars(elem)
{
 
	var attrs=elem.attributes;
	if (typeof(attrs)=='undefined' || attrs.length==0) return null;
	
	var tagVars=new Array();
	var objTagVars=new Array();
	var lobj=null;

	var matches;
	
	for (var i=0;i<attrs.length;i++)
	{
	tagVars[attrs[i].name]=attrs[i].value;
	lobj=new Object;
	lobj.name=attrs[i].name;
	lobj.value=attrs[i].value;
	objTagVars[lobj.name]=lobj;

	matches=attrs[i].value.match("^eval[ ]*:[ ]*([A-Za-z0-9_]*)[ ]*=([A-Za-z0-9_]*)");
	if (matches) 
	 {
	  switch (matches[1])
	  {
	  case "attribute":
		tagVars[attrs[i].name]=elem.getAttribute(matches[2]);
		lobj=new Object;
		lobj.name=attrs[i].name;
		lobj.value=tagVars[attrs[i].name];
		objTagVars[lobj.name]=lobj;
		break;
	  case "parent_attribute":
		tagVars[attrs[i].name]=elem.parentNode.getAttribute(matches[2]);
		lobj=new Object;
		lobj.name=attrs[i].name;
		lobj.value=tagVars[attrs[i].name];
		objTagVars[lobj.name]=lobj;
		break;

	  case "variable":
		try
		{
			tagVars[attrs[i].name]=varobj[matches[2]].value;
			lobj=new Object;
			lobj.name=attrs[i].name;
			lobj.value=tagVars[attrs[i].name];
			objTagVars[lobj.name]=lobj;
		}
		catch(x)
		{
			tagVars[attrs[i].name]=null;
			lobj=new Object;
			lobj.name=attrs[i].name;
			lobj.value=tagVars[attrs[i].name];
			objTagVars[lobj.name]=lobj;
		}
		break;	 
	  }
	 }
	matches=attrs[i].value.match("^javascript[ ]*:(.*)");
	if (matches) 
	{
	var patrn = /(#)(\w+(\.\w*)?)([\W\$])/g;
	var m=matches[1]+" ";
	var scr=m.replace(patrn,"varobj['$2'].value$4");	
	try
	{
	   var res=eval(scr);
	   tagVars[attrs[i].name]=res;
		lobj=new Object;
   		lobj.name=attrs[i].name;
		lobj.value=tagVars[attrs[i].name];
		objTagVars[lobj.name]=lobj;
	 }
	catch(x)
	{
	var patrn = /(#)(\w+(\.\w*)?)([\W\$])/g;
	var m=matches[1]+" ";
	var scr=m.replace(patrn,"globalVarobj['$2'].value$4");	
	try
	{
	   var res=eval(scr);
	   tagVars[attrs[i].name]=res;
		lobj=new Object;
		lobj.name=attrs[i].name;
		lobj.value=tagVars[attrs[i].name];
		objTagVars[lobj.name]=lobj;
	 }
	catch(x)
	{
	tagVars[attrs[i].name]="";
		lobj=new Object;
		lobj.name=attrs[i].name;
		lobj.value=tagVars[attrs[i].name];
		objTagVars[lobj.name]=lobj;
	}  
	}	   
	}

	}
	tagVars["_enumerator_"]=objTagVars;
	return tagVars;
}

function def(v,t,c)
{

try
{
switch(c)
{
case 1:var n=Number(v);if(isNaN(n)) return 0;else return n;
};

if (typeof(v)!="undefined" && v!=null) return v;

if (typeof(t)=="undefined") return 0; else return t;
}
catch(x)
{
return 0;
}  

}

function recalcExpr(expr,defval)
{
	var texpr=expr;
	matches=texpr.match("^eval[ ]*:[ ]*([A-Za-z0-9_]*)[ ]*=([A-Za-z0-9_]*)");
	if (matches) 
	 {
	  switch (matches[1])
	  {
	  case "attribute":
		texpr=elem.getAttribute(matches[2]);break;
	  case "parent_attribute":
		texpr=elem.parentNode.getAttribute(matches[2]);break;
	  case "variable":
		texpr=varobj[matches[2]].value;
		break;	 
	  }
	 }
	
	var patrn = /(#)(\w+(\.\w*)?)([\W\$])/g;
	var m=expr+" ";
	var scr=m.replace(patrn,"varobj['$2'].value$4");	
	try{
	   var res=eval(scr);
	  texpr=res;
	}
	catch(x)
	{
		texpr=defval;
	}		   
	
return texpr;
}

function processHighlight(elem,noStyle,pDiv)
{
	if (def(elem.highlight,"0")!="1") return false;

	if (def(document.all['high_'+elem.id],null)) 
	{
		var oImg=document.all['high_'+elem.id].firstChild.firstChild;
		if(!def(noStyle,false)) 
			oImg.style.filter="progid:DXImageTransform.Microsoft.Gradient(GradientType=1, StartColorStr='"+elem.startcolor+"', EndColorStr='"+elem.endcolor+"')";
		return false;
	}

	var oDiv=document.createElement("DIV");
	var oImg=document.createElement("IMG");
	oImg.src="/abt_dhtml.nsf/1blank.gif";
	oImg.border="0";
	var linkx=0;
	var linky=0;
	var parent=elem.parentNode;
	var zIndex=0;
	var addlinkx=0;
	var addlinky=0;

	while(parent) 
	{ 
	linkx+=parent.offsetLeft;
	if(parent.nodeName!="TD") linky+=parent.offsetTop;
	
	if (def(parent.incorporate,null)=="1") parent=parent.parentNode;
	parent=parent.parentNode; 
	//if(parent.nodeName=="TD") parent=parent.parentNode;
	if (parent.style.zIndex>zIndex) zIndex=parent.style.zIndex;	
	if(parent.nodeName=="BODY") 	break;
	
	}	
	
	var map=elem.parentNode;	
	if(pDiv && IE_6)
	{
	var e= new Enumerator(pDiv.all); 
	for (;!e.atEnd();e.moveNext())
	    {
	       	var x = e.item();			
			if (x.nodeName=="IMG" && def(x.useMap,"-")=="#"+map.name)
			 {
			addlinkx=x.offsetLeft;
			addlinky=x.offsetTop;
			break;
			}			
      	}
	//linkx=0;
	//linky=0;
	}
		
	
	switch(elem.shape)
	{
	case "RECT":		
		var coord=new String(elem.coords)
		var coords=coord.split(",");
		if (coords.length<4) return false;
		var posLeft=addlinkx+linkx+Number(coords[0]);
		var posTop=addlinky+linky+Number(coords[1]);
		var posWidth=Number(coords[2])-Number(coords[0]);
		var posHeight=Number(coords[3])-Number(coords[1]);		
		oDiv.style.position="absolute";
		oDiv.style.posLeft=posLeft;
		oDiv.style.posTop=posTop;
		oDiv.style.posWidth=posWidth;
		oDiv.style.posHeight=posHeight;
		oImg.width=posWidth;
		oImg.height=posHeight;		
		oImg.art=elem.id;
		oDiv.id="high_"+elem.id;
		oDiv.name="parent_"  + pDiv.id
		oDiv.style.zIndex=zIndex+1;	
		if (def(elem.startcolor,"")=="") elem.startcolor="#99FF00FF";
		if (def(elem.endcolor,"")=="") elem.endcolor="#99FF00FF";
		if(!def(noStyle,false)) 
			oImg.style.filter="progid:DXImageTransform.Microsoft.Gradient(GradientType=1, StartColorStr='"+elem.startcolor+"', EndColorStr='"+elem.endcolor+"')";
		var parentdoc=def(document.all.BODY,document.body);
		var vhighLightObject=elem.id.substring(5,elem.id.length);

		if(elem.id=="link_prev" || elem.id=="link_next")
		var oLink='<A highlight="1" HREF="'+elem.href+'" onclick="return processNavigation(\''+vhighLightObject+'\');" onmouseover="this.startcolor=\''+elem.startcolor+'\';this.endcolor=\''+elem.endcolor+'\'; this.id=\''+elem.id+'\';processHighlight(this);return true;" onmouseleave="return processHighdark()"></A>';
		else
		var oLink='<A HREF="#" highlight="1" onmouseover="this.startcolor=\''+elem.startcolor+'\';this.endcolor=\''+elem.endcolor+'\'; this.id=\''+elem.id+'\';processHighlight(this);return true;" onclick="return processEvent(\''+vhighLightObject+'\');" onmouseleave="return processHighdark();"></A>';
			
		oDiv.innerHTML=oLink;

		var volink=oDiv.firstChild;
		volink.appendChild(oImg);	
		parentdoc.appendChild(oDiv);	

		var sattelite=xml_document.createElement("SATTELITE");
		sattelite.setAttribute("sid",oDiv.id);
		sattelite.setAttribute("pid",pDiv.id);
		root.appendChild(sattelite);

		oDiv.sTimer=setTimeout("checkHighLight('"+oDiv.id+"')",PROGRAM_TICK);
		break;
	}
	
}

function processHighdark(elem)
{		
	if (!def(elem,null) || !def(elem.id,null)) 
	{
	if (!window.event) return false;
	var oLink=window.event.srcElement;	
	if(!def(oLink,null)) return false;
	if(oLink.nodeName!="A") return false;	
	var oDiv=oLink
	while(oDiv) { oDiv=oDiv.parentNode;if(oDiv.nodeName=="DIV") break; }
	highLightObject="";
	}
	else
	{
	var oDiv=elem;
	}
	var parentdoc=def(document.all.BODY,document.body);
	clearTimeout(oDiv.sTimer);
	oDiv.firstChild.firstChild.style.filter="";
	//parentdoc.removeChild(oDiv);
	return false;
}

function checkHighLight(id)
{
 var oDiv=document.all[id];
 if(!def(oDiv,null)) return false;
 if(!def(oDiv.nodeName,null)) return false;

 if (mousex>=oDiv.style.posLeft && mousex<=oDiv.style.posLeft+oDiv.style.posWidth && mousey>=oDiv.style.posTop && mousey<=oDiv.style.posTop+oDiv.style.posHeight)
{
 oDiv.sTimer=setTimeout("checkHighLight('"+oDiv.id+"')",PROGRAM_TICK);
 return false;
}
 
 processHighdark(oDiv);
 return true;
}


function createNavigatorObject(task)
{
	var navig=task.selectSingleNode("./NAVIGATOR")
	if (!navig) return false;
	id=navig.getAttribute("id");
	
	var existFlag=false;
	if (!def(document.all[id],null))	
	{
 	  var oDiv=document.createElement("DIV");	 		
	}
	else 	
	{		
		var oDiv=document.all[id];
		updatePopup(oDiv);
		existFlag=true;
	}
	
	
	oDiv.style.position="absolute";	
	oDiv.style.posLeft=def(navig.getAttribute("x"),640);
	oDiv.style.posTop=def(navig.getAttribute("y"),480);
	oDiv.style.display="inline";	
	oDiv.style.zIndex=500;
	oDiv.id=id;
	oDiv.posHeight=oDiv.offsetHeight;
	oDiv.posWidth=oDiv.offsetWidth;
	if(existFlag) return false;
	
	var parentdoc=def(document.all.BODY,document.body);
	 if(!parentdoc.contains(oDiv)) parentdoc.appendChild(oDiv);
 	 var anchor=def(document.all.ANCHOR,parentdoc);
	
	var data=navig.selectSingleNode("DATA")	
	document.all[id].innerHTML=data ? data.text:"";

	if (document.all[id].offsetHeight==0 || document.all[id].offsetWidth==0)  {
	enterCritical();
	setTimeout("createWaitLoader('"+id+"')",MOVE_TICK);
	}			
	var linkprev=oDiv.all['prev'];
	var linknext=oDiv.all['next'];
	var linkmenu=oDiv.all['popup'];
	var linkexit=oDiv.all['exit'];

	if(def(linkprev,null))
	{
		linkprev.insertAdjacentHTML('afterend','<A HREF="#" onclick="processNavigation('+"'"+"prev"+"'"+');return false;">Назад</A>');
	}
	if(def(linknext,null))
	{
		linknext.insertAdjacentHTML('afterend','<A HREF="#" onclick="processNavigation('+"'"+"next"+"'"+');return false;">Вперед</A>');
	}
	if(def(linkexit,null))
	{
		linkexit.insertAdjacentHTML('afterend','<A HREF="#" onclick="processNavigation('+"'"+"exit"+"'"+');return false;">Выход</A>');
	}
	if(def(linkmenu,null))
	{
		var navigs=root.selectNodes('./TASK');
		var i=0;
		var header='<SELECT id="_popup_" onchange="processNavigation(document.all._popup_.options[document.all._popup_.selectedIndex].value);destroyPopup();">';

		for (i=0;i<navigs.length;i++)
		{		
		var selected="";
		if(def(navigs[i].getAttribute("keep"),"0")!="3")
		{
		if (navigs[i]==cur_task) {var selected="selected";}
		header+='<OPTION '+selected+' value='+i+'>'+navigs[i].getAttribute('name')+'</OPTION>';
		}
		}
		header+="</SELECT>";	

		linkmenu.innerHTML=header;
		
	}

}


function processNavigation(mov,id,obj)
{
	if(def(obj,null) && obj.disabled) return false;
	if (highLightObject!="") 
	{
	 mov=highLightObject;
	}
	switch(mov)
	 {
	case "prev":
		{
		/*
		var prev_task=cur_task.previousSibling;
		while(prev_task && def(prev_task.getAttribute("keep"),"0")=="3") prev_task=prev_task.previousSibling;		
		if(!prev_task && !cur_task) return false;
		if(!prev_task && cur_task) return false;
		clearTimeout(sTimer);
		clearTimeout(gTimer);
		processAutocloses(cur_task,prev_task);
		if (def(prev_task.getAttribute("keep"),"")=="2") 
			if(def(document.all['navig_'+cur_task.getAttribute('id')],null) && !def(document.all['navig_'+prev_task.getAttribute('id')],null))
				{
				document.all['navig_'+cur_task.getAttribute('id')].id= "navig_"+prev_task.getAttribute('id');	
				updatePopup(document.all['navig_'+prev_task.getAttribute('id')]);
				}
		semaphore=0;
		cur_task=prev_task;
		sendMessage(CUR_TASK);
		*/
		clearTimeout(gTimer);
		semaphore=0;
		prevTask(true);
		sendMessage(CUR_TASK);
		};break;
	case "exit":
		if(confirm("Закрыть окно")) window.close();
		break;
	case "next":
		{

		/*
		var next_task;
		var next_task=cur_task.nextSibling;
		while(next_task && def(next_task.getAttribute("keep"),"0")=="3") 	next_task=next_task.nextSibling;		
		if(!next_task && !cur_task) return false;
		if(!next_task && cur_task) return false;
		clearTimeout(sTimer);
		clearTimeout(gTimer);
		processAutocloses(cur_task,next_task);
		if (def(next_task.getAttribute("keep"),"")=="2") 
			if(def(document.all['navig_'+cur_task.getAttribute('id')],null) && !def(document.all['navig_'+next_task.getAttribute('id')],null))
				{
				document.all['navig_'+cur_task.getAttribute('id')].id= "navig_"+next_task.getAttribute('id');	
				updatePopup(document.all['navig_'+next_task.getAttribute('id')]);
				}
		semaphore=0;
		cur_task=next_task;
		sendMessage(CUR_TASK);
		*/
		clearTimeout(gTimer);
		semaphore=0;
		nextTask(true);
		sendMessage(CUR_TASK);
		};break;
	case "subnext":
		{
		var subnext=subnextTask();
		clearTimeout(gTimer);
		semaphore=0;
		if(!subnext)
		{ 
			if(cur_task.nodeName=="SUBTASK") 
			{
				popArray(taskContainer);
				cur_task=cur_task.parentNode;
			}
			nextTask(true,true);
			sendMessage(CUR_TASK);
		}
		else
		{
			if(cur_task.nodeName=="SUBTASK") popArray(taskContainer);
			var attrs=new Array;
			attrs['pid']=subnext.getAttribute("id");
			processGoto(null,attrs);
			sendMessage(CUR_TASK);
			return false;			
		}
		};break;
	case "subprev":	
		var subprev=subprevTask();
		clearTimeout(gTimer);
		semaphore=0;
		if(!subprev) { 			
			prevTask(true,true);
			sendMessage(CUR_TASK);
		} else {
			if(cur_task.nodeName=="SUBTASK") {
				popArray(taskContainer);
			}
			var attrs=new Array;
			attrs['pid']=subprev.getAttribute("id");
			processGoto(null,attrs,true);
			sendMessage(CUR_TASK);
			return false;			
		}
		break;
	case "popup":
		{
		var parent=document.all[id];
		if(!def(parent,null)) return false;
		var navigs=root.selectNodes('./TASK');
		var i=0;
		if(def(document.all["popup_menu"],null)) document.body.removeChild(document.all["popup_menu"]);
		var mDiv=document.createElement("DIV");
		mDiv.id="popup_menu";
		var header='<SELECT id="_popup_" onchange="processNavigation(document.all._popup_.options[document.all._popup_.selectedIndex].value);destroyPopup();" onclick="window.event.cancelBubble=true;" class=classMenu>';

		var parentdoc=def(document.all.BODY,document.body);
		if(!parentdoc.contains(mDiv)) parentdoc.appendChild(mDiv);
		
		for (i=0;i<navigs.length;i++)
		{		
		var selected="";
		if(def(navigs[i].getAttribute("keep"),"0")!="3")
		{
		if (navigs[i]==cur_task) {var selected="selected";}
		header+='<OPTION '+selected+' value='+i+'>'+navigs[i].getAttribute('name')+'</OPTION>';
		}
		}
		
		header+="</SELECT>";	

		mDiv.innerHTML=header;
		mDiv.style.position="absolute";

		var parent=document.all[id].all['popup'];
		/*
		var linkx=0;
		var linky=0;
		while(parent) { linkx+=parent.offsetLeft;linky+=parent.offsetTop;parent=parent.offsetParent;if(parent.nodeName=="DIV") break;}
		
		mDiv.style.posLeft=document.all[id].style.posLeft+linkx;
		mDiv.style.posTop=document.all[id].style.posTop+linky-mDiv.offsetHeight/2;
		*/
		var linkx=0;
		var linky=0;
		var parent=window.event.srcElement.parentNode;
		while(parent.offsetParent) { linkx+=parent.offsetLeft;linky+=parent.offsetTop;parent=parent.offsetParent;}
		mDiv.style.posLeft=linkx+window.event.offsetX;
		mDiv.style.posTop=linky+window.event.offsetY;
		};break;
	case "close_self":
		if(!def(id,null)) return false;
		var action=xml_document.createElement("ACTION");
		var disaction=xml_document.createElement("DISPLAY");
		disaction.setAttribute("display","none");
		disaction.setAttribute("remove","1");
		disaction.setAttribute("pid",id);
		action.appendChild(disaction);
		processAction(action);		
		break;
	default:
		{
		if(trackVisited && !checkVisited(id)) {
			alert('Вы не можете перейти на слайд, \nна котором Вы еще не побывали, \nнарушив заданную последовательность \nпереходов. Пожалуйста, используйте \nкнопку "Далее".');
			document.getElementById('selector').selectedIndex=curSelectorIndex;
		} else {
		var num=Number(mov);
		if(isNaN(num)) return false;
		var navigs=root.selectNodes(".//NAVIGATOR");		
		var next_task;
		if (num==-1) 
			{
				var attrs=new Array;
				attrs['pid']=id;
				processGoto(null,attrs);
				sendMessage(CUR_TASK);
				return false;
			}
		
		
		if(num!=-2)
		{
		var next_task=navigs[num].parentNode;
		while(next_task && def(next_task.getAttribute("keep"),"0")=="3") 	next_task=next_task.nextSibling;				
		}
		else
		{
		var next_task=navigs[id].parentNode;
		}
		if(!next_task && !cur_task) return false;
		if(!next_task && cur_task) return false;
		clearTimeout(sTimer);
		clearTimeout(gTimer);
		processAutocloses(cur_task,next_task);
		if (def(next_task.getAttribute("keep"),"")=="2") 
			if(def(document.all['navig_'+cur_task.getAttribute('id')],null) && !def(document.all['navig_'+next_task.getAttribute('id')],null))
				{
				document.all['navig_'+cur_task.getAttribute('id')].id= "navig_"+next_task.getAttribute('id');
				updatePopup(document.all['navig_'+next_task.getAttribute('id')]);
				}
		semaphore=0;
		cur_task=next_task;
//		qwUpdateSelector(cur_task);
		sendMessage(CUR_TASK);
		}
		};break;
	 }
	
}

function destroyPopup()
{

if(def(document.all["popup_menu"],null)) 
	document.all["popup_menu"].style.display="none";
}

function updatePopup(oDiv)
{
}

function getCoords()
{
/*
var linkx=0;
var linky=0;
var parent=window.event.srcElement;
while(parent.offsetParent) { linkx+=parent.offsetLeft;linky+=parent.offsetTop;parent=parent.offsetParent;}
mousex=linkx+window.event.offsetX;
mousey=linky+window.event.offsetY;
*/
mousex=window.event.x;
mousey=window.event.y;

 }

 

function processContext(excl)
{

if (areaFired) 		
		{
		areaFired=false;
		return false;
		}

destroyPopup();



window.event.cancelBubble=true;
var responses=null;
	if(typeof(excl)=="string")
 	{	
	areaFired=true;	
		var responses=cur_task.selectNodes('.//RESPONSE[@type="context" and @name="'+excl+'"]');
		}
		else
		{
		 var elem=window.event.srcElement;
		 if(def(elem,null))
		{
		while(elem.nodeName!="BODY" && !def(elem.id,null))
		{
			elem=elem.parentNode;
			
		}
		if(def(elem.id,null)) 
		{
			var responses=cur_task.selectNodes('.//*[@id="'+elem.id+'"]/RESPONSE[@type="context" and not(@name)]');
		}
		}
		}

		if(responses)
		{
	var k=0;
	var i=0;	
	var max=0;
	
	 if (responses.length!=0)  
	 { 
	
	for(j=0;j<responses.length;j++) 	 
	{
	var z=Number(def(responses[j].getAttribute("z-index"),0));
	if(max<z) max=z;
	}
	
	for(j=0;j<responses.length;j++)
	{
	var curz=Number(def(responses[j].getAttribute("z-index"),0));	
	if (curz>=max && checkHit(responses[j]))
		{
		fired=true;
		processResponse(responses[j]);		
		}
	}
	return false;
	}	
	}	

switch (def(root.getAttribute("maskcontext"),"0"))
{
case "0":
		var navtask=cur_task;
		if (navtask.nodeName=="SUBTASK") 
		{
		var i=0;
		for (i=taskContainer.length-1;i>=0;i--)
		{
			var navtask=taskContainer[i];
			if(navtask.nodeName=="TASK") break;
		}
		}
		if(navtask)
		{
		var navig=def(document.all['navig_'+navtask.getAttribute('id')],null);
		if(navig)  processNavigation("popup",navig.id);	
		}
		return false;break;
case "1":
		return true;break;
}
return false;
}

function processJump(child,attrs)
{
 if (def(attrs["link"],"")!="")  
		def(attrs['target'],"")!="" ? window.open( attrs["link"] , attrs['target'], def(attrs['features'],"")):window.location=attrs["link"];
}

function processIF(child,attrs)
{

var savetask=cur_task;
var value=recalcExpr(attrs['if']);
if (def(value,value,1))
{
var childs=child.childNodes;
for (var i=0;i<childs.length;i++)
	{
	if(savetask!=cur_task) return false; 
	switch (childs[i].nodeName)
	{
	case "ACTION":
		processAction(childs[i]);break;
	case "RESPONSE":break;
	default : xmlProcess(childs[i]);break;		
	}		
	}
}else
{
 var elsep=child.selectSingleNode("./ACTION/ELSE");
 if (elsep) 
{
var childs=elsep.childNodes;
for (var i=0;i<childs.length;i++)
	{
	if(savetask!=cur_task) return false; 
	processAction(childs[i]);	
	}
}
}

}

function processTimer(elem,attrs,id)
{
var timeobj=null;
if(def(id,null)) timeobj=actionTimers[id];
if(timeobj) {clearTimeout(actionTimers[id].timer);actionTimers[id]=null;timeobj.defer=false;};
else
{
timeobj=new Object;
timeobj.attrs=attrs;
timeobj.elem=elem;
timeobj.id=elem.parentNode.getAttribute('id');
timeobj.defer=def(attrs['defer'],"0")=="1" ? true:false;
}

var object=cur_task.selectSingleNode('.//ACTION[@id="'+timeobj.id+'" and @dis="1"]');
if (object) {actionTimers[timeobj.id]=null;return false;}

if (!timeobj.defer)
{
var childs=timeobj.elem.childNodes;
for (var i=0;i<childs.length;i++)
	processAction(childs[i]);
}

timeobj.timer=setTimeout("processTimer(null,null,'"+timeobj.id+"');",def(timeobj.attrs['mil'],1000,1));
actionTimers[timeobj.id]=timeobj;
}

function updateVariables(task)
{
if(!task) return false;
var i=0;
var e= new Enumerator(varobj);
var uptask=uproot.selectSingleNode('./TASK[@id="'+task.getAttribute("id")+'"]');
if (!uptask) 
{
	uptask=upxml_document.createElement("TASK");
	uptask.setAttribute("id",task.getAttribute("id"));
}
for (;!e.atEnd();e.moveNext())           //Enumerate drives collection.
      {
         	var x = e.item();		
		var v=uptask.selectSingleNode('./VARIABLE[@name="'+x.name+'"]');
		if (!v) var v=upxml_document.createElement("VARIABLE");		
		v.setAttribute("name",x.name);
		v.setAttribute("value",x.value);
		if (def(x.setting,null)) v.setAttribute("setting",x.setting);
		if (def(x.xml,null)) 
			v.appendChild(xmlContainer[x.value].documentElement);
		uptask.appendChild(v);
      }
uproot.appendChild(uptask);
varobj=new Array;

	var xmlcopy=document.all["_wt_result"].XMLDocument;
xmlcopy.loadXML(uproot.xml);
}

function updateXMLVariables(task)
{
varobj=new Array;
if(!task) return false;
var i=0;

var uptask=uproot.selectSingleNode('./TASK[@id="'+task.getAttribute("id")+'"]');
if (!uptask) return false;

childs=uptask.childNodes;

for (i=0;i<childs.length;i++)
      {
		var v=new Object;
		v.name=childs[i].getAttribute("name");
		v.value=childs[i].getAttribute("value");
		if (childs[i].getAttribute("xml")) 
		{
			v.xml=childs[i].getAttribute("xml");
			xmlContainer[v.xml]=new ActiveXObject("Msxml.DOMDocument");
			var root=childs[i].firstChild.cloneNode(true);
			xmlContainer[id].documentElement=root;
		}
		varobj[v.name]=v;
      }
}

function processPost(child,attrs)
{
updateVariables(cur_task);

globalerror=1;
if (def(attrs['local'],"0") && def(attrs['local'],"0")=="1")
{	
	try
	{
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	if (def(document.all["_filename_"],false))
	{
		var filename=document.all["_filename_"].value;
		var tso = fso.OpenTextFile( filename, 2, true );
		tso.write( UpXMLDocument.xml );
		tso.close();
		globalerror=0;
		alert("Данные успешно сохранены ");
	}
	else
	{		
		alert("Укажите имя файла ");		
	}	
	}
	catch(x)
	{
		alert("Данные не сохранены");
	}

	//UpXMLDocument.save("c:\temp\UploadXml.xml");
}
else
{
try
{
var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");

if(course_id!="")
	xmlhttp.open("POST","/abt_dhtml.nsf/courseposter", false);
else
	xmlhttp.open("POST","/abt_dhtml.nsf/poster", false);
var plus=/\+/g;
if (def(attrs['settings'],"0")=="1")
	var esc=escape(getSettings(uproot));
else	
	var esc=escape(uproot.xml);

//esc=uproot.xml;
xmlhttp.send(esc.replace(plus,"%2B"));

if (xmlhttp.status==200) 
	{
	globalerror=0;
	if(def(attrs['silence'],"0")=="1") i=0;
	else
	alert("Размещение на сервере успешно завершено");
	var req=new ActiveXObject("Msxml2.DOMDocument.3.0");
	req.async = false;
	req.loadXML(xmlhttp.responseText);
	if (req.parseError.errorCode!=0)
		{
		alert(req.parseError.reason + " " + req.parseError.srcText);
		return false;
		}
	req.setProperty("SelectionLanguage", "XPath");
	var slink=req.selectSingleNode(".//SOLUTION_LINK");
	if(slink) 	
	{
		var v=new Object;
		v.value=slink.text;
		v.name="post_href";
		varobj[v.name]=v;
	}		
	}
else
	alert("Ошибка размещения " + xmlhttp.statusText);

}
catch(x)
{
 alert("Ошибка размещения ");
}
}

}

function processAlarm(child,attrs)
{

var name=def(attrs['name'],null);
var toggle=def(attrs['switch'],"1");

if(!name) return false;

if(toggle=="1") 
{
var d=new Date();
var vs=new Object;
vs.name="start_"+name;
//vs.value=d.getDate()+"."+d.getMonth+"."+d.getFullYear+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
vs.value=d;

var ve=new Object;
ve.name="end_"+name;
ve.value=0;

var vd=new Object;
vd.name="defer_"+name;
vd.value=0;
varobj[vs.name]=vs;
varobj[ve.name]=ve;
varobj[vd.name]=vd;
}
else
{
var d=new Date();

var ve=new Object;
ve.name="end_"+name;
//ve.value=d.getDate()+"."+d.getMonth+"."+d.getFullYear+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
ve.value=d;

var vd=new Object;
vd.name="defer_"+name;
if(!def(varobj["start_"+name],null)) return false;
vd.value=ve.value-varobj["start_"+name].value;
varobj[ve.name]=ve;
varobj[vd.name]=vd;

}


}

function processSpecial(elem)
{
	var name=elem.variable;
	switch(elem.nodeName.toLowerCase())
	{
	case "a":
		var value=elem.id;	
		if(!def(varobj[name],null)) 
		{
			var v=new Object;
			v.value=value;
			v.name=name;
			varobj[name]=v;	
		}
		else varobj[name].value+=value;

		if (def(elem.visible,"")=="") elem.style.visibility="hidden";
		break;
	case "span":
		var value=elem.id;	
		if(!def(varobj[name],null)) 
		{
			var v=new Object;
			v.value=value;
			v.name=name;
			varobj[name]=v;	
		}
		else varobj[name].value+=value;

		if (def(elem.visible,"")=="hidden") elem.style.visibility="hidden";
		elem.outerHTML="<SPAN><STRIKE>"+elem.innerHTML+"</STRIKE></SPAN>";

		break;
	case "td":		
		var id=elem.id1;
		var value=id.substring(5,id.length);	
		if(!def(varobj[name],null)) 
		{
			var v=new Object;
			v.value=value;
			v.name=name;
			varobj[name]=v;	
		}
		else varobj[name].value+=value;
		if (def(elem.visible,"")=="hidden") elem.style.visibility="hidden";
		break;
	case "input":		
		var value=elem.id1;
		if(!def(varobj[name],null)) 
		{
			var v=new Object;
			v.value=value;
			v.name=name;
			varobj[name]=v;	
		}
		else varobj[name].value+=value;
		if (def(elem.visible,"")=="hidden") elem.style.visibility="hidden";
		elem.blur();
		break;
	}
}

function updateFieldsFromVariables(oDiv)
{

	var inps=oDiv.all.tags("input");
	var  selects=oDiv.all.tags("select");	
	var areas=oDiv.all.tags("textarea");
	var spans=oDiv.all.tags("span");

	var sinps=new Array;
	sinps[0]=inps;
	sinps[1]=selects;
	sinps[2]=areas;
	sinps[3]=spans;

	var i=0;
	var j=0;
	for (j=0;j<sinps.length;j++)
	{
	var inputs=sinps[j];
	for(i=0;i<inputs.length;i++)
	{
	if (def(inputs[i].variable,"")!="" )
	{
		if(def(varobj[inputs[i].variable],null))
			{
			switch(inputs[i].nodeName.toLowerCase())
			{
			case "input" :
			switch(inputs[i].type)
			{
			case "text":
				inputs[i].value= varobj[inputs[i].variable].value;break;
			case "radio":
				if(inputs[i].value==varobj[inputs[i].variable].value) inputs[i].checked=true;break;
			case "checkbox":
				if (def(inputs[i].id,"")=="") { var datas=new Array(inputs[i]);} 
					else {var datas=document.all[inputs[i].id];}
				var k=0;
				var value=varobj[inputs[i].variable].value;
				if(typeof(value)!="string") value=new String(value);
				var vdatas=value.split(":");
				if (vdatas.length!=datas.length) return false;
				for(k=0;k<datas.length;k++)
					if (datas[k]==inputs[i]) 
						if(inputs[i].value==vdatas[k]) inputs[i].checked=true;else inputs[i].checked=false;
				break;
			};break
			case "area":
				inputs[i].value= def(varobj[inputs[i].variable].value,"");break;
			case "span":
				inputs[i].innerHTML= def(varobj[inputs[i].variable].value,"");break;
			case "select":
				var ops=0;
				for (ops=0;ops<inputs[i].options.length;ops++)
				if(inputs[i].options[ops].value==def(varobj[inputs[i].variable].value,""))								{inputs[i].selectedIndex= ops;break;};
				break;
			}
			
			}
		else			
			{				
			var v=new Object;
			if((inputs[i].nodeName.toLowerCase()=="input" && (inputs[i].type.toLowerCase()=="text" || inputs[i].type.toLowerCase()=="hidden")) || inputs[i].nodeName.toLowerCase()=="area")
			{
				var value=recalcExpr(inputs[i].value);
				v.value=value;
			} 
			else 			
			v.value="";

			if (def(inputs[i].setting,null)) v.setting=inputs[i].setting;
			v.name=inputs[i].variable;
			varobj[inputs[i].variable]=v;
			}

			}
		
	}
	}
/*
	for(i=0;i<areas.length;i++)
	{
	if (def(areas[i].variable,"")!="" )
	{
		if(def(varobj[areas[i].variable],null))
			{
			areas[i].value= def(varobj[areas[i].variable].value,"");break;			
			}
		else
		{
			var v=new Object;
			var value=areas[i].value;
			v.value=value;
			areas[i].value=value;
			v.name=areas[i].variable;
			varobj[areas[i].variable]=v;
		}
	}	
	}

	for(i=0;i<spans.length;i++)
	{
	if (def(spans[i].variable,"")!="" )
	{
		if(def(varobj[spans[i].variable],null))
			{
			spans[i].innerHTML= def(varobj[spans[i].variable].value,"");
			}
	}
	}	
*/

}

 
function imgLoader()
{
var object=window.event.srcElement;
//if(object.readyState=="complete") {
//if(object.complete==true) {
	imagesRef-=1;
	object.onload = null;
	if(imagesRef<=0) 
		{
		imageLoading=false;
		document.body.all["_images_warning"].style.display="none";
		clearImagesProgress();
		return false;
		}
	if(object) object.mark=0;	
	var curProgress = Math.floor(100*(imagesOverall-imagesRef)/imagesOverall);
	document.all["_imagesRef"].innerHTML=curProgress;
	fillImagesProgress(curProgress);
//	document.all["_imagesLast"].innerHTML=object.src;
//	}
}

function fillImagesProgress(cp) {
	if(document.getElementById("ipro_left")!=null) {
		document.getElementById("ipro_left").style.width = cp*2+"px";
		document.getElementById("ipro_right").style.width = (201-cp*2)+"px";
		document.getElementById("iproimg_left").style.width = cp*2+"px";
		document.getElementById("iproimg_right").style.width = (201-cp*2)+"px";
	} else {
		if(document.getElementById("ipro1")!=null) {
			var pCount=Math.round(20*(imagesOverall-imagesRef)/imagesOverall);
			pCount=parseInt(pCount);
			for(var i=1;i<=pCount;i++) {
				curPcell=eval("document.getElementById('ipro"+i+"')");
				if(curPcell) {
					curPcell.style.backgroundColor="#33FF33";
				}
			}
		} else {
			return false;
		}
	}
	return true;
}

function clearImagesProgress() {
	if(document.getElementById("ipro_left")!=null) {
		document.getElementById("ipro_left").style.width = "1px";
		document.getElementById("ipro_right").style.width = "200px";
		document.getElementById("iproimg_left").style.width = "1px";
		document.getElementById("iproimg_right").style.width = "200px";
	} else {
		if(document.getElementById("ipro1")!=null) {
			for(var i=1;i<=20;i++) {
				curPcell=eval("document.getElementById('ipro"+i+"')");
				if(curPcell) {
					curPcell.style.backgroundColor="#666666";
				}
			}
		} else {
			return false;
		}
	}
	return true;
}

function soundLoader(object_id,state)
{
if(!object_id) return false;
var object=document.all[object_id];
if(!object) return false;
if(state==4) {
	soundRef-=1;
	object.processed=true;	
//	object.removeNode(true);
	var eventObject=document.all["event_" + object_id];	
	if(def(eventObject,null)) eventObject.removeNode(true);
	if(soundRef<=0)
		{
		soundLoading=false;
		document.body.all["_sound_warning"].style.display="none";
		clearSoundProgress();
		return false;
		}
	fillSoundProgress();
	document.all["_soundRef"].innerHTML=soundOverall-soundRef;
	}
}

function fillSoundProgress() {
	var cp=Math.round((soundOverall-soundRef)/soundOverall*20);
	if(document.getElementById("spro_left")!=null) {
		document.getElementById("spro_left").style.width = cp*2+"px";
		document.getElementById("spro_right").style.width = (201-cp*2)+"px";
		document.getElementById("sproimg_left").style.width = cp*2+"px";
		document.getElementById("sproimg_right").style.width = (201-cp*2)+"px";
	} else {
		if(document.getElementById("spro1")!=null) {
			for(var i=1;i<=cp;i++) {
				curPcell=eval("document.getElementById('spro"+i+"')");
				if(curPcell) {
					curPcell.style.backgroundColor="#33FF33";
				}
			}
		} else {
			return false;
		}
	}
	return true;
}

function clearSoundProgress() {
	if(document.getElementById("spro_left")!=null) {
		document.getElementById("spro_left").style.width = "1px";
		document.getElementById("spro_right").style.width = "200px";
		document.getElementById("sproimg_left").style.width = "1px";
		document.getElementById("sproimg_right").style.width = "200px";
	} else {
		if(document.getElementById("spro1")!=null) {
			for(var i=1;i<=20;i++) {
				curPcell=eval("document.getElementById('spro"+i+"')");
				if(curPcell) {
					curPcell.style.backgroundColor="#666666";
				}
			}
		} else {
			return false;
		}
	}
	return true;
}

function onErrorLoad()
{
	var object=window.event.srcElement;
	if(!object) return true;		
	imagesRef-=1;
	if(imagesRef<=0) 
		{
		imageLoading=false;
		document.body.all["_images_warning"].style.display="none";
		return false;
		}
	document.all["_imagesRef"].innerHTML=imagesOverall-imagesRef;
	return true;	
}

function taskLoadImages(itask)
{

 imagesOverall=0;
 imagesRef=0;
 iload=itask.getAttribute("image_loaded");
 if(def(iload,"0")=="1") return;

 var tags=itask.selectNodes(".//*[text()]");
 var i=0;
 var overimagesOverall=0;

 for (i=0;i<tags.length;i++) 
 {
	 var oDiv=document.createElement("DIV");
	 oDiv.style.display="inline";	
	oDiv.innerHTML=tags[i].text;
	var imgs=oDiv.all.tags("img");
	overimagesOverall+=imgs.length;
	for(var j=0;j<imgs.length;j++)
	{		
	 if (!def(imageContainer[imgs[j].uniqueID],null))
	 {
		if(imgs[j].readyState!="complete")
		{
		 imagesRef+=1;
		 imagesOverall+=1;	

		 imageContainer[imgs[j].uniqueID]=imgs[j];	 
		 imgs[j].onload=imgLoader;
		 imgs[j].onerror=onErrorLoad;

//		var img=new Image()
//		img.onLoad=imgLoader;
//		img.src=imgs[j].src;
//		imageContainer[imgs[j].uniqueID]=img;
		}
	 }
	}	
	
	var imgs=oDiv.all.tags("td");
	for(var j=0;j<imgs.length;j++)
	{		
	 if(def(imgs[j].background,"")!="")
		{
			 if (!def(imageContainer[imgs[j].uniqueID],null))
			 {
				if(imgs[j].readyState!="complete")
				{
				 imagesRef+=1;
				 imagesOverall+=1;
				 var oImg=document.createElement("IMG");
				 oImg=oDiv.appendChild(oImg);
				 oImg.src=imgs[j].background			
				 imageContainer[oImg.uniqueID]=oImg;
				 oImg.onload=imgLoader;
				 oImg.onerror=onErrorLoad;
				}
			 }			 
		}
	}	
 }

if(imagesOverall>0)
{
 imageLoading=true;
 itask.setAttribute("image_loaded","1"); 
 document.body.all["_images_warning"].style.display="inline";
 document.body.all["_images_warning"].style.zIndex=25;
 document.all["_imagesOverall"].innerHTML=imagesOverall;
 document.all["_imagesRef"].innerHTML=100*(imagesOverall-imagesRef)/imagesOverall;
}
}


function loadImages(elem)
{
 return false; 
 var tags=elem.selectNodes(".//*[text()]");
 var i=0;

 for (i=0;i<tags.length;i++) 
 {
	 var oDiv=document.createElement("DIV");
	 oDiv.style.display="inline";
	//oDiv.style.visibility="visible";
	oDiv.innerHTML=tags[i].text;
	//document.body.appendChild(oDiv);
	var imgs=oDiv.all.tags("img");
	for(var j=0;j<imgs.length;j++)
	{		
	 if (!def(imageContainer[imgs[j].uniqueID],null))
	 {
	 imagesRef+=1;
	 imagesOverall+=1;	
	 imageContainer[imgs[j].uniqueID]=imgs[j];	 
	 imgs[j].onload=imgLoader;
	 }
	}	

	var imgs=oDiv.all.tags("td");
	for(var j=0;j<imgs.length;j++)
	{		
	 if(def(imgs[j].background,"")!="")
		{
			 if (!def(imageContainer[imgs[j].uniqueID],null))
			 {
			 imagesRef+=1;
			 imagesOverall+=1;
			 var img=new Image;
			 img.src=imgs[j].background;
		  	 imageContainer[imgs[j].uniqueID]=img;
			 img.onload=imgLoader;
			 }			 
		}
	}	
 }

/*
imagesOverall=0;
imagesRef=0;
var e= new Enumerator(imageContainer) 
for (;!e.atEnd();e.moveNext())           
    {
        	var x = e.item();
		imagesOverall+=1;
		 imagesRef+=1;		
	}
*/
document.all["_imagesOverall"].innerHTML=imagesOverall;

//imagesRef=0;
/*
var e= new Enumerator(imageContainer) 
for (;!e.atEnd();e.moveNext())           
    {
        	var x = e.item();		
		imagesRef+=1;	
		var img=new Image;
		img.src=x.src;
		document.all["_imagesRef"].innerHTML=imagesOverall-imagesRef;
	}
*/
}

function waitForLoaded()
{

var found=false;
/*
var e= new Enumerator(imageContainer) 
if (imagesRef>0)	
	{
	document.all["_imagesRef"].innerHTML=imagesOverall-imagesRef;
	found=true;
	}
else 
	found=false;
*/
/*
for (;!e.atEnd();e.moveNext())           //Enumerate drives collection.
      {
        	var x = e.item();
		if (x)
		{
		if(x.readyState=="complete")
		{
			imagesRef-=1;
			imageContainer[x.src]=null;
			if(imagesRef>0) 
				{			
				document.all["_imagesRef"].innerHTML=imagesOverall-imagesRef;
				found=false;
				}
			else	found=true;
		}
		else	
		{	
		found=true;
		break;
		}
		}			
     };
//else	found=false;
*/
if (!found || skipImages)  {
	var sr=window.location.search;
	var vars=sr.split("&");
	var flag=false;
	var authentic=false;
	var vname="";
	var vvalue="";
	for(var i=0;i<vars.length;i++) {
 		if (vars[i].indexOf("?")==0) vars[i]=vars[i].substring(1,vars[i].length);
 		var vnames=vars[i].split("=");
//20031030
 		if (vnames.length==2) {
  			vname=vnames[0];
  			vvalue=vnames[1];
  			vname=vname.toLowerCase(); 
  			if (vname=="check_person" && vvalue=="1" ) flag=true;	
  			if (vname=="windowWidth" ) windowWidth=parseInt(vvalue);
  			if (vname=="windowHeight" ) windowHeight=parseInt(vvalue);
  			if (vname=="authentic" && vvalue=="1") authentic=true;
  			if (vname=="doc_id") appunid=vvalue;
  			if (vname=="course_id") course_id=vvalue;
  			if (vname=="aicc_sid") aicc_sid=vvalue;
  			if (vname=="aicc_url") aicc_url=unescape(vvalue);
 		}
	}
	document.body.all["_images_warning"].style.display="none";
	if(flag) {
		document.all["_identity_"].style.display="inline";
	} else {
		if (authentic) {
			document.all["_authentic_"].style.display="inline";
		} else {
			getWebSettings(null,null,true);
//			alert('stop1');
			if(document.getElementById('preDiv').style.display=='inline') {
//				alert('stop1-1');
				waitForUser();
//				alert('stop1-2');
			} else {
//				alert('stop1-3');
				startSlides(true); 		
			}
		}
	}
}
else {
//	alert('stop1-4')
	setTimeout("waitForLoaded();",1000);
}
}

function taskLoadSound(itask)
{

 soundOverall=0;
 soundRef=0;
 iload=itask.getAttribute("sound_loaded");
 if(def(iload,"0")=="1") return;
 soundContainer=new Array();

 var tags=itask.selectNodes(".//*[@sound='1']");
 var i=0;

 for (i=0;i<tags.length;i++) 
 {	
	 if (!def(soundContainer[tags[i].uniqueID],null))
	 {
	 soundRef+=1;
	 soundOverall+=1;	

	var findobject=document.all['FPLayer'+(soundRef+1)];
	if (def(findobject,null)) findobject.removeNode(true);
 
	 var cloneStr='<OBJECT ID="FPLayer'+(soundRef+1)+'" name="FPlayer'+(soundRef+1)+'" CLASSID="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'; 
        cloneStr+=' CODEBASE="http://active.macromedia.com/flash5/cabs/swflash.cab#version=5,0,0,0"';
        cloneStr+='width=0 height=0 align=center>';
        cloneStr+='<param NAME="Movie" VALUE="">';
        cloneStr+='<param NAME="Play" VALUE="false">';
        cloneStr+='<param NAME="Loop" VALUE="false">';
        cloneStr+='<param NAME="Quality" VALUE="High">';
        cloneStr+='<param NAME="Scale" VALUE="ShowAll">';
        cloneStr+='<param NAME="SAlign" VALUE="TR">';
        cloneStr+='<param NAME="BGColor" VALUE="ffffff">';
	 cloneStr+='</OBJECT>';
	 var CloneMPlayer=document.createElement(cloneStr);	
	 
	 /*
	 var CloneMPlayer=document.all['FPlayer1'].cloneNode(true);
 	 CloneMPlayer.id="FPLayer" + (soundRef+1);
	 CloneMPlayer.name="FPLayer" + (soundRef+1);
	*/
	
  
	 var eventMedia=document.createElement('<SCRIPT FOR="'+CloneMPlayer.id+'" EVENT="OnReadyStateChange(lReadyState)" LANGUAGE="JScript">');	 
	 eventMedia.id="event_" + CloneMPlayer.id
	 eventMedia.text='soundLoader("'+CloneMPlayer.id+'",lReadyState);';
	 if(def(document.all[CloneMPlayer.id],false)) document.all[CloneMPlayer.id].removeNode(true);
	 if(def(document.all[eventMedia.id],false)) document.all[eventMedia.id].removeNode(true);		

	 var progressMedia=document.createElement('<SCRIPT FOR="'+CloneMPlayer.id+'" EVENT="OnProgress(lPercent)" LANGUAGE="JScript">');
	 progressMedia.id="progress_" + CloneMPlayer.id
	 progressMedia.text='progressLoader("'+CloneMPlayer.id+'",lPercent);';
	 if(def(document.all[progressMedia.id],false)) document.all[progressMedia.id].removeNode(true);
	
	 document.all['swfplayer'].appendChild(CloneMPlayer);
	 document.all['head'].appendChild(eventMedia);
	 CloneMPlayer=document.all[CloneMPlayer.id];	
	 var sfilename=def(tags[i].getAttribute("soundsrc"),"");	 
 	 CloneMPlayer.sfilename=sfilename;
	 CloneMPlayer.onreadystatechange=soundLoader;
	 CloneMPlayer.processed=false;
	 soundContainer[sfilename]=CloneMPlayer; 	
	 }
 }
 itask.setAttribute("sound_loaded","1"); 
 if (soundRef==0) return;

 soundTimer=setTimeout("checkInitSoundObjects()",PROGRAM_TICK*10);
 
 soundLoading=true;
 document.body.all["_sound_warning"].style.display="inline";
 document.body.all["_sound_warning"].style.zIndex=25;
 document.all["_soundOverall"].innerHTML=soundOverall;
 document.all["_soundRef"].innerHTML=soundOverall-soundRef;
}

function checkInitSoundObjects()
{
	var roll=false;
	var rollEvent=false;

	var e= new Enumerator(soundContainer) 
	for (;!e.atEnd();e.moveNext())           
	{
		         	var x = e.item();
	 			if (x) 
				{
					if(!x.processed)
					try
					{
					if(!x.object) roll=true;
					}
					catch(z)
					{
						roll=true;
					}
				}				
	}		  

	if (roll) 
	{
		 soundTimer=setTimeout("checkInitSoundObjects()",PROGRAM_TICK*10);
	}
	else
	{
	
	e= new Enumerator(soundContainer) 
	for (;!e.atEnd();e.moveNext())           
	{
		         	var x = e.item();
				if(!x.processed)
				try
				{
	 			if (x.object.ReadyState==0) 
				{
					x.object.Movie=x.sfilename;
					x.object.Playing=false;
					x.object.Loop=false;
					//x.object.Stop();
				}								
				if(x.object.ReadyState==4)
				{
					soundLoader(x.id,x.object.ReadyState);
					x.processed=true;					
				}
				else
					rollEvent=true;
				}
				catch(z)
				{
					rollEvent=true;
				}
				
	}		  		 

	}

	if(rollEvent)  soundTimer=setTimeout("checkInitSoundObjects()",PROGRAM_TICK*10);

}

function progressLoader(object_id,lPercent)
{
 
 window.status=object_id+" "+lPercent;

}


function unloadfunc()
{
 var post=root.selectSingleNode(".//POST[@unload='1']");
 if (post && def(post.getAttribute('confirm'),"0")=="1") 
	{if(confirm("Сохранить данные на сервере?"))  processAction(post.parentNode);}; else if(post) processAction(post.parentNode);
}

function cancelKeys()
{

switch (event.keyCode)
{
case  8 :	
	if(event.srcElement.nodeName.toLowerCase()=="input" && event.srcElement.type.toLowerCase()=="text") 
		event.returnValue=true;
		else event.returnValue=false;
	break;
case 116:event.keyCode=0;event.returnValue=false;break;
case 115:event.cancelBubble=true;event.keyCode=0;event.returnValue=false;break;
case 37: if (event.altKey || event.altLeft) {event.cancelBubble=true;event.keyCode=0;event.returnValue=false;}break;
case 39: if (event.altKey || event.altLeft) {event.cancelBubble=true;event.keyCode=0;event.returnValue=false;}break;
}
}

function checkIndentity()
{

	if (document.all['_wt_firstname'].value=="") {alert('Укажите Ваше имя');return false;}
	if (document.all['_wt_lastname'].value=="") {alert('Укажите Вашу фамилию');return false;}
	if (document.all['_wt_middlename'].value=="") {alert('Укажите Ваше отчество');return false;}
	startSlides(true);
}

function checkLogin()
{
	var login=document.all['_wt_login'].value;
	var password=document.all['_wt_password'].value;
	if (login=="") {alert('Укажите Ваш логин');return false;}
	
	getWebSettings(login,password,false);		
	startSlides(true);
}

function processJavascript(child,attrs)
{
	pid=def(attrs['pid'],null);
	if(!pid) return false;
	var data = root.selectSingleNode('.//FUNCTION[@id="' + pid + '"]/DATA');
	if (!data) return false;
	var e= new Enumerator(attrs) 
	for (;!e.atEnd();e.moveNext())           //Enumerate drives collection.
	{
	   	var x = e.item();
		
	}		
	var func=data.text;
	var pos=func.indexOf("{");
	var lastpos=func.lastIndexOf("}");
	if (pos==-1 || lastpos==-1) return false;

	var body=func.substring(pos+1,lastpos);
	/*
	var header=func.substring(0,pos);
	var hpos=header.indexOf("(");
	var hlastpos=header.indexOf(")");
	if(hpos==-1 || hlastpos==-1) return false;
	var sargs=header.substring(hpos,hlastpos);
	args=sargs.split(",");
	*/

	var argobj=new Object;
	argobj.attrs=attrs;
	argobj.task=cur_task;
	argobj.object=child;

	try
	{
	var funcobj=new Function("argobj",body);
	funcobj(argobj);
	}
	catch(x)
	{
	 alert(x.description);	 
	}	
}

function processIsland(child,attrs)
{
	id=def(attrs['id'],null);
	if(!id) return false;	
	if (def(xmlContainer[id],null)) return true;
	var encoding=def(attrs['encoding'],"windows-1251");	
	var data=child.selectSingleNode("DATA")	
	var xml=data ? unescape(data.text):"";
	xmlContainer[id]=new ActiveXObject("Msxml2.DOMDocument.3.0");
	xmlContainer[id].async = false;
	xml='<?xml version="1.0" encoding="'+encoding+'"?>'+xml;
	xmlContainer[id].loadXML(xml);	
	//xmlContainer[id].load('/abt_dhtml.nsf/Display?OpenAgent&pagename=quiz.xml');	
	if (xmlContainer[id].parseError.errorCode!=0)
		alert(xmlContainer[id].parseError.reason + " " + xmlContainer[id].parseError.srcText);
	xmlContainer[id].setProperty("SelectionLanguage", "XPath");
	return true;
}

function processXSL(child,attrs)
{
	id=def(attrs['xid'],null);
	nid=def(attrs['id'],null);
	if(!id || !nid) return false;	
	var xmlitem=def(xmlContainer[id],null);
	if (!xmlitem) return true;
	if (!def(xmlContainer[nid],null)) 
	{
		var encoding=def(attrs['encoding'],"windows-1251");
		var data=child.selectSingleNode("DATA");
		var xsl=data ? unescape(data.text):"";
		var xslContainer=new ActiveXObject("Msxml2.DOMDocument.3.0");
		xslContainer.async = false;
		xsl='<?xml version="1.0" encoding="'+encoding+'"?>'+xsl;		
		xslContainer.loadXML(xsl);	
		if (xslContainer.parseError.errorCode!=0)
		{
		alert(xslContainer.parseError.reason + " " + xslContainer.parseError.srcText);
		return false;
		}		
		xmlContainer[nid]=xslContainer;
		xmlContainer[nid].setProperty("SelectionLanguage", "XPath");
		xmlContainer[nid].setProperty("SelectionNamespaces", 'xmlns:xsl="http://www.w3.org/1999/XSL/Transform"');
	}	
	if (def(attrs['transform'],"1")=="1")
	{
	var spec=new Object;	
	spec.objtype="text";
	spec.text=xmlitem.transformNode(xmlContainer[nid]);	
	//spec.text=unescape(spec.text);
	processObject(child,attrs,spec);
	}
	return true;
}

function processTransformXSL(child,attrs)
{
	id=def(attrs['xid'],null);
	nid=def(attrs['nid'],null);
	if(!id || !nid) return false;	
	var xmlitem=def(xmlContainer[id],null);
	if (!xmlitem || !def(xmlContainer[nid],null) ) return true;

	var spec=new Object;	
	spec.objtype="text";
	spec.text=xmlitem.transformNode(xmlContainer[nid]);
	//spec.text=unescape(spec.text);
	processObject(child,attrs,spec);
	return true;
}

function processMedia(child,attrs)
{
/*
 id=def(attrs['id'],null);
 if(!id) return false;

 var objheader='<OBJECT id="'+attrs['id']+'" classid="'+attrs['classid']+'" name="'+attrs['id']+'" type=application/x-oleobject ><PARAM NAME="Filename" VALUE="/abt_dhtml.nsf/Resources/wav/$File/Recycle.WAV">Объект не найден</OBJECT>';

 var obj=document.createElement(objheader);
*/ 
}


function MediaPlay(child,attrs)
{
if(!MPlayer1 && FPlayer1==null) return false;
var id=def(attrs['pid'],null);
if(!id) return false;
var target=root.selectSingleNode('.//*[@id="'+id+'"]');
if(!target) return false;
var filename=target.getAttribute('src');
var playing=def(attrs['play'],0);
if(!filename) return false;
if (MPlayer1)
{
MPlayer1.SendPlayStateChangeEvents=false;
switch(playing) {
	case "1": 
		//MPlayer1.Stop();	
		MPlayer1.FileName=filename;
		MPlayer1.Play();break;
	case "0" : MPlayer1.Stop();break
	case "2":  MPlayer1.Pause();break;
}
MPlayer1.SendPlayStateChangeEvents=true; 
}

if (FPlayer1!=null)
{
switch(playing) {
	case "1": 
		if(FPlayer1.object!=null) {
			try {
				FPlayer1.object.Stop();	
				FPlayer1.object.Movie=filename;
				FPlayer1.object.Play();
			} catch(x) {}
		} else {
			try {
				FPlayer1.Stop();	
				FPlayer1.Movie=filename;
				FPlayer1.Play();
			} catch(x) {}
		}
		break;
	case "0" : 
		if(FPlayer1.object!=null) {
			try {
				FPlayer1.object.Stop();
			} catch(x) {}
		} else {
			try {
				FPlayer1.Stop();
			} catch(x) {}
		}
		break;
	case "2":  
		if(FPlayer1.object!=null) {
			try {
				FPlayer1.object.Playing = false;
			} catch(x) {}
		} else {
			try {
				FPlayer1.Playing = false;
			} catch(x) {}
		}
		break;
}
}

}


function SearchText(search)
{
	if(search=="") return false;
	var cur_id=cur_task.getAttribute("id");
	var cur_pos=root.selectNodes('./TASK[@id="'+cur_id+'"]/preceding-sibling::*');
	var dc=root.selectSingleNode('./TASK[contains(translate(descendant-or-self::*,"ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЭЮЯ","abcdefghijklmnopqrstuvwxyzабвгдежзийклмнопрстуфхцчшщъыьэюя"),"'+search.toLowerCase()+'") and position()>'+(cur_pos.length+1)+']');
	if(!dc) 
	{
	var dc=root.selectSingleNode('./TASK[contains(translate(descendant-or-self::*,"ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЭЮЯ","abcdefghijklmnopqrstuvwxyzабвгдежзийклмнопрстуфхцчшщъыьэюя"),"'+search.toLowerCase()+'")]');
	if(!dc) return false;
	if (dc==cur_task) return false;
	}

	processNavigation(-1,dc.getAttribute("id"));
	return false;
}

function historyJump(argobj)
{
	var id=def(historyArray[historyArray.length-2],null);
	if(!id) return false;	
	historyArray.length=historyArray.length-1;
	far_jumping=true;
	processNavigation(-1,id);
	far_jumping=false;
}

function formatNumber(pnumber,decimals)
{ 
  if (isNaN(pnumber)) { return 0}; 
  if (pnumber=='') { return 0}; 
  
  var IsNegative=(parseInt(pnumber)<0);
  if(IsNegative)pnumber=-pnumber;

  var snum = new String(pnumber); 
  var sec = snum.split('.'); 
  var whole = parseInt(sec[0]); 
  var result = ''; 
  if(sec.length > 1){ 
    var dec = new String(sec[1]); 
    dec = parseInt(dec)/Math.pow(10,parseInt(dec.length-decimals-1));
	Math.round(dec);
	dec = parseInt(dec)/10;
	if(IsNegative)
	{
	  var x = 0-dec;
      x = Math.round(x);
	  dec = - x;
	}
	else
	{
      dec = Math.round(dec);
	}
    dec = String(whole) + "." + String(dec); 
    var dot = dec.indexOf('.'); 
    if(dot == -1){ 
      dec += '.'; 
      dot = dec.indexOf('.'); 
    }
	var l=parseInt(dot)+parseInt(decimals);
    while(dec.length <= l) { dec += '0'; } 
    result = dec; 
  } else{ 
    var dot; 
    var dec = new String(whole); 
    dec += '.'; 
    dot = dec.indexOf('.'); 
	var l=parseInt(dot)+parseInt(decimals);
    while(dec.length <= l) { dec += '0'; } 
    result = dec; 
  } 
  if(IsNegative)result="-"+result;
  return result; 
}

function recalcFormulas(decsigns)
{
	if (!cur_task) return false;
	var formulas=cur_task.selectNodes("./FORMULA")
	if (!formulas.length) return false;
	var i=0;
		var savetask=cur_task;
	for(i=0;i<formulas.length;i++)
	{
		var expr=formulas[i].getAttribute("expression");
		if (!decsigns) {
			var value=recalcExpr(expr,"");
		} else {
			var value=formatNumber(recalcExpr(expr,""),decsigns);			
		}
		var varname=formulas[i].getAttribute("variable");
		if(varname)
		{
		if (value!="")
		{
			var nvalue=new Number(value);
			value=isNaN(nvalue) ? value:nvalue;
		}
		var v=new Object;
		v.value=value;
		v.name=varname;
		if(formulas[i].getAttribute("global")) globalVarobj[varname]=v; else varobj[varname]=v;
		}
		var condition=formulas[i].getAttribute("condition");
		if (condition)
		{
		var value1=recalcExpr(condition,"");
		if (value1) 
		{
			var childs=formulas[i].childNodes;
			for (var j=0;j<childs.length;j++)
			{
				if(savetask!=cur_task) return false; 
				switch (childs[j].nodeName)
				{
					case "ACTION":
					processAction(childs[j]);break;
					case "RESPONSE":break;
					default : xmlProcess(childs[j]);break;		
				}		
			}
		}else
		{
			 var elsep=formulas[i].selectSingleNode("./ACTION/ELSE");
			 if (elsep) 
			{
				var childs=elsep.childNodes;
				for (var j=0;j<childs.length;j++)
				{
				if(savetask!=cur_task) return false; 
				processAction(childs[j]);	
				}			
			}	
		}
		}
	}	
	
	updateFieldsFromVariables(document.body);		
}


function processSUBTASK(child,attrs)
{
  pushArray(taskContainer,cur_task);
  cur_task=child;
  sendMessage(CUR_TASK);
}

function pushArray(arr,elem)
{
 arr.length+=1;
 arr[arr.length-1]=elem;
}

function popArray(arr)
{
 if (!arr.length) return null;
 var elem=arr[arr.length-1];
 arr.length-=1;
 return elem;
}

function round(number, X) {
  X = (!X ? 2 : X);
  return Math.round(number * Math.pow(10, X)) / Math.pow(10, X);
}

function getSettings(xobj)
{
	var i=0;
	var j=0;
	var set=xobj.selectNodes(".//TASK[VARIABLE]");
	var sobj=UpXMLDocument.createElement("SETTINGS");
	sobj.setAttribute("iframe",course_id);
	for(i=0;i<set.length;i++)
	{
		var stask=set[i].cloneNode(false);
		var setvars=set[i].selectNodes(".//VARIABLE");
		for(j=0;j<setvars.length;j++)
		{
			var svar=setvars[j].cloneNode(true);
			stask.appendChild(svar);
		}
		stask=sobj.appendChild(stask);	
	}

	var e= new Enumerator(globalVarobj);
	for (;!e.atEnd();e.moveNext())
      {
         	var x = e.item();		
		var v=UpXMLDocument.createElement("GLOBAL_VARIABLE");
		v.setAttribute("name",x.name);
		v.setAttribute("value",x.value);		
		sobj.appendChild(v);
      }

	var slogin=UpXMLDocument.createElement("LOGIN")
	slogin.text=document.all['_wt_login'].value;
	sobj.appendChild(slogin);
	var sappunid=UpXMLDocument.createElement("APPLICATION");
	var curunid=UpXMLDocument.createElement("CURRENT_TASK");
	curunid.text=cur_task.getAttribute("id");	
	sobj.appendChild(sappunid);
	sobj.appendChild(curunid);
	return sobj.xml;	
}

function updateSettings(xobj)
{
	var i=0;
	var j=0;
	var set=xobj.selectNodes(".//TASK[VARIABLE]");
	var sobj=uproot;	
	for(i=0;i<set.length;i++)
	{
		var stask=set[i].cloneNode(false);
		var setvars=set[i].selectNodes(".//VARIABLE");
		for(j=0;j<setvars.length;j++)
		{
			var svar=setvars[j].cloneNode(true);
			stask.appendChild(svar);
		}
		stask=sobj.appendChild(stask);
	}

	var set=xobj.selectNodes(".//GLOBAL_VARIABLE");
	for (i=0;i<set.length;i++)
      {
         	var v=new Object;
		v.name=set[i].getAttribute("name");
		v.value=set[i].getAttribute("value");
		globalVarobj[v.name]=v
      }
	var start=xobj.selectSingleNode("./SETTINGS/CURRENT_TASK");
	if(start) startid=start.text;
}

function getWebSettings(login,password,free)
{
	if(appunid!="" && course_id!="")
	try
	{
		var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		if (free) 
		xmlhttp.open("GET","/abt_dhtml.nsf/Display?OpenAgent&pagename=settings.xml&doc_id="+appunid+"&course_id="+ course_id,false);
		else
		xmlhttp.open("GET","/abt_dhtml.nsf/Display?OpenAgent&pagename=settings.xml&doc_id="+appunid+"&course_id="+ course_id +"&xlogin=" + login + "&xpassword="+password,false);
		xmlhttp.send();
		
		if (xmlhttp.status==200) 
		{
			xsetting=new ActiveXObject("Msxml2.DOMDocument.3.0");
			xsetting.async = false;
			xsetting.loadXML(xmlhttp.responseText);
			if (xsetting.parseError.errorCode!=0)
			{
			alert(xsetting.parseError.reason + " " + xsetting.parseError.srcText);
			}
			xsetting.setProperty("SelectionLanguage", "XPath");
			updateSettings(xsetting);
		}
		else
			{
			alert("Ошибка получения персональных настроек ");
			}
	}
	catch(x)
	{
			alert("Ошибка получения персональных настроек ");
	}
}
function subnextTask()
{		
	if(cur_task.nodeName=="SUBTASK") 
		{
			var child=cur_task.nextSibling;			
		};
		else	var child=cur_task.firstChild;
	while(child && child.nodeName!="SUBTASK") child=child.nextSibling;
	return child;	
}
function subprevTask()
{		
	if(cur_task.nodeName=="SUBTASK") 
		{
			var child=cur_task.previousSibling;			
			while(child && child.nodeName!="SUBTASK") child=child.previousSibling;
			if(!child) {cur_object=cur_task.parentNode.childNodes[0];return cur_object;}
		};
		else	
		{
			var child=cur_object.previousSibling;
			while(child && child.nodeName!="SUBTASK") child=child.previousSibling;			
			if(!child) 
			{				
				var prevtask=cur_task.previousSibling;
				if(!prevtask) return null;
				child=prevtask.lastChild;
				//if (child.nodeName=="SUBTASK") return child;
				while(child && child.nodeName!="SUBTASK") child=child.previousSibling;				
				//return child
			}
			if(child && child.nodeName=="SUBTASK") pushArray(taskContainer,child.parentNode);
		}
		
	return child;
}

var dragapproved=false;
var dragobject,dragx,dragy,tempdragx,tempdragy;
function dmove(){
if (event.button==1&&dragapproved){
dragobject.style.pixelLeft=tempdragx+event.clientX-dragx;
dragobject.style.pixelTop=tempdragy+event.clientY-dragy;
return false;
}
}
function drags(oDiv){
if (def(oDiv.draggable,"0")=="1" /*&& !event.srcElement.locked*/){
var iodiv=oDiv.cloneNode(true);
iodiv.id="_image"+iodiv.id;
var parentdoc=def(document.all.BODY,document.body);
if(!parentdoc.contains(iodiv)) {parentdoc.appendChild(iodiv);} 
iodiv.style.filter="progid:DXImageTransform.Microsoft.Engrave()";
dragapproved=true;
dragobject=iodiv;
tempdragx=dragobject.style.pixelLeft;
tempdragy=dragobject.style.pixelTop;
dragx=event.clientX;
dragy=event.clientY;
iodiv.onmousemove=dmove;
iodiv.onmouseup=dragUp;
window.event.cancelBubble=true;
window.event.returnValue=false;
dragobject.ref=oDiv;
iodiv.setCapture(true);
}
}

function dragUp()
{
 dragapproved=false;
 dragobject.releaseCapture();
 var xobject=cur_task.selectSingleNode(".//*[@id='"+dragobject.ref.id+"']")
 if(!xobject) 
 {
    dragobject.removeNode(true); 
    dragobject=null;
    return true;
 }

 var ondrop=xobject.getAttribute("ondrop");
 if(!ondrop) 
 {
   dragobject.removeNode(true); 
   dragobject=null;
   return true;
 }

 processEvent(ondrop);

 dragobject.removeNode(true); 
 dragobject=null;
 return true;

/*
 var targetObject; 

 var hit=checkBounds(window.event.x,window.event.y,targetObject);
 alert(hit);
 processEvent(targetObject.getAttrubute(",
*/ 
 
}

function processIFCheckHit(child,attrs)
{

var savetask=cur_task;
var value=checkBounds(window.event.x,window.event.y,attrs['pid']);
if (def(value,value,0))
{
var childs=child.childNodes;
for (var i=0;i<childs.length;i++)
	{
	if(savetask!=cur_task) return false; 
	switch (childs[i].nodeName)
	{
	case "ACTION":
		processAction(childs[i]);break;
	case "RESPONSE":break;
	default : xmlProcess(childs[i]);break;		
	}		
	}
}else
{
 var elsep=child.selectSingleNode("./ACTION/ELSE");
 if (elsep) 
{
var childs=elsep.childNodes;
for (var i=0;i<childs.length;i++)
	{
	if(savetask!=cur_task) return false; 
	processAction(childs[i]);
	}
}
}

}



function checkBounds(iLeft, iTop,pid) 
{
        var hit = false;
	var xoffset=0;
	var yoffset=0;
	//var xdrops=cur_task.selectNodes(".//*[@droppable=1]");
	var xdrop=cur_task.selectSingleNode(".//*[@id='"+pid+"']");

        //for (var intLoop=0; intLoop<xdrops.length; intLoop++) {

            //var el = def(document.all[xdrops[intLoop].getAttribute("id")],null);
	    var el = def(document.all[xdrop.getAttribute("id")],null);
	    var xrect=getRect(xdrop.getAttribute("id"),"0");

            if (null!=el) {   
		xoffset=10;
		yoffset=10;
		
//              if ((iTop+dragobject.offsetHeight - yoffset > el.style.pixelTop) && (iLeft > el.style.pixelLeft) && (iLeft+xoffset < el.offsetWidth+el.style.pixelLeft) && (iTop+yoffset < el.offsetHeight+el.style.pixelTop)) 
		if ((iTop>=xrect.shifty) && (iTop<=xrect.shifty+xrect.shifth) && (iLeft>=xrect.shiftx) && (iLeft<=xrect.shiftx+xrect.shiftw))
		{

                  dragobject.overTarget = el;
		  //=xdrops[intLoop];
                  var hit=true;
		  return hit;
                }            

            }

        //  }  
      
        return hit;
}

function processDrop(child,attrs)
{
 	var pid=def(attrs['pid'],null);
	var idtarget=def(attrs['target'],null);
	var dsrc=document.all[pid];

	if(!pid || !dsrc) return false;	

	var xposition=def(attrs['position'],"0");	
	var position;
	if(xposition=='center') position="0";else position=xposition;

	if(idtarget) 
	{
		var xrect=getRect(idtarget,position);
		if(!xrect) return false;	
	}
	else
	{       		
		if(!def(dragobject,null)) return false;
		var xrect=getRect(dragobject.id,"0");		
		position="0";
	}

        var incorporate=def(attrs['incorporate'],"0");
	
	var shiftx=parseInt(def(attrs['shiftx'],0));
	var shifty=parseInt(def(attrs['shifty'],0));

	var duplicate=def(attrs['duplicate'],"0");
	if(duplicate=="1") 
	{
	var dcount=def(dsrc.dcount,0);
	dcount++;
	dsrc.dcount=dcount;
	var dsrc=dsrc.cloneNode(true);	
	dsrc.id="_duplicate_"+dsrc.id+"_"+dsrc.dcount;
	
	var parentdoc=def(document.all.BODY,document.body);
	if(!parentdoc.contains(dsrc)) {parentdoc.appendChild(dsrc);} 
		 
	}
	/*

	if(incorporate=="1")
	{
	 if (!def(document.all[id],null))
		{
		var rect=null;
		if (def(attrs["pid"],null)) 	rect=getRect(def(attrs["pid"],null),attrs["position"]);
		 if(rect && rect.link)
		{			
			var parlink=rect.link.parentElement;
			if (parlink.nodeName=="P" && parlink.parentElement.nodeName=="DIV")  
			{
				var removedlink=parlink.removeNode(false);
								
			}
	   	 	rect.link.insertAdjacentHTML('beforebegin',oDiv.outerHTML);
			var oDiv=document.all[id];
			oDiv.incorporate="1";
			existflag=false;
		}
		}
	}	
	}	
	*/	

	if(xposition=='center')
	{
		dsrc.style.posLeft=xrect.cshiftx+shiftx;
		dsrc.style.posTop=xrect.cshifty+shifty;
	}
	else
	{
		dsrc.style.posLeft=xrect.shiftx+shiftx;
		dsrc.style.posTop=xrect.shifty+shifty;
	}
                		

	return true;			
}


function processCustomEvent(objectid,etype)
{

 if(!cur_task) return false;
 
 var j=0;
 var k=0;
 var max=0;
 var fired=false;
 var attrs;

/*
 if(def(container,null)) 
 {
	var res_task=root.selectSingleNode(".//TASK[descendant-or-self::*[@id='"+container+"']]")
	if (!res_task) res_task=cur_task;
 } 
 else {
	var res_task=cur_task;
 }
*/
 
 var xobject=root.selectSingleNode(".//*[@id='"+objectid+"']");
 if(!xobject) return false;

 var responses=xobject.selectNodes('./RESPONSE[(not(@dis) or @dis!="1") and @type="'+etype+'"]');
 
 for(j=0;j<responses.length;j++) 
 {
	var z=Number(def(responses[j].getAttribute("z-index"),0));
	if(max<z) max=z;
 }

 for(j=0;j<responses.length;j++)	
 {
		var curz=Number(def(responses[j].getAttribute("z-index"),0));	
		if (curz>=max) 
		{
			fired=true;
			processResponse(responses[j]);
		}
 }
 
 return true;  

}

