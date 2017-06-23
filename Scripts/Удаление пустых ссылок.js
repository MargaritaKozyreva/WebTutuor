arrPositions = XQuery("for $elem in positions return $elem");
for (itemPos in arrPositions) {
    flag = false;
    doc = OpenDoc(UrlFromDocID(itemPos.id));
    arrOrgs = XQuery("for $elem in orgs where id='" + doc.TopElem.org_id + "' return $elem");
    if (ArrayCount(arrOrgs) == 0) {
        DeleteDoc(UrlFromDocID(itemPos.id));
        flag = true;
    }
    if (!flag) {
        arrCollaborators = XQuery("for $elem in collaborators where position_id='" + itemPos.id + "' return $elem");
        if (ArrayCount(arrCollaborators) == 0) {
            DeleteDoc(UrlFromDocID(itemPos.id));
            flag = true;
        }
    }
    if (!flag) {
        doc.TopElem.basic_collaborator_id.Clear();
        doc.Save();
    }
}

arrPositions = OBJECTS_ID_STR.split(";");
//arrPositions = XQuery("for $elem in positions return $elem");
for (itemPos in arrPositions) {
    flag = false;
    doc = OpenDoc(UrlFromDocID(Int(itemPos)));
    arrOrgs = XQuery("for $elem in orgs where id='" + doc.TopElem.org_id + "' return $elem");
    if (ArrayCount(arrOrgs) == 0) {
        DeleteDoc(UrlFromDocID(Int(itemPos)));
        flag = true;
    }
    if (!flag) {
        alert(itemPos);
        arrCollaborators = XQuery("for $elem in collaborators where position_id='" + itemPos + "' return $elem");
        if (ArrayCount(arrCollaborators) == 0) {
            DeleteDoc(UrlFromDocID(Int(itemPos)));
            flag = true;
        }
    }
    if (!flag) {
        doc.TopElem.basic_collaborator_id.Clear();
        doc.Save();
    }
}