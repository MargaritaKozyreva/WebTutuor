

var g_isMSIE = false;
var g_isFireFox = false;
var g_isOpera = false;
var g_sMSXMLProgID;
var g_sMSXMLHTTPProgID;
var g_nFirst = 1;
XMLHTTP_Last_Status = '';

CheckBrowserType();


if(g_isFireFox) 
{
	UpdateFireFoxDOM();
} 
else 
{
	if(g_isMSIE) {
		DetermineMSXMLProgID();
		DetermineMSXMLHTTPProgID();
	}
}


function XMLHTTP_Load(sURL, sSend)
{
	try
	{
		var oXmlHttp = CreateXMLHTTP();
		
		oXmlHttp.open("POST", sURL, false);
		oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		oXmlHttp.send(sSend);

        XMLHTTP_Last_Status = oXmlHttp.status;
		if (XMLHTTP_Last_Status != 200)
		{
			throw XMLHTTP_Last_Status;
		}
		return oXmlHttp.responseText;
	}
	catch (e)
	{
		return false;
	}
	return true;
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

	if (sUserAgent.indexOf("msie") != -1)
		g_isMSIE = true;
	else if (sUserAgent.indexOf("gecko") != -1)
		g_isFireFox = true;
	if (sUserAgent.indexOf("opera") != -1)
	{
		g_isOpera = true;
		g_isFireFox = true;
	}
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
					if (!xNode)
						xNode = this;

					var oNSResolver = this.createNSResolver(this.documentElement)
					var aItems = this.evaluate(cXPathString, xNode, oNSResolver,
						XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
					var aResult = [];
					for (var i = 0; i < aItems.snapshotLength; i++)
						aResult[i] = aItems.snapshotItem(i);

					return aResult;
			}

		Element.prototype.selectNodes =
			function (cXPathString)
			{
				if (this.ownerDocument.selectNodes)
					return this.ownerDocument.selectNodes(cXPathString, this);
				else
					throw "For XML Elements Only";
			}
	}

	// selectSingleNode
	if (document.implementation.hasFeature("XPath", "3.0"))
	{
		// prototyping the XMLDocument
		XMLDocument.prototype.selectSingleNode =
			function (cXPathString, xNode)
			{
				if (!xNode)
					xNode = this;

				var xItems = this.selectNodes(cXPathString, xNode);
				if (xItems.length > 0)
					return xItems[0];
				else
					return null;
			}

		// prototyping the Element
		Element.prototype.selectSingleNode =
			function (cXPathString)
			{
				if (this.ownerDocument.selectSingleNode)
					return this.ownerDocument.selectSingleNode(cXPathString, this);
				else
					throw "For XML Elements Only";
			}
	}

	// loadXML
	Document.prototype.loadXML =
	function (sXML) 
	{ 
	  var objDOMParser = new DOMParser(); 
	  var objDoc = objDOMParser.parseFromString(sXML, "text/xml"); 
	  while (this.hasChildNodes()) 
		   this.removeChild(this.lastChild); 
	  for (var i=0; i < objDoc.childNodes.length; i++) 
	  { 
		   var objImportedNode = this.importNode(objDoc.childNodes[i], true); 
		   this.appendChild(objImportedNode); 
	  }
	  return true;
	} 
	if(typeof HTMLElement!="undefined" && ! HTMLElement.prototype.insertAdjacentElement)
	{ 
            HTMLElement.prototype.insertAdjacentElement = function (where,parsedNode) 
            { 
                switch (where){ 
                        case 'beforeBegin': 
                                this.parentNode.insertBefore(parsedNode,this) 
                                break; 
                        case 'afterBegin': 
                                this.insertBefore(parsedNode,this.firstChild); 
                                break; 
                        case 'beforeEnd': 
                                this.appendChild(parsedNode); 
                                break; 
                        case 'afterEnd': 
                                if (this.nextSibling) 
                                        this.parentNode.insertBefore(parsedNode,this.nextSibling); 
                                else
                                        this.parentNode.appendChild(parsedNode); 
                        break; 
                }
                return parsedNode;
            } 
	
            HTMLElement.prototype.insertAdjacentHTML = function (where,htmlStr) 
            { 
                var r = this.ownerDocument.createRange(); 
                r.setStartBefore(this); 
                var parsedHTML = r.createContextualFragment(htmlStr); 
				return this.insertAdjacentElement(where,parsedHTML);
            } 
            
            
            HTMLElement.prototype.insertAdjacentText = function (where,txtStr) 
            { 
                var parsedText = document.createTextNode(txtStr);
                return this.insertAdjacentElement(where,parsedText);
            }
	}
	/*Object.prototype.attachEvent = function (sEvent, fnHandler, bUseCapture)
        {
			debuger;
            this.addEventListener(sEvent.indexOf('on') == 0 ? sEvent.replace('on', '') : sEvent, fnHandler, bUseCapture);
        }*/

	/*// load
	Document.prototype.load =
	function (sURL)
	{
		alert("prototype.load");
		var oXmlHttp = CreateXMLHTTP();
		oXmlHttp.open("GET", sURL, false);
		oXmlHttp.send(sSend);
		alert(oXmlHttp.status);
		if (oXmlHttp.status == 200)
		{
			var sResponse = oXmlHttp.responseText;
			this.loadXML(sXML);
			return true;
		}
		return false;
	}*/

	// xml
	//Node.prototype.__defineGetter__("xml", _Node_getXML);
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
				sText += oText.nodeValue;

			oText = oText.nextSibling;
		}

		return sText;
	});

	/*function _Node_getXML()
	{
    var objXMLSerializer = new XMLSerializer;
    var strXML = objXMLSerializer.serializeToString(this);
    return strXML;
	}*/

	/*Node.prototype.__defineGetter__("xml",
		function _Node_getXML()
		{
			var objXMLSerializer = new XMLSerializer;
			var strXML = objXMLSerializer.serializeToString(this);
			return strXML;
		});*/

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
		if (typeof(oDoc) != "undefined")
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

// Node creator
function AppendNode(doc,root,child,text,cdata,ats) {
	if(cdata!=null && cdata!='') {
		var tNode = doc.createCDATASection(cdata);
	} else {
		if(text!=null && text!='') {
			var tNode = doc.createTextNode(text);
		}
	}
	var aNode = doc.createElement(child);
	if(ats!=null) {
		for(var i=0;i<ats.length;i++) {
			aNode.setAttribute(ats[i].name,ats[i].value);
		}
	}
	if(tNode!=null) {
		aNode.appendChild(tNode);
	}
	root.appendChild(aNode);
	return aNode;
}

// String trimmer
function trim(tString,start,end,doubleSpc,crlf) {
	if(start==null && end==null && doubleSpc==null && crlf==null)
	{
		var start = true;
		var end = true;
		var doubleSpc = true;
		var crlf = true;
	}
	if (typeof tString != "string") return tString; 
	var retValue = tString;
	var ch;
	if(start) {
		var ch = retValue.substring(0, 1);
		while (ch==" " || ch=="\n" || ch=="\r" || ch=="\t") { 
			retValue = retValue.substring(1, retValue.length);
			ch = retValue.substring(0, 1);
		}
	}
	if(end) {
   		ch = retValue.substring(retValue.length-1, retValue.length);
		while (ch==" " || ch=="\n" || ch=="\r" || ch=="\t") { 
			retValue = retValue.substring(0, retValue.length-1);
			ch = retValue.substring(retValue.length-1, retValue.length);
		}
	}
	if(crlf) {
		while (retValue.indexOf("\n") != -1) { 
			retValue = retValue.substring(0, retValue.indexOf("\n")) +" "+ retValue.substring(retValue.indexOf("\n")+1, retValue.length); 
		}
		while (retValue.indexOf("\r") != -1) { 
			retValue = retValue.substring(0, retValue.indexOf("\r")) + retValue.substring(retValue.indexOf("\r")+1, retValue.length); 
		}
		while (retValue.indexOf("\t") != -1) { 
			retValue = retValue.substring(0, retValue.indexOf("\t")) + retValue.substring(retValue.indexOf("\t")+1, retValue.length); 
		}
	}
	if(doubleSpc) {
		while (retValue.indexOf("  ") != -1) { 
			retValue = retValue.substring(0, retValue.indexOf("  ")) + retValue.substring(retValue.indexOf("  ")+1, retValue.length); 
		}
	}
	return retValue; 
} 

