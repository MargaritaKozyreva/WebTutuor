arrSubdivisions = XQuery("for $elem in subdivisions return $elem");
for (itemSub in arrSubdivisions) {
    doc = OpenDoc(UrlFromDocID(itemSub.id));
    arrCollaborators = XQuery("for $elem in collaborators where position_parent_id='" + itemSub.id + "' return $elem");
    if (ArrayCount(arrCollaborators) == 0) {
        DeleteDoc(UrlFromDocID(itemSub.id));
    }
}
alert("Обработка завершена");