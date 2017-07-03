//-=Раздел объявления переменных=-
logFileUrl = 'c:/log.html';
userCode = 0;
fullName = 1;
dateBir = 2;
dateReceipt = 3;
position = 8;
orgName = '';
orgId = 0;
logMsg = [];
depDel = [];
posDel = [];
//--------------------------------------------------


//-=Раздел объявления функций=-
function searchOrg() {
    itemsOrg = XQuery("for $elem in orgs where $elem/name='ПАО \"НЛМК\"' and $elem/disp_name='ПАО НЛМК' return $elem");
    if (ArrayCount(itemsOrg) > 1) {
        logMsg.push('Не удалось однозначно опеределить организацию. Обработка прервана');
        return [2];
    } else if (ArrayCount(itemsOrg) == 1) {
        orgId = Int(ArrayFirstElem(itemsOrg).id);
        orgName = ArrayFirstElem(itemsOrg).disp_name
        return arr = [1];
    } else {
        logMsg.push('Не удалось найти организацию. Обработка прервана');
        return [0];
    }
}

function processUpdate(srcArr, depName, posName, user) {
    procUpdate = updateData(depName, posName);
    if (procUpdate.length == 4) {
        try {
            doc = OpenDoc(UrlFromDocID(user.id));
            name = String(Trim(srcArr[fullName])).split(' ');
            doc.TopElem.lastname = String(StrTitleCase(name[0]));
            doc.TopElem.firstname = String(StrTitleCase(name[1]));
            doc.TopElem.middlename = String(StrTitleCase(name[2]));
            doc.TopElem.org_id = Int(orgId);
            doc.TopElem.org_name = orgName;
            doc.TopElem.position_parent_id = Int(procUpdate[0]);
            doc.TopElem.position_parent_name = procUpdate[1];
            doc.TopElem.position_id = Int(procUpdate[2]);
            doc.TopElem.position_name = procUpdate[3];
            doc.TopElem.custom_elems.ObtainChildByKey("userCode").value = String(Trim(srcArr[userCode]));
            doc.TopElem.custom_elems.ObtainChildByKey("flagForSync").value = false;
            doc.Save();
            return 1;
        } catch (e) {
            logMsg.push('Не удалось обновить данные сотрудника с кодом LP' + Trim(srcArr[userCode]) + ' по причине: ' + ExtractUserError(e));
            return 0;
        }
    } else {
        logMsg.push('Не удалось корректно свзять структуру подразделений для сотрудника ' + srcArr[fullName]);
        return 0;
    }
}

function updateData(dep, pos) {
    statusDep = dataDep(dep);
    if (statusDep.length == 2) {
        statusPos = dataPos(statusDep, pos);
        if (statusPos.length != 2) {
            return [0];
        }
    } else {
        return [0];
    }
    return arr = [statusDep[0], statusDep[1], statusPos[0], statusPos[1]];
}

function dataDep(dept) {
    depts = XQuery("for $elem in subdivisions where $elem/name='" + dept + "' and $elem/org_id=" + orgId + " return $elem");
    if (ArrayCount(depts) == 0) {
        newDep = createDep(dept);
        if (newDep.length == 2) {
            return arr = [newDep[0], newDep[1]];
        } else {
            return [0];
        }
    } else if (ArrayCount(depts) > 1) {
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

function dataPos(dept, pos) {
    poss = XQuery("for $elem in positions where $elem/name='" + pos + "' and $elem/org_id=" + orgId + " and $elem/parent_object_id=" + dept[0] + " return $elem");
    if (ArrayCount(poss) == 0) {
        newPos = createPos(dept[0], pos);
        if (newPos.length == 2) {
            return arr = [newPos[0], newPos[1]];
        } else {
            return [0];
        }
    } else if (ArrayCount(poss) > 1) {
        logMsg.push('В подразделении ' + dept[1] + ' организации найдено более 1 должности с названием ' + pos);
        return [2];
    } else {
        return arr = [ArrayFirstElem(poss).id, ArrayFirstElem(poss).name];
    }
}

function createPos(deptId, namePos) {
    try {
        newPos = OpenNewDoc('x-local://wtv/wtv_position.xmd');
        newPos.BindToDb(DefaultDb);
        newPos.TopElem.name = namePos;
        newPos.TopElem.org_id = Int(orgId);
        newPos.TopElem.parent_object_id = Int(deptId);
        newPos.Save();
        return arr = [newPos.DocID, namePos];
    } catch (e) {
        logMsg.push('Не удалось создать новую должность по причине: ' + ExtractUserError(e));
        return arr = [0];
    }
}

function writeLog() {
    logLine = '';
    for (var i = 0; i < ArrayCount(logMsg); i++) {
        logLine += logMsg[i] + '</br>';
    }
    try {
        PutFileData(logFileUrl, logLine);
    } catch (e) {
        alert('!Синхронизация с КиТ. Невозможно создать лог-файл: ' + ExtractUserError(e));
    }
}
//------------------------------------------------


//-=Тело скрипта=-
alert('!Синхронизация с КиТ. Обработка стартовала.');
linkSourceFile = XQuery("for $elem in resources where $elem/code='listKiT' return $elem");
itemFile = ArrayFirstElem(linkSourceFile);
docResource = OpenDoc(UrlFromDocID(itemFile.id));
excelFileUrl = docResource.TopElem.file_url;
try {
    source = OpenDoc(excelFileUrl, 'format=excel');
} catch (e) {
    alert("Невозможно открыть документ " + excelFileUrl + " из БД по причине: " + ExtractUserError(e));
}
arrSrc = [];
srcArr = ArrayFirstElem(source.TopElem);
//массив из xls
for (i = 0; i < ArrayCount(srcArr); i++) {
    arrSrc.push(String(Trim(srcArr[i][userCode])));
}

statusOrg = searchOrg();
if (statusOrg[0] == 1) {
    usersForUpdate = XQuery("for $elem in collaborators where doc-contains($elem/id, 'wt_data', '[flagForSync=true]','collaborators') and contains($elem/code, 'LP') return $elem");
    arrUpd = [];
    if (ArrayCount(usersForUpdate) > 0) {
        //массив из юзеров
        for (userUpd in usersForUpdate) {
            arrUpd.push(userUpd.code);
        }
        for (j = 0; j < ArrayCount(arrUpd); j++) {
            if (arrSrc.indexOf(arrUpd[j]) != -1) {

            }
        }
    }

    if (ArrayCount(usersForUpdate) > 0) {
        for (user in usersForUpdate) {
            statusUpdate = 666;
            Doc = OpenDoc(UrlFromDocID(user.id));
            code = Doc.TopElem.code;
            for (j = 0; j < ArrayCount(srcArr); j++) {
                if (srcArr[j][userCode] != '') {
                    if (StrContains(StrLowerCase(srcArr[j][userCode]), 'итого')) {
                        continue;
                    } else if (srcArr[j][fullName] == '' && srcArr[j][position] == '') {
                        depName = Trim(StrTitleCase(srcArr[j][userCode]));
                        continue;
                    } else if (('LP' + String(Trim(srcArr[j][userCode]))) == code) {
                        statusUpdate = processUpdate(srcArr[j], depName, Trim(StrTitleCase(srcArr[j][position])), user);
                        if (statusUpdate == 1) {
                            logMsg.push('Обновлена информация о сотруднике с кодом LP' + srcArr[j][userCode] + ' с сотрудником из xls.');
                        }
                        break;
                    }
                }
            }
            if (statusUpdate == 666) {
                logMsg.push('Не удалось сопоставить сотрудника с кодом ' + code + ' с сотрудником из xls.');
                Doc.TopElem.custom_elems.ObtainChildByKey("isDismiss").value = true;
                Doc.Save();
            }
        }
    } else {
        alert('!Синхронизация с КиТ. Нет сотрудников для обновления.')
    }
} else {
    alert('!Синхронизация с КиТ. Обработка прервана из-за ошибки: не найдено организация.')
}

if (ArrayCount(logMsg) > 0) {
    writeLog();
    alert('!Синхронизация с КиТ. Обработка завершена. См. лог-файл')
} else {
    alert('!Синхронизация с КиТ. Обработка завершена.');
}

//----------------------------------------------