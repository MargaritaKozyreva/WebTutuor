arrPos = XQuery("for $elem in positions return $elem");
for (itemPos in arrPos) {
    doc = OpenDoc(UrlFromDocID(itemPos.id));
    doc.TopElem.basic_collaborator_id.Clear();
    doc.Save();
    arrColl = XQuery("for $elem in collaborators where position_id=" + itemPos.id + " return $elem");
    if (ArrayCount(arrColl) == 0) {
        DeleteDoc(UrlFromDocID(itemPos.id));
    }
}
alert("Обработка завершена");