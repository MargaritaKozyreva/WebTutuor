//-=Раздел объявления переменных=-
excelFileUrl = 'x-local:///c:/order_mbo.xls';
logFileUrl = 'c:/log.html';
userCode = 0;
fullName = 1;
orgName = 2;
depName = 3;
posName = 4;
emailUser = 5;
processLines = 0;
codeOrgStruct = {};
codeLoginStruct = {};
multipleUsers = [];
duplicateUser = [];
anyError = [];
idCourse = [];
idGroup = 0;
codesCourses = ['TOiR_1case', 'TOiR_2case'];
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
    codeOrgStruct['ОАО "СТОЙЛЕНСКИЙ ГОК"'] = '2010';
    codeOrgStruct['ОАО "Чувашвтормет"'] = 'F032';
    codeOrgStruct['ООО "ГОК "Жерновский-1"'] = '2020';
    codeOrgStruct['ООО "ГОК "Усинский-3"'] = '2030';
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
}

//Проверка присутствия сотрудника в базе
function checkUser(arr) {
    codeOrg = Trim(codeOrgStruct[arr[orgName]]);
    arrUsers = XQuery("for $elem in collaborators where $elem/code='" + codeOrg + "/" + Trim(arr[userCode]) + "' return $elem");
    arrCount = ArrayCount(arrUsers);

    //сотрудник есть в БД, не ПАО
    if (arrCount == 1) {
        for (user in arrUsers) {
            doc = OpenDoc(UrlFromDocID(user.id));
            doc.TopElem.email = Trim(StrLowerCase(arr[emailUser]));
            doc.TopElem.change_password = true;
            doc.TopElem.password = '123';

            if (codeOrg != '1010') {
                try {
                    doc.TopElem.lastname = StrTitleCase(String(arr[fullName]).split(' ')[0]);
                    doc.TopElem.firstname = StrTitleCase(String(arr[fullName]).split(' ')[1]);
                    doc.TopElem.middlename = StrTitleCase(String(arr[fullName]).split(' ')[2]);
                } catch (e) {
                    anyError.push('Неверный формат ФИО ' + arr[fullName]);
                    continue;
                }

                linkOrg = findOrg(arr[orgName]);
                if (linkOrg.length == 2) {
                    doc.TopElem.org_id = linkOrg[0];
                    linkDep = findDep(0, arr[depName], linkOrg);
                    if (linkDep.length == 2) {
                        doc.TopElem.position_parent_id = linkDep[0];
                        linkPos = findPos(Trim(arr[posName]), linkOrg, linkDep);
                        if (linkPos.length == 2) {
                            doc.TopElem.position_id = linkPos[0];
                        } else {
                            switch (linkPos[0]) {
                                case 0:
                                    anyError.push('Не создана должность ' + arr[posName] + '. Сотрудник из строки ' + processLines + ' не обработан');
                                    break;
                                case 2:
                                    anyError.push('Не удалось однозначно определить должность ' + arr[posName] + ' в WT. Сотрудник из строки ' + processLines + ' не обработан.');
                                    break;
                                default:
                                    break;
                            }
                            continue;
                        }
                    } else {
                        switch (linkDep[0]) {
                            case 0:
                                anyError.push('Не создано подразделение ' + arr[depName] + '. Сотрудник из строки ' + processLines + ' не обработан');
                                break;
                            case 2:
                                anyError.push('Не удалось однозначно определить подразделение ' + arr[depName] + ' в WT. Сотрудник из строки ' + processLines + ' не обработан.');
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                } else {
                    switch (linkOrg[0]) {
                        case 0:
                            anyError.push('Не удалось найти организацию ' + arr[orgName] + ' в WT. Сотрудник из строки ' + processLines + ' не обработан.');
                            break;
                        case 2:
                            anyError.push('Не удалось однозначно определить организацию ' + arr[orgName] + ' в WT. Сотрудник из строки ' + processLines + ' не обработан.');
                            break;
                        default:
                            break;
                    }
                    continue;
                }
            }
            try {
                doc.Save();
            } catch (e) {
                anyError.push('Не удалось обновить информацию о сотруднике с кодом ' + codeOrg + '/' + arr[userCode] + ' по причине: ' + ExtractUserError(e));
            }
            for (x = 0; x < ArrayCount(idCourse); x++) {
                course = tools.activate_course_to_person(user.id, idCourse[x], null, null, null, null, null, null, idGroup);
            }
            // course = tools.activate_course_to_person(user.id, idCourse, null, null, null, null, null, null, idGroup);
            // message = tools.create_notification("7_4", doc.DocID);
        }
        return 1;
    } else if (arrCount == 0) {
        return 0;
    } else if (arrCount > 1) {
        return 2;
    }
}

//Поиск организации по имени в базе
function findOrg(orgName) {
    itemsOrg = XQuery("for $elem in orgs where $elem/name='" + Trim(orgName) + "' return $elem");
    if (ArrayCount(itemsOrg) > 1) {
        return arrR = [2];
    } else if (ArrayCount(itemsOrg) == 1) {
        return arrR = [ArrayFirstElem(itemsOrg).id, ArrayFirstElem(itemsOrg).disp_name];
    } else return arrR = [0];
}

//Поиск поздазделеия по имени в базе
function findDep(depCode, depName, org) {
    if (depName == '') depName = '-';
    if (depCode == 0) {
        itemsDep = XQuery("for $elem in subdivisions where $elem/name='" + Trim(depName) + "' and $elem/org_id=" + org[0] + " return $elem");
    } else {
        itemsDep = XQuery("for $elem in subdivisions where $elem/code='" + Trim(depCode) + "' and $elem/org_id=" + org[0] + " return $elem");
    }
    if (ArrayCount(itemsDep) > 1) {
        return arrR = [2];
    } else if (ArrayCount(itemsDep) == 1) {
        return arrR = [ArrayFirstElem(itemsDep).id, ArrayFirstElem(itemsDep).name];
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

            return arrR = [newDep.DocID, depName];
        } catch (e) {
            alert('Не удалось создать новое позразделение по причине: ' + ExtractUserError(e));
            return arrR = [0];
        }
    }
}

//Поиск должности по имени в базе
function findPos(posName, org, dep) {
    itemsPos = XQuery("for $elem in positions where $elem/name='" + posName + "'and $elem/org_id=" + org[0] + " and $elem/parent_object_id=" + dep[0] + " return $elem");
    if (ArrayCount(itemsPos) > 1) {
        return arrR = [2];
    } else if (ArrayCount(itemsPos) == 1) {
        return arrR = [ArrayFirstElem(itemsPos).id, ArrayFirstElem(itemsPos).name];
    } else if (ArrayCount(itemsPos) == 0) {
        try {
            newPos = OpenNewDoc('x-local://wtv/wtv_position.xmd');
            newPos.BindToDb(DefaultDb);
            newPos.TopElem.name = StrTitleCase(StrLowerCase(posName));
            newPos.TopElem.org_id = Int(org[0]);
            newPos.TopElem.parent_object_id = Int(dep[0]);
            newPos.Save();
            return arrR = [newPos.DocID, StrTitleCase(StrLowerCase(posName))];
        } catch (e) {
            return arrR = [0];
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

//генерация нового пароля
function createPassword(count) {
    words = '123456789qwertyuiopasdfghjkzxcvbnmQWERTYUPASDFGHJKLZXCVBNM';
    result = '';
    for (l = 0; l < count; l++) {
        position = Random(0, StrCharCount(words) - 1);
        result += StrRangePos(words, position, position + 1);
    }
    return result;
}
//**************************************

function createArrayCourses(codes) {
    for (j = 0; j < ArrayCount(codes); j++) {
        courses = XQuery("for $elem in courses where $elem/code='" + codes[j] + "' return $elem");
        if (ArrayCount(courses) > 1) {
            alert('В базе найдено более двух курсов с кодом ' + codes[j] + '! Загрузка остановлена.');
            return;
        } else if (ArrayCount(courses) == 1) {
            for (item in courses) {
                idCourse.push(item.id);
            }
        } else {
            alert('В базе не найден курс с кодом ' + codes[j] + '!. Загрузка остановлена.');
            return;
        }
    }
}

//-=Тело скрипта=-
alert('!!!Процесс назначения ТОиР начат!');
initCodeOrgStructure();

var courses;
createArrayCourses(codesCourses);

var groups, course;
groups = XQuery("for $elem in groups where $elem/code='gURAL' return $elem");
if (ArrayCount(groups) > 1) {
    alert('В базе найдено больее двух групп с кодом gURAL!. Загрузка остановлена.');
    return;
} else if (ArrayCount(groups) == 1) {
    for (item in groups) {
        idGroup = item.id;
    }
} else {
    alert('В базе не найдено группы с кодом gURAL!. Загрузка остановлена.');
    return;
}

//try {
//    source = OpenDoc(excelFileUrl, 'format=excel');
//} catch (e) {
//    alert('Невозможно открыть файл с данными: ' + ExtractUserError(e));
//    return;
//}

linkSourceFile = XQuery("for $elem in resources where $elem/code='__test' return $elem");
itemFile = ArrayFirstElem(linkSourceFile);
docResource = OpenDoc(UrlFromDocID(itemFile.id));
excelFileUrl = docResource.TopElem.file_url;
try {
    source = OpenDoc(excelFileUrl, 'format=excel');
} catch (e) {
    alert("Невозможно открыть документ " + excelFileUrl + " из БД по причине: " + ExtractUserError(e));
    anyError.push("Невозможно открыть документ " + excelFileUrl + " из БД по причине: " + ExtractUserError(e));
    anyError.push('Синхронизация прервана!');
    writeLog(multipleUsers, duplicateUser, anyError);
    return;
}

lineArray = ArrayFirstElem(source.TopElem);
var m;
for (var i = 0; i < ArrayCount(lineArray); i++) {
    if (i == 0) continue;
    tabNum = lineArray[i][userCode];
    if (tabNum == '') {
        anyError.push('Строка ' + i + ': в поле Табельный номер нет значения. Сотрудник ' + lineArray[i][fullName] + ' не обработан.');
        continue;
    }
    if (StrCharCount(tabNum) > 6) {
        tabNum = StrRangePos(tabNum, 2, StrCharCount(tabNum));
    }
    try {
        tabNum = Int(tabNum);
    } catch (e) {
        anyError.push('Строка ' + i + ': сотрудник ' + lineArray[i][fullName] + ' с табельным номером ' + lineArray[i][userCode] + ' содержит в поле Табельный номер недопустимые символы. Сотрудник не обработан.');
        continue;
    }
    flagPAO = false;
    //TODO пересоздать массив для checkUser
    transferArr = [];
    for (m = 0; m < ArrayCount(lineArray[i]); m++) {
        if (m == 0) {
            transferArr.push(tabNum);
        } else {
            transferArr.push(lineArray[i][m]);
        }
    }

    objUser = checkUser(transferArr);
    if (objUser == 2) {
        multipleUsers.push('Строка ' + Int(i + 1) + ': табельный номер ' + String(lineArray[i][userCode]) + ', организация ' + lineArray[i][orgName]);
    } else if (objUser == 0) {

        //проверка SAP
        if (lineArray[i][orgName] == 'ПАО "НЛМК"') {
            usersSAP = XQuery("for $elem in cc_standartsapusers where $elem/code='" + tabNum + "' return $elem");
            if (ArrayCount(usersSAP) == 1) {
                userSAP = ArrayFirstElem(usersSAP);
                if (StrLowerCase(String(userSAP.name).split(' ')[0]) == StrLowerCase(String(lineArray[i][fullName]).split(' ')[0])) {
                    flagPAO = true;
                } else {
                    anyError.push('Строка ' + i + ': сотрудник с табельным номером ' + tabNum + ' не прошел проверку в SAP. Сотрудник не обработан.');
                    continue;
                }
            } else if (ArrayCount(usersSAP) > 1) {
                anyError.push('Не удалось однозначно определить сотрудника с табельным номером ' + tabNum + ' в списке SAP. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                continue;
            } else if (ArrayCount(usersSAP) == 0) {
                anyError.push('Не удалось найти сотрудника с табельным номером ' + tabNum + ' в списке SAP. Сотрудник из строки ' + Int(i + 1) + ' не обработан.');
                continue;
            }
        }

        //новый юзер
        try {
            newUser = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
            newUser.BindToDb(DefaultDb);

            orgSp = Trim(lineArray[i][orgName]);
            newUser.TopElem.code = codeOrgStruct[orgSp] + "/" + tabNum;
            newUser.TopElem.custom_elems.ObtainChildByKey("userCode").value = tabNum;
            newUser.TopElem.login = codeOrgStruct[orgSp] + '*' + tabNum;
            newUser.TopElem.change_password = true;
            newUser.TopElem.password = '123';

            newUser.TopElem.email = StrLowerCase(Trim(lineArray[i][emailUser]));

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
                anyError.push('Не верный формат поля ФИО в исходном документе у сотрудника ' + lineArray[i][fullName] + '. Сотрудник не обработан.');
                continue;
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
            for (z = 0; z < ArrayCount(idCourse); z++) {
                course = tools.activate_course_to_person(newUser.DocID, idCourse[z], null, null, null, null, null, null, idGroup);
            }
            //course = tools.activate_course_to_person(newUser.DocID, idCourse, null, null, null, null, null, null, idGroup);
            //message = tools.create_notification("7_4", newUser.DocID);
        } catch (e) {
            alert('Невозможно создать нового сотрудника: ' + ExtractUserError(e));
            break;
        }

        processLines += 1;
    } else if (objUser == 1) {
        //есть юзер
        duplicateUser.push('Строка ' + Int(i + 1) + ': табельный номер ' + lineArray[i][userCode] + ', организация ' + lineArray[i][orgName]);

    } else if ((objUser == 3) || (objUser == 4)) {
        continue;
    }
}

writeLog(multipleUsers, duplicateUser, anyError);
ShowMesssages();
alert('!!!Процесс назначения курса Конфликт интересов закончен! Загружено новых сотрудников - ' + processLines);
//************************************