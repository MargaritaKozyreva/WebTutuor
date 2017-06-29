arrSub = XQuery("for $elem in subdivisions return $elem");
for (itemSub in arrSub) {
    doc = OpenDoc(UrlFromDocID(itemSub.id));
    arrColl = XQuery("for $elem in collaborators where position_parent_id=" + itemSub.id + " return $elem");
    if (ArrayCount(arrColl) == 0) {
        DeleteDoc(UrlFromDocID(itemSub.id));
    }
}
alert("Обработка завершена");