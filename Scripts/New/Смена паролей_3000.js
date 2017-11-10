excelFileUrl = 'x-local:///c:/order_3000_2.xls';
try {
    sourceList = OpenDoc(excelFileUrl, 'format=excel');
} catch (e) {
    alert('Невозможно открыть файл с данными: ' + ExtractUserError(e));
    return;
}
lineArray = ArrayFirstElem(sourceList.TopElem);
for (var i = 0; i < ArrayCount(lineArray); i++) {
    users = XQuery("for $elem in collaborators where $elem/login='" + Trim(lineArray[i][1]) + "' return $elem");
    for (user in users) {
        doc = OpenDoc(UrlFromDocID(user.id));
        if (doc.TopElem.last_data.web_banned) {
            alert('Сотрудник с таб. номером ' + lineArray[i][1] + ' считается уволенным!');
        }
        doc.TopElem.password = Trim(lineArray[i][2]);
        doc.TopElem.change_password = false;
        doc.Save();
    }
}