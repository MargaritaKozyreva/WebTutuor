// CourseLab Loader Module
var loaderVersion = "2.2.0";
var loaderBuildDate = "2005-Jun-20";
//(c)2002-2005 Websoft Ltd. http://www.courselab.ru/

var loader = new Object;
loader.loadVars = loadVars;
loader.init = firstCheck;
loader.xmlhttp = secondCheck;
loader.plugs = lastCheck;
loader.check = checkReady;

var readyToLoad = false;
var system = new Object;
system.activex = new Object; system.activex.installed = false;
system.xmlbase = new Object; system.xmlbase.installed = false;
system.xmlhttp = new Object; system.xmlhttp.installed = false;
system.serverxmlhttp = new Object; system.serverxmlhttp.installed = false;
system.flash = new Object; system.flash.installed = false; system.flash.version = 0;
system.shockwave = new Object; system.shockwave.installed = false; system.shockwave.version = 0;
system.realplayer = new Object; system.realplayer.installed = false; system.realplayer.version = 0;
system.quicktime = new Object; system.quicktime.installed = false; system.quicktime.version = 0;
system.mediaplayer = new Object; system.mediaplayer.installed = false; system.mediaplayer.version = 0;
system.java = new Object; system.java.installed = false; system.java.version = 0;
system.pdf = new Object; system.pdf.installed = false; system.pdf.version = 0;
system.svg = new Object; system.svg.installed = false; system.svg.version = 0;
var MSDetect = false;
var varsReady = false;
var mvars = new Object;
mvars.aicc = false; mvars.aiccMethod = "normal"; mvars.aiccTimer = 30000; mvars.aiccControl = "easy";
mvars.scorm = false;
mvars.scoreboards = new Array();
mvars.scoreboards["total"] = new Object; mvars.scoreboards["total"].maxvalue = 50; mvars.scoreboards["total"].cutvalue = 50; mvars.scoreboards["total"].normalize = true;
mvars.status = new Object; mvars.status.i = "firstload"; mvars.status.c = new Object; mvars.extrastatus = false;
mvars.check = false;
mvars.cv = new Object;
mvars.cv.xmlhttp = false; mvars.cv.flash = false; mvars.cv.sw = false; mvars.cv.mp = false; mvars.cv.java = false; mvars.cv.qt = false; mvars.cv.rm = false; mvars.cv.svg = false; mvars.cv.pdf = false;
mvars.trackvisited = false;
mvars.soundswitch = false;
mvars.soundstart = false;
mvars.showSplash = false;
mvars.scorm = false;

function loadVars() {
	try {
		varXML = new ActiveXObject("MSXML.DOMDocument");
		varXML.async = false;
		varXML.onreadystatechange=checkVarsLoad;
		varXML.load("vars.xml");
	} catch(x) {
		alert(alertLib.varsError1);
	}
}

function checkReady() {
	if(mvars.aicc || mvars.cv.xmlhttp) {
		if(!system.xmlhttp.installed && !system.serverxmlhttp.installed) {
			return false;
		}
	}
	if(mvars.soundswitch || mvars.cv.flash) {
		if(!system.flash.installed) {
			return false;
		}
	}
	if(mvars.cv.flash && !system.flash.installed) {
		return false;
	}
	if(mvars.cv.sw && !system.shockwave.installed) {
		return false;
	}
	if(mvars.cv.mp && !system.mediaplayer.installed) {
		return false;
	}
	if(mvars.cv.qt && !system.quicktime.installed) {
		return false;
	}
	if(mvars.cv.rm && !system.realplayer.installed) {
		return false;
	}
	if(mvars.cv.java && !system.java.installed) {
		return false;
	}
	if(mvars.cv.svg && !system.svg.installed) {
		return false;
	}
	if(mvars.cv.pdf && !system.pdf.installed) {
		return false;
	}
	return true;
}

function checkVarsLoad() {
	switch (varXML.readyState) {
	case 4:
		var err = varXML.parseError;
    	if (err.errorCode != 0) {
			alert(alertLib.varsError+err.reason);
			return false;
		} else {
			if(!parseVars()) {
				alert(alertLib.varsError2);
			}
		}
		break;
	default:
		break;
	}
	return true;
}

function parseVars() {
	if(varXML.selectSingleNode("//track_visited")) {
		if(varXML.selectSingleNode("//track_visited").text.charAt(0)=="y") {
			mvars.trackvisited = true;
		}
	}
	if(varXML.selectSingleNode("//sound_switch")) {
		if(varXML.selectSingleNode("//sound_switch").text.charAt(0)=="y") {
			mvars.soundswitch = true;
			mvars.cv.flash = true;
		}
	}
	if(mvars.soundswitch) {
		if(varXML.selectSingleNode("//sound_start")) {
			if(varXML.selectSingleNode("//sound_start").text.charAt(0)=="y") {
				mvars.soundstart = true;
			}
		}
	}
	if(varXML.selectSingleNode("//aicc_switch")) {
		if(varXML.selectSingleNode("//aicc_switch").text.charAt(0)=="y") {
			mvars.aicc = true;
		}
	}
	if(varXML.selectSingleNode("//scorm_switch")) {
		if(varXML.selectSingleNode("//scorm_switch").text.charAt(0)=="y") {
			mvars.scorm = true;
		}
	}
	if(varXML.selectSingleNode("//splash_switch")) {
		if(varXML.selectSingleNode("//splash_switch").text.charAt(0)=="y") {
			mvars.showSplash = true;
		}
	}
	if(mvars.aicc) {
		if(varXML.selectSingleNode("//aicc_method_exit")) {
			if(varXML.selectSingleNode("//aicc_method_exit").text.charAt(0)=="y") {
				mvars.aiccMethod = "exit";
			}
		}
		if(varXML.selectSingleNode("//aicc_method_timer")) {
			if(varXML.selectSingleNode("//aicc_method_timer").text.charAt(0)=="y") {
				mvars.aiccMethod = "timer";
			}
		}
		if(varXML.selectSingleNode("//aicc_method_normal")) {
			if(varXML.selectSingleNode("//aicc_method_normal").text.charAt(0)=="y") {
				mvars.aiccMethod = "normal";
			}
		}
		if(mvars.aiccMethod=="timer") {
			if(varXML.selectSingleNode("//aicc_timer")) {
				if(varXML.selectSingleNode("//aicc_timer").text!="") {
					mvars.aiccTimer = parseInt(varXML.selectSingleNode("//aicc_timer").text,10);
					if(isNaN(mvars.aiccTimer)) {
						mvars.aiccTimer = 30000;
					} else {
						if(mvars.aiccTimer < 10000) {
							mvars.aiccTimer = 10000;
						}
					}
				}
			}
		}
		if(varXML.selectSingleNode("//aicc_control_strict")) {
			if(varXML.selectSingleNode("//aicc_control_strict").text.charAt(0)=="y") {
				mvars.aiccControl = "strict";
			}
		}
	}
	if(varXML.selectSingleNode("//check_switch")) {
		if(varXML.selectSingleNode("//check_switch").text.charAt(0)=="y") {
			mvars.check = true;
		}
	}
	if(mvars.check) {
		if(varXML.selectSingleNode("//check_xml3")) {
			if(varXML.selectSingleNode("//check_xml3").text.charAt(0)=="y") {
				mvars.cv.xmlhttp = true;
			}
		}
		if(varXML.selectSingleNode("//check_flash")) {
			if(varXML.selectSingleNode("//check_flash").text.charAt(0)=="y") {
				mvars.cv.flash = true;
			}
		}
		if(varXML.selectSingleNode("//check_sw")) {
			if(varXML.selectSingleNode("//check_sw").text.charAt(0)=="y") {
				mvars.cv.sw = true;
			}
		}
		if(varXML.selectSingleNode("//check_mp")) {
			if(varXML.selectSingleNode("//check_mp").text.charAt(0)=="y") {
				mvars.cv.mp = true;
			}
		}
		if(varXML.selectSingleNode("//check_qt")) {
			if(varXML.selectSingleNode("//check_qt").text.charAt(0)=="y") {
				mvars.cv.qt = true;
			}
		}
		if(varXML.selectSingleNode("//check_rm")) {
			if(varXML.selectSingleNode("//check_rm").text.charAt(0)=="y") {
				mvars.cv.rm = true;
			}
		}
		if(varXML.selectSingleNode("//check_java")) {
			if(varXML.selectSingleNode("//check_java").text.charAt(0)=="y") {
				mvars.cv.java = true;
			}
		}
		if(varXML.selectSingleNode("//check_svg")) {
			if(varXML.selectSingleNode("//check_svg").text.charAt(0)=="y") {
				mvars.cv.svg = true;
			}
		}
		if(varXML.selectSingleNode("//check_pdf")) {
			if(varXML.selectSingleNode("//check_pdf").text.charAt(0)=="y") {
				mvars.cv.pdf = true;
			}
		}
	}
	if(varXML.selectNodes("//scoreboards/item").length>0) {
		var curb;
		for(var i=0;i<varXML.selectNodes("//scoreboards/item").length;i++) {
			curb = varXML.selectNodes("//scoreboards/item").item(i);
			if(!curb.selectSingleNode("board")) continue;
			if(curb.selectSingleNode("board").text!="") {
				mvars.scoreboards[i] = new Object;
				mvars.scoreboards[i].name = curb.selectSingleNode("board").text;
				if(curb.selectSingleNode("maxvalue")) {
					mvars.scoreboards[i].maxvalue = parseInt(curb.selectSingleNode("maxvalue").text,10);
					if(isNaN(mvars.scoreboards[i].maxvalue)) mvars.scoreboards[i].maxvalue = 100;
				}
				if(curb.selectSingleNode("cutvalue")) {
					mvars.scoreboards[i].cutvalue = parseInt(curb.selectSingleNode("cutvalue").text,10);
					if(isNaN(mvars.scoreboards[i].cutvalue)) mvars.scoreboards[i].cutvalue = 70;
				}
				if(curb.selectSingleNode("normalize")) {
					if(curb.selectSingleNode("normalize").text.charAt(0)=="y") {
						mvars.scoreboards[i].normalize = true;
					} else {
						mvars.scoreboards[i].normalize = false;
					}
				}
			}
		}
	}
	mvars.setMaxPoints = false;
	if(varXML.selectSingleNode("//setmaxpoint")) {
		if(varXML.selectSingleNode("//setmaxpoint").text.charAt(0)=="y") {
			mvars.setMaxPoints = true;
		}
	}
	if(varXML.selectSingleNode("//st_i_slide")) {
		if(varXML.selectSingleNode("//st_i_slide").text.charAt(0)=="y") {
			mvars.status.i = "slideid";
		}
	}
	if(varXML.selectSingleNode("//st_i_firstslide")) {
		if(varXML.selectSingleNode("//st_i_firstslide").text.charAt(0)=="y") {
			mvars.status.i = "firstslide";
		}
	}
	if(varXML.selectSingleNode("//st_i_firstload")) {
		if(varXML.selectSingleNode("//st_i_firstload").text.charAt(0)=="y") {
			mvars.status.i = "firstload";
		}
	}
	if(mvars.status.i == "slideid") {
		if(varXML.selectSingleNode("//st_i_slideid")) {
			if(varXML.selectSingleNode("//st_i_slideid").text!="") {
				mvars.slideid = varXML.selectSingleNode("//st_i_slideid").text;
			} else {
				mvars.status.i = "firstload";
			}
		} else {
			mvars.status.i = "firstload";
		}
	}
	mvars.status.c.allslides = false;
	mvars.status.c.allscored = false;
	mvars.status.c.cutvalue = false;
	if(varXML.selectSingleNode("//st_c_allslides")) {
		if(varXML.selectSingleNode("//st_c_allslides").text.charAt(0)=="y") {
			mvars.status.c.allslides = true;
		}
	}
	if(varXML.selectSingleNode("//st_c_allscored")) {
		if(varXML.selectSingleNode("//st_c_allscored").text.charAt(0)=="y") {
			mvars.status.c.allscored = true;
		}
	}
	if(varXML.selectSingleNode("//st_c_cutvalue")) {
		if(varXML.selectSingleNode("//st_c_cutvalue").text.charAt(0)=="y") {
			mvars.status.c.cutvalue = true;
		}
	}
	if(varXML.selectSingleNode("//st_p_switch")) {
		if(varXML.selectSingleNode("//st_p_switch").text.charAt(0)=="y") {
			mvars.extrastatus = true;
		}
	}
	return true;
}

function firstCheck() {
	var ver=navigator.userAgent.toLowerCase();
	if(navigator.appVersion.indexOf("Mac") > 0) {
		system.platform = "mac";
		if((ver.indexOf("mac os x")!=-1)) {
			system.os = "macosx";
		} else {
			system.os = "macosclassic"
		}
	}
	if(navigator.appVersion.indexOf("Win") > 0) {
		system.platform = "win";
		if((ver.indexOf("win95")!=-1) || (ver.indexOf("windows 95")!=-1)) system.os = "win95";
		if((ver.indexOf("win98")!=-1) || (ver.indexOf("windows 98")!=-1)) system.os = "win98";
		if((ver.indexOf("winme")!=-1) || (ver.indexOf("windows me")!=-1)) system.os = "winme";
		if(ver.indexOf("winnt")!=-1 || ver.indexOf("windows nt")!=-1) {
			if((ver.indexOf("5.1")!=-1)) {
				system.os = "winxp";
			} else {
				if(ver.indexOf("5.0")!=-1) {
					system.os = "win2000";
				} else {
					if((ver.indexOf("5.2")!=-1)) {
						system.os = "win2003";
					} else {
						system.os = "winnt";
					}
				}
			}
		}
	}
	if(document.getElementById) {
		system.dom = true;
	}
	system.ie = false;
	if(ver.indexOf("opera")==-1 && ver.indexOf("msie")>-1 && system.dom) {
		system.browser = "msie6";
		system.ie = true;
	}
	if(ver.indexOf("opera")==-1 && ver.indexOf("msie 6")>-1 && system.dom) {
		system.browser = "msie6";
		system.ie = true;
	}
	if(ver.indexOf("opera")==-1 && ver.indexOf("msie 5")>-1 && system.dom) {
		if(ver.indexOf("msie 5.5")>-1) {
			system.browser = "msie6";
		} else {
			system.browser = "msie5";
		}
		system.ie = true;
	}
	if(ver.indexOf("opera")==-1 && document.all && !system.dom) {
		system.browser = "msie4";
		system.ie = true;
	}
	if(ver.indexOf("opera")==-1 && ver.indexOf("netscape")>-1 && system.dom) {
		system.browser = "ns6";
	}
	if(ver.indexOf("gecko")>-1 && ver.indexOf("netscape")>-1 && system.dom) {
		system.browser = "ns7";
	}
	if(ver.indexOf("opera")==-1 && document.layers && !system.dom) {
		system.browser = "ns4";
	}
	if(ver.indexOf("gecko")>-1 && ver.indexOf("firefox")>-1 && system.dom) {
		system.browser = "firefox";
	}
	if(ver.indexOf("gecko")>-1 && ver.indexOf("netscape")==-1 && system.dom) {
		system.browser = "mozilla";
	}
	if(ver.indexOf("opera")==-1 && ver.indexOf("safari")>-1 && system.dom) {
		system.browser = "safari";
	}
	if(ver.indexOf("opera")>-1 && system.dom) {
		system.browser = "opera";
		system.ie = false;
	}
	if(system.platform == "win") {
		var txml = "<?xml version=\"1.0\" encoding=\"UTF-16\"?><cjb></cjb>";
		if(system.ie && system.browser!="msie4") {
			try {
				var ctl = new ActiveXObject("Shell.Explorer");
				system.activex.installed = true;
			} catch(e) {
			}
			try {
	    		var x = new ActiveXObject("Microsoft.XMLDOM");
				x.async = false;
				if(x.loadXML(txml)) system.xmlbase.installed=true;
			} catch(e) {
			}
		}
		if(!system.ie) {
			try {
				var ctl = new ActiveXObject("Shell.Explorer");
				system.activex.installed = true;
			} catch(e) {
			}
			try {
				var x = new DOMParser();
				var objDoc = x.parseFromString(txml,"text/xml");
				system.xmlbase.installed = true;
			} catch(e) {
			}
		}
	}
	return system.activex.installed && system.xmlbase.installed;
}

function secondCheck() {
	if(system.platform == "win") {
		if(system.ie && system.browser!="msie4") {
			try {
				var x = new ActiveXObject("MSXML2.XMLHTTP");
				system.xmlhttp.installed=true;
			} catch(e) {
				try {
	    			var xx = new ActiveXObject("MSXML2.ServerXMLHTTP");
	    			system.serverxmlhttp.installed=true;
				} catch(e) {
				}
			}
		}
		if(!system.ie) {
			try {
				var objXMLHTTP = new XMLHttpRequest();
				system.xmlhttp.installed = true;
			} catch(e) {
			}
		}
	}
	return system.xmlhttp.installed;
}

function lastCheck() {
	var curitem;
	if(system.platform=="win" && !system.ie) {
		if(navigator.plugins && navigator.plugins.length!=0) {
			for(var i=0;i<navigator.plugins.length;i++) {
				curitem = navigator.plugins[i];
				if(curitem.name.toLowerCase().indexOf("shockwave flash")!=-1) {
					system.flash.installed = true;
					system.flash.version = curitem.description.charAt(curitem.description.indexOf('.')-1);
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("adobe acrobat")!=-1 || curitem.name.toLowerCase().indexOf("adobe reader")!=-1) {
					system.pdf.installed = true;
					system.pdf.version = curitem.description.charAt(curitem.description.indexOf('.')-1);
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("quicktime plug-in")!=-1) {
					system.quicktime.installed = true;
					system.quicktime.version = curitem.name.charAt(curitem.name.indexOf('.')-1);
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("shockwave")!=-1 && curitem.name.toLowerCase().indexOf("director")!=-1) {
					system.shockwave.installed = true;
					system.shockwave.version = curitem.description.substring(curitem.description.indexOf('.')-2,curitem.description.indexOf('.'));
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("realplayer version")!=-1) {
					system.realplayer.installed = true;
					system.realplayer.version = curitem.description.substring(curitem.description.indexOf('.')-2,curitem.description.indexOf('.'));
					continue;
				}

				if(curitem.name.toLowerCase().indexOf("java plug-in")!=-1 && navigator.javaEnabled()) {
					system.java.installed = true;
					system.java.version = curitem.description.substring(curitem.description.toLowerCase().indexOf('java plug-in')+13,curitem.description.toLowerCase().indexOf('java plug-in')+22);
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("windows media player")!=-1) {
					system.mediaplayer.installed = true;
					system.mediaplayer.version = "0.0";
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("svg viewer")!=-1) {
					system.svg.installed = true;
					system.svg.version = "";
					continue;
				}
			}
		}
		if(navigator.mimeTypes && navigator.mimeTypes.length) {
			for(var i=0;i<navigator.mimeTypes.length;i++) {
				curitem = navigator.mimeTypes[i];
				if(curitem.name.toLowerCase().indexOf("application/x-oleobject")!=-1) {
					if(curitem.enabledPlugin) {
						system.activex.installed = true;
					} else {
						system.activex.installed = false;
					}
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("application/pdf")!=-1) {
					if(curitem.enabledPlugin) {
						system.pdf.installed = true;
					} else {
						system.pdf.installed = false;
					}
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("application/x-shockwave-flash")!=-1) {
					if(curitem.enabledPlugin) {
						system.flash.installed = true;
					} else {
						system.flash.installed = false;
					}
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("application/x-director")!=-1) {
					if(curitem.enabledPlugin) {
						system.shockwave.installed = true;
					} else {
						system.shockwave.installed = false;
					}
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("video/x-ms-wmv")!=-1) {
					if(curitem.enabledPlugin) {
						system.mediaplayer.installed = true;
					} else {
						system.mediaplayer.installed = false;
					}
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("video/quicktime")!=-1) {
					if(curitem.enabledPlugin) {
						system.quicktime.installed = true;
					} else {
						system.quicktime.installed = false;
					}
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("audio/x-pn-realaudio-plugin")!=-1) {
					if(curitem.enabledPlugin) {
						system.realplayer.installed = true;
					} else {
						system.realplayer.installed = false;
					}
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("application/x-java-applet")!=-1) {
					if(curitem.enabledPlugin) {
						system.java.installed = true;
					} else {
						system.java.installed = false;
					}
					continue;
				}
				if(curitem.name.toLowerCase().indexOf("image/svg")!=-1) {
					if(curitem.enabledPlugin) {
						system.svg.installed = true;
					} else {
						system.svg.installed = false;
					}
					continue;
				}
			}
		}
	}
	if(system.platform=="win" && system.ie && system.browser!="msie4") {
		MSDetect = true;
		document.write('<object classid=CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6 codebase=#Version=7,0,0,1954 height=1 id=WMP7 width=1></object>');
		if(navigator.javaEnabled()) {
			system.java.installed = true;
		}
		if(mvars.cv.flash) system.flash.installed = GetIEActiveX("ShockwaveFlash.ShockwaveFlash.1");
		if(mvars.cv.sw) system.flash.installed = GetIEActiveX("SWCtl.SWCtl.8.5");
		if(mvars.cv.qt) system.quicktime.installed = GetIEActiveX("QuickTime.QuickTime");
		if(mvars.cv.mp) system.mediaplayer.installed = GetIEActiveX("22D6F312-B0F6-11D0-94AB-0080C74C7E95");
//		vbCheck();
	}
	return true;
}

function GetIEActiveX(sActiveXProgID)
{
	try
	{
		var oTestObject = new ActiveXObject(sActiveXProgID);
		return true
	}
	catch (e)
	{
		return false
	}
}


function insertFPlayer(containerID,objID) {
	var fdiv = document.createElement("div"); fdiv.setAttribute("id",containerID);
	if(system.ie) {
		var fobj = document.createElement("object"); fobj.setAttribute("id",objID); fobj.setAttribute("width","0"); fobj.setAttribute("height","0"); fobj.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"); fobj.setAttribute("codebase","http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,14,0");
		var fparam = document.createElement("param"); fparam.setAttribute("name","movie"); fparam.setAttribute("value","");
/*		fobj.appendChild(fparam);
		fparam = document.createElement("param"); fparam.setAttribute("name","play"); fparam.setAttribute("value","false");
		fobj.appendChild(fparam);
		fparam = document.createElement("param"); fparam.setAttribute("name","loop"); fparam.setAttribute("value","false");
		fobj.appendChild(fparam);
		fparam = document.createElement("param"); fparam.setAttribute("name","quality"); fparam.setAttribute("value","high");
		fobj.appendChild(fparam);
		fparam = document.createElement("param"); fparam.setAttribute("name","wmode"); fparam.setAttribute("value","opaque");
		fobj.appendChild(fparam);
		fparam = document.createElement("param"); fparam.setAttribute("name","swliveconnect"); fparam.setAttribute("value","true");
		fobj.appendChild(fparam);*/
		fdiv.appendChild(fobj);
		fdiv.style.width = "1px";
		fdiv.style.height = "1px";
		document.body.appendChild(fdiv);
		fdiv.style.display = "none";
	}
	return true;
}





function startActivity() {
	if(everythingLoaded) {
		document.getElementById('preDiv').style.display="none";
		startSlides(true);
	} else {
		return false;
	}
	return false;
}

function fillResultTable() {
	if(!document.getElementById("pluginsTable")) {
		return false;
	}
	var rt = document.getElementById("pluginsTable");
	if(rt.firstChild.nodeName.toLowerCase()=="tbody") rt = rt.firstChild;
	if(!mvars.cv.xmlhttp) rt.removeChild(document.getElementById("rowXMLHTTP"));
	if(mvars.aicc || mvars.cv.xmlhttp) {
		if(system.xmlhttp.installed) {
			rt.removeChild(document.getElementById("rowXMLHTTP"));
		}
	}
	if(!mvars.cv.flash) rt.removeChild(document.getElementById("rowFlash"));
	if(mvars.soundswitch || mvars.cv.flash) {
		if(system.flash.installed) {
			rt.removeChild(document.getElementById("rowFlash"));
		}
	}
	if(!mvars.cv.sw) {
		rt.removeChild(document.getElementById("rowSW"));
	} else {
		if(system.shockwave.installed) {
			rt.removeChild(document.getElementById("rowSW"));
		}
	}
	if(!mvars.cv.mp) {
		rt.removeChild(document.getElementById("rowMP"));
	} else {
		if(system.mediaplayer.installed) {
			rt.removeChild(document.getElementById("rowMP"));
		}
	}
	if(!mvars.cv.qt) {
		rt.removeChild(document.getElementById("rowQT"));
	} else {
		if(system.quicktime.installed) {
			rt.removeChild(document.getElementById("rowQT"));
		}
	}
	if(!mvars.cv.rm) {
		rt.removeChild(document.getElementById("rowRM"));
	} else {
		if(system.realplayer.installed) {
			rt.removeChild(document.getElementById("rowRM"));
		}
	}
	if(!mvars.cv.java) {
		rt.removeChild(document.getElementById("rowJava"));
	} else {
		if(system.java.installed) {
			rt.removeChild(document.getElementById("rowJava"));
		}
	}
	if(!mvars.cv.svg) {
		rt.removeChild(document.getElementById("rowSVG"));
	} else {
		if(system.svg.installed) {
			rt.removeChild(document.getElementById("rowSVG"));
		}
	}
	if(!mvars.cv.pdf) {
		rt.removeChild(document.getElementById("rowPDF"));
	} else {
		if(system.pdf.installed) {
			rt.removeChild(document.getElementById("rowPDF"));
		}
	}
	return true;
}

function plugCheckLoad() {
	switch (errXML.readyState) {
	case 4:
		var err = errXML.parseError;
    	if (err.errorCode != 0) {
			alert("Description: "+err.reason);
			return false;
		} else {
			document.getElementById('preDiv').innerHTML = errXML.selectSingleNode("//PLUGS").text;
			fillResultTable();
		}
		break;
	default:
		break;
	}
	return true;
}


/*function checkDescXMLload() {
	switch (DescXMLDocument.readyState) {
	case 4:
		var err = DescXMLDocument.parseError;
    	if (err.errorCode != 0) {
			alert("Description: "+err.reason);
			return false;
		} else {
			document.getElementById('preDiv').innerHTML = DescXMLDocument.selectSingleNode("//SPLASH").text;
//			document.title=DescXMLDocument.selectSingleNode("//CHAPTERTITLE").text;
		}
		break;
	default:
		break;
	}
	return true;
}*/

/*function waitForUser() {
	everythingLoaded=true;
	switchButton('go');
	return true;
}

function switchButton(btn) {
	if(document.getElementById('wsGoButton') && document.getElementById('wsGoButton1')) {
		document.getElementById('wsGoButton').innerHTML = document.getElementById('wsGoButton1').innerHTML;
	}
	return true;
}
*/
