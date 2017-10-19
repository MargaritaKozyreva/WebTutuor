
function set_log(str) {
    LOG += '\n' + str;
}

function arrayDistinctField(arr, field) {
    if (!StrContains(field, 'This.'))
        field = 'This.' + field;
    var ret_array = ArrayExtract(arr, field);
    ret_array = ArraySelectDistinct(ret_array, 'This');
    return ret_array;

}
function get_excel_data(file_path) {
    var MAX_ROW_COUNT = 10000;				// максимальное количество строк, которое будет обрабатываться
    var FIRST_COL = 1;						// номер колонки, с которой начинаются данные (отсчет с нуля)
    var FIRST_ROW = 5;						// 1-ая строка, с которой начинаются данные (отсчет с единицы)
    var cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    var data_array = Array();
    var oSheet = new Object;

    try {
        var oExcelDoc = new ActiveXObject("Websoft.Office.Excel.Document");
        oExcelDoc.Open(file_path);

        for (s = 0; s < oExcelDoc.WorkSheetsCount; s++) {
            sheet = oExcelDoc.GetWorksheet(s);

            /*** ДАННЫЕ ИЗ ШАПКИ ТАБЛИЦЫ ***/
            oSheet = new Object;
            oSheet.table = Array();
            oSheet.head = new Object;
            oSheet.head.SetProperty(StrUpperCase('number'), (s + 1));
            for (i = 1; i < 5; i++) {
                param = sheet.getCell('B' + i).Value;
                value = sheet.getCell('C' + i).Value;
                oSheet.head.SetProperty(StrUpperCase(param), value);
            }

            for (i = FIRST_ROW; i < MAX_ROW_COUNT; i++) {
                try {
                    my_row = Array();
                    for (letter in ArrayRange(cols, FIRST_COL, MAX_ROW_COUNT)) {
                        my_cell = new Object;
                        xls_cell = sheet.getCell(letter + i);
                        my_cell.SetProperty('text', (xls_cell.Value == undefined ? '' : xls_cell.Value));
                        my_cell.SetProperty('color', xls_cell.Style.ForegroundColor);
                        my_cell.pics = Array();
                        for (p = 0; p < xls_cell.PicturesCount; p++) {
                            pic = xls_cell.GetPicture(p);
                            pic_path = ObtainTempFile('.png');
                            pic.SaveAs(UrlToFilePath(pic_path));

                            my_cell.pics.push(pic_path);
                        }

                        my_row.push(my_cell);
                    }
                    if (ArrayOptFind(my_row, "This.text!=''") != undefined) {
                        oSheet.table.push(my_row);
                    }
                    else {
                        set_log('Лист [' + s + '] обработано [' + (i - 1) + '] строк');
                        break;
                    }


                }
                catch (err) {
                    set_log('ошибка при обработке строки файла [' + i + '] ' + err);
                    break;
                }
            }

            data_array.push(oSheet);
        }
    }
    catch (err) {
        set_log('ошибка загрузки данных из excel ' + err);
    }
    return data_array;

}

function obtain_role(code, name, parent_id) {
    var ret = null;
    if (Trim(name) == '')
        return ret;
    var xq = "for $elem in roles where $elem/name=" + XQueryLiteral(Trim(name)) + " return $elem";
    var role = ArrayOptFirstElem(XQuery(xq));
    if (role == undefined) {
        docRole = OpenNewDoc("x-local://qti/qti_role.xmd");
        roleDoc = docRole.TopElem;
        roleDoc.code = code;
        roleDoc.name = name;
        roleDoc.parent_role_id = parent_id;
        docRole.BindToDb(DefaultDb);
        docRole.Save();
        ret = docRole.DocID;
    }
    else
        ret = role.id;
    return ret;
}



function get_file_path(file_path_param) {
    var file_path = '';
    if (LdsIsServer) {
        // агент выполняется на сервере
        try {
            file_path = Trim(Param.GetProperty(file_path_param));
        }
        catch (err) {
            file_path = "";
        }
    }
    else {
        // если агент выполняется на клиенте, то запросим файл
        file_path = UrlToFilePath(Screen.AskFileOpen('', '*.xls'));
    }

    return file_path;
}

function get_item(title) {
    xq = "for $elem in items where $elem/title='" + title + "' return $elem";
    return ArrayOptFirstElem(XQuery(xq));
}

function get_test(title) {
    xq = "for $elem in assessments where  $elem/title='" + title + "' return $elem";
    return ArrayOptFirstElem(XQuery(xq));
}


LOG = 'импорт вопросов для тестов->' + Date();

MAX_ANS_COUNT = 4;	// количество ответов
var file_path = get_file_path('FILE_PATH');		// путь к файлу с данными

excel_data = get_excel_data(file_path);
questions = Array();
for (_sheet in excel_data) {
    matrix = _sheet.head.GetOptProperty('МАТРИЦА', '');
    discipline = _sheet.head.GetOptProperty('ДИСЦИПЛИНА', '');
    element = _sheet.head.GetOptProperty('ЭЛЕМЕНТ', '');
    sheet_number = _sheet.head.GetOptProperty('NUMBER', '');

    matrix_role_id = obtain_role('', matrix, null);
    discipline_role_id = obtain_role(StrLeftRange(discipline, 5), discipline, matrix_role_id);
    element_role_id = obtain_role(StrLeftRange(element, 7), element, discipline_role_id);

    for (_row in _sheet.table) {
        try {
            level = _row[0];						// Уровень
            quest = _row[1];						//  Вопрос	
            for (answer_array = Array(), i = 0; i < MAX_ANS_COUNT; i++) {
                answer_array.push(_row[2 + i]);			// Ответы
            }

            /*** Проверки ***/
            if (Trim(quest.text) == '' || StrContains(level.text, 'Уровень'))	// попали на заголовок таблицы		
                continue;
            /***************/

            oQuestion = new Object;						// Вопрос теста 
            oQuestion.title = Trim(quest.text);				// Текст вопроса
            oQuestion.level = Trim(level.text);				// Уровень
            oQuestion.matrix = matrix;					// Матрица
            oQuestion.discipline = discipline;			// Дисциплина	
            oQuestion.element = element;				// Элемент	
            oQuestion.sheet_number = sheet_number;		// Порядковый номер листа

            oQuestion.matrix_role_id = matrix_role_id;					// Матрица
            oQuestion.discipline_role_id = discipline_role_id;			// Дисциплина	
            oQuestion.element_role_id = element_role_id;				// Элемент				

            oQuestion.img_path = '';					// путь к картинке вопроса
            if (ArrayCount(quest.pics) > 0) {
                oQuestion.img_path = ArrayFirstElem(quest.pics);
            }

            oQuestion.answers = Array();					// ответы
            for (_answer in answer_array) {
                if (Trim(_answer.text) == "")
                    continue;

                oAnswer = new Object;
                oAnswer.text = Trim(_answer.text);
                oAnswer.is_correct_answer = (!StrContains(_answer.color, 'FFFFFF') && _answer.color != '');
                oAnswer.img_path = '';
                if (ArrayCount(_answer.pics) > 0) {
                    oAnswer.img_path = ArrayFirstElem(_answer.pics);
                }

                oQuestion.answers.push(oAnswer);

            }
            questions.push(oQuestion);
        }
        catch (err) {
            set_log('ошибка при обработке вопроса ' + err);
        }
    }
}

q_count = 0;
created_q_count = 0;
item_array = Array();
for (_q in questions) {

    try {
        item_elem = get_item(_q.title);
        if (item_elem == undefined) {

            docItem = OpenNewDoc("x-local://qti/qti_item.xmd");
            itemDoc = docItem.TopElem;
            docItem.BindToDb(DefaultDb);
            created_q_count++;
        }
        else {

            docItem = OpenDoc(UrlFromDocID(item_elem.id));
            itemDoc = docItem.TopElem;
            itemDoc.answers.Clear();
        }

        itemDoc.title = _q.title;
        itemDoc.question_text = itemDoc.title;
        itemDoc.code = StrLeftRange(_q.element, 7) + '_' + q_count;

        switch (_q.level) {
            case 'Базовый':
                itemDoc.question_points = 1;
                break;
            case 'Знания':
            case 'Знание':
                itemDoc.question_points = 2;
                break;
            case 'Опыт':
                itemDoc.question_points = 3;
                break;
            case 'Углубленный':
                itemDoc.question_points = 4;
                break;
        }

        if (_q.matrix_role_id != '')
            itemDoc.role_id.ObtainByValue(_q.matrix_role_id);
        if (_q.discipline_role_id != null)
            itemDoc.role_id.ObtainByValue(_q.discipline_role_id);
        if (_q.element_role_id != null)
            itemDoc.role_id.ObtainByValue(_q.element_role_id);


        if (_q.img_path != '') {
            itemDoc.image.name = UrlFileName(_q.img_path);
            itemDoc.image.data.LoadFromFile(_q.img_path);
        }


        for (_ans in _q.answers) {
            i_answer = itemDoc.answers.AddChild();
            i_answer.text = _ans.text;
            if (_ans.img_path != '') {
                i_answer.image.name = UrlFileName(_ans.img_path);
                i_answer.image.data.LoadFromFile(_ans.img_path);
            }
            i_answer.is_correct_answer = _ans.is_correct_answer;
        }
        if (ArrayCount(ArraySelect(itemDoc.answers, 'This.is_correct_answer')) > 1)
            itemDoc.type_id = 'multiple_response';

        itemDoc.custom_elems.ObtainChildByKey('level').value = _q.level;
        itemDoc.custom_elems.ObtainChildByKey('discipline').value = _q.discipline;
        itemDoc.custom_elems.ObtainChildByKey('element').value = _q.element;
        itemDoc.custom_elems.ObtainChildByKey('matrix').value = _q.matrix;
        docItem.Save();
        item_array.push({
            id: docItem.DocID,
            title: itemDoc.title,
            discipline: _q.discipline,
            element: _q.element
        });

        q_count++;

    }
    catch (err) {
        set_log('ошибка при создании вопроса  ' + err);
    }
}

created_test_count = 0;
if (Param.NEED_CREATE_TEST == '1') {
    discipline_array = arrayDistinctField(item_array, 'discipline');
    for (_d in discipline_array) {
        if (Trim(_d) === '') {
            continue;
        }

        d_items = ArraySelect(item_array, 'This.discipline==_d');
        element_array = arrayDistinctField(d_items, 'element');

        test_title = StrRightRangePos(_d, 5);
        test_elem = get_test(test_title);
        if (test_elem == undefined) {
            docTest = OpenNewDoc("x-local://qti/qti_assessment.xmd");
            testDoc = docTest.TopElem;
            docTest.BindToDb(DefaultDb);
            created_test_count++;
        }
        else {
            docTest = OpenDoc(UrlFromDocID(test_elem.id));
            testDoc = docTest.TopElem;
            testDoc.sections.Clear();
        }

        testDoc.code = StrLeftRange(_d, 5);
        testDoc.title = test_title;
        for (_elem in element_array) {
            if (Trim(_elem) == '')
                continue;

            _section = testDoc.sections.AddChild();
            _section.code = StrLeftRange(_elem, 7);
            _section.title = StrRightRangePos(_elem, 7);
            e_items = ArraySelect(d_items, 'This.element==_elem');
            for (_i in e_items) {
                _t_item = _section.items.ObtainChildByKey(_i.id);
                _t_item.title = _i.title;
            }
        }

        docTest.Save();

    }

}


set_log('импорт вопросов завершен. Создано ' + created_q_count + ' вопросов. Создано ' + created_test_count + ' тестов');
alert(LOG);

