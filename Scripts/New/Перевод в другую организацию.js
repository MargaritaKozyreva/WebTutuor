arr = OBJECTS_ID_STR.split(";")
for (sid in arr) {
    id = Int(sid);
    doc = OpenDoc(UrlFromDocID(id));
    doc.TopElem.position_id.Clear();
    doc.TopElem.position_name.Clear();
    doc.TopElem.position_parent_id.Clear();
    doc.TopElem.position_parent_name.Clear();
    doc.TopElem.org_id = 6416260586651722860;
    doc.TopElem.org_name = 'ПАО НЛМК';
    doc.Save();
}