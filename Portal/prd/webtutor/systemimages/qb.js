// JavaScript Document

//=================================

if(q_info) q_info=null;
var q_info = new Array(0);
//inserting blank records in q_info[0] Object (example, unused dummy) - short syntax (NN4+,IE5+)
q_info[0] = {name:"0", done:0, state:"/", answer:"/", atts:0, points:0, qtime:"", utime:""};

if(quest) quest=null;
var quest = new Array(0);
//inserting blank records in quest[0] Object (example, unused dummy) - short syntax (NN4+,IE5+)
quest[0] = {name:"0", question:"", logic:"", goal:"", answers:"/", size:"", weight:0, afterlink:"", right:"", wrong:"", choices:0, items:new Array(0), done:false};
quest[0].items[0] = "";

if(quiz) quiz=null;
var quiz = new Object; //straight syntax (NN3+, IE4+)
quiz.buildQuiz = buildQuiz;
quiz.checkDataSpan = checkDataSpan;
quiz.getQuizData = getQuizData;
quiz.parseSpanData = parseSpanData;
quiz.drawItem = drawQuizItem;
quiz.checkDone = checkQuizDone;
quiz.startQuiz = quizEngine;
quiz.nextQuestion = setNextQuestion;
quiz.closeQuiz = closeQuiz;
quiz.drawQuiz = drawQuiz;
quiz.drawTemplate = drawTemplate;

if(quizvar) quizvar=null;
var quizvar = new Object; //straight syntax (NN3+, IE4+)
quizvar.base = 0;
quizvar.total = 0;
quizvar.timer = 0;
quizvar.dataMethod = "span";
quizvar.dataSpan = new Array('question','logicq','questiongoal','answersq','questionsize','weightq','afterlink','righttext','wrongtext','choicesq','q_itemX_Y');
quizvar.dataQuest = new Array('question','logic','goal','answers','size','weight','afterlink','right','wrong','choices','items');
quizvar.checkArray = new Array(0);
quizvar.dice = false;
quizvar.current = 0;
quizvar.template = "default";
quizvar.maxitems = 0;

if(nav) nav=null;
var nav = new Object; //straight syntax (NN3+, IE4+)
nav.disableNav = disableNavigation;
nav.enableNav = enableNavigation;

//===================================

function disableNavigation(dnext,dprev,dselector,dcontents) {
	if(dnext) toggleNext('off');
	if(dprev) togglePrev('off');
	return true;
}

function enableNavigation(dnext,dprev,dselector,dcontents) {
	if(dnext) toggleNext('on');
	if(dprev) togglePrev('on');
	return true;
}

function checkDataSpan(waitparam) {
	if(!document.getElementById('qbbuttonfurther')) {
		clearTimeout(quizvar.timer);
		quizvar.timer = setTimeout("quiz.buildQuiz(quizvar.base,quizvar.total);",waitparam);
		return false;
	} else {
		clearTimeout(quizvar.timer);
		return true;
	}
}

function getQuizData() {
	switch(quizvar.dataMethod) {
		case "span":
			if(!quiz.parseSpanData()) {
				alert('Parsing quiz data (SPAN method) was unsuccessful');
				return false;
			}
			break;
		default:
			alert('getQuizData failed');
			break;
	}
	return true;
}

function buildQuiz(base, maxq) {
	quizvar.base = parseInt(base,10);
	quizvar.total = parseInt(maxq,10);
	if(isNaN(quizvar.base) || isNaN(quizvar.total)) {
		alert('Exit: total or base is not a number');
		return false;
	}
//checking if data is ready
	if(quizvar.dataMethod=="span") {
		if(!quiz.checkDataSpan(50)) return false;
	}
//now collecting data
	if(!quiz.getQuizData()) {
		alert('Exit: Quiz data not obtained');
		return false;
	}
	var tmpVar = quiz.checkDone();
	quiz.drawTemplate();
	switch(tmpVar) {
		case 2:
			alert('Already done');
			break;
		case 1:
			alert('Have work to do');
			break;
		case 0:	
			alert('Lets do it');
			quiz.startQuiz();
			break;
		default:
			alert('Nothing to do baby');
			break;
	}
	return true;
}

function quizEngine() {
//1. obtain question order: straight or random
//2. get current question number
	for(var i=1;i<=quizvar.total+1;i++) {
		if(!quizvar.dice) {
			quizvar.current = quiz.nextQuestion();
			alert(quizvar.current);
			if(quizvar.current == 0) {
				quiz.closeQuiz();
				return true;
			}
			quiz.drawQuiz(quizvar.current);
		}
	}
//3. obtain question template
//4. draw question
//5. 
}

function closeQuiz() {
	nav.enableNav();
	alert('Finish');
	return true;
}

function setNextQuestion() {
	for(var i=1;i<=quizvar.total;i++) {
		var curQuest = quizvar.base-1+i;
		if(!quest[curQuest].done) {
//			alert(curQuest);
			quest[curQuest].done=true;
			return curQuest;
		}
	}
	return 0;
}

function parseSpanData() {
	quizvar.qtypes = "";
	for(var i=1;i<=quizvar.total;i++) {
		var curQuest = quizvar.base-1+i;
		quest[curQuest] = new Object;
		quest[curQuest].done = false;
		for(var j=0;j<quizvar.dataSpan.length;j++) {
			switch(quizvar.dataSpan[j]) {
				case "q_itemX_Y":
					break;
				default:
					if(document.getElementById(quizvar.dataSpan[j]+i)) {
						eval("quest["+curQuest+"]."+quizvar.dataQuest[j]+"=document.getElementById('"+quizvar.dataSpan[j]+i+"').innerHTML");
					} else {
						alert(curQuest + ": no " + quizvar.dataSpan[j]);
						return false;
					}
					
					if(quizvar.dataQuest[j]=='logic') {
						var tmpVar = document.getElementById('logicq'+i).innerText;
						switch(tmpVar) {
							case 'choice':
								if(quizvar.qtypes.indexOf('choice')==-1) quizvar.qtypes+="/choice";
								break;
							case 'select':
								if(quizvar.qtypes.indexOf('select')==-1) quizvar.qtypes+="/select";
								break;
							case 'range':
								if(quizvar.qtypes.indexOf('range')==-1) quizvar.qtypes+="/range";
								break;
							default:
								break;
						}
					}
					break;
			}
		}
	}
	quizvar.maxitems = 0;
	for(var i=1;i<=quizvar.total;i++) {
		var curQuest = quizvar.base-1+i;
		quest[curQuest].items = new Array(0);
		quest[curQuest].items[0]=0;
		var tmpVar=parseInt(quest[curQuest].choices);
		if(tmpVar>quizvar.maxitems) quizvar.maxitems = tmpVar;
		for(var j=1;j<=tmpVar;j++) {
			quest[curQuest].items[j]=document.getElementById('q_item'+i+'_'+j).innerHTML;
		}
	}	
	return true;
}

function checkQuizDone() {
	quizvar.checkArray.length=0;
	if(q_info.length<=1) return 0;
	var tmpVar = 0;
	for(var i=1;i<=q_info.length;i++) {
		var curNum = parseInt(q_info[i].name,10);
		if(curNum >= quizvar.base && curNum < quizvar.base+quizvar.total) {
			if(q_info[i].done==1) {
				quest[curNum].done = true;
				quizvar.checkArray[quizvar.checkArray.length]=q_info[i].name;
				tmpVar++;
				
			}
		}
	}
	if(tmpVar<quizvar.total) {
		return 1;
	} else {
		return 2;
	}
}

function drawTemplate() {
	switch(quizvar.template) {
		default:
			templates.drawDefault();
			break;
	}
	return true;
}

function drawQuiz(quizid) {
	switch(quizvar) {
	}
}