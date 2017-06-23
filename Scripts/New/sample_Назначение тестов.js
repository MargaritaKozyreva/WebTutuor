// -------------------------------------------------------------------------------------------------
// автор: АТ
// создан: 12.01.2010
// изменения: 13.01.2010 (VB) - рефакторинг
// ----------------------------------Описание-------------------------------------------------------
// Агент назначения эл. курсов и тестов группе
// ---------------------------------Предупреждение--------------------------------------------------
// <нет>
// ---------------------------------Параметры агента------------------------------------------------
// код доп поля списка кодов тестов в карточке группы (поля типа Строка)
TEST_LIST_FIELD_CODE = "testsID";
// код доп поля списка кодов курсов в карточке группы (поля типа Строка)
COURSE_LIST_FIELD_CODE = "coursesID";
// -------------------------------------------------------------------------------------------------

// ******************ОСНОВНАЯ ОБЛАСТЬ*************************
alert("Агент назначения эл. курсов и тестов группе...");

if (OBJECTS_ID_STR != '')
    selectedGroup = OBJECTS_ID_STR.split(";");
else
    selectedGroup = ArrayExtract(XQuery("for $i in groups return $i"), "This.id");

check = Param.check == "true" || Param.check == true || Param.check == "1";
check_success = Param.check_success == "true" || Param.check_success == true || Param.check_success == "1";

for (_group in selectedGroup) {
    GroupDoc = OpenDoc(UrlFromDocID(Int(_group))).TopElem;

    // тесты
    if (GroupDoc.custom_elems.ChildByKeyExists(TEST_LIST_FIELD_CODE)) {
        arrayTests = String(GroupDoc.custom_elems.GetChildByKey(TEST_LIST_FIELD_CODE).value).split(";");
        for (_testCode in arrayTests) {
            try {
                _objectTestID = ArrayOptFirstElem(XQuery("for $elem in assessments where $elem/code = '" + _testCode + "' return $elem")).id;
            }
            catch (err) {
                alert("ОШИБКА: карточка теста с кодом '" + _testCode + "' не найдена.");
                continue;
            }
            for (_coll in GroupDoc.collaborators) {
                try {

                    if (check) {
                        arr_learn = XQuery("for $i in test_learnings where $i/person_id = " + _coll.collaborator_id + " and $i/assessment_id = " + _objectTestID + " return $i ");
                        if (!check_success) {
                            tools.activate_test_to_person(_coll.collaborator_id, _objectTestID, null, null, null, null, null, null, null, Int(_group));
                        }
                        else {
                            if (ArrayOptFirstElem(ArraySelect(arr_learn, "This.state_id == 4")) != undefined)
                                continue;
                            else
                                tools.activate_test_to_person(_coll.collaborator_id, _objectTestID, null, null, null, null, null, null, null, Int(_group));
                        }

                    }
                    else {
                        arr_learn = XQuery("for $i in learnings where $i/person_id = " + _coll.collaborator_id + " and $i/assessment_id = " + _objectTestID + " return $i ");
                        if (ArrayOptFirstElem(arr_learn) == undefined)
                            tools.activate_test_to_person(_coll.collaborator_id, _objectTestID, null, null, null, null, null, null, null, Int(_group));
                    }
                }
                catch (err) {
                    alert("ОШИБКА: невозможно активировать/добавить объект сотруднику." + err);
                    continue;
                }
            }
        }
    }

    // эл. курсы
    if (GroupDoc.custom_elems.ChildByKeyExists(COURSE_LIST_FIELD_CODE)) {
        arrayCourse = String(GroupDoc.custom_elems.GetChildByKey(COURSE_LIST_FIELD_CODE).value).split(";");
        for (_courseCode in arrayCourse) {

            try {
                _objectCourseID = ArrayOptFirstElem(XQuery("for $elem in courses where $elem/code = '" + _courseCode + "' return $elem")).id;
            }
            catch (err) {
                alert("ОШИБКА: карточка эл. курса с кодом '" + _courseCode + "' не найдена");
                continue;
            }
            for (_coll in GroupDoc.collaborators) {
                try {
                    if (check) {
                        arr_learn = XQuery("for $i in learnings where $i/person_id = " + _coll.collaborator_id + " and $i/course_id = " + _objectCourseID + " return $i ");
                        if (!check_success) {
                            tools.activate_course_to_person(_coll.collaborator_id, _objectCourseID, null, null, null, null, null, '', Int(_group));
                        }
                        else {
                            if (ArrayOptFirstElem(ArraySelect(arr_learn, "This.state_id == 4")) != undefined)
                                continue;
                            else
                                tools.activate_course_to_person(_coll.collaborator_id, _objectCourseID, null, null, null, null, null, '', Int(_group));
                        }

                    }
                    else {
                        arr_learn = XQuery("for $i in learnings where $i/person_id = " + _coll.collaborator_id + " and $i/course_id = " + _objectCourseID + " return $i ");
                        if (ArrayOptFirstElem(arr_learn) == undefined)
                            tools.activate_course_to_person(_coll.collaborator_id, _objectCourseID, null, null, null, null, null, '', Int(_group));
                    }

                }
                catch (err) {
                    alert("ОШИБКА: невозможно активировать/добавить объект сотруднику." + err);
                    continue;
                }
            }
        }
    }
} // for (_group in selectedGroup)

alert("Агент назначения эл. курсов и тестов группе завершен.");