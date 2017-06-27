logFileUrl = 'c:/log.html';
errLog = '';
arr = OBJECTS_ID_STR.split(";")
for (sid in arr) {
    id = Int(sid);
    doc = OpenDoc(UrlFromDocID(id));
    lastName = doc.TopElem.lastname;
    if (Trim(lastName) !== '') {
        arrNames = String(lastName).split(' ');
        if (arrNames.length == 2) {
            doc.TopElem.lastname = arrNames[0];
            doc.TopElem.firstname = arrNames[1];
        } else if (arrNames.length == 3) {
            doc.TopElem.lastname = arrNames[0];
            doc.TopElem.firstname = arrNames[1];
            doc.TopElem.middlename = arrNames[2];
        } else {
            errLog += doc.TopElem.lastname + '</br>';
        }
    } else {
        errLog += doc.TopElem.lastname + '</br>';
    }
    doc.Save();
}
try {
    PutFileData(logFileUrl, errLog);
} catch (e) {
    alert('Невозможно создать лог-файл: ' + ExtractUserError(e));
}