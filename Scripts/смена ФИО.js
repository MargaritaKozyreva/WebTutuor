excelFileUrl = 'x-local:///c:/Spisok.xls';
excelNumber = 0;
excelLastName = 1;
excelFirstName = 2;
excelMiddleName = 3;
excelPosition = 4;
countUpdates = 0;
sourceList = OpenDoc(excelFileUrl, 'format=excel');
lineArray = ArrayFirstElem(sourceList.TopElem);
for (var i = 0; i < ArrayCount(lineArray); i++) {
    numberCollaborator = lineArray[i][excelNumber];
    itemCollaborator = XQuery("for $elem in collaborators where $elem/code='LP" + String(Trim(lineArray[i][excelNumber])) + "' return $elem");
    for (item in itemCollaborator) {
        iid = item.id;
        doc = OpenDoc(UrlFromDocID(iid));

        lastName = String(lineArray[i][excelLastName]).substr(0, 1);
        lastName2 = String(lineArray[i][excelLastName]).substr(1).toLowerCase();
        doc.TopElem.lastname = lastName + lastName2;
        firstName = String(lineArray[i][excelFirstName]).substr(0, 1);
        firstName2 = String(lineArray[i][excelFirstName]).substr(1).toLowerCase();
        doc.TopElem.firstname = firstName + firstName2;
        middleName = String(lineArray[i][excelMiddleName]).substr(0, 1);
        middleName2 = String(lineArray[i][excelMiddleName]).substr(1).toLowerCase();
        doc.TopElem.middlename = middlename + middleName2;

        org_id = '6416260586651722860';
        subdivision_id = '6425886888702210378';

        itemPosition = XQuery("for $elem in positions where $elem/org_id='" + org_id + "' and $elem/parent_object_id='" + subdivision_id + "' and $elem/name='" + lineArray[i][excelPosition] + "' return $elem");
        for (itemP in itemPosition) {
            doc.TopElem.position_id = itemP.id;
            doc.TopElem.position_name = itemP.name;
            doc.TopElem.position_parent_id = itemP.parent_object_id;
            doc.TopElem.position_parent_name = itemP.parent_object_id.ForeignElem.name;
            doc.TopElem.org_id = itemP.org_id;
            doc.TopElem.org_name = itemP.org_id.ForeignElem.name;
        }

        doc.Save();
        countUpdates = countUpdates + 1;
    }
}
alert("Выполнено замен:" + countUpdates);