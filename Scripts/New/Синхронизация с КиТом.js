//-=Раздел объявления переменных=-
excelFileUrl = 'x-local:///c:/list.xls';//поменять путь
logFileUrl = 'c:/log.html';
userCode = 0;
fullName = 1;
dateBir = 2;
dateReceipt = 3;
position = 4;
depName = '';
orgName = 'ПАО "НЛМК"';
orgId = 6408110547964854611; //заменить на реальный DocID
logMsg = [];
//--------------------------------------------------

//-=Раздел объявления функций=-

function updateData(arr, dep) {
    statusDep = dataDep(arr, dep);
}

function dataDep(arrData, dept) {
    depts = XQuery("for $elem in subdivisions where $elem/name='" + dept + "' and $elem/org_id='" + orgId + "' return $elem");
    if (ArrayCount(depts) == 0) {
        newDep = createDep(dept);
        if (newDep.length == 2) {
            return arr = [newDep[0], newDep[1]];
        } else {
            return [0];
        }
    } else if (ArrayCount(depts) > 2) {
        logMsg.push('В организации найдено более 1 подразделения с названием ' + dept);
        return [2];
    } else {
        return arr = [ArrayFirstElem(depts).id, ArrayFirstElem(depts).name];
    }
}

function createDep(nameDep) {
    try {
        newDep = OpenNewDoc('x-local://wtv/wtv_subdivision.xmd');
        newDep.BindToDb(DefaultDb);
        newDep.TopElem.name = nameDep;
        newDep.TopElem.org_id = Int(orgId);
        newDep.Save();
        return arr = [newDep.DocID, nameDep];
    } catch (e) {
        logMsg.push('Не удалось создать новое позразделение по причине: ' + ExtractUserError(e));
        return arr = [0];
    }
}


//-=Тело скрипта=-
try {
    source = OpenDoc(excelFileUrl, 'format=excel');
} catch (e) {
    alert('Невозможно открыть исходник по причине: ' + ExtractUserError(e));
    return;
}
srcArr = ArrayFirstElem(source.TopElem);
for (var i = 0; i < ArrayCount(srcArr); i++) {
    if (srcArr[i][userCode] != '') {
        if (StrContains(StrLowerCase(srcArr[i][userCode]), 'итого по цеху')) {
            continue;
        } else if (srcArr[i][fullName] == '' && srcArr[i][position] == '') {
            depName = Trim(StrTitleCase(srcArr[i][userCode]));
            alert(depName);
        } else {
            //значит сотрудник
            users = XQuery("for $elem in collaborators where $elem/code='LP" + Trim(srcArr[i][userCode]) + "' return $elem");
            if (ArrayCount(users) == 0) {
                continue;
            } else if (ArrayCount(users) > 1) {
                logMsg.push('Множественное совпадение сотрудников по коду ' + ArrayFirstElem(users).code);
                statusUpdate = updateData(srcArr[i], depName);
                //обработка обновления данных по сотруднику
            } else {
                statusUpdate = updateData(srcArr[i], depName);
                //обработка обновления данных по сотруднику
            }
        }
    }
}