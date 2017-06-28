arr = OBJECTS_ID_STR.split(";")
for (sid in arr) {
    id = Int(sid);
    doc = OpenDoc(UrlFromDocID(id));
    doc.TopElem.firstname = StrTitleCase(doc.TopElem.firstname);
    doc.TopElem.lastname = StrTitleCase(doc.TopElem.lastname);
    doc.TopElem.middlename = StrTitleCase(doc.TopElem.middlename);
    doc.Save();
}