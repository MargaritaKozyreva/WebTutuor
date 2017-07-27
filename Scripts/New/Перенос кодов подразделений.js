alert("Агент стартовал");
for (var i = 1; i < 401; i++) {
    arr = XQuery("for $elem in subdivisions where doc-contains($elem/id, 'wt-data', '[tabCode=" + i + "]', 'subdivision') return $elem");
    if (ArrayCount(arr) > 0) {
        if (ArrayCount(arr) > 1)
            alert('Неоднозначно опеределено подразделение ' + i);
        for (dep in arr) {
            doc = OpenDoc(UrlFromDocID(dep.id));
            doc.TopElem.code = i;
            doc.Save();
        }
    }
}
alert("Агент выполнен");
