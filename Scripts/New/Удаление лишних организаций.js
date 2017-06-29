arrOrg = XQuery("for $elem in orgs return $elem");
for (itemOrg in arrOrg) {
    doc = OpenDoc(UrlFromDocID(itemOrg.id));
    arrColl = XQuery("for $elem in collaborators where org_id=" + itemOrg.id + " return $elem");
    if (ArrayCount(arrColl) == 0) {
        DeleteDoc(UrlFromDocID(itemOrg.id));
    }
}
alert("Обработка завершена");