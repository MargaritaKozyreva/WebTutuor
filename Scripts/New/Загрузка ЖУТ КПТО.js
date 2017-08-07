//-=Раздел объявления переменных=-
logFileUrl = 'c:/Program Files/WebSoft/WebTutorServer/Log_custom/log_KPTO_';
codeTest = 0;
nameDep = 1;
rankPPK = 3
rankPEK = 4;
rankAtt = 5;
nameDev = 6;
codeCart = 7;
codeDep = 8;
codeArea = 9;
codePos = 10;
namePos = 11;
codeOld = 12;
logMsg = [];
//--------------------------------------------------

function processUpdate(srcArr, testID) {
    try {
        doc = OpenDoc(UrlFromDocID(testID));
        doc.TopElem.codecart = Trim(srcArr[codeCart]);
        doc.TopElem.depcode = Trim(srcArr[codeDep]);
        doc.TopElem.depname = Trim(srcArr[nameDep]);
        doc.TopElem.area = Trim(srcArr[codeArea]);
        doc.TopElem.poscode = Trim(srcArr[codePos]);
        doc.TopElem.posname = Trim(srcArr[namePos]);
        doc.TopElem.rankppk = Trim(srcArr[rankPPK]);
        doc.TopElem.rankpek = Trim(srcArr[rankPEK]);
        doc.TopElem.rankatt = Trim(srcArr[rankAtt]);
        doc.TopElem.developer = Trim(srcArr[nameDev]);
        doc.TopElem.oldcode = Trim(srcArr[codeOld]);
        doc.Save();
        return 1;
    } catch (e) {
        logMsg.push('Не удалось обновить данные теста КПТО с кодом ' + Trim(srcArr[codeTest]) + ' по причине: ' + ExtractUserError(e));
        return 0;
    }
}

function processCreate(srcArr) {
    try {
        newTest = OpenNewDoc('x-local://udt/udt_cc_journalkpto.xmd');
        newTest.BindToDb(DefaultDb);
        newTest.TopElem.code = Trim(srcArr[codeTest]);
        newTest.TopElem.codecart = Trim(srcArr[codeCart]);
        newTest.TopElem.depcode = Trim(srcArr[codeDep]);
        newTest.TopElem.depname = Trim(srcArr[nameDep]);
        newTest.TopElem.area = Trim(srcArr[codeArea]);
        newTest.TopElem.poscode = Trim(srcArr[codePos]);
        newTest.TopElem.posname = Trim(srcArr[namePos]);
        newTest.TopElem.rankppk = Trim(srcArr[rankPPK]);
        newTest.TopElem.rankpek = Trim(srcArr[rankPEK]);
        newTest.TopElem.rankatt = Trim(srcArr[rankAtt]);
        newTest.TopElem.developer = Trim(srcArr[nameDev]);
        newTest.TopElem.oldcode = Trim(srcArr[codeOld]);
        newTest.Save();
        return 1;
    } catch (e) {
        logMsg.push('Не удалось создать новую запись журнала КПТО по причине: ' + ExtractUserError(e))
        return 0;
    }
}

function writeLog() {
    logLine = '';
    for (var i = 0; i < ArrayCount(logMsg); i++) {
        logLine += logMsg[i] + '</br>';
    }
    try {
        PutFileData(logFileUrl + StrDate(Date(), false, false) + '.html', logLine);
    } catch (e) {
        alert('!Эталонный список. Невозможно создать лог-файл: ' + ExtractUserError(e));
    }
}
//------------------------------------------------


//-=Тело скрипта=-
now = new Date();
logMsg.push(String(now) + ': !ЖУТ КПТО. Обработка стартовала.');
linkSourceFile = XQuery("for $elem in resources where $elem/code='listKPTO' return $elem");
itemFile = ArrayFirstElem(linkSourceFile);
docResource = OpenDoc(UrlFromDocID(itemFile.id));
excelFileUrl = docResource.TopElem.file_url;
try {
    source = OpenDoc(excelFileUrl, 'format=excel');
} catch (e) {
    logMsg.push("Невозможно открыть документ " + excelFileUrl + " из БД по причине: " + ExtractUserError(e));
    return;
}

srcArr = ArrayFirstElem(source.TopElem);
var nullStr = 0;
for (var i = 0; i < ArrayCount(srcArr); i++) {
    if (i == 0 || i == 1 || i == 2) continue;
    if (nullStr >= 5) {
        break;
    }
    if (srcArr[i][codeTest] == '') {
        nullStr += 1;
        continue;
    }
    tests = XQuery("for $elem in cc_journalkptos where $elem/code='" + Trim(srcArr[i][codeTest]) + "' return $elem");
    if (ArrayCount(tests) == 0) {
        statusCreate = processCreate(srcArr[i]);
    } else if (ArrayCount(tests) > 0) {
        if (ArrayCount(tests) > 1) {
            logMsg.push('Множественное совпадение тестов в журнале КПТО по коду ' + ArrayFirstElem(tests).code);
        };
        for (test in tests) {
            statusUpdate = processUpdate(srcArr[i], test.id);
        }
    }
}
now = new Date();
logMsg.push(String(now) + ': !ЖУТ КПТО. Обработка завершена.')
writeLog();

//----------------------------------------------