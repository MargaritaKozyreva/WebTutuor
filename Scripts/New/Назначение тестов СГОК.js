//-=Раздел описания глобальных переменных=-
orgFlag = 0;
userCode = 1;
fullName = 2;
departamentName = 3;
positionName = 4;
codeTests = 5;
groupName = 6;
codeOrgStruct = {};
codeOrgStruct[''] = 'LP';
codeOrgStruct['виз'] = 'EK';
codeOrgStruct['сгок'] = 'SG';
logLine = '';
logCreateUser = '';
logActivateTest = '';
activateCodeTest = '';
//**************************************

//-=Раздел описания функций=-

//поиск организации в WT
function findOrg(orgName) {
    if (StrLowerCase(orgName) == 'сгок') {
        itemsOrg = XQuery("for $elem in orgs where $elem/name='ОАО \"СТОЙЛЕНСКИЙ ГОК\"' return $elem");
    }
    if (ArrayCount(itemsOrg) == 1) {
        return arr = [ArrayFirstElem(itemsOrg).id, ArrayFirstElem(itemsOrg).disp_name];
    } else
        return arr = [0];
}

//Создание новго подразделения
function createDep(deptName, org) {
    XQDep = XQuery("for $elem in subdivisions where $elem/name='" + deptName + "' and $elem/org_id=" + org[0] + " return $elem");
    if (ArrayCount(XQDep) == 0) {
        try {
            newDep = OpenNewDoc('x-local://wtv/wtv_subdivision.xmd');
            newDep.BindToDb(DefaultDb);
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
function createUser(infoUser) {
    if (Trim(infoUser[fullName] != '')) {
        orgCode = codeOrgStruct[StrLowerCase(infoUser[orgFlag])];
        try {
            newUser = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
            newUser.BindToDb(DefaultDb);
            newUser.TopElem.code = '2010/' + infoUser[userCode];
            newUser.TopElem.custom_elems.ObtainChildByKey('userCode').value = infoUser[userCode];
            newUser.TopElem.login = '2010*' + infoUser[userCode];
            //newUser.TopElem.change_password = true;
            newUser.TopElem.password = '';
            try {
                newUser.TopElem.lastname = String(infoUser[fullName]).split(' ')[0];
                newUser.TopElem.firstname = String(infoUser[fullName]).split(' ')[1];
                newUser.TopElem.middlename = String(infoUser[fullName]).split(' ')[2];
            } catch (e) {
                logCreateUser += 'Не верный формат поля ФИО в исходном документе у сотрудника ' + source[i][fullName] + '. Сотрудник не обработан.'
                return 0;
            }

            linkOrg = findOrg(Trim(infoUser[orgFlag]));
            if (linkOrg.length == 2) {
                newUser.TopElem.org_id = linkOrg[0];
                newUser.TopElem.org_name = linkOrg[1];
            } else if (linkOrg.length == 1) {
                logCreateUser += 'Невозможно однозначно определить организацию для сотрудника ' + infoUser[fullName] + ' или в БД не найдено организации.';
                return 0;
            }

            //TODO: сделать обработку исключений
            linkDep = createDep(Trim(infoUser[departamentName]), linkOrg);
            if (linkDep.length == 2) {
                newUser.TopElem.position_parent_id = Int(linkDep[0]);
                newUser.TopElem.position_parent_name = linkDep[1];
            } else if (linkDep[0] == 0) {
                logCreateUser += 'Не удалось создать подразделение для нового сотрудника ' + infoUser[fullName] + '. Обработка прервана.';
                return 0;
            }

            //TODO: сделать обработку исключений
            linkPos = createPos(Trim(infoUser[positionName]), linkOrg, linkDep);
            if (linkPos.length == 2) {
                newUser.TopElem.position_id = Int(linkPos[0]);
                newUser.TopElem.position_name = linkPos[1];
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
    resutlXQGroups = XQuery("for $elem in groups where $elem/code='" + Trim(userInfo[groupName]) + "' return $elem");
    if (ArrayOptFirstElem(resutlXQGroups) != undefined) {
        arrCodeTests = String(userInfo[codeTests]).split(';');
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
    if (source[i][userCode] == '') continue;
    logActivateTest = '';
    activateCodeTest = '';
    try {
        codeExcel = Int(Trim(source[i][userCode]));
    } catch (e) {
        errMess = 'Ошибка в строке ' + i + ': в поле Табельный номер в Excel могут присутствовать только цифры! Загрузка отменена';
        if (i == 1) {
            alert(errMess);
        } else {
            alert(errMess + '. Результаты обработки см. в log.html.');
        }
        return;
    }
    if (codeExcel) {
        if (StrLowerCase(Trim(source[i][orgFlag])) == 'сгок') {
            resultXQUsers = XQuery("for $elem in collaborators where $elem/code='2010/" + source[i][userCode] + "' return $elem");
            tmpLine = "<b>Результат обработки строки " + i + ": " + '</b>';
            if (ArrayCount(resultXQUsers) == 0) {
                resultCreateUser = createUser(source[i]);
                if (resultCreateUser == 1) {
                    tmpLine += 'создан новый сотрудник ' + source[i][fullName] + '. ';
                    resultXQUsers = XQuery("for $elem in collaborators where $elem/code='2010/" + source[i][userCode] + "' return $elem");
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
                tmpLine += 'не удалось однозначно сопоставить загружаемого сотрудника ' + source[i][fullName] + ' по коду 2010/' + source[i][userCode] + '; ';
                continue;
            } else if (ArrayCount(resultXQUsers) == 1) {
                tmpLine += 'сотрудник с кодом 2010/' + source[i][userCode] + ' найден в WebTutor. ';
                resultActivateTest = activateTest(source[i], resultXQUsers);
                if (resultActivateTest == 1) {
                    tmpLine += 'Назначены тесты: ' + activateCodeTest;
                } else {
                    tmpLine += logActivateTest;
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