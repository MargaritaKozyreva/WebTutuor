// JavaScript Document
// WebTutor SCORM API (c)2002-2011 Websoft Development.
// http://www.websoft.ru/
// 20110715

var g_isMSIE = false;
var g_isFirefox = false;
var g_sMSXMLProgID;
var g_sMSXMLHTTPProgID;
var g_nFirst = 1;

var API = new Object;
var API_1484_11 = new Object;
//==========
API.LMSInitialize = LMSInitialize;
API.LMSFinish = LMSFinish;
API.LMSGetValue = LMSGetValue;
API.LMSSetValue = LMSSetValue;
API.LMSCommit = LMSCommit;
API.LMSGetLastError = LMSGetLastError;
API.LMSGetErrorString = LMSGetErrorString;
API.LMSGetDiagnostic = LMSGetDiagnostic;
API.ResetAPI = ResetAPI;
//==========
API.version = "1.2";
API.lastError = "0";
API.getParamResponse = "";
API.putParamResponse = "";
API.buildDate = "20100301";
//==========
API_1484_11.Initialize = Initialize;
API_1484_11.Terminate = LMSFinish;
API_1484_11.GetValue = LMSGetValue;
API_1484_11.SetValue = LMSSetValue;
API_1484_11.Commit = LMSCommit;
API_1484_11.GetLastError = LMSGetLastError;
API_1484_11.GetErrorString = LMSGetErrorString;
API_1484_11.GetDiagnostic = LMSGetDiagnostic;
//==========
API_1484_11.version = "1.3";
API_1484_11.lastError = "0";
API_1484_11.commError = "200";
API_1484_11.session_id = "";
API_1484_11.tracking_url = "";
API_1484_11.getParamResponse = "";
API_1484_11.putParamResponse = "";
API_1484_11.buildDate = "20100413";
//==========

var oCurrent = new Object;
var cmi = new Object;
var entrypoint="";
ResetAPI();
CheckBrowserType();

if(g_isFirefox)
{
	UpdateFireFoxDOM();
}
else if(g_isMSIE)
{
	DetermineMSXMLProgID();
	DetermineMSXMLHTTPProgID();
}

function ResetAPI()
{
	API.session_id = "";
	API.tracking_url = "";

	oCurrent.state = "na";
	oCurrent.errorlevel = "low";
	oCurrent.version = "";
	oCurrent.error = "0";
	oCurrent.debug = false;
	oCurrent.last_command = "";
	oCurrent.comm_error = "200";
	oCurrent.session_id = "";
	oCurrent.tracking_url = "";
	oCurrent.response = "";
	oCurrent.strictSCORM = false;
	oCurrent.command_log = false;
	oCurrent.setvalue_log = "";
	oCurrent.getvalue_log = "";
	oCurrent.sendtype = "xml"; // "xml" to send interactions and objectives as XML, any other - CSV table
	oCurrent.session_timer = 0;
	oCurrent.session_time_to_send = 0;
	oCurrent.enable_API_session_time = false;
	oCurrent.alt_session_timer = 0;
	oCurrent.alt_session_time_to_send = 0;
	oCurrent.bSCOSessionTime = false;

	//=== SCORM common values =====
	cmi._version = "0";
	cmi.interactions = new Array();
		cmi._interactions = new Object;
		cmi._interactions._children_12 = "id,type,objectives,time,correct_responses,weighting,student_response,result,latency";
		cmi._interactions._children_13 = "id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description";
			cmi._interactions._objectives = new Object;
			cmi._interactions._objectives._children_13 = "id";
			cmi._interactions._objectives._children_12 = "id";
			cmi._interactions._correct_responses = new Object;
			cmi._interactions._correct_responses._children_13 = "pattern";
			cmi._interactions._correct_responses._children_12 = "pattern";
	cmi.launch_data = "";
	cmi.objectives = new Array();//+
		cmi._objectives = new Object;
		cmi._objectives._children_12 = "id,score,status";
		cmi._objectives._children_13 = "id,score,success_status,completion_status,description";
		cmi._objectives.score = new Object;
		cmi._objectives.score._children_12 = "max,min,raw";
		cmi._objectives.score._children_13 = "max,min,raw,scaled";
	cmi.suspend_data = "";//+

	//=== SCORM 1.2 values =====
	cmi._children_12 = "core,comments,comments_from_lms,interactions,launch_data,objectives,suspend_data,student_data,student_preference";
	cmi.core = new Object;
		cmi.core._children = "credit,entry,exit,lesson_location,lesson_mode,lesson_status,score,session_time,student_id,student_name,total_time";
		cmi.core.student_id = "No_Student_ID";
		cmi.core.student_name = "Unknown_Student";
		cmi.core.lesson_location = "";
		cmi.core.lesson_status = "";
		cmi.core.lesson_mode = "";
		cmi.core.entry = "";
		cmi.core.credit = "";
		cmi.core.total_time = "PT0H0M0S";
		cmi.core.session_time = "PT0H0M0S";
		cmi.core.exit = "";
		cmi.core.score = new Object;
			cmi.core.score._children = "max,min,raw";
			cmi.core.score.raw = "";
			cmi.core.score._min = "";
			cmi.core.score._max = "";
	cmi.comments = "";//+
	cmi.comments_from_lms = "";//+
	cmi.student_data = new Object;//+
		cmi.student_data._children = "mastery_score,max_time_allowed,time_limit_action";
		cmi.student_data.mastery_score = "";
		cmi.student_data.max_time_allowed = "";
		cmi.student_data.time_limit_action = "";
	cmi.student_preference = new Object;//+
		cmi.student_preference._children = "audio,language,speed,text";
		cmi.student_preference.audio = "";
		cmi.student_preference.language = "";
		cmi.student_preference.speed = "";
		cmi.student_preference._text = "";
	//=== SCORM 2004 values =====
	cmi._children_13 = "comments_from_lms,completion_status,credit,entry,exit,launch_data,learner_id,learner_name,location,mode,score,session_time,suspend_data,total_time";
	cmi.learner_id = "No_Student_ID";
	cmi.learner_name = "Unknown_Student";
	cmi.location = "";
	cmi.completion_status = "";
	cmi.success_status = "";
	cmi.completion_threshold = "";
	cmi.progress_measure = "";
	cmi.max_time_allowed = "";
	cmi.time_limit_action = "";
	cmi.mode = "normal";
	cmi.entry = "resume";
	cmi.credit = "credit";
	cmi.total_time = "PT0H0M0S";
	cmi.session_time = "PT0H0M0S";
	cmi.exit = "";
	cmi.score = new Object;
		cmi.score._children = "max,min,raw,scaled";
		cmi.score.raw = "";
		cmi.score._min = "";
		cmi.score._max = "";
		cmi.score.scaled = "";
	cmi.scaled_passing_score = "";
	cmi.comments_from_learner = new Array();
	cmi.comments_from_lms = new Array();
	cmi.learner_preference = new Object();
		cmi.learner_preference.audio_level = "";
		cmi.learner_preference.language = "";
		cmi.learner_preference.delivery_speed = "";
		cmi.learner_preference.audio_captioning = "";
	return true;
}

function LMSInitialize(param)
{
	if(oCurrent.debug) alert("1.2");
	API.lastError = "201"; //General Argument Error
	if(param!="")
	{
		if(oCurrent.debug) alert("SCORM 1.2 Initialize: invalid parameter");
		return "false";
	}
	API.lastError = "103"; //Already Initialized
	if(oCurrent.state=="running")
	{
		if(oCurrent.debug) alert("SCORM 1.2 Initialize: attempt to initialize already initialized API session");
		return "false";
	}
	API.lastError = "104"; //Content Instance Terminated
	if(oCurrent.state=="terminated")
	{
		if(oCurrent.debug) alert("SCORM 1.2 Initialize: attempt to initialize already terminated API session");
		return "false";
	}
	API.lastError = "102"; //General Initialization Failure
	if(!GetSessionID())
	{
		if(oCurrent.debug) alert("SCORM 1.2 Initialize: session ID is not obtained");
		return "false";
	}

	if(!GetParams())
	{
		if(oCurrent.debug) alert("SCORM 1.2 Initialize: initial parameters are not obtained");
		return "false";
	}
	if(oCurrent.response=="")
	{
		if(oCurrent.debug) alert("SCORM 1.2 Initialize: initial parameters are empty");
		return "false";
	}
	if(!ParseResponse())
	{
		if(oCurrent.debug) alert("SCORM 1.2 Initialize: initial parameters are not parsed");
		return "false";
	}
	oCurrent.session_timer = 0;
	oCurrent.session_time_to_send = 0;
	var dDate = new Date();
	oCurrent.alt_session_timer = dDate.valueOf();
	oCurrent.alt_session_time_to_send = 0;
	oCurrent.version = "1.2";
	oCurrent.state = "running";
	API.lastError = "0";
	return "true";
}

function Initialize(param)
{
	if(oCurrent.debug) alert("1.3");
	API_1484_11.lastError = "201"; //General Argument Error
	if(param!="")
	{
		if(oCurrent.debug) alert("SCORM 2004 Initialize: invalid parameter");
		return "false";
	}
	API_1484_11.lastError = "103"; //Already Initialized
	if(oCurrent.state=="running")
	{
		if(oCurrent.debug) alert("SCORM 2004 Initialize: attempt to initialize already initialized API session");
		return "false";
	}
	API_1484_11.lastError = "104"; //Content Instance Terminated
	if(oCurrent.state=="terminated")
	{
		if(oCurrent.debug) alert("SCORM 2004 Initialize: attempt to initialize already terminated API session");
		return "false";
	}
	API_1484_11.lastError = "102"; //General Initialization Failure
	if(oCurrent.debug) alert("Initialize: preparing to get Session ID");
	if(!GetSessionID())
	{
		if(oCurrent.debug) alert("SCORM 2004 Initialize: session ID is not obtained");
		return "false";
	}
	if(oCurrent.debug) alert("Initialize: preparing to get initial params");
	if(!GetParams())
	{
		if(oCurrent.debug) alert("SCORM 2004 Initialize: initial parameters are not obtained");
		return "false";
	}
	if(oCurrent.debug) alert("Initialize Response Text: " + oCurrent.response);
	if(oCurrent.response=="")
	{
		if(oCurrent.debug) alert("SCORM 2004 Initialize: initial parameters are empty");
		return "false";
	}
	if(oCurrent.debug) alert("Initialize: preparing to parse initial response");
	if(!ParseResponse())
	{
		if(oCurrent.debug) alert("SCORM 2004 Initialize: initial parameters are not parsed");
		return "false";
	}
	if(oCurrent.debug) alert("Initialize: No errors");
	oCurrent.session_timer = 0;
	oCurrent.session_time_to_send = 0;
	var dDate = new Date();
	oCurrent.alt_session_timer = dDate.valueOf();
	oCurrent.alt_session_time_to_send = 0;
	oCurrent.version = "1.3";
	oCurrent.state = "running";
	API_1484_11.lastError = "0";
	return "true";
}

function GetSessionID()
{
	if(API.session_id!=null && API.tracking_url!=null)
	{
		if(oCurrent.debug) alert("Initialize -> GetSessionID: preparing to API.session_id and API.tracking_url");
		if(API.session_id!="" && API.tracking_url!="")
		{
			oCurrent.session_id = API.session_id;
			oCurrent.tracking_url = API.tracking_url;
			return true;
		}
	}
	if(oCurrent.debug) alert("Initialize -> GetSessionID: preparing to find Course Window");
	if(courseWindow==null)
	{
		if(oCurrent.debug) alert("GetSessionID: course window not found");
		return false;
	}
	var sURL = unescape(courseWindow.location.search);
	if(sURL=="")
	{
		if(oCurrent.debug) alert("GetSessionID: course window URL contains no parameters");
		return false;
	}
	if(oCurrent.debug) alert("Initialize -> GetSessionID: URL part obtained: " + sURL);
	if(sURL.charAt(0)=="?") sURL = sURL.substr(1);
	var sTmp = sURL.toLowerCase();
	if(oCurrent.debug) alert("Initialize -> GetSessionID: preparing to parse session ID");
	if(sTmp.indexOf("aicc_sid")==-1)
	{
		if(oCurrent.debug) alert("GetSessionID: course window URL contains no session ID");
		return false;
	}
	if(sTmp.indexOf("aicc_url")==-1)
	{
		if(oCurrent.debug) alert("GetSessionID: course window URL contains no tracking URL");
		return false;
	}
	var aParams = sURL.split("&");
	if(aParams.length<2)
	{
		if(oCurrent.debug) alert("GetSessionID: course window URL contains not all parameters or misformed");
		return false;
	}
	var aParts;
	var bSID = false;
	var bSURL = false;
	if(oCurrent.debug) alert("Initialize -> GetSessionID: preparing to parse ID/URL");

	for(var i=0;i<aParams.length;i++)
	{
		aParts = aParams[i].split("=");
		if(aParts.length!=2) continue;
		if(aParts[0].toLowerCase()=="aicc_sid")
		{
			if(aParts[1]=="") continue;
			oCurrent.session_id = aParts[1];
			bSID = true;
			continue;
		}
		if(aParts[0].toLowerCase()=="aicc_url")
		{
			if(aParts[1]=="") continue;
			oCurrent.tracking_url = aParts[1];
			bSURL = true;
		}
	}
	if(!bSID)
	{
		if(oCurrent.debug) alert("GetSessionID: session ID is not parsed");
		return false;
	}
	if(!bSURL)
	{
		if(oCurrent.debug) alert("GetSessionID: tracking URL is not parsed");
		return false;
	}
	return true;
}

function GetParams()
{
	var command="command=GetParam&version=2.0&session_id="+escape(oCurrent.session_id)+"&AICC_Data=";
	oCurrent.last_command = "getparam";
	if(oCurrent.debug) alert("Initialize -> GetParams: preparing to send first request");
	try
	{
		var xmlhttp = CreateXMLHTTP();
		xmlhttp.open("POST",oCurrent.tracking_url,false);
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlhttp.send(command);
		if (xmlhttp.status==200)
		{
			oCurrent.response = xmlhttp.responseText;
			oCurrent.comm_error = "200";
			return true;
		}
		else
		{
			alert("XMLHTTP Get failed "+ xmlhttp.status);
			oCurrent.comm_error = xmlhttp.status;
			if(oCurrent.debug) alert("GetParams: communication error - " + oCurrent.comm_error);
			return false;
		}
	}
	catch(e)
	{
		if(oCurrent.debug) alert("GetParams: GetParam request failed. \nXMLHTTP error: " + e.description);
		return false;
	}
	if(oCurrent.debug) alert("Initialize -> GetParams: after sending first request");
	return false;
}

function ParseResponse()
{
	oCurrent.response = unescape(oCurrent.response);
	var sTmp = oCurrent.response.toLowerCase();
	if(oCurrent.debug) alert("Initialize -> ParseResponse: preparing to parse");

	if(sTmp.indexOf("error=0")==-1)
	{
		if(sTmp.indexOf("error=1")!=-1)
		{
			if(oCurrent.debug) alert("ParseResponse: invalid server command");
			return false;
		}
		if(sTmp.indexOf("error=2")!=-1)
		{
			if(oCurrent.debug) alert("ParseResponse: invalid AU-password");
			return false;
		}
		if(sTmp.indexOf("error=3")!=-1)
		{
			if(oCurrent.debug) alert("ParseResponse: invalid session ID");
			return false;
		}
		if(oCurrent.debug) alert("ParseResponse: unknown error (no ERROR=0 string found)");
		return false;
	}
	else
	{
		var iErrTextIndex = sTmp.indexOf("error_text=");
		if(iErrTextIndex!=-1)
		{
			alert(oCurrent.response.substr(iErrTextIndex+11));
		}
	}
	if(oCurrent.last_command=="putparam") return true;
	var aParts = new Array();
	var aIdx = new Array();
	if(oCurrent.last_command=="getparam")
	{
		if(sTmp.indexOf("[core]")==-1)
		{
			if(oCurrent.debug) alert("ParseResponse: no [CORE] section found)");
			return false;
		}
		else
		{
			aParts.push("[core]");
			aIdx.push(sTmp.indexOf("[core]"));
		}
		if(sTmp.indexOf("[core_lesson]")==-1)
		{
			if(oCurrent.debug) alert("ParseResponse: no [CORE_LESSON] section found)");
			return false;
		}
		else
		{
			aParts.push("[core_lesson]");
			aIdx.push(sTmp.indexOf("[core_lesson]"));
		}
		if(sTmp.indexOf("[core_vendor]")!=-1)
		{
			aParts.push("[core_vendor]");
			aIdx.push(sTmp.indexOf("[core_vendor]"));
		}
		if(sTmp.indexOf("[evaluation]")!=-1)
		{
			aParts.push("[evaluation]");
			aIdx.push(sTmp.indexOf("[evaluation]"));
		}
		if(sTmp.indexOf("[objectives_status]")!=-1)
		{
			aParts.push("[objectives_status]");
			aIdx.push(sTmp.indexOf("[objectives_status]"));
		}
		if(sTmp.indexOf("[student_data]")!=-1)
		{
			aParts.push("[student_data]");
			aIdx.push(sTmp.indexOf("[student_data]"));
		}
		if(sTmp.indexOf("[student_demographics]")!=-1)
		{
			aParts.push("[student_demographics]");
			aIdx.push(sTmp.indexOf("[student_demographics]"));
		}
		if(sTmp.indexOf("[student_preference]")!=-1)
		{
			aParts.push("[student_preference]");
			aIdx.push(sTmp.indexOf("[student_preference]"));
		}
		if(sTmp.indexOf("[comments]")!=-1)
		{
			aParts.push("[comments]");
			aIdx.push(sTmp.indexOf("[comments]"));
		}
	}

	var aIdxSorted = new Array();
	for(var i=0; i<aIdx.length;i++) aIdxSorted.push(aIdx[i]);
	aIdxSorted.sort(DoCompare);
	var aPartsSorted = new Array();
	for(var i=0;i<aParts.length;i++)
	{
		for(var j=0;j<aIdx.length;j++)
		{
			if(aIdx[i]==aIdxSorted[j])
			{
				aPartsSorted[j] = aParts[i];
				break;
			}
		}
	}
	var iStart,iEnd;
	var aTxt = new Array();
	for(var i=0;i<aPartsSorted.length;i++)
	{
		iStart = sTmp.indexOf(aPartsSorted[i]) + aPartsSorted[i].length;
		if(i<aPartsSorted.length-1)
		{
			iEnd = sTmp.indexOf(aPartsSorted[i+1]);
			aTxt[aPartsSorted[i]] = oCurrent.response.substring(iStart,iEnd);
		}
		else
		{
			aTxt[aPartsSorted[i]] = oCurrent.response.substr(iStart);
		}
	}

	if(aTxt["[core_lesson]"]!=null) cmi.suspend_data = unescape(trim(aTxt["[core_lesson]"], true, true, false, false));
	if(aTxt["[core_vendor]"]!=null) cmi.launch_data = unescape(trim(aTxt["[core_vendor]"], true, true, false, false));

	var splitter = String.fromCharCode(13,10);
	var vname = "";
	var vvalue = "";
	var tuples = "";
	var tuple = "";
	var vnames="";
/**parsing core section**/
	var vars = aTxt["[core]"].split(splitter);
	for(var i=0;i<vars.length;i++)
	{
		vnames = vars[i].split("=");
 		if(vnames.length==2)
		{
			vname = trim(vnames[0]);
			vvalue = trim(vnames[1]);
			vname = vname.toLowerCase();
			switch(vname)
			{
				case "student_id":
					if(vvalue!="")
					{
						cmi.learner_id = unescape(vvalue);
						cmi.core.student_id = cmi.learner_id;
					}
					else
					{
						cmi.learner_id = "No_Student_ID";
						cmi.core.student_id = "No_Student_ID";
					}
					break;
				case "student_name":
					if(vvalue!="")
					{
						cmi.core.student_name = unescape(vvalue);
						cmi.learner_name=vvalue;
					}
					else
					{

					}
					break;
				case "lesson_location":
					if(vvalue!="")
					{
						cmi.location = vvalue;
						cmi.core.lesson_location = cmi.location;
					}
					else
					{
						cmi.core.lesson_location = "";
						cmi.location = "";
					}
					break;
				case "lesson_mode":
					vvalue = vvalue.toLowerCase();
					cmi.core.lesson_mode = "normal";
					cmi.mode = "normal";
					if(vvalue!="")
					{
						vvalue = vvalue.charAt(0);
						switch(vvalue)
						{
							case "r":
								cmi.core.lesson_mode = "review";
								cmi.mode = "review";
								break;
							case "b":
								cmi.core.lesson_mode = "browse";
								cmi.mode = "browse";
								break;
							default:
								cmi.core.lesson_mode = "normal";
								cmi.mode = "normal";
								break;
						}
					}
					break;
				case "lesson_status":
					if(vvalue!="")
					{
						vvalue = trim(vvalue.toLowerCase());
						if(vvalue.indexOf(",")!=-1)
						{
							var aSt = vvalue.split(",");
							entrypoint = trim(aSt[1]);
							entrypoint = entrypoint.charAt(0);
						}
						vvalue = vvalue.charAt(0);
						if(vvalue!="i" && vvalue!="c" && vvalue!="p"  && vvalue!="f" && vvalue!="b")
						{
							cmi.core.lesson_status = "not attempted";
							cmi.completion_status = "not attempted";
							cmi.success_status = "unknown";
							entrypoint = "a";
						}
						else
						{
							switch(vvalue)
							{
								case "i":
									cmi.core.lesson_status = "incomplete";
									cmi.completion_status = "incomplete";
									cmi.success_status = "unknown";
									entrypoint = "r";
									break;
								case "c":
									cmi.core.lesson_status = "completed";
									cmi.completion_status = "completed";
									cmi.success_status = "unknown";
									entrypoint = "r";
									break;
								case "p":
									cmi.core.lesson_status = "passed";
									cmi.completion_status = "completed";
									cmi.success_status = "passed";
									entrypoint = "r";
									break;
								case "f":
									cmi.core.lesson_status = "failed";
									cmi.completion_status = "incomplete";
									cmi.success_status = "failed";
									entrypoint = "r";
									break;
								case 'b':
									cmi.core.lesson_status='browsed';
									cmi.completion_status='browsed';
									cmi.success_status = "unknown";
									entrypoint="r";
									break;
								default:
									cmi.core.lesson_status = "not attempted";
									cmi.completion_status = "not attempted";
									cmi.success_status = "unknown";
									entrypoint = "a";
									break;
							}
						}
					}
					else
					{
						cmi.core.lesson_status = "not attempted";
						cmi.completion_status = "not attempted";
						cmi.success_status = "unknown";
						entrypoint = "a";
					}
					if(entrypoint!="")
					{
						switch(entrypoint)
						{
							case "a":
								cmi.core.entry = "ab-initio";
								cmi.entry = "ab-initio";
								break;
							case "r":
								cmi.core.entry = "resume";
								cmi.entry = "resume";
								break;
							default:
								cmi.core.entry = "";
								cmi.entry = "";
								break;
						}
					}
					else
					{
						cmi.core.entry = "";
						cmi.entry = "";
					}
					break;
				case "credit":
					vvalue = vvalue.toLowerCase();
					if(vvalue!="")
					{
						vvalue = vvalue.charAt(0);
						switch(vvalue)
						{
							case "n":
								cmi.core.credit = "no-credit";
								cmi.credit = "no-credit";
								break;
							case "c":
								cmi.core.credit = "credit";
								cmi.credit = "credit";
								break;
							default:
								cmi.core.credit = "credit";
								cmi.credit = "credit";
								break;
						}
					}
					else
					{
						cmi.core.credit = "credit";
						cmi.credit = "credit";
					}
					break;
				case "time":
					var bCMI = (vvalue.indexOf(":")!=-1);
					var bISO = (vvalue.charAt(0)=="P");
					var sCMITime = "00:00:00";
					var sISOTime = "PT0H0M0S";
					if(bCMI)
					{
						cmi.total_time = ConvertCMITimespanToISO8601(vvalue);
						cmi.core.total_time = vvalue;
						oCurrent.total_time = ConvertCMITimespanToInteger(vvalue);
						break;
					}
					if(bISO)
					{
						cmi.total_time = vvalue;
						cmi.core.total_time = ConvertISO8601ToCMITimespan(vvalue);
						oCurrent.total_time = ConvertPeriodFromISO8601(vvalue);
						break;
					}
					cmi.total_time = sISOTime;
					cmi.core.total_time = sCMITime;
					oCurrent.total_time = 0;
					break;
				case "score":
					if(vvalue!="")
					{
						if(vvalue.indexOf(",")!=-1)
						{
							var tmpscore=vvalue.split(",");
						}
						else
						{
							var tmpscore = new Array(0);
							tmpscore[0] = vvalue;
						}
						cmi.core.score.raw = tmpscore[0];
						cmi.score.raw = tmpscore[0];
						if(tmpscore.length>1)
						{
							if(tmpscore[1]!=null)
							{
								cmi.core.score._max = tmpscore[1];
								cmi.score._max = tmpscore[1];
							}
							if(tmpscore[2]!=null)
							{
								cmi.core.score._min = tmpscore[2];
								cmi.score._min = tmpscore[2];
							}
							if(tmpscore[3]!=null)
							{
								cmi.score.scaled = tmpscore[3];
							}
						}
					}
					else
					{
						cmi.core.score.raw = "";
						cmi.score.raw = "";
					}
					break;
				default:
					break;
			}
		}
	}

/**parsing student_data section**/
	if(aTxt["[student_data]"]!=null)
	{
		var sTxt = aTxt["[student_data]"];
		if(sTxt.indexOf(splitter)!=-1)
		{
			vars = sTxt.split(splitter);
		}
		else
		{
			if(sTxt.indexOf(String.fromCharCode(10))!=-1)
			{
				vars = sTxt.split(String.fromCharCode(10));
			}
			else
			{
				vars = sTxt.split(String.fromCharCode(13));
			}
		}
		for(var i=0;i<vars.length;i++)
		{
			vnames = vars[i].split("=");
			if(vnames.length==2)
			{
				vname = trim(vnames[0]);
				vvalue = trim(vnames[1]);
				vname = vname.toLowerCase();
				switch(vname)
				{
					case "time_limit_action":
						vvalue = vvalue.toLowerCase();
						if(vvalue!="")
						{
							var aV = vvalue.split(",");
							var sTmp = "";
							if(aV[0].charAt(0)=="e") sTmp += "exit,";
							if(aV[0].charAt(0)=="c") sTmp += "continue,";
							if(aV.length<2)
							{
								sTmp += "no message";
							}
							else
							{
								if(aV[1].charAt(0)=="m") sTmp += "message";
								if(aV[1].charAt(0)=="n") sTmp += "no message";
							}
							cmi.time_limit_action = sTmp;
							cmi.student_data.time_limit_action = sTmp;
						}
						else
						{
							cmi.time_limit_action = "continue,no message";
							cmi.student_data.time_limit_action = "continue,no message";
						}
						break;
					case "max_time_allowed":
						var sTmp = ConvertCMITimespanToISO8601(vvalue);
						if(sTmp!="")
						{
							cmi.max_time_allowed = sTmp;
							cmi.student_data.max_time_allowed = vvalue;
						}
						else
						{
							cmi.max_time_allowed = "";
							cmi.student_data.max_time_allowed = "";
						}
						break;
					case "mastery_score":
						cmi.student_data.mastery_score = (vvalue!="") ? vvalue : "";
						break;
					case "scaled_passing_score":
						cmi.scaled_passing_score = (vvalue!="") ? vvalue : "";
						break;
					case "completion_treshold":
						cmi.completion_treshold = (vvalue!="") ? vvalue : "";
						break;
					default:
						break;
				}
			}
		}
	}

/**parsing evaluation section**/
	var oCurrentNode;
	var oChildNode;
	var aChildNodes;
	if(aTxt["[evaluation]"]!=null)
	{
		vars = aTxt["[evaluation]"].split(splitter);
		var iFirstRow = 0;
		for(var i=0;i<vars.length;i++)
		{
			if(vars[i].toLowerCase().indexOf("interaction_file")==-1) continue;
			iFirstRow = i;
			break;
		}
		var bIntXML = (aTxt["[evaluation]"].indexOf("<interactions>")!=-1 && aTxt["[evaluation]"].indexOf("</interactions>")!=-1);
		if(bIntXML)
		{
			var sInteractions = aTxt["[evaluation]"].substr(aTxt["[evaluation]"].indexOf("<interactions>"));
			sInteractions = sInteractions.substring(0, sInteractions.indexOf("</interactions>")+15);
			var oIntDoc = CreateDOMDocument();
			oIntDoc.loadXML(sInteractions);
			if(oIntDoc.xml!="")
			{
				aInteractions = oIntDoc.selectNodes("interactions/interaction");
				var sInteractionId = "";
				for(var i=0; i<aInteractions.length; i++)
				{
					oCurrentNode = aInteractions[i].selectSingleNode("interaction_id");
					if(oCurrentNode==null) continue;
					sInteractionId = oCurrentNode.text;
					if(sInteractionId==null || sInteractionId=="") continue;
					if(cmi.interactions[i]==null) cmi.interactions[i] = new Object();
					cmi.interactions[i].id = sInteractionId;

					oCurrentNode = aInteractions[i].selectSingleNode("type_interaction");
					cmi.interactions[i].type = (oCurrentNode==null) ? "" : oCurrentNode.text;

					oCurrentNode = aInteractions[i].selectSingleNode("time");
					if(oCurrentNode!=null)
					{
						cmi.interactions[i].timestamp = oCurrentNode.text;
						cmi.interactions[i].time = oCurrentNode.text;
					}

					oCurrentNode = aInteractions[i].selectSingleNode("latency");
					if(oCurrentNode!=null)
					{
						cmi.interactions[i].latency = oCurrentNode.text;
					}

					oCurrentNode = aInteractions[i].selectSingleNode("result");
					if(oCurrentNode!=null)
					{
						cmi.interactions[i].result = oCurrentNode.text;
					}

					oCurrentNode = aInteractions[i].selectSingleNode("student_response");
					if(oCurrentNode!=null)
					{
						cmi.interactions[i].learner_response = oCurrentNode.text;
						cmi.interactions[i].student_response = oCurrentNode.text;
					}

					oCurrentNode = aInteractions[i].selectSingleNode("weighting");
					if(oCurrentNode!=null)
					{
						cmi.interactions[i].weighting = oCurrentNode.text;
					}

					oCurrentNode = aInteractions[i].selectSingleNode("description");
					if(oCurrentNode!=null)
					{
						cmi.interactions[i].description = oCurrentNode.text;
					}

					oCurrentNode = aInteractions[i].selectSingleNode("correct_responses");
					if(oCurrentNode!=null)
					{
						aChildNodes = oCurrentNode.selectNodes("pattern");
						cmi.interactions[i].correct_responses = new Array();
						for(var j=0; j<aChildNodes.length; j++)
						{
							cmi.interactions[i].correct_responses.push(aChildNodes[j].text);
						}
					}

					oCurrentNode = aInteractions[i].selectSingleNode("objectives");
					if(oCurrentNode!=null)
					{
						aChildNodes = oCurrentNode.selectNodes("objective_id");
						cmi.interactions[i].objectives = new Array();
						for(var j=0; j<aChildNodes.length; j++)
						{
							cmi.interactions[i].objectives.push(aChildNodes[j].text);
						}
					}
				}
			}
		}
		else
		{
			var aNames = vars[iFirstRow].toLowerCase().split('","');
			if(aNames.length>1)
			{
				aNames[0] = aNames[0].substr(1);
				aNames[aNames.length-1] = aNames[aNames.length-1].substring(0,aNames[aNames.length-1].lastIndexOf('"'));
				var k = 0;
				for(var i=iFirstRow+1;i<vars.length;i++)
				{
					if(vars[i]=="") continue;
					aValues = vars[i].split('","');
					if(aValues.length!=aNames.length) break;
					aValues[0] = aValues[0].substr(1);
					aValues[aValues.length-1] = aValues[aValues.length-1].substring(0,aValues[aValues.length-1].lastIndexOf('"'));
					cmi.interactions[k] = new Object;
					lForLoop:
					for(var j=0;j<aValues.length;j++)
					{
						switch(aNames[j])
						{
							case "course_id":
							case "student_id":
							case "lesson_id":
							case "date": 				continue lForLoop;									break;
							case "interaction_id":		cmi.interactions[k].id = aValues[j]; 				break;
							case "time":				cmi.interactions[k].timestamp = aValues[j]; 		cmi.interactions[k].time = aValues[j];	 break;
							case "type_interaction":	cmi.interactions[k].type = aValues[j]; 				break;
							case "student_response":	cmi.interactions[k].learner_response = aValues[j]; 	cmi.interactions[k].student_response = aValues[j]; break;
							case "result":				cmi.interactions[k].result = aValues[j]; 			break;
							case "latency":				cmi.interactions[k].latency = aValues[j]; 			break;
							case "weighting":			cmi.interactions[k].weighting = aValues[j]; 		break;
							case "description":			cmi.interactions[k].description = aValues[j]; 		break;
							case "correct_responses":
								aValues[j] = aValues[j].substring(aValues[j].indexOf("{"),aValues[j].lastIndexOf("}"));
								cmi.interactions[k].correct_responses = aValues[j].split("}{");
								break;
							case "objective_id":
								aValues[j] = aValues[j].substring(aValues[j].indexOf("{"),aValues[j].lastIndexOf("}"));
								cmi.interactions[k].objectives = aValues[j].split("}{");
								break;
							default: break;
						}
					}
					k++;
				}
			}
		}
	}
//	cmi._interactions._children_12 = "id,type,objectives,time,correct_responses,weighting,student_response,result,latency";
//	cmi._interactions._children_13 = "id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description";


/**parsing objectives_status section**/
	if(aTxt["[objectives_status]"]!=null)
	{
		var bObjXML = (aTxt["[objectives_status]"].indexOf("<objectives>")!=-1 && aTxt["[objectives_status]"].indexOf("</objectives>")!=-1);
		if(bObjXML)
		{
			var sObjectivesStatus = aTxt["[objectives_status]"].substr(aTxt["[objectives_status]"].indexOf("<objectives>"));
			sObjectivesStatus = sObjectivesStatus.substring(0, sObjectivesStatus.indexOf("</objectives>")+13);
			var oObjDoc = CreateDOMDocument();
			oObjDoc.loadXML(sObjectivesStatus);
			if(oObjDoc.xml!="")
			{
				var aObjectives = oObjDoc.selectNodes("objectives/objective");
				var sObjectiveId = "";
				var sObjectiveScore = "";
				var sRaw = 0;
				var sMin = 0;
				var sMax = 0;
				var sScaled = 0;
				var aSplitted;
				for(var i=0; i<aObjectives.length; i++)
				{
					oCurrentNode = aObjectives[i].selectSingleNode("objective_id");
					if(oCurrentNode==null) continue;
					sObjectiveId = oCurrentNode.text;
					if(sObjectiveId==null || sObjectiveId=="") continue;
					if(cmi.objectives[i]==null) cmi.objectives[i] = new Object();
					cmi.objectives[i].id = sObjectiveId;
					oCurrentNode = aObjectives[i].selectSingleNode("score");
					if(oCurrentNode!=null)
					{
						cmi.objectives[i].score = new Object();
						if(oCurrentNode.text.indexOf(",")!=-1)
						{
							aSplitted = oCurrentNode.text.split(",");
							if(aSplitted.length==0) 	cmi.objectives[i].score.raw = "";
							if(aSplitted.length>0) 	cmi.objectives[i].score.raw = aSplitted[0];
							if(aSplitted.length>1) 	cmi.objectives[i].score._max = aSplitted[1];
							if(aSplitted.length>2) 	cmi.objectives[i].score._min = aSplitted[2];
							if(aSplitted.length>3) 	cmi.objectives[i].score.scaled = aSplitted[3];
						}
						else
						{
							oChildNode = oCurrentNode.selectSingleNode("raw");
							if(oChildNode!=null) cmi.objectives[i].score.raw = oChildNode.text;
							oChildNode = oCurrentNode.selectSingleNode("min");
							if(oChildNode!=null) cmi.objectives[i].score._min = oChildNode.text;
							oChildNode = oCurrentNode.selectSingleNode("max");
							if(oChildNode!=null) cmi.objectives[i].score._max = oChildNode.text;
							oChildNode = oCurrentNode.selectSingleNode("scaled");
							if(oChildNode!=null) cmi.objectives[i].score.scaled = oChildNode.text;
						}
					}
					oCurrentNode = aObjectives[i].selectSingleNode("status");
					if(oCurrentNode!=null)
					{
						cmi.objectives[i].status = oCurrentNode.text;
						switch(oCurrentNode.text.toLowerCase().charAt(0))
						{
							case "n":
								cmi.objectives[i].completion_status = "not attempted";
								cmi.objectives[i].success_status = "unknown";
								break;
							case "i":
								cmi.objectives[i].completion_status = "incomplete";
								cmi.objectives[i].success_status = "unknown";
								break;
							case "c":
								cmi.objectives[i].completion_status = "completed";
								cmi.objectives[i].success_status = "unknown";
								break;
							case "p":
								cmi.objectives[i].completion_status = "completed";
								cmi.objectives[i].success_status = "passed";
								break;
							case "f":
								cmi.objectives[i].completion_status = "completed";
								cmi.objectives[i].success_status = "failed";
								break;
							default:
								cmi.objectives[i].completion_status = "not attempted";
								cmi.objectives[i].success_status = "unknown";
								break;
						}
					}
					oCurrentNode = aObjectives[i].selectSingleNode("success_status");
					if(oCurrentNode!=null)
					{
						switch(oCurrentNode.text.toLowerCase().charAt(0))
						{
							case "p": cmi.objectives[i].success_status = "passed"; break;
							case "f": cmi.objectives[i].success_status = "failed"; break;
							case "u":
							default:  cmi.objectives[i].success_status = "unknown"; break;
						}
					}
					oCurrentNode = aObjectives[i].selectSingleNode("completion_status");
					if(oCurrentNode!=null)
					{
						switch(oCurrentNode.text.toLowerCase().charAt(0))
						{
							case "c": cmi.objectives[i].success_status = "completed"; break;
							case "i": cmi.objectives[i].success_status = "incomplete"; break;
							case "n":
							default:  cmi.objectives[i].success_status = "not attempted"; break;
						}
					}
					oCurrentNode = aObjectives[i].selectSingleNode("description");
					if(oCurrentNode!=null)
					{
						cmi.objectives[i].description = oCurrentNode.text;
					}
				}
			}
		}
		else
		{
			vars = aTxt["[objectives_status]"].split(splitter);
			var aV;
			var iIdx = 0;
			for(var i=0;i<vars.length;i++)
			{
				if(vars[i].indexOf("=")==-1) continue;
				vnames = vars[i].split("=");
				if(vnames.length!=2) continue;
				vname = trim(vnames[0]);
				vvalue = trim(vnames[1]);
				aV = vname.split(".");
				if(aV.length!=2) continue;
				vname = aV[0];
				iIdx = parseInt(aV[1],10);
				if(isNaN(iIdx)) continue;
				switch(vname.toLowerCase())
				{
					case "j_id":
						if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
						cmi.objectives[iIdx].id = vvalue;
						break;
					case "j_score":
						if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
						cmi.objectives[iIdx].score = new Object;
						aV = vvalue.split(",");
						if(aV.length==0) 	cmi.objectives[iIdx].score.raw = "";
						if(aV.length>0) 	cmi.objectives[iIdx].score.raw = aV[0];
						if(aV.length>1) 	cmi.objectives[iIdx].score._max = aV[1];
						if(aV.length>2) 	cmi.objectives[iIdx].score._min = aV[2];
						if(aV.length>3) 	cmi.objectives[iIdx].score.scaled = aV[3];
						break;
					case "j_status":
						if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
						cmi.objectives[iIdx].status = vvalue;
						switch(vvalue.toLowerCase().charAt(0))
						{
							case "n":
								cmi.objectives[iIdx].completion_status = "not attempted";
								cmi.objectives[iIdx].success_status = "unknown";
								break;
							case "i":
								cmi.objectives[iIdx].completion_status = "incomplete";
								cmi.objectives[iIdx].success_status = "unknown";
								break;
							case "c":
								cmi.objectives[iIdx].completion_status = "completed";
								cmi.objectives[iIdx].success_status = "unknown";
								break;
							case "p":
								cmi.objectives[iIdx].completion_status = "completed";
								cmi.objectives[iIdx].success_status = "passed";
								break;
							case "f":
								cmi.objectives[iIdx].completion_status = "completed";
								cmi.objectives[iIdx].success_status = "failed";
								break;
							default:
								cmi.objectives[iIdx].completion_status = "not attempted";
								cmi.objectives[iIdx].success_status = "unknown";
								break;
						}
						break;
					case "j_description":
						if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
						cmi.objectives[iIdx].description = vvalue;
						break;
					default: break;
				}
			}
		}
	}
//	cmi._objectives._children_12 = "id,score,status";
//	cmi._objectives._children_13 = "id,score,success_status,completion_status,description";

/**parsing student_preferences section**/
	if(aTxt["[student_preference]"]!=null)
	{

		var sTxt = aTxt["[student_preference]"];
		if(sTxt.indexOf(splitter)!=-1)
		{
			vars = sTxt.split(splitter);
		}
		else
		{
			if(sTxt.indexOf(String.fromCharCode(10))!=-1)
			{
				vars = sTxt.split(String.fromCharCode(10));
			}
			else
			{
				vars = sTxt.split(String.fromCharCode(13));
			}
		}
		for(var i=0;i<vars.length;i++)
		{
			if(vars[i].indexOf("=")==-1) continue;
			vnames = vars[i].split("=");
			if(vnames.length!=2) continue;
			vname = trim(vnames[0]);
			vvalue = trim(vnames[1]);
			switch(vname.toLowerCase())
			{
				case "audio":
					cmi.student_preference.audio = vvalue;
					cmi.learner_preference.audio_level = vvalue;
					break;
				case "language":
					cmi.student_preference.language = vvalue;
					cmi.learner_preference.language = vvalue;
					break;
				case "speed":
					cmi.student_preference.speed = vvalue;
					cmi.learner_preference.delivery_speed = vvalue;
					break;
				case "text":
					cmi.student_preference._text = vvalue;
					cmi.learner_preference.audio_captioning = vvalue;
					break;
				default: break;
			}
		}
	}

/**parsing comments section**/
	if(aTxt["[comments]"]!=null)
	{
		cmi.comments = Trim(aTxt["[comments]"]);
	}
	return true;
}

function LMSFinish(LMSFiParam)
{
	if(LMSCommit()=="true")
	{
		oCurrent.tracking_url="";
		oCurrent.session_id="";
		oCurrent.state = "terminated"
		return true;
	}
	return false;
}

function LMSGetValue(LMSGVParam)
{
	if(oCurrent.debug) alert("GetValue: "+LMSGVParam);
	if(oCurrent.command_log)
	{
		oCurrent.getvalue_log += "\r\n"+Date().toLocaleString()+" GetValue. Param: "+LMSGVParam;
	}
	var returnValue = "";
	API.lastError="401"; //Not implemented
	API_1484_11.lastError = "401"; //Not implemented

	if(LMSGVParam==null || LMSGVParam=="")
	{
		returnValue = "";
		oCurrent.version=="1.3" ? API_1484_11.lastError = "301" : API.lastError="201"; // Data Model Element Not Specified
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Not Specified");
		return returnValue;
	}
	if(oCurrent.state=="na")
	{
		oCurrent.version=="1.3" ? API_1484_11.lastError = "122" : API.lastError="301"; // GetValue before initialization
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" before initialization");
		return returnValue;
	}
	if(oCurrent.state=="terminated")
	{
		oCurrent.version=="1.3" ? API_1484_11.lastError = "123" : API.lastError="101"; // GetValue after termination
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" after termination");
		return returnValue;
	}
	if(oCurrent.state!="running")
	{
		oCurrent.version=="1.3" ? API_1484_11.lastError = "101" : API.lastError="101"; // General exception
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - API is not running");
		return returnValue;
	}

	if(LMSGVParam.indexOf("cmi.interactions.")==0)
	{
		var sStr = LMSGVParam.substr(17);
		if(sStr.indexOf(".")==-1)
		{
			if(sStr=="_count")
			{
				returnValue = cmi.interactions.length.toString();
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			}
			if(sStr=="_children")
			{
				returnValue = oCurrent.version=="1.3" ? cmi._interactions._children_13 : cmi._interactions._children_12;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			}
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
			return returnValue;
		}
		var sIdx = sStr.substring(0, sStr.indexOf("."));
		var iIdx = parseInt(sIdx,10);
		if(isNaN(iIdx))
		{
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
			return returnValue;
		}
		if(cmi.interactions[iIdx]==null)
		{
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
			return returnValue;
		}
		sStr = sStr.substr(sStr.indexOf(".")+1);
		if(sStr.indexOf("objectives.")==0)
		{
			sStr = sStr.substr(sStr.indexOf(".")+1);
			if(cmi.interactions[iIdx].objectives==null)
			{
				cmi.interactions[iIdx].objectives = new Array();
			}
			if(sStr=="_count")
			{
				returnValue = cmi.interactions[iIdx].objectives.length.toString();
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			}
			if(sStr=="_children")
			{
				returnValue = oCurrent.version=="1.3" ? cmi._interactions._objectives._children_13 : cmi._interactions._objectives._children_12;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			}
			var sIx = sStr.substring(0, sStr.indexOf("."));
			var iIx = parseInt(sIx,10);
			if(isNaN(iIx))
			{
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
				return returnValue;
			}
			if(cmi.interactions[iIdx].objectives[iIx]==null)
			{
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
				return returnValue;
			}
			sStr = sStr.substr(sStr.indexOf(".")+1);
			if(sStr.indexOf(".")!=-1)
			{
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
				return returnValue;
			}
			switch(sStr)
			{
				case "id":
					if(cmi.interactions[iIdx].objectives[iIx].id==null || cmi.interactions[iIdx].objectives[iIx].id=="")
					{
						returnValue = "";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
						if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
						return returnValue;
					}
					returnValue = cmi.interactions[iIdx].objectives[iIx].id;
					oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
					return returnValue;
				default:
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
					return returnValue;
			}
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
			return returnValue;
		}
		if(sStr.indexOf("correct_responses.")==0)
		{
			sStr = sStr.substr(sStr.indexOf(".")+1);
			if(cmi.interactions[iIdx].correct_responses==null)
			{
				cmi.interactions[iIdx].correct_responses = new Array();
			}
			if(sStr=="_count")
			{
				returnValue = cmi.interactions[iIdx].correct_responses.length.toString();
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			}
			if(sStr=="_children")
			{
				returnValue = oCurrent.version=="1.3" ? cmi._interactions._correct_responses._children_13 : cmi._interactions._correct_responses._children_12;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			}
			var sIx = sStr.substring(0, sStr.indexOf("."));
			var iIx = parseInt(sIx,10);
			if(isNaN(iIx))
			{
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
				return returnValue;
			}
			if(cmi.interactions[iIdx].correct_responses[iIx]==null)
			{
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
				return returnValue;
			}
			sStr = sStr.substr(sStr.indexOf(".")+1);
			if(sStr.indexOf(".")!=-1) {
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
				return returnValue;
			}
			switch(sStr)
			{
				case "pattern":
					if(cmi.interactions[iIdx].correct_responses[iIx].pattern==null || cmi.interactions[iIdx].correct_responses[iIx].pattern=="")
					{
						returnValue = "";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
						if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
						return returnValue;
					}
					returnValue = cmi.interactions[iIdx].correct_responses[iIx].pattern;
					oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
					return returnValue;
				default:
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
					return returnValue;
			}
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
			return returnValue;
		}
		if(sStr.indexOf(".")!=-1)
		{
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
			return returnValue;
		}
		switch(sStr)
		{
			case "id":
				if(cmi.interactions[iIdx].id==null || cmi.interactions[iIdx].id=="")
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].id;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "type":
				if(cmi.interactions[iIdx].type==null || cmi.interactions[iIdx].type=="")
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].type;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "result":
				if(cmi.interactions[iIdx].result==null || cmi.interactions[iIdx].result=="")
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].result;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "weighting":
				if(cmi.interactions[iIdx].weighting==null || cmi.interactions[iIdx].weighting=="")
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].weighting;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "latency":
				if(cmi.interactions[iIdx].latency==null || cmi.interactions[iIdx].latency=="")
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].latency;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "time":
				if(oCurrent.version=="1.3")
				{
					returnValue = "";
					API_1484_11.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Not recognized element");
					return returnValue;
				}
				if(cmi.interactions[iIdx].time==null || cmi.interactions[iIdx].time=="")
				{
					returnValue = "";
					API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].time;
				API.lastError="0";
				return returnValue;
			case "timestamp":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Not recognized element");
					return returnValue;
				}
				if(cmi.interactions[iIdx].timestamp==null || cmi.interactions[iIdx].timestamp=="")
				{
					returnValue = "";
					API_1484_11.lastError = "402"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].timestamp;
				API_1484_11.lastError = "0";
				return returnValue;
			case "student_response":
				if(oCurrent.version=="1.3")
				{
					returnValue = "";
					API_1484_11.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Not recognized element");
					return returnValue;
				}
				if(cmi.interactions[iIdx].student_response==null || cmi.interactions[iIdx].student_response=="")
				{
					returnValue = "";
					API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].student_response;
				API.lastError="0";
				return returnValue;
			case "learner_response":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Not recognized element");
					return returnValue;
				}
				if(cmi.interactions[iIdx].learner_response==null || cmi.interactions[iIdx].learner_response=="")
				{
					returnValue = "";
					API_1484_11.lastError = "402"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].learner_response;
				API_1484_11.lastError = "0";
				return returnValue;
			case "description":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Not recognized element");
					return returnValue;
				}
				if(cmi.interactions[iIdx].description==null || cmi.interactions[iIdx].description=="")
				{
					returnValue = "";
					API_1484_11.lastError = "402"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.interactions[iIdx].description;
				API_1484_11.lastError = "0";
				return returnValue;
			default:
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
				return returnValue;
		}
		returnValue = "";
		oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
		return returnValue;
	}

	if(LMSGVParam.indexOf("cmi.objectives.")!=-1)
	{
		var sStr = LMSGVParam.substr(15);
		if(sStr.indexOf(".")==-1)
		{
			if(sStr=="_count")
			{
				returnValue = cmi.objectives.length.toString();
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			}
			if(sStr=="_children")
			{
				returnValue = oCurrent.version=="1.3" ? cmi._objectives._children_13 : cmi._objectives._children_12;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			}
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
			return returnValue;
		}
		var sIdx = sStr.substring(0, sStr.indexOf("."));
		var iIdx = parseInt(sIdx,10);
		if(isNaN(iIdx))
		{
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
			return returnValue;
		}
		if(cmi.objectives[iIdx]==null)
		{
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
			return returnValue;
		}
		sStr = sStr.substr(sStr.indexOf(".")+1);
		if(sStr.indexOf(".")!=-1)
		{
			if(sStr.indexOf("score.")==0)
			{
				var aStr = sStr.split(".");
				if(aStr.length>2)
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
					return returnValue;
				}
				if(cmi.objectives[iIdx].score==null)
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				switch(aStr[1])
				{
					case "_children":
						returnValue = oCurrent.version=="1.3" ? cmi._objectives.score._children_13 : cmi._objectives.score._children_12;
						oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
						return returnValue;
					case "raw":
						if(cmi.objectives[iIdx].score.raw==null)
						{
							returnValue = "";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
							return returnValue;
						}
						returnValue = cmi.objectives[iIdx].score.raw;
						oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
						return returnValue;
					case "max":
						if(cmi.objectives[iIdx].score._max==null)
						{
							returnValue = "";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
							return returnValue;
						}
						returnValue = cmi.objectives[iIdx].score._max;
						oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
						return returnValue;
					case "min":
						if(cmi.objectives[iIdx].score._min==null)
						{
							returnValue = "";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
							return returnValue;
						}
						returnValue = cmi.objectives[iIdx].score._min;
						oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
						return returnValue;
					case "scaled":
						if(oCurrent.version=="1.2")
						{
							returnValue = "";
							API.lastError="401"; // Not recognized element
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
							return returnValue;
						}
						if(cmi.objectives[iIdx].score.scaled==null)
						{
							returnValue = "";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
							return returnValue;
						}
						returnValue = cmi.objectives[iIdx].score.scaled;
						oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
						return returnValue;
					default:
						returnValue = "";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
						if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
						return returnValue;
				}
			}
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
			return returnValue;
		}
		switch(sStr)
		{
			case "id":
				if(cmi.objectives[iIdx].id==null)
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.objectives[iIdx].id;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "status":
				if(oCurrent.version=="1.3")
				{
					returnValue = "";
					API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
					return returnValue;
				}
				if(cmi.objectives[iIdx].status==null)
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.objectives[iIdx].status;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "completion_status":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
					return returnValue;
				}
				if(cmi.objectives[iIdx].completion_status==null)
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.objectives[iIdx].completion_status;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "success_status":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
					return returnValue;
				}
				if(cmi.objectives[iIdx].success_status==null)
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.objectives[iIdx].success_status;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "description":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
					return returnValue;
				}
				if(cmi.objectives[iIdx].description==null)
				{
					returnValue = "";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "402" : API.lastError="201"; // Data Model Element Value Not Initialized/Argument error
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - Data Model Element Value Not Initialized");
					return returnValue;
				}
				returnValue = cmi.objectives[iIdx].description;
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			default:
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
				return returnValue;
		}
		returnValue = "";
		oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element");
		return returnValue;
	}

	if(LMSGVParam.indexOf("cmi.comments_from_learner")!=-1)
	{
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" failed");
		return returnValue;
	}
	if(LMSGVParam.indexOf("cmi.comments_from_lms")!=-1)
	{
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" failed");
		return returnValue;
	}
	if(LMSGVParam.indexOf("cmi.comments")!=-1)
	{
		API.lastError = "0";
		API_1484_11.lastError = "0";
		return cmi.comments;
	}
	if(LMSGVParam.indexOf("cmi.learner_preference")!=-1)
	{
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" failed");
		return returnValue;
	}
	if(LMSGVParam.indexOf("cmi.student_preference")!=-1)
	{
		if(oCurrent.version=="1.3")
		{	API_1484_11.lastError = "401";
			return "";
		}
		var aNames = LMSGVParam.split(".");
		if(aNames.length!=3)
		{
			API.lastError = "201";
			return "";
		}
		API.lastError = "0";
		switch(aNames[2])
		{
			case "_children":
			{
				return cmi.student_preference._children;
			}
			case "audio":
			{
				return cmi.student_preference.audio;
			}
			case "language":
			{
				return cmi.student_preference.language;
			}
			case "speed":
			{
				return cmi.student_preference.speed;
			}
			case "text":
			{
				return cmi.student_preference._text;
			}
		}
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" failed");
		return returnValue;
	}
	if(LMSGVParam.indexOf("cmi.student_data")!=-1)
	{
		if(oCurrent.version=="1.3")
		{	API_1484_11.lastError = "401";
			return "";
		}
		var aNames = LMSGVParam.split(".");
		if(aNames.length!=3)
		{
			API.lastError = "201";
			return "";
		}
		API.lastError = "0";
		switch(aNames[2])
		{
			case "_children":
			{
				return cmi.student_data._children;
			}
			case "mastery_score":
			{
				return cmi.student_data.mastery_score;
			}
			case "max_time_allowed":
			{
				return cmi.student_data.max_time_allowed;
			}
			case "time_limit_action":
				return cmi.student_data.time_limit_action;
		}
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" failed");
		return returnValue;
	}
	if(LMSGVParam.indexOf("._count")!=-1)
	{
		if(oCurrent.version=="1.3")
		{
			if(LMSGVParam!="cmi.comments_from_learner._count" && LMSGVParam!="cmi.comments_from_lms._count" && LMSGVParam!="cmi.interactions._count" && LMSGVParam.indexOf(".objectives._count")==-1 &&  LMSGVParam.indexOf(".correct_responses._count")==-1)
			{
				returnValue = "";
				API_1484_11.lastError="301";
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - cannot have count");
				return returnValue;
			}
		}
		if(oCurrent.version=="1.2")
		{
			if(LMSGVParam!="cmi.interactions._count" && LMSGVParam.indexOf(".objectives._count")==-1 &&  LMSGVParam.indexOf(".correct_responses._count")==-1)
			{
				returnValue = "";
				API.lastError="203";
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - cannot have count");
				return returnValue;
			}
		}
	}
	switch(LMSGVParam)
	{
		case "cmi._children":
			returnValue = oCurrent.version=="1.3" ? cmi._children_13 : cmi._children_12;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			break;
		case "cmi.core._children":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core._children;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.core.score._children":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.score._children;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.score._children":
			returnValue = oCurrent.version=="1.3" ? cmi.score._children : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi._version":
			returnValue = oCurrent.version=="1.3" ? "1.0" : "3.4";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			break;
		case "cmi.core.student_id":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.student_id;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.learner_id":
			returnValue = oCurrent.version=="1.3" ? cmi.learner_id : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.student_name":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.student_name;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.learner_name":
			returnValue = oCurrent.version=="1.3" ? cmi.learner_name : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.lesson_location":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.lesson_location;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.location":
			returnValue = oCurrent.version=="1.3" ? cmi.location : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.credit":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.credit;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.credit":
			returnValue = oCurrent.version=="1.3" ? cmi.credit : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.lesson_status":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.lesson_status;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.completion_status":
			returnValue = oCurrent.version=="1.3" ? cmi.completion_status : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.success_status":
			returnValue = oCurrent.version=="1.3" ? cmi.success_status : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.entry":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.entry;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.entry":
			returnValue = oCurrent.version=="1.3" ? cmi.entry : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.total_time":
			UpdateTotalTime();
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.total_time;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.total_time":
			UpdateTotalTime();
			returnValue = oCurrent.version=="1.3" ? cmi.total_time : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.lesson_mode":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.lesson_mode;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.mode":
			returnValue = oCurrent.version=="1.3" ? cmi.mode : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.exit":
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="404"; // Not recognized element in 2004 / Write-only in 1.2
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - write-only element");
			break;
		case "cmi.exit":
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "405" : API.lastError="401"; // Not implemented element in 1.2 / Write-only in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - write-only element");
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.session_time":
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="404"; // Not recognized element in 2004 / Write-only in 1.2
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - write-only element");
			break;
		case "cmi.session_time":
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "405" : API.lastError="401"; // Not implemented element in 1.2 / Write-only in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - write-only element");
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.score.raw":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.score.raw;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.score.raw":
			returnValue = oCurrent.version=="1.3" ? cmi.score.raw : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.score.max":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.score._max;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.score.max":
			returnValue = oCurrent.version=="1.3" ? cmi.score._max : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.core.score.min":
			returnValue = oCurrent.version=="1.3" ? "" : cmi.core.score._min;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="0"; // Not recognized element in 2004
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 2004");
			break;
		case "cmi.score.min":
			returnValue = oCurrent.version=="1.3" ? cmi.score._max : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.score.scaled":
			returnValue = oCurrent.version=="1.3" ? cmi.score.scaled : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
//[end of core data] [start of junkbox]
		case "cmi.suspend_data":
			returnValue = cmi.suspend_data;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			break;
		case "cmi.launch_data":
			returnValue = cmi.launch_data;
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			break;
		case "cmi.completion_threshold":
			returnValue = oCurrent.version=="1.3" ? cmi.completion_threshold : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.max_time_allowed":
			returnValue = oCurrent.version=="1.3" ? cmi.max_time_allowed : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.progress_measure":
			returnValue = oCurrent.version=="1.3" ? cmi.progress_measure : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.scaled_passing_score":
			returnValue = oCurrent.version=="1.3" ? cmi.scaled_passing_score : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" GetValue: "+LMSGVParam+" - not recognized element in 1.2");
			break;
		case "cmi.time_limit_action":
			returnValue = oCurrent.version=="1.3" ? cmi.progress_measure : "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="401"; //Not implemented in 1.2
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 1.2");
			break;
		default:
			break;
	}
//	alert('GetValue '+LMSGVParam+'='+returnValue);
	if(oCurrent.command_log)
	{
		oCurrent.getvalue_log += " Return: "+returnValue;
	}
	return returnValue;
}

function UpdateTotalTime()
{
	var iTotalTime = ConvertPeriodFromISO8601(cmi.total_time);
	var iSessionTime = ConvertPeriodFromISO8601(cmi.session_time);
	iTotalTime += iSessionTime;
	iSessionTime = 0;
	cmi.total_time = ConvertPeriodToISO8601(iTotalTime);
	cmi.core.total_time = ConvertIntegerToCMITimespan(iTotalTime);
	cmi.session_time = ConvertPeriodToISO8601(iSessionTime);
	cmi.core.session_time = ConvertIntegerToCMITimespan(iSessionTime);
}


function LMSSetValue(LMSSVParam,LMSSVValue)
{
	if(oCurrent.debug) alert("SetValue: "+LMSSVParam);
	if(oCurrent.command_log)
	{
		oCurrent.setvalue_log += "\r\n"+Date().toLocaleString()+" SetValue. Param: "+LMSSVParam+" Value: "+LMSSVValue;
	}
	var returnValue = "";
	API.lastError="401"; //Not implemented
	API_1484_11.lastError = "401"; //Not implemented

	if(LMSSVParam==null || LMSSVParam=="" || LMSSVValue==null)
	{
		returnValue = "";
		oCurrent.version=="1.3" ? API_1484_11.lastError = "301" : API.lastError="201"; // Data Model Element Not Specified
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Not Specified");
		return returnValue;
	}
	if(oCurrent.state=="na")
	{
		oCurrent.version=="1.3" ? API_1484_11.lastError = "132" : API.lastError="301"; // SetValue before initialization
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" before initialization");
		return returnValue;
	}
	if(oCurrent.state=="terminated")
	{
		oCurrent.version=="1.3" ? API_1484_11.lastError = "133" : API.lastError="101"; // SetValue after termination
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" after termination");
		return returnValue;
	}
	if(oCurrent.state!="running")
	{
		oCurrent.version=="1.3" ? API_1484_11.lastError = "101" : API.lastError="101"; // General exception
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - API is not running");
		return returnValue;
	}

	if(LMSSVParam.indexOf("cmi.interactions.")==0)
	{
		var sStr = LMSSVParam.substr(17);
		if(sStr.indexOf(".")==-1)
		{
			if(sStr=="_count")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
				return returnValue;
			}
			if(sStr=="_children")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
				return returnValue;
			}
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized element");
			return returnValue;
		}
		var sIdx = sStr.substring(0, sStr.indexOf("."));
		var iIdx = parseInt(sIdx,10);
		if(isNaN(iIdx))
		{
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized element");
			return returnValue;
		}
		if(cmi.interactions[iIdx]==null)
		{
			if(iIdx>cmi.interactions.length)
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "403" : API.lastError="405"; // Data Model Element Value Not Initialized
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Not Initialized");
				return returnValue;
			}
			if(iIdx==cmi.interactions.length)
			{
				cmi.interactions[iIdx] = new Object;
			}
		}
		sStr = sStr.substr(sStr.indexOf(".")+1);
		if(sStr.indexOf("objectives.")==0)
		{
			sStr = sStr.substr(sStr.indexOf(".")+1);
			if(sStr=="_count")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
				return returnValue;
			}
			if(sStr=="_children")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
				return returnValue;
			}
			var sIx = sStr.substring(0, sStr.indexOf("."));
			var iIx = parseInt(sIx,10);
			if(isNaN(iIx))
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
				return returnValue;
			}
			sStr = sStr.substr(sStr.indexOf(".")+1);
			if(sStr.indexOf(".")!=-1)
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
				return returnValue;
			}
			switch(sStr)
			{
				case "id":
					if(cmi.interactions[iIdx].objectives==null)
					{
						cmi.interactions[iIdx].objectives = new Array();
					}
					if(cmi.interactions[iIdx].objectives[iIx]==null)
					{
						if(iIx>cmi.interactions[iIdx].objectives.length)
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "407" : API.lastError="405"; // Data Model Element Value Not Initialized/Argument error
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - index is out of order");
							return returnValue;
						}
						cmi.interactions[iIdx].objectives[iIx] = new Object;
					}
					if(typeof LMSSVValue != "string")
					{
						returnValue = "false";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
						if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
						return returnValue;
					}
					returnValue = "true";
					cmi.interactions[iIdx].objectives[iIx].id = LMSSVValue;
					oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
					return returnValue;
				default:
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
					return returnValue;
			}
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
			return returnValue;
		}
		if(sStr.indexOf("correct_responses.")==0)
		{
			sStr = sStr.substr(sStr.indexOf(".")+1);
			if(sStr=="_count")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
				return returnValue;
			}
			if(sStr=="_children")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
				return returnValue;
			}
			var sIx = sStr.substring(0, sStr.indexOf("."));
			var iIx = parseInt(sIx,10);
			if(isNaN(iIx))
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
				return returnValue;
			}
			sStr = sStr.substr(sStr.indexOf(".")+1);
			if(sStr.indexOf(".")!=-1)
			{
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
				return returnValue;
			}
			switch(sStr)
			{
				case "pattern":
					if(cmi.interactions[iIdx].correct_responses==null)
					{
						cmi.interactions[iIdx].correct_responses = new Array();
					}
					if(cmi.interactions[iIdx].correct_responses[iIx]==null)
					{
						if(iIx>cmi.interactions[iIdx].correct_responses.length)
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "407" : API.lastError="405"; // Data Model Element Value Not Initialized/Argument error
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - index is out of order");
							return returnValue;
						}
						cmi.interactions[iIdx].correct_responses[iIx] = new Object;
					}
					if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
					{
						returnValue = "false";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
						if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
						return returnValue;
					}
					returnValue = "true";
					cmi.interactions[iIdx].correct_responses[iIx].pattern = LMSSVValue;
					oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
					return returnValue;
				default:
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
					return returnValue;
			}
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
			return returnValue;
		}
		if(sStr.indexOf(".")!=-1)
		{
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
			return returnValue;
		}
		switch(sStr)
		{
			case "id":
				if(typeof LMSSVValue != "string")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				cmi.interactions[iIdx].id = LMSSVValue;
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "type":
				if(typeof LMSSVValue != "string")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				switch(LMSSVValue)
				{
					case "true-false":
					case "true_false":
					case "choice":
					case "fill-in":
					case "fill_in":
					case "matching":
					case "performance":
					case "sequencing":
					case "likert":
					case "numeric":
						break;
					case "long-fill-in":
					case "long_fill_in":
					case "other":
						if(oCurrent.version=="1.2")
						{
							returnValue = "false";
							API.lastError="401";//Not recognized
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized");
							return returnValue;
						}
						break;
					default:
						returnValue = "false";
						API.lastError="401";//Not recognized
						if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized");
						return returnValue;
				}
				cmi.interactions[iIdx].type = LMSSVValue;
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "result":
				if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				if(LMSSVValue!="correct" && LMSSVValue!="wrong" && LMSSVValue!="incorrect" && LMSSVValue!="neutral" && LMSSVValue!="unanticipated")
				{
					if(isNaN(parseFloat(LMSSVValue)))
					{
						returnValue = "false";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "407" : API.lastError="405";//Type mismatch/Incorrect data type
						if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" Value: "+LMSSVValue+" - Data is not in dictionary");
						return returnValue;
					}
				}
				cmi.interactions[iIdx].result = LMSSVValue;
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "weighting":
				if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				if(isNaN(parseFloat(LMSSVValue)))
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Type mismatch");
					return returnValue;
				}
				cmi.interactions[iIdx].weighting = LMSSVValue.toString();
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "latency":
				if(typeof LMSSVValue != "string")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				cmi.interactions[iIdx].latency = LMSSVValue.toString();
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "time":
				if(oCurrent.version=="1.3")
				{
					returnValue = "";
					API_1484_11.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized element");
					return returnValue;
				}
				if(typeof LMSSVValue != "string")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				cmi.interactions[iIdx].timestamp = LMSSVValue.toString();
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "timestamp":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized element");
					return returnValue;
				}
				if(typeof LMSSVValue != "string")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				cmi.interactions[iIdx].timestamp = LMSSVValue.toString();
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "student_response":
				if(oCurrent.version=="1.3")
				{
					returnValue = "";
					API_1484_11.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized element");
					return returnValue;
				}
				if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				cmi.interactions[iIdx].learner_response = LMSSVValue.toString();
				returnValue = "true";
				API_1484_11.lastError = "0";
				return returnValue;
			case "learner_response":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized element");
					return returnValue;
				}
				if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				cmi.interactions[iIdx].learner_response = LMSSVValue.toString();
				returnValue = "true";
				API_1484_11.lastError = "0";
				return returnValue;
			case "description":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError = "401";// Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized element");
					return returnValue;
				}
				if(typeof LMSSVValue != "string")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				cmi.interactions[iIdx].description = LMSSVValue.toString();
				returnValue = "true";
				API_1484_11.lastError = "0";
				return returnValue;
			default:
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
				return returnValue;
		}
		returnValue = "";
		oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
		return returnValue;
	}

	if(LMSSVParam.indexOf("cmi.objectives.")!=-1)
	{
		var sStr = LMSSVParam.substr(15);
		if(sStr.indexOf(".")==-1)
		{
			if(sStr=="_count")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
				return returnValue;
			}
			if(sStr=="_children")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
				return returnValue;
			}
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
			return returnValue;
		}
		var sIdx = sStr.substring(0, sStr.indexOf("."));
		var iIdx = parseInt(sIdx,10);
		if(isNaN(iIdx))
		{
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
			return returnValue;
		}
		sStr = sStr.substr(sStr.indexOf(".")+1);
		if(sStr.indexOf(".")!=-1)
		{
			if(sStr.indexOf("score.")==0)
			{
				var aStr = sStr.split(".");
				if(aStr.length>2)
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
					return returnValue;
				}
				switch(aStr[1])
				{
					case "_children":
						returnValue = "false";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
						if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
						return returnValue;
					case "raw":
						if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
							return returnValue;
						}
						if(isNaN(parseFloat(LMSSVValue)))
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
							return returnValue;
						}
						if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
						if(cmi.objectives[iIdx].score==null) cmi.objectives[iIdx].score = new Object;
						cmi.objectives[iIdx].score.raw = LMSSVValue.toString();
						returnValue = "true";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
						return returnValue;
					case "max":
						if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
							return returnValue;
						}
						if(isNaN(parseFloat(LMSSVValue)))
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
							return returnValue;
						}
						if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
						if(cmi.objectives[iIdx].score==null) cmi.objectives[iIdx].score = new Object;
						cmi.objectives[iIdx].score._max = LMSSVValue.toString();
						returnValue = "true";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
						return returnValue;
					case "min":
						if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
							return returnValue;
						}
						if(isNaN(parseFloat(LMSSVValue)))
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
							return returnValue;
						}
						if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
						if(cmi.objectives[iIdx].score==null) cmi.objectives[iIdx].score = new Object;
						cmi.objectives[iIdx].score._min = LMSSVValue.toString();
						returnValue = "true";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
						return returnValue;
					case "scaled":
						if(oCurrent.version=="1.2")
						{
							returnValue = "";
							API.lastError="401"; // Not recognized element
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
							return returnValue;
						}
						if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
							return returnValue;
						}
						if(isNaN(parseFloat(LMSSVValue)))
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
							return returnValue;
						}
						if(parseFloat(LMSSVValue)<-1 || parseFloat(LMSSVValue)>1)
						{
							returnValue = "false";
							oCurrent.version=="1.3" ? API_1484_11.lastError = "407" : API.lastError="405";//Type mismatch/Incorrect data type
							if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - out of range");
							return returnValue;
						}
						if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
						if(cmi.objectives[iIdx].score==null) cmi.objectives[iIdx].score = new Object;
						cmi.objectives[iIdx].score.scaled = LMSSVValue.toString();
						returnValue = "true";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
						return returnValue;
					default:
						returnValue = "";
						oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
						if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
						return returnValue;
				}
			}
			returnValue = "";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
			return returnValue;
		}
		switch(sStr)
		{
			case "id":
				if(typeof LMSSVValue != "string" || LMSSVValue=="")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
				cmi.objectives[iIdx].id = LMSSVValue;
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "status":
				if(oCurrent.version=="1.3")
				{
					returnValue = "";
					API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
					return returnValue;
				}
				if(typeof LMSSVValue != "string" || LMSSVValue=="")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				if(LMSSVValue!="not attempted" && LMSSVValue!="incomplete" && LMSSVValue!="completed" && LMSSVValue!="passed" && LMSSVValue!="failed" && LMSSVValue!="browsed")
				{
					returnValue = "false";
					API.lastError = "405";//Data Model Element Value Out Of Range
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Dictionary");
					return returnValue;
				}
				if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
				cmi.objectives[iIdx].status = LMSSVValue;
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "completion_status":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
					return returnValue;
				}
				if(typeof LMSSVValue != "string" || LMSSVValue=="")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				if(LMSSVValue!="not attempted" && LMSSVValue!="incomplete" && LMSSVValue!="completed" && LMSSVValue!="unknown")
				{
					returnValue = "false";
					API.lastError = "405";//Data Model Element Value Out Of Range
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Dictionary");
					return returnValue;
				}
				if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
				cmi.objectives[iIdx].completion_status = LMSSVValue;
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "success_status":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
					return returnValue;
				}
				if(typeof LMSSVValue != "string" || LMSSVValue=="")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				if(LMSSVValue!="unknown" && LMSSVValue!="passed" && LMSSVValue!="failed")
				{
					returnValue = "false";
					API.lastError = "405";//Data Model Element Value Out Of Range
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Dictionary");
					return returnValue;
				}
				if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
				cmi.objectives[iIdx].success_status = LMSSVValue;
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			case "description":
				if(oCurrent.version=="1.2")
				{
					returnValue = "";
					API.lastError="401"; // Not recognized element
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
					return returnValue;
				}
				if(typeof LMSSVValue != "string")
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
					return returnValue;
				}
				if(cmi.objectives[iIdx]==null) cmi.objectives[iIdx] = new Object;
				cmi.objectives[iIdx].description = LMSSVValue;
				returnValue = "true";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
				return returnValue;
			default:
				returnValue = "";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
				return returnValue;
		}
		returnValue = "";
		oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401"; // Not recognized element
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element");
		return returnValue;
	}

	if(LMSSVParam.indexOf("cmi.comments")!=-1)
	{
		cmi.comments = LMSSVValue;
		return "true";
	}
	if(LMSSVParam.indexOf("cmi.comments_from_learner")!=-1)
	{
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" failed");
		return returnValue;
	}
	if(LMSSVParam.indexOf("cmi.learner_preference")!=-1)
	{
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" failed");
		return returnValue;
	}
	if(LMSSVParam.indexOf("cmi.student_preference")!=-1)
	{
		var aParts = LMSSVParam.split(".");
		if(aParts.length!=3)
		{
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" failed");
			return returnValue;
		}
		API.lastError = "0";
		switch(aParts[2])
		{
			case "audio":
				cmi.student_preference.audio = LMSSVValue;
				cmi.learner_preference.audio_level = LMSSVValue;
				return "true";
			case "language":
				cmi.student_preference.language = LMSSVValue;
				cmi.learner_preference.language = LMSSVValue;
				return "true";
			case "speed":
				cmi.student_preference.speed = LMSSVValue;
				cmi.learner_preference.delivery_speed = LMSSVValue;
				return "true";
			case "text":
				cmi.student_preference._text = LMSSVValue;
				cmi.learner_preference.audio_captioning = LMSSVValue;
				return "true";
			default: break;
		}
		API.lastError = "101";
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" failed");
		return returnValue;
	}
	if(LMSSVParam.indexOf("cmi.student_data")!=-1)
	{
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" failed");
		return returnValue;
	}
	if(LMSSVParam.indexOf("cmi.comments_from_lms")!=-1)
	{
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" failed");
		return returnValue;
	}
	if(LMSSVParam.indexOf("._count")!=-1)
	{
		returnValue = "false";
		oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
		if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
		return returnValue;
	}
	switch(LMSSVParam)
	{
		/*Common 1.2 & 2004 notation - Read-only*/
		case "cmi._children":
		case "cmi._version":
		case "cmi.launch_data":
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="403"; // Read-only element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
			return returnValue;
		/*Different 1.2 & 2004 notation: 1.2 - Read-only*/
		case "cmi.core._children":
		case "cmi.core.score._children":
		case "cmi.core.student_id":
		case "cmi.core.student_name":
		case "cmi.core.credit":
		case "cmi.core.entry":
		case "cmi.core.total_time":
		case "cmi.core.lesson_mode":
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="403"; // Not recognized element in 2004/Read-only element
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 2004");
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
			return returnValue;
		/*Different 1.2 & 2004 notation: 2004 - Read-only*/
		case "cmi.score._children":
		case "cmi.learner_id":
		case "cmi.learner_name":
		case "cmi.credit":
		case "cmi.entry":
		case "cmi.total_time":
		case "cmi.mode":
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "404" : API.lastError="401"; // Not recognized element in 2004/Read-only element
			if(oCurrent.version=="1.3" && oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
			if(oCurrent.version=="1.2" && oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 1.2");
			return returnValue;
		/*1.2 specific - Read-only*/
		case "cmi.comments_from_lms":
			returnValue = "false";
			if(oCurrent.version=="1.3")
			{
				API_1484_11.lastError="401";
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 1.2");
				return returnValue;
			}
			API.lastError="403"; // Not recognized element in 2004/Read-only element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
			return returnValue;
		/*2004 specific - Read-only*/
		case "cmi.completion_threshold":
		case "cmi.max_time_allowed":
		case "cmi.scaled_passing_score":
		case "cmi.time_limit_action":
			returnValue = "false";
			if(oCurrent.version=="1.2")
			{
				API.lastError="401";
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 1.2");
				return returnValue;
			}
			API_1484_11.lastError = "404"; // Not recognized element in 2004/Read-only element
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Read-only element");
			return returnValue;
		/*Common 1.2 & 2004 notation - Read-write*/
		case "cmi.suspend_data":
			if(typeof LMSSVValue != "string")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(oCurrent.strictSCORM)
			{
				if((oCurrent.version=="1.2" && LMSSVValue.length>4095) || (oCurrent.version=="1.3" && LMSSVValue.length>65535)) {
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "407" : API.lastError="405";//Data Model Element Value Out Of Range/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - length exceeds SCORM restrictions");
					return returnValue;
				}
			}
			if(LMSSVValue.toLowerCase().indexOf("[core_vendor]")!=-1)
			{ // SkillSoft old Snowbird engine w/a
				var sSData = LMSSVValue.substr(LMSSVValue.indexOf(";")+1);
				cmi.suspend_data = sSData;
			}
			else
			{
				cmi.suspend_data = LMSSVValue;
			}
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		/*Different 1.2 & 2004 notation: - Read-Write*/
		case "cmi.location":
		case "cmi.core.lesson_location":
			if(typeof LMSSVValue != "string" && typeof LMSSVValue != "number")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(oCurrent.strictSCORM)
			{
				if((oCurrent.version=="1.2" && LMSSVValue.length>255) || (oCurrent.version=="1.3" && LMSSVValue.length>1000))
				{
					returnValue = "false";
					oCurrent.version=="1.3" ? API_1484_11.lastError = "407" : API.lastError="405";//Data Model Element Value Out Of Range/Incorrect data type
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - length exceeds SCORM restrictions");
					return returnValue;
				}
			}
			cmi.location = LMSSVValue;
			cmi.core.lesson_location = LMSSVValue;
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		case "cmi.exit":
		case "cmi.core.exit":
			if(typeof LMSSVValue != "string")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(oCurrent.version=="1.3")
			{
				if(LMSSVValue!="" && LMSSVValue!="timeout" && LMSSVValue!="normal" && LMSSVValue!="logout" && LMSSVValue!="suspend")
				{
					returnValue = "false";
					API_1484_11.lastError = "407";//Data Model Element Value Out Of Range
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Dictionary");
					return returnValue;
				}
				cmi.exit = LMSSVValue;
			}
			if(oCurrent.version=="1.2")
			{
				if(LMSSVValue!="" && LMSSVValue!="time-out" && LMSSVValue!="logout" && LMSSVValue!="suspend")
				{
					returnValue = "false";
					API.lastError = "405";//Data Model Element Value Out Of Range
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Dictionary");
					return returnValue;
				}
				cmi.core.exit = LMSSVValue;
			}
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		case "cmi.session_time":
		case "cmi.core.session_time":
			if(typeof LMSSVValue != "string")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			var iConverted = 0;
			if(oCurrent.version=="1.3")
			{
				iConverted = ConvertPeriodFromISO8601(LMSSVValue);
				if(LMSSVValue=="" || isNaN(iConverted))
				{
					returnValue = "false";
					API_1484_11.lastError = "406";//Type mismatch
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Type mismatch");
					return returnValue;
				}
			}
			if(oCurrent.version=="1.2")
			{
				iConverted = ConvertCMITimespanToInteger(LMSSVValue);
				if(LMSSVValue=="" || LMSSVValue.indexOf(":")==-1 || isNaN(iConverted))
				{
					returnValue = "false";
					API.lastError = "405";//Type mismatch
					if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Type mismatch");
					return returnValue;
				}
			}
			UpdateSessionTime(LMSSVValue);
			oCurrent.bSCOSessionTime = true;
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		case "cmi.score.raw":
		case "cmi.core.score.raw":
			if(typeof LMSSVValue != "number" && typeof LMSSVValue != "string")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(LMSSVValue!="" && isNaN(parseFloat(LMSSVValue)))
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch 1");
				return returnValue;
			}
			oCurrent.version=="1.3" ? cmi.score.raw = LMSSVValue.toString() : cmi.core.score.raw = LMSSVValue.toString();
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		case "cmi.score.max":
		case "cmi.core.score.max":
			if(typeof LMSSVValue != "number" && typeof LMSSVValue != "string")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(LMSSVValue!="" && isNaN(parseFloat(LMSSVValue)))
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			oCurrent.version=="1.3" ? cmi.score._max = LMSSVValue.toString() : cmi.core.score._max = LMSSVValue.toString();
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		case "cmi.score.min":
		case "cmi.core.score.min":
			if(typeof LMSSVValue != "number" && typeof LMSSVValue != "string")
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(LMSSVValue!="" && isNaN(parseFloat(LMSSVValue)))
			{
				returnValue = "false";
				oCurrent.version=="1.3" ? API_1484_11.lastError = "406" : API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			oCurrent.version=="1.3" ? cmi.score._min = LMSSVValue.toString() : cmi.core.score._min = LMSSVValue.toString();
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		/*1.2 specific - Read-write*/
		case "cmi.core.lesson_status":
			if(oCurrent.version=="1.3")
			{
				returnValue = "false";
				API_1484_11.lastError="401";
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 1.2");
				return returnValue;
			}
			if(typeof LMSSVValue != "string")
			{
				returnValue = "false";
				API.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(LMSSVValue!="not attempted" && LMSSVValue!="incomplete" && LMSSVValue!="completed" && LMSSVValue!="passed" && LMSSVValue!="failed" && LMSSVValue!="browsed")
			{
				returnValue = "false";
				API.lastError = "405";//Data Model Element Value Out Of Range
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Dictionary");
				return returnValue;
			}
			cmi.core.lesson_status = LMSSVValue;
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		/*2004 specific - Read-write*/
		case "cmi.completion_status":
			if(oCurrent.version=="1.2")
			{
				returnValue = "false";
				API.lastError="401";
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 1.2");
				return returnValue;
			}
			if(typeof LMSSVValue != "string")
			{
				returnValue = "false";
				API_1484_11.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(LMSSVValue!="not attempted" && LMSSVValue!="incomplete" && LMSSVValue!="completed" && LMSSVValue!="unknown")
			{
				returnValue = "false";
				API_1484_11.lastError = "406";//Data Model Element Value Out Of Range
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Dictionary");
				return returnValue;
			}
			cmi.completion_status = LMSSVValue;
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		case "cmi.success_status":
			if(oCurrent.version=="1.2")
			{
				returnValue = "false";
				API.lastError="401";
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 1.2");
				return returnValue;
			}
			if(typeof LMSSVValue != "string")
			{
				returnValue = "false";
				API_1484_11.lastError="405";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(LMSSVValue!="unknown" && LMSSVValue!="passed" && LMSSVValue!="failed")
			{
				returnValue = "false";
				API_1484_11.lastError = "406";//Data Model Element Value Out Of Range
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Dictionary");
				return returnValue;
			}
			cmi.success_status = LMSSVValue;
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		case "cmi.score.scaled":
			if(oCurrent.version=="1.2")
			{
				returnValue = "false";
				API.lastError="401";
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 1.2");
				return returnValue;
			}
			if(typeof LMSSVValue != "number" && typeof LMSSVValue != "string")
			{
				returnValue = "false";
				API_1484_11.lastError = "406";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(LMSSVValue!="" && isNaN(parseFloat(LMSSVValue)))
			{
				returnValue = "false";
				API_1484_11.lastError = "406";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(parseFloat(LMSSVValue)<-1 || parseFloat(LMSSVValue)>1)
			{
				returnValue = "false";
				API_1484_11.lastError = "406";//Data Model Element Value Out Of Range
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Range");
				return returnValue;
			}
			cmi.score.scaled = LMSSVValue.toString();
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		case "cmi.progress_measure":
			if(oCurrent.version=="1.2")
			{
				returnValue = "false";
				API.lastError="401";
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - not recognized element in 1.2");
				return returnValue;
			}
			if(typeof LMSSVValue != "number" && typeof LMSSVValue != "string")
			{
				returnValue = "false";
				API_1484_11.lastError = "406";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(LMSSVValue!="" && isNaN(parseFloat(LMSSVValue)))
			{
				returnValue = "false";
				API_1484_11.lastError = "406";//Type mismatch/Incorrect data type
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - type mismatch");
				return returnValue;
			}
			if(parseFloat(LMSSVValue)<0 || parseFloat(LMSSVValue)>1)
			{
				returnValue = "false";
				API_1484_11.lastError = "406";//Data Model Element Value Out Of Range
				if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Data Model Element Value Out Of Range");
				return returnValue;
			}
			cmi.progress_measure = LMSSVValue.toString();
			returnValue = "true";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "0" : API.lastError="0";
			return returnValue;
		default:
			returnValue = "false";
			oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401";//Not recognized
			if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized");
			return returnValue;
	}
//	alert('SetValue '+LMSSVParam+'='+returnValue);
	returnValue = "false";
	oCurrent.version=="1.3" ? API_1484_11.lastError = "401" : API.lastError="401";//Not recognized
	if(oCurrent.debug) alert("SCORM "+oCurrent.version+" SetValue: "+LMSSVParam+" - Not recognized");
	return returnValue;
}

function UpdateSessionTime(sValue)
{
	var iSessionTime = (oCurrent.version=="1.2") ? ConvertCMITimespanToInteger(sValue) : ConvertPeriodFromISO8601(sValue);
	if(isNaN(iSessionTime)) iSessionTime = 0;
	var iTotalTime = ConvertPeriodFromISO8601(cmi.total_time);
	iSessionTime += iTotalTime;
	cmi.session_time = ConvertPeriodToISO8601(iSessionTime);
	cmi.core.session_time = ConvertIntegerToCMITimespan(iSessionTime);
	oCurrent.session_time_to_send = iSessionTime;
	//oCurrent.bSCOSessionTime = true;
	var dNow = new Date();
	var iNow = dNow.valueOf();
	oCurrent.alt_session_time_to_send = iNow - oCurrent.alt_session_timer;
	return true;
}


function LMSCommit(LMSCoParam)
{

	if(	API.session_id=="" ||	API.tracking_url=="" || oCurrent.tracking_url=="" || oCurrent.session_id=="") return "true";

	if(CallServer())
	{
		if(checkCommited())
		{
			API_1484_11.lastError="0";
			API.lastError="0";
			return "true";
		}
		else
		{
			API_1484_11.lastError="101";
			API.lastError="101";
			return "false";
		}
	}
	else
	{
		API.lastError="101";
		API_1484_11.lastError="101";
		return "false";
	}
}

function CallServer()
{
	var commitData=CreateCommitData();
	oCurrent.last_command = "putparam";
	var command="command=PutParam&version=2.0&session_id="+escape(oCurrent.session_id)+"&AICC_Data="+escape(commitData);
	try
	{
		var xmlhttp = CreateXMLHTTP();
		xmlhttp.open("POST",oCurrent.tracking_url,false);
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlhttp.send(command);
		if (xmlhttp.status==200)
		{
			API.putParamResponse=xmlhttp.responseText;
			oCurrent.comm_error="200";
			return true;
		}
		else
		{
			alert("XMLHTTP: Server error " + xmlhttp.status);
			oCurrent.comm_error=xmlhttp.status;
		}
	}
	catch(e)
	{
		alert("Commit Data Error.\n XMLHTTP: " + e.description);
	}
	return false;
}

function CreateCommitData()
{
	var sCRLF = String.fromCharCode(13,10);
	var sData = "[CORE]" + sCRLF;
	sData += "LESSON_LOCATION=";
	sData += (oCurrent.version=="1.3") ? cmi.location : cmi.core.lesson_location;
	sData += sCRLF + "LESSON_STATUS=";
	if(oCurrent.version=="1.3")
	{
		if(cmi.success_status!="passed" && cmi.success_status!="failed")
		{
			sData += cmi.completion_status.charAt(0);
		}
		else
		{
			sData += cmi.success_status.charAt(0);
		}
		sData += "," + cmi.completion_status.charAt(0) + "," + cmi.success_status.charAt(0);
	}
	else
	{
		sData += cmi.core.lesson_status.charAt(0);
	}
	sData += sCRLF + "EXIT=";
	sData += (oCurrent.version=="1.3") ? cmi.exit : cmi.core.exit;
	var tmpParam = cmi.core.score.raw;
	if(cmi.core.score._max!="") tmpParam += "," + cmi.core.score._max;
	if(cmi.core.score._min!="") tmpParam += "," + cmi.core.score._min;
	sData += sCRLF + "SCORE=";
	sData += (oCurrent.version=="1.3") ? cmi.score.raw.toString() : cmi.core.score.raw.toString();
	sData += ",";
	sData += (oCurrent.version=="1.3") ? cmi.score._max.toString() : cmi.core.score._max.toString();
	sData += ",";
	sData += (oCurrent.version=="1.3") ? cmi.score._min.toString() : cmi.core.score._min.toString();
	if(oCurrent.version=="1.3") sData += "," + cmi.score.scaled.toString();
	sData += sCRLF + "TIME=";
	if(oCurrent.bSCOSessionTime)
	{
		sData += ConvertPeriodToISO8601(oCurrent.session_time_to_send);
	}
	else
	{
		var dNow = new Date();
		var iNow = dNow.valueOf();
		oCurrent.alt_session_time_to_send = iNow - oCurrent.alt_session_timer + ConvertPeriodFromISO8601(cmi.total_time);
		sData += ConvertPeriodToISO8601(oCurrent.alt_session_time_to_send);
		oCurrent.alt_session_time_to_send = 0;
		//oCurrent.alt_session_timer = iNow;
	}
	/*
	if((oCurrent.version=="1.3" && cmi.session_time!="") || (oCurrent.version=="1.2" && cmi.core.session_time!=""))
	{
		sData += ConvertIntegerToCMITimespan(oCurrent.session_time_to_send);
	}
	else
	{
		if(oCurrent.enable_API_session_time || !oCurrent.bSCOSessionTime)
		{
			var dDate = new Date();
			var iDate = dDate.valueOf();
			sData += ConvertIntegerToCMITimespan(oCurrent.alt_session_time_to_send);
			oCurrent.alt_session_time_to_send = 0;
			oCurrent.alt_session_timer = iDate;
		}
		else
		{
			sData += ConvertIntegerToCMITimespan(oCurrent.session_time_to_send);
		}
	}*/
	sData += sCRLF + "[CORE_LESSON]" + sCRLF;
	sData += cmi.suspend_data + sCRLF + "[OBJECTIVES_STATUS]" + sCRLF;
	sData += (oCurrent.sendtype=="xml") ? TranslateObjectivesXML() : TranslateObjectives();
	sData += sCRLF + "[EVALUATION]" + sCRLF;
	sData += (oCurrent.sendtype=="xml") ? TranslateEvaluationXML() : TranslateEvaluation();
	sData += sCRLF + "[COMMENTS]" + sCRLF + cmi.comments;
	sData += sCRLF + "[STUDENT_DATA]";
	sData += sCRLF + "mastery_score=" + cmi.student_data.mastery_score;
	sData += sCRLF + "max_time_allowed=" + cmi.student_data.max_time_allowed;
	sData += sCRLF + "time_limit_action=" + cmi.student_data.time_limit_action;
	sData += sCRLF + "[STUDENT_PREFERENCE]";
	sData += sCRLF + "audio=" + cmi.student_preference.audio;
	sData += sCRLF + "language=" + cmi.student_preference.language;
	sData += sCRLF + "speed=" + cmi.student_preference.speed;
	sData += sCRLF + "text=" + cmi.student_preference._text;
	sData += sCRLF;
	return sData;
}

function TranslateObjectivesXML()
{
	if(cmi.objectives.length==0) return "";
	var oDoc = CreateDOMDocument();
	var oRoot = oDoc.createElement("objectives");
	if (g_isMSIE)
		oDoc.appendChild(oRoot);
	else if (g_isFirefox)
		oDoc.documentElement.appendChild(oRoot);
	var oObj;
	var oTextNode;
	var oElemNode;
	var sTmp = "";
	var oScore;
	for(var i=0; i<cmi.objectives.length; i++)
	{
		if(cmi.objectives[i].id==null) continue;
		oObj = oDoc.createElement("objective");
		oRoot.appendChild(oObj);

		oElemNode = oDoc.createElement("objective_id");
		oTextNode = oDoc.createTextNode(cmi.objectives[i].id);
		oElemNode.appendChild(oTextNode);
		oObj.appendChild(oElemNode);

		oElemNode = oDoc.createElement("status");
		if(cmi.objectives[i].success_status!=null || cmi.objectives[i].completion_status!=null)
		{
			if(cmi.objectives[i].success_status!=null)
			{
				switch(cmi.objectives[i].success_status.charAt(0))
				{
					case "p":
					case "f":
						sTmp = cmi.objectives[i].success_status;
						break;
					default:
						sTmp = (cmi.objectives[i].completion_status!=null) ? cmi.objectives[i].completion_status : "not attempted";
						break;
				}
			}
			else
			{
				sTmp = cmi.objectives[i].completion_status;
			}
		}
		else
		{
			sTmp = "not attempted";
		}
		oTextNode = oDoc.createTextNode(sTmp);
		oElemNode.appendChild(oTextNode);
		oObj.appendChild(oElemNode);

		oElemNode = oDoc.createElement("success_status");
		oTextNode = oDoc.createTextNode((cmi.objectives[i].success_status!=null) ? cmi.objectives[i].success_status : "unknown");
		oElemNode.appendChild(oTextNode);
		oObj.appendChild(oElemNode);

		oElemNode = oDoc.createElement("completion_status");
		oTextNode = oDoc.createTextNode((cmi.objectives[i].completion_status!=null) ? cmi.objectives[i].completion_status : "not attempted");
		oElemNode.appendChild(oTextNode);
		oObj.appendChild(oElemNode);

		if(cmi.objectives[i].description!=null)
		{
			oElemNode = oDoc.createElement("description");
			oTextNode = oDoc.createTextNode(cmi.objectives[i].description);
			oElemNode.appendChild(oTextNode);
			oObj.appendChild(oElemNode);
		}

		oScore = oDoc.createElement("score");
		oObj.appendChild(oScore);
		if(cmi.objectives[i].score!=null)
		{
			oElemNode = oDoc.createElement("raw");
			oTextNode = oDoc.createTextNode((cmi.objectives[i].score.raw!=null) ? cmi.objectives[i].score.raw : "0");
			oElemNode.appendChild(oTextNode);
			oScore.appendChild(oElemNode);

			if(cmi.objectives[i].score._min!=null)
			{
				oElemNode = oDoc.createElement("min");
				oTextNode = oDoc.createTextNode(cmi.objectives[i].score._min);
				oElemNode.appendChild(oTextNode);
				oScore.appendChild(oElemNode);
			}
			if(cmi.objectives[i].score._max!=null)
			{
				oElemNode = oDoc.createElement("max");
				oTextNode = oDoc.createTextNode(cmi.objectives[i].score._max);
				oElemNode.appendChild(oTextNode);
				oScore.appendChild(oElemNode);
			}
			if(cmi.objectives[i].score.scaled!=null)
			{
				oElemNode = oDoc.createElement("scaled");
				oTextNode = oDoc.createTextNode(cmi.objectives[i].score.scaled);
				oElemNode.appendChild(oTextNode);
				oScore.appendChild(oElemNode);
			}
		}
	}
	return escape(oRoot.xml);
}

function TranslateEvaluationXML()
{
	if(cmi.interactions.length==0) return "";
	var oDoc = CreateDOMDocument();
	var oRoot = oDoc.createElement("interactions");
	if (g_isMSIE)
		oDoc.appendChild(oRoot);
	else if (g_isFirefox)
		oDoc.documentElement.appendChild(oRoot);
	var oInteraction;
	var oTextNode;
	var oElemNode;
	var oObjectives;
	var oCorrects;
	for(var i=0; i<cmi.interactions.length; i++)
	{
		oInteraction = oDoc.createElement("interaction");
		oRoot.appendChild(oInteraction);

		oElemNode = oDoc.createElement("interaction_id");
		oTextNode = oDoc.createTextNode(cmi.interactions[i].id);
		oElemNode.appendChild(oTextNode);
		oInteraction.appendChild(oElemNode);

		oElemNode = oDoc.createElement("type_interaction");
		oTextNode = oDoc.createTextNode(cmi.interactions[i].type);
		oElemNode.appendChild(oTextNode);
		oInteraction.appendChild(oElemNode);

		if(cmi.interactions[i].timestamp!=null)
		{
			oElemNode = oDoc.createElement("time");
			oTextNode = oDoc.createTextNode(cmi.interactions[i].timestamp);
			oElemNode.appendChild(oTextNode);
			oInteraction.appendChild(oElemNode);
		}

		if(cmi.interactions[i].latency!=null)
		{
			oElemNode = oDoc.createElement("latency");
			oTextNode = oDoc.createTextNode(cmi.interactions[i].latency);
			oElemNode.appendChild(oTextNode);
			oInteraction.appendChild(oElemNode);
		}

		if(cmi.interactions[i].result!=null)
		{
			oElemNode = oDoc.createElement("result");
			oTextNode = oDoc.createTextNode(cmi.interactions[i].result);
			oElemNode.appendChild(oTextNode);
			oInteraction.appendChild(oElemNode);
		}

		if(cmi.interactions[i].weighting!=null)
		{
			oElemNode = oDoc.createElement("weighting");
			oTextNode = oDoc.createTextNode(cmi.interactions[i].weighting);
			oElemNode.appendChild(oTextNode);
			oInteraction.appendChild(oElemNode);
		}

		if(cmi.interactions[i].description!=null)
		{
			oElemNode = oDoc.createElement("description");
			oTextNode = oDoc.createTextNode(cmi.interactions[i].description);
			oElemNode.appendChild(oTextNode);
			oInteraction.appendChild(oElemNode);
		}

		if(cmi.interactions[i].learner_response!=null)
		{
			oElemNode = oDoc.createElement("student_response");
			oTextNode = oDoc.createTextNode(cmi.interactions[i].learner_response);
			oElemNode.appendChild(oTextNode);
			oInteraction.appendChild(oElemNode);
		}

		if(cmi.interactions[i].objectives!=null && cmi.interactions[i].objectives.length>0)
		{
			oObjectives =  oDoc.createElement("objectives");
			oInteraction.appendChild(oObjectives);
			for(var j=0; j<cmi.interactions[i].objectives.length; j++)
			{
				oElemNode = oDoc.createElement("objective_id");
				oTextNode = oDoc.createTextNode(cmi.interactions[i].objectives[j].id);
				oElemNode.appendChild(oTextNode);
				oObjectives.appendChild(oElemNode);
			}
		}

		if(cmi.interactions[i].correct_responses!=null && cmi.interactions[i].correct_responses.length>0)
		{
			oCorrects =  oDoc.createElement("correct_responses");
			oInteraction.appendChild(oCorrects);
			for(var j=0; j<cmi.interactions[i].correct_responses.length; j++)
			{
				oElemNode = oDoc.createElement("pattern");
				oTextNode = oDoc.createTextNode(cmi.interactions[i].correct_responses[j].pattern);
				oElemNode.appendChild(oTextNode);
				oCorrects.appendChild(oElemNode);
			}
		}
	}
	return escape(oRoot.xml);
}

function TranslateEvaluation()
{
	if(cmi.interactions.length==0) return "";
	var sCRLF = String.fromCharCode(13,10);
	var sData = '"time","interaction_id","objective_id","type_interaction","correct_response","student_response","result","weighting","latency","description"';
	for(var i=0;i<cmi.interactions.length;i++)
	{
		sData += sCRLF;
		sData += '"';
		sData += cmi.interactions[i].timestamp!=null ? cmi.interactions[i].timestamp : "";
		sData += '",';
		sData += '"';
		sData += cmi.interactions[i].id!=null ? cmi.interactions[i].id : "";
		sData += '",';
		sData += '"';
		if(cmi.interactions[i].objectives!=null)
		{
			if(cmi.interactions[i].objectives.length!=0)
			{
				sData += '{';
				for(var j=0;j<cmi.interactions[i].objectives.length;j++)
				{
					sData += cmi.interactions[i].objectives[j].id;
					if(cmi.interactions[i].objectives[j+1]==null) break;
					sData += '},{';
				}
				sData += '}';
			}
		}
		sData += '",';
		sData += '"';
		sData += cmi.interactions[i].type!=null ? cmi.interactions[i].type : "";
		sData += '",';
		sData += '"';
		if(cmi.interactions[i].correct_responses!=null)
		{
			if(cmi.interactions[i].correct_responses.length!=0)
			{
				sData += '{';
				for(var j=0;j<cmi.interactions[i].correct_responses.length;j++)
				{
					sData += cmi.interactions[i].correct_responses[j].pattern;
					if(cmi.interactions[i].correct_responses[j+1]==null) break;
					sData += '},{';
				}
				sData += '}';
			}
		}
		sData += '",';
		sData += '"';
		sData += cmi.interactions[i].learner_response!=null ? cmi.interactions[i].learner_response : "";
		sData += '",';
		sData += '"';
		sData += cmi.interactions[i].result!=null ? cmi.interactions[i].result : "";
		sData += '",';
		sData += '"';
		sData += cmi.interactions[i].weighting!=null ? cmi.interactions[i].weighting : "";
		sData += '",';
		sData += '"';
		sData += cmi.interactions[i].latency!=null ? cmi.interactions[i].latency : "";
		sData += '",';
		sData += '"';
		sData += cmi.interactions[i].description!=null ? cmi.interactions[i].description : "";
		sData += '"';
	}
	return sData;
}

function TranslateObjectives()
{
	if(cmi.objectives.length==0) return "";
	var sCRLF = String.fromCharCode(13,10);
	var sData = '"objective_id","score","status","completion_status","success_status","description"';
	for(var i=0;i<cmi.objectives.length;i++)
	{
		sData += sCRLF;
		sData += '"';
		sData += cmi.objectives[i].id!=null ? cmi.objectives[i].id : "";
		sData += '",';
		sData += '"';
		if(cmi.objectives[i].score!=null)
		{
			sData += cmi.objectives[i].score.raw!=null ? cmi.objectives[i].score.raw.toString() : "";
			sData += ',';
			sData += cmi.objectives[i].score._max!=null ? cmi.objectives[i].score._max.toString() : "";
			sData += ',';
			sData += cmi.objectives[i].score._min!=null ? cmi.objectives[i].score._min.toString() : "";
			if(oCurrent.version=="1.3")
			{
				sData += ',';
				sData += cmi.objectives[i].score.scaled!=null ? cmi.objectives[i].score.scaled.toString() : "";
			}
		}
		sData += '",';
		sData += '"';
		sData += cmi.objectives[i].status!=null ? cmi.objectives[i].status : "";
		sData += '",';
		sData += '"';
		sData += cmi.objectives[i].completion_status!=null ? cmi.objectives[i].completion_status : "";
		sData += '",';
		sData += '"';
		sData += cmi.objectives[i].success_status!=null ? cmi.objectives[i].success_status : "";
		sData += '",';
		sData += '"';
		sData += cmi.objectives[i].description!=null ? cmi.objectives[i].description : "";
		sData += '"';
	}
	return sData;
}


function checkCommited()
{
	var tmp_response=API.putParamResponse.toLowerCase();
	if(tmp_response.indexOf('error=0')!=-1)
	{
		oCurrent.comm_error="200";
		return true;
	}
	else
	{
		if(tmp_response.indexOf('error=1')!=-1)
		{
			oCurrent.comm_error="1";
			alert('Invalid server command. Data NOT sent.');
		}
		else
		{
			if(tmp_response.indexOf('error=3')!=-1)
			{
				oCurrent.comm_error="3";
				alert('Invalid session id. Data not sent.');
			}
			else
			{
				if(tmp_response.indexOf('error=2')!=-1)
				{
					oCurrent.comm_error="2";
					alert('Invalid AU-password. Data not sent.');
				}
				else
				{
					oCurrent.comm_error="500"
					alert('ERROR S002. Data not sent.');
				}
			}
		}
	}
	return false;
}

function LMSGetLastError()
{
	return oCurrent.version=="1.3" ? API_1484_11.lastError : API.lastError;
}

function LMSGetErrorString(LMSerror)
{
	if(LMSerror=="")
{
		var mError=API.lastError;
	}
	else
	{
		var mError=LMSerror;
	}
	var returnValue="";
	switch(mError)
	{
		case "0":
			returnValue="No error encountered";
			break;
		case "101":
			returnValue="General exception";
			break;
		case "201":
			returnValue="Invalid argument error";
			break;
		case "202":
			returnValue="Element cannot have children";
			break;
		case "203":
			returnValue="Element is not an array - cannot have count";
			break;
		case "301":
			returnValue="Not initialized";
			break;
		case "401":
			returnValue="Not implemented error";
			break;
		case "402":
			returnValue="Invalid set value. Element is a keyword";
			break;
		case "403":
			returnValue="Element is read only";
			break;
		case "404":
			returnValue="Element is write only";
			break;
		case "405":
			returnValue="Incorrect data type";
			break;
		default:
			returnValue="Unknown error - no additional information available";
			break;
	}
	return returnValue;
}

function LMSGetDiagnostic(LMSGDparam)
{
	var returnValue="";
	if(LMSGDparam=="")
	{
		var gdError=API.lastError;
	}
	else
	{
		var gdError=LMSGDparam;
	}
	switch(gdError)
	{
		case "0":
			returnValue="No error encountered";
			break;
		case "101":
			if(oCurrent.comm_error!="200")
			{
				returnValue="Ошибка связи с сервером LMS. Сервер вернул ошибку номер "+oCurrent.comm_error;
			}
			else
			{
				returnValue="Ошибка возникла в ходе разбора ответа сервера. Возможно, сервер вернул данные в неправильном формате.";
			}
			break;
		case "201":
			returnValue="Курс пытается использовать неизвестный аргумент при вызове функции";
			break;
		case "202":
			returnValue="Курс пытается обратиться к несуществующим дочерним объектам элемента";
			break;
		case "203":
			returnValue="Нечего считать - элемент не является массивом.";
			break;
		case "301":
			returnValue="Сеанс установки связи с сервером LMS завершился безуспешно.";
			break;
		case "401":
			returnValue="Элемент, к которому пытается обратиться курс, не реализован в данной версии API";
			break;
		case "402":
			returnValue="Курс попытался установить неправильное значение параметра";
			break;
		case "403":
			returnValue="Курс попытался записать данные в элемент, доступный только для чтения";
			break;
		case "404":
			returnValue="Курс попытался прочитать данные из элемента, доступного только для записи";
			break;
		case "405":
			returnValue="Использован неправильный формат данных при установке значения элемента.";
			break;
		default:
			returnValue="Неизвестная ошибка";
			break;
	}
	return returnValue;
}


// Trim
var trim = Trim;
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
	if(typeof param != "number")
	{
		var rArg = parseFloat(param);
		if(isNaN(rArg)) return null;
	}
	else
	{
		var rArg = param;
	}
	var sSign = rArg<0 ? "-" : "";
	rArg = Math.abs(rArg);
	var sArg = rArg.toString();
	if(sArg.indexOf("e")==-1)
	{
		if(sArg.indexOf(".")!=-1 && sArg.length<=8) return sSign+sArg;
		if(sArg.indexOf(".")==-1 && sArg.length<=7) return sSign+sArg;
		if(sArg.indexOf(".")!=-1 && sArg.length>8)
		{
			var aParts = sArg.split(".");
			if(aParts[0].length>7)
			{
				return sSign+aParts[0];
			}
			else
			{
				var iL = 8 - aParts[0].length;
				return sSign+aParts[0]+"."+aParts[1].substring(0,iL);
			}
			return sSign+sArg;
		}
		if(Math.abs(rArg)<0.5e-7) return "0";
	}
	return false;
}


// ConvertCMITimespanToInteger
function ConvertCMITimespanToInteger(sTimespan)
{
	if(sTimespan==null || sTimespan=="") return 0;
	var aParts = sTimespan.split(":");
	var iH = 0;
	var iM = 0;
	var nS = 0;
	if(aParts.length==3)
	{
		iH = parseInt(aParts[0],10);
		if(isNaN(iH)) iH = 0;
		iH = iH * 3600000;
		iM = parseInt(aParts[1],10);
		if(isNaN(iM)) iM = 0;
		iM = iM * 60000;
		nS = parseFloat(aParts[2]);
		if(isNaN(nS)) nS = 0;
		nS = Math.round(nS * 1000);
	}
	if(aParts.length==2)
	{
		iM = parseInt(aParts[0],10);
		if(isNaN(iM)) iM = 0;
		iM = iM * 60000;
		nS = parseFloat(aParts[1]);
		if(isNaN(nS)) nS = 0;
		nS = Math.round(nS * 1000);
	}
	return iH + iM + nS;
}

// ConvertIntegerToCMITimespan
function ConvertIntegerToCMITimespan(iInterval)
{
	var iValue = Math.round(iInterval/1000);
	var iH = 0;
	var iM = 0;
	var sH = "00";
	var sM = "00";
	var sS = "";
	if(iValue>3599)
	{
		iH = Math.floor(iValue/3600);
		iValue = iValue - iH * 3600;
		sH = iH.toString();
		if(sH.length==1) sH = "0" + sH;
	}
	if(iValue>59)
	{
		iM = Math.floor(iValue/60);
		iValue = iValue - iM * 60;
		sM = iM.toString();
		if(sM.length==1) sM = "0" + sM;
	}
	sS = iValue.toString();
	if(sS.length==1) sS = "0" + sS;
	return sH + ":" + sM + ":" + sS;
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

// ConvertDateToISO8601
function ConvertDateToISO8601(dDate)
{
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
	var sValue = "P";
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


// CheckBrowserType
function CheckBrowserType()
{
	var sUserAgent = navigator.userAgent.toLowerCase();

	if (sUserAgent.indexOf('msie') != -1)
		g_isMSIE = true;
	else if (sUserAgent.indexOf('gecko') != -1)
		g_isFirefox = true;
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
	}

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
	else if (g_isFirefox)
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
	else if (g_isFirefox)
	{
		//alert(window.XMLHttpRequest);
		oXmlHttp = new XMLHttpRequest();
	}

	return oXmlHttp;
}

function DoCompare(a,b)
{
	return a-b;
}
