// File	name: lms.js
// v.2.6 20090827
// Copyright (c) WebSoft, 2002-2009. All rights reserved.

var g_oScormApi = null;
var g_sScormApiVersion = "";
var g_nScormMaxTries = 500;

var g_bAicc = false;
var g_sAiccSid = "";
var g_sAiccUrl = "";

var g_bUseScorm2004 = true;
var g_bUseScorm12 = false;
var g_bUseAicc = false;

var g_bScorm = false;
var g_sLmsCmiEntry = "";
var g_sLmsCmiLocation = "";
var g_sLmsCmiExit = "";
var g_bLmsCmiExitSuspend = false;
var g_sLmsCmiSuspendData = "";

var g_dtSessionBegin = null;

var g_bLMSShotDown = false;

var g_bLmsDebug = true;
var g_aTerms = new Array();
	g_aTerms["true-false"] = "T";
	g_aTerms["true_false"] = "T";
	g_aTerms["T"] = "true-false";
	g_aTerms["choice"] = "C";
	g_aTerms["multiple_choice"] = "C";
	g_aTerms["C"] = "choice";
	g_aTerms["fill-in"] = "F";
	g_aTerms["fill_in"] = "F";
	g_aTerms["F"] = "fill-in";
	g_aTerms["long-fill-in"] = "L";
	g_aTerms["long_fill_in"] = "L";
	g_aTerms["L"] = "long-fill-in";
	g_aTerms["matching"] = "M";
	g_aTerms["M"] = "matching";
	g_aTerms["performance"] = "P";
	g_aTerms["P"] = "performance";
	g_aTerms["sequencing"] = "S";
	g_aTerms["S"] = "sequencing";
	g_aTerms["ordering"] = "O";
	g_aTerms["O"] = "ordering";
	g_aTerms["likert"] = "R";
	g_aTerms["R"] = "likert";
	g_aTerms["numeric"] = "N";
	g_aTerms["N"] = "numeric";
	g_aTerms["other"] = "H";
	g_aTerms["H"] = "other";
	g_aTerms["correct"] = "A";
	g_aTerms["A"] = "correct";
	g_aTerms["incorrect"] = "B";
	g_aTerms["B"] = "incorrect";
	g_aTerms["wrong"] = "W";
	g_aTerms["W"] = "wrong";
	g_aTerms["unanticipated"] = "U";
	g_aTerms["U"] = "unanticipated";
	g_aTerms["neutral"] = "E";
	g_aTerms["E"] = "neutral";

var g_aConstants = new Array();


// SCORM_ScanFor2004
function SCORM_ScanFor2004(oWindow)
{
	var nTries = 0;
	while (oWindow.API_1484_11 == null &&
		oWindow.parent != null &&
		oWindow.parent != oWindow)
	{
		nTries++;
		if (nTries > g_nScormMaxTries)
			return null;
		oWindow = oWindow.parent;
	}
	return oWindow.API_1484_11;
}

// SCORM_ScanFor12
function SCORM_ScanFor12(oWindow)
{
	var nTries = 0;
	while (oWindow.API == null &&
		oWindow.parent != null &&
		oWindow.parent != oWindow)
	{
		nTries++;
		if (nTries > g_nScormMaxTries)
			return null;
		oWindow = oWindow.parent;
	}
	return oWindow.API;
}

// SCORM_Obtain
function SCORM_Obtain(oWindow)
{
	var bFound = false;

	if (g_bUseScorm2004)
	{
		// Scan for SCORM Version 2004 API
		if (oWindow.parent != null && oWindow.parent != oWindow)
			g_oScormApi = SCORM_ScanFor2004(oWindow.parent);

		if (g_oScormApi == null && oWindow.opener != null)
			g_oScormApi = SCORM_ScanFor2004(oWindow.opener);

		if (g_oScormApi != null)
		{
			g_sScormApiVersion = "2004";
			bFound = true;
		}
	}

	if (bFound == false)
	{
		if (g_bUseScorm12)
		{
			// Scan for SCORM Version 1.2 API
			if (oWindow.parent != null && oWindow.parent != oWindow)
				g_oScormApi = SCORM_ScanFor12(oWindow.parent);

			if (g_oScormApi == null && oWindow.opener != null)
				g_oScormApi = SCORM_ScanFor12(oWindow.opener);

			if (g_oScormApi != null)
			{
				g_sScormApiVersion = "1.2";
				bFound = true;
			}
		}
	}

	if (bFound)
		g_bScorm = true;
}

// SCORM_Initialize
function SCORM_Initialize()
{

	try
	{
		if (g_oScormApi != null)
		{
			SCORM_InitSessionTime();

			switch (g_sScormApiVersion)
			{
				case "2004":
				{
					var sResult = g_oScormApi.Initialize("");
					break;
				}
				case "1.2":
				{
					var sResult = g_oScormApi.LMSInitialize("");
					break;
				}
			}
		}
	}
	catch (e)
	{
		alert(e);
		return false;
	}
	return true;
}

// SCORM_Shutdown
function SCORM_Shutdown()
{
	try
	{
		if (g_oScormApi != null)
		{
			switch (g_sScormApiVersion)
			{
				case "2004":
				{
					var sResult = g_oScormApi.Terminate("");
					break;
				}
				case "1.2":
				{
					var sResult = g_oScormApi.LMSFinish("");
					break;
				}
			}
		}
	}
	catch (e)
	{
		if(g_bLmsDebug) alert(e);
		return false;
	}
	return true;
}

// SCORM_GetValue
function SCORM_GetValue(sName)
{
	var sValue = "";
	if (g_oScormApi != null)
	{
		switch (g_sScormApiVersion)
		{
			case "2004":
			{
				var sResult = g_oScormApi.GetValue(sName);
				var sError = g_oScormApi.GetLastError();
				if (sError != "0")
				{
					var e = "ScormApi2004.GetValue:\n";
					e += "\""+ sName +"\"\n";
					e += g_oScormApi.GetErrorString(sError);
					//throw e;
				}
				else
					sValue = sResult;
				break;
			}
			case "1.2":
			{
				var sResult = g_oScormApi.LMSGetValue(sName);
				var sError = g_oScormApi.LMSGetLastError();
				if (sError != "0")
				{
					var e = "ScormApi12.LMSGetValue:\n";
					e += "\""+ sName +"\"\n";
					e += g_oScormApi.LMSGetErrorString(sError);
					throw e;
				}
				else
					sValue = sResult;
				break;
			}
		}
	}
	return sValue;
}

// SCORM_SetValue
function SCORM_SetValue(sName, sValue)
{
	if (g_oScormApi != null)
	{
		switch (g_sScormApiVersion)
		{
			case "2004":
			{
				var sResult = g_oScormApi.SetValue(sName, sValue);
				var sError = g_oScormApi.GetLastError();
				if (sError != "0")
				{
					var e = "ScormApi2004.SetValue:\n";
					e += "\""+ sName +"\"\n";
					e += "\""+ sValue +"\"\n";
					e += g_oScormApi.GetErrorString(sError);
					//throw e;
				}
				break;
			}
			case "1.2":
			{
				var sResult = g_oScormApi.LMSSetValue(sName, sValue);
				var sError = g_oScormApi.LMSGetLastError();
				if (sError != "0")
				{
					var e = "ScormApi12.SetValue:\n";
					e += "\""+ sName +"\"\n";
					e += "\""+ sValue +"\"\n";
					e += g_oScormApi.LMSGetErrorString(sError);
					throw e;
				}
				break;
			}
		}
	}
}

// SCORM_Commit
function SCORM_Commit()
{
	if (g_oScormApi != null)
	{
		switch (g_sScormApiVersion)
		{
			case "2004":
			{
				var sResult = g_oScormApi.Commit("");
				var sError = g_oScormApi.GetLastError();
				if (sError != "0")
				{
					var e = "ScormApi2004.Commit:\n";
					e += g_oScormApi.GetErrorString(sError);
					throw e;
				}
				break;
			}
			case "1.2":
			{
				var sResult = g_oScormApi.LMSCommit("");
				var sError = g_oScormApi.LMSGetLastError();
				if (sError != "0")
				{
					var e = "ScormApi2004.LMSCommit:\n";
					e += g_oScormApi.LMSGetErrorString(sError);
					throw e;
				}
				break;
			}
		}
	}
}

// SCORM_UnAbbreviateSuccessStatus
function SCORM_UnAbbreviateSuccessStatus(s)
{
	switch (s)
	{
		case "p":
			s = "passed";
			break;
		case "f":
			s = "failed";
			break;
		case "u":
			s = "unknown";
			break;
	}
	return s;
}

// SCORM_UnAbbreviateCompletionStatus
function SCORM_UnAbbreviateCompletionStatus(s)
{
	switch (s)
	{
		case "c":
			s = "completed";
			break;
		case "i":
			s = "incomplete";
			break;
		case "n":
			s = "not attempted";
			break;
		case "u":
			s = "unknown";
			break;
	}
	return s;
}

// SCORM_GetObjectiveIndex
function SCORM_GetObjectiveIndex(sObjectiveId)
{
	var sIndex = -1;

	var nObjectivesCount = SCORM_GetValue("cmi.objectives._count");
	nObjectivesCount = parseInt(nObjectivesCount);

	for (var i = 0; i < nObjectivesCount; i++)
	{
		var sExistingObjectiveId = SCORM_GetValue("cmi.objectives."+ i +".id")
		if (sExistingObjectiveId == sObjectiveId)
		{
			sIndex = i;
			break;
		}
	}
	return sIndex;
}

// SCORM_SaveObjectives
function SCORM_SaveObjectives()
{
	if (g_oScormApi != null)
	{
		switch (g_sScormApiVersion)
		{
			case "2004":
			{
				var oObjectives = g_oSCO.selectNodes("objectives/o");
				for (var i = 0; i < oObjectives.length; i++)
				{
					var oObjective = oObjectives[i];

					var sModule = oObjective.getAttribute("module");
					if (sModule != "yes")
					{
						var sId = oObjective.getAttribute("id");
						var sDesc = oObjective.getAttribute("desc");
						var sMin = oObjective.getAttribute("min");
						var sMax = oObjective.getAttribute("max");
						var sRaw = oObjective.getAttribute("raw");
						var sScaled = oObjective.getAttribute("scaled");

						var sSS = oObjective.getAttribute("ss");
						var sCS = oObjective.getAttribute("cs");

						sSS = SCORM_UnAbbreviateSuccessStatus(sSS);
						sCS = SCORM_UnAbbreviateCompletionStatus(sCS);

						var nIndex = SCORM_GetObjectiveIndex(sId);
						if (nIndex == -1)
						{
							var nObjectivesCount = SCORM_GetValue("cmi.objectives._count");
							nIndex = parseInt(nObjectivesCount);

							var sObjective = "cmi.objectives." + nIndex;
							SCORM_SetValue(sObjective + ".id", sId);
							SCORM_SetValue(sObjective + ".description", sDesc);
						}
						var sObjective = "cmi.objectives." + nIndex;

						SCORM_SetValue(sObjective + ".score.min", sMin);
						SCORM_SetValue(sObjective + ".score.max", sMax);
						SCORM_SetValue(sObjective + ".score.raw", sRaw);
						SCORM_SetValue(sObjective + ".score.scaled", sScaled);
						SCORM_SetValue(sObjective + ".success_status", sSS);
						SCORM_SetValue(sObjective + ".completion_status", sCS);
					}
				}

				var oModuleObjective = g_oSCO.selectSingleNode("objectives/o[@module='yes']");
				if (oModuleObjective != null)
				{
					var sMin = oModuleObjective.getAttribute("min");
					var sMax = oModuleObjective.getAttribute("max");
					var sRaw = oModuleObjective.getAttribute("raw");
					var sScaled = oModuleObjective.getAttribute("scaled");

					var sSS = oModuleObjective.getAttribute("ss");
					var sCS = oModuleObjective.getAttribute("cs");

					sSS = SCORM_UnAbbreviateSuccessStatus(sSS);
					sCS = SCORM_UnAbbreviateCompletionStatus(sCS);

					if (g_bNormalize)
						sRaw = parseInt(parseFloat(sScaled) * 100 + 0.5);

					SCORM_SetValue("cmi.score.min", sMin);
					SCORM_SetValue("cmi.score.max", sMax);
					SCORM_SetValue("cmi.score.raw", sRaw);
					SCORM_SetValue("cmi.score.scaled", sScaled);
					SCORM_SetValue("cmi.success_status", sSS);
					SCORM_SetValue("cmi.completion_status", sCS);
				}
				break;
			}
			case "1.2":
			{
				var oModuleObjective = g_oSCO.selectSingleNode("objectives/o[@module='yes']");
				if (oModuleObjective != null)
				{
					var sMin = oModuleObjective.getAttribute("min");
					var sMax = oModuleObjective.getAttribute("max");
					var sRaw = oModuleObjective.getAttribute("raw");
					var sScaled = oModuleObjective.getAttribute("scaled");

					// Status
					var sSS = oModuleObjective.getAttribute("ss");
					var sCS = oModuleObjective.getAttribute("cs");

					if (sSS != "u")
						sStatus = sSS;
					else
						sStatus = sCS;

					switch (sStatus)
					{
						case "p":
							sStatus = "passed";
							break;
						case "c":
							sStatus = "completed";
							break;
						case "f":
							sStatus = "failed";
							break;
						case "i":
							sStatus = "incomplete";
							break;
						case "b":
							sStatus = "browsed";
							break;
						case "n":
							sStatus = "not attempted";
							break;
						case "u":
							sStatus = "incomplete";//!!!
							break;
					}

					if (g_bNormalize)
						sRaw = parseInt(parseFloat(sScaled) * 100 + 0.5);

					SCORM_SetValue("cmi.core.score.min", sMin.toString());
					SCORM_SetValue("cmi.core.score.max", sMax.toString());
					SCORM_SetValue("cmi.core.score.raw", sRaw.toString());

					if (sStatus != "not attempted")
						SCORM_SetValue("cmi.core.lesson_status", sStatus);
				}
				break;
			}
		}
	}
}

// SCORM_InitSessionTime
function SCORM_InitSessionTime()
{
	g_dtSessionBegin = new Date();
}

// SCORM_SaveSessionTime
function SCORM_SaveSessionTime()
{
	if (g_oScormApi != null)
	{
		try
		{
			var dtCurrent = new Date();

			var msecElapsed = dtCurrent - g_dtSessionBegin;
			var dtElapsed = new Date(msecElapsed);

			var nYears = dtElapsed.getUTCFullYear() - 1970;
			var nMonths = dtElapsed.getUTCMonth();
			var nDays = dtElapsed.getUTCDate() - 1;
			var nHours = dtElapsed.getUTCHours();
			var nMinutes = dtElapsed.getUTCMinutes();
			var nSeconds = dtElapsed.getUTCSeconds();
			var nMilliseconds = parseInt(dtElapsed.getUTCMilliseconds() / 10);

			switch (g_sScormApiVersion)
			{
				case "2004":
				{
					/*var s = "P";
					if (nYears)
						s += nYears + "Y";
					if (nMonths)
						s += nMonths + "M";
					if (nDays)
						s += nDays + "D";
					if (nHours || nMinutes || nSeconds || nMilliseconds)
					{
						s += "T";
						if (nHours)
							s += nHours + "H";
						if (nMinutes)
							s += nMinutes + "M";
						if (nSeconds || nMilliseconds)
						{
							s += nSeconds;
							if (nMilliseconds)
								s += "." + nMilliseconds;
							s += "S";
						}
					}
					SCORM_SetValue("cmi.session_time", s);*/

					var nSeconds = parseInt(msecElapsed / 1000);
					var nMilliseconds = parseInt((msecElapsed - nSeconds * 1000) / 10);

					var s = "PT";
					s += nSeconds;
					if (nMilliseconds)
					{
						s += ".";
						if (nMilliseconds < 10)
							s += "0";
						s += nMilliseconds;
					}
					s += "S";

					SCORM_SetValue("cmi.session_time", s);
					break;
				}
				case "1.2":
				{
					var s = "";
					if (nHours < 10)
						s += "0";
					s += nHours + ":";
					if (nMinutes < 10)
						s += "0";
					s += nMinutes + ":";
					if (nSeconds < 10)
						s += "0";
					s += nSeconds;
					if (nMilliseconds)
					{
						s += ".";
						if (nMilliseconds < 10)
							s += "0";
						s += nMilliseconds;
					}

					SCORM_SetValue("cmi.core.session_time", s);
					break;
				}
			}
		}
		catch (e)
		{
			//alert(e);
			return false;
		}
	}
	return true;
}

// SCORM_GetInteractionIndex
function SCORM_GetInteractionIndex(sInteractionId)
{
	var sIndex = -1;

	var nInteractionsCount = SCORM_GetValue("cmi.interactions._count");
	nInteractionsCount = parseInt(nInteractionsCount);

	for (var i = 0; i < nInteractionsCount; i++)
	{
		var sExistingInteractionId = SCORM_GetValue("cmi.interactions."+ i +".id")
		if (sExistingInteractionId == sInteractionId)
		{
			sIndex = i;
			break;
		}
	}
	return sIndex;
}

// SCORM_GetInteractionObjectiveIndex
function SCORM_GetInteractionObjectiveIndex(nInteractionIndex, sObjectiveId)
{
	var sIndex = -1;

	var nObjectivesCount = SCORM_GetValue("cmi.interactions."+ nInteractionIndex +".objectives._count");
	nObjectivesCount = parseInt(nObjectivesCount);

	for (var i = 0; i < nObjectivesCount; i++)
	{
		var sExistingObjectiveId = SCORM_GetValue("cmi.interactions."+ nInteractionIndex +".objectives."+ i +".id")
		if (sExistingObjectiveId == sObjectiveId)
		{
			sIndex = i;
			break;
		}
	}
	return sIndex;
}

// SCORM_GetInteractionCorrectResponseIndex
function SCORM_GetInteractionCorrectResponseIndex(nInteractionIndex, sCorrectResponsePattern)
{
	var sIndex = -1;

	var nCorrectResponsesCount = SCORM_GetValue("cmi.interactions."+ nInteractionIndex +".correct_responses._count");
	nCorrectResponsesCount = parseInt(nCorrectResponsesCount);

	for (var i = 0; i < nCorrectResponsesCount; i++)
	{
		var sExistingCorrectResponsePattern = SCORM_GetValue("cmi.interactions."+ nInteractionIndex +".correct_responses."+ i.toString() +".pattern")
		if (sExistingCorrectResponsePattern == sCorrectResponsePattern)
		{
			sIndex = i;
			break;
		}
	}
	return sIndex;
}

// SCORM_SaveInteractions
function SCORM_SaveInteractions()
{
	if (g_oScormApi != null)
	{
		switch (g_sScormApiVersion)
		{
			case "2004":
			{
				var sIntChildren = SCORM_GetValue("cmi.interactions._children");
				var oInteractions = g_oSCO.selectNodes("interactions/i");
				var oInteraction;
				var sId = "";
				var sType = "";
				var sWeighting = "";
				var sLearnerResponse = "";
				var sDescription = "";
				var sTimestamp = "";
				var sLatency = "";
				var sResult = "";
				for (var i = 0; i < oInteractions.length; i++)
				{
					oInteraction = oInteractions[i];

					sId = oInteraction.getAttribute("id");
					if(sId == null) continue;

					sType = oInteraction.getAttribute("t");
					if(sType == null) continue;
					switch(sType)
					{
						case "multiple_choice":	sType = "choice"; 		break;
						case "true_false": 		sType = "true-false"; 	break;
						case "fill_in":			sType = "fill-in"; 		break;
						case "long_fill_in":	sType = "long-fill-in";	break;
					}

					sWeighting = oInteraction.getAttribute("w");
					if(sWeighting == null) sWeighting = "0";

					sLearnerResponse = oInteraction.getAttribute("l");
					if(sLearnerResponse==null) sLearnerResponse = "";

					sDescription = oInteraction.getAttribute("d");
					if(sDescription == null) sDescription = "";

					sResult = oInteraction.getAttribute("r");
					if(sResult == null) sResult = "incorrect";

					sTimestamp = oInteraction.getAttribute("b");
					sLatency = oInteraction.getAttribute("y");

					var nIndex = SCORM_GetInteractionIndex(sId);
					if (nIndex == -1)
					{
						var nInteractionsCount = SCORM_GetValue("cmi.interactions._count");
						nIndex = parseInt(nInteractionsCount);

						var sInteraction = "cmi.interactions." + nIndex;
						SCORM_SetValue(sInteraction + ".id", sId);
					}

					var sInteraction = "cmi.interactions."+ nIndex;

					if(sType!=null) SCORM_SetValue(sInteraction + ".type", sType);

					// Interaction objectives
					if (sIntChildren.indexOf("objectives") != -1)
					{
						var oObjectives = oInteraction.selectNodes("oo/o");
						for (var j = 0; j < oObjectives.length; j++)
						{
							var oObjective = oObjectives[j];
							var sObjectiveId = oObjective.getAttribute("id");

							var nObjectiveIndex = SCORM_GetInteractionObjectiveIndex(nIndex, sObjectiveId);
							if (nObjectiveIndex == -1)
							{
								var nObjectivesCount = SCORM_GetValue("cmi.interactions."+ nIndex +".objectives._count");
								nObjectiveIndex = parseInt(nObjectivesCount);

								var sObjective = "cmi.interactions."+ nIndex +".objectives."+ nObjectiveIndex;
								SCORM_SetValue(sObjective + ".id", sObjectiveId);
							}
						}
					}

					// Interaction CorrectResponses
					if (sIntChildren.indexOf("correct_responses") != -1)
					{
						var oCorrectResponses = oInteraction.selectNodes("rr/r");
						for (var j = 0; j < oCorrectResponses.length; j++)
						{
							var oCorrectResponse = oCorrectResponses[j];
							var sCorrectResponsePattern = oCorrectResponse.getAttribute("p");

							var nCorrectResponseIndex = SCORM_GetInteractionCorrectResponseIndex(nIndex, sCorrectResponsePattern);
							if (nCorrectResponseIndex == -1)
							{
								var nCorrectResponsesCount = SCORM_GetValue("cmi.interactions."+ nIndex +".correct_responses._count");
								nCorrectResponseIndex = parseInt(nCorrectResponsesCount);

								var sCorrectResponse = "cmi.interactions."+ nIndex +".correct_responses."+ nCorrectResponseIndex;
								SCORM_SetValue(sCorrectResponse + ".pattern", sCorrectResponsePattern);
							}
						}
					}

					if (sWeighting!=null) 		SCORM_SetValue(sInteraction + ".weighting", sWeighting);
					if (sLearnerResponse!=null)	SCORM_SetValue(sInteraction + ".learner_response", sLearnerResponse);
					if (sResult!=null) 			SCORM_SetValue(sInteraction + ".result", sResult);
					if (sTimestamp!=null)
					{
						if (sIntChildren.indexOf("timestamp")!=-1)
						{
							SCORM_SetValue(sInteraction + ".timestamp", sTimestamp);
						}
						else
						{
							if (sIntChildren.indexOf("datetime")!=-1) SCORM_SetValue(sInteraction + ".datetime", sTimestamp);
						}
					}
					if(sLatency!=null)			SCORM_SetValue(sInteraction + ".latency", sLatency);
					if(sDescription!=null)		SCORM_SetValue(sInteraction + ".description", sDescription);
				}
				return true;
				break;
			}
			case "1.2":
			{
				break;
			}
		}
	}
	return false;
}

// SCORM_Load
function SCORM_Load()
{
	var bLoaded = false;
	try
	{
		switch (g_sScormApiVersion)
		{
			case "2004":
			{
				g_sLmsCmiEntry = SCORM_GetValue("cmi.entry");
				if(g_sLmsCmiEntry == "resume" || g_sLmsCmiEntry == "")
				{
					g_sLmsCmiLocation = SCORM_GetValue("cmi.location");

					var sData = SCORM_GetValue("cmi.suspend_data");
					if(!RestoreSuspendData(sData))
					{
						if(sData!=null && sData!="")
						{
							g_sLmsCmiSuspendData = ReplaceStr(sData, '\\"','"');
							var oTestDoc = CreateDOMDocument();
							try
							{
								oTestDoc.loadXML(g_sLmsCmiSuspendData);
							}
							catch(e)
							{
							}
							if(oTestDoc.xml!="")
							{
								g_oDocSCO.loadXML(g_sLmsCmiSuspendData);
								g_oSCO = g_oDocSCO.selectSingleNode("//SCO");
							}
						}
					}
					else
					{
						g_sLmsCmiSuspendData = g_oSCO.xml;
					}

					if(g_sLmsCmiLocation != "" && g_sLmsCmiSuspendData != "") bLoaded = true;
				}
				break;
			}
			case "1.2":
			{
				g_sLmsCmiEntry = SCORM_GetValue("cmi.core.entry");
				if (g_sLmsCmiEntry == "resume" || g_sLmsCmiEntry == "")
				{
					g_sLmsCmiLocation = SCORM_GetValue("cmi.core.lesson_location");

					var sData = SCORM_GetValue("cmi.suspend_data");
					if(!RestoreSuspendData(sData))
					{
						if(sData!=null && sData!="")
						{
							g_sLmsCmiSuspendData = ReplaceStr(sData, '\\"','"');
							var oTestDoc = CreateDOMDocument();
							try
							{
								oTestDoc.loadXML(g_sLmsCmiSuspendData);
							}
							catch(e)
							{
							}
							if(oTestDoc.xml!="")
							{
								g_oDocSCO.loadXML(g_sLmsCmiSuspendData);
								g_oSCO = g_oDocSCO.selectSingleNode("//SCO");
							}
						}
					}
					else
					{
						g_sLmsCmiSuspendData = g_oSCO.xml;
					}

					if(g_sLmsCmiLocation != "" && g_sLmsCmiSuspendData != "") bLoaded = true;
				}
				break;
			}
		}
	}
	catch (e)
	{
		if(g_bLmsDebug) alert(e);
	}
	return bLoaded;
}

// SCORM_Save
function SCORM_Save()
{
	try
	{
		switch (g_sScormApiVersion)
		{
			case "2004":
			{
				SCORM_SaveSessionTime();

				SCORM_SetValue("cmi.location", g_sLmsCmiLocation);
				SCORM_SetValue("cmi.exit", g_bLmsCmiExitSuspend ? "suspend" : "");
				SCORM_SaveObjectives();
				SCORM_SaveInteractions();
				var sData = PrepareSuspendData(true, true);
				SCORM_SetValue("cmi.suspend_data", sData);

				SCORM_Commit();
				break;
			}
			case "1.2":
			{
				SCORM_SaveSessionTime();

				SCORM_SetValue("cmi.core.lesson_location", g_sLmsCmiLocation);
				SCORM_SetValue("cmi.core.exit", g_bLmsCmiExitSuspend ? "suspend" : "");
				SCORM_SaveObjectives();
				SCORM_SaveInteractions();
				var sData = PrepareSuspendData(true, true);
				SCORM_SetValue("cmi.suspend_data", sData);

				SCORM_Commit();
				break;
			}
		}
	}
	catch (e)
	{
		if(g_bLmsDebug) alert(e);
	}
}

// AICC_Obtain
function AICC_Obtain(oWindow)
{
	if (g_bUseAicc)
	{
		var s = window.location.search;
		if (s.length > 0)
		{
			var arPairs = s.split("&");
			for(var i = 0; i < arPairs.length; i++)
			{
				if (arPairs[i].indexOf("?") == 0)
					arPairs[i] = arPairs[i].substring(1, arPairs[i].length);

				var arPair = arPairs[i].split("=");
				if (arPair.length == 2)
				{
					var sName = arPair[0];
					var sValue = arPair[1];

					sName = sName.toLowerCase();
					switch (sName)
					{
						case "aicc_sid":
							g_sAiccSid = sValue;
							break;
						case "aicc_url":
							g_sAiccUrl = unescape(sValue);
							break;
					}
				}
			}
			if (g_sAiccSid != "" && g_sAiccUrl != "")
				g_bAicc = true;
		}
	}
}

// AICC_Initialize
function AICC_Initialize()
{
	if (g_bAicc)
	{
	}
}

// AICC_Shutdown
function AICC_Shutdown()
{
	if (g_bAicc)
	{
	}
}

// AICC_Load
function AICC_Load()
{
	try
	{
		var sAiccData = "";
		var sSend = "command=GetParam&version=2.0&session_id="+ escape(g_sAiccSid) +"&AICC_Data="+ escape(sAiccData);

		var oXmlHttp = CreateXMLHTTP();
		oXmlHttp.open("POST", g_sAiccUrl, false);
		oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		oXmlHttp.send(sSend);
		if (oXmlHttp.status != 200)
		{
			var e = "AICC_Load:\n";
			e += "XmlHttp.status "+ oXmlHttp.status;
			throw e;
		}

		var sResponse = oXmlHttp.responseText;
		AICC_HandleResponse(sResponse);
		AICC_InitSessionTime();
	}
	catch (e)
	{
		if(g_bLmsDebug) alert(e);
		return false;
	}
	return true;
}

// AICC_Save
function AICC_Save()
{
	try
	{
		var sAiccData = AICC_PrepareData();
		var sSend = "command=PutParam&version=2.0&session_id="+ escape(g_sAiccSid) +"&AICC_Data="+ escape(sAiccData);

		var oXmlHttp = CreateXMLHTTP();
		oXmlHttp.open("POST", g_sAiccUrl, false);
		oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		oXmlHttp.send(sSend);
		if (oXmlHttp.status != 200)
		{
			var e = "AICC_Save:\n";
			e += "XmlHttp.status "+ oXmlHttp.status;
			throw e;
		}
	}
	catch (e)
	{
		if(g_bLmsDebug) alert(e);
		return false;
	}
	return true;
}

// AICC_PrepareData
function AICC_PrepareData()
{
	var sScore = "0";
	var sStatus = "i";

	var oModuleObjective = g_oSCO.selectSingleNode("objectives/o[@module='yes']");
	if (oModuleObjective != null)
	{
		// Score
		var sRaw = oModuleObjective.getAttribute("raw");
		var sScaled = oModuleObjective.getAttribute("scaled");

		if (g_bNormalize)
			sRaw = parseInt(parseFloat(sScaled) * 100 + 0.5);

		sScore = sRaw;

		// Status
		var sSS = oModuleObjective.getAttribute("ss");
		var sCS = oModuleObjective.getAttribute("cs");

		if (sSS != "u")
			sStatus = sSS;
		else
			sStatus = sCS;

//		sStatus += ",suspend";
	}

	var sCRLF = String.fromCharCode(13,10);

	var sData = "";

	sData += "[CORE]" + sCRLF;
		sData += "Lesson_Location="+ g_sLmsCmiLocation + sCRLF;
		sData += "Lesson_Status="+ sStatus + sCRLF;
		sData += "Score="+ sScore + sCRLF;
		sData += "Time="+ AICC_ReturnSessionTime() + sCRLF;

	AICC_InitSessionTime();

	sData += "[CORE_LESSON]" + sCRLF;
		sData += "Suspend_Data=" + PrepareSuspendData(true, true) + sCRLF;

	sData += "[OBJECTIVES_STATUS]" + sCRLF;

	var nIndex = 1;

	var oObjectives = g_oSCO.selectNodes("objectives/o");
	for (var i = 0; i < oObjectives.length; i++)
	{
		var oObjective = oObjectives[i];

		var sModule = oObjective.getAttribute("module");
		if (sModule != "yes")
		{
			var sId = oObjective.getAttribute("id");
			var sRaw = oObjective.getAttribute("raw");

			var sSS = oObjective.getAttribute("ss");
			var sCS = oObjective.getAttribute("cs");

			var sStatus;
			if (sSS != "u")
				sStatus = sSS;
			else
				sStatus = sCS;

			sData += "J_ID."+ nIndex +"="+ sId + sCRLF;
			sData += "J_Score."+ nIndex +"="+ sRaw + sCRLF;
			sData += "J_Status."+ nIndex +"="+ sStatus + sCRLF;

			nIndex += 1;
		}
	}

	return sData;
}

// AICC_HandleResponse
function AICC_HandleResponse(sResponse)
{
	var sCRLF = String.fromCharCode(13,10);
	var sCR = String.fromCharCode(10);

	var sSrc = unescape(sResponse);

	// Remove comments
	sSrc = sSrc.replace(/^;.*$/gm, "");

	var re = /^\[(\w+)\]$/m;
	var sNameSeparator = " ";

	var pGroups = null;
	for (;;)
	{
		if (sSrc.length == 0)
			break;

		var nGroupBegin = sSrc.search(re);
		sSrc = sSrc.substr(nGroupBegin);

		var sGroup = sSrc.replace(re, "$1" + sNameSeparator);
		var sGroupName = sGroup.substr(0, sGroup.search(sNameSeparator));
		sGroup = sGroup.substr(sGroupName.length + 1);

		var nNextGroupBegin = sGroup.search(re);
		if (nNextGroupBegin == -1)
			nNextGroupBegin = sGroup.length;

		sSrc = sGroup.substr(nNextGroupBegin);
		sGroup = sGroup.substr(0, nNextGroupBegin);

		// Remove extra line breaks
		sGroup = sGroup.replace(/[\n\r]+/gm, sCR);
		sGroup = sGroup.replace(/^[\n]+/gm, "");

		var oGroup = new Object;
		oGroup.sName = sGroupName.toLowerCase();
		oGroup.arVars = sGroup.split(sCR);
		oGroup.pNext = pGroups;
		pGroups = oGroup;
	}

	for (var oGroup = pGroups; oGroup != null; oGroup = oGroup.pNext)
	{
		for (var i = 0; i < oGroup.arVars.length; i++)
		{
			var sPair = oGroup.arVars[i];
			if (sPair.length > 0)
			{
				//var ar = sPair.split(/\s*=\s*/);
				//var sName = ar[0].toLowerCase();
				//var sValue = ar[1];

				var nBegin = sPair.search("=");
				var sName = sPair.substring(0, nBegin);
				var sValue = sPair.substring(nBegin + 1);

				sName = sName.toLowerCase();

				if (oGroup.sName == "core")
				{
					switch (sName)
					{
						case "lesson_status":
						{
							sValue = sValue.toLowerCase();
							var arValues = sValue.split(",");

							var sStatus = arValues[0];

							var sFlag = "r";
							if (arValues.length > 1)
								sFlag = arValues[1];

							if (sFlag == "r" || sFlag == "resume")
								g_sLmsCmiEntry = "resume";
							break;
						}
						case "lesson_location":
						{
							g_sLmsCmiLocation = sValue;
							break;
						}
					}
				}
				else if (oGroup.sName == "core_lesson")
				{
					switch (sName)
					{
						case "suspend_data":

							var sData = sValue;
							if(!RestoreSuspendData(sData))
							{
								if(sData!=null && sData!="")
								{
									g_sLmsCmiSuspendData = ReplaceStr(sData, '\\"','"');
									var oTestDoc = CreateDOMDocument();
									try
									{
										oTestDoc.loadXML(g_sLmsCmiSuspendData);
									}
									catch(e)
									{
									}
									if(oTestDoc.xml!="")
									{
										g_oDocSCO.loadXML(g_sLmsCmiSuspendData);
										g_oSCO = g_oDocSCO.selectSingleNode("//SCO");
									}
								}
							}
							else
							{
								g_sLmsCmiSuspendData = g_oSCO.xml;
							}
							break;
					}
				}
			}
		}
	}
}

// LMSInitialize
function LMSInitialize()
{
	SCORM_Obtain(window);
	if (g_bScorm)
	{
		SCORM_Initialize();
	}
	else
	{
		AICC_Obtain(window);
		if (g_bAicc)
			AICC_Initialize();
	}
}

// LMSShutdown
function LMSShutdown()
{
	if (g_bLMSShotDown == false)
	{
		if (g_bScorm)
			SCORM_Shutdown();
		else if (g_bAicc)
			AICC_Shutdown();
		g_bLMSShotDown = true;
	}
}

// LMSLoadState
function LMSLoadState()
{
	var bLoaded = false;
	if (g_bLMSShotDown == false)
	{
		try
		{
			if (g_bScorm)
			{
				bLoaded = SCORM_Load();
			}
			else if (g_bAicc)
			{
				bLoaded = AICC_Load();
			}
		}
		catch (e)
		{
		}
	}
	return bLoaded;
}

// LMSSaveState
function LMSSaveState()
{
	if (g_bLMSShotDown == false)
	{
		try
		{
			if (g_bScorm)
			{
				SCORM_Save();
			}
			else if (g_bAicc)
			{
				AICC_Save();
			}
		}
		catch (e)
		{
		}
	}
}

// RemoveInteractionNode
function RemoveInteractionNode(sID)
{
	var oInteractions = g_oSCO.selectSingleNode("interactions");
	var oInteraction = GetInteraction(sID);
	if(oInteraction!=null)
	{
		var oTmp = oInteractions.removeChild(oInteraction);
		oTmp = null;
		return true;
	}
	return false;
}

// ReturnInteraction
function ReturnInteraction(sID, bReplace)
{
	if(bReplace) RemoveInteractionNode(sID);
	var oInteraction = GetInteraction(sID);
	if(oInteraction==null)
	{
		var oInteractions = g_oSCO.selectSingleNode("interactions");
		if (oInteractions==null)
		{
			var oInteractions = g_oDocSCO.createElement("interactions");
			g_oSCO.appendChild(oInteractions);
		}
		var oInteraction = g_oDocSCO.createElement("i");
		oInteractions.appendChild(oInteraction);
		oInteraction.setAttribute("id", sID);
		var dDate = new Date();
		var sDate = ConvertDateToISO8601(dDate);
		oInteraction.setAttribute("b", sDate);
	}
	return oInteraction;
}

// SetInteractionParam
function SetInteractionParam(sID, sParam, sValue)
{
	var oInteraction = ReturnInteraction(sID);
	var sAttrName = "y";
	if(sParam!="latency") sAttrName = sParam.charAt(0);
	oInteraction.setAttribute(sAttrName, sValue);
	return true;
}

// SetInteractionArrayItem
function SetInteractionArrayItem(sID, sArray, sValue)
{
	var oInteraction = ReturnInteraction(sID);
	var sParentName = sArray=="objectives" ? "oo" : "rr";
	var sNodeName = sArray=="objectives" ? "o" : "r";
	var sAttrName = sArray=="objectives" ? "id" : "p";
	var oParent = oInteraction.selectSingleNode(sParentName);
	if(oParent==null)
	{
		oParent = g_oDocSCO.createElement(sParentName);
		oInteraction.appendChild(oParent);
	}
	var aoNodes = oParent.selectNodes(sNodeName);
	if(aoNodes.length>0)
	{
		for(var i=0;i<aoNodes.length;i++)
		{
			if(aoNodes[i].getAttribute(sAttrName)==sValue) return false;
		}
	}
	var oNode = g_oDocSCO.createElement(sNodeName);
	oParent.appendChild(oNode);
	oNode.setAttribute(sAttrName, sValue);
	return true;
}

// GetInteractionParam
function GetInteractionParam(sID, sParam)
{
	var oInteraction = GetInteraction(sID);
	if(oInteraction==null) return null;
	var sAttrName = sParam=="timestamp" ? "b" : "y";
	if(sParam!="latency" && sParam!="timestamp") sAttrName = sParam.charAt(0);
	return oInteraction.getAttribute(sAttrName);
}

// GetInteractionArray
function GetInteractionArray(sID, sArray)
{
	var oInteraction = GetInteraction(sID);
	if(oInteraction==null) return null;
	var sParentName = sArray=="objectives" ? "oo" : "rr";
	var oParent = oInteraction.selectSingleNode(sParentName);
	if(oParent==null) return null;
	var sNodeName = sArray=="objectives" ? "o" : "r";
	var aNodes = oParent.selectNodes(sNodeName);
	if(aNodes.length==0) return null;
	var sAttrName = sArray=="objectives" ? "id" : "p";
	var sTmp = "";
	var aArray = new Array();
	for(var i=0;i<aNodes.length;i++)
	{
		sTmp = aNodes[i].getAttribute(sAttrName);
		if(sTmp==null) continue;
		aArray.push(sTmp);
	}
	return aArray;
}

// AICC_InitSessionTime
function AICC_InitSessionTime()
{
	g_dtSessionBegin = new Date();
}

// AICC_ReturnSessionTime
function AICC_ReturnSessionTime()
{
	if (g_bAicc)
	{
		try
		{
			var dtCurrent = new Date();

			var msecElapsed = dtCurrent - g_dtSessionBegin;
			var dtElapsed = new Date(msecElapsed);

			var nYears = dtElapsed.getUTCFullYear() - 1970;
			var nMonths = dtElapsed.getUTCMonth();
			var nDays = dtElapsed.getUTCDate() - 1;
			var nHours = dtElapsed.getUTCHours();
			var nMinutes = dtElapsed.getUTCMinutes();
			var nSeconds = dtElapsed.getUTCSeconds();

			var s = "";

			if (nHours < 10) 		s += "0";
			s += nHours + ":";

			if (nMinutes < 10)		s += "0";
			s += nMinutes + ":";

			if (nSeconds < 10)		s += "0";
			s += nSeconds;

			return s;

		}
		catch (e)
		{
			//alert(e);
			return "00:00:00";
		}
	}
	return "00:00:00";
}

function PrepareSuspendData(bObjectives, bInteractions)
{
	var sText = "";
	var aChildren = new Array();
	g_aConstants = new Array();
	var oSuspendData = CreateDOMDocument();
	var oRoot = oSuspendData.createElement("S");
	if (g_isMSIE)
		oSuspendData.appendChild(oRoot);
	else if (g_isFirefox)
		oSuspendData.documentElement.appendChild(oRoot);

	var oVisits = g_oSCO.selectSingleNode("visits");
	if(oVisits!=null)
	{
		if(oVisits.hasChildNodes())
		{
			sText = oVisits.text;
			if(sText==null) sText = "";
			AppendNode(oSuspendData, oRoot, "Z", sText);
		}
	}
	for(var i in g_arVars)
	{
		var oVars = AppendNode(oSuspendData, oRoot, "V");
		var oVar;
		for(var j in g_arVars)
		{
			oVar = AppendNode(oSuspendData, oVars, "I", g_arVars[j]);
			oVar.setAttribute("i", j);
		}
		break;
	}

	var oObjects = g_oSCO.selectSingleNode("objects");
	if(oObjects!=null)
	{
		if(oObjects.hasChildNodes())
		{
			aChildren = oObjects.childNodes;
			var oSDObjects = AppendNode(oSuspendData, oRoot, "O");
			var oChild;
			for(var i=0; i<aChildren.length; i++)
			{
				if(aChildren[i].nodeType!=1) continue;
				oChild = aChildren[i].cloneNode(true);
				oSDObjects.appendChild(oChild);
			}
		}
	}

	if(bObjectives)
	{
		var oObjectives = g_oSCO.selectSingleNode("objectives");
		if(oObjectives!=null)
		{
			if(oObjectives.hasChildNodes())
			{
				var aObjectiveNodes = oObjectives.selectNodes("o");
				var oSDObjectives = AppendNode(oSuspendData, oRoot, "J");
				var oSDObj;
				for(var i=0; i<aObjectiveNodes.length; i++)
				{
					oSDObj = AppendNode(oSuspendData, oSDObjectives, "I");
					sText = MaskValue(aObjectiveNodes[i].getAttribute("id"));
					oSDObj.setAttribute("i", sText);
					sText = aObjectiveNodes[i].getAttribute("raw");
					oSDObj.setAttribute("r", sText);
					sText = aObjectiveNodes[i].getAttribute("scaled");
					oSDObj.setAttribute("l", sText);
					sText = aObjectiveNodes[i].getAttribute("cs");
					oSDObj.setAttribute("c", sText);
					sText = aObjectiveNodes[i].getAttribute("ss");
					oSDObj.setAttribute("s", sText);
					if(aObjectiveNodes[i].hasChildNodes())
					{
						var aSources = aObjectiveNodes[i].selectNodes("s");
						var aText = new Array();
						for(var j=0; j<aSources.length; j++)
						{
							sText = MaskValue(aSources[j].getAttribute("id"));
							sText += "#" + aSources[j].getAttribute("raw");
							aText.push(sText);
						}
						if(aText.length>0) oSDObj.setAttribute("u", aText.join("~"));
					}
				}
			}
		}
	}

	if(bInteractions)
	{
		var oInteractions = g_oSCO.selectSingleNode("interactions");
		if(oInteractions!=null)
		{
			if(oInteractions.hasChildNodes())
			{
				var aINodes = oInteractions.selectNodes("i");
				var oSDInteractions = AppendNode(oSuspendData, oRoot, "R");
				var oSDInteraction;
				for(var i=0; i<aINodes.length; i++)
				{
					oSDInteraction = AppendNode(oSuspendData, oSDInteractions, "I");
					oSDInteraction.setAttribute("i", MaskValue(aINodes[i].getAttribute("id")));
					sText = aINodes[i].getAttribute("t");
					if(sText!=null)	oSDInteraction.setAttribute("t", g_aTerms[sText]);
					sText = aINodes[i].getAttribute("r");
					if(sText!=null)	oSDInteraction.setAttribute("r", g_aTerms[sText]);
					sText = aINodes[i].getAttribute("b");
					if(sText!=null)	oSDInteraction.setAttribute("b", MaskValue(sText, "time"));
					sText = aINodes[i].getAttribute("y");
					if(sText!=null)	oSDInteraction.setAttribute("y", MaskValue(sText, "period"));
					sText = aINodes[i].getAttribute("d");
					if(sText!=null)	oSDInteraction.setAttribute("d", sText);
					sText = aINodes[i].getAttribute("l");
					if(sText!=null)	oSDInteraction.setAttribute("l", sText);
					sText = aINodes[i].getAttribute("w");
					if(sText!=null)	oSDInteraction.setAttribute("w", sText);
					if(aINodes[i].hasChildNodes())
					{
						aChildren = aINodes[i].selectNodes("oo/o");
						if(aChildren.length>0)
						{
							var aObj = new Array();
							for(var j=0; j<aChildren.length; j++) aObj.push(aChildren[j].getAttribute("id"));
							oSDInteraction.setAttribute("o", aObj.join("~"));
						}
						aChildren = aINodes[i].selectNodes("rr/r");
						if(aChildren.length>0)
						{
							var aObj = new Array();
							for(var j=0; j<aChildren.length; j++) aObj.push(aChildren[j].getAttribute("p"));
							oSDInteraction.setAttribute("p", aObj.join("[~]"));
						}
					}
				}
			}
		}
	}

	if(g_aConstants.length>0)
	{
		AppendNode(oSuspendData, oRoot, "C", g_aConstants.join("~"));
	}
	return oSuspendData.xml;
}

// RestoreSuspendData
function RestoreSuspendData(sData)
{
	var sNewData = Trim(sData);
	var sId = "";
	var sText = "";
	if(sNewData.indexOf("<S>")!=0 || sNewData.indexOf("</S>")==-1) return false;
	sNewData = sNewData.substring(0, sNewData.indexOf("</S>")+4);
	var oSuspendData = CreateDOMDocument();
	try
	{
		oSuspendData.loadXML(sNewData);
	}
	catch(e)
	{
		return false;
	}

	var oRoot = oSuspendData.selectSingleNode("//S");
	if(oRoot==null) return false;

	var oSDConstants = oRoot.selectSingleNode("C");
	if(oSDConstants!=null) g_aConstants = oSDConstants.text.split("~");

	var oSDVisits = oRoot.selectSingleNode("Z");
	if(oSDVisits!=null)
	{
		var oVisits = g_oSCO.selectSingleNode("visits");
		SetTextNodeValue(g_oDocSCO, oVisits, oSDVisits.text);
	}

	var oSDVars = oRoot.selectSingleNode("V");
	if(oSDVars!=null)
	{
		var aVars = oSDVars.selectNodes("I");
		for(var i=0; i<aVars.length; i++)
		{
			sId = aVars[i].getAttribute("i");
			g_arVars[decodeURI(sId)] = aVars[i].text;
		}
	}

	var oSDObjects = oRoot.selectSingleNode("O");
	if(oSDObjects!=null)
	{
		if(oSDObjects.hasChildNodes())
		{
			var oObjects = g_oSCO.selectSingleNode("objects");
			var aChildren = oSDObjects.childNodes;
			var oClone;
			for(var i=0; i<aChildren.length; i++)
			{
				if(aChildren[i].nodeType!=1) continue;
				oClone = aChildren[i].cloneNode(true);
				oObjects.appendChild(oClone);
			}
		}
	}

	var oSDObjectives = oRoot.selectSingleNode("J");
	if(oSDObjectives!=null)
	{
		var oObjectives = g_oSCO.selectSingleNode("objectives");
		var aSDObjectives = oSDObjectives.selectNodes("I");
		var oObjectiveNode;
		for(var i=0; i<aSDObjectives.length; i++)
		{
			sId = UnmaskValue(aSDObjectives[i].getAttribute("i"));
			oObjectiveNode = oObjectives.selectSingleNode("o[@id='" + sId + "']");
			if(oObjectiveNode==null) continue;
			sText = aSDObjectives[i].getAttribute("r");
			if(sText!=null) oObjectiveNode.setAttribute("raw", sText);
			sText = aSDObjectives[i].getAttribute("l");
			if(sText!=null) oObjectiveNode.setAttribute("scaled", sText);
			sText = aSDObjectives[i].getAttribute("c");
			if(sText!=null) oObjectiveNode.setAttribute("cs", sText);
			sText = aSDObjectives[i].getAttribute("s");
			if(sText!=null) oObjectiveNode.setAttribute("ss", sText);
			sText = aSDObjectives[i].getAttribute("u");
			if(sText!=null)
			{
				var aPairs = sText.split("~");
				var iIdx = 0;
				var oSource;
				for(var j=0; j<aPairs.length; j++)
				{
					iIdx = aPairs[j].lastIndexOf("#");
					if(iIdx==-1) continue;
					sId = aPairs[j].substring(0, iIdx);
					sText = aPairs[j].substr(iIdx+1);
					sId = UnmaskValue(sId);
					oSource = oObjectiveNode.selectSingleNode("s[@id='" + sId + "']");
					if(oSource==null)
					{
						oSource = AppendNode(g_oDocSCO, oObjectiveNode, "s");
						oSource.setAttribute("id", sId);
					}
					oSource.setAttribute("raw", sText);
				}
			}
		}
	}

	var oSDInteractions = oRoot.selectSingleNode("R");
	if(oSDInteractions!=null)
	{
		var oInteractions = g_oSCO.selectSingleNode("interactions");
		var aSDInteractions = oSDInteractions.selectNodes("I");
		var oInteractionNode;
		for(var i=0; i<aSDInteractions.length; i++)
		{
			sId = UnmaskValue(aSDInteractions[i].getAttribute("i"));
			oInteractionNode = oInteractions.selectSingleNode("i[@id='" + sId + "']");
			if(oInteractionNode==null)
			{
				oInteractionNode = AppendNode(g_oDocSCO, oInteractions, "i");
				oInteractionNode.setAttribute("id", sId);
			}
			sText = aSDInteractions[i].getAttribute("t");
			if(sText!=null) oInteractionNode.setAttribute("t", g_aTerms[sText]);
			sText = aSDInteractions[i].getAttribute("r");
			if(sText!=null) oInteractionNode.setAttribute("r", g_aTerms[sText]);
			sText = aSDInteractions[i].getAttribute("b");
			if(sText!=null) oInteractionNode.setAttribute("b", UnmaskValue(sText, "time"));
			sText = aSDInteractions[i].getAttribute("y");
			if(sText!=null) oInteractionNode.setAttribute("y", UnmaskValue(sText, "period"));
			sText = aSDInteractions[i].getAttribute("d");
			if(sText!=null) oInteractionNode.setAttribute("d", sText);
			sText = aSDInteractions[i].getAttribute("l");
			if(sText!=null) oInteractionNode.setAttribute("l", sText);
			sText = aSDInteractions[i].getAttribute("w");
			if(sText!=null) oInteractionNode.setAttribute("w", sText);
			sText = aSDInteractions[i].getAttribute("o");
			if(sText!=null)
			{
				var aObjIds = sText.split("~");
				for(var j=0; j<aObjIds.length; j++) SetInteractionArrayItem(sId, "objectives", aObjIds[j]);
			}
			sText = aSDInteractions[i].getAttribute("p");
			if(sText!=null)
			{
				var aPatterns = sText.split("[~]");
				for(var j=0; j<aPatterns.length; j++) SetInteractionArrayItem(sId, "correct_responses", aPatterns[j]);
			}
		}
	}
	return true;
}
