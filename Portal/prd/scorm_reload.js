var courseWindow = null;
var bDisabled = false;
var iWatchTimeout = 0;
var iWatchInterval = 200;

function WatchDog() {
    if (courseWindow != null) {
        var aButtons = ButtonArray();
        var aLinks = LinksArray();
        if (courseWindow.closed) {
            clearTimeout(iWatchTimeout);
	
	    __doPostBack("scriptCommand","");
            //document.location.reload();
        }
        else {
            if (!bDisabled) {
                for (var i = 0; i < aButtons.length; i++) {
                    aButtons[i].disabled = true;
                    aButtons[i].className = "actionButtonDisabled";
                }
                for (var i = 0; i < aLinks.length; i++) aLinks[i].disabled = true;
                var iW = parseInt(document.body.clientWidth, 10);
                var iH = parseInt(document.body.clientHeight, 10);
                iW = Math.floor(iW / 2) - 120;
                iH = Math.floor(iH / 2) - 50;

		var wsActivityLaunched=document.getElementById("wsActivityLaunched");

		if (wsActivityLaunched!=null)
		{
                	document.getElementById("wsActivityLaunched").style.display = "inline";
	                document.getElementById("wsActivityLaunched").style.left = iW + "px";
        	        document.getElementById("wsActivityLaunched").style.top = iH + "px";
	                bDisabled = true;
		}                        

            }
            iWatchTimeout = setTimeout("WatchDog()", iWatchInterval);
        }
    }
}

function ButtonArray() {
    var aButtons = new Array();
    var aInputs = new Array();
    aInputs = document.getElementsByTagName("input");
    for (var i = 0; i < aInputs.length; i++) {
        if (aInputs[i].getAttribute("type") == "submit" || aInputs[i].getAttribute("type") == "button") aButtons.push(aInputs[i]);
    }
    return aButtons;
}

function LinksArray() {
    var aLinks = new Array();
    aLinks = document.getElementsByTagName("a");
    return aLinks;
}
function FixSize() {
    try {
        window.parent.SetupIFrame();
    }
    catch (e) {

    }
}
