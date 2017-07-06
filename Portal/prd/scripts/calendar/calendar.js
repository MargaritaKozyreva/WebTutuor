var language = 'ru';	// Default Language: en - english ; es - spanish; de - german; ru - russian
	var enablePast = 0;		// 0 - disabled ; 1 - enabled
	var fixedX = -1;		// x position (-1 if to appear below control)
	var fixedY = -1;		// y position (-1 if to appear below control)
	var startAt = 1;		// 0 - sunday ; 1 - monday
	var showWeekNumber = 0;	// 0 - don't show; 1 - show
	var showToday = 1;		// 0 - don't show; 1 - show
	var showTime = 0;		// 0 - don't show; 1 - show
	
	if (imgDir == null)
		var imgDir = '/scripts/calendar/';		// directory for images ... e.g. var imgDir="/img/"
	var dayName = '';

	var gotoString = {
		ru : 'Íà òåêóùèé ìåñÿö',
		en : 'Go To Current Month',
		es : 'Ir al Mes Actual',
		de : 'Gehe zu aktuellem Monat'
	};
	var todayString = {
		ru : 'Ñåãîäíÿ',
		en : 'Today is',
		es : 'Hoy es',
		de : 'Heute ist'
	};
	var weekString = {
		ru : 'Wk',
		en : 'Wk',
		es : 'Sem',
		de : 'KW'
	};
	var scrollLeftMessage = {
		ru : 'Click to scroll to previous month. Hold mouse button to scroll automatically.',
		en : 'Click to scroll to previous month. Hold mouse button to scroll automatically.',
		es : 'Presione para pasar al mes anterior. Deje presionado para pasar varios meses.',
		de : 'Klicken um zum vorigen Monat zu gelangen. Gedrückt halten, um automatisch weiter zu scrollen.'
	};
	var scrollRightMessage = {
		ru : 'Click to scroll to next month. Hold mouse button to scroll automatically.',
		en : 'Click to scroll to next month. Hold mouse button to scroll automatically.',
		es : 'Presione para pasar al siguiente mes. Deje presionado para pasar varios meses.',
		de : 'Klicken um zum nächsten Monat zu gelangen. Gedrückt halten, um automatisch weiter zu scrollen.'
	};
	var selectMonthMessage = {
		ru : 'Click to select a month.',
		en : 'Click to select a month.',
		es : 'Presione para seleccionar un mes',
		de : 'Klicken um Monat auszuwählen'
	};
	var selectYearMessage = {
		ru : 'Click to select a year.',
		en : 'Click to select a year.',
		es : 'Presione para seleccionar un año',
		de : 'Klicken um Jahr auszuwählen'
	};
	var selectDateMessage = {		// do not replace [date], it will be replaced by date.
		ru : 'Select [date] as date.',
		en : 'Select [date] as date.',
		es : 'Seleccione [date] como fecha',
		de : 'Wähle [date] als Datum.'
	};
	var	monthName = {
		ru : new Array('ßíâàðü','Ôåâðàëü','Ìàðò','Àïðåëü','Ìàé','Èþíü','Èþëü','Àâãóñò','Ñåíòÿáðü','Îêòÿáðü','Íîÿáðü','Äåêàáðü'),
		en : new Array('January','February','March','April','May','June','July','August','September','October','November','December'),
		es : new Array('Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'),
		de : new Array('Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember')
	};
	var	monthName2 = {
		ru : new Array('ßÍÂ','ÔÅÂ','ÌÀÐ','ÀÏÐ','ÌÀÉ','ÈÞÍ','ÈÞË','ÀÂÃ','ÑÅÍ','ÎÊÒ','ÍÎß','ÄÅÊ'),
		en : new Array('JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'),
		es : new Array('ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'),
		de : new Array('JAN','FEB','MRZ','APR','MAI','JUN','JUL','AUG','SEP','OKT','NOV','DEZ')
	};

	if (startAt==0) {
		dayName = {
			ru : new Array('Âñ','Ïí','Âò','Ñð','×ò','Ïò','Ñá'),
			en : new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat'),
			es : new Array('Dom','Lun','Mar','Mie','Jue','Vie','Sab'),
			de : new Array('So','Mo','Di','Mi','Do','Fr','Sa')
		};
	} else {
		dayName = {
			ru : new Array('Ïí','Âò','Ñð','×ò','Ïò','Ñá','Âñ'),
			en : new Array('Mon','Tue','Wed','Thu','Fri','Sat','Sun'),
			es : new Array('Lun','Mar','Mie','Jue','Vie','Sab','Dom'),
			de : new Array('Mo','Di','Mi','Do','Fr','Sa','So')
		};
	}

	var crossobj, crossMonthObj, crossYearObj, monthSelected, yearSelected, dateSelected, omonthSelected, oyearSelected, odateSelected, monthConstructed, yearConstructed, intervalID1, intervalID2, timeoutID1, timeoutID2, ctlToPlaceValue, ctlNow, dateFormat, dateTimeFormat, nStartingYear, selDayAction, isPast, hourSelected,minutesSelected;
	var visYear  = 0;
	var visMonth = 0;
	var bPageLoaded = false;
	var ie  = document.all;
	var dom = document.getElementById;
	var ns4 = document.layers;
	var today    = new Date();
	var dateNow  = today.getDate();
	var monthNow = today.getMonth();
	var yearNow  = today.getYear();
	var imgsrc   = new Array('drop1.gif','drop2.gif','left1.gif','left2.gif','right1.gif','right2.gif');
	var img      = new Array();
	var bShow    = false;

	/* hides <select> and <applet> objects (for IE only) */
	function hideElement( elmID, overDiv ) {
		if(ie) {
			for(i = 0; i < document.all.tags( elmID ).length; i++) {
				obj = document.all.tags( elmID )[i];
				if(!obj || !obj.offsetParent) continue;

				// Find the element's offsetTop and offsetLeft relative to the BODY tag.
				objLeft   = obj.offsetLeft;
				objTop    = obj.offsetTop;
				objParent = obj.offsetParent;

				while(objParent.tagName.toUpperCase()!='BODY' && objParent.tagName.toUpperCase()!='HTML') {
					objLeft  += objParent.offsetLeft;
					objTop   += objParent.offsetTop;
					objParent = objParent.offsetParent;
				}

				objHeight = obj.offsetHeight;
				objWidth  = obj.offsetWidth;

				if((overDiv.offsetLeft + overDiv.offsetWidth) <= objLeft);
				else if((overDiv.offsetTop + overDiv.offsetHeight) <= objTop);
				/* CHANGE by Charlie Roche for nested TDs*/
				else if(overDiv.offsetTop >= (objTop + objHeight + obj.height));
				/* END CHANGE */
				else if(overDiv.offsetLeft >= (objLeft + objWidth));
				else {
					obj.style.visibility = 'hidden';
				}
			}
		}
	}

	/*
	* unhides <select> and <applet> objects (for IE only)
	*/
	function showElementCalendar(elmID) {
		if(ie) {
			for(i = 0; i < document.all.tags( elmID ).length; i++) {
				obj = document.all.tags(elmID)[i];
				if(!obj || !obj.offsetParent) continue;
				obj.style.visibility = '';
			}
		}
	}

	function HolidayRec (d, m, y, desc) {
		this.d = d;
		this.m = m;
		this.y = y;
		this.desc = desc;
	}

	var HolidaysCounter = 0;
	var Holidays = new Array();

	function addHoliday (d, m, y, desc) {
		Holidays[HolidaysCounter++] = new HolidayRec (d, m, y, desc);
	}


	var	styleAnchor = 'text-decoration:none;color:black;';
	var	styleLightBorder = 'border:1px solid #a0a0a0;';

	function swapImage(srcImg, destImg) {
		if (ie) document.getElementById(srcImg).setAttribute('src',imgDir + destImg);
	}

	function init(calendar_ctl) {
		if (!ns4)
		{
			if (dom) {
				for	(i=0;i<imgsrc.length;i++) {
					img[i] = new Image;
					img[i].src = imgDir + imgsrc[i];
				}
				
				var clnd_temp = document.createElement('div');
				var clnd_str = '<div onclick="bShow=true" id="calendar" style="z-index:+999;position:absolute;visibility:hidden;"><table width="'+((showWeekNumber==1)?250:220)+'" style="font-family:Arial;font-size:11px;border: 1px solid #A0A0A0;" bgcolor="#ffffff"><tr bgcolor="#000066"><td><table width="'+((showWeekNumber==1)?248:218)+'"><tr><td style="padding:2px;font-family:Arial;font-size:11px;"><font color="#ffffff' + '' /*C9D3E9*/ +'"><b><span id="caption"></span></b></font></td><td align="right"><a href="#" onclick="hideCalendar();return false;"><img src="'+imgDir+'close.gif" width="15" height="13" border="0" /></a></td></tr></table></td></tr><tr><td style="padding:5px" bgcolor="#ffffff"><span id="content"></span></td></tr>';

				if (showToday == 1) {
					clnd_str += '<tr bgcolor="#f0f0f0"><td style="padding:5px" align="center"><span id="lblToday"></span></td></tr>';
				}
					
				clnd_str += '<tr bgcolor="#f0f0f0" id="timerow" style="display:none"><td style="padding:5px" align="center"><table cellpadding="3" cellspacing="0" border="0"><tr><td><span id="lbltoday">Âðåìÿ:</span></td><td><select name="cal_hours" id="cal_hours"><option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select></td><td><select name="cal_minutes" id="cal_minutes"><option value="00">00</option><option value="05">05</option><option value="10">10</option><option value="15">15</option><option value="20">20</option><option value="25">25</option><option value="30">30</option><option value="35">35</option><option value="40">40</option><option value="45">45</option><option value="50">50</option><option value="55">55</option></select></td><td><input type="button" style="height:20px; font-size:11px" value="îê" onclick="closeCalendar()" /></td></tr></table></td></tr></table></div><div id="selectMonth" style="z-index:+999;position:absolute;visibility:hidden;"></div><div id="selectYear" style="z-index:+999;position:absolute;visibility:hidden;"></div>';
				clnd_temp.innerHTML = clnd_str;
				
				calendar_ctl.parentNode.appendChild(clnd_temp);
			}
			
			if (!ie && yearNow < 1901) yearNow += 1900;

			crossobj=(dom)?document.getElementById('calendar').style : ie? document.all.calendar : document.calendar;
			hideCalendar();

			crossMonthObj = (dom) ? document.getElementById('selectMonth').style : ie ? document.all.selectMonth : document.selectMonth;

			crossYearObj = (dom) ? document.getElementById('selectYear').style : ie ? document.all.selectYear : document.selectYear;

			monthConstructed = false;
			yearConstructed = false;

			if (showToday == 1) {
				//document.getElementById('lblToday').innerHTML =	'<font color="#000066">' + todayString[language] + ' <a onmousemove="window.status=\''+gotoString[language]+'\'" onmouseout="window.status=\'\'" title="'+gotoString[language]+'" style="'+styleAnchor+'" href="#" onclick="return false; monthSelected=monthNow;yearSelected=yearNow;constructCalendar(); return false;">'+dayName[language][(today.getDay()-startAt==-1)?6:(today.getDay()-startAt)]+', ' + dateNow + ' ' + monthName[language][monthNow].substring(0,3) + ' ' + yearNow + '</a></font>';
				document.getElementById('lblToday').innerHTML =	'<font color="#000066">' + todayString[language] + ' '+dayName[language][(today.getDay()-startAt==-1)?6:(today.getDay()-startAt)]+', ' + dateNow + ' ' + monthName[language][monthNow].substring(0,3) + ' ' + yearNow + '</font>';
			}

			sHTML1 = '<span id="spanLeft" style="border:1px solid #36f;cursor:pointer" onmouseover="swapImage(\'changeLeft\',\'left2.gif\');this.style.borderColor=\'#8af\';window.status=\''+scrollLeftMessage[language]+'\'" onclick="decMonth()" onmouseout="clearInterval(intervalID1);swapImage(\'changeLeft\',\'left1.gif\');this.style.borderColor=\'#36f\';window.status=\'\'" onmousedown="clearTimeout(timeoutID1);timeoutID1=setTimeout(\'StartDecMonth()\',500)" onmouseup="clearTimeout(timeoutID1);clearInterval(intervalID1)">&nbsp<img id="changeLeft" src="'+imgDir+'left1.gif" width="10" height="11" border="0">&nbsp</span>&nbsp;';
			sHTML1 += '<span id="spanRight" style="border:1px solid #36f;cursor:pointer" onmouseover="swapImage(\'changeRight\',\'right2.gif\');this.style.borderColor=\'#8af\';window.status=\''+scrollRightMessage[language]+'\'" onmouseout="clearInterval(intervalID1);swapImage(\'changeRight\',\'right1.gif\');this.style.borderColor=\'#36f\';window.status=\'\'" onclick="incMonth()" onmousedown="clearTimeout(timeoutID1);timeoutID1=setTimeout(\'StartIncMonth()\',500)" onmouseup="clearTimeout(timeoutID1);clearInterval(intervalID1)">&nbsp<img id="changeRight" src="'+imgDir+'right1.gif" width="10" height="11" border="0">&nbsp</span>&nbsp;';
			sHTML1 += '<span id="spanMonth" style="border:1px solid #36f;cursor:pointer" onmouseover="swapImage(\'changeMonth\',\'drop2.gif\');this.style.borderColor=\'#8af\';window.status=\''+selectMonthMessage[language]+'\'" onmouseout="swapImage(\'changeMonth\',\'drop1.gif\');this.style.borderColor=\'#36f\';window.status=\'\'" onclick="popUpMonth()"></span>&nbsp;';
			sHTML1 += '<span id="spanYear" style="border:1px solid #36f;cursor:pointer" onmouseover="swapImage(\'changeYear\',\'drop2.gif\');this.style.borderColor=\'#8af\';window.status=\''+selectYearMessage[language]+'\'" onmouseout="swapImage(\'changeYear\',\'drop1.gif\');this.style.borderColor=\'#36f\';window.status=\'\'" onclick="popUpYear()"></span>&nbsp;';

			document.getElementById('caption').innerHTML = sHTML1;

			bPageLoaded=true;
		}
	}

	function hideCalendar() {
		//crossobj = null;
		if(crossobj != null)
		{
		crossobj.visibility = 'hidden';
		if (crossMonthObj != null) crossMonthObj.visibility = 'hidden';
		if (crossYearObj  != null) crossYearObj.visibility = 'hidden';
		}
		showElementCalendar('SELECT');
		showElementCalendar('APPLET');
	}

	function padZero(num) {
		return (num	< 10) ? '0' + num : num;
	}

	function constructDate(d, m, y, h, min) {
	    //debugger;
			if (showTime) {
					sTmp = dateTimeFormat;
					sTmp = sTmp.replace('HH', '<f>');
					sTmp = sTmp.replace('H', '<f>');
					sTmp = sTmp.replace('MM', '<g>');
					sTmp = sTmp.replace('M', '<g>');
					sTmp = sTmp.replace('<f>', h);
					sTmp = sTmp.replace('<g>', min);
			}
			else {
		sTmp = dateFormat;
			}
		sTmp = sTmp.replace ('dd','<e>');
		sTmp = sTmp.replace ('d','<d>');
		sTmp = sTmp.replace ('<e>',padZero(d));
		sTmp = sTmp.replace ('<d>',d);
		sTmp = sTmp.replace ('mmmm','<p>');
		sTmp = sTmp.replace ('mmm','<o>');
		sTmp = sTmp.replace ('mm','<n>');
		sTmp = sTmp.replace ('m','<m>');
		sTmp = sTmp.replace ('<m>',m+1);
		sTmp = sTmp.replace ('<n>',padZero(m+1));
		sTmp = sTmp.replace ('<o>',monthName[language][m]);
		sTmp = sTmp.replace ('<p>',monthName2[language][m]);
		sTmp = sTmp.replace ('yyyy',y);
		return sTmp.replace ('yy',padZero(y%100));
	}

	function closeCalendar() {
		hideCalendar();
	    hoursSelected = document.getElementById("cal_hours").value;
	    minutesSelected = document.getElementById("cal_minutes").value;
		ctlToPlaceValue.value = constructDate(dateSelected,monthSelected,yearSelected,hoursSelected,minutesSelected);
	}

	/*** Month Pulldown	***/
	function StartDecMonth() {
		intervalID1 = setInterval("decMonth()",80);
	}

	function StartIncMonth() {
		intervalID1 = setInterval("incMonth()",80);
	}

	function incMonth () {
		monthSelected++;
		if (monthSelected > 11) {
			monthSelected = 0;
			yearSelected++;
		}
		constructCalendar();
	}

	function decMonth () {
		monthSelected--;
		if (monthSelected < 0) {
			monthSelected = 11;
			yearSelected--;
		}
		constructCalendar();
	}

	function constructMonth() {
		popDownYear()
		if (!monthConstructed) {
			sHTML = "";
			for (i=0; i<12; i++) {
				sName = monthName[language][i];
				if (i == monthSelected){
					sName = '<b>' + sName + '</b>';
				}
				sHTML += '<tr><td id="m' + i + '" onmouseover="this.style.backgroundColor=\'#909090\'" onmouseout="this.style.backgroundColor=\'\'" style="cursor:pointer" onclick="monthConstructed=false;monthSelected=' + i + ';constructCalendar();popDownMonth();event.cancelBubble=true"><font color="#000066">&nbsp;' + sName + '&nbsp;</font></td></tr>';
			}

			document.getElementById('selectMonth').innerHTML = '<table width="70" style="font-family:Arial;font-size:11px;border:1px solid #a0a0a0;" bgcolor="#f0f0f0" cellspacing="0" onmouseover="clearTimeout(timeoutID1)" onmouseout="clearTimeout(timeoutID1);timeoutID1=setTimeout(\'popDownMonth()\',100);event.cancelBubble=true">' + sHTML + '</table>';

			monthConstructed = true;
		}
	}

	function popUpMonth() {
		if (visMonth == 1) {
			popDownMonth();
			visMonth--;
		} else {
			constructMonth();
			crossMonthObj.visibility = (dom||ie) ? 'visible' : 'show';
			crossMonthObj.left = parseInt(crossobj.left) + 50;
			crossMonthObj.top =	parseInt(crossobj.top) + 26;
/*			hideElement('SELECT', document.getElementById('selectMonth'));
			hideElement('APPLET', document.getElementById('selectMonth'));*/
			visMonth++;
		}
	}

	function popDownMonth() {
		crossMonthObj.visibility = 'hidden';
		visMonth = 0;
	}

	/*** Year Pulldown ***/
	function incYear() {
		for	(i=0; i<7; i++) {
			newYear	= (i + nStartingYear) + 1;
			if (newYear == yearSelected)
				txtYear = '<span style="color:#006;font-weight:bold;">&nbsp;' + newYear + '&nbsp;</span>';
			else
				txtYear = '<span style="color:#006;">&nbsp;' + newYear + '&nbsp;</span>';
			document.getElementById('y'+i).innerHTML = txtYear;
		}
		nStartingYear++;
		bShow=true;
	}

	function decYear() {
		for	(i=0; i<7; i++) {
			newYear = (i + nStartingYear) - 1;
			if (newYear == yearSelected)
				txtYear = '<span style="color:#006;font-weight:bold">&nbsp;' + newYear + '&nbsp;</span>';
			else
				txtYear = '<span style="color:#006;">&nbsp;' + newYear + '&nbsp;</span>';
			document.getElementById('y'+i).innerHTML = txtYear;
		}
		nStartingYear--;
		bShow=true;
	}

	function selectYear(nYear) {
		yearSelected = parseInt(nYear + nStartingYear);
		yearConstructed = false;
		constructCalendar();
		popDownYear();
	}

	function constructYear() {
		popDownMonth();
		sHTML = '';
		if (!yearConstructed) {
			sHTML = '<tr><td align="center" onmouseover="this.style.backgroundColor=\'#909090\'" onmouseout="clearInterval(intervalID1);this.style.backgroundColor=\'\'" style="cursor:pointer" onmousedown="clearInterval(intervalID1);intervalID1=setInterval(\'decYear()\',30)" onmouseup="clearInterval(intervalID1)"><font color="#000066">-</font></td></tr>';

			j = 0;
			nStartingYear =	yearSelected - 3;
			for ( i = (yearSelected-3); i <= (yearSelected+3); i++ ) {
				sName = i;
				if (i == yearSelected) sName = '<b>' + sName + '</b>';
				sHTML += '<tr><td id="y' + j + '" onmouseover="this.style.backgroundColor=\'#909090\'" onmouseout="this.style.backgroundColor=\'\'" style="cursor:pointer" onclick="selectYear('+j+');event.cancelBubble=true"><font color="#000066">&nbsp;' + sName + '&nbsp;</font></td></tr>';
				j++;
			}

			sHTML += '<tr><td align="center" onmouseover="this.style.backgroundColor=\'#909090\'" onmouseout="clearInterval(intervalID2);this.style.backgroundColor=\'\'" style="cursor:pointer" onmousedown="clearInterval(intervalID2);intervalID2=setInterval(\'incYear()\',30)" onmouseup="clearInterval(intervalID2)"><font color="#000066">+</font></td></tr>';

			document.getElementById('selectYear').innerHTML = '<table width="44" cellspacing="0" bgcolor="#f0f0f0" style="font-family:Arial;font-size:11px;border:1px solid #a0a0a0;" onmouseover="clearTimeout(timeoutID2)" onmouseout="clearTimeout(timeoutID2);timeoutID2=setTimeout(\'popDownYear()\',100)">' + sHTML + '</table>';

			yearConstructed = true;
		}
	}

	function popDownYear() {
		clearInterval(intervalID1);
		clearTimeout(timeoutID1);
		clearInterval(intervalID2);
		clearTimeout(timeoutID2);
		crossYearObj.visibility= 'hidden';
		visYear = 0;
	}

	function popUpYear() {
		var leftOffset
		if (visYear==1) {
			popDownYear();
			visYear--;
		} else {
			constructYear();
			crossYearObj.visibility	= (dom||ie) ? 'visible' : 'show';
			leftOffset = parseInt(crossobj.left) + document.getElementById('spanYear').offsetLeft;
			if (ie) leftOffset += 6;
			crossYearObj.left = leftOffset;
			crossYearObj.top = parseInt(crossobj.top) + 26;
			visYear++;
		}
	}

	/*** calendar ***/
	function WeekNbr(n) {
		// Algorithm used:
		// From Klaus Tondering's Calendar document (The Authority/Guru)
		// http://www.tondering.dk/claus/calendar.html
		// a = (14-month) / 12
		// y = year + 4800 - a
		// m = month + 12a - 3
		// J = day + (153m + 2) / 5 + 365y + y / 4 - y / 100 + y / 400 - 32045
		// d4 = (J + 31741 - (J mod 7)) mod 146097 mod 36524 mod 1461
		// L = d4 / 1460
		// d1 = ((d4 - L) mod 365) + L
		// WeekNumber = d1 / 7 + 1

		year = n.getFullYear();
		month = n.getMonth() + 1;
		if (startAt == 0) {
			day = n.getDate() + 1;
		} else {
			day = n.getDate();
		}

		a = Math.floor((14-month) / 12);
		y = year + 4800 - a;
		m = month + 12 * a - 3;
		b = Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400);
		J = day + Math.floor((153 * m + 2) / 5) + 365 * y + b - 32045;
		d4 = (((J + 31741 - (J % 7)) % 146097) % 36524) % 1461;
		L = Math.floor(d4 / 1460);
		d1 = ((d4 - L) % 365) + L;
		week = Math.floor(d1/7) + 1;

		return week;
	}

	function constructCalendar () {
		var aNumDays = Array (31,0,31,30,31,30,31,31,30,31,30,31);
		var dateMessage;
		var startDate = new Date (yearSelected,monthSelected,1);
		var endDate;

		if (monthSelected==1) {
			endDate = new Date (yearSelected,monthSelected+1,1);
			endDate = new Date (endDate - (24*60*60*1000));
			numDaysInMonth = endDate.getDate();
		} else {
			numDaysInMonth = aNumDays[monthSelected];
		}

		datePointer = 0;
		dayPointer = startDate.getDay() - startAt;
		
		if (dayPointer<0) dayPointer = 6;

		sHTML = '<table border="0" style="font-family:verdana;font-size:10px;"><tr>';

		if (showWeekNumber == 1) {
			sHTML += '<td width="27"><b>' + weekString[language] + '</b></td><td width="1" rowspan="7" bgcolor="#d0d0d0" style="padding:0px"><img src="'+imgDir+'divider.gif" width="1"></td>';
		}

		for (i = 0; i<7; i++) {
			sHTML += '<td width="27" align="right"><b><font color="#000066">' + dayName[language][i] + '</font></b></td>';
		}

		sHTML += '</tr><tr>';
		
		if (showWeekNumber == 1) {
			sHTML += '<td align="right">' + WeekNbr(startDate) + '&nbsp;</td>';
		}

		for	( var i=1; i<=dayPointer;i++ ) {
			sHTML += '<td>&nbsp;</td>';
		}
	
		for	( datePointer=1; datePointer <= numDaysInMonth; datePointer++ ) {
			dayPointer++;
			sHTML += '<td align="right">';
			sStyle=styleAnchor;
			if ((datePointer == odateSelected) && (monthSelected == omonthSelected) && (yearSelected == oyearSelected))
			{ sStyle+=styleLightBorder }

			sHint = '';
			for (k = 0;k < HolidaysCounter; k++) {
				if ((parseInt(Holidays[k].d) == datePointer)&&(parseInt(Holidays[k].m) == (monthSelected+1))) {
					if ((parseInt(Holidays[k].y)==0)||((parseInt(Holidays[k].y)==yearSelected)&&(parseInt(Holidays[k].y)!=0))) {
						sStyle+= 'background-color:#fdd;';
						sHint += sHint=="" ? Holidays[k].desc : "\n"+Holidays[k].desc;
					}
				}
			}

			sHint = sHint.replace('/\"/g', '&quot;');

			dateMessage = 'onmousemove="window.status=\'' + selectDateMessage[language].replace('[date]', constructDate(datePointer, monthSelected, yearSelected, hoursSelected, minutesSelected)) + '\'" onmouseout="window.status=\'\'" ';


			//////////////////////////////////////////////
			//////////  Modifications PinoToy  //////////
			//////////////////////////////////////////////
			if (enablePast == 0 && ((yearSelected < yearNow) || (monthSelected < monthNow) && (yearSelected == yearNow) || (datePointer < dateNow) && (monthSelected == monthNow) && (yearSelected == yearNow))) {
				selDayAction = '';
				isPast = 1;
			} else {
				//selDayAction = 'href="javascript:dateSelected=' + datePointer + ';closeCalendar();"';
				selDayAction = 'href="#" onclick="dateSelected=' + datePointer + ';closeCalendar();return false;"';
				isPast = 0;
			}

			if ((datePointer == dateNow) && (monthSelected == monthNow) && (yearSelected == yearNow)) {	///// today
				sHTML += "<b><a "+dateMessage+" title=\"" + sHint + "\" style='"+sStyle+"' "+selDayAction+"><font color=#ff0000>&nbsp;" + datePointer + "</font>&nbsp;</a></b>";
			} else if (dayPointer % 7 == (startAt * -1)+1) {									///// SI ES DOMINGO
				if (isPast==1)
					sHTML += "<a "+dateMessage+" title=\"" + sHint + "\" style='"+sStyle+"' "+selDayAction+">&nbsp;<font color=#909090>" + datePointer + "</font>&nbsp;</a>";
				else
					sHTML += "<a "+dateMessage+" title=\"" + sHint + "\" style='"+sStyle+"' "+selDayAction+">&nbsp;<font color=#54A6E2>" + datePointer + "</font>&nbsp;</a>";
			} else if ((dayPointer % 7 == (startAt * -1)+7 && startAt==1) || (dayPointer % 7 == startAt && startAt==0)) {	///// SI ES SABADO
				if (isPast==1)
					sHTML += "<a "+dateMessage+" title=\"" + sHint + "\" style='"+sStyle+"' "+selDayAction+">&nbsp;<font color=#909090>" + datePointer + "</font>&nbsp;</a>";
				else
					sHTML += "<a "+dateMessage+" title=\"" + sHint + "\" style='"+sStyle+"' "+selDayAction+">&nbsp;<font color=#54A6E2>" + datePointer + "</font>&nbsp;</a>";
			} else {																			///// CUALQUIER OTRO DIA
				if (isPast==1)
					sHTML += "<a "+dateMessage+" title=\"" + sHint + "\" style='"+sStyle+"' "+selDayAction+">&nbsp;<font color=#909090>" + datePointer + "</font>&nbsp;</a>";
				else
					sHTML += "<a "+dateMessage+" title=\"" + sHint + "\" style='"+sStyle+"' "+selDayAction+">&nbsp;<font color=#000066>" + datePointer + "</font>&nbsp;</a>";
			}

			sHTML += '';
			if ((dayPointer+startAt) % 7 == startAt) {
				sHTML += '</tr><tr>';
				if ((showWeekNumber == 1) && (datePointer < numDaysInMonth)) {
					sHTML += '<td align="right">' + (WeekNbr(new Date(yearSelected,monthSelected,datePointer+1))) + '&nbsp;</td>';
				}
			}
		}

		document.getElementById('content').innerHTML   = sHTML
		document.getElementById('spanMonth').innerHTML = '&nbsp;' +	monthName[language][monthSelected] + '&nbsp;<img id="changeMonth" src="'+imgDir+'drop1.gif" width="12" height="10" border="0">'
		document.getElementById('spanYear').innerHTML  = '&nbsp;' + yearSelected	+ '&nbsp;<img id="changeYear" src="'+imgDir+'drop1.gif" width="12" height="10" border="0">';
	}
	function CreateCalendar(urlId, objectName, format, _language) {
		if(crossobj != null || crossobj != undefined)
			if(crossobj.visibility != 'hidden')
				hideCalendar();
		obj = document.getElementById(urlId);
		var _f_ar = format.split(' ');
		if(_f_ar.length > 1)
			showTime = 1;
		else
			showTime = 0;
		if (_language == undefined)
			_language = "ru";
		var offP = obj.offsetParent;
		var h=0;
		while(offP.id != 'main_block' && offP.tagName.toUpperCase()!='BODY') 
		{h+=offP.offsetTop; offP = offP.offsetParent;} ; 
		showCalendar(obj, document.getElementById(objectName), format,_language,1,null, h+25,showTime);
	}
	function showCalendar(calendar_ctl, calendar_ctl2, format, lang, past, fx, fy, sht) {
		init(calendar_ctl);
		if (lang != null && lang != '') language = lang;
		if (past != null) enablePast = past;
		else enablePast = 0;
		if (fx != null) fixedX = fx;
		else fixedX = -1;
		if (fy != null) fixedY = fy;
		else fixedY = -1;
		if(sht != null)
			showTime = sht;
		if (showToday == 1) {
			//document.getElementById('lblToday').innerHTML = '<font color="#000066">' + todayString[language] + ' <a onmousemove="window.status=\''+gotoString[language]+'\'" onmouseout="window.status=\'\'" title="'+gotoString[language]+'" style="'+styleAnchor+'" href="#" onclcik="return false;monthSelected=monthNow;yearSelected=yearNow;constructCalendar(); return false;">'+dayName[language][(today.getDay()-startAt==-1)?6:(today.getDay()-startAt)]+', ' + dateNow + ' ' + monthName[language][monthNow].substring(0,3) + ' ' + yearNow + '</a></font>';
			document.getElementById('lblToday').innerHTML =	'<font color="#000066">' + todayString[language] + ' '+dayName[language][(today.getDay()-startAt==-1)?6:(today.getDay()-startAt)]+', ' + dateNow + ' ' + monthName[language][monthNow].substring(0,3) + ' ' + yearNow + '</font>';
		}
		if (showTime == 1) {
		    document.getElementById('timerow').style.display = '';
			try
			{
				var dtVal = calendar_ctl2.value.split(" ")[1];
				var timeFormat = format.split(" ")[1];
				var formatChar = ':';
				if (timeFormat.split(formatChar).length < 2) {
					formatChar = '.';
					if (timeFormat.split(formatChar).length < 2)
						formatChar = '/';
				}
				var hour = calendar_ctl2.value.split(" ")[1].split(formatChar)[0];
				if (hour < 10)
					hour = hour.charAt(1);
				var hoursItems = document.getElementById("cal_hours");
				for (var i = 0; i < hoursItems.length; i++) {
					if (hoursItems[i].value == hour) {
						hoursItems.selectedIndex = i;
						break;
					}
				}
	
				var min = calendar_ctl2.value.split(" ")[1].split(formatChar)[1];
				if (min < 10)
					min = hour.charAt(1);
				var minItems = document.getElementById("cal_minutes");
				for (var i = 0; i < minItems.length; i++) {
					if (minItems[i].value == min) {
						minItems.selectedIndex = i;
						break;
					}
				}
				hoursSelected = document.getElementById("cal_hours").value;
				minutesSelected = document.getElementById("cal_minutes").value;
				dateTimeFormat = format;
				format = format.split(" ")[0];
			}
			catch(er){				
				hoursSelected = "12";
				minutesSelected = "00";
				dateTimeFormat = format;
				format = format.split(" ")[0];
			}
		}
		else {
		    hoursSelected = "00";
		    minutesSelected = "00";
		}
		
		popUpCalendar(calendar_ctl, calendar_ctl2, format);
	}

	function popUpCalendar(calendar_ctl, calendar_ctl2, format) {
		var leftpos = 0;
		var toppos  = 0;

		if (bPageLoaded) {
			if (crossobj.visibility == 'hidden') {
				ctlToPlaceValue = calendar_ctl2;
				dateFormat = format;
				formatChar = ' ';
				aFormat = dateFormat.split(formatChar);
				if (aFormat.length < 3) {
					formatChar = '/';
					aFormat = dateFormat.split(formatChar);
					if (aFormat.length < 3) {
						formatChar = '.';
						aFormat = dateFormat.split(formatChar);
						if (aFormat.length < 3) {
							formatChar = '-';
							aFormat = dateFormat.split(formatChar);
							if (aFormat.length < 3) {
								formatChar = '';					// invalid date format

							}
						}
					}
				}

				tokensChanged = 0;
				if (formatChar != "") {
					aData =	calendar_ctl2.value.split(formatChar);			// use user's date

					for (i=0; i<3; i++) {
						if ((aFormat[i] == "d") || (aFormat[i] == "dd")) {
							dateSelected = parseInt(aData[i], 10);
							tokensChanged++;
						} else if ((aFormat[i] == "m") || (aFormat[i] == "mm")) {
							monthSelected = parseInt(aData[i], 10) - 1;
							tokensChanged++;
						} else if (aFormat[i] == "yyyy") {
							yearSelected = parseInt(aData[i], 10);
							tokensChanged++;
						} else if (aFormat[i] == "mmm") {
							for (j=0; j<12; j++) {
								if (aData[i] == monthName[language][j]) {
									monthSelected=j;
									tokensChanged++;
								}
							}
						} else if (aFormat[i] == "mmmm") {
							for (j=0; j<12; j++) {
								if (aData[i] == monthName2[language][j]) {
									monthSelected = j;
									tokensChanged++;
								}
							}
						}
					}
				}

				if ((tokensChanged != 3) || isNaN(dateSelected) || isNaN(monthSelected) || isNaN(yearSelected)) {
					dateSelected  = dateNow;
					monthSelected = monthNow;
					yearSelected  = yearNow;
				}

				odateSelected  = dateSelected;
				omonthSelected = monthSelected;
				oyearSelected  = yearSelected;

				aTag = calendar_ctl;
				do {
					aTag     = aTag.offsetParent;
					leftpos += aTag.offsetLeft;
					toppos  += aTag.offsetTop;
				} while (aTag.tagName != 'BODY' && aTag.tagName != 'HTML');

				crossobj.left = (fixedX == -1) ? calendar_ctl.offsetLeft + leftpos : fixedX;
				crossobj.top = (fixedY == -1) ? calendar_ctl.offsetTop + toppos + calendar_ctl.offsetHeight + 2 : fixedY;
				constructCalendar (1, monthSelected, yearSelected);
				crossobj.visibility = (dom||ie) ? "visible" : "show";

				/*hideElement('SELECT', document.getElementById('calendar'));
				hideElement('APPLET', document.getElementById('calendar'));			*/

				bShow = true;
			} else {
				hideCalendar();
				if (ctlNow!=calendar_ctl) popUpCalendar(calendar_ctl, calendar_ctl2, format);
			}
			ctlNow = calendar_ctl;
		}
	}

	document.onkeypress = function hidecal1 () {
		if (g_isMSIE && event.keyCode == 27) hideCalendar();
	}
	document.onclick = function hidecal2 () {
		if (!bShow) hideCalendar();
		bShow = false;
	}
/*
	if(ie) {
		init();
	} else {
		window.onload = init;
	}
*/