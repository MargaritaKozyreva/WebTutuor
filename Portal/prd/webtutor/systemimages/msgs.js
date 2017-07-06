// Course Messages module 
var msgsModuleVersion = "2.2.0.rus";
var msgsModuleBuildDate = "2004-Jun-20";
var msgsEncoding = "windows-1251";
//(c)2002-2005 Websoft Ltd. http://www.courselab.ru/

var alertLib = new Object;
var confirmLib = new Object;
var msgsLib = new Object;
var defaultFeedback = new Object;

alertLib.aiccEnvLost = "AICC ����� �� ������� ��� �������� ����� � ��������";
alertLib.aiccForbidden = "AICC-������ ��� ������� ��� �������� ����� � ��������";
alertLib.aiccGetFailed = "AICC GET command failed. ������ �� ������� ��������� � �������.";
alertLib.aiccPutFailed = "AICC PUT command failed. ������ �� ���� ��������� ������ �� ������.";
alertLib.aiccXMLHTTPFailed = "Communication error (XMLHTTP). \n�������� ��������� ������������ �������� ������� ������. \n����������, ���������, ������ �� URL ������� � ������ \n���������� ������.";
alertLib.aiccServerXMLHTTPFailed = "Communication error (Server XMLHTTP). \n�������� ��������� ������������ �������� ������� ������. \n����������, ���������, ������ �� URL ������� � ������ \n���������� ������.";
alertLib.aiccBothXMLHTTPFailed = "Communication error (Both XMLHTTP methods failed).  \n�������� ��������� ������������ �������� ������� ������. \n����������, ���������, ������ �� URL ������� � ������ \n���������� ������.";
alertLib.aiccGetNotParsed = "�������� � ������� �������. \nAICC-������ �� �����������.";
alertLib.aiccPutNotParsed = "�������� � ���������� ������ �� ������.";
alertLib.aiccError1 = "Invalid AICC-command. Data not received.";
alertLib.aiccError2 = "Invalid AU-password. Data not received.";
alertLib.aiccError3 = "Invalid session id. Data not received.";
alertLib.aiccStrictControl = "AICC-������ �� �����������. ������� ��������� \n����� �� �������� ��� �������� ��� AICC-�����. \n���� ����� ����� �������.";
alertLib.aiccEasyControl = "AICC-������ �� �����������. ������� ��������� \n����� �������� ��� �������� ��� AICC-�����. \n������� OK ��� ��������� ����� ��� �������� ��� \nCANCEL ����� ������� ����.";
alertLib.aiccNoCoreFound = "���������� AICC-������ �� �������� CORE.";
alertLib.aiccStartTimeFailed = "Error starting slide timer";
alertLib.aiccExitFailed = "AICC ExitAU command failed. \n If it is first AICC alert during this session - \nnevermind. Course will be closed anyway...";
alertLib.aiccExitSuccess = "AICC ExitAU succeeded. Data sent to server. \nPress OK to close course window.";

alertLib.qtiLoadFailed = "Error loading QTI file: ";
alertLib.qtiParseFailed = "Error parsing QTI file";
alertLib.qtiParseAbsent = "QTI structure is broken or not found";
alertLib.qtiParseAssAbsent = "QTI assessment not found";
alertLib.qtiParseSection = "QTI section not parsed";
alertLib.qtiItemsNotFound = "QTI items not found";
alertLib.qtiItemPresNotFound = "Presentation part of QTI item not found";
alertLib.qtiItemsNotParsed = "QTI items not parsed";
alertLib.qtiItemMatNotFound = "Material part of QTI item not found";
alertLib.qtiItemVarsNotFound = "Response part of QTI item not found";
alertLib.qtiItemRespNotFound = "Response processing part of QTI item not found";
alertLib.qtiItemRespMisformed = "Misformed response processing part of QTI item";
alertLib.qtiItemFBNotFound = "QTI item feedback not found";
alertLib.qtiDisplayError = "Question block failed to display";
alertLib.qtiAlreadyPassed = "�� ��� ��������� ���� ����. \n�� ������ ������ ����������� ���� ����������.";
alertLib.qtiNotPassedYet = "�� ��� ������ ��������� ���� ����, ��  \n��������� ������� �������� �������������. ����\n����� ��������� � ������� ������������� �������.";
alertLib.noJumpAllowed = "��������� ������ ��������� ��� ������� \n�� �����, �� ������� �� ��� �� ��������, \n�����, ��� �� ������ �����";

alertLib.xmlStatus1 = "Loading XML...";
alertLib.xmlStatus2 = "Loading XML in progress...";
alertLib.xmlStatus3 = "Closing thread...";
alertLib.xmlStatus4 = "Loading complete";
alertLib.xmlStatusUnknown = "Loading status unknown";
alertLib.xmlXPathFailed = "Setting XPath failed";
alertLib.annalsCreateFailed = "Creating annals failed";
alertLib.loginFailed = "Personal parameters not loaded";

alertLib.varsError = "������ �������� ����� ����������: \n";
alertLib.varsError1 = "���� ���������� ������ �� ������. \n�������� ������ ��� �������� ������.";
alertLib.varsError2 = "������ ������� ����� ���������� ������. \n�������� ������ ��� �������� ������.";
alertLib.splashError = "������ �������� �������� ������. \n���������� ������� ������� XML";
alertLib.presentationError = "������ �������� ��������� ����� ������. \n���������� ������� ������� XML";
alertLib.plugcheckError = "������ �������� ����� ������������� ��������. \n���������� ������� ������� XML";
alertLib.msie4 = "� ���������, ������ ������ �������� ��������. \n������ ������ �������� � Microsoft Internet \nExplorer ������ 5.0 � ����.";
alertLib.nonIE = "� ���������, ������ �� ����� ���� �������, \n��� ��� ��� ������� �� ������������ ��������� \n����������� ��� ������ ������ �������. \n������ ������ �������� � Microsoft Internet \nExplorer ������ 5.0 � ����.";
alertLib.nonWin = "� ���������, ������ ������ �� ������ �������� � \n������������ ������� ������ ����������. \n������ �������� � Microsoft Internet \nExplorer ������ 5.0 � ���� �� ��������� Windows.";
alertLib.scormAPINotFound = "�� ������� ���������� SCORM API";
alertLib.scormAPITooDeep = "����� SCORM API ��������� -\n������� ����� ������� ������";
alertLib.scormNoCore = "CORE �� �������� �� ������ �������� -\n������ �� ��������";



confirmLib.qtiAlreadyPassed = "�� ��� ��������� ���� ����. \n�� ������ ������� ���� ���������� ���������� \n� ������ ���� ����� (������ OK) ��� \n����������� ���� ���������� �� ����� �� (������ Cancel).";
confirmLib.qtiSkipToFailed = "���� �� ���������� ���� ������, \n�� ����� ��������� ���������� �����������. \n�� �������, ��� ������ ���������� �� ������?";
confirmLib.navExit = "���� ����� ����� �������. �� �������, ��� ������ �����?";
confirmLib.navExitAnyway = "������ ������� � �������, �� ������ ���������\n�� ������. ���� ����� ����� �������. �� �������, ��� ������ �����?";
confirmLib.jumpOrNot = "� ���������� ������ �� ������������ �� ������ ���� �����.\n��������� � ���������� ���� (OK) ��� ������� �� ��������� ������ (Cancel)?";

msgsLib.qtiModeBrowse = "<span style='color:#CC0000;'>����� ��������� �����������</span>";
msgsLib.qtiNotScored = "�������������";
msgsLib.qtiRightAnswer = "<span style='color:#00CC00;'>���������� �����</span>";
msgsLib.qtiSectionTitle = "������";
msgsLib.hour = "���";
msgsLib.minute = "���";
msgsLib.sec = "���";
msgsLib.testEnd = "<p align='center'>���� ��������.<br/> ����������, �������� ���� �����.</p>";
msgsLib.installed = "����������";
msgsLib.install = "����������";
msgsLib.notinstalled = "�� ����������";

defaultFeedback.right = "���������!";
defaultFeedback.wrong = "� ���������, �� ��������";
defaultFeedback.timeout = "� ��������� ����� ���������� �� ����� �����������";
defaultFeedback.exhausted = "� ���������, �� ��������� ��� ������� ������";
defaultFeedback.empty = "����� - ������ ���������";
defaultFeedback.nan = "��������� �������� �� �������� ������";

urlLib = new Object;
urlLib.flash = ""

var defaultTitle = "������������� �����";
