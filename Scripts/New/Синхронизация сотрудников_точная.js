//-=Раздел объявления переменных=-
logFileUrl = 'C:/Program Files/WebSoft/WebTutorServer/Log_custom/log_sync_';
processLines = 0;
anyError = [];
//--------------------------------------------------

//-=Раздел объявления функций=-

//Проверка присутствия сотрудника в базе
function checkUser(user) {
    tabNum = user.code;
    userCodeNum = Trim(String(tabNum).substr(5));
    usersSAP = XQuery("for $elem in cc_standartsapusers where $elem/code='" + userCodeNum + "' return $elem");
    if (ArrayCount(usersSAP) == 1) {
        userSAP = ArrayFirstElem(usersSAP);
        userDB = OpenDoc(UrlFromDocID(user.id));
        userDB.TopElem.lastname = StrTitleCase(String(userSAP.name).split(' ')[0]);
        userDB.TopElem.firstname = StrTitleCase(String(userSAP.name).split(' ')[1]);
        userDB.TopElem.middlename = StrTitleCase(String(userSAP.name).split(' ')[2]);
        userDB.TopElem.custom_elems.ObtainChildByKey("userCode").value = userCodeNum;
        linkOrg = findOrg(Trim(userSAP.nameorg));
        if (linkOrg.length == 2) {
            userDB.TopElem.org_id = linkOrg[0];
            linkDep = findDep(Trim(userSAP.codedep), linkOrg);
            if (linkDep.length == 2) {
                userDB.TopElem.position_parent_id = linkDep[0];
                pos = StrTitleCase(String(Trim(userSAP.namepos)).substr(0, 1)) + String(Trim(userSAP.namepos)).substr(1);
                linkPos = findPos(pos, linkOrg, linkDep);
                if (linkPos.length == 2) {
                    userDB.TopElem.position_id = linkPos[0];
                } else {
                    switch (linkPos[0]) {
                        case 0:
                            anyError.push('Не найдена должность ' + pos + '. Сотрудник с табельным номером ' + userCodeNum + ' не обработан');
                            return;
                        case 2:
                            anyError.push('Не удалось однозначно определить должность ' + pos + ' в WT. Сотрудник с табельным номером ' + userCodeNum + ' не обработан');
                            return;
                        default:
                            return;
                    }
                }
            } else {
                switch (linkDep[0]) {
                    case 0:
                        anyError.push('Не найдено подразделение с кодом ' + userSAP.codedep + '. Сотрудник с табельным номером ' + userCodeNum + ' не обработан');
                        return;
                    case 2:
                        anyError.push('Не удалось однозначно определить подразделение ' + userSAP.codedep + ' в WT. Сотрудник с табельным номером ' + userCodeNum + ' не обработан');
                        return;
                    default:
                        return;
                }
            }
        } else {
            switch (linkOrg[0]) {
                case 0:
                    anyError.push('Не удалось найти организацию ' + userSAP.nameorg + ' в WT. Сотрудник с табельным номером ' + userCodeNum + ' не обработан');
                    return;
                case 2:
                    anyError.push('Не удалось однозначно определить организацию ' + userSAP.nameorg + ' в WT. Сотрудник с табельным номером ' + userCodeNum + ' не обработан');
                    return;
                default:
                    return;
            }
        }
        try {
            userDB.Save();
            processLines += 1;
            return;
        } catch (e) {
            anyError.push('Невозможно обновить данные о сотруднике с табельным номером ' + userCodeNum + 'по причине:' + ExtractUserError(e));
        }
    } else if (ArrayCount(usersSAP) > 1) {
        anyError.push('Не удалось однозначно определить сотрудника с табельным номером ' + userCodeNum + ' в списке SAP. Сотрудник не обработан.');
        return;
    } else if (ArrayCount(usersSAP) == 0) {
        anyError.push('Не удалось найти сотрудника с табельным номером ' + userCodeNum + ' в списке SAP. Сотрудник не обработан.');
        return;
    }
}

//Поиск организации по имени в базе
function findOrg(orgName) {
    itemsOrg = XQuery("for $elem in orgs where $elem/name='" + orgName + "' return $elem");
    if (ArrayCount(itemsOrg) > 1) {
        return arr = [2];
    } else if (ArrayCount(itemsOrg) == 1) {
        return arr = [ArrayFirstElem(itemsOrg).id, ArrayFirstElem(itemsOrg).disp_name];
    } else return arr = [0];
}

//Поиск поздазделеия по имени в базе
function findDep(depCode, org) {
    itemsDep = XQuery("for $elem in subdivisions where $elem/code='" + Trim(depCode) + "' and $elem/org_id=" + org[0] + " return $elem");
    if (ArrayCount(itemsDep) > 1) {
        return arr = [2];
    } else if (ArrayCount(itemsDep) == 1) {
        return arr = [ArrayFirstElem(itemsDep).id, ArrayFirstElem(itemsDep).name];
    } else if (ArrayCount(itemsDep) == 0) {
        return arr = [0];
    }
}

//Поиск должности по имени в базе
function findPos(posName, org, dep) {
    itemsPos = XQuery("for $elem in positions where $elem/name='" + posName + "'and $elem/org_id=" + org[0] + " and $elem/parent_object_id=" + dep[0] + " return $elem");
    if (ArrayCount(itemsPos) > 1) {
        return arr = [2];
    } else if (ArrayCount(itemsPos) == 1) {
        return arr = [ArrayFirstElem(itemsPos).id, ArrayFirstElem(itemsPos).name];
    } else if (ArrayCount(itemsPos) == 0) {
        try {
            newPos = OpenNewDoc('x-local://wtv/wtv_position.xmd');
            newPos.BindToDb(DefaultDb);
            newPos.TopElem.name = posName;
            newPos.TopElem.org_id = Int(org[0]);
            newPos.TopElem.parent_object_id = Int(dep[0]);
            newPos.Save();
            return arr = [newPos.DocID, StrTitleCase(StrLowerCase(posName))];
        } catch (e) {
            return arr = [0];
        }
    }
}

//Вывод лога в файл
function writeLog(error) {
    resultStr = '';
    if (error.length > 0) {
        errorStr = '<b>Ошибки при обработке сотрудников:</b></br>';
        for (item in error) {
            errorStr += item + '</br>';
        }
        resultStr += errorStr;
    }
    try {
        PutFileData(logFileUrl + StrDate(Date(), false, false) + '.html', resultStr);
    } catch (e) {
        anyError.push('<b>!!!Невозможно создать лог-файл: ' + ExtractUserError(e) + '</b>');
        alert('Невозможно создать лог-файл: ' + ExtractUserError(e));
    }
}

//Отображение результатов обработки
function ShowMesssages() {
    anyError.push('</br><b>Обработано ' + processLines + ' сотрудников.<b/>');
    if (anyError.length == 0) {
        alert('Обработано ' + processLines + ' сотрудников.')
    } else {
        alert('Обработано ' + processLines + ' сотрудников. \nЕсть необработанные строки, см. файл-лог log_sync.');
    }
}
//**************************************

//-=Тело скрипта=-
users = XQuery("for $elem in collaborators where contains($elem/code, '1010/') return $elem");
for (user in users) {
    checkUser(user);
}
ShowMesssages();
writeLog(anyError);
//************************************