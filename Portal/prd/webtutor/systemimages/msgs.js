// Course Messages module 
var msgsModuleVersion = "2.2.0.rus";
var msgsModuleBuildDate = "2004-Jun-20";
var msgsEncoding = "windows-1251";
//(c)2002-2005 Websoft Ltd. http://www.courselab.ru/

var alertLib = new Object;
var confirmLib = new Object;
var msgsLib = new Object;
var defaultFeedback = new Object;

alertLib.aiccEnvLost = "AICC среда не найдена или потеряна связь с сервером";
alertLib.aiccForbidden = "AICC-сессия уже закрыта или потеряна связь с сервером";
alertLib.aiccGetFailed = "AICC GET command failed. Модуль не получил параметры с сервера.";
alertLib.aiccPutFailed = "AICC PUT command failed. Модуль не смог отправить данные на сервер.";
alertLib.aiccXMLHTTPFailed = "Communication error (XMLHTTP). \nВероятно установки безопасности браузера слишком строги. \nПожалуйста, проверьте, внесен ли URL сервера в список \nдоверенных сайтов.";
alertLib.aiccServerXMLHTTPFailed = "Communication error (Server XMLHTTP). \nВероятно установки безопасности браузера слишком строги. \nПожалуйста, проверьте, внесен ли URL сервера в список \nдоверенных сайтов.";
alertLib.aiccBothXMLHTTPFailed = "Communication error (Both XMLHTTP methods failed).  \nВероятно установки безопасности браузера слишком строги. \nПожалуйста, проверьте, внесен ли URL сервера в список \nдоверенных сайтов.";
alertLib.aiccGetNotParsed = "Проблемы с ответом сервера. \nAICC-сессия не установлена.";
alertLib.aiccPutNotParsed = "Проблемы с пересылкой данных на сервер.";
alertLib.aiccError1 = "Invalid AICC-command. Data not received.";
alertLib.aiccError2 = "Invalid AU-password. Data not received.";
alertLib.aiccError3 = "Invalid session id. Data not received.";
alertLib.aiccStrictControl = "AICC-сессия не установлена. Текущие установки \nкурса не поволяют его просмотр вне AICC-среды. \nОкно курса будет закрыто.";
alertLib.aiccEasyControl = "AICC-сессия не установлена. Текущие установки \nкурса поволяют его просмотр вне AICC-среды. \nНажмите OK для просмотра курса без трекинга или \nCANCEL чтобы закрыть курс.";
alertLib.aiccNoCoreFound = "Полученные AICC-данные не содержат CORE.";
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
alertLib.qtiAlreadyPassed = "Вы уже проходили этот тест. \nВы можете только просмотреть свои результаты.";
alertLib.qtiNotPassedYet = "Вы уже начали проходить этот тест, но  \nнекоторые вопросы остались неотвеченными. Тест\nбудет продолжен с первого неотвеченного вопроса.";
alertLib.noJumpAllowed = "Настройки модуля запрещают Вам переход \nна слайд, на котором Вы еще не побывали, \nиначе, чем по кнопке Далее";

alertLib.xmlStatus1 = "Loading XML...";
alertLib.xmlStatus2 = "Loading XML in progress...";
alertLib.xmlStatus3 = "Closing thread...";
alertLib.xmlStatus4 = "Loading complete";
alertLib.xmlStatusUnknown = "Loading status unknown";
alertLib.xmlXPathFailed = "Setting XPath failed";
alertLib.annalsCreateFailed = "Creating annals failed";
alertLib.loginFailed = "Personal parameters not loaded";

alertLib.varsError = "Ошибка загрузки файла переменных: \n";
alertLib.varsError1 = "Файл переменных модуля не найден. \nВозможны ошибки при загрузке модуля.";
alertLib.varsError2 = "Ошибка разбора файла переменных модуля. \nВозможны ошибки при загрузке модуля.";
alertLib.splashError = "Ошибка загрузки заставки модуля. \nНевозможно создать объекты XML";
alertLib.presentationError = "Ошибка загрузки основного файла данных. \nНевозможно создать объекты XML";
alertLib.plugcheckError = "Ошибка загрузки файла конфигуратора боаузера. \nНевозможно создать объекты XML";
alertLib.msie4 = "К сожалению, версия Вашего браузера устарела. \nДанный модуль работает в Microsoft Internet \nExplorer версии 5.0 и выше.";
alertLib.nonIE = "К сожалению, модуль не может быть показан, \nтак как Ваш браузер не поддерживает некоторые \nнеобходимые для показа модуля функции. \nДанный модуль работает в Microsoft Internet \nExplorer версии 5.0 и выше.";
alertLib.nonWin = "К сожалению, данный модуль не сможет работать в \nоперационной системе Вашего компьютера. \nМодуль работает в Microsoft Internet \nExplorer версии 5.0 и выше на платформе Windows.";
alertLib.scormAPINotFound = "Не удалось обнаружить SCORM API";
alertLib.scormAPITooDeep = "Поиск SCORM API прекращен -\nслишком много уровней поиска";
alertLib.scormNoCore = "CORE не содержит ни одного элемента -\nданные не получены";



confirmLib.qtiAlreadyPassed = "Вы уже проходили этот тест. \nВы можете стереть свои предыдущие результаты \nи пройти тест снова (кнопка OK) или \nпросмотреть свои результаты не меняя их (кнопка Cancel).";
confirmLib.qtiSkipToFailed = "Если Вы пропустите этот вопрос, \nон будет считаться отвеченным неправильно. \nВы уверены, что хотите отказаться от ответа?";
confirmLib.navExit = "Окно курса будет закрыто. Вы уверены, что хотите выйти?";
confirmLib.navExitAnyway = "Сессия закрыта с ошибкой, но данные сохранены\nна сервер. Окно курса будет закрыто. Вы уверены, что хотите выйти?";
confirmLib.jumpOrNot = "В предыдущей сессии Вы остановились на другой теме курса.\nВернуться к прерванной теме (OK) или перейти на выбранную теперь (Cancel)?";

msgsLib.qtiModeBrowse = "<span style='color:#CC0000;'>Режим просмотра результатов</span>";
msgsLib.qtiNotScored = "неоцениваемый";
msgsLib.qtiRightAnswer = "<span style='color:#00CC00;'>ПРАВИЛЬНЫЙ ОТВЕТ</span>";
msgsLib.qtiSectionTitle = "Раздел";
msgsLib.hour = "час";
msgsLib.minute = "мин";
msgsLib.sec = "сек";
msgsLib.testEnd = "<p align='center'>Тест завершен.<br/> Пожалуйста, закройте окно теста.</p>";
msgsLib.installed = "Установлен";
msgsLib.install = "Установить";
msgsLib.notinstalled = "Не установлен";

defaultFeedback.right = "Правильно!";
defaultFeedback.wrong = "К сожалению, вы ошиблись";
defaultFeedback.timeout = "К сожалению время отведенное на ответ закончилось";
defaultFeedback.exhausted = "К сожалению, Вы исчерпали все попытки ответа";
defaultFeedback.empty = "Пусто - нечего проверять";
defaultFeedback.nan = "Введенное значение не является числом";

urlLib = new Object;
urlLib.flash = ""

var defaultTitle = "Проигрыватель курса";
