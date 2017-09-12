//-=Раздел объявления переменных=-
excelFileUrl = 'x-local:///c:/pololin_sa/Docs/Заявки/Заявка шаблон/С портала/order.xls';
logFileUrl = 'c:/log.html';
userCode = 0;
fullName = 1;
orgName = 2;
depName = 3;
posName = 4;
passUser = 5;
emailUser = 6;
processLines = 0;
codeOrgStruct = {};
codeLoginStruct = {};
multipleUsers = [];
duplicateUser = [];
anyError = [];
//--------------------------------------------------

//-=Раздел объявления функций=-

//Инициализация структуры префиксов кодов организаций
function initCodeOrgStructure() {
    codeOrgStruct['АО "НЛМК-Инжиниринг"'] = 'F050';
    codeOrgStruct['АО "НЛМК-Урал"'] = '5010';
    codeOrgStruct['ОАО "УралНИИАС"'] = 'F033';
    codeOrgStruct['ОАО "АЛТАЙ-КОКС"'] = '3010';
    codeOrgStruct['ОАО "ВИЗ"'] = 'F034';
    codeOrgStruct['ОАО "Вторчермет"'] = 'F013';
    codeOrgStruct['ОАО "ДОЛОМИТ"'] = 'F007';
    codeOrgStruct['ОАО "СТАГДОК"'] = 'F008';
    codeOrgStruct['ОАО "СТОЙЛЕНСКИЙ  ГОК"'] = '2010';
    codeOrgStruct['ОАО "Чувашвтормет"'] = 'F032';
    codeOrgStruct['ООО "ГОК "Жерновский - 1"'] = '2020';
    codeOrgStruct['ООО "ГОК "Усинский - 3"'] = '2030';
    codeOrgStruct['ООО "ВИЗ-СТАЛЬ"'] = '1020';
    codeOrgStruct['ООО "Торговый дом НЛМК"'] = '9020';
    codeOrgStruct['ООО "Вторчермет НЛМК Башкортостан"'] = 'F018';
    codeOrgStruct['ООО "Вторчермет НЛМК Волга"'] = 'F019';
    codeOrgStruct['ООО "Вторчермет НЛМК Восток"'] = 'F020';
    codeOrgStruct['ООО "Вторчермет НЛМК Запад"'] = 'F022';
    codeOrgStruct['ООО "Вторчермет НЛМК Западная Сибирь"'] = 'F023';
    codeOrgStruct['ООО "Вторчермет НЛМК Пермь"'] = 'F024';
    codeOrgStruct['ООО "Вторчермет НЛМК Поволжье"'] = 'F025';
    codeOrgStruct['ООО "Вторчермет НЛМК Республика"'] = 'F026';
    codeOrgStruct['ООО "Вторчермет НЛМК Север"'] = 'F027';
    codeOrgStruct['ООО "Вторчермет НЛМК Сибирь"'] = 'F028';
    codeOrgStruct['ООО "Вторчермет НЛМК Урал"'] = 'F012';
    codeOrgStruct['ООО "Вторчермет НЛМК Центр"'] = 'F030';
    codeOrgStruct['ООО "Вторчермет НЛМК Черноземье"'] = 'F031';
    codeOrgStruct['ООО "Вторчермет НЛМК Юг"'] = 'F021';
    codeOrgStruct['ООО "Вторчермет НЛМК"'] = 'F014';
    codeOrgStruct['ООО "ГАЗОБЕТОН 48"'] = 'F006';
    codeOrgStruct['ООО "НЛМК-ИТ"'] = '9010';
    codeOrgStruct['ООО "НЛМК-КАЛУГА"'] = '5020';
    codeOrgStruct['ООО "НЛМК-МЕТИЗ"'] = '5030';
    codeOrgStruct['ООО "НЛМК-Связь"'] = '9030';
    codeOrgStruct['ООО "НЛМК-Сорт"'] = 'F017';
    codeOrgStruct['ООО "НЛМК-Урал Сервис"'] = '4010';
    codeOrgStruct['ООО "НЛМК-УЧЕТНЫЙ ЦЕНТР"'] = 'F001';
    codeOrgStruct['ООО "НОВОЛИПЕЦКАЯ МЕТАЛЛОБАЗА"'] = 'F009';
    codeOrgStruct['ООО "ПО Татвторчермет"'] = 'F029';
    codeOrgStruct['ООО "СТРОИТЕЛЬНО-МОНТАЖНЫЙ ТРЕСТ НЛМК"'] = 'F011';
    codeOrgStruct['ПАО "НЛМК"'] = '1010';
    //codeOrgStruct['ОАО "НСММЗ"'] = 'EK';
    //codeOrgStruct['ООО "НПД"'] = 'LP';
}

//Проверка присутствия сотрудника в базе
function checkUser(arr) {
    arrOrgs = XQuery("for $elem in orgs where $elem/name='" + arr[orgName] + "' return $elem");
    arrCount = ArrayCount(arrOrgs);
    if (arrCount > 1) {
        anyError.push('Найдено более одной организации ' + arr[orgName] + '. Строка с номером ' + processLines);
        return 3;
    } else if (arrCount = 1) {
        for (org in orgs) {
            orgID = org.id;
        }
    } else if (arrCount = 0) {
        anyError.push('не найдено ни одной организации с названием ' + arr[orgName] + '. Строка с номером ' + processLines);
        return 4;
    }

    arrUsers = XQuery("for $elem in collaborators where $elem/org_id=" + orgID + " and $elem/code='" + Trim(codeOrgStruct[arr[orgName]]) + "/" + Trim(arr[userCode]) + "' return $elem");
    arrCount = ArrayCount(arrUsers);
    if (arrCount > 0) {
        for (user in arrUsers) {
            try {
                doc = OpenDoc(UrlFromDocID(user.id));

                if ((Trim(arr[passUser]) == '' || Trim(arr[passUser]) == '-$R#-') && doc.TopElem.password == '') {
                    doc.TopElem.change_password = true;
                }
                //if (doc.TopElem.password == '') {
                doc.TopElem.password = Trim(arr[passUser]);
                //doc.TopElem.change_password = false;
                //}

                //if (codeOrgStruct[arr[orgName]] != 'LP') {
                try {
                    doc.TopElem.lastname = StrTitleCase(String(arr[fullName]).split(' ')[0]);
                    doc.TopElem.firstname = StrTitleCase(String(arr[fullName]).split(' ')[1]);
                    doc.TopElem.middlename = StrTitleCase(String(arr[fullName]).split(' ')[2]);
                } catch (e) {
                    anyError.push('Неверный формат ФИО ' + arr[fullName]);
                    continue;
                }
                //}
                doc.TopElem.email = StrLowerCase(arr[emailUser]);
                doc.Save();
            } catch (e) {
                anyError.push('Не удалось обновить информацию о сотруднике с кодом ' + codeOrgStruct[arr[orgName]] + arr[userCode] + ' по причине: ' + ExtractUserError(e));
            }
        }
        if (arrCount == 1) {
            return 1;
        } else if (arrCount > 1) {
            return 2;
        }
    } else if (arrCount == 0) {
        return 0;
    }
}

//Поиск организации по имени в базе
function findOrg(orgName) {
    itemsOrg = XQuery("for $elem in orgs where $elem/name='" + Trim(orgName) + "' return $elem");
    if (ArrayCount(itemsOrg) > 1) {
        return arr = [2];
    } else if (ArrayCount(itemsOrg) == 1) {
        return arr = [ArrayFirstElem(itemsOrg).id, ArrayFirstElem(itemsOrg).disp_name];
    } else return arr = [0];
}

//Поиск поздазделеия по имени в базе
function findDep(depCode, depName, org) {
    if (depCode == 0) {
        itemsDep = XQuery("for $elem in subdivisions where $elem/name='" + Trim(depName) + "' and $elem/org_id=" + org[0] + " return $elem");
    } else {
        itemsDep = XQuery("for $elem in subdivisions where $elem/code='" + Trim(depCode) + "' and $elem/org_id=" + org[0] + " return $elem");
    }
    if (ArrayCount(itemsDep) > 1) {
        return arr = [2];
    } else if (ArrayCount(itemsDep) == 1) {
        return arr = [ArrayFirstElem(itemsDep).id, ArrayFirstElem(itemsDep).name];
    } else if (ArrayCount(itemsDep) == 0) {
        try {
            newDep = OpenNewDoc('x-local://wtv/wtv_subdivision.xmd');
            newDep.BindToDb(DefaultDb);
            if (depCode != 0) {
                newDep.TopElem.code = depCode;
            } else {
                if (org[1] == 'ПАО НЛМК') {
                    newDep.TopElem.code = '!temp';
                }
            }
            newDep.TopElem.name = depName;
            newDep.TopElem.org_id = Int(org[0]);
            newDep.Save();

            return arr = [newDep.DocID, depName];
        } catch (e) {
            alert('Не удалось создать новое позразделение по причине: ' + ExtractUserError(e));
            return arr = [0];
        }
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
            newPos.TopElem.name = StrTitleCase(StrLowerCase(posName));
            newPos.TopElem.org_id = Int(org[0]);
            newPos.TopElem.parent_object_id = Int(dep[0]);
            if (org[1] == 'ПАО НЛМК') {
                //newPos.TopElem.code = '!delete';
                //newPos.TopElem.custom_elems.ObtainChildByKey('flagDelete').value = true;
            }
            newPos.Save();
            return arr = [newPos.DocID, StrTitleCase(StrLowerCase(posName))];
        } catch (e) {
            return arr = [0];
        }
    }
}

//Вывод лога в файл
function writeLog(multiple, duplicate, error) {
    resultStr = '';
    if (error.length > 0) {
        errorStr = '<b>Критические ошибки при обработке Excel:</b></br>';
        for (item in error) {
            errorStr += item + '</br>';
        }
        resultStr += errorStr;
    }
    if (multiple.length > 0) {
        multipleStr = '<b>Не удалось однозначно опеределить сотрудников в БД:</b></br>';
        for (item in multiple) {
            multipleStr += item + '</br>';
        }
        resultStr += multipleStr;
    }
    if (duplicate.length > 0) {
        duplicateStr = '<b>Сотрудники, присутствующие в БД (повторные записи из загружаемого списка):</b></br>';
        for (item in duplicate) {
            duplicateStr += item + '</br>';
        }
        resultStr += duplicateStr;
    }
    try {
        PutFileData(logFileUrl, resultStr);
    } catch (e) {
        alert('Невозможно создать лог-файл: ' + ExtractUserError(e));
    }
}

//Отображение результатов обработки
function ShowMesssages() {
    if (multipleUsers.length == 0 && duplicateUser.length == 0 && anyError.length == 0) {
        alert('Загружено ' + processLines + ' сотрудников.')
    } else {
        alert('Загружено ' + processLines + ' новых сотрудников. \nЕсть необработанные строки, см. файл-лог C:\\log.html.');
    }
}
//**************************************

//-=Тело скрипта=-
initCodeOrgStructure();
try {
    sourceList = OpenDoc(excelFileUrl, 'format=excel');
} catch (e) {
    alert('Невозможно открыть файл с данными: ' + ExtractUserError(e));
    return;
}
lineArray = ArrayFirstElem(sourceList.TopElem);
for (var i = 0; i < ArrayCount(lineArray); i++) {
    if (i == 0) continue;
    flagPAO = false;
    objUser = checkUser(lineArray[i]);
    if (objUser == 2) {
        multipleUsers.push('Строка ' + Int(i + 1) + ': табельный номер ' + String(lineArray[i][userCode]) + ', организация ' + lineArray[i][orgName]);
    } else if (objUser == 0) {
        //новый юзер
        try {
            newUser = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
            newUser.BindToDb(DefaultDb);

            newUser.TopElem.code = codeOrgStruct[lineArray[i][orgName]] + "/" + Trim(lineArray[i][userCode]);
            newUser.TopElem.custom_elems.ObtainChildByKey("userCode").value = Trim(lineArray[i][userCode]);

            //if (codeOrgStruct[lineArray[i][orgName]] == 'LP') {
            //    newUser.TopElem.login = 'DO*' + Trim(lineArray[i][userCode]);
            //} else {
            newUser.TopElem.login = codeOrgStruct[lineArray[i][orgName]] + '*' + Trim(lineArray[i][userCode]);
            //}

            if (lineArray[i][passUser] == '-$R#-' || lineArray[i][passUser] == '') {
                newUser.TopElem.change_password = true;
                newUser.TopElem.password = '';
            } else {
                newUser.TopElem.password = lineArray[i][passUser];
            }

            newUser.TopElem.email = StrLowerCase(Trim(lineArray[i][emailUser]));

            if (lineArray[i][orgName] == 'ПАО "НЛМК"') {
                usersSAP = XQuery("for $elem in cc_standartsapusers where $elem/code='" + lineArray[i][userCode] + "' return $elem");
                if (ArrayCount(usersSAP) == 1) {
                    userSAP = ArrayFirstElem(usersSAP);
                    if (StrLowerCase(String(userSAP.name).split(' ')[0]) == StrLowerCase(String(lineArray[i][fullName]).split(' ')[0])) {
                        flagPAO = true;
                    } else {
                        anyError.push('Строка ' + i + ': сотрудник с табельным номером ' + lineArray[i][userCode] + ' не прошел проверку в SAP. Сотрудник не обработан.');
                        continue;
                    }
                } else if (ArrayCount(usersSAP) > 1) {
                    anyError.push('Не удалось однозначно определить сотрудника с табельным номером ' + lineArray[i][userCode] + ' в списке SAP. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                    continue;
                } else if (ArrayCount(usersSAP) == 0) {
                    anyError.push('Не удалось найти сотрудника с табельным номером ' + lineArray[i][userCode] + ' в списке SAP. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                    continue;
                }
            }

            arrFIO = [];
            if (flagPAO) {
                arr = String(userSAP.name).split(' ');
            } else {
                arr = String(lineArray[i][fullName]).split(' ');
            }

            for (k = 0; k < ArrayCount(arr); k++) {
                if (arr[k] != '') arrFIO.push(arr[k]);
            }
            try {
                newUser.TopElem.lastname = StrTitleCase(String(Trim(arrFIO[0])));
                newUser.TopElem.firstname = StrTitleCase(String(Trim(arrFIO[1])));
                newUser.TopElem.middlename = StrTitleCase(String(Trim(arrFIO[2])));
            } catch (e) {
                logCreateUser += 'Не верный формат поля ФИО в исходном документе у сотрудника ' + source[i][fullName] + '. Сотрудник не обработан.';
                break;
            }

            if (flagPAO) {
                linkOrg = findOrg(Trim(userSAP.nameorg));
            } else {
                linkOrg = findOrg(Trim(lineArray[i][orgName]));
            }
            if (linkOrg.length == 2) {
                newUser.TopElem.org_id = linkOrg[0];
                newUser.TopElem.org_name = linkOrg[1];
                if (flagPAO) {
                    linkDep = findDep(Trim(userSAP.codedep), Trim(userSAP.namedep), linkOrg);
                } else {
                    linkDep = findDep(0, lineArray[i][depName], linkOrg);
                }
                if (linkDep.length == 2) {
                    newUser.TopElem.position_parent_id = linkDep[0];
                    newUser.TopElem.position_parent_name = linkDep[1];
                    if (flagPAO) {
                        pos = StrTitleCase(String(Trim(userSAP.namepos)).substr(0, 1)) + String(Trim(userSAP.namepos)).substr(1);
                    } else {
                        pos = StrTitleCase(String(Trim(lineArray[i][posName])).substr(0, 1)) + String(Trim(lineArray[i][posName])).substr(1);
                    }
                    linkPos = findPos(pos, linkOrg, linkDep);
                    if (linkPos.length == 2) {
                        newUser.TopElem.position_id = linkPos[0];
                        newUser.TopElem.position_name = linkPos[1];
                    } else {
                        switch (linkPos[0]) {
                            case 0:
                                anyError.push('Не создана должность ' + lineArray[i][posName] + '. Сотрудник из строки ' + Int(i + 1) + ' не обработан');
                                break;
                            case 2:
                                anyError.push('Не удалось однозначно определить должность ' + lineArray[i][posName] + ' в WT. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                } else {
                    switch (linkDep[0]) {
                        case 0:
                            anyError.push('Не создано подразделение ' + lineArray[i][depName] + '. Сотрудник из строки ' + Int(i + 1) + ' не обработан');
                            break;
                        case 2:
                            anyError.push('Не удалось однозначно определить подразделение ' + lineArray[i][depName] + ' в WT. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                            break;
                        default:
                            break;
                    }
                    continue;
                }
            } else {
                switch (linkOrg[0]) {
                    case 0:
                        anyError.push('Не удалось найти организацию ' + lineArray[i][orgName] + ' в WT. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                        break;
                    case 2:
                        anyError.push('Не удалось однозначно определить организацию ' + lineArray[i][orgName] + ' в WT. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                        break;
                    default:
                        break;
                }
                continue;
            }
            newUser.Save();
        } catch (e) {
            alert('Невозможно создать нового сотрудника: ' + ExtractUserError(e));
            break;
        }
        processLines += 1;
    } else if (objUser == 1) {
        //есть юзер
        duplicateUser.push('Строка ' + Int(i + 1) + ': табельный номер ' + lineArray[i][userCode] + ', организация ' + lineArray[i][orgName]);
    } else if ((objUser == 3) || (objUser == 4)) {
        break;
    }
}

writeLog(multipleUsers, duplicateUser, anyError);
ShowMesssages();
//************************************