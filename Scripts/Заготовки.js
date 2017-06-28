//Удаление документов
learnToDel = XQuery("sql:
		select l.id from active_learnings l join collaborators cs on cs.id = l.person_id and cs.is_dismiss = 1");

for (elem in learnToDel) {
	try {
		DeleteDoc(UrlFromDocID(elem.id));
	} catch (err) {}
}

for $elem in collaborators where doc-contains($elem/id, 'wt_data', '[flagForSync=true]','collaborators') return $elem