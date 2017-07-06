//(c)2002-2004 Websoft Ltd. http://www.websoft.ru/
//Global configuration variables
//These may be set by LMS Administrator

// Starter variables
var startMethod='wt'; 
// Defines type of opening (separate window etc.). Values: ls - LearningSpace, wt - WebTutor, any other value - local start

var AICCmethod='xml';
//Two values: html or xml (default). XML method is more reliable, but in some cases you may need HTML.
// Next 2 variables applicable only if AICCmethod is set to html. They are ignored for XML method.
var AICC_control='easy';
//Two values: strict or easy (default). If server doesn't send AICC response in reasonable amount of time course window will be closed (STRICT mode) or AICC-session will stop without closing the window (EASY) 
var aiccDelay=750;
//Time to wait valid server response (in milliseconds). Usually 750 msec (default) is enough, but on slow networks you may set it to higher value. We do not recommend values more than 5000.

var putAICCmethod='normal'; 
// There are 3 possible values: normal, timer, end. 
//'normal': course put data on server every transition between slides
//'timer': course put data on server every X milliseconds (X=putAICCtimer value - see below)
//'end': course put data on server only once - on closing. In this case course MUST be closed by course own CLOSE button!
var putAICCtimer=60000;
//Time interval (in milliseconds) between putting data on server (applicable only if putAICCmethod is set to 'timer', otherwise - ignored). Values less than 10000 will be converted to 10000 automatically.

var trackVisited=false; // Defines strict order of slide browsing. Default value true, false to enable free browsing
var repeatTest=true; // If true - user can reset test questions and answer again. Default value false.

var helpURL='../../RunThis/RunMe3.htm'; //URL of page with stand-alone Flash Player installation instructions
var flashURL='../../RunThis/RunMe2.htm'; //URL of RunMe2.htm or any custom aautomatic Flash Player Installer