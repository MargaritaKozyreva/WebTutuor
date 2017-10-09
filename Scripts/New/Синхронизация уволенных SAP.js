//-=Раздел объявления переменных=-
logFileUrl = 'c:/Program Files/WebSoft/WebTutorServer/Log_custom/log_dismiss_';
codeUser = 0;
fullName = 1;
codeDep = 2;
nameDep = 3;
dateDismiss = 4;
logMsg = [];
//--------------------------------------------------

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
alert(String(now) + ': !Список уволенных. Обработка стартовала.');
logMsg.push(String(now) + ': !Список уволенных. Обработка стартовала.');
linkSourceFile = XQuery("for $elem in resources where $elem/code='dismissSAP' return $elem");
itemFile = ArrayFirstElem(linkSourceFile);
docResource = OpenDoc(UrlFromDocID(itemFile.id));
excelFileUrl = docResource.TopElem.file_url;
try {
    source = OpenDoc(excelFileUrl, 'format=excel');
} catch (e) {
    alert("Невозможно открыть документ " + excelFileUrl + " из БД по причине: " + ExtractUserError(e));
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

    users = XQuery("for $elem in collaborators where $elem/code='1010/" + Trim(srcArr[i][codeUser]) + "' return $elem");
    if (ArrayCount(users) == 0) {
        continue;
    } else if (ArrayCount(users) > 0) {
        if (ArrayCount(users) > 1) {
            logMsg.push('Множественное совпадение сотрудников по коду ' + ArrayFirstElem(users).code);
        };
        for (user in users) {
            doc = OpenDoc(UrlFromDocID(user.id));
            ln1 = StrLowerCase(doc.TopElem.lastname);
            ln2 = String(StrLowerCase(Trim(srcArr[i][fullName]))).split(' ')[0];
            if (ln1 == ln2) {
                doc.TopElem.is_dismiss = true;
                doc.TopElem.last_data.web_banned = true;
                doc.TopElem.dismiss_date = ParseDate(srcArr[i][dateDismiss]);
                //doc.TopElem.custom_elems.ObtainChildByKey("dateDismiss").value = ParseDate(srcArr[i][dateDismiss]);
            } else {
                logMsg.push('Табельный номер ' + code + ': не совпадают фамилии!');
                continue;
            }
            doc.Save();
        }
    }
}
now = new Date();
alert(String(now) + ': !Список уволенных. Обработка завершена.');
logMsg.push(String(now) + ': !Список уволенных. Обработка завершена.')
writeLog();

//----------------------------------------------