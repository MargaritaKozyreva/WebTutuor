//-=Раздел описания глобальных переменных=-
departamentName = 2;
userCode = 3;
fullName = 4;
positionName = 5;
codeTests = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
logLine = '';
logCreateUser = '';
logActivateTest = '';
activateCodeTest = '';
codeGroup = 'AP';
//**************************************

//-=Раздел описания функций=-

//поиск организации в WT
function findOrg() {
    itemsOrg = XQuery("for $elem in orgs where $elem/name='ПАО \"НЛМК\"' return $elem");
    if (ArrayCount(itemsOrg) == 1) {
        return arr = [ArrayFirstElem(itemsOrg).id, ArrayFirstElem(itemsOrg).disp_name];
    } else
        return arr = [0];
}

//Создание новго подразделения
function createDep(deptName, org) {
    XQDep = XQuery("for $elem in subdivisions where doc-contains($elem/id, 'wt_data', '[abbrDep=" + deptName + "]','subdivisions') and $elem/org_id=" + org[0] + " return $elem");
    if (ArrayCount(XQDep) == 0) {
        try {
            newDep = OpenNewDoc('x-local://wtv/wtv_subdivision.xmd');
            newDep.BindToDb(DefaultDb);
            newDep.TopElem.code = '!delete';
            newDep.TopElem.name = deptName;
            newDep.TopElem.org_id = Int(org[0]);
            newDep.TopElem.custom_elems.ObtainChildByKey('flagDelete').value = true;
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
            newPos.TopElem.code = '!delete';
            newPos.TopElem.name = posName;
            newPos.TopElem.org_id = Int(org[0]);
            newPos.TopElem.parent_object_id = Int(dep[0]);
            newPos.TopElem.custom_elems.ObtainChildByKey('flagDelete').value = true;
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
function createUser(infoUser) {
    if (Trim(infoUser[fullName] != '')) {
        try {
            tabNumber = Trim(infoUser[userCode]);
            newUser = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
            newUser.BindToDb(DefaultDb);
            newUser.TopElem.code = 'LP' + tabNumber;
            newUser.TopElem.custom_elems.ObtainChildByKey('userCode').value = tabNumber;
            newUser.TopElem.custom_elems.ObtainChildByKey('flagForSync').value = true;
            newUser.TopElem.login = 'DO*' + tabNumber;
            newUser.TopElem.password = tabNumber;

            try {
                newUser.TopElem.lastname = String(infoUser[fullName]).split(' ')[0];
                newUser.TopElem.firstname = String(infoUser[fullName]).split(' ')[1];
            } catch (e) {
                logCreateUser += 'Не верный формат поля ФИО в исходном документе у сотрудника ' + infoUser[fullName] + '. Сотрудник не обработан.'
                return 0;
            }

            linkOrg = findOrg();
            if (linkOrg.length == 2) {
                newUser.TopElem.org_id = Int(linkOrg[0]);
            } else if (linkOrg.length == 1) {
                logCreateUser += 'Невозможно однозначно определить организацию для сотрудника ' + infoUser[fullName] + ' или в БД не найдено организации.';
                return 0;
            }

            linkDep = createDep(Trim(infoUser[departamentName]), linkOrg);
            if (linkDep.length == 2) {
                newUser.TopElem.position_parent_id = Int(linkDep[0]);
            } else if (linkDep[0] == 0) {
                logCreateUser += 'Не удалось создать подразделение для нового сотрудника ' + infoUser[fullName] + '. Обработка прервана.';
                return 0;
            }

            linkPos = createPos(Trim(infoUser[positionName]), linkOrg, linkDep);
            if (linkPos.length == 2) {
                newUser.TopElem.position_id = Int(linkPos[0]);
            } else if (linkDep[0] == 0) {
                logCreateUser += 'Не удалось создать должность для нового сотрудника ' + infoUser[fullName] + '. Обработка прервана.';
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
    resutlXQGroups = XQuery("for $elem in groups where $elem/code='" + codeGroup + "' return $elem");
    if (ArrayOptFirstElem(resutlXQGroups) != undefined) {
        arrCodeTests = [];
        for (var k = ArrayFirstElem(codeTests); k <= codeTests[codeTests.length - 1]; k++) {
            if (userInfo[k] != '') {
                arrCodeTests.push(userInfo[k]);
            }
        }
        if (arrCodeTests.length > 0) {
            for (var j = 0; j < arrCodeTests.length; j++) {
                resultXQTests = XQuery("for $elem in assessments where $elem/code='" + Trim(arrCodeTests[j]) + "' return $elem");
                if (ArrayCount(resultXQTests) > 1 || ArrayCount(resultXQTests) == 0) {
                    logActivateTest += 'Не удалось однозначно опеределить назначаемый тест или не найден тест с кодом ' + Trim(arrCodeTests[j] + '.');
                    return 0;
                } else {
                    reappointment = Param.reappointment == '1' || Param.reappointment == 'true' || Param.reappointment == true;
                    try {
                        if (reappointment) {
                            tools.activate_test_to_person(ArrayFirstElem(XQUser).id, ArrayFirstElem(resultXQTests).id, null, null, null, null, null, null, DateOffset(Date(), 86400), Int(ArrayFirstElem(resutlXQGroups).id));
                        } else {
                            tools.activate_test_to_person(ArrayFirstElem(XQUser).id, ArrayFirstElem(resultXQTests).id, null, null, null, null, null, null, null, Int(ArrayFirstElem(resutlXQGroups).id));
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
        logActivateTest += 'Не найдена группа АП в WebTutor';
        alert('Не найдена группа АП в WebTutor');
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
    if (source[i][0] == '') continue;
    logActivateTest = '';
    activateCodeTest = '';
    try {
        codeExcel = Int(Trim(source[i][userCode]));
    } catch (e) {
        errMess = 'Ошибка в строке ' + i + ': в поле Табельный номер в Excel могут присутствовать только цифры! Загрузка отменена';
        if (i == 1) {
            alert(errMess);
        } else (
            alert(errMess + '. Результаты обработки см. в log.html.')
        )
        return;
    }
    if (codeExcel) {
        resultXQUsers = XQuery("for $elem in collaborators where $elem/code='LP" + Trim(source[i][userCode]) + "' return $elem");
        tmpLine = "<b>Результат обработки строки " + i + ": " + '</b>';
        if (ArrayCount(resultXQUsers) == 0) {
            resultCreateUser = createUser(source[i]);
            if (resultCreateUser == 1) {
                tmpLine += 'создан новый сотрудник ' + source[i][fullName] + '. ';
                resultXQUsers = XQuery("for $elem in collaborators where $elem/code='LP" + Trim(source[i][userCode]) + "' return $elem");
                resultActivateTest = activateTest(source[i], resultXQUsers);
                if (resultActivateTest == 1) {
                    tmpLine += 'Назначены тесты: ' + activateCodeTest;
                } else {
                    tmpLine += logActivateTest;
                }
            } else {
                tmpLine += logCreateUser;
            }
        } else if (ArrayCount(resultXQUsers) > 1) {
            tmpLine += 'не удалось однозначно сопоставить загружаемого сотрудника ' + source[i][fullName] + ' по коду LP' + source[i][userCode] + '; ';
            continue;
        } else if (ArrayCount(resultXQUsers) == 1) {
            tmpLine += 'сотрудник с кодом LP' + Trim(source[i][userCode]) + ' найден в WebTutor. ';
            resultActivateTest = activateTest(source[i], resultXQUsers);
            if (resultActivateTest == 1) {
                tmpLine += 'Назначены тесты: ' + activateCodeTest;
            } else {
                tmpLine += logActivateTest;
            }
        }
    }
    createMessage(tmpLine + ';');
}
writeLog();

//****************************
