var type = "IE";

IdentifyBrowser();
window.onload=resizeSplitWndw;
window.onresize=resizeSplitWndw;
window.onbeforeprint=set_to_print;
window.onafterprint=reset_form;
window.onerror = errorHandler;

function resizeSplitWndw()
{
  if (type=="MO") 
  {
    document.getElementById('ScrollSection').style.top= document.getElementById('NonScrollSection').offsetHeight;
  }
  //-------------------------------------------------
  if (type=="NN") 
  { 
    document.layers.ScrollSection.style.top=document.layers.NonScrollSection.offsetHeight;
  }
  if (type=="OP") 
  { 
    document.all.ScrollSection.style.top=document.all.NonScrollSection.offsetHeight;
    document.all.NonScrollSection.style.width= document.body.offsetWidth;
  }
  //-------------------------------------------------
  if (type=="IE") 
  {
    var oNonScroll=document.all.item("NonScrollSection");
    var oScroll=document.all.item("ScrollSection");
    if (oScroll ==null) return;
    if (oNonScroll != null)
    document.all.NonScrollSection.style.position= "absolute";
    document.all.ScrollSection.style.position= "absolute";
    document.all.ScrollSection.style.overflow= "auto";
    document.all.ScrollSection.style.height= "100%";
    document.all.NonScrollSection.style.width= document.body.offsetWidth;
    document.all.ScrollSection.style.width= document.body.offsetWidth-4;
    document.all.ScrollSection.style.top= document.all.NonScrollSection.offsetHeight;
    if (document.body.offsetHeight > document.all.NonScrollSection.offsetHeight)
		document.all.ScrollSection.style.height= document.body.offsetHeight - document.all.NonScrollSection.offsetHeight;
    else 
		document.all.ScrollSection.style.height=0;
  }
}

function errorHandler() {
  //alert("Error Handled"); 
  //When printing pages that contain mixed elements of hidden paragraphs and links, printing will
  //mistakenly raise an exception when parsing the elements, so we suppress it here.
  return true;
}

function set_to_print()
{
  var i;
  document.all.ScrollSection.style.overflow="visible";
  document.all.ScrollSection.style.width="100%";
  if (window.ScrollSection)document.all.ScrollSection.style.height = "auto";
  for (i=0; i < document.all.length; i++)
  {
    if (document.all[i].tagName == "BODY") 
    {
      document.all[i].scroll = "auto";
    }
    if (document.all[i].tagName == "A") 
    {
      document.all[i].outerHTML = "<a href=''>" + document.all[i].innerHTML + "</a>";
    }
  }
}

function reset_form()
{
  document.location.reload();
}

function IdentifyBrowser() 
{
  if (navigator.userAgent.indexOf("Opera")!=-1 && document.getElementById) type="OP";//Opera
  else if (document.all) type="IE";													//Internet Explorer e.g. IE4 upwards
  else if (document.layers) type="NN";													//Netscape Communicator 4
  else if (!document.all && document.getElementById) type="MO";
        //Mozila e.g. Netscape 6 upwards
  else type = "IE";
}

function OpenFileRelativeToCHMFolder(stFileName)
{
  var X, Y, sl, a, ra, link;
  ra = /:/;
  a = location.href.search(ra);
  if (a == 2)
    X = 14;
  else
    X = 7;
  sl = "\\";
  Y = location.href.lastIndexOf(sl) + 1;
  link = 'file:///' + location.href.substring(X, Y) + stFileName;
  location.href = link;
}