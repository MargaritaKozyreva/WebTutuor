tests = XQuery("for $elem in active_test_learnings where $elem/group_id=6439576362331942239 return $elem");
for (test in tests) {
    //person = XQuery("for $elem in collaborators where $elem/id=" + test.person_id + " retuen $elem");
    doc = OpenDoc(UrlFromDocID(test.person_id));
    if (doc.TopElem.password == '') {
        doc.TopElem.password = doc.TopElem.custom_elems.ObtainChildByKey('userCode').value;
        doc.TopElem.change_password = false;
    }
    doc.Save();
    alert('Изменен сотрудник с кодом ' + doc.TopElem.code);
}
