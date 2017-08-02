//-=Раздел объявления переменных=-
logFileUrl = 'c:/Program Files/WebSoft/WebTutorServer/Log_custom/log_standart_';
codeUser = 0;
fullName = 1;
codeDep = 2;
nameDep = 3;
namePos = 5;
nameOrg = 6;
logMsg = [];
//--------------------------------------------------

function processUpdate(srcArr, user) {
    try {
        doc = OpenDoc(UrlFromDocID(user.id));
        doc.TopElem.name = Trim(String(srcArr[fullName]));
        doc.TopElem.codedep = Trim(String(srcArr[codeDep]));
        doc.TopElem.namedep = StrTitleCase(Trim(String(srcArr[nameDep])));
        doc.TopElem.namepos = Trim(String(srcArr[namePos]));
        doc.TopElem.nameorg = Trim(String(srcArr[nameOrg]));
        doc.Save();
        return 1;
    } catch (e) {
        logMsg.push('Не удалось обновить данные сотрудника с кодом LP' + Trim(srcArr[codeUser]) + ' по причине: ' + ExtractUserError(e));
        return 0;
    }
}

function processCreate(srcArr) {
    try {
        newUser = OpenNewDoc('x-local://udt/udt_cc_standartsapuser.xmd');
        newUser.BindToDb(DefaultDb);
        newUser.TopElem.code = srcArr[codeUser];
        newUser.TopElem.name = srcArr[fullName];
        newUser.TopElem.codedep = srcArr[codeDep];
        newUser.TopElem.namedep = srcArr[nameDep];
        newUser.TopElem.namepos = srcArr[namePos];
        newUser.TopElem.nameorg = srcArr[nameOrg];
        newUser.Save();
        return 1;
    } catch (e) {
        logMsg.push('Не удалось создать нового сотрудника по причине: ' + ExtractUserError(e))
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
logMsg.push(String(now) + ': !Эталонный список. Обработка стартовала.');
linkSourceFile = XQuery("for $elem in resources where $elem/code='listSAP' return $elem");
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
for (var i = 0; i < ArrayCount(srcArr); i++) {
    if (i == 0) continue;
    try {
        code = Int(srcArr[i][codeUser]);
    } catch (e) {
        logMsg.push('Табельный номер ' + srcArr[i][codeUser] + ' не соответствует формату');
        continue;
    }
    try {
        codedep = Int(srcArr[i][codeDep]);
    } catch (e) {
        continue;
    }
    if (code > 999999) {
        continue;
    }
    users = XQuery("for $elem in cc_standartsapusers where $elem/code='" + Trim(srcArr[i][codeUser]) + "' return $elem");
    if (ArrayCount(users) == 0) {
        statusCreate = processCreate(srcArr[i]);
    } else if (ArrayCount(users) > 0) {
        if (ArrayCount(users) > 1) {
            logMsg.push('Множественное совпадение сотрудников по коду ' + ArrayFirstElem(users).code);
        };
        for (user in users) {
            statusUpdate = processUpdate(srcArr[i], user);
        }
    }
}
now = new Date();
logMsg.push(String(now) + ': !Эталонный список. Обработка завершена.')
writeLog();

//----------------------------------------------