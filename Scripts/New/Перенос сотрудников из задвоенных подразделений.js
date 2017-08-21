arr = OBJECTS_ID_STR.split(";");
for (sid in arr) {
    users = XQuery("for $elem in collaborators where $elem/position_parent_id=" + Int(sid) + " return $elem");
    for (user in users) {
        XQPos = XQuery("for $elem in positions where $elem/name='" + user.position_name + "' and $elem/position_parent_id=6436921075121027903 return $elem");
        posID = ArrayFirstElem(XQPos).id;
        doc = OpenDoc(UrlFromDocID(user.id));
        doc.TopElem.position_id = Int(posID);
        doc.TopElem.org_id = 6416260586651722860;
        doc.TopElem.position_parent_id = 6436921075121027903;
        doc.Save();
    }
}