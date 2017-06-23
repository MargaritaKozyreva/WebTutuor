count = 0;
arrUsers = XQuery('for $elem in collaborators where contains($elem/login, "DO*") return $elem');
for (_elem in arrUsers) {
    doc = OpenDoc(UrlFromDocID(_elem.id));
    if (doc.TopElem.change_password) {
        doc.TopElem.password = '';
    } else if (doc.TopElem.password == '') {
        doc.TopElem.change_password = true;
    }
    doc.Save();
    count += 1;
}
alert('Выполнено замен: ' + count);