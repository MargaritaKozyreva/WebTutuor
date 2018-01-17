alert('Агент удаления папок стартовал');
logFileUrl = 'c:/Program Files/WebSoft/WebTutorServer/Log_custom/log_delete_folder_';
deleteFolderLog = [];
anyLog = [];

function writeLog(any, del) {
    resultStr = '';

    anyStr = '<b>Результаты предварительной обработки:</b></br>';
    for (item in any) {
        anyStr += item + '</br>';
    }
    resultStr += anyStr;

    delStr = '<b>Удалены папки:</b></br>';
    for (item in del) {
        delStr += item + '</br>';
    }
    resultStr += delStr;

    try {
        PutFileData(logFileUrl + StrDate(Date(), false, false) + '.html', resultStr);
    } catch (e) {
        alert('Невозможно создать лог-файл: ' + ExtractUserError(e));
    }
}
try {
    tests = XQuery("for $elem in assessments return $elem");
    arrLink = [];
    for (test in tests) {
        docTest = OpenDoc(UrlFromDocID(test.id)).TopElem;
        path = String(Trim(StrReplace(docTest.publish_url, '/webtutor/', ''))).split('/')[0];
        arrLink.push(path);
    }

    modules = XQuery("for $elem in course_modules return $elem");
    for (module in modules) {
        docModule = OpenDoc(UrlFromDocID(module.id)).TopElem;
        path = String(Trim(StrReplace(docModule.url, '/webtutor/', ''))).split('/')[0];
        arrLink.push(path);
    }

    anyLog.push('Найдено ссылок: ' + ArrayCount(arrLink));
    arrLink = ArraySelectDistinct(arrLink);
    anyLog.push('Сформировано уникальных ссылок: ' + ArrayCount(arrLink));

    sDirectoryPath = "c:\\Program Files\\WebSoft\\WebTutorServer\\wt\\web\\webtutor";
    arrFiles = ReadDirectoryByPath(sDirectoryPath);

    j = 0;
    for (folder in arrFiles) {
        if (!(IsDirectory(folder))) continue;
        j++;
        folder = FileName(folder);
        compare = false;
        for (i = 0; i < ArrayCount(arrLink); i++) {
            if (folder == arrLink[i]) {
                compare = true;
                break;
            }
        }
        if (!(compare)) {
            DeleteDirectory(sDirectoryPath + '\\' + folder);
            deleteFolderLog.push(folder);
        }
    }
    anyLog.push('Найдено элементов: ' + ArrayCount(arrFiles) + ', из них папок: ' + j);
    writeLog(anyLog, deleteFolderLog);
} catch (e) {
    alert("Ошибка при выполнении агента: " + ExtractUserError(e));
}

alert('Агент удаления папок завершил работу');
