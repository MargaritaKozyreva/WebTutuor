excelFileUrl = 'x-local:///c:/order.xls';
logFileUrl = 'c:/log.html';
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
logLine = '';
logCreateUser = '';
logActivateTest = '';
activateCodeTest = '';
//**************************************


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

function createDep(deptName, org) {
    try {
        newDep = OpenNewDoc('x-local://wtv/wtv_subdivision.xmd');
        newDep.BindToDb(DefaultDb);
        newDep.TopElem.code = '!delete';
        newDep.TopElem.name = deptName;
        newDep.TopElem.org_id = Int(org);
        newDep.TopElem.custom_elems.ObtainChildByKey('flagDelete').value = true;
        newDep.Save();
    } catch (e) {
        alert('Не удалось создать новое позразделение по причине: ' + ExtractUserError(e));
        return arr = [0];
    }
    return arr = [newDep.DocID, deptName];
}

function createPos(posName, org, dep) {
    try {
        newPos = OpenNewDoc('x-local://wtv/wtv_position.xmd');
        newPos.BindToDb(DefaultDb);
        newPos.TopElem.code = '!delete';
        newPos.TopElem.name = posName;
        newPos.TopElem.org_id = Int(org);
        newPos.TopElem.parent_object_id = Int(dep);
        newPos.TopElem.custom_elems.ObtainChildByKey('flagDelete').value = true;
        newPos.Save();
    } catch (e) {
        alert('Не удалось создать новую должность по причине: ' + ExtractUserError(e));
        return arr = [0];
    }
    return arr = [newPos.DocID, posName];
}

function createUser(infoUser) {
    if (Trim(infoUser[fullName] != '')) {
        orgCode = codeOrgStruct[StrLowerCase(infoUser[orgFlag])];
        try {
            newUser = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
            newUser.BindToDb(DefaultDb);
            newUser.TopElem.code = orgCode + infoUser[userCode];
            newUser.TopElem.custom_elems.ObtainChildByKey('userCode').value = infoUser[userCode];
            newUser.TopElem.custom_elems.ObtainChildByKey('flagForSync').value = true;
            if (orgCode == 'EK') {
                newUser.TopElem.login = 'DO*' + orgCode + '*' + infoUser[userCode];
            } else {
                newUser.TopElem.login = 'DO*' + infoUser[userCode];
            }
            newUser.TopElem.change_password = true;
            newUser.TopElem.password = '';
            try {
                newUser.TopElem.lastname = String(infoUser[fullName]).split(' ')[0];
                newUser.TopElem.firstname = String(infoUser[fullName]).split(' ')[1];
                newUser.TopElem.middlename = String(infoUser[fullName]).split(' ')[2];
            } catch (e) {
                logCreateUser += 'Не верный формат поля ФИО в исходном документе у сотрудника ' + source[i][fullName] + '. Сотрудник не обработан.'
                alert('Не верный формат поля ФИО в исходном документе у сотрудника ' + source[i][fullName] + '. Сотрудник не будет обработан.');
                return 0;
            }

            linkOrg = findOrg(Trim(infoUser[orgFlag]));
            if (linkOrg.length == 2) {
                newUser.TopElem.org_id = linkOrg[0];
                newUser.TopElem.org_name = linkOrg[1];
            } else if (linkOrg.length == 1) {
                logCreateUser += 'Невозможно однозначно определить организацию для сотрудника ' + infoUser[fullName] + ' или в БД не найдено организации.';
                alert('Невозможно однозначно определить организацию для сотрудника ' + infoUser[fullName] + ' или в БД не найдено организации.');
                return 0;
            }

            linkDep = createDep(Trim(infoUser[departamentName]), linkOrg[0]);
            if (linkDep.length == 2) {
                newUser.TopElem.position_parent_id = Int(linkDep[0]);
                newUser.TopElem.position_parent_name = linkDep[1];
            }

            linkPos = createPos(Trim(infoUser[positionName]), linkOrg[0], linkDep[0]);
            if (linkPos.length == 2) {
                newUser.TopElem.position_id = Int(linkPos[0]);
                newUser.TopElem.position_name = linkPos[1];
            }

            newUser.Save();
        } catch (e) {
            logCreateUser += 'Невозможно создать нового сотрудника по причине: ' + ExtractUserError(e);
            alert('Невозможно создать нового сотрудника по причине: ' + ExtractUserError(e));
            return 0;
        }
        alert('Создан новый пользователь ' + infoUser[fullName]);
        return 1;
    }
}

function activateTest(userInfo, XQUser) {
    resutlXQGroups = XQuery("for $elem in groups where $elem/code='" + Trim(userInfo[groupName]) + "' return $elem");
    if (ArrayOptFirstElem(resutlXQGroups) != undefined) {
        arrCodeTests = String(userInfo[codeTests]).split(';');
        if (arrCodeTests.length > 0) {
            for (var j = 0; j < arrCodeTests.length; j++) {
                resultXQTests = XQuery("for $elem in assessments where $elem/code='" + Trim(arrCodeTests[j]) + "' return $elem");
                if (ArrayCount(resultXQTests) > 1 || ArrayCount(resultXQTests) == 0) {
                    logActivateTest += 'Не удалось однозначно опеределить назначаемый тест или не найден тест с кодом ' + Trim(arrCodeTests[j]);
                    alert('Не удалось однозначно опеределить назначаемый тест или не найден тест с кодом ' + Trim(arrCodeTests[j]));
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
                        alert('При назначении теста произошла ошибка: ' + ExtractUserError(e));
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

function createMessage(str) {
    logLine += str + '</br>';
}

function writeLog() {
    try {
        PutFileData(logFileUrl, logLine);
    } catch (e) {
        alert('Невозможно создать лог-файл: ' + ExtractUserError(e));
    }
}
//***********************************************

try {
    sourceList = OpenDoc(excelFileUrl, 'format=excel');
} catch (e) {
    alert('Ошибка при открытии файла ' + ExtractUserError(e));
    return;
}
source = ArrayFirstElem(sourceList.TopElem);
for (var i = 0; i < ArrayCount(source); i++) {
    if (i == 0) continue;
    //tmpLine = "<b>Результат обработки строки " + i + ": " + '</b>';
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
        if (StrLowerCase(Trim(source[i][orgFlag])) == 'виз' || Trim(source[i][orgFlag]) == '') {
            resultXQUsers = XQuery("for $elem in collaborators where $elem/code='" + codeOrgStruct[StrLowerCase(Trim(source[i][orgFlag]))] + source[i][userCode] + "' return $elem");
            tmpLine = "<b>Результат обработки строки " + i + ": " + '</b>';
            if (ArrayCount(resultXQUsers) == 0) {
                resultCreateUser = createUser(source[i]);
                if (resultCreateUser == 1) {
                    tmpLine += 'создан новый сотрудник ' + source[i][fullName] + '. ';
                    resultXQUsers = XQuery("for $elem in collaborators where $elem/code='" + codeOrgStruct[StrLowerCase(Trim(source[i][orgFlag]))] + source[i][userCode] + "' return $elem");
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
                tmpLine += 'не удалось однозначно сопоставить загружаемого сотрудника ' + source[i][fullName] + ' по коду ' + codeOrgStruct[StrLowerCase(Trim(source[i][orgFlag]))] + source[i][userCode] + '; ';
                continue;
            } else if (ArrayCount(resultXQUsers) == 1) {
                tmpLine += 'сотрудник с кодом ' + codeOrgStruct[StrLowerCase(Trim(source[i][orgFlag]))] + source[i][userCode] + ' найден в WebTutor. ';
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
    alert('Обработка строки ' + i + ' завершена');
    createMessage(tmpLine+';');
}
writeLog();
