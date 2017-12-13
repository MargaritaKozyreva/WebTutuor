//-=Раздел объявления переменных=-
userCode = (Request.Query.HasProperty("usercode") ? Trim(String(Request.Query.usercode)) : "");
fullName = (Request.Query.HasProperty("fio") ? Trim(String(Request.Query.fio)) : "");
orgCode = (Request.Query.HasProperty("organisation") ? Trim(String(Request.Query.organisation)) : "");
depName = (Request.Query.HasProperty("depname") ? Trim(String(Request.Query.depname)) : "");
posName = (Request.Query.HasProperty("posname") ? Trim(String(Request.Query.posname)) : "");
emailUser = (Request.Query.HasProperty("email") ? Trim(String(Request.Query.email)) : "");

arrFIO = [];
//--------------------------------------------------

//-=Раздел объявления функций=-

//Проверка присутствия сотрудника в базе
function checkUser() {
    arrUsers = XQuery("for $elem in collaborators where $elem/code='" + orgCode + '/' + userCode + "' return $elem");
    arrCount = ArrayCount(arrUsers);
    if (arrCount == 1) {
        for (user in arrUsers) {
            try {
                doc = OpenDoc(UrlFromDocID(user.id));

                if (orgCode != '1010') {
                    doc.TopElem.lastname = arrFIO[0];
                    doc.TopElem.firstname = arrFIO[1];
                    doc.TopElem.middlename = arrFIO[2];
                }

                doc.TopElem.email = StrLowerCase(emailUser);
                doc.Save();
            } catch (e) {
                alert('ERR: Регистрация нового сотрудника. Обновление существующего: ' + ExtractUserError(e));
                Request.Redirect("register_user.html?m=bad_save");
                Cancel();
            }

            flag = tools.create_notification("7_1", doc.DocID);
            if (flag) {
                return 1;
            } else {
                return 3;
            }
        }
    } else if (arrCount == 0) {
        return 0;
    } else if (arrCount > 1) {
        return 2;
    }
}

//Поиск организации по коду в базе
function findOrg(code) {
    itemsOrg = XQuery("for $elem in orgs where $elem/code='" + code + "' return $elem");
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
            newPos.Save();
            return arr = [newPos.DocID, StrTitleCase(StrLowerCase(posName))];
        } catch (e) {
            alert('Не удалось создать новую должность по причине: ' + ExtractUserError(e));
            return arr = [0];
        }
    }
}

//генерация нового пароля
function createPassword(count) {
    words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    result = '';
    for (i = 0; i < count; i++) {
        position = Random(0, StrCharCount(words) - 1);
        result += StrRangePos(words, position, position + 1);
    }
    return result;
}

//проверка формата email
function checkEmailFormat(email) {
    var formatEmail = true;
    if (email != "") {
        arrEmail = String(email).split("@");
        if (ArrayCount(arrEmail) <= 1 || ArrayCount(arrEmail) > 2) {
            formatEmail = false;
        } else {
            fio = arrEmail[0];
            var count = 0;
            for (var i = 0; i < StrCharCount(fio); i++) {
                if (StrRangePos(fio, i, i + 1) == "_") {
                    count++;
                    if (count > 1) {
                        formatEmail = false;
                        break;
                    }
                }
            }
        }

        if (!(arrEmail[1] == "nlmk.com")) {
            formatEmail = false;
        }

        return formatEmail;
    } else {
        return false;
    }
}

function checkFormatFIO() {
    arr = String(fullName).split(' ');

    for (k = 0; k < ArrayCount(arr); k++) {
        if (arr[k] != "") arrFIO.push(arr[k]);
    }

    if (ArrayCount(arrFIO) != 3 || StrCharCount(arrFIO[1]) < 2 || StrCharCount(arrFIO[2]) < 6 || StrCharCount(arrFIO[0]) < 2) {
        return false;
    }

    return true;
}

function checkUserCode() {
    try {
        tmp = Int(userCode);
        return true;
    } catch (e) {
        return false;
    }
}

//**************************************


//-=Тело скрипта=-

//проверка заполнения данных
if (fullName == "" || depName == "" || orgCode == "" || userCode == "" || emailUser == "" || posName == "") {
    Request.Redirect("register_user.html?err=bad_data");
    Cancel();
}

//проверка формата ФИО
if (!checkFormatFIO()) {
    Request.Redirect("register_user.html?err=bad_name");
    Cancel();
}

//Проверка табельного номера на цифры
if (!checkUserCode()) {
    Request.Redirect("register_user.html?err=bad_usercode");
    Cancel();
}

if (!checkFormatEmail()) {
    Request.Redirect("register_user.html?err=bad_email");
    Cancel();
}

flagPAO = false;

objUser = checkUser();
if (objUser == 2) {
    Request.Redirect("register_user.html?err=user_check_many&user=" + userCode + "&org=" + orgCode);
    Cancel();
} else if (objUser == 0) {
    //проверка SAP
    if (orgCode == "1010") {
        usersSAP = XQuery("for $elem in cc_standartsapusers where $elem/code='" + userCode + "' return $elem");
        if (ArrayCount(usersSAP) == 1) {
            userSAP = ArrayFirstElem(usersSAP);
            if (StrLowerCase(String(userSAP.name).split(" ")[0]) == StrLowerCase(String(fullName)).split(" ")[0]) {
                flagPAO = true;
            } else {
                Request.Redirect("register_user.html?err=bad_name2");
                Cancel();
            }
        } else if (ArrayCount(usersSAP) > 1) {
            Request.Redirect("register_user.html?err=bad_sap&user=" + userCode);
            Cancel();
        } else if (ArrayCount(usersSAP) == 0) {
            Request.Redirect("register_user.html?err=bad_sap&user=" + userCode);
            Cancel();
        }
    }

    //новый юзер
    try {
        newUser = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
        newUser.BindToDb(DefaultDb);

        newUser.TopElem.code = orgCode + "/" + userCode;
        newUser.TopElem.custom_elems.ObtainChildByKey("userCode").value = userCode;
        newUser.TopElem.login = orgCode + "*" + userCode;

        newUser.TopElem.password = createPassword(8);
        newUser.TopElem.change_password = true;

        newUser.TopElem.email = StrLowerCase(emailUser);

        newUser.TopElem.lastname = arrFIO[0];
        newUser.TopElem.firstname = arrFIO[1];
        newUser.TopElem.middlename = arrFIO[2];

        org = (flagPAO) ? org = '1010' : org = Trim(orgCode);
        linkOrg = findOrg(org);

        if (linkOrg.length == 2) {
            newUser.TopElem.org_id = linkOrg[0];

            dep = (flagPAO) ? Trim(userSAP.namedep) : depName;
            linkDep = (flagPAO) ? findDep(Trim(userSAP.codedep), dep, linkOrg) : findDep(0, dep, linkOrg);
            if (linkDep.length == 2) {
                newUser.TopElem.position_parent_id = linkDep[0];

                if (flagPAO) {
                    pos = StrTitleCase(String(Trim(userSAP.namepos)).substr(0, 1)) + String(Trim(userSAP.namepos)).substr(1);
                } else {
                    pos = StrTitleCase(String(Trim(posName)).substr(0, 1)) + String(Trim(posName)).substr(1);
                }
                linkPos = findPos(pos, linkOrg, linkDep);
                if (linkPos.length == 2) {
                    newUser.TopElem.position_id = linkPos[0];
                } else {
                    switch (linkPos[0]) {
                        case 0:
                            Request.Redirect("register_user.html?err=bad_save");
                            Cancel();
                        case 2:
                            alert('ERR: Регистрация нового сотрудника. Множественное совпадение должностей: ' + pos);
                            Request.Redirect("register_user.html?err=some_err&user=" + userCode);
                            Cancel();
                        default:
                            break;
                    }
                    continue;
                }
            } else {
                switch (linkDep[0]) {
                    case 0:
                        Request.Redirect("register_user.html?err=bad_save");
                        Cancel();
                    case 2:
                        alert('ERR: Регистрация нового сотрудника. Множественное совпадение подразделений: ' + dep);
                        Request.Redirect("register_user.html?err=some_err&user=" + userCode);
                        Cancel();
                    default:
                        break;
                }
                continue;
            }
        } else {
            switch (linkOrg[0]) {
                case 0:
                    alert('ERR: Регистрация нового сотрудника. Не найдена организация: ' + org);
                    Request.Redirect("register_user.html?err=some_err&user=" + userCode);
                    Cancel();
                case 2:
                    alert('ERR: Регистрация нового сотрудника. Множественное совпадение организаций: ' + org);
                    Request.Redirect("register_user.html?err=some_err&user=" + userCode);
                    Cancel();
                default:
                    break;
            }
            continue;
        }
        newUser.Save();
    } catch (e) {
        alert('ERR: Регистрация нового сотрудника. Создание нового: ' + ExtractUserError(e));
        Request.Redirect("register_user.html?err=bad_save");
        Cancel();
    }

    try {
        flagNew = tools.create_notification("7_1", newUser.DocID);
        if (flagNew) {
            Request.Redirect("register_user.html?m=ok");
            Cancel();
        } else {
            Request.Redirect("register_user.html?m=ok_not_send");
            Cancel();
        }
    } catch (e) {
        alert('ERR: Регистрация нового сотрудника. Создание оповещения: ' + e);
    }
} else if (objUser == 1) {
    //есть юзер и сообщение отправлено
    Request.Redirect("register_user.html?m=ok");
    Cancel();
} else if (objUser == 3) {
    //есть юзер и сообщение не отправлено
    Request.Redirect("register_user.html?m=ok_not_send");
    Cancel();
}
//************************************