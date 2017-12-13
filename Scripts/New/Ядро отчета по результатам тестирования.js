if (!Ps.assessment_id.HasValue) {
    Screen.MsgBox(ms_tools.get_const('fin7dxmfw2'), ms_tools.get_const('1nf4otx3w4'), 'error', 'ok');
    Cancel();
}

function arrayCross(first_array, field, second_array) {
    array1 = first_array;
    array2 = second_array;
    res_array = Array();
    count = 0;
    for (elem1 in array1) {
        for (elem2 in array2) {
            if (eval('elem1.' + field) == elem2) {
                res_array[count] = elem1;
                count++;
            }
        }
    }
    expr = 'ArraySelectDistinct( res_array, \'' + field + '\')';
    res_array = eval(expr);
    return res_array;
}

function add_learnings(_learning_array) {
    for (_learning in _learning_array)
        try {
            learningDoc = OpenDoc(UrlFromDocID(_learning.PrimaryKey)).TopElem;
            _child = Ps.learnings.AddChild();
            _child.AssignElem(learningDoc);

            if (TopElem.disp_person_list_staff)
                _child.person_list_staff = tools.person_list_staff_by_person_id(_learning.person_id);

            try {
                _child.person_code = _learning.person_id.ForeignElem.code
            }
            catch (ex) {
            }

            _child.per_cent = _child.max_score.HasValue & amp;&amp; _child.max_score != 0 ? (_child.score / _child.max_score) * 100. : 0;
            _lesson_report = tools.report_decrypt(learningDoc, '', (learningDoc.ChildExists('qti_text') ? learningDoc.qti_text : ''));
            _cur_history = OpenDocFromStr(_lesson_report, 'form=x-local://wtv/wtv_form_annals_text.xmd').TopElem.au.history;
            if (ArrayCount(_cur_history.objects) == 0)
                continue;
            _cur_sections = ArrayFirstElem(_cur_history.objects).section;
            for (_section in _cur_sections) {

                for (_question in _section.question)

                    try {
                        _cur_ques = Ps.questions.ObtainChildByKey(_question.PrimaryKey);
                        sQuestText = HtmlToPlainText(_question.text);
                        if (Ps.disp_full_question_text == false) {
                            _cur_ques.text = StrLen(sQuestText) & gt; Ps.text_length ? String(sQuestText).slice(0, Ps.text_length) + '...' : sQuestText;
                        }
                        else {
                            _cur_ques.text = sQuestText;
                        }
                        _cur_ques = _child.questions.ObtainChildByKey(_question.PrimaryKey);
                        _cur_ques.result = (_question.state == 'passed' ? StrNonTitleCase(ms_tools.get_const('lcnwu5wcgk')) : StrNonTitleCase(ms_tools.get_const('r1s987zw3e')));
                        for (_variant in _question.variant) {
                            sVariantText = HtmlToPlainText(_variant.text);
                            sVariantValue = HtmlToPlainText(_variant.value);
                            if (_variant == '1')
                                _cur_ques.answer = (_cur_ques.answer == '' ? (_cur_ques.answer + sVariantText) : (_cur_ques.answer + '; ' + sVariantText));

                            switch (_question.qtype) {
                                case 'range':
                                    _cur_ques.correct_answer = (_cur_ques.correct_answer == '' ? ((Int(_variant.ChildIndex) - 10) + ') - ' + sVariantText) : (_cur_ques.correct_answer + '; ' + (Int(_variant.ChildIndex) - 10) + ') - ' + sVariantText));
                                    _cur_ques.answer = (_cur_ques.answer == '' ? (sVariantValue) : (_cur_ques.answer + '; ' + sVariantValue));
                                    _cur_ques.quest_type = StrNonTitleCase(ms_tools.get_const('tmezpyvkde'));
                                    break;
                                case 'numeric':
                                    _str = '';
                                    for (_cond in _variant.cond)
                                        _str = _str + _cond.operator.ForeignElem.name + Trim(_cond) + '; ';
                                    _cur_ques.correct_answer = _str;
                                    _cur_ques.answer = sVariantValue;
                                    _cur_ques.quest_type = StrNonTitleCase(ms_tools.get_const('h521dhjmz1'));
                                    break;
                                case 'text':
                                    _str = '';
                                    for (_cond in _variant.cond)
                                        _str = _str + (_cond.operator == 'cn' ? '...' + Trim(_cond) + '...' : Trim(_cond)) + '; ';
                                    _cur_ques.correct_answer = _str;
                                    _cur_ques.quest_type = StrNonTitleCase(ms_tools.get_const('jelwpbc66v'));
                                    _cur_ques.answer = sVariantValue;
                                    break;
                                case 'oto':
                                    _cur_ques.correct_answer = (_cur_ques.correct_answer == '' ? (sVariantText + '-' + _variant.cor_value) : (_cur_ques.correct_answer + '; ' + sVariantText + '-' + _variant.cor_value));
                                    _cur_ques.answer = (_cur_ques.answer == '' ? (sVariantText + '-' + sVariantValue) : (_cur_ques.answer + '; ' + sVariantText + '-' + sVariantValue));
                                    _cur_ques.quest_type = StrNonTitleCase(ms_tools.get_const('e25zur3p2p'));
                                    break;
                                case 'select':
                                    if (_variant.correct == '1')
                                        _cur_ques.correct_answer = (_cur_ques.correct_answer == '' ? (sVariantText) : (_cur_ques.correct_answer + '; ' + sVariantText));
                                    _cur_ques.quest_type = StrNonTitleCase(ms_tools.get_const('hitxh8jynw'));
                                    break;
                                case 'choice':
                                    if (_variant.correct == '1')
                                        _cur_ques.correct_answer = sVariantText;
                                    _cur_ques.quest_type = StrNonTitleCase(ms_tools.get_const('xv2kddtovc'));
                                    break;
                                default:
                                    if (_variant.correct == '1')
                                        _cur_ques.correct_answer = (_cur_ques.correct_answer == '' ? (sVariantText) : (_cur_ques.correct_answer + '; ' + sVariantText));
                                    _cur_ques.quest_type = StrNonTitleCase(ms_tools.get_const('n1lss46xbd'));
                                    break;
                            }

                        }
                    }
                    catch (fff) {
                        alert(fff)
                    }
            }

        }
        catch (err) {
        }
}



Ps.learnings.Clear();
Ps.questions.Clear();


_xquery = 'for $learning in ' + Ps.disp_learning_type;
_where_str = ' $learning/assessment_id = ' + Ps.assessment_id;
_where_str = _where_str + (Ps.start_date == null ? '' : (_where_str == '' ? ' ' : ' and ') + '$learning/start_usage_date &gt;= date( \'' + Ps.start_date + '\' )');
_where_str = _where_str + (Ps.finish_date == null ? '' : (_where_str == '' ? ' ' : ' and ') + '$learning/start_usage_date &lt;= date( \'' + Ps.finish_date + '\' )');

_person_array = Array();

if (Ps.org_id.HasValue || Ps.parent_object_id.HasValue) {
    curNodeID = (Ps.parent_object_id != null ? Ps.parent_object_id : Ps.org_id);
    //_ids_array = ArraySelectDistinct( tools.get_sub_person_ids_by_subdivision_id( curNodeID )) ;
    if (Ps.hier_sub_select) {
        _ids_array = ArraySelectDistinct(tools.get_sub_person_ids_by_subdivision_id(curNodeID));
    }
    else {
        subsArray = XQuery('for $elem in subs where $elem/parent_id=' + curNodeID + ' and $elem/type=&quot;position&quot; return $elem');
        _ids_array = Array();
        count = 0;
        for (_sub in subsArray) {
            if (_sub.basic_collaborator_id.HasValue) {
                _ids_array[count] = _sub.basic_collaborator_id;
                count++;
            }
        }
        _ids_array = ArraySelectDistinct(_ids_array);
    }
    _person_array = QueryCatalogByKeys('collaborators', 'id', _ids_array);
}


if (Ps.group_id.HasValue) {
    try {
        groupDoc = OpenDoc(UrlFromDocID(TopElem.group_id)).TopElem;
    }
    catch (_gigi_) {
        groupDoc = undefined;
    }
    if (groupDoc != undefined)
        groupPersonsIDArray = ArrayExtract(groupDoc.collaborators, 'collaborator_id');

    if (ArrayCount(_person_array) > 0) {
        _person_array = arrayCross(_person_array, 'id', groupPersonsIDArray);
    }
    else {
        _person_array = QueryCatalogByKeys('collaborators', 'id', groupPersonsIDArray);
    }

}

if (Ps.person_id.HasValue) {
    if (ArrayCount(_person_array) > 0) {
        _person_array = ArraySelect(_person_array, 'id == Ps.person_id');
    }
    else if (!(Ps.org_id.HasValue || Ps.parent_object_id.HasValue || Ps.group_id.HasValue)) {
        _person_array = XQuery('for $elem in collaborators where $elem/id = ' + Ps.person_id + ' return $elem');
    }
}

if (Ps.org_id.HasValue || Ps.parent_object_id.HasValue || Ps.group_id.HasValue || Ps.person_id.HasValue) {
    for (_person in _person_array) {
        if (_person.id != null) {

            if (Ps.disp_learning_type == '(active_test_learnings,test_learnings)') {
                _learning_array = XQuery('for $learning in active_test_learnings where $learning/person_id = ' + _person.id + (_where_str == '' ? '' : ' and ') + _where_str + ' return $learning');
                add_learnings(_learning_array);
                _learning_array = XQuery('for $learning in test_learnings where $learning/person_id = ' + _person.id + (_where_str == '' ? '' : ' and ') + _where_str + ' return $learning');
                add_learnings(_learning_array);
            }
            else {
                _learning_array = XQuery('for $learning in ' + Ps.disp_learning_type + ' where $learning/person_id = ' + _person.id + (_where_str == '' ? '' : ' and ') + _where_str + ' return $learning');
                add_learnings(_learning_array);
            }

        }
    }
}
else {
    if (Ps.disp_learning_type == '(active_test_learnings,test_learnings)') {
        _learning_array = XQuery((_where_str == '' ? 'active_test_learnings' : 'for $learning in active_test_learnings where ' + _where_str + ' return $learning'));
        add_learnings(_learning_array);
        _learning_array = XQuery((_where_str == '' ? 'test_learnings' : 'for $learning in test_learnings where ' + _where_str + ' return $learning'));
        add_learnings(_learning_array);
    }
    else {
        _learning_array = XQuery((_where_str == '' ? Ps.disp_learning_type : 'for $learning in ' + Ps.disp_learning_type + ' where ' + _where_str + ' return $learning'));
        add_learnings(_learning_array);
    }
}


Ps.learnings.Sort(Ps.sort_type_id, '+');

Ps.last_assessment_id = Ps.assessment_id;