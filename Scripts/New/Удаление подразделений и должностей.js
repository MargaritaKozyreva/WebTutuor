arrPos = XQuery("for $elem in positions return $elem");
for (itemPos in arrPos) {
    flag = true;
    arrColl = XQuery("for $elem in collaborators where position_id=" + itemPos.id + " return $elem");
    if (ArrayCount(arrColl) == 0) {
        doc = OpenDoc(UrlFromDocID(itemPos.id));
        doc.TopElem.basic_collaborator_id.Clear();
        doc.Save();
        DeleteDoc(UrlFromDocID(itemPos.id));
        flag = false;
    }
    if (flag) {
        if (itemPos.code == '!delete') {
            DeleteDoc(UrlFromDocID(itemPos.id));
        }
    }

}

arrSub = XQuery("for $elem in subdivisions return $elem");
for (itemSub in arrSub) {
    flag = true;
    arrColl = XQuery("for $elem in collaborators where position_parent_id=" + itemSub.id + " return $elem");
    if (ArrayCount(arrColl) == 0) {
        DeleteDoc(UrlFromDocID(itemSub.id));
        flag = false;
    }
    if (flag) {
        if (itemSub.code = '!delete') {
            DeleteDoc(UrlFromDocID(itemSub.id));
        }
    }
}

alert("Обработка удаления пустых карточек завершена");