var NOTIFICATION = "7_5";
var courses = XQuery("for $elem in active_learnings where $elem/state_id=2 return $elem");
var learningId, responses;
for (course in courses) {
    if (!StrContains(StrLowerCase(course.person_fullname), 'андросова') && !StrContains(StrLowerCase(course.person_fullname), 'якушин') && !StrContains(StrLowerCase(course.person_fullname), 'русаков') && !StrContains(StrLowerCase(course.person_fullname), 'администратор')) {
        doc = OpenDoc(UrlFromDocID(course.course_id)).TopElem;
        if (doc.default_response_type_id.HasValue && doc.mandatory_fill_response) {
            responses = XQuery("for $elem in responses where $elem/object_id = " + course.course_id + " and $elem/person_id = " + course.person_id + " return $elem");
            if (ArrayCount(responses) == 1) {
                learningId = tools.active_learning_finish(course.id);
                docNew = OpenDoc(UrlFromDocID(learningId));
                now = new Date();
                docNew.TopElem.last_usage_date = ParseDate(now);
                docNew.Save();
            } else if (ArrayCount(responses) == 0) {
                tools.create_notification(NOTIFICATION, course.id);
            }
        }
    } else {
        continue;
    }
}
