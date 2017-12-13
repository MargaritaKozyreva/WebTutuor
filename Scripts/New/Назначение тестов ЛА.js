//-=Раздел описания глобальных переменных=-
orgFlag = 0;
userCode = 1;
fullName = 2;
departamentName = 3;
positionName = 4;
codeTests = 5;
groupName = 6;
codeOrgStruct = {};
codeOrgStruct[''] = '1010';
codeOrgStruct['виз'] = '1020';
logLine = '';
logCreateUser = '';
logActivateTest = '';
activateCodeTest = '';
now = new Date();
//**************************************

//-=Раздел описания функций=-

//поиск организации в WT
function findOrg(orgName) {
    if (StrLowerCase(orgName) == 'виз') {
        itemsOrg = XQuery("for $elem in orgs where $elem/name='ООО \"ВИЗ-СТАЛЬ\"' return $elem");
    } else if (orgName == '') {
        itemsOrg = XQuery("for $elem in orgs where $elem/name='ПАО \"НЛМК\"' return $elem");
    }
    if (ArrayCount(itemsOrg) == 1) {
        return arr = [ArrayFirstElem(itemsOrg).id, ArrayFirstElem(itemsOrg).disp_name];
    } else
        return arr = [0];
}

//Создание новго подразделения
function createDep(deptCode, deptName, org) {
    if (deptCode == 0) {
        XQDep = XQuery("for $elem in subdivisions where $elem/name='" + deptName + "' and $elem/org_id=" + org[0] + " return $elem");
    } else {
        XQDep = XQuery("for $elem in subdivisions where $elem/code='" + deptCode + "' and $elem/org_id=" + org[0] + " return $elem");
    }
    if (ArrayCount(XQDep) == 0) {
        try {
            newDep = OpenNewDoc('x-local://wtv/wtv_subdivision.xmd');
            newDep.BindToDb(DefaultDb);
            if (deptCode != 0 && org[1] == 'ПАО НЛМК') {
                newDep.TopElem.code = Int(deptCode);
            }
            newDep.TopElem.name = deptName;
            newDep.TopElem.org_id = Int(org[0]);
            newDep.Save();
        } catch (e) {
            alert('Не удалось создать новое позразделение по причине: ' + ExtractUserError(e));
            return arr = [0];
        }
        return arr = [newDep.DocID, deptName];
    } else if (ArrayCount(XQDep) > 1) {
        logCreateUser += 'Не удалось создать новое подразделение. Множественное совпадение подразделения ' + deptName + ' в организации ' + org[1] + '.';
        return arr = [0];
    } else {
        return arr = [ArrayFirstElem(XQDep).id, ArrayFirstElem(XQDep).name];
    }
}

//Создание новой должности
function createPos(posName, org, dep) {
    XQPos = XQuery("for $elem in positions where $elem/name='" + posName + "' and $elem/org_id=" + org[0] + " and $elem/parent_object_id=" + dep[0] + " return $elem");
    if (ArrayCount(XQPos) == 0) {
        try {
            newPos = OpenNewDoc('x-local://wtv/wtv_position.xmd');
            newPos.BindToDb(DefaultDb);
            newPos.TopElem.name = String(StrTitleCase(posName));
            newPos.TopElem.org_id = Int(org[0]);
            newPos.TopElem.parent_object_id = Int(dep[0]);
            newPos.Save();
        } catch (e) {
            alert('Не удалось создать новую должность по причине: ' + ExtractUserError(e));
            return arr = [0];
        }
        return arr = [newPos.DocID, posName];
    } else if (ArrayCount(XQPos) > 1) {
        logCreateUser += 'Не удалось создать новую должность. Множественное совпадение должности ' + posName + ' в подразделении ' + deptName + ' организации ' + org[1] + '.';
        return arr = [0];
    } else {
        return arr = [ArrayFirstElem(XQPos).id, ArrayFirstElem(XQPos).name];
    }
}

//Создание нового сотрудника
function createUser(infoUser, userSAP) {
    if (Trim(infoUser[fullName] != '')) {
        flagPAO = (userSAP == 0 ? false : true);
        orgCode = codeOrgStruct[StrLowerCase(infoUser[orgFlag])];
        tabNumber = Trim(infoUser[userCode]);
        try {
            newUser = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
            newUser.BindToDb(DefaultDb);
            newUser.TopElem.code = orgCode + '/' + tabNumber;
            newUser.TopElem.custom_elems.ObtainChildByKey('userCode').value = tabNumber;
            newUser.TopElem.login = orgCode + '*' + tabNumber;
            newUser.TopElem.password = tabNumber;

            if (flagPAO) {
                arr = String(userSAP.name).split(' ');
            } else {
                arr = String(infoUser[fullName]).split(' ');
            }

            arrFIO = [];
            for (o = 0; o < ArrayCount(arr); o++) {
                if (arr[o] != '') arrFIO.push(arr[o]);
            }

            try {
                if (arrFIO.length == 2) {
                    newUser.TopElem.lastname = arrFIO[0];
                    newUser.TopElem.firstname = arrFIO[1];
                } else if (arrFIO.length == 3) {
                    newUser.TopElem.lastname = arrFIO[0];
                    newUser.TopElem.firstname = arrFIO[1];
                    newUser.TopElem.middlename = arrFIO[2];
                }
            } catch (e) {
                logCreateUser += 'Неверный формат поля ФИО в исходном документе у сотрудника ' + infoUser[fullName] + '. Сотрудник не обработан. ';
                return 0;
            }

            linkOrg = findOrg(Trim(infoUser[orgFlag]));
            if (linkOrg.length == 2) {
                newUser.TopElem.org_id = Int(linkOrg[0]);
                newUser.TopElem.org_name = linkOrg[1];
                if (flagPAO) {
                    linkDep = createDep(Int(Trim(userSAP.codedep)), Trim(userSAP.namedep), linkOrg);
                } else {
                    linkDep = createDep(0, Trim(infoUser[departamentName]), linkOrg);
                }
                if (linkDep.length == 2) {
                    newUser.TopElem.position_parent_id = Int(linkDep[0]);
                    newUser.TopElem.position_parent_name = linkDep[1];
                    if (flagPAO) {
                        pos = StrTitleCase(String(Trim(userSAP.namepos)).substr(0, 1)) + String(Trim(userSAP.namepos)).substr(1);
                    } else {
                        pos = StrTitleCase(String(Trim(infoUser[positionName])).substr(0, 1)) + String(Trim(infoUser[positionName])).substr(1);
                    }
                    linkPos = createPos(pos, linkOrg, linkDep);
                    if (linkPos.length == 2) {
                        newUser.TopElem.position_id = Int(linkPos[0]);
                        newUser.TopElem.position_name = linkPos[1];
                    } else {
                        switch (linkPos[0]) {
                            case 0:
                                logCreateUser += ('Не создана должность ' + infoUser[positionName] + '. Сотрудник из строки ' + Int(i + 1) + ' не обработан');

                            case 2:
                                logCreateUser += ('Не удалось однозначно определить должность ' + infoUser[positionName] + ' в WT. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                        }
                        return 0;
                    }
                } else {
                    switch (linkDep[0]) {
                        case 0:
                            logCreateUser += ('Не создано подразделение ' + infoUser[departamentName] + '. Сотрудник из строки ' + Int(i + 1) + ' не обработан');
                        case 2:
                            logCreateUser += ('Не удалось однозначно определить подразделение ' + infoUser[departamentName] + ' в WT. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                    }
                    return 0;
                }
            } else {
                switch (linkOrg[0]) {
                    case 0:
                        logCreateUser += ('Не удалось найти организацию в WT. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                    case 2:
                        logCreateUser += ('Не удалось однозначно определить организацию в WT. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                }
                return 0;
            }

            newUser.Save();
        } catch (e) {
            logCreateUser += 'Невозможно создать нового сотрудника по причине: ' + ExtractUserError(e);
            return 0;
        }
        return 1;
    }
}

//Назначение тестов
function activateTest(userInfo, XQUser) {
    resutlXQGroups = XQuery("for $elem in groups where $elem/code='" + Trim(userInfo[groupName]) + "' return $elem");
    if (ArrayOptFirstElem(resutlXQGroups) != undefined) {
        arrCodeTests = String(userInfo[codeTests]).split(';');
        if (arrCodeTests.length > 0) {
            for (var j = 0; j < arrCodeTests.length; j++) {
                resultXQTests = XQuery("for $elem in assessments where $elem/code='" + Trim(arrCodeTests[j]) + "' return $elem");
                if (ArrayCount(resultXQTests) > 1 || ArrayCount(resultXQTests) == 0) {
                    logActivateTest += 'Не удалось однозначно опеределить назначаемый тест или не найден тест с кодом ' + Trim(arrCodeTests[j]);
                    return 0;
                } else {
                    reappointment = Param.reappointment == '1' || Param.reappointment == 'true' || Param.reappointment == true;
                    try {
                        if (reappointment) {
                            docTest = tools.activate_test_to_person(XQUser, ArrayFirstElem(resultXQTests).id, null, null, null, null, null, null, DateOffset(Date(), 86400), Int(ArrayFirstElem(resutlXQGroups).id));
                        } else {
                            docTest = tools.activate_test_to_person(XQUser, ArrayFirstElem(resultXQTests).id, null, null, null, null, null, null, null, ArrayFirstElem(resutlXQGroups).id);
                        }
                        try {
                            docS = docTest.DocID;
                            flagNew = true;
                        } catch (e) {
                            flagNew = false;
                        }
                        if (flagNew) {
                            doc = OpenDoc(UrlFromDocID(Int(docS)));
                            doc.TopElem.start_usage_date = now;
                            doc.Save();
                        } else {
                            realActiveTest = XQuery('for $elem in active_test_learnings where $elem/id=' + docTest + ' return $elem');
                            doc = OpenDoc(UrlFromDocID(ArrayFirstElem(realActiveTest).id));
                            doc.TopElem.start_usage_date = now;
                            doc.Save();
                        }
                        activateCodeTest += ArrayFirstElem(resultXQTests).code + ' ';
                    } catch (e) {
                        logActivateTest += 'При назначении теста произошла ошибка: ' + ExtractUserError(e);
                        return 0;
                    }
                }
            }
        } else {
            logActivateTest += "Не заданы коды тестов для назначения";
            alert("Не заданы коды тестов для назначения");
            return 0;
        }
    } else {
        logActivateTest += 'Не найдена группа ' + userInfo[groupName] + ' в WebTutor';
        alert('Не найдена группа ' + userInfo[groupName] + ' в WebTutor');
        return 0;
    }
    return 1;
}

//Генерация сообщения для лога
function createMessage(str) {
    logLine += str + '</br>';
}

//Запись лог-сообщения в файл лога
function writeLog() {
    try {
        PutFileData(Param.urlLog, logLine);
    } catch (e) {
        alert('Невозможно создать лог-файл: ' + ExtractUserError(e));
    }
}
//***********************************************

//-=Тело скрипта=-
try {
    sourceList = OpenDoc('x-local:///' + StrReplace(Param.urlSource, '\\', "/"), 'format=excel');
} catch (e) {
    alert('Ошибка при открытии файла ' + ExtractUserError(e));
    return;
}

source = ArrayFirstElem(sourceList.TopElem);
for (var i = 0; i < ArrayCount(source); i++) {
    if (i == 0) continue;
    if (source[i][userCode] == '' && source[i][fullName] == '') {
        alert("В строке " + i + " отсутствует табельный номер или ФИО сотрудника! Строка не обработана")
        continue;
    }

    flag = false;
    logActivateTest = '';
    activateCodeTest = '';
    try {
        codeExcel = Int(Trim(source[i][userCode]));
    } catch (e) {
        errMess = 'Ошибка в строке ' + i + ': в поле Табельный номер в Excel могут присутствовать только цифры! Загрузка прервана';
        if (i == 1) {
            alert(errMess);
        } else (
            alert(errMess + '. Результаты обработки см. в log.html.')
        )
        break;
    }
    if (codeExcel > 999999) {
        errMess = 'Ошибка в строке ' + i + ': в поле Табельный номер должен быть записан табельный номер старого формата - без двухзначного кода и добавочных нулей! Загрузка прервана';
        if (i == 1) {
            alert(errMess);
        } else (
            alert(errMess + '. Результаты обработки см. в log.html.')
        )
        break;
    }

    if (codeExcel) {
        if (StrLowerCase(Trim(source[i][orgFlag])) == 'виз' || Trim(source[i][orgFlag]) == '') {
            tmpLine = "<b>Результат обработки строки " + i + ": " + '</b>';

            //проверка SAP
            if (Trim(source[i][orgFlag]) == '') {
                standartUsers = XQuery("for $elem in cc_standartsapusers where $elem/code='" + Trim(source[i][userCode]) + "' return $elem");
                if (ArrayCount(standartUsers) == 0) {
                    tmpLine += '<b>не найдено ни одного сотрудника с табельным номером ' + source[i][userCode] + ' в списке SAP</b>';
                    createMessage(tmpLine + ';');
                    continue;
                } else if (ArrayCount(standartUsers) > 1) {
                    tmpLine += '<b>найдено несколько сотрудников с табельным номером ' + source[i][userCode] + ' в списке SAP</b>';
                    createMessage(tmpLine + ';');
                    continue;
                } else {
                    user = ArrayFirstElem(standartUsers);
                    if (StrLowerCase(String(user.name).split(' ')[0]) == StrLowerCase(String(source[i][fullName]).split(' ')[0])) {
                        //if (StrContains(user.name, String(source[i][fullName]).split(' ')[0], true)) {
                        flag = true;
                    } else {
                        tmpLine += '<b>сотрудник с табельным номером ' + source[i][userCode] + ' не прошел проверку со списком SAP</b> ';
                        createMessage(tmpLine + ';');
                        continue;
                    }
                }
            }

            if ((flag && Trim(source[i][orgFlag]) == '') || (StrLowerCase(Trim(source[i][orgFlag])) == 'виз')) {
                resultXQUsers = XQuery("for $elem in collaborators where $elem/code='" + codeOrgStruct[StrLowerCase(Trim(source[i][orgFlag]))] + '/' + source[i][userCode] + "' return $elem");
                if (ArrayCount(resultXQUsers) == 0) {
                    if (flag) {
                        resultCreateUser = createUser(source[i], user);
                    } else {
                        resultCreateUser = createUser(source[i], 0);
                    }
                    if (resultCreateUser == 1) {
                        tmpLine += 'создан новый сотрудник ' + source[i][fullName] + '. ';
                        resultXQUsers = XQuery("for $elem in collaborators where $elem/code='" + codeOrgStruct[StrLowerCase(Trim(source[i][orgFlag]))] + '/' + Trim(source[i][userCode]) + "' return $elem");
                        resultActivateTest = activateTest(source[i], ArrayFirstElem(resultXQUsers).id);
                        if (resultActivateTest == 1) {
                            tmpLine += 'Назначены тесты: ' + activateCodeTest;
                        } else {
                            tmpLine += logActivateTest;
                        }
                    } else {
                        tmpLine += logCreateUser;
                    }
                } else if (ArrayCount(resultXQUsers) > 1) {
                    tmpLine += 'не удалось однозначно сопоставить загружаемого сотрудника ' + source[i][fullName] + ' по коду ' + codeOrgStruct[StrLowerCase(Trim(source[i][orgFlag]))] + '/' + source[i][userCode] + '; ';
                    continue;
                } else if (ArrayCount(resultXQUsers) == 1) {
                    resultActivateTest = activateTest(source[i], ArrayFirstElem(resultXQUsers).id);
                    if (resultActivateTest == 1) {
                        tmpLine += 'Назначены тесты: ' + activateCodeTest;
                    } else {
                        tmpLine += logActivateTest;
                    }
                }
            }
        } else {
            alert('Ошибка в строке ' + i + ': поле Организация в Excel имеет недопустимый формат! Загрузка отменена');
            return;
        }
    }
    createMessage(tmpLine + ';');
}

writeLog();

//****************************
