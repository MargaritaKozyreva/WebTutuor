var courses = XQuery("for $elem in active_learnings where $elem/state_id=2 return $elem");
var learningId;
for (course in courses) {
    doc = OpenDoc(UrlFromDocID(course.id));
    if (!StrContains(StrLowerCase(doc.TopElem.person_fullname), 'андросова') && !StrContains(StrLowerCase(doc.TopElem.person_fullname), 'якушин') && !StrContains(StrLowerCase(doc.TopElem.person_fullname), 'русаков') && !StrContains(StrLowerCase(doc.TopElem.person_fullname), 'администратор')) {
        learningId = tools.active_learning_finish(course.id);     
    } else {
        continue;
    }
    docNew = OpenDoc(UrlFromDocID(learningId));
    now = new Date();
    docNew.TopElem.last_usage_date = ParseDate(now);
    docNew.Save();
}