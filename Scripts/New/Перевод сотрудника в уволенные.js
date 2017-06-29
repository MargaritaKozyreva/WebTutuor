arr = OBJECTS_ID_STR.split(";")
for (sid in arr) {
    id = Int(sid);
    doc = OpenDoc(UrlFromDocID(id));
    doc.TopElem.is_dismiss = true;
    doc.TopElem.last_data.web_banned = true;
    doc.Save();
}