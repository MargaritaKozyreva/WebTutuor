var g_oBody;
var g_oMain;
var g_oPivot;
var g_oFakeHeader;
var g_oWait;
var g_sFile = "report_c.xml";
var g_sTemplate = "wsgrid.xsl";
var g_sPivotTemplate = "wspivot.xsl";
var g_wsdistinct = "wsdistinct.xsl";
var g_wsselect = "wsselect.xsl";
var g_wsemptygrid = "wsemptygrid.xml";
			
var g_oSelectedElem;
var g_iRowsAdded = 0;
var g_bAllSelected = false;
var g_bMinSelected = false;
var g_sColHeader = "";
var g_sData = "";
var g_aRowHeaders = new Array();

var g_oGridXML;
var g_oGridXSL;
var g_oXSLDistinct;
var g_oEmptyGrid;
var g_oXSLSelect;
var g_oPivotTemplate;

var g_oSortElem;


var g_sTableID = "wsgr_table";
var g_aResizableTables = new Array();
var g_sSortId = "";
var g_sSortOrder = "";
var g_sColumnWidths = "";
var g_sPageEnable = "0";
var g_iPageStart = 1;
var g_iPageSize = 50;
var g_sSortScope = "all";
var g_sFilterEnable = "1";
var g_sFilterValues = "";
var g_sFilterStrings = "";
var g_iAggColumn = 0;
var g_iTotalRecords = 0;

var g_iTimer = 0;


var g_aParams = new Array();
	g_aParams[0] = new Object();	g_aParams[0].name = "sort.id";			g_aParams[0].value = "";
	g_aParams[1] = new Object();	g_aParams[1].name = "sort.or";			g_aParams[1].value = "";
	g_aParams[2] = new Object();	g_aParams[2].name = "column.widths";	g_aParams[2].value = g_sColumnWidths;
	g_aParams[3] = new Object();	g_aParams[3].name = "table.id";			g_aParams[3].value = g_sTableID;
	g_aParams[4] = new Object();	g_aParams[4].name = "page.start";		g_aParams[4].value = g_iPageStart;
	g_aParams[5] = new Object();	g_aParams[5].name = "page.size";		g_aParams[5].value = g_iPageSize;
	g_aParams[6] = new Object();	g_aParams[6].name = "sort.scope";		g_aParams[6].value = g_sSortScope;
	g_aParams[7] = new Object();	g_aParams[7].name = "page.enable";		g_aParams[7].value = g_sPageEnable;
	g_aParams[8] = new Object();	g_aParams[8].name = "filter.enable";	g_aParams[8].value = g_sFilterEnable;
	g_aParams[9] = new Object();	g_aParams[9].name = "filter.values";	g_aParams[9].value = g_sFilterValues;
	g_aParams[10] = new Object();	g_aParams[10].name = "filter.strings";	g_aParams[10].value = g_sFilterStrings;
	g_aParams[11] = new Object();	g_aParams[11].name = "agg.column";		g_aParams[11].value = g_iAggColumn;


// WSGR_ToggleAggregation
function WSGR_ToggleAggregation(oElem)
{
	var oTR = oElem.parentNode;
	var bDisplay = (oElem.innerHTML=="+");
	oTR = oTR.nextSibling;
	while(oTR!=null)
	{
		oTR.style.display = bDisplay? "block" : "none";
		oTR = oTR.nextSibling;
		if(oTR==null || oTR.getAttribute("group")!=null) break;
	}
	oElem.innerHTML = bDisplay ? "-" : "+";
	return true;
}


// WSGR_Start
function WSGR_Start()
{
	WSGR_Initialize();
	g_iTimer = setTimeout("WSGR_Start_Stage2()", 25);
	return true;
}

// WSGR_Start_Stage2
function WSGR_Start_Stage2()
{
	if(!WSGR_LoadFiles()) return false;
	WSGR_RefreshParams();
	WSGR_Start_Stage3();
	return true;
}

// WSGR_Start_Stage3
function WSGR_Start_Stage3()
{
    var sGridHTML = XSLApplyWithParam(g_oGridXML, g_oGridXSL, g_aParams);
	g_oMain.innerHTML = sGridHTML;
	g_iTotalRecords = parseInt(document.getElementById("WSGR_TotalCount").innerHTML,10);
	document.getElementById("wsgr_total").innerHTML = g_iTotalRecords.toString();
	g_iTimer = setTimeout("WSGR_Start_Stage4()", 25);
	return true;
}

// WSGR_Start_Stage4
function WSGR_Start_Stage4()
{
	document.getElementById("wsgr_start").innerHTML = g_iPageStart;
	document.getElementById("wsgr_end").innerHTML = g_iPageStart + g_iPageSize - 1;
	WSGR_InitResizableColumns();
//	WSGR_CreateFakeHeader();
	WSGR_CreateFilters();
//	WSGR_FillSelectors();
	WSGR_ListColumnsOnPivotSelector();
	WSGR_DisplayWaitMessage(false);
	return true;
}

// WSGR_Page
function WSGR_Page(sDir)
{
	WSGR_DisplayWaitMessage(true);
	if(sDir=="prev")
	{
		g_iPageStart = g_iPageStart - g_iPageSize;
		if(g_iPageStart<=0) g_iPageStart = 1;
	}
	else
	{
		g_iPageStart = g_iPageStart + g_iPageSize;
		if(g_iPageStart>=g_iTotalRecords) g_iPageStart = g_iTotalRecords-1;
	}
	WSGR_RefreshParams();
	WSGR_Start_Stage3();
}


// WSGR_DisplayWaitMessage
function WSGR_DisplayWaitMessage(bDisplay)
{
	g_oWait.style.display = bDisplay ? "inline" : "none";
}

function WSGR_RefreshParams()
{
	g_aParams[0].value = g_sSortId;
	g_aParams[1].value = g_sSortOrder;
	g_aParams[2].value = g_sColumnWidths;
	g_aParams[3].value = g_sTableID;
	g_aParams[4].value = g_iPageStart;
	g_aParams[5].value = g_iPageSize;
	g_aParams[6].value = g_sSortScope;
	g_aParams[7].value = g_sPageEnable;
	g_aParams[8].value = g_sFilterEnable;
	g_aParams[9].value = g_sFilterValues;
	g_aParams[10].value = g_sFilterStrings;
	g_aParams[11].value = g_iAggColumn;
}


// WSGR_CreateFakeHeader
function WSGR_CreateFakeHeader()
{
	var aTables = g_oMain.getElementsByTagName("table");
	var aGrids = GetElementsByAttribute(aTables, "grid");
	var oTable = aGrids[0];
	var oRow = oTable.rows[0];

	var oNewTable = document.createElement("table");
	//oNewTable.className = oTable.className;
	var oNewRow = oRow.cloneNode(true);
	oNewTable.appendChild(oNewRow);

	g_oFakeHeader.innerHTML = "";
	g_oFakeHeader.appendChild(oNewTable);
	oNewTable.style.top = "0px";
	g_oFakeHeader.style.height = oRow.offsetHeight + "px";
	g_oMain.style.marginTop = -1*oRow.offsetHeight + "px";
	return true;
}

// WSGR_FillSelectors
function WSGR_FillSelectors()
{
	// PivotSelectors
	var oContainer = document.getElementById("wsgr_selectors_container");
	var aSelectors = oContainer.getElementsByTagName("select");
	var aHeaders = g_oGridXML.selectNodes("//report_result/header/columns/column/column_value");
	var oOption;
	var iIdx = 0;
	for(var i=0; i<aSelectors.length; i++)
	{
		iIdx = 0;
		for(var j=0; j<aHeaders.length; j++)
		{
			oOption = document.createElement("option");
			aSelectors[i].appendChild(oOption);
			oOption.value = iIdx.toString();
			oOption.text = aHeaders[j].text;
			iIdx++;
		}
	}
	return true;
}

// WSGR_BuildPivot
function WSGR_BuildPivot()
{
	WSGR_CloseSelector();
	WSGR_DisplayWaitMessage(true);
	g_iTimer = setTimeout("WSGR_BuildPivotStage2()", 25);
	return true;
}

// WSGR_BuildPivot
function WSGR_BuildPivotStage2()
{
	var iCol = parseInt(g_sColHeader,10)-1;
	var iRow1 = parseInt(g_aRowHeaders[0],10)-1;
	var iData = parseInt(g_sData,10)-1;
	var iRow2 = (g_aRowHeaders[1]!=null && g_aRowHeaders[1]!="") ? parseInt(g_aRowHeaders[1],10)-1 : null;
	var oDoc = WSGR_CreatePivotXML(iRow1, iCol, iData, iRow2);
	var g_sFilterEnable = "0";
	WSGR_RefreshParams();
    var sGridHTML = XSLApplyWithParam(oDoc, g_oPivotTemplate, g_aParams);
	g_oPivot.innerHTML = sGridHTML;
	WSGR_DisplayWaitMessage(false);
	return true;
}

// WSGR_ListColumnsOnPivotSelector
function WSGR_ListColumnsOnPivotSelector()
{
	var aHeaders = g_oGridXML.selectNodes("//report_result/header/columns/column/column_value");
	var iIdx = 0;
	for(var i=0; i<aHeaders.length; i++)
	{
		iIdx++;
		WSGR_AddColumnToPivotSelector(iIdx, aHeaders[i].text);
	}
	return true;

}

// WSGR_AddColumnToPivotSelector
function WSGR_AddColumnToPivotSelector(iColumn, sText)
{
	var oTable = document.getElementById("WSGR_pivot_selector_innertable");
	var aTBody = oTable.getElementsByTagName("tbody");
	if(aTBody.length>0) oTable = aTBody[0];
	var oTR = document.createElement("tr");
	var oTD = document.createElement("td");
	oTD.className = "wsgr_pivot_selector_item";
	oTD.innerHTML = sText;
	oTD.setAttribute("column", iColumn.toString());
	oTD.onmouseover = function ()
	{
		WSGR_Over(this);
		return false;
	}
	oTD.onmouseout = function ()
	{
		WSGR_Out(this);
		return false;
	}
	oTD.onclick = function ()
	{
		WSGR_Click(this);
		return false;
	}
	oTR.appendChild(oTD);
	oTable.appendChild(oTR);
	return true;
}

// WSGR_CloseSelector
function WSGR_CloseSelector()
{
	document.getElementById("WSGR_pivot_selector").style.display = "none";
	return false;
}

// WSGR_Over
function WSGR_Over(oElem)
{
	if(oElem.className!="wsgr_pivot_selector_item_selected" && oElem.className!="wsgr_pivot_selector_item_disabled" && !g_bAllSelected) oElem.className = "wsgr_pivot_selector_item_over";
	return false;
}
// WSGR_Out
function WSGR_Out(oElem)
{
	if(oElem.className!="wsgr_pivot_selector_item_selected" && oElem.className!="wsgr_pivot_selector_item_disabled") oElem.className = "wsgr_pivot_selector_item";
	return false;
}
// WSGR_Click
function WSGR_Click(oElem)
{
	if(oElem.className!="wsgr_pivot_selector_item_selected" && oElem.className!="wsgr_pivot_selector_item_disabled" && !g_bAllSelected)
	{
		oElem.className = "wsgr_pivot_selector_item";
	}
	else return false;
	WSGR_SelectItem(oElem);
	WSGR_DisplaySelector(oElem);
	return false;
}

// WSGR_SelectItem
function WSGR_SelectItem(oElem)
{
	var oTable = document.getElementById("WSGR_pivot_selector_innertable");
	var aTDs = oTable.getElementsByTagName("td");
	for(var i=0; i<aTDs.length; i++)
	{
		if(aTDs[i].className=="wsgr_pivot_selector_item_disabled") continue;
		aTDs[i].className = (oElem==aTDs[i]) ? "wsgr_pivot_selector_item_selected" : "wsgr_pivot_selector_item";
	}
	return true;
}

// WSGR_DisplaySelector
function WSGR_DisplaySelector(oElem)
{
	g_oSelectedElem = oElem;
	var iX = GetElementOffset(oElem, "x");
	var iY = GetElementOffset(oElem, "y");
	var iW = GetElementSize(oElem).w;
	iX += iW;
	iY -= 1;
	var oSelector = document.getElementById("WSGR_selector");
	oSelector.style.display = "block";
	oSelector.style.top = iY.toString() + "px";
	oSelector.style.left = iX.toString() + "px";

}

// WSGR_DisplayPivotSelector
function WSGR_DisplayPivotSelector()
{
	var oSelector = document.getElementById("WSGR_pivot_selector");
	oSelector.style.display = "block";
}

// WSGR_HideSelector
function WSGR_HideSelector(oElem)
{
	g_oSelectedElem = null;
	var oSelector = document.getElementById("WSGR_selector");
	oSelector.style.display = "none";
}

// WSGR_SelectOver
function WSGR_SelectOver(oElem)
{
	if(oElem.className!="wsgr_selector_disabled" && !g_bAllSelected) oElem.className = "wsgr_selector_over";
}
// WSGR_SelectOut
function WSGR_SelectOut(oElem)
{
	if(oElem.className!="wsgr_selector_disabled") oElem.className = "wsgr_selector_idle";
}

//WSGR_PlaceColumnInPivot
function WSGR_PlaceColumnInPivot(oElem)
{
	if(oElem.className=="wsgr_selector_disabled") return false;
	if(g_oSelectedElem==null) return false;
	var sColumn = g_oSelectedElem.getAttribute("column");
	switch(oElem.getAttribute("dir"))
	{
		case "cols":
			WSGR_AddColumnToMask("cols", sColumn);
			g_sColHeader = sColumn;
			WSGR_EnableAction(oElem, false);
			break;
		case "rows":
			WSGR_AddColumnToMask("rows", sColumn);
			g_aRowHeaders[g_iRowsAdded] = sColumn;
			g_iRowsAdded++;
			if(g_iRowsAdded>=2)
			{
				WSGR_EnableAction(oElem, false);
			}
			break;
		case "data":
			WSGR_AddColumnToMask("data", sColumn);
			g_sData = sColumn;
			WSGR_EnableAction(oElem, false);
			break;
	}
	g_bMinSelected = (g_sColHeader!="" && g_sData!="" && g_aRowHeaders[0]!="");
	document.getElementById("WSGR_pivot_selector_head_input").disabled = !g_bMinSelected;
	g_bAllSelected = (g_bMinSelected && g_aRowHeaders.length>1);
	WSGR_EnableItem(g_oSelectedElem, false);
	WSGR_HideSelector(g_oSelectedElem);
	return false;
}

// WSGR_ReleaseSelectors
function WSGR_ReleaseSelectors()
{
	if(g_oSelectedElem!=null)
	{
		WSGR_HideSelector(g_oSelectedElem);
		WSGR_SelectItem();
	}
}

// WSGR_EnableItem
function WSGR_EnableItem(oElem, bEnable)
{
	oElem.className = bEnable ? "wsgr_pivot_selector_item" : "wsgr_pivot_selector_item_disabled";
}
// WSGR_EnableItem
function WSGR_EnableAction(oElem, bEnable)
{
	oElem.className = bEnable ? "wsgr_selector_idle" : "wsgr_selector_disabled";
}

// WSGR_AddColumnToMask
function WSGR_AddColumnToMask(sPlace, sColumn)
{
	var oTable;
	switch(sPlace)
	{
		case "cols":
			oTable = document.getElementById("WSGR_pivot_col_table");
			break;
		case "rows":
			oTable = document.getElementById("WSGR_pivot_row_table");
			break;
		case "data":
			oTable = document.getElementById("WSGR_pivot_data_table");
			break;
	}
	var aTBody = oTable.getElementsByTagName("tbody");
	if(aTBody.length>0) oTable = aTBody[0];
	var oTR = document.createElement("tr");
	var oTD = document.createElement("td");
	oTD.className = "wsgr_pivot_selector_item";
	oTD.setAttribute("column", sColumn);
	oTD.setAttribute("area", sPlace);
	oTD.onclick = function ()
	{
		WSGR_RemoveColumnFromMask(this);
		return false;
	}
	oTD.innerHTML = g_oSelectedElem.innerHTML;
	oTR.appendChild(oTD);
	oTable.appendChild(oTR);
}

// WSGR_RemoveColumnFromMask
function WSGR_RemoveColumnFromMask(oElem)
{
	var sColumn = oElem.getAttribute("column");
	switch(oElem.getAttribute("area"))
	{
		case "cols":
			g_sColHeader = "";
			WSGR_EnableAction(document.getElementById("WSGR_to_columns"), true);
			break;
		case "data":
			g_sData = "";
			WSGR_EnableAction(document.getElementById("WSGR_to_data"), true);
			break;
		case "rows":
			WSGR_EnableAction(document.getElementById("WSGR_to_rows"), true);
			for(var i=0; i<g_aRowHeaders.length; i++)
			{
				if(g_aRowHeaders[i]==sColumn)
				{
					if(i==0)
					{
						g_aRowHeaders.shift();
					}
					else
					{
						g_aRowHeaders.pop();
					}
					break;
				}
			}
			break;
	}
	var oTR = oElem.parentNode;
	var oTable = oTR.parentNode;
	oTable.removeChild(oTR);
	oTR = null;
	g_bMinSelected = (g_sColHeader!="" && g_sData!="" && g_aRowHeaders[0]!="");
	document.getElementById("WSGR_pivot_selector_head_input").disabled = !g_bMinSelected;
	g_bAllSelected = (g_bMinSelected && g_aRowHeaders.length>1);
	var aTDs = document.getElementById("WSGR_pivot_selector_innertable").getElementsByTagName("td");
	var aItems = GetElementsByAttribute(aTDs, "column", sColumn);
	var oItem = aItems[0];
	WSGR_EnableItem(oItem, true);
	return true;
}

// WSGR_ToggleFilters
function WSGR_ToggleFilters()
{
	if(g_bFiltersGenerated)
	{
		var oFiltersRow = document.getElementById("wsgr_filters_row");
		if(oFiltersRow!=null)
		{
			oFiltersRow.style.display = oFiltersRow.style.display=="none" ? "inline" : "none";
			return true;
		}
	}
	WSGR_DisplayWaitMessage(true);
	g_iTimer = setTimeout("WSGR_ToggleFilters_Stage2()", 25);
}

// WSGR_ToggleFilters
function WSGR_ToggleFilters_Stage2()
{
	g_sFilterEnable = "0";
	if(g_bFiltersGenerated)
	{
		var oFiltersRow = document.getElementById("wsgr_filters_row");
		if(oFiltersRow!=null)
		{
			oFiltersRow.style.display = "inline";
			return true;
		}
	}
	g_bFiltersGenerated = true;
	WSGR_DisplayWaitMessage(false);
	return true;
}



// WSGR_CreateFilters
function WSGR_CreateFilters()
{
	return true;
	var aHeaders = g_oGridXML.selectNodes("report_result/header/columns/column");
	var oSelect;
	var oOption;
	var oTD;
	var oDoc;
	var oSelect;
	var oOption;
	var iIdx = 0;
	for(var i=0; i<aHeaders.length; i++)
	{

/*		var aTextNodes = g_oGridXML.selectNodes("report_result/rows/row/columns/column["+i.toString()+"]/column_value/text()");
		var aTexts = new Array();
		var aSorted = new Array();
		for(var j=0; j<aTextNodes.length; j++)
		{
			aTexts.push(aTextNodes[j].nodeValue);
		}
		aSorted = aTexts.sort();
		aDistinct = new Array();
		oSelect = document.createElement("select");
		oSelect.onchange = function ()
		{
			WSGR_FilterApply(this);
		}
		for(var j=0; j<aSorted.length; j++)
		{
			if(j==0) {
				oOption = document.createElement("option");
				oOption.value = aSorted[j];
				oOption.text = aSorted[j];
				oSelect.appendChild(oOption);
				continue;
			}
			if(aSorted[j]==aSorted[j-1]) continue;
			oOption = document.createElement("option");
			oOption.value = aSorted[j];
			oOption.text = aSorted[j];
			oSelect.appendChild(oOption);
		}
		iIdx = i + 1;
		oTD = document.getElementById("WSGR_select_td_" + iIdx.toString());
		oTD.appendChild(oSelect);*/

		oTD = document.getElementById("WSGR_select_td_" + i.toString());
		if(oTD==null) continue;
		oTD.innerHTML = WSGR_BuildSelector(i);

	}
	return true;
}

// WSGR_BuildSelector
function WSGR_BuildSelector(iColumn)
{
	var aParams = new Array();
		aParams[0] = new Object(); 	aParams[0].name = "agg.column"; 	aParams[0].value = parseInt(iColumn, 10);
//		aParams[1] = new Object(); 	aParams[1].name = "sort.order"; 	aParams[1].value = (sSortOrder!=null) ? sSortOrder : "ascending";
	var sDistincts = XSLApplyWithParam(g_oGridXML, g_oXSLSelect, aParams);
	return sDistincts;
}

// WSGR_Pivot
function WSGR_Pivot(oElem)
{
	var oLeft = document.getElementById("wsgr_select_left");
	var oLeft2 = document.getElementById("wsgr_select_left2");
	var oTop = document.getElementById("wsgr_select_top");
	var oData = document.getElementById("wsgr_select_data");
	var sLeft = oLeft.value;
	var sLeft2 = oLeft2.value;
	var sTop = oTop.value;
	var sData = oData.value;
	if(sLeft=="" || sTop=="" || sData=="") return false;
	var oDoc = WSGR_CreatePivotXML(sLeft, sTop, sData, sLeft2);
	var g_sFilterEnable = "0";
	var g_iAggColumn = 1;
	WSGR_RefreshParams();
    var sGridHTML = XSLApplyWithParam(oDoc, g_oPivotTemplate, g_aParams);
	g_oPivot.innerHTML = sGridHTML;

	return true;
}

// WSGR_CreatePivotXML
function WSGR_CreatePivotXML(sLeft, sTop, sData, sLeft2)
{
	if(sLeft2==null)
	{
		var aDistinctRowHeaders = GetDistinctValues(g_oGridXML, parseInt(sLeft,10)+1);
		var aDistinctColumnHeaders = GetDistinctValues(g_oGridXML, parseInt(sTop,10)+1);
		var oDoc = CreateDOMDocument();
		oDoc.loadXML(g_oEmptyGrid.xml);
		var oGridRowColumn = g_oGridXML.selectSingleNode("//report_result/header/columns/column[" + sLeft + "]");
		var oGridColColumn = g_oGridXML.selectSingleNode("//report_result/header/columns/column[" + sTop + "]");
		var oGridDataColumn = g_oGridXML.selectSingleNode("//report_result/header/columns/column[" + sData + "]");
		var oRoot = oDoc.selectSingleNode("//report_result");
		var oHead = oRoot.selectSingleNode("header/columns");
		var oColumn = AppendNode(oDoc, oHead, "column");
		AppendNode(oDoc, oColumn, "column_name", oGridRowColumn.selectSingleNode("column_name")!=null ? oGridRowColumn.selectSingleNode("column_name").text : "");
		AppendNode(oDoc, oColumn, "column_value", oGridRowColumn.selectSingleNode("column_value")!=null ? oGridRowColumn.selectSingleNode("column_value").text : "");
		AppendNode(oDoc, oColumn, "sort", oGridRowColumn.selectSingleNode("sort")!=null ? oGridRowColumn.selectSingleNode("sort").text : "text");
		AppendNode(oDoc, oColumn, "resize", oGridRowColumn.selectSingleNode("resize")!=null ? oGridRowColumn.selectSingleNode("resize").text : "0");
		AppendNode(oDoc, oColumn, "group", oGridRowColumn.selectSingleNode("group")!=null ? oGridRowColumn.selectSingleNode("group").text : "list");

		for(var i=0; i<aDistinctColumnHeaders.length; i++)
		{
			oColumn = AppendNode(oDoc, oHead, "column");
			AppendNode(oDoc, oColumn, "column_name", oGridColColumn.selectSingleNode("column_name")!=null ? oGridColColumn.selectSingleNode("column_name").text : "");
			AppendNode(oDoc, oColumn, "column_value", aDistinctColumnHeaders[i]);
			AppendNode(oDoc, oColumn, "sort", oGridColColumn.selectSingleNode("sort")!=null ? oGridColColumn.selectSingleNode("sort").text : "text");
			AppendNode(oDoc, oColumn, "resize", oGridColColumn.selectSingleNode("resize")!=null ? oGridColColumn.selectSingleNode("resize").text : "0");
			AppendNode(oDoc, oColumn, "group", oGridColColumn.selectSingleNode("group")!=null ? oGridColColumn.selectSingleNode("group").text : "list");
		}

		var oRows = oRoot.selectSingleNode("rows");
		var oRow;
		var oCell;
		var oGrouping = oGridDataColumn.selectSingleNode("group");
		var sGrouping = (oGrouping==null) ? "list" : oGrouping.text;
		for(var i=0; i<aDistinctRowHeaders.length; i++)
		{
			oRow = AppendNode(oDoc, oRows, "row");
			oRow = AppendNode(oDoc, oRow, "columns");
			oCell = AppendNode(oDoc, oRow, "column");
			AppendNode(oDoc, oCell, "column_name", "");
			AppendNode(oDoc, oCell, "column_value", aDistinctRowHeaders[i]);
			var sText = "";
			for(var j=0; j<aDistinctColumnHeaders.length; j++)
			{
				sText = GetPivotCellData(sLeft, aDistinctRowHeaders[i], sTop, aDistinctColumnHeaders[j], sData, sGrouping);
				oCell = AppendNode(oDoc, oRow, "column");
				AppendNode(oDoc, oCell, "column_name");
				AppendNode(oDoc, oCell, "column_value", "" , sText);
			}
		}
	}
	else
	{

		var aDistinctRowHeaders = GetDistinctValues(g_oGridXML, parseInt(sLeft,10)+1);
		var aDistinctColumnHeaders = GetDistinctValues(g_oGridXML, parseInt(sTop,10)+1);
		var oDoc = CreateDOMDocument();
		oDoc.loadXML(g_oEmptyGrid.xml);
		var oGridColColumn = g_oGridXML.selectSingleNode("//report_result/header/columns/column[" + sTop + "]");
		var oGridDataColumn = g_oGridXML.selectSingleNode("//report_result/header/columns/column[" + sData + "]");
		var oRoot = oDoc.selectSingleNode("//report_result");
		var oHead = oRoot.selectSingleNode("header/columns");

		var oGridRowColumn = g_oGridXML.selectSingleNode("//report_result/header/columns/column[" + sLeft + "]");
		var oColumn = AppendNode(oDoc, oHead, "column");
		AppendNode(oDoc, oColumn, "column_name", oGridRowColumn.selectSingleNode("column_name")!=null ? oGridRowColumn.selectSingleNode("column_name").text : "");
		AppendNode(oDoc, oColumn, "column_value", oGridRowColumn.selectSingleNode("column_value")!=null ? oGridRowColumn.selectSingleNode("column_value").text : "");
		AppendNode(oDoc, oColumn, "sort", oGridRowColumn.selectSingleNode("sort")!=null ? oGridRowColumn.selectSingleNode("sort").text : "text");
		AppendNode(oDoc, oColumn, "resize", oGridRowColumn.selectSingleNode("resize")!=null ? oGridRowColumn.selectSingleNode("resize").text : "0");
		AppendNode(oDoc, oColumn, "group", oGridRowColumn.selectSingleNode("group")!=null ? oGridRowColumn.selectSingleNode("group").text : "list");

		oGridRowColumn = g_oGridXML.selectSingleNode("//report_result/header/columns/column[" + sLeft2 + "]");
		oColumn = AppendNode(oDoc, oHead, "column");
		AppendNode(oDoc, oColumn, "column_name", oGridRowColumn.selectSingleNode("column_name")!=null ? oGridRowColumn.selectSingleNode("column_name").text : "");
		AppendNode(oDoc, oColumn, "column_value", oGridRowColumn.selectSingleNode("column_value")!=null ? oGridRowColumn.selectSingleNode("column_value").text : "");
		AppendNode(oDoc, oColumn, "sort", oGridRowColumn.selectSingleNode("sort")!=null ? oGridRowColumn.selectSingleNode("sort").text : "text");
		AppendNode(oDoc, oColumn, "resize", oGridRowColumn.selectSingleNode("resize")!=null ? oGridRowColumn.selectSingleNode("resize").text : "0");
		AppendNode(oDoc, oColumn, "group", oGridRowColumn.selectSingleNode("group")!=null ? oGridRowColumn.selectSingleNode("group").text : "list");

		for(var i=0; i<aDistinctColumnHeaders.length; i++)
		{
			oColumn = AppendNode(oDoc, oHead, "column");
			AppendNode(oDoc, oColumn, "column_name", oGridColColumn.selectSingleNode("column_name")!=null ? oGridColColumn.selectSingleNode("column_name").text : "");
			AppendNode(oDoc, oColumn, "column_value", aDistinctColumnHeaders[i]);
			AppendNode(oDoc, oColumn, "sort", oGridColColumn.selectSingleNode("sort")!=null ? oGridColColumn.selectSingleNode("sort").text : "text");
			AppendNode(oDoc, oColumn, "resize", oGridColColumn.selectSingleNode("resize")!=null ? oGridColColumn.selectSingleNode("resize").text : "0");
			AppendNode(oDoc, oColumn, "group", oGridColColumn.selectSingleNode("group")!=null ? oGridColColumn.selectSingleNode("group").text : "list");
		}

		var oRows = oRoot.selectSingleNode("rows");
		var oRow;
		var oCell;
		var oGrouping = oGridDataColumn.selectSingleNode("group");
		var sGrouping = (oGrouping==null) ? "list" : oGrouping.text;
		var aDistinctRowHeadersSecond = new Array();
		var sText = "";
		for(var i=-1; i<aDistinctRowHeaders.length; i++)
		{
			aDistinctRowHeadersSecond = GetDistinctValuesStage2(g_oGridXML, sLeft, aDistinctRowHeaders[i], sLeft2);

			for(var j=0; j<aDistinctRowHeadersSecond.length; j++)
			{
				oRow = AppendNode(oDoc, oRows, "row");
				oRow = AppendNode(oDoc, oRow, "columns");
				oCell = AppendNode(oDoc, oRow, "column");
				AppendNode(oDoc, oCell, "column_name", "");
				AppendNode(oDoc, oCell, "column_value", aDistinctRowHeaders[i]);
				oCell = AppendNode(oDoc, oRow, "column");
				AppendNode(oDoc, oCell, "column_name", "");
				AppendNode(oDoc, oCell, "column_value", aDistinctRowHeadersSecond[j]);
				sText = "";
				for(var k=0; k<aDistinctColumnHeaders.length; k++)
				{
					sText = GetPivotCellDataStage2(sLeft, aDistinctRowHeaders[i], sLeft2, aDistinctRowHeadersSecond[j], sTop, aDistinctColumnHeaders[k], sData, sGrouping);
					oCell = AppendNode(oDoc, oRow, "column");
					AppendNode(oDoc, oCell, "column_name");
					AppendNode(oDoc, oCell, "column_value", "" , sText);
				}
			}

		}

	}
//	alert(oDoc.xml);
	return oDoc;
}

// GetDistinctValuesStage2
function GetDistinctValuesStage2(g_oGridXML, sColumn1, sFilterString, sColumn2)
{
	var aColumns = g_oGridXML.selectNodes("//rows/row[columns/column[" + sColumn1 + "]/column_value/text()='" + sFilterString + "']/columns/column[" + sColumn2 + "]/column_value");
	var aValues = new Array();
	for(var i=0; i<aColumns.length; i++)
	{
		if(IsMember(aValues, aColumns[i].text)) continue;
		aValues.push(aColumns[i].text);
	}
	var aDistinctValues = aValues.sort();
	return aDistinctValues;
}

// IsMember
function IsMember(aArray, vValue)
{
	for(var i=0; i<aArray.length; i++)
	{
		if(aArray[i]==vValue) return true;
	}
	return false;
}


// GetPivotCellDataStage2
function GetPivotCellDataStage2(sColumn1, sColumn1Value, sColumn2, sColumn2Value, sTopColumn, sTopColumnValue, sDataColumn, sDataGrouping)
{
	var aRows = g_oGridXML.selectNodes("//rows/row[columns/column[" + sColumn1 + "]/column_value/text()='" + sColumn1Value + "' and columns/column[" + sColumn2 + "]/column_value/text()='" + sColumn2Value + "'  and columns/column[" + sTopColumn + "]/column_value/text()='" + sTopColumnValue + "']");
	if(aRows.length==0) return "-";
	var oCell;
	var sGroup = "list";
	if(sDataGrouping!=null) sGroup = sDataGrouping;
	var aValues = new Array();
	var oValue;
	var sValue = "";
	for(var i=0; i<aRows.length; i++)
	{
		oValue = aRows[i].selectSingleNode("columns/column[" + sDataColumn + "]/column_value");
		sValue = (oValue==null) ? "" : oValue.text;
		aValues.push(sValue);
	}
	switch(sGroup)
	{
		case "list":
			for(var i=0; i<aValues.length; i++)
			{
				sText += (aValues[i]=="") ? " " : aValues[i];
				if(i<aValues.length-1) sText += "<br/>";
			}
			break;
		case "sum":
			var nValue = 0;
			var nSum = 0;
			for(var i=0; i<aValues.length; i++)
			{
				nValue = parseFloat(aValues[i]);
				if(isNaN(nValue)) continue;
				nSum += nValue;
			}
			sText = nSum.toString();
			break;
		case "avg":
			var nValue = 0;
			var nSum = 0;
			for(var i=0; i<aValues.length; i++)
			{
				nValue = parseFloat(aValues[i]);
				if(isNaN(nValue)) continue;
				nSum += nValue;
			}
			nSum = aValues.length==0 ? 0 : nSum/aValues.length;
			sText = nSum.toString();
			break;
	}
	return sText;

}


// GetPivotCellData
function GetPivotCellData(sRowCellNumber, sRowCellValue, sColCellNumber, sColCellValue, sDataCellNumber, sGrouping)
{
	var sText = "";
	var aRows = g_oGridXML.selectNodes("//report_result/rows/row[(columns/column[" + sRowCellNumber + "]/column_value/text()='" + sRowCellValue + "') and (columns/column[" + sColCellNumber + "]/column_value/text()='" + sColCellValue + "')]");
	var oCell;
	var sGroup = "sum";
	if(sGrouping!=null) sGroup = sGrouping;
	var aValues = new Array();
	var oValue;
	var sValue = "";
	for(var i=0; i<aRows.length; i++)
	{
		oValue = aRows[i].selectSingleNode("columns/column[" + sDataCellNumber + "]/column_value");
		sValue = (oValue==null) ? "" : oValue.text;
		aValues.push(sValue);
	}
	switch(sGroup)
	{
		case "list":
			for(var i=0; i<aValues.length; i++)
			{
				sText += (aValues[i]=="") ? " " : aValues[i];
				if(i<aValues.length-1) sText += "<br/>";
			}
			break;
		case "sum":
			var nValue = 0;
			var nSum = 0;
			for(var i=0; i<aValues.length; i++)
			{
				nValue = parseFloat(aValues[i]);
				if(isNaN(nValue)) continue;
				nSum += nValue;
			}
			sText = nSum.toString();
			break;
		case "avg":
			var nValue = 0;
			var nSum = 0;
			for(var i=0; i<aValues.length; i++)
			{
				nValue = parseFloat(aValues[i]);
				if(isNaN(nValue)) continue;
				nSum += nValue;
			}
			nSum = aValues.length==0 ? 0 : nSum/aValues.length;
			sText = nSum.toString();
			break;
	}
	return sText;
}


// GetDistinctValues
function GetDistinctValues(oDoc, sColumn, sSortOrder)
{
	var aParams = new Array();
		aParams[0] = new Object(); 	aParams[0].name = "agg.column"; 	aParams[0].value = parseInt(sColumn, 10);
		aParams[1] = new Object(); 	aParams[1].name = "sort.order"; 	aParams[1].value = (sSortOrder!=null) ? sSortOrder : "ascending";
	var sDistincts = XSLApplyWithParam(oDoc, g_oXSLDistinct, aParams);
	var aDistincts = sDistincts.split("~~~");
	return aDistincts;
}

// WSGR_Initialize
function WSGR_Initialize()
{
	g_oBody = document.body;
	g_oMain = document.getElementById("WSGR_main");
	g_oFakeHeader = document.getElementById("WSGR_FakeHeader");
	g_oPivot = document.getElementById("WSGR_pivot");
	g_oWait = document.getElementById("WSGR_wait");
	WSGR_DisplayWaitMessage(true);
	WSGR_AdjustWait();
	StartCheck();
	return true;
}

// WSGR_AdjustWait
function WSGR_AdjustWait()
{
	var oWindowSize = GetWindowSize();
	var iWW = oWindowSize.w;
	var iWH = oWindowSize.h;
	var oWaitSize = GetElementSize(g_oWait);
	var iEW = oWaitSize.w;
	var iEH = oWaitSize.h;
	var iLeft = Math.round((iWW - iEW)/2);
	var iTop = Math.round((iWH - iEH)/2);
	g_oWait.style.left = iLeft.toString() + "px";
	g_oWait.style.top = iTop.toString() + "px";
	return true;
}

// WSGR_InitResizableColumns
function WSGR_InitResizableColumns()
{
	var aTables = document.getElementsByTagName("table");
	var aGrids = GetElementsByAttribute(aTables, "grid");
	for(var i=0; i<aGrids.length; i++) g_aResizableTables[g_aResizableTables.length] = new WSGR_ResizableColumn(aGrids[i]);
	return true;
}

// WSGR_FilterApply
function WSGR_FilterApply(oElem)
{
	var oTR = oElem.parentNode;
	while(oTR.tagName.toUpperCase()!="TR")
	{
		oTR = oTR.parentNode;
	}
	var aSelects = oTR.getElementsByTagName("select");
	var sColumn = "";
	var sValue = "";
	var sText = "";
	g_sFilterValues = "+";
	g_sFilterStrings = "+";
	var sSeparator = "+";
	for(var i=0; i<aSelects.length; i++)
	{
		sColumn = aSelects[i].getAttribute("column");
		sValue = aSelects[i].options[aSelects[i].selectedIndex].value;
		sText = sValue=="0" ? "" : aSelects[i].options[aSelects[i].selectedIndex].text;
		g_sFilterValues += sColumn + "~" + sValue + sSeparator;
		g_sFilterStrings += sColumn + "~~~" + sText + sSeparator;
	}
	g_sFilterValues += sSeparator;
	g_sFilterStrings += sSeparator;
	WSGR_RefreshParams();
    var sGridHTML = XSLApplyWithParam(g_oGridXML, g_oGridXSL, g_aParams);
	g_oMain.innerHTML = sGridHTML;
	return true;
}


// main class prototype
function WSGR_ResizableColumn(oTable)
{
	if(oTable.tagName.toUpperCase()!="TABLE") return null;
	this.id = oTable.getAttribute("id");
	// ============================================================
	// private data
	var self = this;
	var aTDs = oTable.rows[0].cells;
	var aDraggableColumns = GetElementsByAttribute(aTDs, "resize", "1");
//	var aDraggableColumns  = oTable.rows[0].cells; // first row columns, used for changing of width
	if (aDraggableColumns==null || aDraggableColumns.length==0) return null; // return if no table exists or no one row exists

	var iDraggedColumnNumber; // current dragging column
	var iDragLastX;        // last event X mouse coordinate

	var saveOnmouseup;   // save document onmouseup event handler
	var saveOnmousemove; // save document onmousemove event handler
	var saveBodyCursor;  // save body cursor property

	// ============================================================
	// methods
	// ============================================================
	// do changes columns widths
	// returns true if success and false otherwise
	this.changeColumnWidth = function(iColumnNumber, iColumnWidth)
	{
		if (!aDraggableColumns) return false;
		if (iColumnNumber < 0) return false;
		if (aDraggableColumns.length < iColumnNumber) return false;

		if (parseInt(aDraggableColumns[iColumnNumber].style.width) <= -iColumnWidth) return false;
		if (aDraggableColumns[iColumnNumber+1] && parseInt(aDraggableColumns[iColumnNumber+1].style.width) <= iColumnWidth) return false;
		aDraggableColumns[iColumnNumber].style.width = parseInt(aDraggableColumns[iColumnNumber].style.width) + iColumnWidth + "px";
		/*if (aDraggableColumns[iColumnNumber+1] != null)
		{
			aDraggableColumns[iColumnNumber+1].style.width = parseInt(aDraggableColumns[iColumnNumber+1].style.width) - iColumnWidth + "px";
		}*/
		return true;
	}
	// ============================================================
	// do drag column width
	this.columnDrag = function(e)
	{
		var oEvent = e || window.event;
		var iX = oEvent.clientX || oEvent.pageX;
		if (!self.changeColumnWidth(iDraggedColumnNumber, iX - iDragLastX))
		{
			// stop drag!
			self.stopColumnDrag(oEvent);
		}
		iDragLastX = iX;
		// prevent other event handling
		PreventEvent(oEvent);
		return false;
	}
	// ============================================================
	// stops column dragging
	this.stopColumnDrag = function(e)
	{
		var oEvent = e || window.event;
		if (!aDraggableColumns) return null;
		// restore handlers & cursor
		document.onmouseup  = saveOnmouseup;
		document.onmousemove = saveOnmousemove;
		document.body.style.cursor = saveBodyCursor;
		// remember columns widths in cookies for server side
		var sColWidth = "";
		var sSeparator = "";
		g_sColumnWidths = "";
		var iIndex = 0;
		var iWidth = 0;
		var sWidth = "";
		for (var i=0; i<aDraggableColumns.length; i++)
		{
			iIndex++;
			iWidth = parseInt( GetElementWidth(aDraggableColumns[i]) );
			sWidth = iWidth.toString();
			sColWidth += sSeparator + sWidth;
			g_sColumnWidths += sSeparator + iIndex.toString() + "~" + sWidth;
			sSeparator = "+";
		}
		g_sColumnWidths += sSeparator;
		var dExpire = new Date();
		dExpire.setDate(dExpire.getDate() + 365); // year
		document.cookie = self.id + "-width=" + sColWidth +	"; expires=" + dExpire.toGMTString();
		PreventEvent(oEvent);
		return false;
	}
	// ============================================================
	// init data and start dragging
	this.startColumnDrag = function(e)
	{
		var oEvent = e || window.event;
		// if not left button was clicked
		if ((!g_isMSIE && oEvent.button!=0) || (g_isMSIE && oEvent.button!=1))
		{
			PreventEvent(oEvent);
			return false;
		}
		// remember dragging object
		var oEventSource = (oEvent.target || oEvent.srcElement);
		if(oEventSource==null) return false;
		var oDraggedColumn = oEventSource.parentNode;
		var iCnt = 0;
		while(oDraggedColumn.getAttribute("resize")!="1")
		{
			oDraggedColumn = oDraggedColumn.parentNode;
			iCnt++;
			if(iCnt>7) return false;
		}
		//iDraggedColumnNumber = oDraggedColumn.cellIndex;
		var sDraggedColumnNumber = oDraggedColumn.getAttribute("column");
		iDraggedColumnNumber = parseInt(sDraggedColumnNumber, 10);
		if(isNaN(iDraggedColumnNumber)) return false;
		iDraggedColumnNumber--;
		iDragLastX = oEvent.clientX || oEvent.pageX;
		// set up current columns widths in their particular attributes
		// do it in two steps to avoid jumps on page!
		var aColWidths = new Array();
		for (var i=0; i<aDraggableColumns.length; i++) aColWidths[i] = parseInt( GetElementWidth(aDraggableColumns[i]) );
		for (var i=0; i<aDraggableColumns.length; i++)
		{
			aDraggableColumns[i].width = ""; // for sure
			//aDraggableColumns[i].width = aColWidths[i].toString();
			aDraggableColumns[i].style.width = aColWidths[i] + "px";
		}
		saveOnmouseup       = document.onmouseup;
		document.onmouseup  = self.stopColumnDrag;
		saveBodyCursor      = document.body.style.cursor;
		document.body.style.cursor = "w-resize";
		// fire!
		saveOnmousemove      = document.onmousemove;
		document.onmousemove = self.columnDrag;
		PreventEvent(oEvent);
		return false;
	}
	// prepare table header to be draggable
	// it runs during class creation
	var aSpots;
	var iRowHeight = GetElementHeight(aDraggableColumns[0].parentNode) - 12;
	var sHTML = "";
	var iCnt = 0;
	for (var i=0; i<aDraggableColumns.length; i++)
	{
		//aDraggableColumns[i].innerHTML = "<div style=\"position:relative; height:100%; width:100%\"><div style=\"position:absolute; height:100%; width:5px; margin-right:-5px; left:100%; top:0px; cursor:w-resize; z-index:10;\">|</div>" + aDraggableColumns[i].innerHTML + "</div>";
		// BUGBUG: calculate real border width instead of 5px!!!
/*		sHTML = "<div class='wsgr_header_div' width='100%'>" + aDraggableColumns[i].innerHTML + "</div>";
		aDraggableColumns[i].innerHTML = sHTML;*/
		aTDs = aDraggableColumns[i].getElementsByTagName("TD");
		aSpots = GetElementsByAttribute(aTDs, "resizespot", "1");
		if(aSpots.length==0) continue;
		aSpots[0].style.height = iRowHeight.toString() + "px";
		aSpots[0].onmousedown = this.startColumnDrag;
		//aSpots[0].click();
		/*oHeaderTable = GetElementsByClassName(aTDs, "wsgr_header_text")[0];
		oHeaderTable.style.width = "100%";*/
		//aDraggableColumns[i].firstChild.firstChild.onmousedown = this.startColumnDrag;
	}
	return false;
}

// WSGR_ReSort_Stage2
function WSGR_ReSort_Stage2()
{
	var sColumn = g_oSortElem.getAttribute("column");
	if(sColumn==null) return false;
	var sOrder = g_oSortElem.getAttribute("sorted");
	if(sOrder==null)
	{
		sOrder = "ascending";
	}
	else
	{
		sOrder = sOrder=="ascending" ? "descending" : "ascending";
	}
	WSGR_Sort(sColumn, sOrder);
	WSGR_DisplayWaitMessage(false);
	return true;

}

// WSGR_ReSort
function WSGR_ReSort(oElem)
{
	if(oElem==null) return false;
	g_oSortElem = oElem;
	WSGR_DisplayWaitMessage(true);
	g_iTimer = setTimeout("WSGR_ReSort_Stage2()", 25);
}

// WSGR_Sort
function WSGR_Sort(sColumn, sOrder)
{
	g_sSortId = sColumn;
	g_sSortOrder = sOrder;
	WSGR_RefreshParams();
//	g_oWait.style.display = "inline";
    var sGridHTML = XSLApplyWithParam(g_oGridXML, g_oGridXSL, g_aParams);
	g_oMain.innerHTML = sGridHTML;
	//g_oWait.style.display = "none";
	WSGR_InitResizableColumns();
	return true;
}

// WSGR_LoadFiles
function WSGR_LoadFiles()
{
	if(g_isMSIE)
	{
		var oXML = document.getElementById("strItems");
		try
		{
			/*g_oGridXML = new ActiveXObject("MSXML2.DOMDocument.3.0");
			g_oGridXML.async = false;
			g_oGridXML.validateOnParse = false;*/
			/*g_oGridXML.load(g_sFile);*/
			/*g_oGridXML.loadXML(oXML.xml);*/
			g_oGridXML = oXML.selectSingleNode("objects");

			g_oGridXSL = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0");
			g_oGridXSL.async = false;
			g_oGridXSL.validateOnParse = false;
			g_oGridXSL.load(g_sTemplate);

			g_oXSLDistinct = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0");
			g_oXSLDistinct.async = false;
			g_oXSLDistinct.validateOnParse = false;
			g_oXSLDistinct.load(g_wsdistinct);

			g_oXSLSelect = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0");
			g_oXSLSelect.async = false;
			g_oXSLSelect.validateOnParse = false;
			g_oXSLSelect.load(g_wsselect);

			g_oEmptyGrid = new ActiveXObject("MSXML2.DOMDocument.3.0");
			g_oEmptyGrid.async = false;
			g_oEmptyGrid.validateOnParse = false;
			g_oEmptyGrid.load(g_wsemptygrid);

			g_oPivotTemplate = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0");
			g_oPivotTemplate.async = false;
			g_oPivotTemplate.validateOnParse = false;
			g_oPivotTemplate.load(g_sPivotTemplate);
		}
		catch(e)
		{
			alert(e.description);
			return false;
		}
		return true;
    }
	else if(g_isFireFox)
	{
		try
		{
			g_oGridXML = document.implementation.createDocument("", "", null);
			g_oGridXML.async = false;
			g_oGridXML.load(g_sFile);

			g_oEmptyGrid = document.implementation.createDocument("", "", null);
			g_oEmptyGrid.async = false;
			g_oEmptyGrid.load("wsemptygrid.xml");

			g_oGridXSL = document.implementation.createDocument("", "", null);
			g_oGridXSL.async = false;
			g_oGridXSL.load(g_sTemplate);

			g_oXSLDistinct = document.implementation.createDocument("", "", null);
			g_oXSLDistinct.async = false;
			g_oXSLDistinct.load("wsdistinct.xsl");

		}
		catch(e)
		{
			alert(e.description);
			return false;
		}
		return true;
    }


	return false;
}
