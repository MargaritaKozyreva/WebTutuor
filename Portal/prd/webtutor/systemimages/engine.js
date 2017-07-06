//WebTutor Engine
var engineversion="1.3.53";
var engineBuildDate="22-Jun-2006";
//(serverXMLHTTP enabled)
//(c)2002-2004 Websoft Ltd. http://www.websoft.ru/
//=========================

var commonURL='';
var AICC_block=false;
var getTout=0;
var gpTout=0;
var putTout=0;
var emTout=0;
var exitTout=0;

var putTimer=0;
var gargobj;
var firstPutDone=false;
if(!putAICCtimer) var putAICCtimer=60000;
if(!putAICCmethod) var putAICCmethod="normal";
var curPutData="";
var qErrorFlag=false;

var aicc_sid="";
var aicc_url="";
var aicc_time="00:00:00";
var aicc_jump = false;
var startTime=new Date();
var endTime=new Date();
var aTime=new Array();
var startT=0;
var endT=0;
var difT=0;
var curSoundFile="";
var prevSoundFile="";

var state = new Array(1);
var answers = new Array(1);

var q1 = new Array(0);
q1[0]=0;
var q2 = new Array(0);
q2[0]=0;
var q3 = new Array(0);
q3[0]=0;
var q4 = new Array(0);
q4[0]=0;
var q5 = new Array(0);
q5[0]=0;

var qrange = new Array(1);
var qrangebackup = new Array(1);
var qd1 = new Array(1);
var qd2 = new Array(1);
var stoprange=0;
if(q_visited) q_visited=null;
var q_visited = new Array(0);
//q_visited[0] = new Object;
//q_visited[0].name="0";
//q_visited[0].value="0";

var maxIt=0;
var logic=0;
var nextid=0;
var previd=0;
var chbid=0;
var viewid=0;
var qsize=1;
var nextmode=0;
var chbut=0;
var cleanerr=0;
var clrwait=0;
var clrlink=0;
var curit=0;
var wsprevflag=0;
var wsnextflag=0;
var parseclicks=1;
var aicc = 0;
var qnumero=0;

var ta = new Array(0);
var ta_total = 0;
var ta_qty = 0;
var ta_adapt = 0;
var ta_choicesmax=0;
var ta_choices = new Array(0);
var ta_questions = new Array(0);
var ta_logics = new Array(0);
var ta_weights = new Array(0);
var ta_pools = new Array(0);
var ta_times = new Array(0);
var ta_answers = new Array(0);
var ta_maxpool=0;
var ta_allscales = new Array(0);
var ta_ready=0;
var ta_poolsused = new Array(0);
var ta_used = new Array(0);
var ta_pool = new Array(0);
var ta_scales = new Array(0);
var ta_weight = new Array(0);
var ta_maxweight=0;
var ta_base=0;
var ta_step=0;
var ta_question=0;
var ta_success=0;
var ta_fault=0;
var ta_played = new Array(0);
var curScale=0;
var curPool=0;
var curQuestion=0;
var ta_timer=0;
var ta_timecount=0;
var ta_timeOut=0;

var taskCount=0;


if (q_laststate) q_laststate=null;
if (q_attempts) q_attempts=null;
if (q_points) q_points=null;
var q_laststate = new Array(0);
q_laststate[0] = new Object;
q_laststate[0].name = "0";
q_laststate[0].value = "0";
var q_attempts = new Array(0);
q_attempts[0] = new Object;
q_attempts[0].name = "0";
q_attempts[0].value = "0";
var q_points = new Array(0);
q_points[0] = new Object;
q_points[0].name = "0";
q_points[0].value = "0";


var tmp_state = new Array(0);
var maxpoint = 0;
var pointstep = 0;
var attts = 0;
var solutionflag=0;
var zPoints=0;

var testmaxchoices=0;
var testmaxquestions=0;
var test_id=0;
var test_type='';
var curTestQ=0;
if (t_orders) t_orders=null;
var t_orders=new Array(0);
if (t_points) t_points=null;
var t_points=new Array(0);
if (t_dpoints) t_dpoints=null;
var t_dpoints=new Array(0);
if (t_results) t_results=null;
var t_results=new Array(0);
t_results[0]=0;
if (t_choices) t_choices=null;
var t_choices=new Array(0);
if (t_scales) t_scales=null;
var t_scales=new Array(0);
if (t_scale) t_scale=null;
var t_scale=new Array(0);
t_scale[0]=new Array(0);
t_scale[0][0]=0;
var doScale=false;
var numScales=0;
var fftout=0;
var testResult=0;
var next_key='';
var afterlink='';
var lastrangebackup='';

var qbnum=0;
var qbase=0;
var blockMaxQ=0;
var curAnswer='';
var totalQ=0;
var curChoicesQB=0;
var firstClick=false;
var gotAnswer=false;
var innerNum=0;


check_no = new Image(40,25);
check_no.src = "../../systemimages/check_item_0.gif";
check_yes = new Image(40,25);
check_yes.src = "../../systemimages/check_item_1.gif";
check_wrong = new Image(40,25);
check_wrong.src = "../../systemimages/check_item_2.gif";

check_small_no = new Image(20,20);
check_small_no.src = "../../systemimages/item_empty.gif";
check_small_yes = new Image(20,20);
check_small_yes.src = "../../systemimages/item_ok.gif";
check_small_wrong = new Image(20,20);
check_small_wrong.src = "../../systemimages/item_wrong.gif";

bnext_enabled = new Image(18,40);
bnext_enabled.src = "../../systemimages/butt-next.gif";
bnext_disabled = new Image(18,40);
bnext_disabled.src = "../../systemimages/butt-next-a.gif";
bprev_enabled = new Image(19,40);
bprev_enabled.src = "../../systemimages/butt-pre.gif";
bprev_disabled = new Image(19,40);
bprev_disabled.src = "../../systemimages/butt-pre-a.gif";

wsnext_enabled = new Image(75,25);
wsnext_enabled.src = "../../systemimages/ws_next.gif";
wsnext_disabled = new Image(75,25);
wsnext_disabled.src = "../../systemimages/ws_next_disabled.gif";
wsprev_enabled = new Image(75,25);
wsprev_enabled.src = "../../systemimages/ws_prev.gif";
wsprev_disabled = new Image(75,25);
wsprev_disabled.src = "../../systemimages/ws_prev_disabled.gif";

checkbutton = new Image(163,25);
checkbutton.src = "../../systemimages/button_check_answer.gif";
checkbutton_disabled = new Image(163,25);
checkbutton_disabled.src = "../../systemimages/1blank.gif";

wsclose_0 = new Image(20,20);
wsclose_0.src = "../../systemimages/ws_close.gif";
wsclose_1 = new Image(20,20);
wsclose_1.src = "../../systemimages/ws_close_1.gif";


//=================================
function showVars() {
if(coreVersion!=null && coreBuildDate!=null && engineversion!=null && engineBuildDate!=null && document.getElementById('varserDiv')) {
	document.getElementById('varserDiv').innerText='core '+coreVersion+' ('+coreBuildDate+'), engine '+engineversion+' ('+engineBuildDate+')';
}
return false;
}
function hideVars() {
if(document.getElementById('varserDiv')) {
	document.getElementById('varserDiv').innerText='';
}
return false;
}


function TAgetData() {
	var tmp="";
	qsize=0;
	if(document.getElementById('TAtime')) ta_timecount=1;
	if(document.getElementById('q_total')) ta_total=parseInt(document.getElementById('q_total').innerText,10);
	if(document.getElementById('TA_choicesmax')) ta_choicesmax=parseInt(document.getElementById('TA_choicesmax').innerText,10);
	if(document.getElementById('TA_choices')) {
		tmp = document.getElementById('TA_choices').innerText;
		ta_choices = tmp.split("/");
	}
	if(document.getElementById('TA_logics')) {
		tmp = document.getElementById('TA_logics').innerText;
		ta_logics = tmp.split("*^*");
	}
	if(document.getElementById('TA_weights')) {
		tmp = document.getElementById('TA_weights').innerText;
		ta_weights = tmp.split("*^*");
	}
	if(document.getElementById('TA_scales')) {
		tmp = document.getElementById('TA_scales').innerText;
		ta_scales = tmp.split("*^*");
	}
	if(document.getElementById('TA_pools')) {
		tmp = document.getElementById('TA_pools').innerText;
		ta_pools = tmp.split("*^*");
	}
	if(document.getElementById('TA_times')) {
		tmp = document.getElementById('TA_times').innerText;
		ta_times = tmp.split("*^*");
	}
	if(document.getElementById('TA_questions')) {
		tmp = document.getElementById('TA_questions').innerHTML;
		ta_questions = tmp.split("*^*");
	}
	if(document.getElementById('TA_answers')) {
		tmp = document.getElementById('TA_answers').innerText;
		ta_answers = tmp.split("*^*");
	}
	if(document.getElementById('TA_items')) {
		tmp = document.getElementById('TA_items').innerHTML;
		ta_items = tmp.split("*^*");
	}
	for(var i=1;i<=ta_total;i++) {
		var tmpflag=false;
		ta[i] = new Object;
		ta[i].logic = ta_logics[i];
		ta[i].weight = ta_weights[i];
			if(ta[i].weight>ta_maxweight) ta_maxweight=ta[i].weight;
		ta[i].pool = parseInt(ta_pools[i],10);
			if(ta[i].pool>ta_maxpool) ta_maxpool=ta[i].pool;
		ta[i].scale = ta_scales[i];
			for(var j=0;j<ta_allscales.length;j++) {
				if(ta[i].scale==ta_allscales[j]) tmpflag=true;
			}
			if(!tmpflag) {
				var sctmp=ta_allscales.length;
				ta_allscales[sctmp]=ta[i].scale;
			}
		ta[i].timer = parseInt(ta_times[i],10);
			if(ta[i].timer<5 || ta[i].timer=="") {
				ta[i].timer=parseInt(document.getElementById('TAcommontime').innerText,10);
			}
		ta[i].choices = ta_choices[i];
		ta[i].question = ta_questions[i];
		ta[i].items = ta_items[i];
		if(ta[i].logic!="manual") {
			ta[i].answer = ta_answers[i];
			ta[i].qcase = 0;
		} else {
			tmp=ta_answers[i].split("+++");
			ta[i].answer = tmp[0];
			ta[i].qcase = parseInt(tmp[1],10);
		}
		ta[i].used = false;
	}
	for(var i=1;i<=ta_maxpool;i++) ta_poolsused[i]=false;
	t_scale[1] = new Array(0);
	t_scale[2] = new Array(0);
	t_scale[3] = new Array(0);
	for(var i=1;i<=ta_allscales.length;i++) {
		t_scale[1][i]=0;
		t_scale[2][i]=0;
		t_scale[3][i]=ta_allscales[i-1];
	}
}


function TAinitiate(qty,ta_method) {
	ta_qty=parseInt(qty,10);
	ta_adapt=parseInt(ta_method,10);
	TAcheckReady();
}
function TAcheckReady() {
	clearTimeout(ta_ready);
	if(!document.getElementById('test_question_number')) {
		ta_ready=setTimeout("TAcheckReady()",50);
	} else {
		TAproceed();
	}
}
function TAproceed() {
	TAgetData();
	toggleNext('off');
	togglePrev('off');
	ta_question=1;
	if(document.getElementById("TAgeneration")) document.getElementById("TAgeneration").style.display='none';
	if(document.getElementById("testArea")) document.getElementById('testArea').style.display='inline';
	if(document.getElementById("test_question_number")) document.getElementById('test_question_number').innerHTML=ta_question;
	switch(ta_adapt) {
		case 2:
			TAengine2();
			break;
		default:
			alert('Insufficient data.');
			break;
	}
}

function TAengine2() {
	curPool=TApickPool();
	ta_poolsused[curPool]=true;
//	alert(curPool);
	curQuestion=TApickQuestionFromPool();
//	alert(curQuestion);
	TAshowQuestion();
}

function TApickPool() {
	var tmpNum=0;
	var tmpflag=false;
	for(var i=1;i<=ta_maxpool;i++) {
		if(!ta_poolsused[i]) tmpflag=true;
	}
	if(tmpflag) {
		tmpNum=getDice(ta_maxpool);
	} else {
		return 0;
	}
	if(!ta_poolsused[tmpNum]) {
		return tmpNum;
	} else {
		var tmpNum2=tmpNum;
		tmpflag=false;
		do {
			tmpNum2++;
			if(!ta_poolsused[tmpNum2]&& tmpNum2<=ta_maxpool) return tmpNum2;
		} while(ta_poolsused[tmpNum2] && tmpNum2<=ta_maxpool)
		tmpNum2=tmpNum;
		do {
			tmpNum2--;
			if(!ta_poolsused[tmpNum2] && tmpNum2>=1) return tmpNum2;
		} while(ta_poolsused[tmpNum2] && tmpNum2>=1)
		return tmpNum2;
	}
}

function TApickQuestionFromPool() {
	var atmp=new Array(0);
	var tmpNum=0;
	var tmpcounter=0;
	for(var i=1;i<=ta_total;i++) {
		if(ta[i].pool==curPool) {
			var atmpl=atmp.length;
			atmp[atmpl]=i;
		}
	}
	tmpcounter=atmp.length;
	do {
		tmpNum=getDice(atmp.length);
		tmpNum=atmp[tmpNum-1];
		tmpcounter--;
		if(tmpcounter<=0) return 0;
	} while(ta[tmpNum].used && tmpcounter>=0)
	return tmpNum;
}

function TAshowQuestion() {
//document.getElementById('testSpan').innerHTML=curQuestion+"/"+curPool;
	ta_timer=ta[curQuestion].timer;
	document.getElementById('test_question').innerHTML=ta[curQuestion].question;
	if(ta[curQuestion].logic!='manual') {
		var qtmp=new Array(0);
		qtmp=ta[curQuestion].items.split("+++");
	}
	for(var i=1;i<=ta[curQuestion].choices;i++) {
		document.getElementById('checkrow'+i).style.visibility='visible';
		document.getElementById('checkq'+i).innerHTML=qtmp[i-1];
		setEmpty(i);
	}
	if(ta_timecount==1) TAstartTimer();
	return true;


}

function TAnextQuestion() {
	if(ta_timeOut!=0) clearTimeout(ta_timeOut);
	var tprogress_item='';
	tprogress_item="tprogress"+ta_question;
	if(document.getElementById(tprogress_item)) {
		document.getElementById(tprogress_item).style.backgroundColor='#33CC33';
	}

switch(ta_adapt) {
	case 1:
		if(checkTAanswer()) {
			ta_success++;
			ta_fault=0;
			if(ta_success>=ta_step) {
				if(curScale<ta_maxweight) {
					curScale++;
					ta_success=0;
				}
			}
		} else {
			ta_success=0;
			ta_fault++;
			if(ta_fault>=ta_step) {
				if(curScale>1) {
					curScale--;
					ta_fault=0;
				}
			}
		}
		break;
	case 2:
		TAcheckAnswer();
		break;
	default:
		break;
}

for(var i=1;i<=ta[curQuestion].choices;i++) {
	document.getElementById('checkrow'+i).style.visibility='hidden';
	document.getElementById('checkq'+i).innerHTML='';
}

ta_question++;
toggleTestFurther('off');

//document.getElementById('testSpan').innerHTML=curQuestion+"/"+ta[curQuestion].answer+"/"+t_scale[1][curScale]+":"+t_scale[2][curScale]+":"+t_scale[3][curScale]+"---"+ta[curQuestion].timer;

if(ta_question<=ta_qty) {
	document.getElementById('test_question_number').innerHTML=ta_question;
	TAengine2()
//	selectTAquestion(ta_question);
} else {
	stopTest();
}
}

function TAcheckAnswer() {
	for(var i=1;i<=ta_allscales.length;i++) {
		if(ta[curQuestion].scale==t_scale[3][i]) curScale=i;
	}
	if(ta[curQuestion].logic=='choice') {
		t_scale[2][curScale]=t_scale[2][curScale]+1;
		if(state[ta[curQuestion].answer]==1) {
			t_scale[1][curScale]=t_scale[1][curScale]+1;
			return true;
		} else {
			return false;
		}
	} else {
		if(ta[curQuestion].logic=='select') {
			var tmpanswer='';
			var tmpa=0;
			var tmpc=0;
			for(var i=1;i<=ta[curQuestion].choices;i++) {
				tmpanswer=tmpanswer+":"+state[i];
			}
			tmpanswer=tmpanswer.slice(1);
			var tmpe=ta[curQuestion].answer.split(":");
			for(var i=0;i<tmpe.length;i++) { 
				if(parseInt(tmpe[i],10)==1) tmpa++;
			}
			t_scale[2][curScale]=t_scale[2][curScale]+tmpa;
			if(tmpanswer==ta[curQuestion].answer) {
				t_scale[1][curScale]=t_scale[1][curScale]+tmpa;
				return true;
			} else {
				for(var i=0;i<tmpe.length;i++) {
					if(tmpe[i]==state[i+1] && state[i+1]==1) tmpc=tmpc+1;
					if(tmpe[i]!=state[i+1] && state[i+1]==1) tmpc=tmpc-1;
				}
				if(tmpc>0) t_scale[1][curScale]=t_scale[1][curScale]+tmpc;
				return false;
			}
		}
	}
}

function TAparseClick(it) {
if(ta[curQuestion].logic=='choice') {
	for (var i=1; i<=ta[curQuestion].choices; i++) {
		if (state[i]==1) {
			setEmpty(i);
		} else {
			if(i==it) {
				setRight(it);
			}
		}
	}
} else {
	if(ta[curQuestion].logic=='select') {
		if(state[it]==1) {
			setEmpty(it);
		} else {
			setRight(it);
		}
	}
}
toggleTestFurther('on');
}

function TAstartTimer() {
	document.getElementById('test_timer').innerHTML=ta_timer;
	if(ta_timer!=0) {
		ta_timeOut=setTimeout("TAdecTime()",1000);
	} else {
		TAnextQuestion();
	}
}

function TAdecTime() {
	ta_timer--;
	clearTimeout(ta_timeOut);
	TAstartTimer();
}

function TAfillResults() {
	var tmpr=0;
	var tmpi=0;
	var tmpres=new Array(0);
	var finalword="";
	for(var i=1;i<=ta_allscales.length;i++) {
		document.getElementById('ta_scale'+i).innerHTML=t_scale[3][i];
		document.getElementById('ta_results'+i).innerHTML=Math.round(100*t_scale[1][i]/t_scale[2][i])+"%";
		tmpres[i]=Math.round(40*t_scale[1][i]/t_scale[2][i]);
		document.getElementById('ta_progress'+i).innerHTML=drawTAProgress(tmpres[i],40);
		if(tmpres[i]>35) {
			finalword=finalword+'Ваша оценка по шкале "'+t_scale[3][i]+'" - Отлично<br>';
		} else {
			if(tmpres[i]>25) {
				finalword=finalword+'Ваша оценка по шкале "'+t_scale[3][i]+'" - Хорошо<br>';
			} else {
				if(tmpres[i]>10) {
					finalword=finalword+'Ваша оценка по шкале "'+t_scale[3][i]+'" - Удовлетворительно<br>';
				} else {
					finalword=finalword+'Ваша оценка по шкале "'+t_scale[3][i]+'" - <font color=#FF0000>Неудовлетворительно</font><br>';
				}
			}
		}
		tmpr=tmpr+tmpres[i];
	}
	tmpr=Math.round(tmpr/ta_allscales.length);
	if(tmpr>35) {
		finalword=finalword+'Ваша суммарная оценка - <b>Отлично</b>';
	} else {
		if(tmpr>25) {
			finalword=finalword+'Ваша суммарная оценка - <b>Хорошо</b>';
		} else {
			if(tmpres[i]>10) {
				finalword=finalword+'Ваша суммарная оценка - <b>Удовлетворительно</b>';
			} else {
				finalword=finalword+'Ваша суммарная оценка - <b><font color=#FF0000>Неудовлетворительно</font></b>';
			}
		}
	}
	document.getElementById('final_result').innerHTML=finalword;
}
//=================================

function initiateTestAdaptive(qty,adapt) {
	toggleNext('off');
	togglePrev('off');
	ta_total=parseInt(document.getElementById('q_total').innerText,10);
	if(document.getElementById('TAtime')) ta_timecount=1;
	ta_qty=parseInt(qty,10);
	ta_adapt=parseInt(adapt,10);
	var tmppools=0;
	var tmpweights=0;
	for(var i=1;i<=ta_total;i++) {
		ta[i] = new Object;
		ta[i].id = document.getElementById('id_'+i).innerText;
		ta[i].logic = document.getElementById('q_logic_'+i).innerText;
		ta[i].weight = document.getElementById('q_weight_'+i).innerText;
		if(ta[i].weight>tmpweights) tmpweights=ta[i].weight;
		ta[i].pool = parseInt(document.getElementById('q_pool_'+i).innerText,10);
		if(ta[i].pool>tmppools) tmppools=ta[i].pool;
		ta[i].answer = document.getElementById('q_answer_'+i).innerText;
		if(ta[i].logic=="manual") {
			ta[i].qcase = parseInt(document.getElementById('q_answercase_'+i).innerText,10);
		} else {
			ta[i].qcase = 0;
		}
		ta[i].used=false;
		if(document.getElementById('q_timer_'+i) && parseInt(document.getElementById('q_timer_'+i).innerText,10)!='NaN') {
			var tmpzz=parseInt(document.getElementById('q_timer_'+i).innerText,10);
			if(tmpzz>5) {
				ta[i].timer=tmpzz;
			} else {
				if(document.getElementById('TAcommontime')) {
					ta[i].timer=parseInt(document.getElementById('TAcommontime').innerText,10);
				} else {
					ta[i].timer=30;
				}
			}
		} else {
			if(document.getElementById('TAcommontime')) {
				ta[i].timer=parseInt(document.getElementById('TAcommontime').innerText,10);
			} else {
				ta[i].timer=30;
			}
		}
	}
	for(var i=1;i<=tmpweights;i++) {
		ta_weight[i] = new Array(0);
		ta_weight[i][0] = 0;
		ta_played[i] = 0;
	}
	t_scale[1] = new Array(0);
	t_scale[2] = new Array(0);
	for(var i=1;i<=tmpweights;i++) {
		for(var j=1;j<=ta_total;j++) {
			if(ta[j].weight==i) {
				var wtmp=ta_weight[i].length;
				ta_weight[i][wtmp]=j;
			}
		}
		t_scale[1][i]=0;
		t_scale[2][i]=0;
	}
	ta_maxweight=tmpweights;
	for(var i=1;i<=tmppools;i++) {
		ta_pool[i] = new Array(0);
		ta_pool[i][0] = 0;
	}
	for(var i=1;i<=tmppools;i++) {
		for(var j=1;j<=ta_total;j++) {
			if(ta[j].pool==i) {
				var ptmp=ta_pool[i].length;
				ta_pool[i][ptmp]=j;
			}
		}
	}
	ta_choicesmax=parseInt(document.getElementById('TA_choicesmax').innerText,10);
	var tmp = document.getElementById('TA_choices').innerText;
	ta_choices = tmp.split("/");
	qsize=0;
	testAdaptiveEngine();
}

function testAdaptiveEngine() {
//Selecting adaptation scenario
	switch(ta_adapt) {
		case 1:		//Weights matter, no pools
			ta_base=Math.round(ta_maxweight/2);
			ta_step=2;
			break;
		default:
			break;
	}
	ta_question=1;
	selectTAquestion(1);
}

function selectTAquestion(curq) {
	if(curq==1) {
		curScale=ta_base;
		if(document.getElementById("TAgeneration")) document.getElementById("TAgeneration").style.display='none';
		document.getElementById('testArea').style.display='inline';
		document.getElementById('test_question_number').innerHTML=ta_question;
	}
	curQuestion=pickQuestion(curScale);
	ta_timer=ta[curQuestion].timer;
	document.getElementById('test_question').innerHTML=document.getElementById('q_'+curQuestion).innerHTML;
	for(var i=1;i<=ta_choices[curQuestion];i++) {
		var tmpz='q_item_'+curQuestion+'_'+i;
		if(!document.getElementById(tmpz)) alert('q_item_'+curQuestion+'_'+i);
		document.getElementById('checkrow'+i).style.visibility='visible';
		document.getElementById('checkq'+i).innerHTML=document.getElementById(tmpz).innerHTML;
		setEmpty(i);
	}
	if(ta_timecount==1) startTAtimer();
	return true;
}

function startTAtimer() {
	document.getElementById('test_timer').innerHTML=ta_timer;
	if(ta_timer!=0) {
		ta_timeOut=setTimeout("decTime()",1000);
	} else {
		testTANextQuestion();
	}
}

function decTime() {
	ta_timer--;
	clearTimeout(ta_timeOut);
	startTAtimer();
}

function pickQuestion(fromWeight) {
	var tmpNum=0;
	var tmp_id=0;
	var tmpweight=fromWeight;
	if(ta_played[tmpweight]<ta_weight[tmpweight].length) {
		do {
			tmpNum=getDice(ta_weight[tmpweight].length);
			tmp_id=ta_weight[tmpweight][tmpNum];
		} while(ta[tmp_id].used)
	} else {
		alert('Pool exhausted');
		stopTest();
	}
	ta[ta_weight[tmpweight][tmpNum]].used=true;
	return ta_weight[tmpweight][tmpNum];
}

function getDice(maxDice) {
	var tmp=Math.round(Math.random()*(maxDice-2))+1;
	return tmp;
}

function parseTATestClick(it) {
for (var i=1; i<=ta_choices[curQuestion]; i++) {
	if (state[i]==1) {
		setEmpty(i);
	} else {
		if(i==it) {
			setRight(it);
		}
	}
}
toggleTestFurther('on');
}

function testTANextQuestion() {

if(ta_timeOut!=0) clearTimeout(ta_timeOut);

var tprogress_item='';
tprogress_item="tprogress"+ta_question;
if(document.getElementById(tprogress_item)) {
	document.getElementById(tprogress_item).style.backgroundColor='#33CC33';
}

if(checkTAanswer()) {
	ta_success++;
	ta_fault=0;
	if(ta_success>=ta_step) {
		if(curScale<ta_maxweight) {
			curScale++;
			ta_success=0;
		}
	}
} else {
	ta_success=0;
	ta_fault++;
	if(ta_fault>=ta_step) {
		if(curScale>1) {
			curScale--;
			ta_fault=0;
		}
	}
}

for(var i=1;i<=ta_choices[curQuestion];i++) {
	document.getElementById('checkrow'+i).style.visibility='hidden';
	document.getElementById('checkq'+i).innerHTML='';
}

ta_question++;

toggleTestFurther('off');

//document.getElementById('testSpan').innerHTML=curScale+"/"+ta[curQuestion].answer+"/"+t_scale[1][1]+":"+t_scale[1][2]+":"+t_scale[1][3]+":"+t_scale[1][4]+":"+t_scale[1][5];

if(ta_question<=ta_qty) {
	document.getElementById('test_question_number').innerHTML=ta_question;
	selectTAquestion(ta_question);
} else {
	stopTest();
}
}

function checkTAanswer() {
	t_scale[2][curScale]=t_scale[2][curScale]+1;
	if(ta[curQuestion].logic=='choice') {
		if(state[ta[curQuestion].answer]==1) {
			t_scale[1][curScale]=t_scale[1][curScale]+1;
			return true;
		} else {
			return false;
		}
	} else {
		if(ta[curQuestion].logic=='select') {
			var tmpanswer='';
			for(var i=1;i<=ta_choices[curQuestion];i++) {
				tmpanswer=tmpanswer+":"+state[i];
			}
			tmpanswer=tmpanswer.slice(1);
			if(tmpanswer==ta[curQuestion].answer) {
				t_scale[1][curScale]=t_scale[1][curScale]+1;
				return true;
			} else {
				return false;
			}
		}
	}
}

function stopTest() {
	document.getElementById('test_question').innerHTML='<font class=qu12>Тест закончен. Результаты теста Вы увидите на следующем слайде</font>';
	toggleNext('on');
}

function fillTAresults() {
	var tmpr=0;
	var tmpi=0;
	for(var i=1;i<=ta_maxweight;i++) {
		if(t_scale[1][i]>tmpr) {
			tmpr=t_scale[1][i];
			tmpi=i;
		}
		document.getElementById('ta_results'+i).innerHTML=t_scale[1][i]+"/"+t_scale[2][i];
		document.getElementById('ta_progress'+i).innerHTML=drawTAProgress(t_scale[1][i],t_scale[2][i]);
	}
	if((tmpi==1) && (t_scale[1][i]/t_scale[2][i]<0.5)) {
		document.getElementById('final_result').innerHTML='<font class=qu12>Меньше, чем&nbsp;</font>'+document.getElementById('ta_scale'+tmpi).innerHTML;
	} else {
		if(tmpi==0) {
			document.getElementById('final_result').innerHTML='Вы не ответили ни на один вопрос';
		} else {
			document.getElementById('final_result').innerHTML=document.getElementById('ta_scale'+tmpi).innerHTML;
		}
	}
}

function drawTAProgress(pnum,tnum) {
	if(tnum!=0) {
		var ftable='<table cellpadding=0 cellspacing=0 border=0><tr bgcolor="#333333"><td><table cellpadding=0 cellspacing=1 border=0><tr>';
		for(var i=1;i<=tnum;i++) {
			if(i<=pnum) {
				ftable=ftable+'<td width=9 height=19 bgcolor="#33CC33"><br></td>';
			}else {
				ftable=ftable+'<td width=9 height=19 bgcolor="#993333"><br></td>';
			}
		}
		ftable=ftable+'</tr></table>';
		return ftable;
	} else {
		return 'Нет';
	}
}


function MM_checkPlugin(plgIn, theURL, altURL, autoGo) { //v4.0
  var ok=false; document.MM_returnValue = false;
  with (navigator) {
  	if (appName.indexOf('Microsoft')==-1 || (plugins && plugins.length)) {
    	ok=(plugins && plugins[plgIn]);
  	} else {
		if (appVersion.indexOf('3.1')==-1) { //not Netscape or Win3.1
    		if (plgIn.indexOf("Flash")!=-1 && window.MM_flash!=null) {
				ok=window.MM_flash;
			} else {
				if (plgIn.indexOf("Director")!=-1 && window.MM_dir!=null) {
					ok=window.MM_dir;
				} else {
					ok=autoGo; 
				}
			}
		}
	}
  }
  return ok;
}

var flashtimer=0;
function nextFlashCheck() {
	clearTimeout(flashtimer);
	self.focus();
	window.location.reload(true);
}

function onLoadFunction() {
	var curDir = window.location.href;
	curDir = curDir.substring(0,curDir.indexOf('presentation.htm'));
	var toFlashURL = flashURL.substr(flashURL.lastIndexOf('../')+3);
	flashURL = curDir + toFlashURL;
	if(!MM_checkPlugin('Shockwave Flash','yes','no',false)) {
		if(confirm("На Вашем компьютере не установлен Macromedia Flash Player нужной версии.\nЕго отсутствие может помешать нормальной работе курса.\nНажмите OK для запуска процедуры автоматической установки Flash Player.\nЕсли Вы не хотите устанавливать этот компонент - нажмите Cancel, n\но помните о возможных проблемах при просмотре курса.")) {
			alert("Сейчас в отдельном окне будет открыт установщик Flash Player. \nПо завершению установки Вы должны увидеть надпись Installation Complete.");
			fwin=window.open(flashURL, 'Flasher',"resizable=false,toolbar=no,location=no,directories=no,status=no,menubar=no,width=500,height=400");
			fwin.focus();
			flashtimer=setTimeout("nextFlashCheck();", 100000);
		} else {
			alert('Пожалуйста, помните, что без Flash Player\n нормальная работа курса не гарантирована.');
		}
	}
	testXMLversion();
}

function checkSystem(){
 this.ver=navigator.appVersion.toLowerCase();
 this.dom=document.getElementById?1:0;
 this.ie6=(this.ver.indexOf("msie 6")>-1 && this.dom)?1:0;
 this.ie5=(this.ver.indexOf("msie 5")>-1 && this.dom)?1:0;
 this.ie4=(document.all && !this.dom)?1:0;
 this.bw=(this.ie5 || this.ie4 || this.ie6);
 this.win95 = ((this.ver.indexOf("win95")!=-1) || (this.ver.indexOf("windows 95")!=-1));
 this.win98 = ((this.ver.indexOf("win98")!=-1)||(this.ver.indexOf("windows 98")!=-1));
 this.winme = ((this.ver.indexOf("winme")!=-1)||(this.ver.indexOf("windows me")!=-1));
 if(this.ver.indexOf("5.1")!=-1) {
 	this.winxp = ((this.ver.indexOf("winnt")!=-1)||(this.ver.indexOf("windows nt")!=-1));
 } else {
 	if(this.ver.indexOf("5.0")!=-1) {
 		this.win2000 = ((this.ver.indexOf("winnt")!=-1)||(this.ver.indexOf("windows nt")!=-1));
 	} else {
		this.winnt = ((this.ver.indexOf("winnt")!=-1)||(this.ver.indexOf("windows nt")!=-1));
	}
 }
 return this;
}


function testXMLversion() {
	var sysParam = new checkSystem();
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-16\"?><cjb></cjb>";
	var xsl = "<?xml version=\"1.0\" encoding=\"UTF-16\"?><x:stylesheet version=\"1.0\" xmlns:x=\"http://www.w3.org/1999/XSL/Transform\" xmlns:m=\"urn:schemas-microsoft-com:xslt\"><x:template match=\"/\"><x:value-of select=\"system-property('m:version')\" /></x:template></x:stylesheet>";
	var x = null;
	var xml_base=false;
	var xml2=false;
	var xml2v26=false;
	var xml2v30=false;
	var xml2v40=false;
	var xmlmax='';
	    
	try { 
	    x = new ActiveXObject("Microsoft.XMLDOM");  
	    x.async = false;
	    if (x.loadXML(xml)) {
	    	  xml_base=true;
			  xmlmax='XML';
		}
	} catch(e) {
		xml_base=false;
	} 
	try { 
	    x = new ActiveXObject("Msxml2.DOMDocument"); 
	    x.async = false;
	    if (x.loadXML(xml)) {
			xml2=true;
			xmlmax='XML2 base';
	   	}
	} catch(e) {
		xml2=false;
	}
	try { 
	    x = new ActiveXObject("Msxml2.DOMDocument.2.6"); 
	    x.async = false;
	    if (x.loadXML(xml)) {
	    	xml2v26=true;
			xmlmax='XML2 2.6';
		}
	} catch(e) {
		xml2v26=false;
	} 
	try { 
	    x = new ActiveXObject("Msxml2.DOMDocument.3.0"); 
	    x.async = false;
	    if (x.loadXML(xml)) {
	    	  xml2v30=true;
			  xmlmax='XML2 3.0';
		}
	} catch(e) {
		xml2v30=false;
	}
	try { 
	    x = new ActiveXObject("Msxml2.DOMDocument.4.0"); 
	    x.async = false;
	    if (x.loadXML(xml)) {
	    	xml2v40=true;
			xmlmax='XML2 4.0';
		}
	} catch(e) {
		xml2v40=false;
	}

//=========================
	if(AICCmethod.toLowerCase()!='html') AICCmethod='xml';
	if(!sysParam.win95) {
		switch(xmlmax) {
//			case 'XML2 3.0':
//				if(!sysParam.win98)	upgradeXML(4);
//				break;
			case 'XML2 2.6':
				upgradeXML(3);
				break;
			case 'XML2 base':
				upgradeXML(3);
				break;
			case 'XML':
				upgradeXML(3);
				break;
			default:
				break;
		}
	} else {
		AICCmethod='html';
	}
//=========================
}

function upgradeXML(key) {
alert('Для стабильной работы курса вам необходимо \nустановить на компьютер дополнительное программное \nобеспечение компании Microsoft. Установка \nначнется автоматически после нажатия кнопки OK.\nВНИМАНИЕ! Если установка программного обеспечения \nна Вашем компьютере запрещена корпоративными \nправилами - обратитесь к системному администратору \nдля установки MSXML.');

switch(key) {
	case 4:
		document.write('<object id="MSXML4" classid="clsid:f5078f32-c551-11d3-89b9-0000f81fe221" codebase="../../systemimages/xml/msxml4.cab" type="application/x-oleobject" STYLE="display: none"></object>');
		break;
	case 3:
		document.write('<object id="MSXML3" classid="clsid:f5078f32-c551-11d3-89b9-0000f81fe221" codebase="../../systemimages/xml/msxml3.cab" type="application/x-oleobject" STYLE="display: none"></object>');
		break;
	case 2:
//		alert('К сожалению, MSXML2 базовой версии не может \nбыть установлен автоматически. Обратитесь \nк системному администратору для установки и регистрации \nmsxml2.dll и msxml2a.dll на Ваш компьютер.');
		break;
	case 0:
//		document.write('<object id="MSXML" classid="clsid:f5078f32-c551-11d3-89b9-0000f81fe221" codebase="'+commonURL+'systemimages/xml/msxml.cab" type="application/x-oleobject" STYLE="display: none"></object>');
		break;
	default:
		break;
}
}

function setSlideStartTime() {
	startTime=new Date();
	startT=startTime.valueOf();
	
}
var timeTracker='';
function setAICCTime() {
	var nSec=0;
	var nMin=0;
	var nHour=0;
	endTime=new Date();
	endT=endTime.valueOf();
	difT=endT-startT;
	difT=Math.round(difT/1000);
	aicc_time="00:00:00";
	aTime=aicc_time.split(":");
	timeTracker=timeTracker+aTime[0]+"-"+aTime[1]+"-"+aTime[2]+"/difT="+difT+"\n";
	if(aTime[2].charAt(0)=="0") aTime[2]=aTime[2].charAt(1);
	nSec=parseInt(aTime[2],10);
	nSec=nSec.valueOf()+difT.valueOf();
	timeTracker=timeTracker+"nSecstart="+nSec;
	if(nSec>=60) {
		while(nSec>=60) {
			nSec=nSec-60;
			nMin++;
		}
	}
	timeTracker=timeTracker+" nSecafter="+nSec+" nMinfromsec="+nMin+"\n";
	if(aTime[1].charAt(0)=="0") aTime[1]=aTime[1].charAt(1);
	var nnM=parseInt(aTime[1],10);
	nMin=nMin.valueOf()+nnM.valueOf();
	timeTracker=timeTracker+"nMinstart="+nMin;
	if(nMin>=60) {
		while(nMin>=60) {
			nMin=nMin-60;
			nHour++;
		}
	}
	timeTracker=timeTracker+" nMinafter="+nMin+" nHourfrommin="+nHour+"\n";
	if(aTime[0].charAt(0)=="0") aTime[0]=aTime[0].charAt(1);
	var nnH=parseInt(aTime[0],10);
	nHour=nHour.valueOf()+nnH.valueOf();
	timeTracker=timeTracker+"nHourfinal="+nHour+"\n";
	if(nHour.toString().length==1) nHour="0"+nHour.toString();
	if(nMin.toString().length==1) nMin="0"+nMin.toString();
	if(nSec.toString().length==1) nSec="0"+nSec.toString();
	aicc_time=nHour+":"+nMin+":"+nSec;
	timeTracker=timeTracker+"aicctime="+aicc_time;
//	alert(timeTracker);
}



function getAICCParams(argobj) {
	if(AICC_block) return false;
	if(aicc_sid!="" && aicc_url!="" && aiccflag==false) {
		if(document.getElementById('puttingData')) {
			document.getElementById('puttingData').style.visibility='visible';
		}
	}
	var cur_id=argobj.task.getAttribute("id");
	try {
		var aiccflag=def(aiccgetdone,false);
	}
	catch(x) {
		aiccflag=false;
	}
	if(aicc_sid!="" && aicc_url!="") AICCenvironment=true;
	if(aicc_sid!="" && aicc_url!="" && aiccflag==false) {
		if(AICCmethod.toLowerCase()=='xml') {
			getParamXML();
		} else {
			prepareToGetParam();
		}
	}	
}
var sxmlhttp;

function getParamXML() {
	var command="command=GetParam&version=2.0&session_id="+escape(aicc_sid)+"&AICC_Data=";
	try {
		var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		xmlhttp.open("POST",aicc_url,false);
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
		xmlhttp.send(command);	
		if (xmlhttp.status==200) {
			var tmp_resp=xmlhttp.responseText;
			parseGetParamResponse(tmp_resp);
		} else {
			alert("Сервер не передал данные. Сервер возвратил ответ "+ xmlhttp.status);
		}			
	} catch(e) {
		try {
			var xmlhttp = new ActiveXObject("Msxml2.ServerXMLHTTP");		
			xmlhttp.open("POST",aicc_url,false);
			xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
			xmlhttp.send(command);	
			var tmp_resp=xmlhttp.responseText;
			var tmp_stat=xmlhttp.status;
			if (tmp_stat==200) {
				parseGetParamResponse(tmp_resp);
			} else {
				alert("Сервер не передал данные. Сервер возвратил ответ "+ xmlhttp.status);
			}			
		} catch(x) {
			alert("Ошибка исполнения AICC-команды Get. \nServerXMLHTTP: " + x.description + "\nXMLHTTP: " + e.description);
		}	
	}
return false;
}

function prepareToGetParam() {
	document.getElementById('AICCGetInfoForm').action=aicc_url;
	document.getElementById('AICCGetInfoForm').Session_id.value=escape(aicc_sid);
//	document.getElementById('aiccHub').src="responser.html?get";
	gpTout=setTimeout("tryGetParam();", 250);
}
function tryGetParam() {
	document.getElementById('AICCGetInfoForm').submit();
	clearTimeout(gpTout);
	readGetParamResponse();
}
function readGetParamResponse() {
	getTout=setTimeout("checkGetParamResponse();",aiccDelay);
}
function checkGetParamResponse() {
	var tmp_response="";
	if(document.frames['aiccHub']) {
		tmp_response=document.frames['aiccHub'].document.body.innerHTML;
		parseGetParamResponse(tmp_response);
	} else {
		alert('Server did not respond in reasonable amount \nof time. Data not received.');
		clearTimeout(getTout);
		return false;
	}
	clearTimeout(getTout);
	document.frames['aiccHub'].document.body.innerHTML="";
	return true;
}

function parseGetParamResponse(resp) {
	var tmp_response=resp.toLowerCase();
	tmp_response = unescape(tmp_response);
//alert(resp);
	var receivedStatus=false;
	if(tmp_response.indexOf('error=0')!=-1) {
		receivedStatus=true;
	} else {
		if(tmp_response.indexOf('error=1')!=-1) {
			alert('Invalid AICC-command. Data NOT received.');
		} else {
			if(tmp_response.indexOf('error=3')!=-1) {
				alert('Invalid session id. Data not received.');
			} else {
				if(tmp_response.indexOf('error=2')!=-1) {
					alert('Invalid AU-password. Data not received.');
				} else {
					if(AICC_control.toLowerCase()=='strict') {
						alert('Сервер не прислал ответ на AICC-команду \nв течение слишком долгого времени. \nAICC-сессия считается прерванной, после \nнажатия кнопки OK окно курса будет закрыто.\n Попробуйте загрузить курс снова.')
						top.window.close();
					} else {
						if(confirm('Сервер не прислал ответ на AICC-команду \nв течение слишком долгого времени. \nAICC-сессия прервана. Нажмите OK если \nВы намерены продолжить прохождение курса в \nрежиме off-line (ваши данные при этом не будут \nзаписываться на сервер), или Cancel для того чтобы \nпрекратить прохождение курса в этой сессии и \nзагрузить курс снова.')) {
							AICC_block=true;
							return false;
						} else {
							top.window.close();
						}				
					}
//					alert('ERROR R001. Data not received.');
				}		
			}		
		}
	}
	if(receivedStatus) {
//alert(resp);
		if(AICCmethod.toLowerCase()=='xml') {
			var splitter=String.fromCharCode(13,10);
		} else {
			var splitter = " ";
		}			
		var sr=unescape(resp);
		var vars=sr.split(splitter);
		var vname="";
		var vvalue="";
		var aicctestvalues="";
		var tuples;
		var tuple;
		var location = "";
		setSlideStartTime();
		for(var i=0;i<vars.length;i++) { 
//alert(vars[i]);
			if(vars[i]!='') aicctestvalues=aicctestvalues+'\n'+vars[i];
			var vnames=vars[i].split("=");
 			if(vnames.length==2) {
				vname=vnames[0];
				vvalue=vnames[1];
				vname=vname.toLowerCase(); 
				switch(vname) {
					case "q_laststate":
						tuples=vvalue.split("~");
						for (var j=0;j<tuples.length;j++) {
							tuple=tuples[j].split("@");
							if(isNaN(parseInt(tuple[0],10))) continue;
							q_laststate[tuple[0]]=new Object;
							q_laststate[tuple[0]].name=tuple[0];
							if (tuple[1]==NaN) {
								q_laststate[tuple[0]].value="";
							} else {
								q_laststate[tuple[0]].value=tuple[1];
							}
						}			
						break;
					case "q_attempts":
						tuples=vvalue.split("~");
						for (var j=0;j<tuples.length;j++) {
							tuple=tuples[j].split("@");
							if(isNaN(parseInt(tuple[0],10))) continue;
							q_attempts[tuple[0]]=new Object;
							q_attempts[tuple[0]].name=tuple[0];
							q_attempts[tuple[0]].value=parseInt(tuple[1],10);
						}			
						break;
					case "q_points":
						tuples=vvalue.split("~");
						for (var j=0;j<tuples.length;j++) {
							tuple=tuples[j].split("@");
							if(isNaN(parseInt(tuple[0],10))) continue;
							q_points[tuple[0]]=new Object;
							q_points[tuple[0]].name=tuple[0];
							if(isNaN(tuple[1])) tuple[1]=0;
							q_points[tuple[0]].value=parseInt(tuple[1],10);
						}			
						break;
					case "q_visited":
						tuples=vvalue.split("~");
						for (var j=0;j<tuples.length;j++) {
							tuple=tuples[j].split("@");
							if(!isNaN(tuple[1])) {
								q_visited[j]=new Object;
								q_visited[j].name=tuple[0];
								q_visited[j].value=parseInt(tuple[1],10);
							}
						}			
						break;
					case "t_results":
						tuples=vvalue.split("/");
						for(var j=0;j<tuples.length;j++) {
							if(t_results) {
								if(j!=0) t_results[j]=parseInt(tuples[j],10);
							}
						}			
						break;
					case "t_scale":
						tuples=vvalue.split("~");
						var testarrayid;
						var txtmp;
						for (var j=1;j<tuples.length;j++) {
							tuple=tuples[j].split("@");
							testarrayid=tuple[0];
							txtmp=tuple[1];
							if(!t_scale[testarrayid]) {
								t_scale[testarrayid]=new Array(0);
							}
							t_scale[testarrayid][txtmp]=tuple[2];
						}			
						break;
					case "q1":
						tuples=vvalue.split("/");
						for(var j=0;j<tuples.length;j++) {
							if(q1) {
								if(j!=0 && j!=1) q1[j-1]=parseInt(tuples[j],10);
							}
						}			
						break;
					case "q2":
						tuples=vvalue.split("/");
						for(var j=0;j<tuples.length;j++) {
							if(q2) {
								if(j!=0 && j!=1) q2[j-1]=parseInt(tuples[j],10);
							}
						}			
						break;
					case "q3":
						tuples=vvalue.split("/");
						for(var j=0;j<tuples.length;j++) {
							if(q3) {
								if(j!=0 && j!=1) q3[j-1]=parseInt(tuples[j],10);
							}
						}			
						break;
					case "q4":
						tuples=vvalue.split("/");
						for(var j=0;j<tuples.length;j++) {
							if(q4) {
								if(j!=0 && j!=1) q4[j-1]=parseInt(tuples[j],10);
							}
						}			
						break;
					case "q5":
						tuples=vvalue.split("/");
						for(var j=0;j<tuples.length;j++) {
							if(q5) {
								if(j!=0 && j!=1) q5[j-1]=parseInt(tuples[j],10);
							}
						}			
						break;
					case "lesson_location":
						location=vvalue;
						break;
					default:
						break;
				}
				if (vname=="score" && vvalue!="") {
					curPoints=parseInt(vvalue,10);
				}
				if (vname=="lesson_status" && vvalue!="") {
					if(vvalue.toLowerCase()!='i' && vvalue.toLowerCase()!='c' && vvalue.toLowerCase()!='p') {
						AICClesson_status='i';
					} else {
						AICClesson_status=vvalue;
					}
				}
				if (vname=="soundflag" && vvalue!="") {
					if(vvalue.charAt(0)=='t') {
						soundFlag=true;
					} else {
						soundFlag=false;
					}
				}
				if (vname=="putaiccmethod" && vvalue!="") {
					if(vvalue.charAt(0)=='t') {
						putAICCmethod="timer";
					} else {
						if(vvalue.charAt(0)=='e') {
							putAICCmethod="end";
						} else {
							if(vvalue.charAt(0)=='m') {
								putAICCmethod="manual";
							} else {
								putAICCmethod="normal";
							}
						}
					}
				}
				if (vname=="putaicctimer" && vvalue!="") {
					var zvalue=parseInt(vvalue,10);
					if(!isNaN(zvalue)) {
						if(zvalue<10000) zvalue=10000;
						putAICCtimer=zvalue;
					} else {
						putAICCtimer=60000;
					}
				}
			} else {
				if(vnames.length>2 && location=="") {
					for(var j=0;j<vnames.length;j++) {
						if(vnames[j].toLowerCase().indexOf("lesson_location")!=-1) {
							location = vnames[parseInt(j,10)+1];
							break;
						}
					}
				}
			}
		}
		if(q_laststate.length<q_points.length) {
			var vAgain=sr.substr(sr.indexOf('q_laststate=')+12);
			vAgain=vAgain.substring(0,vAgain.indexOf("="));
			vAgain=vAgain.substring(0,vAgain.lastIndexOf("\n"));
			var killThem = new RegExp("\n","g");
			var xAgain = vAgain.replace(killThem,"");
			killThem = new RegExp("\r","g");
			var zAgain = xAgain.replace(killThem,"");
			tuples = zAgain.split("~");
			if(tuples.length<q_points.length) {
//				alert('q_laststate array data are in wrong format. Errors may occur.');
				qErrorFlag=true;
			}
			for (var j=0;j<tuples.length;j++) {
				tuple=tuples[j].split("@");
				q_laststate[tuple[0]]=new Object;
				q_laststate[tuple[0]].name=tuple[0];
				if (tuple[1]==NaN) {
					q_laststate[tuple[0]].value="";
				} else {
					q_laststate[tuple[0]].value=tuple[1];
				}
			}			
		}
//		alert(aicctestvalues);
		setSoundPreferences();
		if (cur_task.getAttribute('id')!=location) {
			aicc_jump = true;
			var attrs=new Array;
			attrs['pid']=location;
			processGoto(null,attrs);
//			processNavigation(-1,location);
		}
		aiccgetdone=true;
		if(document.getElementById('puttingData')) {
			document.getElementById('puttingData').style.visibility='hidden';
		}
		if(putAICCmethod.toLowerCase()=="timer") {
			if(!putAICCtimer || putAICCtimer=="" || isNaN(putAICCtimer)) {
				putAICCtimer=60000;
			} else {
				if(putAICCtimer>=10000) {
					putAICCtimer=putAICCtimer;
				} else {
					putAICCtimer=10000;
				}
			}
			putTimer=setTimeout("startPutAICCParams(gargobj);",putAICCtimer);
		}
		return resp;		
	} else {
		return false;
	}
}


function putAICCParams(argobj) {
	firstPutDone=true;
	switch(putAICCmethod.toLowerCase()) {
		case "timer":
			gargobj=argobj;
			break;
		case "end":
			gargobj=argobj;
			break;
		default:
			startPutAICCParams(argobj);
			break;
	}
	return true;
}

function startPutAICCParams(argobj) {
	if(putAICCmethod.toLowerCase()=="timer") {
		clearTimeout(putTimer);
		if(!firstPutDone) {
			putTimer=setTimeout("startPutAICCParams(gargobj);",putAICCtimer);
			return false;
		}
	}
	if(AICC_block) {
		return false;
	}
	var i=0;
	try {
		var aiccflag=def(aiccgetdone,false);
	}
	catch(x) {
		aiccflag=false;
	}
	if(document.getElementById('puttingData')) {
		document.getElementById('puttingData').style.visibility='visible';
	}
	if(aiccflag) AICCenvironment=true;
	if(aicc_sid!="" && aicc_url!="" && aiccflag) {
		if(AICCmethod.toLowerCase()=='xml') {
			putParamXML(argobj);
		} else {
			prepareToPutParam(argobj);
		}
	}
	if(putAICCmethod.toLowerCase()=="timer") {
		putTimer=setTimeout("startPutAICCParams(gargobj);",putAICCtimer);
	}

return true;
}

function putParamXML(argobj) {
	var comtmp=formAICCdata(argobj);
	var command="command=PutParam&version=2.0&session_id="+escape(aicc_sid)+"&AICC_Data="+escape(comtmp);
//alert(command);
	try {
		var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");				
		xmlhttp.open("POST",aicc_url,false);
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
		xmlhttp.send(command);
		if (xmlhttp.status==200) {
			var resp=xmlhttp.responseText;
			if(document.getElementById('puttingData')) {
				document.getElementById('puttingData').style.visibility='hidden';
			}
			return resp;		
		} else	{
			alert("Ошибка при отправке AICC-данных. Сервер возвратил ответ " + xmlhttp.status);
		}
	} catch(e) {
		try {
			var xmlhttp = new ActiveXObject("Msxml2.ServerXMLHTTP");		
			xmlhttp.open("POST",aicc_url,false);
			xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
			xmlhttp.send(command);	
			var tmp_resp=xmlhttp.responseText;
			var tmp_stat=xmlhttp.status;
			if (tmp_stat==200) {
				if(document.getElementById('puttingData')) {
					document.getElementById('puttingData').style.visibility='hidden';
				}
				return tmp_resp;
			} else {
				alert("Сервер не принял данные. Сервер возвратил ответ "+ xmlhttp.status);
			}			
		} catch(x) {
			alert("Ошибка исполнения AICC-команды Put. \nServerXMLHTTP: " + x.description + "XMLHTTP: " + e.description);
		}	
	}
	if(document.getElementById('puttingData')) {
		document.getElementById('puttingData').style.visibility='hidden';
	}
	return false;
}

function prepareToPutParam(argobj) {
	document.getElementById('AICCPutInfoForm').action=aicc_url;
	document.getElementById('AICCPutInfoForm').Session_id.value=escape(aicc_sid);
	document.getElementById('AICCPutInfoForm').AICC_Data.value=escape(formAICCdata(argobj));
//	document.getElementById('aiccHub').src="responser.html?put";
	tryPutParam();
}
function tryPutParam() {
	document.getElementById('AICCPutInfoForm').submit();
	readPutParamResponse();
}
function readPutParamResponse() {
	putTout=setTimeout("checkPutParamResponse();",aiccDelay);
}
function checkPutParamResponse() {
	var tmp_response="";
	if(document.frames['aiccHub']) {
		tmp_response=document.frames['aiccHub'].document.body.innerHTML;
		parsePutParamResponse(tmp_response);
	} else {
		alert('Server did not respond in reasonable amount \nof time. Data not sent.');
		clearTimeout(putTout);
		return false;
	}
	clearTimeout(putTout);
	document.frames['aiccHub'].document.body.innerHTML="";
	return true;
}

function parsePutParamResponse(resp) {
	var tmp_response=resp.toLowerCase();
//alert(tmp_response);
	if(tmp_response.indexOf('error=0')!=-1) {
		return true;
	} else {
		if(tmp_response.indexOf('error=1')!=-1) {
			alert('Invalid AICC-command. Data NOT sent.');
		} else {
			if(tmp_response.indexOf('error=3')!=-1) {
				alert('Invalid session id. Data not sent.');
			} else {
				if(tmp_response.indexOf('error=2')!=-1) {
					alert('Invalid AU-password. Data not sent.');
				} else {
//					alert('ERROR S002. Data not sent.');
				}		
			}		
		}
	}
	return false;
}

function formAICCdata(argobj) {
	var params="";
	var enumerator=argobj.attrs['_enumerator_'];
	var i=0;
	var str_q_laststate="";
	var e= new Enumerator(enumerator);
	var tmpArray = new Array(0);
	var varcounter=0;
	var curLoc="";
	for (;!e.atEnd();e.moveNext()) {
		var tmpParam="";
		var x = e.item();
		if (x.value.toLowerCase=="keyword") {
			tmpParam="["+x.name.toUpperCase()+"]";
		} else {
			if(x.value=="array" && x.name.indexOf('q_')==-1) {	
				x.value="";
				eval("var value="+x.name);		
				var en= new Enumerator(value); 
		
				for (;!en.atEnd();en.moveNext()) {		
					var y=en.item();
					var yv="";
					if (y.value==NaN) ev="";else yv=new String(y.value);
					if(y.name!="" && yv!="") x.value+=y.name+"@"+yv+"~";
				}
				x.value=x.value.substring(0,x.value.length-1);
			}
			switch(x.name.toLowerCase()) {
				case 'lesson_status':
					tmpParam=x.name.toUpperCase()+"="+AICClesson_status;
					break;
				case 'score':
					tmpParam=x.name.toUpperCase()+"="+setCurPoints().toString();
					break;					
				case 'lesson_location':
					tmpParam=x.name.toUpperCase()+"="+x.value;
					curLoc=x.value;
					break;
				default:
					tmpParam=x.name+"="+x.value;
					break;
			}
		}
		tmpArray[varcounter]=tmpParam;
		varcounter++;
	}
	params="[CORE]"+String.fromCharCode(13,10);
	for(var i=0;i<tmpArray.length;i++) {
		var tmpz=tmpArray[i].toLowerCase();
		if(tmpz.indexOf('lesson_location')!=-1) {
			params=params+tmpArray[i]+String.fromCharCode(13,10);
			break;
		}
	}
	for(var i=0;i<tmpArray.length;i++) {
		var tmpz=tmpArray[i].toLowerCase();
		if(tmpz.indexOf('lesson_status')!=-1) {
			params=params+tmpArray[i]+String.fromCharCode(13,10);
			break;
		}
	}
	for(var i=0;i<tmpArray.length;i++) {
		var tmpz=tmpArray[i].toLowerCase();
		if(tmpz.indexOf('score')!=-1) {
			params=params+tmpArray[i]+String.fromCharCode(13,10);
			break;
		}
	}
	setAICCTime();
	params+="TIME="+aicc_time+String.fromCharCode(13,10)+"[CORE_LESSON]"+String.fromCharCode(13,10);

	var tmp_results="";
	if(q_points) {
		var tmpmax=0;
		for (var i in q_points) {		
			if(!q_points[i].name || q_points[i].name == "") {
				q_points[i].name = i.toString();
			}
			if(!q_points[i].value) {
				q_points[i].value=0;
			}
			tmp_results+=q_points[i].name+"@"+q_points[i].value;
			if(q_points.length>1 && i<q_points.length-1) tmp_results+="~";
		}
		params+="q_points="+tmp_results+String.fromCharCode(13,10);
	}
	var tmp_results="";
	if(q_laststate) {
		for (var i in q_laststate) {		
			if(!q_laststate[i].name || q_laststate[i].name == "") {
				q_laststate[i].name = i.toString();
			}
			if(!q_laststate[i].value) {
				q_laststate[i].value="";
			}
			tmp_results+=q_laststate[i].name+"@"+q_laststate[i].value;
			if(q_laststate.length>1 && i<q_laststate.length-1) tmp_results+="~";
		}
		params+="q_laststate="+tmp_results+String.fromCharCode(13,10);
	}
	var tmp_results="";
	if(q_attempts) {
		for (var i in q_attempts) {		
			if(!q_attempts[i].name || q_attempts[i].name == "") {
				q_attempts[i].name = i.toString();
			}
			if(!q_attempts[i].value) {
				q_attempts[i].value=0;
			}
			tmp_results+=q_attempts[i].name+"@"+q_attempts[i].value;
			if(q_attempts.length>1 && i<q_attempts.length-1) tmp_results+="~";
		}
		params+="q_attempts="+tmp_results+String.fromCharCode(13,10);
	}
	var tmp_results="";
	gotCurLoc=false;
	if(q_visited) {
		for (var i in q_visited) {		
			if(!q_visited[i].name || q_visited[i].name == "") {
				q_visited[i].name = i.toString;
			}
			if(!q_visited[i].value || q_visited[i].value == "") {
				q_visited[i].value="0";
			}
			if(q_visited[i].name == curLoc) gotCurLoc=true;
			tmp_results+=q_visited[i].name+"@"+q_visited[i].value;
			if(q_visited.length>1 && i<q_visited.length-1) tmp_results+="~";
		}
		if(!gotCurLoc) tmp_results+="~"+curLoc+"@"+"1";
		params+="q_visited="+tmp_results+String.fromCharCode(13,10);
	}
	
	for(var i=0;i<tmpArray.length;i++) {
		var tmpz=tmpArray[i].toLowerCase();
		if(tmpz.indexOf('core')==-1 && tmpz.indexOf('lesson')==-1 && tmpz.indexOf('score')==-1 && tmpz.indexOf('q_')==-1) params=params+tmpArray[i]+String.fromCharCode(13,10);
	}
	
	params+="soundFlag="+soundFlag+String.fromCharCode(13,10);
	if(putAICCmethod) params+="putAICCmethod="+putAICCmethod+String.fromCharCode(13,10);
	if(putAICCtimer) params+="putAICCtimer="+putAICCtimer+String.fromCharCode(13,10);
	var tmp_results="";
	if(t_scale && t_scale.length>1) {
		for(var i in t_scale) {
			if(t_scale[i]) {
				for(var j in t_scale[i]) {
					tmp_results+=i+"@"+j+"@"+t_scale[i][j];
					if(t_scale[i].length>1 && j<t_scale[i].length-1) tmp_results+="~";
				}
			}
			if(t_scale.length>1 && i<t_scale.length-1) tmp_results+="~";
		}
		params+="t_scale="+tmp_results+String.fromCharCode(13,10);
	}		
	tmp_results="0";
	if(t_results && t_results.length>1) {
		tmp_results="0";
		for(var i in t_results) {
			tmp_results=tmp_results+"/"+t_results[i];
		}
		params+="t_results="+tmp_results+String.fromCharCode(13,10);
	}
	if(q1 && q1.length>1) {
		tmp_results="0";
		for(var i in q1) {
			tmp_results=tmp_results+"/"+q1[i];
		}
		params+="q1="+tmp_results+String.fromCharCode(13,10);
	}
	if(q2 && q2.length>1) {
		tmp_results="0";
		for(var i in q2) {
			tmp_results=tmp_results+"/"+q2[i];
		}
		params+="q2="+tmp_results+String.fromCharCode(13,10);
	}
	if(q3 && q3.length>1) {
		tmp_results="0";
		for(var i in q3) {
			tmp_results=tmp_results+"/"+q3[i];
		}
		params+="q3="+tmp_results+String.fromCharCode(13,10);
	}
	if(q4 && q4.length>1) {
		tmp_results="0";
		for(var i in q4) {
			tmp_results=tmp_results+"/"+q4[i];
		}
		params+="q4="+tmp_results+String.fromCharCode(13,10);
	}
	if(q5 && q5.length>1) {
		tmp_results="0";
		for(var i in q5) {
			tmp_results=tmp_results+"/"+q5[i];
		}
		params+="q5="+tmp_results+String.fromCharCode(13,10);
	}
	setSlideStartTime();
//	alert (params);
	return params;
}

function closeCourse() {
	if (!AICCenvironment) {
		processNavigation('exit',null,this);
		return false;
	} else {
		AICCexitAU();
	}
	return true;
}

function AICCexitAU() {
	if(AICC_block) {
		top.window.close();
		return false;
	}
	try {
		var aiccflag=def(aiccgetdone,false);
	} catch(x) {
		aiccflag=false;
	}
	if(putAICCmethod.toLowerCase()=="timer" || putAICCmethod.toLowerCase()=="end") {
		if(firstPutDone) startPutAICCParams(gargobj);
	}
	if(aicc_sid!="" && aicc_url!="" && aiccflag) {
		if(AICCmethod.toLowerCase()=='xml') {
 			var command="command=ExitAU&version=2.0&session_id="+escape(aicc_sid)+"&AICC_Data=";
 			try {
  				var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");    
  				xmlhttp.open("POST",aicc_url,false);
  				xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
  				xmlhttp.send(command);
  				if (xmlhttp.status==200) {
   					alert('Информация успешно передана на сервер.\nПосле того, как Вы нажмете OK,\n это окно будет закрыто');
   					top.window.close();
   					return true;  
  				} else {
   					alert("Ошибка отправки AICCданных. " + xmlhttp.status);
  				}
 			} catch(e) {
				try {
					var xmlhttp = new ActiveXObject("Msxml2.ServerXMLHTTP");		
					xmlhttp.open("POST",aicc_url,false);
					xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");	
					xmlhttp.send(command);	
					var tmp_stat=xmlhttp.status;
					if (tmp_stat==200) {
   						alert('Информация успешно передана на сервер.\nПосле того, как Вы нажмете OK,\n это окно будет закрыто');
	   					top.window.close();
						return true;
					} else {
						alert("Сервер не принял данные. Сервер возвратил ответ "+ xmlhttp.status);
					}			
				} catch(x) {
					alert("Ошибка исполнения AICC-команды Exit. \nServerXMLHTTP: " + x.description + "XMLHTTP: " + e.description);
				}	
 			}
 		} else {
			httpExitAU();
		}
	}
	return false;
}

function httpExitAU() {
	document.getElementById('AICCGetInfoForm').action=aicc_url;
	document.getElementById('AICCExitForm').Session_id.value=escape(aicc_sid);
//	document.getElementById('aiccHub').src="responser.html?exit";
	tryExitAU();
}

function tryExitAU() {
//	document.getElementById('AICCExitForm').submit();
	parseExitResponse('200');
}

function readExitResponse() {
	exitTout=setTimeout("checkExitResponse();",500);
}

function checkExitResponse() {
	var tmp_response="";
	if(document.frames['aiccHub']) {
		tmp_response=document.frames['aiccHub'].document.body.innerHTML;
		parseExitResponse(tmp_response);
	} else {
		alert('Server did not respond in reasonable amount \nof time. Data not received.');
		return false;
	}
	clearTimeout(exitTout);
	return true;
}

function parseExitResponse(resp) {
	var tmp_response=resp.toLowerCase();
//alert(resp);
	var receivedStatus=true;
	if(receivedStatus) {
		alert('Информация успешно передана на сервер.\nПосле того, как Вы нажмете OK,\n это окно будет закрыто');
		top.window.close();	
	}
	return false;
}


//HTML tracking end

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v3.0
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document); return x;
}

function MM_swapImage() { //v3.0
var i,j=0,x,a=MM_swapImage.arguments;
document.MM_sr=new Array;
for(i=0;i<(a.length-2);i+=3)
 if ((x=MM_findObj(a[i]))!=null) {
  document.MM_sr[j++]=x;
  if(!x.oSrc) x.oSrc=x.src;
  x.src=a[i+2];
 }
}

function initiateQuestionnaire(maxitem, answerstring, logica, shownext, qusize, checkbutton, clerr, waiterlink, colstring) {
 aicc = 0;
 qnumero=0;
 parseclicks=1;
 qsize=qusize;
 maxIt=maxitem;
 logic=logica;
 nextmode=shownext;
 chbut=checkbutton;
 cleanerr=clerr;
 clrlink=waiterlink;
 if (clrlink == '') {
  clrwait=0;
 } else {
  clrwait=1;
 }
 if (nextmode == 0 || chbut == 0) {
  if (nextmode == 0) {
   toggleNext('off');
  }
  if (chbut == 0) {
   toggleCheck('off');
  }
 }
 var tmpstring = new String(answerstring);
 for (var i=1; i<=maxIt; i++) {
  answers[i]=tmpstring.charAt(i);
  state[i]=0;
 }
 if (logic==3) {
  for (var i=0; i<=2*maxIt+1; i++) {
   qd1[i] = 0;
   qd2[i] = 0;
  }
  var tmpstring2 = new String(colstring);
  for (var i=1; i<=2*maxIt; i++) {
   qd1[i] = tmpstring2.charAt(i);
   qd2[i] = tmpstring.charAt(i);
  }
 curit = 1;
 }
}

function checkDistribution(col) {
 var zz=col;
 var zzz=qd1[curit-1];
 if (zz==zzz) {
  var qz = "v"+qd1[curit-1]+"_"+qd2[curit-1];
  var cz = "c"+qd1[curit-1]+"_div_"+qd2[curit-1];
  document.body.all[cz].innerHTML=document.body.all[qz].innerHTML;
  displayNextVariant();
 } else {
  wrongballoon.style.visibility = 'visible';
  var timeOn = setTimeout("clearBalloons()",1000);
 }
}

function displayNextVariant() {
 var questionbody='variant';
 if (curit<=(maxIt*2)){
  var qz = "v"+qd1[curit]+"_"+qd2[curit];
  document.body.all[questionbody].innerHTML=document.body.all[qz].innerHTML;
  curit= curit+1;
 } else {
  document.body.all['variant'].innerHTML='<font color=#FF0000>Распределение закончено</font>';
  toggleNext('on');
  goballoon.style.visibility = 'visible';
 }
}

function fillRange(num, valuestring) {
 qrange[num]=valuestring;
 qrangebackup[num]=valuestring;
}

function fillResult(num) {
document.write('<table width=100% border=0 cellspacing=1 cellpadding=3>');
for (var i=1; i<=num; i++) {
 document.write('<tr><td width=40 height=25 valign=top><font class=qu12 color=#666699>' + i + '</font></td>');
 document.write('<td width=100% bgcolor=#FFFFFF><font class=qu12>' + qrange[i] + '</font></td></tr>');
}
document.write('</table>');
}

function parseRangeUp(n) {
clearBalloons();
if (stoprange == 0) {
 var div_id0 = 'div_' + n;
 var m = n-1;
 var div_id1 = 'div_' + m;
 document.body.all[div_id0].innerHTML=qrange[m];
 document.body.all[div_id1].innerHTML=qrange[n];
 var tmpstring=qrange[m];
 qrange[m] = qrange[n];
 qrange[n] = tmpstring;
}
}

function parseRangeDown(n) {
clearBalloons();
if (stoprange == 0) {
 var div_id0 = 'div_' + n;
 var m = n+1;
 var div_id1 = 'div_' + m;
 document.body.all[div_id0].innerHTML=qrange[m];
 document.body.all[div_id1].innerHTML=qrange[n];
 var tmpstring=qrange[m];
 qrange[m] = qrange[n];
 qrange[n] = tmpstring;
}
}

function showRightRange() {
 clearBalloons();
 for (var i=1; i<=maxIt; i++) {
  var div_id = 'div_' + i;
  var rightans = answers[i];
  document.body.all[div_id].innerHTML=qrangebackup[rightans];
  qrange[i]=qrangebackup[rightans];
 }
 if (nextmode != 2) {
  if (clrwait!=1) {
   toggleNext('on');
   goballoon.style.visibility = 'visible';
  } else {
   goballoon.style.visibility = 'visible';
  }
 }
 if (clrwait==1) {
  processEvent(clrlink);
  window.event.cancelBubble=false;
 }
}

function checkRange() {
var oops=0;
for (var i=1; i<=maxIt; i++) {
 var div_id = 'div_' + i;
 qrange[i]=document.body.all[div_id].innerHTML;
 var tmp=answers[i];
 if (qrange[i]!=qrangebackup[tmp]) {
  oops=1;
 }
}
if (oops==1) {
 clearBalloons();
 wrongballoon.style.visibility = 'visible';
} else {
 if (nextmode != 2) {
  if (clrwait!=1) {
   toggleNext('on');
   goballoon.style.visibility = 'visible';
  } else {
   goballoon.style.visibility = 'visible';
  }
 }
 rightballoon.style.visibility = 'visible';
 if (clrwait==1) {
  processEvent(clrlink);
  window.event.cancelBubble=false;
 }
}
}


function acceptAnswer() {
 toggleNext('on');
 goballoon.style.visibility = 'visible';
 stoprange=1;
}

function findNext() {
 for (var j=0; j<document.links.length; j++) {
  if(document.links[j].id=="bnextlink") {
   nextid=document.links[j];
  }
 }
}

function findPrev() {
 for (var j=0; j<document.links.length; j++) {
  if(document.links[j].id=="bprevlink") {
   previd=document.links[j];
  }
 }
}

function findCheck() {
 for (var j=0; j<document.links.length; j++) {
  if(document.links[j].id=="chb") {
   chbid=document.links[j];
  }
 }
}

function parseClick(it) {
if (parseclicks==1) {
 if (chbut==0) {
  toggleCheck('on');
 }
 clearBalloons();
 if (logic==1) {
  if (cleanerr==1) {
   for (i=1; i<=maxIt; i++) {
    if (state[i]==2) {
     setEmpty(i);
    }
   }
  }
  if (state[it]==0 || state[it]=="") {
   setRight(it);
  } else {
   if (state[it]==1 || state[it]==2) {
    setEmpty(it);
   } else {
    setRight(it);
   }
  }
 } else {
  if (state[it]==0 || state[it]=="") {
   for (i=1; i<=maxIt; i++) {
    if (state[i]==1 || state[i]==2) {
     setEmpty(i);
    }
   }
   setRight(it);
  } else {
   if (state[it]==2) {
    for (i=1; i<=maxIt; i++) {
     if (state[i]==1 || state[i]==2) {
      setEmpty(i);
     }
    }
    setRight(it);
   }
  }
 }
}
}

function setWrong(it) {
 if (qsize==1) {
  if (def(document.images["check_"+it],null))
  document.images["check_"+it].src = eval("check_wrong.src");
  state[it]=2;
 } else {
  if (def(document.images["checks_"+it],null))
  document.images["checks_"+it].src = eval("check_small_wrong.src");
  state[it]=2;
 }
}
function setRight(it) {
 if (qsize==1) {
  if (def(document.images["check_"+it],null))
  document.images["check_"+it].src = eval("check_yes.src");
  state[it]=1;
 } else {
  if (def(document.images["checks_"+it],null))
  document.images["checks_"+it].src = eval("check_small_yes.src");
  state[it]=1;
 }
}
function setEmpty(it) {
 if (qsize==1) {
  if (def(document.images["check_"+it],null))
  document.images["check_"+it].src = eval("check_no.src");
  state[it]=0;
 } else {
  if (def(document.images["checks_"+it],null))
  document.images["checks_"+it].src = eval("check_small_no.src");
  state[it]=0;
 }
}

function clearBalloons() {
 if(document.getElementById('nothingballoon')) nothingballoon.style.visibility = 'hidden';
 if(document.getElementById('wrongballoon')) wrongballoon.style.visibility = 'hidden';
 if(document.getElementById('rightballoon')) rightballoon.style.visibility = 'hidden';
 if(document.getElementById('goballoon')) goballoon.style.visibility = 'hidden';
 if(document.getElementById('continueballoon')) continueballoon.style.visibility='hidden';
 if(document.getElementById('byeballoon')) byeballoon.style.visibility='hidden';
 if(document.getElementById('sorryballoon')) sorryballoon.style.visibility='hidden';
}

function checkAnswer(mode) {
 var wrong=0;
 var oops=0;
 for (var i=1; i<=maxIt; i++) {
  if (state[i]==1) {
   oops=1;
  } 
 }
 if (oops==1) {
  if (logic==1) {
   for (var i=1; i<=maxIt; i++) {
    if (mode==0) {
     if (answers[i]!= state[i]) {
      wrong=1;
      setWrong(i);
     }
    } else {
     if (answers[i]!= state[i] && state[i]==1) {
      wrong=1;
      setWrong(i);
     } else {
      if (answers[i]!= state[i] && state[i]==0) {
       wrong=1;
      }      
     } 
    }
   }
  } else {
   for (var i=1; i<=maxIt; i++) {
    if (answers[i]!= state[i] && state[i]==1) {
     wrong=1;
     setWrong(i);
    } 
   }
  }
  if (wrong==1) {
   clearBalloons();
   wrongballoon.style.visibility = 'visible';
  } else {
   clearBalloons();
   rightballoon.style.visibility = 'visible';
   if (nextmode != 2) {
    if (clrwait!=1) {
     toggleNext('on');
     goballoon.style.visibility = 'visible';
    } else {
     goballoon.style.visibility = 'visible';
    }
   }
   if (clrwait==1) {
    processEvent(clrlink);
	window.event.cancelBubble=false;
   }
  }
 } else {
  clearBalloons();
  nothingballoon.style.visibility = 'visible';
 }
}

function viewAnswer() {
 clearBalloons();
 for (var i=1; i<=maxIt; i++) {
  if (answers[i]==1) {
   state[i]=1;
   setRight(i);
  } else {
   state[i]=0;
   setEmpty(i);
  }
 }
 if (nextmode != 2) {
  if (clrwait!=1) {
   toggleNext('on');
   goballoon.style.visibility = 'visible';
  } else {
   goballoon.style.visibility = 'visible';
  }
 }
 rightballoon.style.visibility = 'visible';
 if (clrwait==1) {
  processEvent(clrlink);
  window.event.cancelBubble=false;
 }
}

function disableLink(link) {
 link.disabled = true;
 if (link.style)
  link.style.cursor = 'default';
}


function enableLink(link) {
 link.disabled = false;
 if (link.style)
  link.style.cursor = document.all ? 'hand' : 'pointer';
}


function toggleNext(sw) {
 findNext();
 if (sw=="off") {
  disableLink(nextid);
  if (document.images["bnextpic"]) {
   document.images["bnextpic"].src = bnext_disabled.src;
  } else {
   if (document.images["wsnext"]) {
    document.images["wsnext"].src = wsnext_disabled.src;
    wsnextflag=1;
   }
  }
 } else {
  enableLink(nextid);
  if (document.images["bnextpic"]) {
   document.images["bnextpic"].src = eval("bnext_enabled.src");
  } else {
   if (document.images["wsnext"]) {
    document.images["wsnext"].src = wsnext_enabled.src;
    wsnextflag=0;
   }
  }
 }
 return false;
}

function toggleSelector(sw) {
if(document.getElementById('selectorform')) {
	if (sw == 'off') {
 		document.getElementById('selectorform').style.visibility = 'hidden';
	} else {
		document.getElementById('selectorform').style.visibility = 'visible';
	}
}
}

function togglePrev(sw) {
 findPrev();
 if (sw=="off") {
  disableLink(previd);
  if (document.images["bprevpic"]) {
   document.images["bprevpic"].src = bprev_disabled.src;
  } else {
   if (document.images["wsprev"]) {
    document.images["wsprev"].src = wsprev_disabled.src;
    wsprevflag=1;
   }
  }
 } else {
  enableLink(previd);
  if (document.images["bprevpic"]) {
   document.images["bprevpic"].src = eval("bprev_enabled.src");
  } else {
   if (document.images["wsprev"]) {
    document.images["wsprev"].src = wsprev_enabled.src;
    wsprevflag=0;
   }
  }
 }
 return false;
}

function toggleCheck(sw) {
 findCheck();
 if (sw=="off") {
  disableLink(chbid);
  if (document.images["checkbutton"]) {
   document.images["checkbutton"].src = eval("checkbutton_disabled.src");
  }
 } else {
  enableLink(chbid);
  if (document.images["checkbutton"]) {
   document.images["checkbutton"].src = eval("checkbutton.src");
  }
 }
}




function initiateQuestionnaireZ(maxitem, answerstring, logica, shownext, qusize, checkbutton, clerr, waiterlink, colstring, maxp, pointst, attemp, qn) {
 aicc = 1;
 parseclicks=1;
 qnumero=qn;
 maxpoints = maxp;
 pointstep = pointst;
 attts = attemp;
 qsize=qusize;
 maxIt=maxitem;
 logic=logica;
 nextmode=shownext;
 chbut=checkbutton;
 cleanerr=clerr;
 clrlink=waiterlink;
 if (clrlink == '') {
  clrwait=0;
 } else {
  clrwait=1;
 }
 if (nextmode == 0 || chbut == 0) {
  if (nextmode == 0) {
   toggleNext('off');
  }
  if (chbut == 0) {
   toggleCheck('off');
  }
 }
 var tmpstring = new String(answerstring);
 for (var i=1; i<=maxIt; i++) {
  answers[i]=0;
  answers[i]=tmpstring.charAt(i);
  state[i]=0;
 }
 if (logic==3) {
  for (var i=0; i<=2*maxIt+1; i++) {
   qd1[i] = 0;
   qd2[i] = 0;
  }
  var tmpstring2 = new String(colstring);
  for (var i=1; i<=2*maxIt; i++) {
   qd1[i] = tmpstring2.charAt(i);
   qd2[i] = tmpstring.charAt(i);
  }
 curit = 1;
 }
 if(q_laststate[qnumero]) {
  if (logic==2) {
   setLastStateRangeZ();
  } else {
   setLastStateZ();
  }
 } else {
  q_laststate[qnumero]=new Object; 
  q_laststate[qnumero].name=qnumero; 
  q_laststate[qnumero].value=''; 
  q_attempts[qnumero]=new Object; 
  q_attempts[qnumero].name=qnumero; 
  q_attempts[qnumero].value=''; 
  q_points[qnumero]=new Object; 
  q_points[qnumero].name=qnumero; 
  q_points[qnumero].value=''; 
 }
}

function checkAnswerZ(mode) {
	var wrong=0;
	var oops=0;
	for(var i=1; i<=maxIt; i++) {
		if (state[i]==1) {
			oops=1;
		} 
	}
	if(oops==1) {
		if(logic==1) {
			for (var i=1; i<=maxIt; i++) {
				if (mode==0) {
					if (answers[i]!= state[i]) {
						wrong=1;
						setWrong(i);
					}
				} else {
					if (answers[i]!= state[i] && state[i]==1) {
						wrong=1;
						setWrong(i);
					} else {
						if (answers[i]!= state[i] && state[i]==0) {
							wrong=1;
						}      
					} 
				}
			}
		} else {
			for (var i=1; i<=maxIt; i++) {
				if (answers[i]!= state[i] && state[i]==1) {
					wrong=1;
					setWrong(i);
				} 
			}
		}
		if (wrong==1) {
			maxpoints=maxpoints-pointstep;
			clearBalloons();
			if (attts>=2) {
				wrongballoon.style.visibility = 'visible';
			} else {
				viewAnswerZ();
				byeballoon.style.visibility = 'visible';
				zPoints=zPoints+parseInt(maxpoints,10);
				curPoints=Math.round(zPoints/maxPoints*100);
				for (var i=1; i<=maxIt; i++) {
					answers[i]=0;
				}
			}
			attts=attts-1;
		} else {
			clearBalloons();
			rightballoon.style.visibility = 'visible';
			if (nextmode != 2) {
				if (clrwait!=1) {
					toggleNext('on');
					goballoon.style.visibility = 'visible';
				} else {
					goballoon.style.visibility = 'visible';
				}
			}
			if (clrwait==1) {
				processEvent(clrlink);
				window.event.cancelBubble=false;
			}
			zPoints=zPoints+parseInt(maxpoints,10);
			curPoints=Math.round(zPoints/maxPoints*100);
			for (var i=1; i<=maxIt; i++) {
				answers[i]=0;
			}
		}
		q_attempts[qnumero].name=qnumero;
		q_points[qnumero].name=qnumero;
		q_laststate[qnumero].name=qnumero;
		q_attempts[qnumero].value=attts;
		q_points[qnumero].value=parseInt(maxpoints,10);
		q_laststate[qnumero].value='9';
		for (var i=1; i<=maxIt; i++) {
			q_laststate[qnumero].value=q_laststate[qnumero].value+state[i];
		}
	} else {
		clearBalloons();
		nothingballoon.style.visibility = 'visible';
	}
}

function setCurPoints() {
	if(curPoints==100) {
		return 100;
	}
	var idx = 0;
	var cpoints = 0;
	for(var i in q_points) {
		idx = parseInt(q_points[i].name,10);
		if(isNaN(idx)) continue;
		if(idx>100) continue;
		if(q_points[i].value.toString().length>1) {
			var zm = q_points[i].value.toString().charAt(0);
			if(zm=="1") {
				zm += q_points[i].value.toString().charAt(1);
			}
			q_points[i].value = parseInt(zm,10);
		}
		cpoints += parseInt(q_points[i].value,10);
	}
	maxPoints = parseInt(maxPoints,10);
	cpoints = Math.round(cpoints/maxPoints*100);
	return cpoints;	
}

function viewAnswerZ() {
 clearBalloons();
 for (var i=1; i<=maxIt; i++) {
  if (answers[i]==1) {
   state[i]=1;
   setRight(i);
  } else {
   state[i]=0;
   setEmpty(i);
  }
 }
 if (nextmode != 2) {
  if (clrwait!=1) {
   toggleNext('on');
   goballoon.style.visibility = 'visible';
  } else {
   goballoon.style.visibility = 'visible';
  }
 }
 if (clrwait==1) {
  processEvent(clrlink);
  window.event.cancelBubble=false;
 }
}

function setLastStateZ() {
if (q_laststate[qnumero] && q_laststate[qnumero].value!='' && qnumero!=0) {
 var tmpstring = q_laststate[qnumero].value;
 for (var i=1; i<=maxIt; i++) {
  tmp_state[i]=tmpstring.charAt(i);
  state[i]=0;
 }

 for (var i=1; i<=maxIt; i++) {
  if (tmp_state[i]==1) {
   state[i]=1;
   setRight(i);
  } else {
   state[i]=0;
   setEmpty(i);
  }
 }
 toggleNext('on');
 toggleCheck('off');
 if(def(document.all['alreadyballoon'],null))
  document.all['alreadyballoon'].style.visibility = 'visible';
 parseclicks=0;
 processEvent(clrlink);
 window.event.cancelBubble=false;
}
}

function setLastStateRangeZ() {
if (q_laststate[qnumero] && q_laststate[qnumero].value!='' && qnumero!=0) {
 showRightRange();
 toggleNext('on');
 toggleCheck('off');
 if(def(document.all['alreadyballoon'],null)) document.all['alreadyballoon'].style.visibility = 'visible';
 parseclicks=0;
 processEvent(clrlink);
 window.event.cancelBubble=false;
}
}

function checkRangeZ() {
var oops=0;
for (var i=1; i<=maxIt; i++) {
 var div_id = 'div_' + i;
 qrange[i]=document.body.all[div_id].innerHTML;
 var tmp=answers[i];
 if (qrange[i]!=qrangebackup[tmp]) {
  oops=1;
 }
}
if (oops==1) {
 maxpoints=maxpoints-pointstep;
 clearBalloons();
 if (attts>=2) {
  wrongballoon.style.visibility = 'visible';
 } else {
  showRightRange();
  byeballoon.style.visibility = 'visible';
  zPoints=zPoints+parseInt(maxpoints,10);
  curPoints=Math.round(zPoints/maxPoints*100);
 }
 attts=attts-1;
} else {
 clearBalloons();
 rightballoon.style.visibility = 'visible';
 if (nextmode != 2) {
  if (clrwait!=1) {
   toggleNext('on');
   goballoon.style.visibility = 'visible';
  } else {
   goballoon.style.visibility = 'visible';
  }
 }
 if (clrwait==1) {
  processEvent(clrlink);
  window.event.cancelBubble=false;
 }
 zPoints=zPoints+parseInt(maxpoints,10);
 curPoints=Math.round(zPoints/maxPoints*100);
}
q_attempts[qnumero].name=qnumero;
q_points[qnumero].name=qnumero;
q_laststate[qnumero].name=qnumero;
q_attempts[qnumero].value=attts;
q_points[qnumero].value=parseInt(maxpoints,10);
q_laststate[qnumero].value='9';
for (var i=1; i<=maxIt; i++) {
 q_laststate[qnumero].value=q_laststate[qnumero].value+answers[i];
}

}

function replace(string,text,by) {
// Replaces text with by in string
    var strLength = string.length, txtLength = text.length;
    if ((strLength == 0) || (txtLength == 0)) return string;

    var i = string.indexOf(text);
    if ((!i) && (text != string.substring(0,txtLength))) return string;
    if (i == -1) return string;

    var newstr = string.substring(0,i) + by;

    if (i+txtLength < strLength)
        newstr += replace(string.substring(i+txtLength,strLength),text,by);

    return newstr;
}

function InitiateQM(qmnumber,qmqty,qmatts,qmstartevent,qmendevent,qmweight,qmatype1,qmdec1,qmanswer1,qmatype2,qmdec2,qmanswer2,qmatype3,qmdec3,qmanswer3) {
	qnumero=qmnumber;
	clrlink=qmendevent;
	if (clrlink == '') {
		clrwait=0;
	} else {
		clrwait=1;
	}
	if(q_laststate[qnumero] && q_laststate[qnumero].value!='') {
		if(repeatTest && q_attempts[qnumero] && q_attempts[qnumero].value==100) {
			if(confirm('Вы уже отвечали на этот вопрос. \nВы можете ответить на него снова -\nдля этого нажмите OK, либо\nпросмотреть Ваш ответ - для этого\nнажмите Cancel.')) {
				if(qExcludeQuestionFromCurPoints()) {
					if(document.getElementById('qm_answer1')) document.getElementById('qm_answer1').value='';
					q_laststate[qnumero].value='';
					if(qmqty==2 && document.getElementById('qm_answer2')) {
						document.getElementById('qm_answer2').value='';
						if(q_laststate[qnumero+2000]) q_laststate[qnumero+2000].value='';
					}
					q_laststate[qnumero].value='';
					q_attempts[qnumero].value=qmatts;
					q_points[qnumero].value='';
					if(qmqty==2) {
						if(q_laststate[qnumero+2000]) q_laststate[qnumero+2000].value=''; 
					}
				} else {
					alert('К сожалению, не удалось реинициализировать \nвопрос. Ответить на него повторно не удастся.');
					if(document.getElementById('qm_answer1')) { 
						document.getElementById('qm_answer1').value=q_laststate[qnumero].value;
					}
					if(qmqty==2 && document.getElementById('qm_answer2')) {
						document.getElementById('qm_answer2').value=q_laststate[qnumero+2000].value;
					}
					if(document.getElementById('checkplace')) {
						document.getElementById('checkplace').style.display='none';
					}
					if(document.getElementById('alreadyballoon')) {
						document.getElementById('alreadyballoon').style.visibility='visible';
					}
					return false;
				}
			} else {
					if(document.getElementById('qm_answer1')) { 
						document.getElementById('qm_answer1').value=q_laststate[qnumero].value;
					}
					if(qmqty==2 && document.getElementById('qm_answer2')) {
						document.getElementById('qm_answer2').value=q_laststate[qnumero+2000].value;
					}
					if(document.getElementById('checkplace')) {
						document.getElementById('checkplace').style.display='none';
					}
					if(document.getElementById('alreadyballoon')) {
						document.getElementById('alreadyballoon').style.visibility='visible';
					}
					return false;
			}
		} else {
			if(q_attempts[qnumero] && q_attempts[qnumero].value!=0 && q_attempts[qnumero].value!=100) {
				alert('Вы уже отвечали на этот вопрос \nи не ответили правильно, но у Вас \nеще есть неиспользованные попытки. \nПожалуйста, попробуйте еще.');
				if(document.getElementById('qm_answer1')) { 
					document.getElementById('qm_answer1').value=q_laststate[qnumero].value;
				}
				if(qmqty==2 && document.getElementById('qm_answer2')) {
					document.getElementById('qm_answer2').value=q_laststate[qnumero+2000].value;
				}
				processEvent(clrlink);
				window.event.cancelBubble=false;
			} else {
				if(q_attempts[qnumero].value==100) {
					alert('Вы уже отвечали на этот вопрос. \nВ установках курса повторная сдача \nзачетных вопросов не разрешена');
				} else {
					alert('Вы уже отвечали на этот вопрос \nи у Вас не осталось более попыток. \nВ установках курса повторная сдача \nзачетных вопросов не разрешена');
				}
				if(document.getElementById('qm_answer1')) { 
					document.getElementById('qm_answer1').value=q_laststate[qnumero].value;
				}
				if(qmqty==2 && document.getElementById('qm_answer2')) {
					document.getElementById('qm_answer2').value=q_laststate[qnumero+2000].value;
				}
				if(document.getElementById('checkplace')) {
					document.getElementById('checkplace').style.display='none';
				}
				return false;
			}
		}
	} else {
		q_laststate[qnumero]=new Object; 
		q_laststate[qnumero].name=qnumero; 
		q_laststate[qnumero].value=''; 
		q_attempts[qnumero]=new Object; 
		q_attempts[qnumero].name=qnumero; 
		q_attempts[qnumero].value=qmatts; 
		q_points[qnumero]=new Object; 
		q_points[qnumero].name=qnumero; 
		q_points[qnumero].value='';
		if(qmqty==2) {
			q_laststate[qnumero+2000]=new Object; 
			q_laststate[qnumero+2000].name=qnumero; 
			q_laststate[qnumero+2000].value=''; 
		}
	}
}

function qExcludeQuestionFromCurPoints() {
	if(q_points[qnumero]) {
		if(parseInt(q_points[qnumero].value,10)!=0)	{
			if(parseInt(curPoints,10)!=0)
			curPoints=parseInt(curPoints,10)-Math.round(parseInt(q_points[qnumero].value,10)/parseInt(maxPoints,10)*100);
			if(curPoints<0) curPoints=0;
		}
		return true;
	} else {
		return false;
	}
}

function checkAnswerManual(qmnumber,qmqty,qmatts,qmstartevent,qmendevent,qmweight,qmatype1,qmdec1,qmanswer1,qmatype2,qmdec2,qmanswer2,qmatype3,qmdec3,qmanswer3,qmrange1,qmrange2,qmrange3) {
	if(!qmrange1 || qmrange1==null || qmrange1=='') {
		qmrange1 = parseFloat(qmanswer1)/1000;
	}
	if(!qmrange2 || qmrange2==null || qmrange2=='') {
		qmrange2 = parseFloat(qmanswer2)/1000;
	}
	if(!qmrange3 || qmrange3==null || qmrange3=='') {
		qmrange3 = parseFloat(qmanswer3)/1000;
	}
	qnumero=qmnumber;
	clrlink=qmendevent;
	if(qmqty==1) {
		var qm_curvalue1=document.getElementById('qm_answer1').value;
		q_laststate[qnumero].value=qm_curvalue1;
		if(qmatype1=='number') {
			qm_curvalue1=replace(qm_curvalue1,',','.');
			qmanswer1=replace(qmanswer1,',','.');
			if(qmdec1!=0) {
				qm_curvalue1=parseFloat(qm_curvalue1);
				qmanswer1=parseFloat(qmanswer1);
				qmrange1=parseFloat(qmrange1);
			} else {
				qm_curvalue1=parseInt(qm_curvalue1);
				qmanswer1=parseInt(qmanswer1);
				qmrange1=parseInt(qmrange1);
			}
		}
		if(qm_curvalue1-qmanswer1<0) {
			if(qmanswer1-qm_curvalue1<qmrange1) {
				qm_curvalue1=qmanswer1;
			}
		} else {
			if(qm_curvalue1-qmanswer1<qmrange1) {
				qm_curvalue1=qmanswer1;
			}
		}
		if(qm_curvalue1==qmanswer1) {
			q_laststate[qnumero].value=qmanswer1;
			q_points[qnumero].value=q_attempts[qnumero].value*qmweight;
			clearBalloons();
			rightballoon.style.visibility = 'visible';
//			document.getElementById('checkplace').style.visibility='hidden';
			document.getElementById('checkplace').innerHTML='<a href="#" onClick="clearBalloons();return false;">Спрятать подсказки</a>';
			q_attempts[qnumero].value=100;
			if (clrwait!=1) {
				toggleNext('on');
				goballoon.style.visibility = 'visible';
			} else {
				goballoon.style.visibility = 'visible';
				processEvent(clrlink);
				window.event.cancelBubble=false;
			}
			zPoints=zPoints+q_points[qnumero].value;
			curPoints=Math.round(zPoints/maxPoints*100);
		} else {
			q_attempts[qnumero].value=q_attempts[qnumero].value-1;
			clearBalloons();
			if(q_attempts[qnumero].value>0) {
				wrongballoon.style.visibility = 'visible';
				q_laststate[qnumero].value=qm_curvalue1;
			} else {
				goballoon.style.visibility = 'visible';
				byeballoon.style.visibility = 'visible';
//				document.getElementById('checkplace').style.visibility='hidden';
				document.getElementById('checkplace').innerHTML='<a href="#" onClick="clearBalloons();return false;">Спрятать подсказки</a>';
				document.getElementById('qm_answer1').value=qmanswer1;
				q_laststate[qnumero].value=qmanswer1;
				q_points[qnumero].value=0;
				q_attempts[qnumero].value=100;
				processEvent(clrlink);
				window.event.cancelBubble=false;
			}
		}
	} else {
		if(qmqty==2) {
			var qm_curvalue1=document.getElementById('qm_answer1').value;
			q_laststate[qnumero].value=qm_curvalue1;
			var qm_curvalue2=document.getElementById('qm_answer2').value;
			q_laststate[qnumero+2000].value=qm_curvalue2;

			if(qmatype1=='number') {
				qm_curvalue1=replace(qm_curvalue1,',','.');
				qmanswer1=replace(qmanswer1,',','.');
				if(qmdec1!=0) {
					qm_curvalue1=parseFloat(qm_curvalue1);
					qmanswer1=parseFloat(qmanswer1);
					qmrange1=parseFloat(qmrange1);
				} else {
					qm_curvalue1=parseInt(qm_curvalue1);
					qmanswer1=parseInt(qmanswer1);
					qmrange1=parseInt(qmrange1);
				}
			}
			if(qmatype2=='number') {
				qm_curvalue2=replace(qm_curvalue2,',','.');
				qmanswer2=replace(qmanswer2,',','.');
				if(qmdec2!=0) {
					qm_curvalue2=parseFloat(qm_curvalue2);
					qmanswer2=parseFloat(qmanswer2);
					qmrange2=parseFloat(qmrange2);
				} else {
					qm_curvalue2=parseInt(qm_curvalue2);
					qmanswer2=parseInt(qmanswer2);
					qmrange2=parseInt(qmrange2);
				}
			}
			if(qm_curvalue1-qmanswer1<0) {
				if(qmanswer1-qm_curvalue1<qmrange1) {
					qm_curvalue1=qmanswer1;
				}
			} else {
				if(qm_curvalue1-qmanswer1<qmrange1) {
					qm_curvalue1=qmanswer1;
				}
			}
			if(qm_curvalue2-qmanswer2<0) {
				if(qmanswer2-qm_curvalue2<qmrange2) {
					qm_curvalue2=qmanswer2;
				}
			} else {
				if(qm_curvalue2-qmanswer2<qmrange2) {
					qm_curvalue2=qmanswer2;
				}
			}
			if(qm_curvalue1==qmanswer1 && qm_curvalue2==qmanswer2) {
				q_laststate[qnumero].value=qmanswer1;
				q_laststate[qnumero+2000].value=qmanswer2;
				q_points[qnumero].value=q_attempts[qnumero].value*qmweight;
				zPoints=zPoints+q_points[qnumero].value;
				curPoints=Math.round(zPoints/maxPoints*100);
				clearBalloons();
				rightballoon.style.visibility = 'visible';
//				document.getElementById('checkplace').style.visibility='hidden';
				document.getElementById('checkplace').innerHTML='<a href="#" onClick="clearBalloons();return false;">Спрятать подсказки</a>';
				q_attempts[qnumero].value=100;
				if (clrwait!=1) {
					toggleNext('on');
					goballoon.style.visibility = 'visible';
				} else {
					goballoon.style.visibility = 'visible';
					processEvent(clrlink);
					window.event.cancelBubble=false;
				}
			} else {
				q_attempts[qnumero].value=q_attempts[qnumero].value-1;
				clearBalloons();
				if(q_attempts[qnumero].value>0) {
					if(qm_curvalue1==qmanswer1 && qm_curvalue2!=qmanswer2) {
						wrongballoon.style.visibility = 'visible';
						q_laststate[qnumero].value=qmanswer1;
						q_laststate[qnumero+2000].value=qm_curvalue2;
					}
					if(qm_curvalue1!=qmanswer1 && qm_curvalue2==qmanswer2) {
						wrongballoon.style.visibility = 'visible';
						q_laststate[qnumero].value=qm_curvalue1;
						q_laststate[qnumero+2000].value=qmanswer2;
					}
					if(qm_curvalue1!=qmanswer1 && qm_curvalue2!=qmanswer2) {
						wrongballoon.style.visibility = 'visible';
						q_laststate[qnumero].value=qm_curvalue1;
						q_laststate[qnumero+2000].value=qm_curvalue2;
					}
				} else {
					goballoon.style.visibility = 'visible';
					byeballoon.style.visibility = 'visible';
//					document.getElementById('checkplace').style.visibility='hidden';
					document.getElementById('checkplace').innerHTML='<a href="#" onClick="clearBalloons();return false;">Спрятать подсказки</a>';
					document.getElementById('qm_answer1').value=qmanswer1;
					document.getElementById('qm_answer2').value=qmanswer2;
					q_laststate[qnumero].value=qmanswer1;
					q_laststate[qnumero+2000].value=qmanswer2;
					q_points[qnumero].value=0;
					q_attempts[qnumero].value=100;
					processEvent(clrlink);
					window.event.cancelBubble=false;
				}
			}

		}
	}
}

function initiateTest(test, maxchoices, maxq, znext) {

 qsize=0;
 test_type='simple';
 test_id=test;
 t_results[test_id]=0;
 testmaxchoices=maxchoices;
 testmaxquestions=maxq;
 next_key=znext;
 for(var i=1; i<=testmaxchoices; i++) {
  state[i]=0;
 }
 for(var i=0;i<=maxq;i++) {
  t_orders[i]='';
  t_points[i]=0;
 }
 testResult=0;
 curTestQ=1;
 initiateTestStage1();
}

function initiateTestStage1() {
 if(!document.getElementById('test_question_number')) {
  setTimeout("initiateTestStage1()",50);
 } else {
  initiateTestStage2();
 }
}

function initiateTestStage2() {
 if(document.getElementById('test_question_number')) {
  document.getElementById('test_question_number').innerHTML=curTestQ;
 }
 if(document.getElementById('test_question') && document.getElementById('testq1')) {
  document.getElementById('test_question').innerHTML=document.getElementById('testq1').innerHTML;
 }
 if(document.getElementById('test_body')) {
  document.getElementById('test_body').style.visibility='visible';
 }
 if(next_key!='ignore') toggleNext('off');
}

function initiateTestComplex(test,maxch,choi,maxq,znext) {
 qsize=0;
 test_type='complex';
 test_id=test;
 testmaxchoices=maxch;
 t_results[test_id]=0;
 testmaxquestions=maxq;
 t_choices=choi.split("/");
 next_key=znext;
 for(var i=1; i<=testmaxchoices; i++) {
  state[i]=0;
 }
 for(var i=0;i<=testmaxquestions;i++) {
  t_orders[i]='';
  t_points[i]=0;
 }
 testResult=0;
 curTestQ=1;
 initiateTestComplexStage1();
}

function initiateTestComplexStage1() {
	if(!document.getElementById('test_question_number')) {
		fftout=setTimeout("initiateTestComplexStage1()",50);
	} else {
		clearTimeout(fftout);
		initiateTestComplexStage2();
	}
}

function initiateTestComplexStage2() {
 if(document.getElementById('test_question')) {
  document.getElementById('test_question').innerHTML=document.getElementById('testq1').innerHTML;
 }
 if(document.getElementById('test_question_number')) {
  document.getElementById('test_question_number').innerHTML=curTestQ;
 }
 for(var i=1;i<=t_choices[0];i++) {
  document.getElementById('checkrow'+i).style.visibility='visible';
  document.getElementById('checkq'+i).innerHTML=document.getElementById('t_item1_'+i).innerHTML;
 }
 var tmpstring='';
 for(var i=1;i<=testmaxquestions;i++) {
  tmpstring=document.getElementById('pointsq'+i).innerHTML;
  t_dpoints[i]=new Array(0);
  for (var j=1; j<=t_choices[i-1]; j++) {
   t_dpoints[i][j]=tmpstring.charAt(j);
  }
  if(doScale) {
	tmpstring=document.getElementById('scaleq'+i).innerHTML;
	t_scales[i]=new Array(0);
	for (var j=1; j<=t_choices[i-1]; j++) {
		t_scales[i][j]=tmpstring.charAt(j);
	}
  }
 }
 if(next_key!='ignore') toggleNext('off');
 if(doScale) {
	t_scale[test_id]=new Array(numScales+1);
	for(var i=0;i<=numScales;i++) {
		t_scale[test_id][i]=0;
	}
 }
}


function parseTestClick(it) {
for (var i=1; i<=testmaxchoices; i++) {
 if (state[i]==1) {
  setEmpty(i);
 } else {
  if(i==it) {
   setRight(it);
  }
 }
}
toggleTestFurther('on');
}

function toggleTestFurther(key) {
if(key=='on') {
	document.getElementById('test_further').style.visibility='visible';
} else {
	if(key=='off') {
		document.getElementById('test_further').style.visibility='hidden';
	} else {
		if(document.getElementById('test_further')) {
			if(document.getElementById('test_further').style.visibility=='hidden') {
				document.getElementById('test_further').style.visibility="visible";
		} else {
				document.getElementById('test_further').style.visibility='hidden';
			}
		}
	}
}
}

function setCounting(qn,qorder) {
 if(t_orders[qn]!=qorder) {
  t_orders[qn]=qorder;
 }
}

function testNextQuestion() {
var testq=0;
var tprogress_item='';
if(test_type=='complex') {
 for (var i=1; i<=t_choices[curTestQ-1]; i++) {
  if (state[i]==1) {
   t_points[curTestQ]=parseInt(t_dpoints[curTestQ][i],10);
   if(doScale) {
		var dsmtp=t_scales[curTestQ][i];
		t_scale[test_id][dsmtp]=t_scale[test_id][dsmtp]+t_points[curTestQ];
   }
  }
 }
} else {
 for (var i=1; i<=testmaxchoices; i++) {
  if (state[i]==1) {
   if(t_orders[curTestQ]=='revert') {
    t_points[curTestQ]=i-1;
   } else {
    t_points[curTestQ]=testmaxchoices-i;
   }
  }
 }
}
tprogress_item="tprogress"+curTestQ;
if(document.getElementById(tprogress_item)) {
 document.getElementById(tprogress_item).style.backgroundColor='#33CC33';
}
if(test_type=='complex') {
 for(var i=1;i<=t_choices[curTestQ-1];i++) {
  document.getElementById('checkrow'+i).style.visibility='hidden';
  document.getElementById('checkq'+i).innerHTML='';
 }
}
curTestQ++;
if(curTestQ<=testmaxquestions) {
 testq='testq'+curTestQ;
 if(document.getElementById('test_question') && document.getElementById(testq)) {
  document.getElementById('test_question').innerHTML=document.getElementById(testq).innerHTML;
 }
 if(document.getElementById('test_question_number')) {
  document.getElementById('test_question_number').innerHTML=curTestQ;
 }
 for (var i=1; i<=testmaxchoices; i++) {
  setEmpty(i);
 }
 if(test_type=='complex') {
  for(var i=1;i<=t_choices[curTestQ-1];i++) {
   document.getElementById('checkrow'+i).style.visibility='visible';
   document.getElementById('checkq'+i).innerHTML=document.getElementById('t_item'+curTestQ+'_'+i).innerHTML;
  }
 }
} else {
 for(var i=1;i<=testmaxquestions;i++) {
  testResult=testResult+t_points[i];
 }
 t_results[test_id]=testResult;
 if(document.getElementById('test_body')) {
  document.getElementById('test_body').style.visibility='hidden';
 }
 if(document.getElementById('test_numbers')) {
  document.getElementById('test_numbers').innerHTML='Вопросы закончились. Результат теста Вы сможете узнать на следующем слайде';
 }
 if(document.getElementById('test_question')) {
  document.getElementById('test_question').innerHTML='';
 }
 toggleNext('on');
}
toggleTestFurther();

}


function initiateQBlock(base, maxq) {
 aicc = 1;
 parseclicks=1;
 qbnum=base;
 qbase=base;
 blockMaxQ=maxq;
 totalQ=base+maxq-1;
 toggleNext('off');
 togglePrev('off');
 initiateQBlockStage1();
}
var qbtimeout=0;
function initiateQBlockStage1() {
 if(!document.getElementById('qbbuttonfurther')) {
	clearTimeout(qbtimeout);
	qbtimeout=setTimeout("initiateQBlockStage1()",50);
 } else {
 	clearTimeout(qbtimeout);
 	initiateQBlockStage2();
 }
}

function initiateQBlockStage2() {
	clearBalloons();
	var tmpitem='';
	innerNum=qbnum-qbase+1;
	if(document.getElementById('curqnumber')) document.getElementById('curqnumber').innerHTML=innerNum;
	tmpitem="righttext"+innerNum;
	if(document.getElementById(tmpitem)) {
		document.getElementById('righttext').innerHTML=document.getElementById(tmpitem).innerHTML;
	}
	tmpitem="wrongtext"+innerNum;
	if(document.getElementById(tmpitem)) {
		document.getElementById('wrongtext').innerHTML=document.getElementById(tmpitem).innerHTML;
	}
	tmpitem="question"+innerNum;
	if(document.getElementById(tmpitem)) {
		document.getElementById('current_question').innerHTML=document.getElementById(tmpitem).innerHTML;
	}
	tmpitem="questiongoal"+innerNum;
	if(document.getElementById(tmpitem)) {
		document.getElementById('question_goal').innerHTML=document.getElementById(tmpitem).innerHTML;
		document.getElementById('question_goal').style.display='inline';
	} else {
		document.getElementById('question_goal').style.display='none';
	}
	tmpitem="choicesq"+innerNum;
	if(document.getElementById(tmpitem)) {
		curChoicesQB=parseInt(document.getElementById(tmpitem).innerText,10);
		maxIt=curChoicesQB;
		maxpoints=maxIt-1;
		attts=maxIt-1;
	}
	tmpitem="questionsize"+innerNum;
	if(document.getElementById(tmpitem)) {
		qsize=parseInt(document.getElementById(tmpitem).innerText,10);
	}
	tmpitem="afterlink"+innerNum;
	if(document.getElementById(tmpitem)) {
		afterlink=document.getElementById(tmpitem).innerHTML;
	}
	var tmpitem="logicq"+innerNum;
	tmpitem=document.getElementById(tmpitem).innerHTML;
	if(tmpitem=='select') {
		logic=1;
	} else {
		if(tmpitem=='range') {
			logic=2;
		} else {
			logic=0;
		}
	}
	var tmpitem2='';
	for(var i=1;i<=curChoicesQB;i++) {
		if(logic==2) {
			tmpitem="qr_item"+i;
			document.getElementById(tmpitem).style.display='inline';
			tmpitem="qrdiv"+i;
			tmpitem2="q_item"+innerNum+"_"+i;
			document.getElementById(tmpitem).innerHTML=document.getElementById(tmpitem2).innerHTML;
			qrange[i]=document.getElementById(tmpitem2).innerHTML;
			qrangebackup[i]=document.getElementById(tmpitem2).innerHTML;
			if(i==curChoicesQB) {
				tmpitem="downspan"+i;
				lastrangebackup=document.getElementById(tmpitem).innerHTML;
				document.getElementById(tmpitem).innerHTML=document.getElementById('downinactive').innerHTML;
			}
		} else {
			if(qsize==1) {
				tmpitem="qb_item"+i;
				document.getElementById(tmpitem).style.display='inline';
				tmpitem="qutext"+i;
				tmpitem2="q_item"+innerNum+"_"+i;
				document.getElementById(tmpitem).innerHTML=document.getElementById(tmpitem2).innerHTML;
			} else {
				tmpitem="qs_item"+i;
				document.getElementById(tmpitem).style.display='inline';
				tmpitem="qstext"+i;
				tmpitem2="q_item"+innerNum+"_"+i;
				document.getElementById(tmpitem).innerHTML=document.getElementById(tmpitem2).innerHTML;
			}
			state[i]=0;
			setEmpty(i);
		}
	}
	firstClick=false;
	gotAnswer=false;
	if(!q_attempts[qbnum] || q_attempts[qbnum].value=='reset') {
		if(!q_laststate[qbnum] || q_laststate[qbnum].value=='reset') {
			q_laststate[qbnum]=new Object; 
			q_laststate[qbnum].name=qbnum; 
			q_laststate[qbnum].value=''; 
			if(logic==2) {
				q_laststate[qbnum].value='/';
				for(var i=1;i<=curChoicesQB;i++) {
					q_laststate[qbnum].value=q_laststate[qbnum].value+i;
				}
			}
		}
		q_attempts[qbnum]=new Object; 
		q_attempts[qbnum].name=qbnum; 
		q_attempts[qbnum].value=''; 
		q_points[qbnum]=new Object; 
		q_points[qbnum].name=qbnum; 
		q_points[qbnum].value=0; 
		if(qbnum==qbase) document.getElementById('q_warning').style.display='inline';
	} else {
		if(q_points[qbnum] && !q_laststate[qbnum] && qErrorFlag) {
			q_laststate[qbnum] = new Object;
			q_laststate[qbnum].name = qbnum;
			q_laststate[qbnum].value = getAnswerString();
		}
		if(q_laststate[qbnum].value!='' && checkAnswered()) {
			showAnswers();
			toggleNext('on');
			togglePrev('on');
			parseclicks=0;
		} else {
			if(q_laststate[qbnum].value!='' && q_laststate[qbnum].value!='reset') { 
				nextQuestionQB();
			} else {
				if(qbnum!=qbase  && q_laststate[qbnum].value!='reset') alert('Вы ответили не на все вопросы этого блока. \nОтветьте, пожалуйста, на оставшиеся вопросы.');
			}
		}
		if(qbnum==qbase && checkAnswered()) { 
			if(repeatTest) {
				if(confirm('Вы уже отвечали на эти вопросы. \nВы можете ответить на них снова -\nдля этого нажмите OK, либо\nпросмотреть Ваши ответы - для этого\nнажмите Cancel.')) {
					resetQuestions();
					return false;
				}
			} else {
				alert('Вы уже отвечали на эти вопросы. \nВы можете только просмотреть\nправильные ответы.');
			}
		}
		tmpitem=parseInt(qbase,10)+parseInt(blockMaxQ,10)-1;
		if(qbnum>=tmpitem && checkAnswered()) {
			exitQB();
		} else {
			if(q_laststate[qbnum].value!='' && q_laststate[qbnum].value!='reset') toggleFurtherQB('on');
		}
	}
}

function resetQuestions() {
	for(var i=qbase;i<parseInt(qbase,10)+parseInt(blockMaxQ,10);i++) {
		if(q_laststate[i]) {
			q_laststate[i].value='reset';
			q_points[i].value=0;
			q_attempts[i].value='reset';
		} 
	}
	zPoints=0;
	for(var i=1;i<q_points.length;i++) {
		if(q_points[i]) zPoints=zPoints+parseInt(q_points[i].value,10);
	}
	curPoints=Math.round(zPoints/maxPoints*100);
	initiateQBlock(qbase,blockMaxQ);
	return false;
}

function checkAnswered() {
	for(var i=qbase;i<parseInt(qbase,10)+parseInt(blockMaxQ,10);i++) {
		if(!q_laststate[i]) {
			return false;
		} else {
			if(q_laststate[i].value=='') {
				return false;
			} else {
				if(q_laststate[i].value=='reset') {
					return false;
				}
			}
		}
	}
	return true;
}

function parseClickQB(it,qitemsize) {
if (parseclicks==1) {
	toggleCheckQB('on');
	clearBalloons();

	var tmpitem="choicesq"+innerNum;
	maxIt=parseInt(document.getElementById(tmpitem).innerText,10);
	if(!firstClick) {
		firstClick=true;
		maxpoints=maxIt-1;
		attts=maxIt-1;
	}
	if (logic==1) {
		if (cleanerr==1) {
			for (i=1; i<=maxIt; i++) {
				if (state[i]==2) {
					setEmpty(i);
				}
			}
		}
		if (state[it]==0 || state[it]=="") {
			setRight(it);
		} else {
			if (state[it]==1 || state[it]==2) {
				setEmpty(it);
			} else {
				setRight(it);
			}
		}
	} else {
		if (state[it]==0 || state[it]=="") {
			for (i=1; i<=maxIt; i++) {
				if (state[i]==1 || state[i]==2) {
					setEmpty(i);
				}
			}
			setRight(it);
		} else {
			if (state[it]==2) {
				for (i=1; i<=maxIt; i++) {
					if (state[i]==1 || state[i]==2) {
						setEmpty(i);
					}
				}
				setRight(it);
			}
		}
	}
	curAnswer="/";
	for (var i=1;i<=maxIt;i++) {
		curAnswer=curAnswer+state[i];
	}
}
}

function toggleCheckQB(sw) {
	if (sw=="off") {
		if (document.getElementById('qbbuttoncheck')) {
			document.getElementById('qbbuttoncheck').style.display='none';
		}
	} else {
		if (document.getElementById('qbbuttoncheck')) {
			document.getElementById('qbbuttoncheck').style.display='inline';
		}
	}
}
function toggleFurtherQB(sw) {
	if (sw=="off") {
		if (document.getElementById('qbbuttonfurther')) {
			document.getElementById('qbbuttonfurther').style.display='none';
		}
	} else {
		if (document.getElementById('qbbuttonfurther')) {
			document.getElementById('qbbuttonfurther').style.display='inline';
		}
	}
}

function getAnswerString() {
	var tmpitem="answersq"+innerNum;
	tmpitem=document.getElementById(tmpitem).innerHTML;
	return tmpitem;
}

function checkAnswerQB() {

	if(!gotAnswer) {
		var tmpitem="weightq"+innerNum;
		if(document.getElementById(tmpitem)) {
			var curWeight=parseInt(document.getElementById(tmpitem).innerText,10);
		} else {
			var curWeight=1;
		}
		var rightAnswer=getAnswerString();
		toggleCheckQB('off');
		if(logic==2) curAnswer=q_laststate[qbnum].value;
		if(curAnswer==rightAnswer) {
			gotAnswer=true;
			document.getElementById('rightballoon').style.visibility='visible';
		} else {
			gotAnswer=false;
			attts=attts-1;
			maxpoints=maxpoints-1;
			if(attts==0) {
				gotAnswer=true;
				showAnswers();
				if(curWeight!=0) {
					document.getElementById('byeballoon').style.visibility='visible';
				} else {
					if(document.getElementById('sorryballoon')) {
						document.getElementById('sorryballoon').style.visibility='visible';
						document.getElementById('rightballoon').style.visibility='visible';
					} else {
						document.getElementById('wrongballoon').style.visibility='visible';
					}
				}
			} else {
				document.getElementById('wrongballoon').style.visibility='visible';
			}
		}
		q_attempts[qbnum].value=attts;
		q_points[qbnum].value=parseInt(maxpoints,10)*parseInt(curWeight,10);
		if(logic!=2) {
			q_laststate[qbnum].value='/';
			for (var i=1; i<=maxIt; i++) {
				q_laststate[qbnum].value=q_laststate[qbnum].value+state[i];
			}
		}
	}
	if(gotAnswer) {
		zPoints=0;
		for(var i=1;i<q_points.length;i++) {
			if(q_points[i]) zPoints=zPoints+parseInt(q_points[i].value,10);
		}
		curPoints=Math.round(zPoints/maxPoints*100);
		tmpitem=parseInt(qbase,10)+parseInt(blockMaxQ,10)-1;
		if(qbnum>=tmpitem) {
			exitQB();
		} else {
			toggleFurtherQB('on');
			parseclicks=0;
		}
	}
}

function showAnswers() {
	var tmpstring=getAnswerString();
	parseclicks=0;
	if(logic!=2) {
		for(var i=1; i<=curChoicesQB; i++) {
			setEmpty(i);
			if(tmpstring.charAt(i)=='1') setRight(i);
		}
	} else {
		var tmpitem='';
		for(var i=1;i<=curChoicesQB; i++) {
			tmpitem="qrdiv"+i;
			document.getElementById(tmpitem).innerHTML=qrangebackup[parseInt(tmpstring.charAt(i),10)];
		}
	}
}

function nextQuestionQB() {

	for(var i=1;i<=curChoicesQB;i++) {
		tmpitem="qb_item"+i;
		if(document.getElementById(tmpitem)) document.getElementById(tmpitem).style.display='none';
		tmpitem="qs_item"+i;
		if(document.getElementById(tmpitem)) document.getElementById(tmpitem).style.display='none';
		tmpitem="qr_item"+i;
		if(document.getElementById(tmpitem)) document.getElementById(tmpitem).style.display='none';
		state[i]=0;
		qrange[i]='';
		if(i==curChoicesQB && logic==2) {
			tmpitem="downspan"+i;
			if(document.getElementById(tmpitem)) document.getElementById(tmpitem).innerHTML=lastrangebackup;
		}
	}
	qbnum++;
	toggleFurtherQB('off');
	parseclicks=1;
	if(afterlink!='') {
		processEvent(afterlink);
		window.event.cancelBubble=false;
	}
	initiateQBlockStage2();

}

function exitQB() {
	toggleNext('on');
	togglePrev('on');
	parseclicks=0;
	document.getElementById('goballoon').style.visibility='visible';
}

function qWarningClose() {
	document.getElementById('q_warning').style.display='none';
}

function parseRangeUpQB(n) {

if (stoprange == 0 && parseclicks==1) {
toggleCheckQB('on');
clearBalloons();
	var tmpitem="choicesq"+innerNum;
	maxIt=parseInt(document.getElementById(tmpitem).innerText,10);
	if(!firstClick) {
		firstClick=true;
		maxpoints=maxIt-1;
		attts=maxIt-1;
	}
	var div_id0 = 'qrdiv' + n;
	var m = n-1;
	var div_id1 = 'qrdiv' + m;
	document.getElementById(div_id0).innerHTML=qrange[m];
	document.getElementById(div_id1).innerHTML=qrange[n];
	var rtmp=q_laststate[qbnum].value.split('');
	var rtz1=rtmp[n];
	rtmp[n]=rtmp[m];
	rtmp[m]=rtz1;
	q_laststate[qbnum].value='';
	for(var i=0;i<rtmp.length;i++) {
		q_laststate[qbnum].value=q_laststate[qbnum].value+rtmp[i];
	}
	var tmpstring=qrange[m];
	qrange[m] = qrange[n];
	qrange[n] = tmpstring;
}
//alert(q_laststate[qbnum].value);
}

function parseRangeDownQB(n) {

if (stoprange == 0 && parseclicks==1) {
clearBalloons();
	var tmpitem="choicesq"+innerNum;
	maxIt=parseInt(document.getElementById(tmpitem).innerText,10);
	if(!firstClick) {
		firstClick=true;
		maxpoints=maxIt-1;
		attts=maxIt-1;
	}
	toggleCheckQB('on');
	var div_id0 = 'qrdiv' + n;
	var m = n+1;
	var div_id1 = 'qrdiv' + m;
	document.getElementById(div_id0).innerHTML=qrange[m];
	document.getElementById(div_id1).innerHTML=qrange[n];
	var rtmp=q_laststate[qbnum].value.split('');
	var rtz1=rtmp[n];
	rtmp[n]=rtmp[m];
	rtmp[m]=rtz1;
	q_laststate[qbnum].value='';
	for(var i=0;i<rtmp.length;i++) {
		q_laststate[qbnum].value=q_laststate[qbnum].value+rtmp[i];
	}
	var tmpstring=qrange[m];
	qrange[m] = qrange[n];
	qrange[n] = tmpstring;
}
//alert(q_laststate[qbnum].value);
}

function startSimpleTest(argobj) {

var ztmp=argobj.attrs['test_id'];
var q_revert=new Array(0);
if(argobj.attrs['revert'])	var q_revert=argobj.attrs['revert'].split("/");

if(argobj.attrs['next'] && argobj.attrs['next']=='ignore') {
 	var qt_next='ignore';
} else {
	var qt_next='off';
}

	if(!t_results[ztmp]) {
		if(t_results[ztmp]==0) {
//			if(confirm('Вы уже проходили этот тест и не \nнабрали в нем ни одного балла.\n Если Вы хотите пройти его заново -\n нажмите OK, если хотите сохранить \nстарые результаты - Cancel')) {
			if(t_points) {
				t_points=null;
				t_points=new Array(0);
			}
				initiateTest(argobj.attrs['test_id'], argobj.attrs['maxchoices'], argobj.attrs['maxquestions'], qt_next);
				for(var i=0;i<q_revert.length;i++) {
					setCounting(q_revert[i],'revert');
				}
//			} else {
//				document.getElementById('test_res').innerHTML='';
//				document.getElementById('test_question').innerHTML='Вы уже проходили этот тест';
//				return false;
//			}
		} else {
			if(t_points) {
				t_points=null;
				t_points=new Array(0);
			}
			initiateTest(argobj.attrs['test_id'], argobj.attrs['maxchoices'], argobj.attrs['maxquestions'], qt_next);
			for(var i=0;i<q_revert.length;i++) {
				setCounting(q_revert[i],'revert');
			}
		}
	} else {
		if(confirm('Вы уже проходили этот тест.\n Если Вы хотите пройти его заново -\n нажмите OK, если хотите сохранить \nстарые результаты - Cancel')) {
			initiateTest(argobj.attrs['test_id'], argobj.attrs['maxchoices'], argobj.attrs['maxquestions'], qt_next);
			for(var i=0;i<q_revert.length;i++) {
				setCounting(q_revert[i],'revert');
			}
			if(parseInt(argobj.attrs['test_id'],10)==3) {
				q3=null;
				q3=new Array(0);
			}
			if(parseInt(argobj.attrs['test_id'],10)==4) {
				q4=null;
				q4=new Array(0);
			}
		} else {
			document.getElementById('test_res').innerHTML='';
			document.getElementById('test_question').innerHTML='Вы уже проходили этот тест';
//			return false;
		}
	}
}

function startComplexTest(argobj) {
var ztmp=argobj.attrs['test_id'];
if(argobj.attrs['next'] && argobj.attrs['next']=='ignore') {
 	var qt_next='ignore';
} else {
	var qt_next='off';
}
if(argobj.attrs['scales']) {
	doScale=true;
	numScales=parseInt(argobj.attrs['scales'],10);
} else {
	doScale=false;
	numScales=0;
}
	if(!t_results[ztmp]) {
		if(t_results[ztmp]==0) {
				if(t_points) {
					t_points=null;
					t_points=new Array(0);
				}
				initiateTestComplex(argobj.attrs['test_id'], argobj.attrs['maxchoices'], argobj.attrs['choices'], argobj.attrs['maxquestions'], qt_next);
		} else {
			if(t_points) {
				t_points=null;
				t_points=new Array(0);
			}
			initiateTestComplex(argobj.attrs['test_id'], argobj.attrs['maxchoices'], argobj.attrs['choices'], argobj.attrs['maxquestions'], qt_next);
		}
	} else {
		if(confirm('Вы уже проходили этот тест.\n Если Вы хотите пройти его заново -\n нажмите OK, если хотите сохранить \nстарые результаты - Cancel')) {
			initiateTestComplex(argobj.attrs['test_id'], argobj.attrs['maxchoices'], argobj.attrs['choices'], argobj.attrs['maxquestions'], qt_next);
			if(parseInt(argobj.attrs['test_id'],10)==3) {
				q3=null;
				q3=new Array(0);
			}
			if(parseInt(argobj.attrs['test_id'],10)==4) {
				q4=null;
				q4=new Array(0);
			}
		} else {
			document.getElementById('test_res').innerHTML='';
			document.getElementById('test_question').innerHTML='Вы уже проходили этот тест';
			return false;
		}
	}
}

function copyTestResults(argobj,id) {
var tmp_id=parseInt(id,10);
var reloadQarray=false;
if(parseInt(t_results[tmp_id],10)!=0 && t_results[tmp_id]!='undefined' && t_results[tmp_id]!='NaN') {
	if(tmp_id==3) {
		for(var i=1;i<=argobj.attrs['maxquestions'];i++) {
			if(t_points[i] && parseInt(q3[i],10)!=t_points[i]) reloadQarray=true;
		}
		if(reloadQarray) {
			for(var i=1;i<=argobj.attrs['maxquestions'];i++) {
				q3[i]=t_points[i];
			}
		}
	}
	if(tmp_id==4) {
		for(var i=1;i<=argobj.attrs['maxquestions'];i++) {
			if(t_points[i] && parseInt(q4[i],10)!=t_points[i]) reloadQarray=true;
		}
		if(reloadQarray) {
			for(var i=1;i<=argobj.attrs['maxquestions'];i++) {
				q4[i]=t_points[i];
			}
		}
	}
}
}

function newDocWindow(url) {
	try {
		if(baseURL && baseURL!=null) {
			if(baseURL!='') {
				var jumpURL=baseURL+"/"+url;
			} else {
				var jumpURL=url;
			}
		} else {
		var jumpURL=url;
		}
	} catch(x) {
		var jumpURL=url;
	}
	name = window.open(jumpURL, 'wtdocument', 'toolbar=yes,location=no,status=yes,menubar=yes,resizable=yes,directories=no,scrollbars=yes');
	return false;
}


var AICCenvironment=false;
var AICClastslide=false;

function checkBrowser(){
 this.ver=navigator.appVersion
 this.dom=document.getElementById?1:0
 this.ie5=(this.ver.indexOf("MSIE 5")>-1 && this.dom)?1:0;
 this.ie4=(document.all && !this.dom)?1:0;
 this.ns5=(this.dom && parseInt(this.ver,10) >= 5) ?1:0;
 this.ns4=(document.layers && !this.dom)?1:0;
 this.bw=(this.ie5 || this.ie4 || this.ns4 || this.ns5)
 return this
}

bw=new checkBrowser()
var lMove=20;
var lSpeed=2;
var lMoveOnScroll=true;
var lShow=0;

var tim,ltop;

function makeMenu(obj,nest,show,move,speed){
    nest=(!nest) ? '':'document.'+nest+'.'
 this.el=bw.dom?document.getElementById(obj):bw.ie4?document.all[obj]:bw.ns4?eval(nest+'document.'+obj):0;
   this.css=bw.dom?document.getElementById(obj).style:bw.ie4?document.all[obj].style:bw.ns4?eval(nest+'document.'+obj):0;  
 this.x=(bw.ns4 || bw.ns5)? this.css.left:this.el.offsetLeft;
 this.y=(bw.ns4 || bw.ns5)? this.css.top:this.el.offsetTop;  
 this.state=1; this.go=0; this.min=b_min; this.show=show
 this.top=this.y; this.mout=b_mout; 
 this.width=bw.ns4?this.css.document.width:this.el.offsetWidth
 this.moveIt=b_moveIt; this.move=move; this.speed=speed
    this.obj = obj + "Object";  eval(this.obj + "=this") 
}

function b_moveIt(x,y){this.x=x; this.y=y; this.css.left=this.x; this.css.top=this.y}

function b_min(){
 if(this.x>-this.width+this.show){
  this.go=1; this.moveIt(this.x-this.move,this.y)
  setTimeout(this.obj+".min()",this.speed)
 }else{this.go=0; this.state=1} 
}

function b_mout(){
 if(this.x<0){
  this.go=1; this.moveIt(this.x+this.move,this.y)
  setTimeout(this.obj+".mout()",this.speed)
 }else{this.go=0; this.state=0} 
}

function moveLeftMenu(num){
	if(!oMenu[num].go){
		if(!oMenu[num].state) {
			oMenu[num].min();
			if(document.getElementById('flashOut')) document.getElementById('flashOut').style.visibility='hidden';
			if(document.getElementById('wsFlashPlayer')) document.getElementById('wsFlashPlayer').style.visibility='visible';
		} else {
			oMenu[num].mout();
			if(document.getElementById('flashOut')) document.getElementById('flashOut').style.visibility='visible';
			if(document.getElementById('wsFlashPlayer')) document.getElementById('wsFlashPlayer').style.visibility='hidden';
		}
	}
}

function checkScrolled(){
 for(i=0;i<oMenu.length;i++){
  if(!oMenu[i].go) oMenu[i].moveIt(oMenu[i].x,eval(scrolled)+oMenu[i].top)
 }
 if(bw.ns4) setTimeout('checkScrolled()',40)
}

function leftMenuInit(){
 oMenu=new Array()
 oMenu[0]=new makeMenu('contents','',lShow,lMove,lSpeed) 
 oMenu[1]=new makeMenu('help','',lShow,lMove,lSpeed) 
 oMenu[2]=new makeMenu('calc','',lShow,lMove,lSpeed) 
 oMenu[3]=new makeMenu('settings','',lShow,lMove,lSpeed) 
 oMenu[4]=new makeMenu('about','',lShow,lMove,lSpeed) 
 
 scrolled=bw.ns4?"window.pageYOffset":"document.body.scrollTop"

 for(i=0;i<oMenu.length;i++){
  oMenu[i].moveIt(-oMenu[i].width+oMenu[i].show,oMenu[i].y)
  oMenu[i].css.visibility='visible'
 }
 if(lMoveOnScroll) bw.ns4?checkScrolled():window.onscroll=checkScrolled;
}


var Memory = 0;
var Number1 = "";
var Number2 = "";
var NeuNumber = "blank";
var opvalue = "";

function Display(displaynumber) {
document.calculator.answer.value = displaynumber;
}

function MemoryClear() {
Memory = 0;
document.calculator.mem.value = "";
}

function MemoryRecall(answer) {
if(NeuNumber != "blank") {
Number2 += answer;
} else {
Number1 = answer;
}
NeuNumber = "blank";
Display(answer);
}

function MemorySubtract(answer) {
Memory = Memory - eval(answer);
}

function MemoryAdd(answer) {
Memory = Memory + eval(answer);
document.calculator.mem.value = " M ";
NeuNumber = "blank";
}

function ClearCalc() {
Number1 = "";
Number2 = "";
NeuNumber = "blank";
Display("");
}

function Backspace(answer) {
answerlength = answer.length;
answer = answer.substring(0, answerlength - 1);
if (Number2 != "") {
Number2 = answer.toString();
Display(Number2);
} else {
Number1 = answer.toString();
Display(Number1);
   }
}

function CECalc() {
Number2 = "";
NeuNumber = "yes";
Display("");
}

function CheckNumber(answer) {
if(answer == ".") {
 RNumber = document.calculator.answer.value;
 if(RNumber.indexOf(".") != -1) {
  answer = "";
 }
}
if(NeuNumber == "yes") {
 Number2 += answer;
 Display(Number2);
} else {
 if(NeuNumber == "blank") {
  Number1 = answer;
  Number2 = "";
  NeuNumber = "no";
 } else {
  Number1 += answer;
 }
 Display(Number1);
}
}

function AddButton(xx) {
if(xx == 1) EqualButton();
if(Number2 != "") {
Number1 = parseFloat(Number1) + parseFloat(Number2);
}
NeuNumber = "yes";
opvalue = '+';
Display(Number1);
}
function SubButton(xx) {
if(xx == 1) EqualButton();
if(Number2 != "") {
Number1 = parseFloat(Number1) - parseFloat(Number2);
}
NeuNumber = "yes";
opvalue = '-';
Display(Number1);
}
function MultButton(xx) {
if(xx == 1) EqualButton();
if(Number2 != "") {
Number1 = parseFloat(Number1) * parseFloat(Number2);
}
NeuNumber = "yes";
opvalue = '*';
Display(Number1);
}
function DivButton(xx) {
if(xx == 1) EqualButton();
if(Number2 != "") {
Number1 = parseFloat(Number1) / parseFloat(Number2);
}
NeuNumber = "yes";
opvalue = '/';
Display(Number1);
}
function PowButton(xx) {
if(xx == 1) EqualButton();
if(Number2 != "") {
Number1 = Math.pow(parseFloat(Number1), parseFloat(Number2));
}
NeuNumber = "yes";
opvalue = '^';
Display(Number1);
}

function SqrtButton() {
Number1 = Math.sqrt(Number1);
NeuNumber = "blank";
Display(Number1);
}
function PercentButton() {
if(NeuNumber != "blank") {
Number2 *= .01;
NeuNumber = "blank";
Display(Number2);
   }
}
function RecipButton() {
Number1 = 1/Number1;
NeuNumber = "blank";
Display(Number1);
}
function NegateButton() {
Number1 = parseFloat(-Number1);
NeuNumber = "no";
Display(Number1);
}
function EqualButton() {
if(opvalue == '+') AddButton(0);
if(opvalue == '-') SubButton(0);
if(opvalue == '*') MultButton(0);
if(opvalue == '/') DivButton(0);
if(opvalue == '^') PowButton(0);
Number2 = "";
opvalue = "";
}


function num_format(x) { // format numbers with two digits
 sgn = (x < 0);
 x = Math.abs(x);
 x = Math.floor((x * 100) + .5);
 j = 3;
 y = "";
 while(((j--) > 0) || (x > 0)) {
  y = (x % 10) + y;
  x = Math.floor(x / 10);
  if(j == 1) {
   y = "." + y;
  }
 }
 if(sgn) {
  y = "-" + y;
 }
 return(y);
}

function num_format12(x) { // format numbers to twelve decimals
 sgn = (x < 0);
 x = Math.abs(x);
 x = Math.floor((x * 1000000000000) + .5);
 j = 13;
 y = "";
 while(((j--) > 0) || (x > 0)) {
  y = (x % 10) + y;
  x = Math.floor(x / 10);
  if(j == 1) {
   y = "." + y;
  }
 }
 if(sgn) {
  y = "-" + y;
 }
 return(y);
}

function years(x) {
 
 n = parseFloat(x.n.value);
 p = parseFloat(x.p.value);
 n = n*p;
 x.n.value = num_format(n);
}

function comp(x,v) { 

 pv = parseFloat(x.pv.value);       //Present Value Input
 fv = parseFloat(x.fv.value);       //Future Value Input
 n = parseFloat(x.n.value);         //Number of Compounding periods
 pmt = parseFloat(x.pmt.value);     //Payment Input
 c = parseFloat(x.c.value);         //Compounding periods per year 
 p = parseFloat(x.p.value);    //Periods per Year 
 r = parseFloat(x.r.value);    //Interest per Year
 kk = parseInt(x.kk.value,10);            //kk=0 for end of period  
  
 var z = (r * .01)/c;
 var y = c/p;
 var i = (Math.exp(y*Math.log(z+1))-1);
 if ((kk==0)||(kk==1)) {
  var g=1+i*kk;
 } else {  
  var g=1;
 } 

  // test and compute all cases
  
  if (v == 'pv') {
   if ((fv==0)&&(pmt==0))
    {alert("One or more of the required values is missing!");
    return;
   }   
   if (i == 0){
    pv = -(fv + pmt * n);
    x.pv.value = num_format(pv);
   } else {
    q = Math.pow(1+i,-n);
    t = (pmt*g)/i;  
    pv = ( t-fv)*q-t;
    x.pv.value = num_format(pv);
   }
  }
  
  if (v == 'fv') {
   if ((pv==0)&&(pmt==0))
    {alert("One or more of the required values is missing!");
    return;
   }  
   if (i == 0) {
    fv = -(pv + pmt * n);
    x.fv.value = num_format(fv);
   } else {
    q = Math.pow(1+i,n);
    t = (pmt*g)/i;
    fv = t-q*(pv+t);
    x.fv.value = num_format(fv);
   }
  }
  
  if (v == 'n') {
   if ((fv==0)&&(pv==0))
    {alert("One or more of the required values is missing!");
    return;
   }     
   if (i == 0) {
    n = -(pv + fv)/ pmt;
    x.n.value = num_format(n);
   } else {
    n = (Math.log((pmt*g-fv*i)/(pmt*g+pv*i)))/ Math.log(1 + i);
    x.n.value = num_format(n);
   }
  }
  
  if (v == 'pmt') {
   if ((fv==0)&&(pv==0))
    {alert("One or more of the required values is missing!");
    return;
   }
   if(i == 0){
    q = Math.pow(1+i,n);
    pmt = -(pv + fv)/n;
    x.pmt.value = num_format(pmt);
   } else {
    q = Math.pow(1+i,n);
    pmt = -i/g*(pv+((pv+fv)/(q-1)))
    x.pmt.value = num_format(pmt);
   }
  }

  if(v == 'r') {
   if ((fv==0)&&(pv==0))
    {alert("One or more of the required values is missing!");
    return;
   }  
   if(pmt ==0) {
    i=Math.pow((-fv/pv),(1/n))-1;
   } else {
    r=0;
    i=.00001;
    while ((pv+pmt*(1+i*kk)*((1-Math.pow(1+i,-n))/i)+fv*Math.pow(1+i,-n))>0) {
     i=i+.00001;
    }
   }
   z = i;
   y = p/c;
   r = 100*c*(Math.exp(y*Math.log(z+1))-1);
   x.r.value = num_format(r);
  }


}


function amort(x) {

 pv = parseFloat(x.pv.value);        //Present Value Input
 fv = parseFloat(x.fv.value);        //Future Value Input
 n = parseFloat(x.n.value);          //Number of Compounding periods
 pmt= parseFloat(x.pmt.value);       //Payment Input
 c = parseFloat(x.c.value);          //Compounding periods per year 
 p = parseFloat(x.p.value);     //Periods per Year 
 r = parseFloat(x.r.value);     //Interest per Year
 kk = parseInt(x.kk.value,10);     //k=0 for end k=1 for begin  
  p1 = parseInt(x.p1.value,10);     // 
 p2 = parseInt(x.p2.value,10);
 bal = parseFloat(x.bal.value);
 prin = parseFloat(x.prin.value);
 nt = parseFloat(x.nt.value);

 var z = (r * .01)/c;
 var y = c/p;
 var i = (Math.exp(y*Math.log(z+1))-1);
 if ((kk==0)||(kk==1)) {
  var g=1+i*kk;
 } else {
  var g=1;
 }
 var l = n-(p2-p1+1);
 var q = (1-Math.pow(1+i,-l))/i;
 if (pmt == 0) {
  alert("You must compute the payment first!");
 } else {
  bal = -pmt*g*q;
  bal = num_format12(bal);
  x.bal.value = num_format(bal);
  nt = -pmt*(p2-p1+1)-(pv-bal);
  nt = num_format12(nt);
  x.nt.value = num_format(nt);
  prin =pv-bal;
  prin = num_format12(prin);
  x.prin.value = num_format(prin);
 }
}

function checkVisited(taskRef) {
 for(var i=0;i<q_visited.length;i++) {
  if(q_visited[i].name==taskRef) {
   if(q_visited[i].value==1) {
    return true;
   } else {
    return false;
   }
  }
 }
}

function rewindSound() {
	if(FPlayer1!=null) {
		if(FPlayer1.object!=null) {
			try {
				FPlayer1.object.Stop();
				FPlayer1.object.Rewind();
			} catch(x) {}
		} else {
			try {
				FPlayer1.Stop();
				FPlayer1.Rewind();
			} catch(x) {}
		}
	}
}

function startPreviousSound(trigger) {
var tmp=trigger;
	if(FPlayer1!=null) {
		if(tmp==1 && mvars.soundstart==true) {
			if(FPlayer1.object!=null) {
				try {
					FPlayer1.object.Movie = prevSoundFile;
					FPlayer1.object.Play();
				} catch(x) {}
			} else {
				try {
					FPlayer1.Movie = prevSoundFile;
					FPlayer1.Play();
				} catch(x) {}
			}
		}
	}
}

function wsPlay() {
	if(document.getElementById('wsMovie')) {
		wsMovie.object.Play();
	}
}

function wsStop() {
	if(document.getElementById('wsMovie')) {
		wsMovie.object.Stop();
		wsMovie.object.Rewind();
	}
}

function setSoundPreferences() {
	if(soundExist) {
		var spbox=document.getElementById('soundPrefCheckbox');
		var spOff=document.getElementById('soundOffSpan');
		var spOn=document.getElementById('soundOnSpan');
		var spEmpty=document.getElementById('soundSpan');
		var spCheck=document.getElementById('soundPrefCheck');
		if(soundFlag) {
			if(!document.getElementById('calc')) {
				if(spEmpty && spOn) spEmpty.innerHTML=spOn.innerHTML;
			} else {
				if(spEmpty) spEmpty.style.display='none';
				if(spOff) spOff.style.display='none';
				if(spOn) spOn.style.display='inline';
			}
			if(spbox) {
				spbox.checked=true;
			} else {
				if(spCheck) spCheck.src=check_small_yes.src;
			}
		} else {
			if(!document.getElementById('calc')) {
				if(spEmpty && spOff) spEmpty.innerHTML=spOff.innerHTML;
			} else {
				if(spEmpty) spEmpty.style.display='none';
				if(spOn) spOn.style.display='none';
				if(spOff) spOff.style.display='inline';
			}
			if(spbox) {
				spbox.checked=false;
			} else {
				if(spCheck) spCheck.src=check_small_no.src;
			}
		}
	}
}

function toggleSound() {
	if(soundFlag) {
		rewindSound();
		soundFlag=false;
		setSoundPreferences();
	} else {
		soundFlag=true;
		setSoundPreferences();
	}
}


function TaskCounterEngine(argobj) {
	tasks=argobj.task.ownerDocument.selectNodes('.//TASK');
	subtasks=argobj.task.ownerDocument.selectNodes('.//SUBTASK');
	taskCount=tasks.length+subtasks.length;
	if(document.getElementById('task_counter')) {
		document.getElementById('task_counter').innerHTML=taskCount;
	}
}

function SwitchNavigationEngine(argobj) {
	togglePrev('on');
	toggleNext('on');
	toggleSelector('on');
	AICClastslide=false;
	var cur_id=argobj.task.getAttribute("id");
	if (argobj.task.nodeName=="SUBTASK") cur_id=argobj.task.parentNode.getAttribute("id");
	var i=0;
	var selobj=def(document.all[def(argobj.attrs['selector'],"selector")],null);
	if(selobj)
	{
	for(i=0;i<selobj.options.length;i++)
		if (cur_id==selobj.options[i].value) 
			{
			selobj.selectedIndex=i;			
			break;
			}
	}
	var spanobj=def(document.all[def(argobj.attrs['spanner'],"selector")],null);
	if(spanobj) 
	{
		spanobj.innerHTML=argobj.task.getAttribute("position");
	}
	spanobj=def(document.getElementById('task_counter'),null);
	if(spanobj) {
		spanobj.innerHTML=taskCount;
	}
}

function checkCompleted(checkrange) {
	for(var i=1;i<=checkrange;i++) {
		if(!q_laststate[i] || q_laststate[i].value=='' || q_laststate[i].value=='NaN') return 0;
	}
	return 1;
}

//+++++++++++++++++++++++++++2.06.2004
dnd_right0 = new Image(50,40);
dnd_right0.src = "../../systemimages/dnd_right0.gif";
dnd_right1 = new Image(50,40);
dnd_right1.src = "../../systemimages/dnd_right1.gif";
dnd_left0 = new Image(50,40);
dnd_left0.src = "../../systemimages/dnd_left0.gif";
dnd_left1 = new Image(50,40);
dnd_left1.src = "../../systemimages/dnd_left1.gif";

var curTargetTop=0;
var curTargetRight=0;
var curTargetNum;
var curDropNum;
var dnd_pairs = new Array(0);
var dnd_tmp = new Array(0);
var dnd_order = new Array(0);
var dndEnable=false;
for(var i=0;i<=8;i++) {
	dnd_pairs[i]=0;
	dnd_tmp[i]=0;
}


function doOverTarget(num) {
if(!dndEnable) return false;
	var curDrop = elDragged.id.charAt(4);

	if(dnd_pairs[num]==0) {
		document.getElementById('dnd_l_'+num).src = eval("dnd_left1.src");
		document.getElementById('dnd_r_'+curDrop).src = eval("dnd_right1.src");	
		dnd_pairs[num]=curDrop;
	}
}

function doOutTarget(num) {
if(!dndEnable) return false;
	var curDrop = elDragged.id.charAt(4);
	if(dnd_pairs[num]==curDrop) {
		document.getElementById('dnd_l_'+num).src = eval("dnd_left0.src");
		document.getElementById('dnd_r_'+dnd_pairs[num]).src = eval("dnd_right0.src");
		dnd_pairs[num]=0;
	}
cleanUpPlugs();
}

function alignElements(num) {
if(!dndEnable) return false;
		var curDrop = elDragged.id.charAt(4);
 		if(dnd_pairs[num]==curDrop) {
			elDragged.style.pixelTop = document.getElementById(curTargetNum).style.pixelTop;
			elDragged.style.pixelLeft = document.getElementById(curTargetNum).style.pixelLeft + document.getElementById(curTargetNum).offsetWidth - 50;
			for(var i=1;i<=maxIt;i++) {
				if(dnd_pairs[i]==curDrop) {
					dnd_pairs[i]=0;
				}
			}
			dnd_pairs[num]=curDrop;
	  	}

	if(cleanUpPlugs()) {
		checkPlugs();
	} else {
		uncheckPlugs();
	}
}
	  
function cleanUpPlugs() {
	for(var i=1;i<=maxIt;i++) dnd_tmp[i]=0;
	var dnd_allPlugged=true;
	for(var i=1;i<=maxIt;i++) {
		if(dnd_pairs[i]==0) {
			document.getElementById('dnd_l_'+i).src = eval("dnd_left0.src");
			dnd_allPlugged=false;
		} else {
			document.getElementById('dnd_l_'+i).src = eval("dnd_left1.src");
			dnd_tmp[dnd_pairs[i]]=1;
		}
	}
	for(var i=1;i<=maxIt;i++) {
		if(dnd_tmp[i]==0) {
			document.getElementById('dnd_r_'+i).src = eval("dnd_right0.src");
			document.getElementById('drop'+i).style.zIndex=2;
		} else {
			document.getElementById('dnd_r_'+i).src = eval("dnd_right1.src");
			document.getElementById('drop'+i).style.zIndex=1;
		}
	}
	clearBalloons();
	document.getElementById('dnd_check').style.visibility='hidden';
	return dnd_allPlugged;
}

function checkPlugs() {
	document.getElementById('dnd_check').style.visibility='visible';
	document.getElementById('dnd_check').style.zIndex=5;
}

function uncheckPlugs() {
	document.getElementById('dnd_check').style.visibility='hidden';
}


var elDragged = null  // Track drag-source in global variable.

function testOver(iLeft, iTop) {
        // Test if the element is over a valid drop-target
        var hit = false;
		var xoffset=0;
		var yoffset=0;
        if (elDragged.getAttribute("dropTarget")!=null) {	
          for (var intLoop=0; intLoop<elDragged._targets.length; intLoop++) {
            // Check all drop-targets

            var el = elDragged._elTargets[intLoop];
            if (null!=el) {   
				xoffset=10;
				yoffset=10;
              if ((iTop+elDragged.offsetHeight - yoffset > el._top) && (iLeft > el._left) && (iLeft+xoffset < el.offsetWidth+el._left) && (iTop+yoffset < el.offsetHeight+el._top)) {
                  elDragged.overTarget = el;
				  curTargetTop=el.style.pixelTop;
				  curTargetRight= el.style.pixelLeft + el.offsetWidth - 50;
				  curTargetNum=el.id;
				  curDropNum=elDragged.id;
                  var hit=true;
                  elDragged._over[intLoop] = true;
                  // Fire events when over
                  if (event.type=="mouseup") {
                    if (el.getAttribute("onDropTarget")!=null) {
                       eval(el.getAttribute("onDropTarget"));
					}
                  } else {
                    if (el.getAttribute("onOverTarget")!=null) {
                      eval(el.getAttribute("onOverTarget"));
					}
                  }
                }
              else {
                // Fire event when leaving
                if ((el.getAttribute("onOutTarget")!=null) && (elDragged._over[intLoop])) {
                    elDragged.overTarget= el;
                    eval(el.getAttribute("onOutTarget"));
                }
                elDragged._over[intLoop] = false;
              }
            }

          }
        }
        return hit;
}

function doMouseUp() {

	if (elDragged!=null) {
		if (testOver(elDragged._left, elDragged._top)) {
			// Fire event on drag-source if dropped on target
			if (elDragged.getAttribute("onTarget")) {
				eval(elDragged.getAttribute("onTarget"));
			}
          	} else {
            		if (elDragged.getAttribute("onNoTarget")) {
            			eval(elDragged.getAttribute("onNoTarget"));
			}
		}
          	// Reset global variable
          	elDragged=null;
	}
	gTimer=setTimeout("sendMessage(0)",PROGRAM_TICK);
}

function doMouseMove() {
        // Check if mouse button is down and if an element is being dragged
        if ((1 == event.button) && (elDragged != null)) {
          // Set new position
//	   event.cancelBubble=true;
          var intTop = event.clientY+document.body.scrollTop; 
          var intLeft = event.clientX + document.body.scrollLeft;
          elDragged.style.pixelTop = intTop  - elDragged._lessTop - elDragged.y;
          elDragged.style.pixelLeft = intLeft - elDragged._lessLeft - elDragged.x;
          // Cache updated info
          elDragged._left = elDragged._lessLeft + elDragged.offsetLeft + document.body.scrollLeft;
          elDragged._top = elDragged.offsetTop+ elDragged._lessTop +document.body.scrollTop;
          // Test if over target
          testOver(elDragged._left, elDragged._top);
          event.returnValue = false;
        }
}

function checkDrag(elCheck) {
        // Check if the clicked inside an element that supports dragging
        // This allows rich HTML in drag-source
        while (elCheck!=null) {
          if (null!=elCheck.getAttribute("dragEnabled")) 
            return elCheck
          elCheck = elCheck.parentElement
        }      
        return null
}

function doMouseDown() {
        // On the mouse down, test if element can be dragged
clearTimeout(gTimer);
        var elCurrent = checkDrag(event.srcElement);
        // For draggable elements, cache all calculations up front. This is for performance.
        if (null!=elCurrent) {
//	     event.cancelBubble=true;
            elDragged = elCurrent;
		if(elDragged.style.zIndex!=4) elDragged.style.zIndex=4;
		// Determine where the mouse is in the element
            elDragged.x = event.offsetX;
            elDragged.y = event.offsetY;
            // Make sure we are using pixel units everywhere
            elDragged.style.top = elDragged.offsetTop + "px";
            elDragged.style.left = elDragged.offsetLeft + "px";
            var op = event.srcElement;
            // Find real location in respect to element being dragged.
            if ((elDragged!=op.offsetParent) && (elDragged!=event.srcElement)) {
              while (op!=elDragged) {
                elDragged.x+=op.offsetLeft;
                elDragged.y+=op.offsetTop;
                op=op.offsetParent;
              }
            }

          // Move the element
          // Where the mouse is in the document
          // Calculate what element the mouse is really in
          var intLessTop  = 0; var intLessLeft = 0;
          var elCurrent = elDragged.offsetParent;
          while (elCurrent.offsetParent!=null) {
            intLessTop+=elCurrent.offsetTop;
            intLessLeft+=elCurrent.offsetLeft;
            elCurrent = elCurrent.offsetParent;
          }
          elDragged._lessTop = intLessTop;
          elDragged._lessLeft = intLessLeft;
          // Calculate and cache target information
          if (null!=elDragged.getAttribute("dropTarget")) { 
            elDragged._targets = elDragged.getAttribute("dropTarget").split(",");
            elDragged._over = new Array;
            elDragged._elTargets = new Array;
            for (var intLoop=0; intLoop < elDragged._targets.length; intLoop++) {
              var el = document.all[elDragged._targets[intLoop]]
              if (null!=el) {
                elDragged._elTargets[intLoop]= el;
                var intLessTop  = el.offsetTop; var intLessLeft = el.offsetLeft;
                var elCurrent = el.offsetParent;
                var intTop = document.body.scrollTop; 
                var intLeft =  document.body.scrollLeft;
                while (elCurrent.offsetParent!=null) {
                  intLessTop+=elCurrent.offsetTop;
                  intLessLeft+=elCurrent.offsetLeft;
                  elCurrent = elCurrent.offsetParent;
                }
                el._top = intLessTop  + intTop;
                el._left = intLessLeft + intLeft;
              }
            }
          }
        }
}

function doDragTest() {
        // Don't start text selections in dragged elements.
        return (null==checkDrag(event.srcElement) && (elDragged==null))
}

function DNDswitchEvents(sw) {
if(sw=='on') {
      document.onmousedown = doMouseDown;
      document.onmousemove = doMouseMove;
      document.onmouseup = doMouseUp;
      document.ondragstart = doDragTest;
      document.onselectstart = doDragTest;
} else {
	document.onmousedown = null;
	document.attachEvent('onmousemove',getCoords);
      document.onmouseup = null;
      document.ondragstart = null;
      document.onselectstart = null;
}
}

function placeElements() {
	var reperPointY = document.getElementById('workPlace').style.pixelTop + 5;
	var reperPointX = document.getElementById('workPlace').style.pixelLeft + 5;
	for(var i=1;i<=maxIt;i++) {
		document.getElementById('dropHere'+i).style.pixelTop = reperPointY + (i-1)*44;
		document.getElementById('drop'+dnd_order[i]).style.pixelTop = reperPointY + (i-1)*44;
		document.getElementById('dropHere'+i).style.pixelLeft = reperPointX;
		document.getElementById('drop'+dnd_order[i]).style.pixelLeft = reperPointX + 300;
	}
	document.getElementById('dnd_check').style.visibility='hidden';
	return false;
}

function initializeDND(base) {

for(var i=0;i<=8;i++) {
	dnd_pairs[i]=0;
	dnd_tmp[i]=0;
}

	dndEnable=true;
	qbnum=base;
	qbase=base;
	toggleNext('off');
	togglePrev('off');

	var tmpitem='';
	innerNum=qbnum-qbase+1;
	tmpitem="righttext"+innerNum;
	if(document.getElementById(tmpitem)) {
		document.getElementById('righttext').innerHTML=document.getElementById(tmpitem).innerHTML;
	}
	tmpitem="wrongtext"+innerNum;
	if(document.getElementById(tmpitem)) {
		document.getElementById('wrongtext').innerHTML=document.getElementById(tmpitem).innerHTML;
	}
	tmpitem="question"+innerNum;
	if(document.getElementById(tmpitem)) {
		document.getElementById('current_question').innerHTML=document.getElementById(tmpitem).innerHTML;
	}

	tmpitem="choicesq"+innerNum;
	if(document.getElementById(tmpitem)) {
		curChoicesQB=parseInt(document.getElementById(tmpitem).innerText,10);
		maxIt=curChoicesQB;
		maxpoints=maxIt-1;
		attts=maxIt-1;
	}

	gotAnswer=false;
	if(!q_attempts[qbnum] || q_attempts[qbnum].value=='reset') {
		q_laststate[qbnum]=new Object; 
		q_laststate[qbnum].name=qbnum; 
		q_laststate[qbnum].value=''; 
		q_attempts[qbnum]=new Object; 
		q_attempts[qbnum].name=qbnum; 
		q_attempts[qbnum].value=maxIt-1; 
		q_points[qbnum]=new Object; 
		q_points[qbnum].name=qbnum; 
		q_points[qbnum].value=0; 
		if(qbnum==qbase) document.getElementById('q_warning').style.display='inline';
		formDND();
	} else {
		if(qbnum==qbase && checkDNDlaststate()) { 
			if(repeatTest) {
				if(confirm('Вы уже отвечали на этот вопрос. \nВы можете ответить на него снова -\nдля этого нажмите OK, либо\nпросмотреть Ваши ответы - для этого\nнажмите Cancel.')) {
					resetValues();
					formDND();
					return false;
				} else {
					formDND();
					showDNDright();
					if(cleanUpPlugs()) {
						dndEnable=false;
						DNDswitchEvents('off');
						toggleNext('on');
						togglePrev('on');
					}
				}
			} else {
				formDND();
				showDNDright();
				if(cleanUpPlugs()) {
					dndEnable=false;
					DNDswitchEvents('off');
					toggleNext('on');
					togglePrev('on');
				}
				alert('Вы уже отвечали на эти вопросы. \nВы можете только просмотреть\nправильные ответы.');
			}
		} else {
					resetValues();
					formDND();
					return false;
		}
	}
}

function resetValues() {
	for(var i=1;i<=maxIt;i++) dnd_pairs[i]=0;
	if(!q_laststate[qbnum]) {
		q_laststate[qbnum]=new Object;
	}
	q_laststate[qbnum].name=qbnum; 
	q_laststate[qbnum].value=''; 
	if(!q_attempts[qbnum]) {
		q_attempts[qbnum]=new Object; 
	}
	q_attempts[qbnum].name=qbnum; 
	q_attempts[qbnum].value=maxIt-1; 
	if(!q_points[qbnum]) {
		q_points[qbnum]=new Object; 
	}
	q_points[qbnum].name=qbnum; 
	q_points[qbnum].value=0; 
	zPoints=0;
	for(var i=1;i<q_points.length;i++) {
		if(q_points[i]) zPoints=zPoints+parseInt(q_points[i].value,10);
	}
	curPoints=Math.round(zPoints/maxPoints*100);
}

function formDND() {

	for(var i=1;i<=maxIt;i++) {
		document.getElementById('dnd_right'+i).innerHTML=document.getElementById('item'+innerNum+'_'+i).innerHTML;
		document.getElementById('dnd_left'+i).innerHTML=document.getElementById('qitem'+innerNum+'_'+i).innerHTML;
	}

	var tmporder=document.getElementById('answersq'+innerNum).innerText;
	for(var i=1;i<tmporder.length;i++) {
		dnd_order[i]=tmporder.charAt(i);
	}
	placeElements();

}

function checkDNDlaststate() {
	if(q_laststate[qbnum]) {
		for(var i=1;i<=maxIt;i++) {
			if(q_laststate[qbnum].value.charAt(i)==0) {
				return false;
			}
		}
	} else {
		return false;
	}
	return true;
}

function checkDNDpairs() {
	var tmpCheck=true;
	for(var i=1;i<=maxIt;i++) {
		if(dnd_pairs[i]!=i) {
			tmpCheck=false;
		}
	}
	return tmpCheck;
}

function checkAnswerDND() {

if(q_attempts[qbnum].value>0) {
	document.getElementById('dnd_check').style.visibility='hidden';
	if(checkDNDpairs()) {
		document.getElementById('rightballoon').style.visibility='visible';
		q_points[qbnum].value=q_attempts[qbnum].value;
		exitDND('right');
	} else {
		document.getElementById('wrongballoon').style.visibility='visible';
	}
	q_attempts[qbnum].value--;
} else {
	q_points[qbnum].value=0;
	exitDND('out');
}
}

function exitDND(eway) {

q_laststate[qbnum].value="/";
for(var i=1;i<=maxIt;i++) {
	q_laststate[qbnum].value+=1;
}

if(eway=='right') {
	zPoints=0;
	for(var i=1;i<q_points.length;i++) {
		if(q_points[i]) zPoints=zPoints+parseInt(q_points[i].value,10);
	}
	curPoints=Math.round(zPoints/maxPoints*100);
	document.getElementById('goballoon').style.visibility='visible';
} else {
	if(eway=='out') {
		showDNDright();
		document.getElementById('goballoon').style.visibility='visible';
		document.getElementById('byeballoon').style.visibility='visible';
	}
}
dndEnable=false;
DNDswitchEvents('off');
toggleNext('on');
togglePrev('on');

}


function showDNDright() {
	var reperPointY = document.getElementById('workPlace').style.pixelTop + 5;
	var reperPointX = document.getElementById('workPlace').style.pixelLeft + 5;
	for(var i=1;i<=maxIt;i++) {
		document.getElementById('dropHere'+i).style.pixelTop = reperPointY + (i-1)*44;
		document.getElementById('drop'+i).style.pixelTop = reperPointY + (i-1)*44;
		document.getElementById('dropHere'+i).style.pixelLeft = reperPointX;
		document.getElementById('drop'+i).style.pixelLeft = document.getElementById('dropHere'+i).style.pixelLeft + document.getElementById('dropHere'+i).offsetWidth - 50;
		dnd_pairs[i]=i;
	}
	document.getElementById('dnd_check').style.visibility='hidden';
	return false;
}