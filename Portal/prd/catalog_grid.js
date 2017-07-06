var msScrollDataDivFlag = true;
var addColSpanImgTd = 0;

function Grid(id, catalog_name, hreference) //constructor 
{ 
  //constant data 
  this.id = id; 
  this.catalog_name = catalog_name;
  this.view_type = '';
  this.multi_select = false;
  this.hreference = hreference;
 
  this.title = ''; 
  this.disp_link = true;
  this.link_fild_index = 0;
  
  this.disp_paging = false;
  this.max_num_index = 200;
  this.disp_win = false;
  
  this.disp_check_box = false;
  
  this.xquery_qual = '';
  this.elemList = null;
  
  this.show_all = false;
  this.disp_progress = true;
  this.max_num_progress = 600;
  this.check_access = false;

  //dynamic data 
  this.parentDiv = null;
  this.parentTable = null;
  this.parentRef = null;
  this.headerWithTextRow = null;
  this.headerTextRow = null;
  this.headerText = null;
  this.headerTextInner = null;
  this.headerHeaderNoTextRow = null;
  this.headerHeaderNoText = null;
  this.headerFooterRow = null;
  this.headerFooter = null;
  
  this.dataDiv = null;
  this.dataDivHeight = '';
  this.dataTable = null;
  this.dataBody = null;
  this.dataTimeout = null;
  this.dataEmptyDiv = null;
  
  this.xhierarchy = null;
  this.cur_sort_index = 0;
  this.cur_sort_direct = true;
  this.cur_page = 0;
  
  this.search_text = '';
  this.filter_id = '';
  
  this.headerColumns = null;
  this.headerColumnsLen = 0;
  this.rows = null;
  this.rowsLen = 0;
  this.elemNum = 0;
  this.dispIndex = 0;
  this.startRowIndex = 0;
  this.startWinIndex = 0;
  this.endWinIndex = 0;
  
  this.isDrow = false;
  this.isLoad = false;
  
  
  this.element_id = '';
  this.element_name = '';
  this.elemArray = new Array();
  this.elemNamesArray = new Array();
  this.can_be_empty = false;
  
  this.overflow_num = null;

 
  //methods
  /////////////////////////////////////////////////////////////
  this.rowDblClick = null;
  
  /////////////////////////////////////////////////////////////
  this.loadData = function()
  {
	var elemListStr = "";
	if ( this.elemList != null )
		elemListStr += this.elemList.join(";");

	var link_str = 'catalog_name=' + this.catalog_name + ( this.view_type != '' ? '&view_type=' + this.view_type : '' ) + ( this.headerColumnsLen > 0 ? '&has_columns=0' : '' )
			+ "&sort=" + this.cur_sort_index + ( this.cur_sort_direct ? '' : '&descending=' ) 
			+ ( this.disp_paging ? '&start_index=' + ( this.cur_page * this.max_num_index ) + '&num_index=' + this.max_num_index : '' )
			+ ( this.disp_win ? '&start_index=' + this.startWinIndex + '&num_index=' + this.max_num_index : '' )
			+ ( this.check_access ? '&check_access=1' : '' ) 
			+ ( this.search_text != '' ? '&search_text=' + escape( this.search_text ) : '' ) + ( this.filter_id != '' ? '&filter=' + this.filter_id : '' )
			+ ( this.xquery_qual != '' ? '&xquery_qual=' + escape( this.xquery_qual ) : '' ) + ( this.show_all ? '&show_all=1' : '' )
			+ ( this.elemList != null ? '&elements=' + elemListStr : '' )
			+ ( this.overflow_num != null ? '&overflow_num=' + this.overflow_num : '' );
	
	var sResponse = XMLHTTP_Load( 'catalog_list.xml', link_str );
//alert(sResponse);
	this.isLoad = ! ( sResponse == false );
	if ( this.isLoad )
	{
		this.xhierarchy = CreateDOMDocument();
		if ( ! this.xhierarchy.loadXML( sResponse ) )
		{
			this.xhierarchy = undefined;
			this.isLoad = false;
		}
	}
	
	return this.isLoad;
  };
  
  /////////////////////////////////////////////////////////////
  this.loadNextData = function()
  {
	this.disp_paging = false;
	this.startWinIndex = ( this.endWinIndex == 0 ? 0 : this.endWinIndex + 1 );
	this.loadData();
	this.drowGrid();
  };
  
  /////////////////////////////////////////////////////////////
  this.goPage = function(page)
  {
	this.cur_page = parseInt(page);
	this.loadData();
	this.drowGrid();
  };
  
  /////////////////////////////////////////////////////////////
  this.sortGrid = function(_index)
  {
	if ( _index != undefined )
	{
		if ( _index != this.cur_sort_index )
			this.cur_sort_direct = true;
		else
			this.cur_sort_direct = ! this.cur_sort_direct;
			
		this.cur_sort_index = _index;
	}
	
	this.startWinIndex = 0;
	this.endWinIndex = 0;
	this.loadData();
	this.drowGrid();
	this.dataDiv.scrollTop = 0;
	this.drowHeaderWidth();
  };
  
  /////////////////////////////////////////////////////////////
  this.searchText = function(_search_text,_filter_id)
  {
	this.search_text = _search_text;
	this.filter_id = _filter_id;
	
	this.startWinIndex = 0;
	this.endWinIndex = 0;
	this.loadData();
	this.drowGrid();
	this.dataDiv.scrollTop = 0;
	this.drowHeaderWidth();
  };
  
  /////////////////////////////////////////////////////////////
  this.drowHeaderWidth = function()
  {
	  if ( this.dataBody != null && this.dataBody.rows.length != 0 )
		for ( var i=addColSpanImgTd; i<this.headerWithTextRow.cells.length-addColSpanImgTd; i++ )
			this.headerWithTextRow.cells[ i ].style.width = this.dataBody.rows[0].cells[ i ].offsetWidth;
  };

  /////////////////////////////////////////////////////////////
  this.drowGrid = function()
  {
	clearTimeout( this.dataTimeout );
	var addColSpan = ( this.disp_check_box ? 1 : 0 );
	var table = null;
	
	if ( ! this.isDrow )
	{
		this.parentTable = document.createElement("TABLE");
		this.parentTable.cellSpacing = 0;
		this.parentTable.cellPadding = 0;
		this.parentTable.style.width = "100%";
		this.parentTable.className = "tableBasic";
		this.parentRef = document.createElement("TBODY");
		this.parentTable.appendChild(this.parentRef);


		this.headerTextRow = document.createElement("TR");
//		this.headerTextRow.appendChild(createImgTd("tableHeaderTextLeft"));
		this.headerText = document.createElement("TD");
		this.headerText.width = "100%";
		this.headerText.className = "tableHeaderText";
		this.headerTextInner = document.createElement("P");
		this.headerTextInner.className = "tableHeaderTextInner";
		this.headerTextInner.appendChild(document.createTextNode(this.title));
		
		if ( this.isLoad && this.disp_paging )
		{
			var temp_div = document.createElement("DIV");
			var temp_node = this.xhierarchy.selectSingleNode(".//rows");
			this.elemNum = parseInt(temp_node.getAttribute("num"));
			
			if ( this.elemNum > this.max_num_index )
			{
				var page_num = this.elemNum / this.max_num_index;
		
				var newlink = "";
				for ( i=0; i<=page_num; i++ )
					if ( this.cur_page == i )
					{
						temp_div.appendChild(document.createTextNode((i+1)+' '));
					}
					else
					{
						var temp_link = document.createElement("A");
						temp_link.setAttribute("href","javascript:getGridObject('" + this.id + "').goPage(" + i + ")");
						temp_link.appendChild(document.createTextNode(i+1));
						temp_div.appendChild(temp_link);
						temp_div.appendChild(document.createTextNode(' '));
					}
				
				temp_div.innerHtml = newlink;
				this.headerTextInner.appendChild(temp_div);
			}
		}
		
		this.headerText.appendChild(this.headerTextInner)
		this.headerTextRow.appendChild(this.headerText);
//		this.headerTextRow.appendChild(createImgTd("tableHeaderTextRight"));
//  TITLE
		this.parentRef.appendChild(this.headerTextRow);


		this.headerHeaderNoTextRow = document.createElement("TR");
//		this.headerHeaderNoTextRow.appendChild(createImgTd("tableHeaderNoTextLeft"));
		this.headerHeaderNoText = createImgTd("tableHeaderNoText",this.id);		
		this.headerHeaderNoTextRow.appendChild(this.headerHeaderNoText);
//		this.headerHeaderNoTextRow.appendChild(createImgTd("tableHeaderNoTextRight"));
// HEADER NO TEXT
		this.parentRef.appendChild(this.headerHeaderNoTextRow);


		this.headerFooterRow = document.createElement("TR");
//		this.headerFooterRow.appendChild(createImgTd("tableFooterLeft"));
		this.headerFooter = createImgTd("tableFooter",this.id);		
		this.headerFooterRow.appendChild(this.headerFooter);
//		this.headerFooterRow.appendChild(createImgTd("tableFooterRight"));
// FOOTER
		this.parentRef.appendChild(this.headerFooterRow);
	}


	if ( this.isLoad && this.headerColumns == null )
	{
		this.headerColumns = this.xhierarchy.selectNodes(".//columns/col");
		this.headerColumnsLen = this.headerColumns.length;
	}
	if ( this.isDrow )
		this.parentRef.deleteRow( 1 );
	
	this.headerWithTextRow = document.createElement("TR");
//	this.headerWithTextRow.appendChild(createImgTd("tableHeaderWithTextLeft"));
	if ( this.disp_check_box )
	{
		var header_with_text_box_td=document.createElement("TD");
		header_with_text_box_td.className = 'tableHeaderWithText';
		header_with_text_box_td.style.width = '20px';
		header_with_text_box_td.appendChild(document.createTextNode("v"));
		this.headerWithTextRow.appendChild(header_with_text_box_td);
	}
	for ( var i=0; i<this.headerColumnsLen; i++ )
	{
		var header_with_text_td=document.createElement("TD");
		header_with_text_td.className = 'tableHeaderWithText';

		var temp_link = document.createElement("A");
		temp_link.setAttribute( 'href', '#' );
		temp_link.setAttribute( 'grid_id', this.id );
		temp_link.setAttribute( 'col_index', i );
		msAddEvent( temp_link, "click", msEventSortGrid );
		
		temp_link.appendChild(document.createTextNode(this.headerColumns[i].getAttribute("title")));
		header_with_text_td.appendChild(temp_link);
		
		var temp_img = document.createElement("IMG");
		temp_img.setAttribute( 'src', ( i == this.cur_sort_index ? ( this.cur_sort_direct ? 'pics/arrow-up.gif' : 'pics/arrow-down.gif' ) : 'pics/arrow-none.gif' ) );
		temp_img.setAttribute( 'height', '10' );
		temp_img.setAttribute( 'width', '16' );
		temp_img.setAttribute( 'hspace', '6' );
		header_with_text_td.appendChild(temp_img);
		
		this.headerWithTextRow.appendChild(header_with_text_td);
	}
	if ( this.headerColumnsLen == 0 )
	{
		var header_with_text_td=document.createElement("TD");
		header_with_text_td.className = 'tableHeaderWithText';
		header_with_text_td.colSpan = 3;
		addColSpan += 1;
	}
//	this.headerWithTextRow.appendChild(createImgTd("tableHeaderWithTextRight"));
// TEXT	
	if ( this.headerHeaderNoTextRow )
		this.parentRef.insertBefore( this.headerWithTextRow, this.headerHeaderNoTextRow );
	else
		this.parentRef.appendChild( this.headerWithTextRow );
		
	var headerColSpan = this.headerColumnsLen + addColSpan;
	this.headerText.colSpan = headerColSpan;
	this.headerHeaderNoText.colSpan = headerColSpan;
	this.headerFooter.colSpan = headerColSpan;

//debugger
	var drowDataFlag = false;
	if ( this.isLoad )
	{
		var rowsNode = this.xhierarchy.selectSingleNode(".//rows");
		this.dispIndex = parseInt(rowsNode.getAttribute("dispindex"));
		this.elemNum = parseInt(rowsNode.getAttribute("num"));
		this.endWinIndex = parseInt(rowsNode.getAttribute("endindex"));
		this.rows = this.xhierarchy.selectNodes(".//rows/row");
		this.rowsLen = this.rows.length;
		msScrollDataDivFlag = this.endWinIndex < this.elemNum-1;


		if ( this.isDrow && this.startWinIndex == 0 )
		{
			this.parentRef.deleteRow( 3 );
			this.dataDiv = null;
		}

		if ( this.dataDiv == null || this.startWinIndex == 0 )
		{
			var data_tr = document.createElement("TR");
			data_tr.setAttribute( "id", "ms_data_tr" );
			var data_td = document.createElement('TD');
			data_td.colSpan = this.headerColumnsLen + addColSpanImgTd * 2 + addColSpan;
			data_tr.appendChild(data_td);
			
			this.dataDiv = document.createElement("DIV");
			this.dataDiv.style.overflow = 'auto';
			this.dataDiv.style.verticalAlign = 'top';
			if ( this.dataDivHeight != '' )
				this.dataDiv.style.height = this.dataDivHeight;
			if ( this.disp_win )
			{
				this.dataDiv.setAttribute( "grid_id", this.id );
				msAddEvent( this.dataDiv, "scroll", msEventDataDivScroll );
			}
			
			this.dataEmptyDiv = document.createElement("DIV");
			this.dataDiv.appendChild(this.dataEmptyDiv);
	
			
			data_td.appendChild(this.dataDiv);
			if ( this.headerFooterRow )
				this.parentRef.insertBefore( data_tr, this.headerFooterRow );
			else
				this.parentRef.appendChild( data_tr );
	
			this.dataTable = document.createElement("TABLE");
			this.dataTable.width = '100%';
			this.dataTable.cellpadding = 0;
			this.dataTable.cellspacing = 0;
			this.dataBody = document.createElement("TBODY");
			this.dataTable.appendChild(this.dataBody);
			drowDataFlag = true;
			
//		alert('this.overflow_num = '+this.overflow_num+'   rowsNode.getAttribute("overflownum") = '+rowsNode.getAttribute("overflownum"))
			var message_str = rowsNode.getAttribute("message");
			if ( this.overflow_num != null && rowsNode.getAttribute("overflownum") != null )
			{
				message_str = message_str == null ? "Number of records is too large. Use the search." : message_str;
			}
			else if ( this.elemNum == 0 )
			{
				if ( this.search_text == '' )
				{
					message_str = message_str == null ? "A list of records is empty." : message_str;
				}
				else
				{
					message_str = message_str == null ? "Nothing found." : message_str;
				}
			}
			if ( message_str != null && message_str != '' )
			{
				var message_div = document.createElement("DIV");
				message_div.appendChild(document.createTextNode(message_str));
				this.dataEmptyDiv.appendChild(message_div);
			}
		}

		if ( this.disp_progress && this.rowsLen > this.max_num_progress )
		{
			var progCount = 100;
			this.progressDiv = document.createElement("DIV");
			this.progressDiv.style.display = "block";
			var prog_div = document.createElement("DIV");
			prog_div.style.width = progCount + "px";
			prog_div.style.border = "1px solid #000";
			this.progressBarDiv = document.createElement("DIV");
			this.progressBarDiv.style.background = "#00f";
			this.progressBarDiv.style.height = "10px";
			this.progressBarDiv.style.width = "0px";
			prog_div.appendChild(this.progressBarDiv);
			this.progressDiv.appendChild(prog_div);
			this.dataDiv.appendChild(this.progressDiv);
			
			var count = 0;
			var tempThis = this;
			var ost = this.rowsLen % progCount;
			var delta = parseInt( this.rowsLen / progCount, 10 );

			(function() {
				var curCount = count * delta;
				var curCountEnd = curCount + delta + ( count == progCount ? ost : 0 );
				tempThis.drowDataRow( curCount, curCountEnd );
				count++;
				
				if ( count == progCount )
				{
					tempThis.dataEmptyDiv.appendChild(this.dataTable);
					tempThis.progressDiv.style.display = "none";
				}
				else
				{
					tempThis.progressBarDiv.style.width = count + "px";
					tempThis.dataTimeout = setTimeout( arguments.callee, 0 );
				}
			})()
		}
		else
		{
//s = new Date();
			this.drowDataRow( this.startRowIndex, this.rowsLen );
/*if(true)
{
e = new Date();
alert((e.getTime()-s.getTime())/1000);
}*/
			this.dataEmptyDiv.appendChild(this.dataTable);
		}

		
		if ( msScrollDataDivFlag )
			this.dataEmptyDiv.style.height = parseInt( this.dataTable.clientHeight * this.elemNum / this.endWinIndex ) + "px";
		else
			this.dataEmptyDiv.style.height = this.dataTable.clientHeight + "px";
	}

	if ( drowDataFlag )
	{
		this.parentDiv.appendChild(this.parentTable);
	}
	else
	{
		var message_div = document.createElement("DIV");
		message_div.appendChild(document.createTextNode('Error obtaining data.'));
		this.parentDiv.appendChild(message_div);
	}
	
	this.isDrow = true;
	return true;
  };
  
  ///////////////////////////////////////////////////////////
  this.drowDataRow = function(_s,_e)
  {
	for ( var _index=_s; _index<_e; _index++ )
	{
		var curRow = this.rows[_index];
		var curObjectID = curRow.getAttribute("id");
		
		var row_tr = document.createElement("TR");
		row_tr.id =  'row_' + this.id + '_' + curObjectID + '_';
		if ( this.rowDblClick != null )
		{
			row_tr.setAttribute( "grid_id", this.id );
			row_tr.setAttribute( "object_id", curObjectID );
			msAddEvent( row_tr, "dblclick", msEventRowDblClick );
		}
//		row_tr.appendChild(createImgTd( _index % 2 ? 'tableRowEvenLeft' : 'tableRowOddLeft' ));
		
		var row_td = null;
		var className = ( _index % 2 ? 'tableRowEven' : 'tableRowOdd' );
		
		if ( this.disp_check_box )
		{
			row_td = document.createElement("TD");
			row_td.className = className;
			row_td.style.width = '20px';
			row_td.align = 'center';
			
			var row_box = document.createElement("INPUT");
			row_box.name = "ms_select_box_" + this.id;
			row_box.type = 'checkbox';
			row_box.id = "ms_select_box_" + this.id + "_" + curObjectID;
			
			if ( this.multi_select )
			{
				for ( var e=0, len=this.elemArray.length; e<len; e++ )
					if ( this.elemArray[e] == curObjectID )
					{
						row_box.checked = true;
						break;
					}
			}
			else
			{
				row_box.checked = ( curObjectID == this.element_id );
			}
			
			row_box.setAttribute( 'grid_id', this.id );
			row_box.setAttribute( 'object_id', curObjectID );
			msAddEvent( row_box, "click", msEventSelectSingleRow );
	
			row_td.appendChild(row_box);
			var row_tr_node=row_tr.appendChild(row_td);
		}
	
		var _columns = curRow.selectNodes("cell");
		var dispValue = '';
		for ( var i=0; i<this.headerColumnsLen; i++ )
		{
			var curTest = _columns[i].text;
			row_td = document.createElement("TD");
			row_td.className = className;
			
			if ( this.disp_link && i == this.link_fild_index )
			{
				var temp_link = document.createElement("A");
				temp_link.setAttribute( "href", "view_doc.html?mode=" + this.catalog_name + "&object_id=" + curObjectID );
				temp_link.appendChild(document.createTextNode(curTest));
				row_td.appendChild(temp_link);
			}
			else
			{
				row_td.appendChild(document.createTextNode(curTest));
			}
				
			row_tr.appendChild(row_td);
			
			if ( i == this.dispIndex )
				dispValue = curTest;
		}
		row_box.setAttribute("name_value",dispValue);
		
//		row_tr.appendChild(createImgTd( _index % 2 ? 'tableRowEvenRight' : 'tableRowOddRight' ));
		this.dataBody.appendChild(row_tr);
	}
  };
  
  ///////////////////////////////////////////////////////////
  this.selectSingleRow = function(_element_id,_del_flag,_this)
  {
	 var res = true;
	 if ( _del_flag )
	 {
	 	res = this.clearSingleRow(_element_id);
	 }
	 else
	 {
		if ( ! _this )
		{
			var _this = this.getSelectBoxByElemId(_element_id);
			if ( ! _this )
				return false;
		}
		elemName = _this.getAttribute('name_value');
		if ( this.multi_select )
		{
			for ( var i=0, len=this.elemArray.length; i<len; i++ )
				if ( this.elemArray[i] == _element_id )
					return false;
				
			this.elemArray.push( _element_id );
			this.elemNamesArray.push( elemName );
		}
		else
		{
			this.deselectAllRows(_element_id);
			this.elemArray[0] = _element_id;
			this.elemNamesArray[0] = elemName;
		}
		this.element_id = _element_id;
		this.element_name = elemName;
		_this.checked = true;
	 }
	
	this.afterSelectSingleRow(_element_id,_del_flag);
	return res;
  };
  
  ///////////////////////////////////////////////////////////
  this.afterSelectSingleRow = function() {};
  
  ///////////////////////////////////////////////////////////
  this.setSelectSingleRow = function(_element_id)
  {
	var _elem = this.getSelectBoxByElemId(_element_id);
	if ( ! _elem )
		return false;
		
	this.deselectAllRows();
	_elem.checked = true;
	
	this.elemArray[0] = _element_id;
	this.elemNamesArray[0] = _elem.getAttribute('name_value');
	this.element_id = _element_id;
	this.element_name = _elem.getAttribute('name_value');
	return true;
  };
  
  ///////////////////////////////////////////////////////////
  this.clearSingleRow = function(_element_id,_this)
  {
	for ( var i=0, len=this.elemArray.length; i<len; i++ )
		if ( this.elemArray[i] == _element_id )
		{
			this.elemArray.splice(i,1);
			this.elemNamesArray.splice(i,1);
			break;
		}

	this.element_id = '';
	this.element_name = '';
	return true;
  };
  
  ///////////////////////////////////////////////////////////
  this.obtainListArray = function(_elem_array)
  {
	var addCounter = 0;
	for ( var i=0, len=_elem_array.length; i<len; i++ )
	{
		var addFlag = true;
		for ( var e=0, lene=this.elemList.length; e<lene; e++ )
			if ( this.elemList[e] == _elem_array[i] )
			{
				addFlag = false;
				break;
			}
			
		if ( addFlag )
		{
			this.elemList.push( _elem_array[i] );
			addCounter++;
		}
	}

	this.sortGrid();
	return addCounter;
  };
  
  ///////////////////////////////////////////////////////////
  this.removeRow = function(_element_id)
  {
	var curNodeID = 'row_' + this.id + '_' + _element_id + '_';
	var curNode = document.getElementById(curNodeID);

	if ( ! curNode )
		return false;
		
	this.clearSingleRow(_element_id);
	
	for ( var e=0, lene=this.elemList.length; e<lene; e++ )
		if ( this.elemList[e] == _element_id )
		{
			this.elemList.splice(e,1);
			break;
		}

	this.dataBody.deleteRow(curNode.rowIndex);
	return true;
  };
  
  ///////////////////////////////////////////////////////////
  this.removeSelectedRows = function()
  {
	var delCounter = 0;
	while ( this.elemArray.length )
		if ( this.removeRow( this.elemArray[0] ) )	
			delCounter++;

	return delCounter;
  };
  
  ///////////////////////////////////////////////////////////
  this.removeAllRows = function()
  {
	var delCounter = 0;
	var rows_len = this.dataBody.rows.length;
	for(var i=0; i<rows_len; i++)
	{
		this.dataBody.deleteRow(0);
		delCounter++;
	}
	
	this.elemList = new Array();
	this.elemArray = new Array();
	this.elemNamesArray = new Array();
	this.element_id = '';
	this.element_name = '';
	return delCounter;
  };
  
  ///////////////////////////////////////////////////////////
  this.deselectAllRows = function(_element_id)
  {
	var boxElemArray = this.getSelectBoxArray();
	var delCounter = 0;
	var _id = _element_id ? this.getSelectBoxIdByElemId(_element_id) : _element_id;
	for ( var i=0, len=boxElemArray.length; i<len; i++ )
	{
		var _elem = boxElemArray[i];
		if ( _elem.checked && _id != _elem.id )
		{
			_elem.checked = false;
			delCounter++;
		}
	}
		
	this.elemArray = new Array();
	this.elemNamesArray = new Array();
	this.element_id = '';
	this.element_name = '';
	return delCounter;
  };
  
  this.selectAllRows = function()
  {
	var boxElemArray = this.getSelectBoxArray();
	var selCounter = 0;
	for ( var i=0, len=boxElemArray.length; i<len; i++ )
	{
		var _elem = boxElemArray[i];
		if ( ! _elem.checked )
		{
			_elem.checked = true;
			_element_id_arr = _elem.getAttribute('id').split('_');
			_element_id = _element_id_arr[ _element_id_arr.length -1 ];
			this.elemArray.push( _element_id );
			this.elemNamesArray.push( _elem.getAttribute('name_value') );
			this.element_id = _element_id;
			this.element_name = _elem.getAttribute('name_value');
			selCounter++;
		}
	}
	return selCounter;
  };
  
  ///////////////////////////////////////////////////////////
  this.setElemListFromStr = function(_str)
  {
	if ( _str == '' )
	{
		this.elemList = new Array();
		this.element_id = '';
		return 0;
	}
	  
	this.elemList = String( _str ).split(';');
	var len = this.elemList.length;
	if ( this.elemList[ len - 1 ] == '' )
		this.elemList.pop();
	else
		this.element_id = this.elemList[0];
		
	return len;
  };
  
  ///////////////////////////////////////////////////////////
  this.getStrFromElemArray = function()
  {
	return this.elemArray.join(';');
  };
  
  ///////////////////////////////////////////////////////////
  this.getStrFromElemList = function()
  {
	return this.elemList.join(';');
  };
  
  ///////////////////////////////////////////////////////////
  this.getNamesArrayFromElemList = function()
  {
	var selectBoxArray = this.getSelectBoxArray();
	var resArray = new Array();
	/*
	for ( var i=0, len=selectBoxArray.length; i<len; i++ )
		resArray.push( selectBoxArray[i].getAttribute( 'name_value' ) );
	*/
	var bFlag_ok;
	for (var j =0,jlen = this.elemList.length;j < jlen; j++)
	{
		bFlag_ok = false;
		for ( var i=0, len=selectBoxArray.length; i<len; i++ )
		if (this.elemList[j] == selectBoxArray[i].getAttribute( 'object_id' ))
		{
			bFlag_ok = true;
			resArray.push( selectBoxArray[i].getAttribute( 'name_value' ) );
			break;
		}
		if (!bFlag_ok)
			resArray.push( null );
	}
		
	
	return resArray;
  };
  
  ///////////////////////////////////////////////////////////
  this.getSelectBoxIdByElemId = function(_element_id)
  {
	return 'ms_select_box_' + this.id + '_' + _element_id;
  };
  
  ///////////////////////////////////////////////////////////
  this.getSelectBoxByElemId = function(_element_id)
  {
	return document.getElementById(this.getSelectBoxIdByElemId(_element_id));
  };
  
  ///////////////////////////////////////////////////////////
  this.getSelectBoxArray = function()
  {
	//return document.getElementsByName( 'ms_select_box_' + this.id );
	return this.dataBody ? this.dataBody.getElementsByTagName("INPUT") : Array();
  };
  
  ///////////////////////////////////////////////////////////
  this.setParentDivHeight = function(_height)
  {
	if ( this.isLoad && this.disp_win && msScrollDataDivFlag )
		this.dataEmptyDiv.style.height = parseInt( this.dataTable.clientHeight * this.elemNum / this.endWinIndex ) + "px";
	
	var deltaHeight = 0;
	if ( this.parentRef )
		for ( var i=0, len=this.parentRef.rows.length; i<len; i++ )
		{
			var curRow = this.parentRef.rows[i];
			if ( curRow.id != 'ms_data_tr' )
				deltaHeight += curRow.offsetHeight;
		}

	var curHeight = ( _height > deltaHeight ? _height - deltaHeight : '1' ) + 'px';
	if ( this.dataDiv )
		this.dataDiv.style.height = curHeight;
	
	this.dataDivHeight = curHeight;
	return curHeight;
  };
}

var msAddEvent = ( function()
	{
		if ( document.attachEvent )
	   		return function( obj, type, fn ) { obj.attachEvent( "on" + type, fn ); }
		else if ( document.addEventListener )
			return function( obj, type, fn ) { obj.addEventListener( type, fn, false ); }
		else
			return function( obj, type, fn ) { obj[ "on" + type ] = fn; }
	} 
)();

function msEventSortGrid( evt )
{
	var src = ( window.event ? window.event.srcElement : evt.target );
	return msGetGridObject( src.getAttribute( "grid_id" ) ).sortGrid( parseInt( src.getAttribute( "col_index" ) ) );
}

function msEventSelectSingleRow( evt )
{
	var src = ( window.event ? window.event.srcElement : evt.target );
	return msGetGridObject( src.getAttribute( "grid_id" ) ).selectSingleRow( src.getAttribute( "object_id" ), !src.checked, src );
}

function msEventRowDblClick( evt )
{
	var src = ( window.event ? window.event.srcElement : evt.target );
	while ( src.tagName != "TR" )
		src = src.parentNode;

	return msGetGridObject( src.getAttribute( "grid_id" ) ).rowDblClick( src.getAttribute( "object_id" ) );
}

function msEventDataDivScroll( evt )
{
	var src = ( window.event ? window.event.srcElement : evt.target );
	if ( msScrollDataDivFlag )
	{
		var dataBody = src.getElementsByTagName("TABLE")[0];
		if ( src.scrollTop > dataBody.clientHeight - src.clientHeight )
		{
			//alert(src.offsetHeight+'  '+dataBody.offsetHeight+'  '+src.scrollTop);
			msGetGridObject( src.getAttribute( "grid_id" ) ).loadNextData();
		}
	}
}


////////////////////////////////
function msSortGrid( _id, _index )
{
	return msGetGridObject( _id ).sortGrid( parseInt( _index ) );
}


function msGridObject(id,catalog_name)
{
	var parentDiv = document.getElementById("ms_div_"+id);
	if( ! parentDiv )
		return null;

	eval( 'ms_grid_' + id + ' = new Grid(id,catalog_name)' );
	eval( 'var _ref = ms_grid_' + id );
	
	_ref.parentDiv = parentDiv;
	return _ref;
}


function msGetGridObject(id)
{
	return eval( "ms_grid_" + id );
}


function createImgTd(_class,_id)
{
	var temp_td = document.createElement("TD");
	
	if ( _class )
		temp_td.className = _class;
		
	if ( _id )
	{
		temp_td.id = _class + '_' + _id;
		temp_td.width = '100%';
	}
	
	var temp_img = document.createElement("IMG");
	temp_img.src = "pics/1blank.gif";
	
	temp_td.appendChild(temp_img);
	return temp_td;
}