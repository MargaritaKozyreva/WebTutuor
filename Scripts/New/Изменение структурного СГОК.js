orgId = 6429264743535740120;
orgName = 'СТОЙЛЕНСКИЙ ГОК';
newDepName = '';
newDepId = '';
newPosId = '';
newPosName = '';
users = XQuery("for $elem in collaborators where contains($elem/login,'DO*SG*') return $elem");
for (user in users) {
    curOrg = String(Trim(OpenDoc(UrlFromDocID(user.id)).TopElem.org_name));
    deps = XQuery("for $elem in subdivisions where $elem/name='" + curOrg + "' and $elem/org_id=" + orgId + " return $elem");
    if (ArrayCount(deps) == 1) {
        //нашли
        newDepId = ArrayFirstElem(deps).id;
        newDepName = ArrayFirstElem(deps).name;
    } else {
        //создали
        newDep = OpenNewDoc('x-local://wtv/wtv_subdivision.xmd');
        newDep.BindToDb(DefaultDb);
        newDep.TopElem.name = curOrg;
        newDep.TopElem.org_id = orgId;
        newDep.Save();
    }

    curPos = String(Trim(StrTitleCase(OpenDoc(UrlFromDocID(user.id)).TopElem.position_name)));
    poss = XQuery("for $elem in positions where $elem/name='" + curPos + "' and $elem/org_id=" + orgId + " and $elem/parent_object_id=" + (newDepId == '' ? newDep.DocID : Int(newDepId)) + " return $elem");
    if (ArrayCount(poss) == 1) {
        //нашли
        newPosId = ArrayFirstElem(poss).id;
        newPosName = ArrayFirstElem(poss).name;
    } else {
        //создали
        newPos = OpenNewDoc('x-local://wtv/wtv_position.xmd');
        newPos.BindToDb(DefaultDb);
        newPos.TopElem.name = curPos;
        newPos.TopElem.org_id = orgId;
        newPos.TopElem.parent_object_id = (newDepId == '' ? newDep.DocID : Int(newDepId));
        newPos.Save();
    }

    doc = OpenDoc(UrlFromDocID(user.id));
    doc.TopElem.position_parent_id = (newDepId == '' ? newDep.DocID : Int(newDepId));
    doc.TopElem.position_parent_name = (newDepName == '' ? curOrg : newDepName);
    doc.TopElem.org_id = orgId;
    doc.TopElem.org_name = orgName;
    doc.TopElem.position_id = (newPosId == '' ? newPos.DocID : Int(newPosId))
    doc.TopElem.position_name = (newPosName == '' ? curPos : newPosName)
    doc.Save();
    newDepName = '';
    newDepId = '';
    newPosId = '';
    newPosName = '';
}