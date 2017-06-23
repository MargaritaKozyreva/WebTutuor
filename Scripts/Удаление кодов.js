users = XQuery('for $elem in collaborators return $elem');
for (i in users) {
	doc = OpenDoc(UrlFromDocID(i.id));
	doc.TopElem.code.Clear();
	doc.Save();
}





// arr = OBJECTS_ID_STR.split(";");

// for (sid in arr) {
	// idOrg = Int(sid);
	// users = XQuery('for $elem in collaborators return $elem');
	// for (i in users) {
		
	// }
	
	// if (ArrayCount(users) == 0) {
		// units = XQuery('for $elem in subdivisions where $elem/org_id="' + idOrg + '" return $elem');
                // //alert('units ' + ArrayCount(units));
		// if (ArrayOptFirstElem(units) != undefined) {
			// for (i in units) {
				// doc = OpenDoc(UrlFromDocID(i.id));
                                // //alert("Будет удалено у подразделения " + doc.TopElem.name);
				// doc.TopElem.org_id.Clear();
				// doc.Save();
			// }
		// }
		// posts = XQuery('for $elem in positions where $elem/org_id="' + idOrg + '" return $elem');
                // //alert('posts '+ArrayCount(posts));
		// if (ArrayOptFirstElem(posts) != undefined) {
			// for (i in posts) {
				// doc = OpenDoc(UrlFromDocID(i.id));
                                // //alert("Будет удалено у должности "+doc.TopElem.name);
				// doc.TopElem.org_id.Clear();
				// doc.Save();
			// }
		// }
		// try {
			// DeleteDoc(UrlFromDocID(idOrg));
		// } catch (err) {
			// alert "Невозможно удалить элемент справочника Организации"
		// }
	// }
// }