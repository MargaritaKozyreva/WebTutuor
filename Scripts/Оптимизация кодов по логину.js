arr = OBJECTS_ID_STR.split(";");

for (sid in arr) {
	id = Int(sid);
	doc = OpenDoc(UrlFromDocID(id));
	if (StrContains(doc.TopElem.login, 'DO')) {
		doc.TopElem.code = StrRangePos(doc.TopElem.login, 3, StrCharCount(doc.TopElem.login));
		doc.Save();
	}
}
