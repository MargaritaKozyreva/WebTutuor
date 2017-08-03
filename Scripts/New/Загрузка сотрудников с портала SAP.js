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
    codeOrgStruct['ПАО "НЛМК"'] = 'LP';
    codeOrgStruct['ООО "НЛМК-ИТ"'] = 'LP';
    codeOrgStruct['ОАО "СТОЙЛЕНСКИЙ  ГОК"'] = 'SG';
    codeOrgStruct['ООО "ВИЗ-СТАЛЬ"'] = 'EK';
    codeOrgStruct['ОАО "АЛТАЙ-КОКС"'] = 'AK';
    codeOrgStruct['ООО "НЛМК-Сорт"'] = 'EK';
    codeOrgStruct['ООО "НЛМК-УЧЕТНЫЙ ЦЕНТР"'] = 'LP';
    codeOrgStruct['ООО "ГАЗОБЕТОН 48"'] = 'LP';
    codeOrgStruct['АО "НЛМК - Инжиниринг"'] = 'LP';
    codeOrgStruct['ООО "НЛМК-КАЛУГА"'] = 'KG';
    codeOrgStruct['ООО "НЛМК-МЕТИЗ"'] = 'EK';
    codeOrgStruct['ОАО "НСММЗ"'] = 'EK';
    codeOrgStruct['ООО "НЛМК-Урал Сервис"'] = 'EK';
    codeOrgStruct['АО "НЛМК-Урал"'] = 'EK';
    codeOrgStruct['ОАО "ВИЗ"'] = 'EK';
    codeOrgStruct['ОАО "УралНИИАС"'] = 'EK';
    codeOrgStruct['ООО "НЛМК-Связь"'] = 'LP';
    codeOrgStruct['ООО "НПД"'] = 'LP';
    codeOrgStruct['ОАО "ДОЛОМИТ"'] = 'LP';
    codeOrgStruct['ОАО "СТАГДОК"'] = 'LP';
    codeOrgStruct['ООО "Торговый дом НЛМК"'] = 'LP';
}

//Проверка присутствия сотрудника в базе
function checkUser(arr) {
    arrUsers = XQuery("for $elem in collaborators where $elem/code='" + codeOrgStruct[arr[orgName]] + arr[userCode] + "' return $elem");
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
                doc.TopElem.change_password = false;
                //}

                if (codeOrgStruct[arr[orgName]] != 'LP') {
                    try {
                        doc.TopElem.lastname = StrTitleCase(String(arr[fullName]).split(' ')[0]);
                        doc.TopElem.firstname = StrTitleCase(String(arr[fullName]).split(' ')[1]);
                        doc.TopElem.middlename = StrTitleCase(String(arr[fullName]).split(' ')[2]);
                    } catch (e) {
                        anyError.push('Неверный формат ФИО ' + arr[fullName]);
                        continue;
                    }
                }
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
    itemsOrg = XQuery("for $elem in orgs where $elem/name='" + orgName + "' return $elem");
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
    flagPAO = false;
    objUser = checkUser(lineArray[i]);
    if (objUser == 2) {
        multipleUsers.push('Строка ' + Int(i + 1) + ': табельный номер ' + String(lineArray[i][userCode]) + ', организация ' + lineArray[i][orgName]);
    } else if (objUser == 0) {
        //новый юзер
        try {
            newUser = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
            newUser.BindToDb(DefaultDb);

            newUser.TopElem.code = codeOrgStruct[lineArray[i][orgName]] + Trim(lineArray[i][userCode]);
            newUser.TopElem.custom_elems.ObtainChildByKey("userCode").value = Trim(lineArray[i][userCode]);

            if (codeOrgStruct[lineArray[i][orgName]] == 'LP') {
                newUser.TopElem.login = 'DO*' + Trim(lineArray[i][userCode]);
            } else {
                newUser.TopElem.login = 'DO*' + codeOrgStruct[lineArray[i][orgName]] + '*' + Trim(lineArray[i][userCode]);
            }

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
                        anyError.push('Строка '+ i +': сотрудник с табельным номером ' + lineArray[i][userCode] + ' не прошел проверку в SAP. Сотрудник не обработан.');
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
                newUser.TopElem.lastname = arrFIO[0];
                newUser.TopElem.firstname = arrFIO[1];
                newUser.TopElem.middlename = arrFIO[2];
            } catch (e) {
                logCreateUser += 'Не верный формат поля ФИО в исходном документе у сотрудника ' + source[i][fullName] + '. Сотрудник не обработан.'
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
    } else if (objUser == 1)
        //есть юзер
        duplicateUser.push('Строка ' + Int(i + 1) + ': табельный номер ' + lineArray[i][userCode] + ', организация ' + lineArray[i][orgName]);
}

writeLog(multipleUsers, duplicateUser, anyError);
ShowMesssages();
//************************************