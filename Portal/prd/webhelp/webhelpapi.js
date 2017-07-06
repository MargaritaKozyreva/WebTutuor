var Contents = new DLList();

function do_load(oid, doc_id)
{
	do_load_tree(oid, doc_id);
	//do_display(oid, null,doc_id);
}

function do_display(oid, keyword, doc_id)
{
	try{ keyword }catch(err){ keyword = '' }
	if (oid != '0')
	{
		_src ="right_panel.html?oid=" + oid + "&doc_id=" + doc_id;

		if (keyword != null && keyword != '')
			_src += "&keyword=" + escape(keyword);
		
		obj = Contents.getItem(oid);
		if (obj != null)
			_src += "&prev=" + ( obj != Contents.getFirst() ? obj.prev.elem : "" ) + "&next=" + ( obj != Contents.getLast() ? obj.next.elem : "" );
	}
	else
	{
		_src = "welcome.html";
	}
	$("#content").attr("src", _src);
}

function do_load_tree(oid, doc_id)
{
	try
	{
		toc.document.clear();
	}
	catch(err)
	{
		location.href = "webhelp.html";
		return;
	}
	$("#toc").attr("src", "toc.html?oid=" + oid + "&doc_id=" + doc_id);
}

function clearContent()
{
	Contents = new DLList();
}

function addContent(oid)
{
	Contents.add(oid);
}