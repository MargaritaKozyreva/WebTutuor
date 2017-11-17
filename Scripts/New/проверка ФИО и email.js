function compareFIO(email, fio) {
    //alert("-->" + email + " " + fio);
    transl = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
        'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '!', '_': '!', '`': '!', '~': '!', '!': '!', '@': '!', '#': '!', '$': '!', '%': '!', '^': '!',
        '&': '!', '*': '!', '(': '!', ')': '!', '-': '!', '\=': '!', '+': '!', '[': '!', ']': '!', '\\': '!',
        '|': '!', '/': '!', '.': '!', ',': '!', '{': '!', '}': '!', '\'': '!', '"': '!', ';': '!', ':': '!',
        '?': '!', '<': '!', '>': '!', '№': '!',
        '1': '!', '2': '!', '3': '!', '4': '!', '5': '!', '6': '!', '7': '!', '8': '!', '9': '!', '0': '!'
        //TODO добавить английские символы
    };

    arrFIO = [];
    //arrFIO2 = [];
    translFIO = "";
    emailPart = [];
    errFIO = false;

    arrFIO = StrLowerCase(fio).split(" ");

    try {
        lastName = StrLowerCase(arrFIO[0]);
        firstName = StrLowerCase(arrFIO[1]);
        middleName = StrLowerCase(arrFIO[2]);
    } catch (e) {
        alert(e);
        errFIO = true;
    }

    for (i = 0; i < StrCharCount(lastName); i++) {
        try {
            if (transl[StrRangePos(lastName, i, i + 1)]) {
                translFIO += transl[StrRangePos(lastName, i, i + 1)];
            } else {
                translFIO += StrRangePos(lastName, i, i + 1);
            }
        } catch (e) {
            errFIO = true;
        }
    }

    translFIO += "_";
    try {
        if (transl[StrRangePos(firstName, 0, 1)] != undefined) {
            translFIO += StrRangePos(transl[StrRangePos(firstName, 0, 1)], 0, 1);
        }
        if (transl[StrRangePos(middleName, 0, 1)] != undefined) {
            translFIO += StrRangePos(transl[StrRangePos(middleName, 0, 1)], 0, 1);
        }
    } catch (e) {
        errFIO = true;
    }

    if (StrContains(translFIO, "!")) {
        errFIO = true;
    }

    if (errFIO)
        return false;

    compare = true;
    if (checkEmailFormat(StrLowerCase(email))) {
        emailPart = email.split("@");
        emailFIO = emailPart[0];

        allChar = 0;
        if (StrCharCount(translFIO) == StrCharCount(emailFIO)) {
            allChar = StrCharCount(translFIO);
            for (i = 0; i < allChar; i++) {
                if (StrRangePos(translFIO, i, i + 1) != StrRangePos(emailFIO, i, i + 1)) {
                    compare = false;
                    break;
                }
            }
        } else if (StrCharCount(translFIO) < StrCharCount(emailFIO)) {
            try {
                digit = Int(StrRightRangePos(emailFIO, StrCharCount(translFIO)));
            } catch (error) {
                compare = false;
            }
        } else {
            compare = false;
        }

        if (compare) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function checkEmail(email) {
    return true;
}
alert(compare_fio('pololyan_ya@nlmk.com', 'Пололин Я. А.'));