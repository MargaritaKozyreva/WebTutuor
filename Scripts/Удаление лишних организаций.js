//arr = OBJECTS_ID_STR.split(";")
//for (itemOrg in arr) {
itemsOrg = XQuery('for $elem in orgs return $elem');
for (itemOrg in itemsOrg) {
    itemsColl = XQuery("for $elem in collaborators where $elem/org_id='" + itemOrg.id + "' return $elem");
    if (ArrayCount(itemsColl) == 0) {
        itemsSub = XQuery("for $elem in subdivisions where $elem/org_id='" + itemOrg.id + "' return $elem");
        for (itemSub in itemsSub) {
            itemsPos = XQuery("for $elem in positions where $elem/org_id='" + itemOrg.id + "' and $elem/parent_object_id='" + itemSub.id + "' return $elem");
            for (itemPos in itemsPos) {
                DeleteDoc(UrlFromDocID(itemPos.id));
            }
            DeleteDoc(UrlFromDocID(itemSub.id));
        }
        DeleteDoc(UrlFromDocID(itemOrg.id));
    }
}