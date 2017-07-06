// JavaScript Document
// WebTutor QTI Player Tools (c)2002-2008 Websoft Development.
// http://www.websoft.ru/
// 20081102

var g_isMSIE = false;
var g_isFireFox = false;
var g_isOpera = false;
var g_sMSXMLProgID;
var g_sMSXMLHTTPProgID;
var g_nFirst = 1;

/************************************/

function GetWindowSize()
{
	var iW = 0;
	var iH = 0;
	if( typeof( window.innerWidth ) == "number" )
	{
    //Non-IE
		iW = window.innerWidth;
		iH = window.innerHeight;
	}
	else
	{
		if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
		{
		//IE 6+ in 'standards compliant mode'
			iW = document.documentElement.clientWidth;
			iH = document.documentElement.clientHeight;
		}
		else
		{
			if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
			{
			//IE 4 compatible
				iW = document.body.clientWidth;
				iH = document.body.clientHeight;
			}
		}
	}
	this.w = iW;
	this.h = iH;
	return this;
}


// StartCheck
function StartCheck()
{
	CheckBrowserType();
	if(g_isFireFox)
	{
		UpdateFireFoxDOM();
	} else if(g_isMSIE)
	{
		DetermineMSXMLProgID();
		DetermineMSXMLHTTPProgID();
	}
	return true;
}

// LoadFile
function LoadFile(sURL)
{
    if(sURL==null) return null;
    var oDoc = CreateDOMDocument();
	var bLoaded = false;
	try
	{
	    if(g_isMSIE)
	    {
		    oDoc.async = false;
		    bLoaded = oDoc.load(sURL);
	    }
	    else if(g_isFireFox)
	    {
		    if(g_sProtocol=="http:")
		    {
			    var oRequest = new XMLHttpRequest();
			    oRequest.open("GET", sURL, false);
			    oRequest.send(null);
			    if(oRequest.status == 200)
			    {
				    var sResponseText = oRequest.responseText;
				    var objDOMParser = new DOMParser();
				    var objDoc = objDOMParser.parseFromString(sResponseText, "text/xml");
				    oDoc = objDoc;
				    bLoaded = true;
			    }
		    }
		    else
		    {
			    oDoc.async = false;
			    bLoaded = oDoc.load(sURL);
		    }
	    }
	}
	catch(e)
	{
	    return null;
	}
	return bLoaded ? oDoc : null;
}

// TransformXSL
function TransformXSL(oNode,oTemplate)
{
    if(g_isMSIE)
    {
        return oNode.transformNode(oTemplate);
    }
    else if(g_isFireFox)
    {
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(oTemplate);

        return xsltProcessor.transformToFragment(oNode,document);
    }
	return null;
}

function XSLApplyWithParam(oXML, oXSL, aParams)
{
	var oXSLTProc;
	if(g_isMSIE)
	{
        var oXSLTemplate = new ActiveXObject("MSXML2.XSLTemplate.3.0");
        oXSLTemplate.stylesheet = oXSL;
        oXSLTProc = oXSLTemplate.createProcessor();
        oXSLTProc.input = oXML;
		if(aParams!=null)
		{
			for(var i=0; i<aParams.length; i++)
			{
				oXSLTProc.addParameter(aParams[i].name, aParams[i].value);
			}
		}
        oXSLTProc.transform();
        return oXSLTProc.output;
    }
	else if(g_isFireFox)
	{
        oXSLTProc = new XSLTProcessor();
        oXSLTProc.importStylesheet(oXSL);
		if(aParams!=null)
		{
			for(var i=0; i<aParams.length; i++)
			{
				oXSLTProc.setParameter(null, aParams[i].name, aParams[i].value);
			}
		}
        var oResult = oXSLTProc.transformToDocument(oXML);
        //serialise output to string
		var oXMLSerial = new XMLSerializer;
        return oXMLSerial.serializeToString(oResult);
    }
	return null;
}




// CheckBrowserType
function CheckBrowserType()
{
	var sUserAgent;
	try
	{
		sUserAgent = navigator.userAgent.toLowerCase();
	}
	catch (e)
	{
		sUserAgent = "msie";
	}

	if(sUserAgent.indexOf("msie") != -1)
	{
		g_isMSIE = true;
	}
	else
	{
		if (sUserAgent.indexOf("gecko") != -1)
		{
			g_isFireFox = true;
		}
		if (sUserAgent.indexOf("opera") != -1)
		{
			g_isOpera = true;
			g_isFireFox = true;
		}
	}
	return true;
}

// _Node_getXML
function _Node_getXML()
{
	var objXMLSerializer = new XMLSerializer;
	var strXML = objXMLSerializer.serializeToString(this);
	return strXML;
}

// UpdateFireFoxDOM
function UpdateFireFoxDOM()
{
	// selectNodes
	if (document.implementation.hasFeature("XPath", "3.0"))
	{
		XMLDocument.prototype.selectNodes =
			function (cXPathString, xNode)
			{
				if (!xNode)	xNode = this;
				var oNSResolver = this.createNSResolver(this.documentElement)
				var aItems = this.evaluate(cXPathString, xNode, oNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
				var aResult = [];
				for (var i=0; i<aItems.snapshotLength; i++)
				{
					aResult[i] = aItems.snapshotItem(i);
				}
				return aResult;
			}

		Element.prototype.selectNodes =
			function (cXPathString)
			{
				if (this.ownerDocument.selectNodes)
				{
					return this.ownerDocument.selectNodes(cXPathString, this);
				}
				else
				{
					throw "For XML Elements Only";
				}
			}
	}
	// selectSingleNode
	if (document.implementation.hasFeature("XPath", "3.0"))
	{
		// prototyping the XMLDocument
		XMLDocument.prototype.selectSingleNode =
			function (cXPathString, xNode)
			{
				if (!xNode)	xNode = this;
				var xItems = this.selectNodes(cXPathString, xNode);
				if (xItems.length > 0)
				{
					return xItems[0];
				}
				else
				{
					return null;
				}
			}
		// prototyping the Element
		Element.prototype.selectSingleNode =
			function (cXPathString)
			{
				if (this.ownerDocument.selectSingleNode)
				{
					return this.ownerDocument.selectSingleNode(cXPathString, this);
				}
				else
				{
					throw "For XML Elements Only";
				}
			}
	}
	// loadXML
	Document.prototype.loadXML =
	function (sXML)
	{
		var objDOMParser = new DOMParser();
		var objDoc = objDOMParser.parseFromString(sXML, "text/xml");
	}
	// xml
	Node.prototype.__defineGetter__("xml",
	function()
	{
		var oXMLSerializer = new XMLSerializer;
		var sXML = oXMLSerializer.serializeToString(this);
		return sXML;
	});
	// text
	Node.prototype.__defineGetter__("text",
	function()
	{
		var sText = "";
		var oText = this.firstChild;
		while (oText != null)
		{
			if (oText.nodeType == 3 || oText.nodeType == 4)
			{
				sText += oText.nodeValue;
			}
			oText = oText.nextSibling;
		}
		return sText;
	});
	g_nFirst = 1;
}

// DetermineMSXMLProgID
function DetermineMSXMLProgID()
{
	var oDoc;
	var sProgID;
	for (var i = 6; i >= 3; i--)
	{
		try
		{
			sProgID = "MSXML2.DOMDocument."+ i +".0";
			oDoc = new ActiveXObject(sProgID);
		}
		catch (e)
		{
		}
		if (typeof oDoc == "object")
		{
			g_sMSXMLProgID = sProgID;
			g_nFirst = (i <= 3 ? 0 : 1);
			break;
		}
	}
}

// DetermineMSXMLHTTPProgID
function DetermineMSXMLHTTPProgID()
{
	var oDoc;
	var sProgID;
	for (var i = 6; i >= 3; i--)
	{
		try
		{
			sProgID = "MSXML2.XMLHTTP."+ i +".0";
			oDoc = new ActiveXObject(sProgID);
		}
		catch (e)
		{
		}
		if (typeof oDoc == "object")
		{
			g_sMSXMLHTTPProgID = sProgID;
			break;
		}
	}
}

// CreateDOMDocument
function CreateDOMDocument()
{
	var oDoc;

	if (g_isMSIE)
	{
		oDoc = new ActiveXObject(g_sMSXMLProgID);
	}
	else if (g_isFireFox)
	{
		oDoc = document.implementation.createDocument("", "doc", null);
	}

	return oDoc;
}


// CreateXMLHTTP
function CreateXMLHTTP()
{
	var oXmlHttp;
	if (g_isMSIE)
	{
		oXmlHttp = new ActiveXObject(g_sMSXMLHTTPProgID);
	}
	else if (g_isFireFox)
	{
		oXmlHttp = new XMLHttpRequest();
	}

	return oXmlHttp;
}

// String trimmer
function Trim(sString, bStartSpace, bEndSpace, bDoubleSpace, bEnter)
{
	if(typeof sString != "string") return sString;
	var bStart = (bStartSpace!=false);
	var bEnd = (bEndSpace!=false);
	var bDblSpc = (bDoubleSpace!=false);
	var bCRLF = (bEnter!=false);
	var sReturn = sString;
	var sChar;
	if(bStart)
	{
		sChar = sReturn.substring(0, 1);
		while (sChar==" " || sChar=="\n" || sChar=="\r" || sChar=="\t")
		{
			sReturn = sReturn.substring(1, sReturn.length);
			sChar = sReturn.substring(0, 1);
		}
	}
	if(bEnd)
	{
   		sChar = sReturn.substring(sReturn.length-1, sReturn.length);
		while (sChar==" " || sChar=="\n" || sChar=="\r" || sChar=="\t")
		{
			sReturn = sReturn.substring(0, sReturn.length-1);
			sChar = sReturn.substring(sReturn.length-1, sReturn.length);
		}
	}
	if(bCRLF)
	{
		while (sReturn.indexOf("\n") != -1)
		{
			sReturn = sReturn.substring(0, sReturn.indexOf("\n")) +" "+ sReturn.substring(sReturn.indexOf("\n")+1, sReturn.length);
		}
		while (sReturn.indexOf("\r") != -1)
		{
			sReturn = sReturn.substring(0, sReturn.indexOf("\r")) + sReturn.substring(sReturn.indexOf("\r")+1, sReturn.length);
		}
		while (sReturn.indexOf("\t") != -1)
		{
			sReturn = sReturn.substring(0, sReturn.indexOf("\t")) + sReturn.substring(sReturn.indexOf("\t")+1, sReturn.length);
		}
	}
	if(bDblSpc)
	{
		while (sReturn.indexOf("  ") != -1)
		{
			sReturn = sReturn.substring(0, sReturn.indexOf("  ")) + sReturn.substring(sReturn.indexOf("  ")+1, sReturn.length);
		}
	}
	return sReturn;
}

// FormatReal_10_7
function FormatReal_10_7(param)
{
	if(param == null) return null;
	var rArg = param;
	if(typeof param != "number")
	{
		var rArg = parseFloat(param);
		if(isNaN(rArg)) return null;
	}
	if(Math.abs(rArg)<0.00000005) return "0";
	var sArg = rArg.toString();
	if(sArg.indexOf(".")==-1) return sArg;
	var iIndx = sArg.indexOf(".")+1;
	if(sArg.substr(iIndx).length<8 && sArg.indexOf("e")==-1) return sArg;
	sArg = sArg.toLowerCase();
	var iIndx = sArg.indexOf("e");
	if(iIndx!=-1)
	{
		if(parseInt(sArg.substr(iIndx+1),10) > 13) return "Infinity";
	}
	bNeg = false;
	var rOp = rArg;
	if(rArg < 0)
	{
		rOp = Math.abs(rArg);
		bNeg = true;
	}
	var sRes = new String(Math.round(rOp*Math.pow(10,7)));
	while (sRes.length <= 7) sRes='0'+sRes;
	var iLen = sRes.length-7;
	var sRes = sRes.substr(0,iLen) + '.' + sRes.substr(iLen,7);
	if(bNeg) sRes = "-"+sRes;
	return sRes;
}


function Convert(vValue, sFrom, sTo)
{
	if(vValue==null || sFrom==null || sTo==null) return false;
	var vNewValue;
	switch(sFrom)
	{
		case "cmitime":
			switch(sTo)
			{

			}
	}


	return vNewValue;
}



// ConvertCMITimespanToISO8601
function ConvertCMITimespanToISO8601(sTimespan)
{
	if(sTimespan==null || sTimespan=="") return "";
	var aParts = sTimespan.split(":");
	var iD = 0;
	var iH = 0;
	var iM = 0;
	var iS = 0;
	if(aParts.length==3)
	{
		iH = parseInt(aParts[0],10);
		if(iH>23)
		{
			iD = Math.floor(iH/24);
			iH = iH - iD*24;
		}
		iM = parseInt(aParts[1],10);
		iS = parseInt(aParts[2],10);
	}
	if(aParts.length==2)
	{
		iM = parseInt(aParts[0],10);
		iS = parseInt(aParts[1],10);
	}
	var sResult = iD==0 ? "PT" : "P"+iD.toString()+"DT";
	sResult += iH.toString()+"H"+iM.toString()+"M"+iS.toString()+"S";
	return sResult;
}

// ConvertISO8601ToCMITimespan
function ConvertISO8601ToCMITimespan(sPeriod)
{
	if(sPeriod==null || sPeriod=="") return "";
	var sValue = Trim(sPeriod);
	sValue = sValue.toUpperCase();
	var regDec = new RegExp("\\d+","g");
	var regNonDec = new RegExp("\\D","g");
	var aNums = sValue.match(regDec);
	var aLetters = sValue.match(regNonDec);
	if(aLetters[0]!="P") return "";
	var bTime = false;
	var iIndx = -1;
	var sResult = "";
	var iH,iM,iS = 0;
	for(var i=1;i<aLetters.length;i++)
	{
		if(aLetters[i]=="T")
		{
			bTime = true;
			continue;
		}
		switch(aLetters[i])
		{
			case "Y":	iIndx++;	iH += 8760*parseInt(aNums[iIndx],10); 	break;
			case "M":	iIndx++; 	bTime ? iM = parseInt(aNums[iIndx],10) : iH += 720*parseInt(aNums[iIndx],10);		break;
			case "D":	iIndx++;	iH += 24*parseInt(aNums[iIndx],10);		break;
			case "H":	iIndx++;	iH += parseInt(aNums[iIndx],10);		break;
			case "S":	iIndx++;	iS = parseInt(aNums[iIndx],10); 		break;
			default:	break;
		}
	}
	var sH = iH.toString();
	if(sH.length==1) sH = "0"+sH;
	var sM = iM.toString();
	if(sM.length==1) sM = "0"+sM;
	var sH = iS.toString();
	if(sS.length==1) sS = "0"+sS;
	var sResult = sH+":"+sM+":"+sS;
	return sResult;
}

// ConvertCMITimeToInteger
function ConvertCMITimeToInteger(sTime)
{
	if(sTime==null || sTime=="") return "";
	var sValue = Trim(sTime);
	sValue = sValue.toUpperCase();
	var regDec = new RegExp("\\d+","g");
	var regNonDec = new RegExp("\\D","g");
	var aNums = sValue.match(regDec);
	var aLetters = sValue.match(regNonDec);
	var iDate = Date.UTC(aNums[0], aNums[1], aNums[2], aNums[3], aNums[4], aNums[5], aNums[6]!=null ? aNums[6] : 0);
	return iDate;
}

// ConvertDateToISO8601
function ConvertDateToISO8601(dDate)
{
	var sValue = dDate.toUTCString();
	var iTmp = dDate.getUTCMonth()+1;
	var sMonth = iTmp.toString();
	if(sMonth.length==1) sMonth = "0"+sMonth;
	iTmp = dDate.getUTCDate();
	var sDate = iTmp.toString();
	if(sDate.length==1) sDate = "0"+sDate;
	iTmp = dDate.getUTCHours();
	var sH = iTmp.toString();
	if(sH.length==1) sH = "0"+sH;
	iTmp = dDate.getUTCMinutes();
	var sM = iTmp.toString();
	if(sM.length==1) sM = "0"+sM;
	iTmp = dDate.getUTCSeconds();
	var sS = iTmp.toString();
	if(sS.length==1) sS = "0"+sS;
	var sValue = dDate.getUTCFullYear()+"-"+sMonth+"-"+sDate+"T"+sH+":"+sM+":"+sS+"Z";
	return sValue;
}

// ConvertPeriodToISO8601
function ConvertPeriodToISO8601(iTime)
{
	var sValue = iTime.toString();
	if(isNaN(iTime)) return null;
	var iValue = Math.round(iTime/1000);
	var iDays = 0;
	var iHours = 0;
	var iMin = 0;
	var iSec = 0;
	if(iValue > 86399) {	iDays = Math.floor(iValue/86400);	iValue = iValue - 86400*iDays;	}
	if(iValue > 3599) {		iHours = Math.floor(iValue/3600);	iValue = iValue - 3600*iHours;	}
	if(iValue > 59) {		iMin = Math.floor(iValue/60);		iValue = iValue - 60*iMin;		}
	iSec = iValue;
	sValue = "P";
	if(iDays != 0) sValue += iDays.toString()+"D";
	sValue += "T" + iHours.toString() + "H" + iMin.toString() + "M" + iSec.toString() + "S";
	return sValue;
}

// ConvertPeriodFromISO8601
function ConvertPeriodFromISO8601(sPeriod)
{
	var sValue = Trim(sPeriod,true,true,true,true);
	sValue = sValue.toUpperCase();
	var regDec = new RegExp("\\d+","g");
	var regNonDec = new RegExp("\\D","g");
	var aNums = sValue.match(regDec);
	var aLetters = sValue.match(regNonDec);
	if(aLetters[0]!="P") return null;
	var iValue = 0;
	var iMod = 0;
	var bTime = false;
	var iIndx = -1;
	var sTmp = "-";
	for(var i=1;i<aLetters.length;i++)
	{
		if(aLetters[i]=="T")
		{
			bTime = true;
			continue;
		}
		switch(aLetters[i])
		{
			case "Y":	iIndx++;	iValue += parseInt(aNums[iIndx],10)*977616000000; 	break;
			case "M":
				iIndx++;
				if(bTime)
				{
					iValue += parseInt(aNums[iIndx],10)*60000;
				}
				else
				{
					iValue += parseInt(aNums[iIndx],10)*2678400000;
				}
				break;
			case "D":	iIndx++; 	iValue += parseInt(aNums[iIndx],10)*86400000; 		break;
			case "H":	iIndx++; 	iValue += parseInt(aNums[iIndx],10)*3600000; 		break;
			case ".":	iIndx++;	sTmp = aNums[iIndx]; 								break;
			case "S":
				iIndx++;
				if(sTmp=="-")
				{
					iValue += parseInt(aNums[iIndx],10)*1000;
					break;
				}
				else
				{
					sTmp += "."+aNums[iIndx];
					iValue += parseFloat(sTmp)*1000;
				}
				break;
			default:	iMod = 0;			break;
		}
	}
	return iValue;
}

// ConvertPeriodToString
function ConvertPeriodToString(iInterval)
{
	var iValue = Math.round(iInterval/1000);
	var sOutput = "";
	var iT = 0;
	var sT = "";
	if(iValue>86399)
	{
		iT = Math.floor(iValue/86400);
		iValue = iValue - iT*86400;
		sOutput += iT.toString() + g_sDaysString;
	}
	if(iValue>3599)
	{
		iT = Math.floor(iValue/3600);
		iValue = iValue - iT*3600;
		sT = iT.toString();
		if(sT.length==1) sT = "0"+sT;
		sOutput += sT + g_sHoursString;
	}
	if(iValue>59)
	{
		iT = Math.floor(iValue/60);
		iValue = iValue - iT*60;
		sT = iT.toString();
		if(sT.length==1) sT = "0"+sT;
		sOutput += sT + g_sMinutesString;
	}
	sT = iValue.toString();
	if(sT.length==1) sT = "0"+sT;
	sOutput += sT + g_sSecondsString;
	return sOutput;
}


// Dice
function Dice(iMaxValue, bIncludeMaxValue, aUsedValues, iMaxTries) {
	var iRandomNumber = 0;
	var iCnt = 0;
	var bUsed = false;
	if(iMaxTries==null || isNaN(iMaxTries)) iMaxTries=100;
	do
	{
		if(bIncludeMaxValue)
		{
			iRandomNumber = Math.ceil(Math.random()*iMaxValue);
		}
		else
		{
			iRandomNumber = Math.floor(Math.random()*iMaxValue);
		}
		iCnt++;
		if(aUsedValues.length==0) return iRandomNumber;
		bUsed = true;
		for(var i=0;i<aUsedValues.length;i++) {
			if(aUsedValues[i]==iRandomNumber) {
				bUsed = false;
				break;
			}
		}
		if(bUsed) return iRandomNumber;
	}
	while(iCnt<iMaxTries);
	return 0;
}

// ReplaceStr
function ReplaceStr(sTargetString, sToReplace, sReplaceBy) {

	var sResult = "";

	if(sToReplace=='\\"' && sReplaceBy=='"')
	{
		var reTarget = /\\\"/g;
		sResult = sTargetString.replace(reTarget,sReplaceBy)
		return sResult;
	}
	if(sToReplace=='"' && sReplaceBy=='\\"')
	{
		var reTarget = /\"/g;
		sResult = sTargetString.replace(reTarget,sReplaceBy)
		return sResult;
	}
	switch(sToReplace.charAt(0))
	{
		case "<":
		case "^":
		case "@":
		case "|":
			var sCorrectedToReplace = "\\"+sToReplace;
			break;
		case '\\':
			if(sToReplace=='\\"' && sReplaceBy=='"') sCorrectedToReplace = '\\\"';
			break;
		case '"':
			if(sToReplace=='"' && sReplaceBy=='\\"') sCorrectedToReplace = '\"';
			break;
		default:
			var sCorrectedToReplace = sToReplace;
			break;
	}
	var reTarget = new RegExp(sCorrectedToReplace,"g");
	sResult = sTargetString.replace(reTarget,sReplaceBy);
	return sResult;
}

// AppendNode
function AppendNode(oDoc, oRoot, oChild, sText, sCDATA, aAttrs)
{
	var oTextNode;
	var oElemNode;
	if(sCDATA!=null && sCDATA!="")
	{
		oTextNode = oDoc.createCDATASection(sCDATA);
	}
	else
	{
		if(sText!=null && sText!="")
		{
			oTextNode = oDoc.createTextNode(sText);
		}
	}
	oElemNode = oDoc.createElement(oChild);
	if(aAttrs!=null)
	{
		for(var i=0;i<aAttrs.length;i++)
		{
			oElemNode.setAttribute(aAttrs[i].name, aAttrs[i].value);
		}
	}
	if(oTextNode!=null)
	{
		oElemNode.appendChild(oTextNode);
	}
	oRoot.appendChild(oElemNode);
	return oElemNode;
}

// NumericCompare
function NumericCompare(i1, i2)
{
	var iNum1 = parseInt(i1, 10);
	var iNum2 = parseInt(i2, 10);
	if(isNaN(iNum1) || isNaN(iNum2)) return 0;
	return iNum1-iNum2;
}

// XSLApply
function XSLApply(oXML, oXSL)
{
	if(oXML==null || oXSL==null) return "";
	var oResult = CreateDOMDocument();
    if(g_isMSIE)
    {
        oResult.loadXML(TransformXSL(oXML, oXSL));
    }
    else if(g_isFireFox)
    {
        oResult = TransformXSL(oRubric, g_oRubricTemplate);
    }
	return oResult;
}


// voidfunc
function voidfunc()
{
}

// EventHandler
function EventHandler(sEvent, sFunction, sIdent, oArgs)
{
	if(sEvent==null || sEvent=="" || sFunction==null || sFunction=="") return null;
	this.sEvent = sEvent;
	this.sFunction = sFunction;
	this.sIdent = sIdent;
	this.oArgs = oArgs;
	return this;
}

// AddEvtHandler
function AddEventHandler(sEvent, sFunction, sIdent, oArgs)
{
	var oEventHandler = new EventHandler(sEvent, sFunction, sIdent, oArgs);
	g_listEvtHandlers.Add(oEventHandler);
	return oEventHandler;
}

// HandleEvent
function HandleEvent(sEvent, sIdent)
{
	var sIdentArg = sIdent;
	if(sIdentArg==null) sIdentArg = "GLOBAL";
	for (var oEvtHandler=g_listEvtHandlers.pFirst; oEvtHandler != null; )
	{
		var pNext = oEvtHandler.pNext;
		if (oEvtHandler.sEvent==sEvent && oEvtHandler.sIdent==sIdentArg)
		{
			try
			{
				var oFunction = window[oEvtHandler.sFunction];
				if(oFunction==null) continue;
				oFunction(oEvtHandler, oEvtHandler.sIdent, oEvtHandler.oArgs);
			}
			catch (e)
			{
				alert("HandleEvt: " + oEvtHandler.sFunction + "\n" + e.description);
			}
		}
		oEvtHandler = pNext;
	}
}

// FireEvent
function FireEvent(sEvent, sIdent)
{
	if(sEvent==null) return false;
	HandleEvent(sEvent, sIdent);
	return true;
}


// LIST
// List constructor
function List()
{
	this.pFirst = null;
	this.pLast = null;
	this.Add = List_Add;
	this.AddBefore = List_AddBefore;
	this.Subtract = List_Subtract;
	this.Destroy = List_Destroy;
}

// List_Add
function List_Add(pElement)
{
	if (this.pFirst == null)
	{
		pElement.pPrevious = null;
		pElement.pNext = null;
		this.pFirst = pElement;
		this.pLast = pElement;
	}
	else
	{
		pElement.pPrevious = this.pLast;
		pElement.pNext = null;
		this.pLast.pNext = pElement;
		this.pLast = pElement;
	}
}

// List_AddBefore
function List_AddBefore(pElement, pBefore)
{
	if (pBefore == null || this.pFirst == null)
	{
		this.Add(pElement);
		return;
	}
	var pBeforePrevious = pBefore.pPrevious;
	pElement.pPrevious = pBeforePrevious;
	if (pBeforePrevious)
		pBeforePrevious.pNext = pElement;
	else
		this.pFirst = pElement;
	pElement.pNext = pBefore;
	pBefore.pPrevious = pElement;
}

// List_Subtract
function List_Subtract(pElement)
{
	var bFound = false;//!!!
	for (var pTest = this.pFirst; pTest != null; pTest = pTest.pNext)
	{
		if (pTest === pElement)
		{
			bFound = true;
			break;
		}
	}
	if (bFound)
	{
		var pPrevious = pElement.pPrevious;
		if (pPrevious)
			pPrevious.pNext = pElement.pNext;
		else
			this.pFirst = pElement.pNext;
		var pNext = pElement.pNext;
		if (pNext)
			pNext.pPrevious = pElement.pPrevious;
		else
			this.pLast = pElement.pPrevious;
		pElement.pPrevious = null;
		pElement.pNext = null;
	}
}

// List_Destroy
function List_Destroy()
{
	this.pFirst = null;
	this.pLast = null;
}


// GetParentByTagName
function GetParentByTagName(oElem, sTagName, iLimit)
{
	if(oElem==null || sTagName==null || sTagName=="") return null;
	var iMax = (iLimit==null) ? 10 : iLimit;
	var iCnt = 0;
	var oParent = oElem.parentNode;
	if(oParent==null) return null;
	while(oParent.nodeName.toLowerCase()!=sTagName.toLowerCase())
	{
		iCnt++;
		if(iCnt>iMax) return null;
		oParent = oParent.parentNode;
		if(oParent==null) return null;
	}
	return oParent;
}

// GetParentByClassName
function GetParentByClassName(oElem, sClassName, iLimit)
{
	if(oElem==null || sClassName==null || sClassName=="") return null;
	var iMax = (iLimit==null) ? 10 : iLimit;
	var iCnt = 0;
	var oParent = oElem.parentNode;
	if(oParent==null) return null;
	while(oParent.className!=sClassName)
	{
		iCnt++;
		if(iCnt>iMax) return null;
		oParent = oParent.parentNode;
		if(oParent==null) return null;
	}
	return oParent;
}

// GetElementOffset
function GetElementOffset(oElem, sCoord)
{
	if(oElem==null) return null;
	var iOffset = 0;
	var iCurOffset = 0;
	var oParent;
	var iCnt = 0;
	if(sCoord=="x")
	{
		iOffset = oElem.offsetLeft;
		oParent = oElem.offsetParent;
		do
		{
			iCurOffset = oParent.offsetLeft;
			if(iCurOffset!=null)
			{
				iCurOffset = parseInt(iCurOffset,10);
				if(!isNaN(iCurOffset))	iOffset += iCurOffset;
			}
			iCnt++;
		}
		while(oParent = oParent.offsetParent && iCnt<1000)
	}
	else
	{
		iOffset = oElem.offsetTop;
		oParent = oElem.offsetParent;
		do
		{
			iCurOffset = oParent.offsetTop;
			if(iCurOffset!=null)
			{
				iCurOffset = parseInt(iCurOffset,10);
				if(!isNaN(iCurOffset))	iOffset += iCurOffset;
			}
			iCnt++;
		}
		while(oParent = oParent.offsetParent && iCnt<1000)
	}
	return iOffset;
}

// GetElementByAttribute
function GetElementsByAttribute(aElements, sAttribute, sValue)
{
	if(aElements==null || sAttribute==null) return null;
	var sAttrValue = "";
	var aResult = new Array();
	for(var i=0; i<aElements.length; i++)
	{
		sAttrValue = aElements[i].getAttribute(sAttribute);
		if(sAttrValue==null) continue;
		if(sValue==null)
		{
			aResult.push(aElements[i]);
			continue;
		}
		else
		{
			if(sAttrValue==sValue) aResult.push(aElements[i]);
		}
	}
	return aResult;
}

// GetElementsByClassName
function GetElementsByClassName(aElements, sClassName)
{
	if(aElements==null || sClassName==null) return null;
	var aSelected = new Array();
	for(var i=0; i<aElements.length; i++)
	{
		if(aElements[i].className==sClassName) aSelected.push(aElements[i])
	}
	return aSelected.length>0 ? aSelected : null;
}


function PreventEvent(e)
{
	var oEvent = e || window.event;
	if (oEvent.preventDefault)
	{
		oEvent.preventDefault();
	}
	else
	{
		if(oEvent.cancelBubble)
		{
			oEvent.cancelBubble = true;
		}
		else
		{
			if (oEvent.stopPropagation)
			{
				oEvent.stopPropagation();
			}
			else
			{
				oEvent.returnValue = false;
			}
		}
	}
	return false;
}

function GetElementSize(oElem)
{
	if(oElem==null) return null;
	var iW = 0;
	var iH = 0;
	if(oElem.offsetWidth)
	{
		iW = oElem.offsetWidth;
		iH = oElem.offsetHeight;
	}
	else
	{
		if(oElem.currentStyle)
		{
		// in IE
			iW = oElem.clientWidth - parseInt(oElem.currentStyle["paddingLeft"],10) - parseInt(oElem.currentStyle["paddingRight"],10);
			iH = oElem.clientHeight - parseInt(oElem.currentStyle["paddingTop"],10) - parseInt(oElem.currentStyle["paddingBottom"],10);
			// for IE5: var y = x.offsetWidth;
		}
		else
		{
			if (window.getComputedStyle)
			{
			// in Gecko
				//var iW = oElem.offsetWidth;
				iW = document.defaultView.getComputedStyle(oElem,null).getPropertyValue("width");
				//iH = document.defaultView.getComputedStyle(oElem,null).getPropertyValue("height");
				iH = oElem.offsetHeight;
			}
		}
	}
	this.w = iW;
	this.h = iH;
	return this;
}

function GetElementWidth(oElem)
{
	if(oElem.currentStyle)
		// in IE
		var iW = oElem.clientWidth - parseInt(oElem.currentStyle["paddingLeft"]) - parseInt(oElem.currentStyle["paddingRight"]);
		// for IE5: var y = x.offsetWidth;
	else if (window.getComputedStyle)
		// in Gecko
		//var iW = oElem.offsetWidth;
		var iW = document.defaultView.getComputedStyle(oElem,null).getPropertyValue("width");
	return iW || 0;
}

function GetElementHeight(oElem) {
	if (oElem.currentStyle)
		// in IE
		var iH = oElem.clientHeight - parseInt(oElem.currentStyle["paddingTop"]) - parseInt(oElem.currentStyle["paddingBottom"]);
		// for IE5: var y = x.offsetWidth;
	else if (window.getComputedStyle)
		// in Gecko
		var iH = oElem.offsetHeight;
		//var iH = document.defaultView.getComputedStyle(oElem,null).getPropertyValue("height");
	return iH || 0;
}
