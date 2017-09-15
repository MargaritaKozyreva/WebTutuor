codeOrgStruct = {};

function initCodeOrgStructure() {
    codeOrgStruct['АО "НЛМК-Инжиниринг"'] = 'F050';
    codeOrgStruct['АО "НЛМК-Урал"'] = '5010';
    codeOrgStruct['ОАО "АЛТАЙ-КОКС"'] = '3010';
    codeOrgStruct['ОАО "ДОЛОМИТ"'] = 'F007';
    codeOrgStruct['ОАО "СТАГДОК"'] = 'F008';
    codeOrgStruct['ОАО "СТОЙЛЕНСКИЙ  ГОК"'] = '2010';
    codeOrgStruct['ООО "ВИЗ-СТАЛЬ"'] = '1020';
    codeOrgStruct['ООО "Торговый дом НЛМК"'] = '9020';
    codeOrgStruct['ООО "ГАЗОБЕТОН 48"'] = 'F006';
    codeOrgStruct['ООО "НЛМК-ИТ"'] = '9010';
    codeOrgStruct['ООО "НЛМК-КАЛУГА"'] = '5020';
    codeOrgStruct['ООО "НЛМК-Связь"'] = '9030';
    codeOrgStruct['ООО "НЛМК-Сорт"'] = 'F017';
    codeOrgStruct['ООО "НЛМК-Урал Сервис"'] = '4010';
    codeOrgStruct['ООО "НЛМК-УЧЕТНЫЙ ЦЕНТР"'] = 'F001';
    codeOrgStruct['ПАО "НЛМК"'] = '1010';
}

initCodeOrgStructure();

users = XQuery("for $elem in collaborators where contains($elem/login, 'DO*') return $elem");
alert('!!!Агент по смене логинов стартовал! Количество записей: ' + ArrayCount(users));
err = 0; ok = 0;
for (user in users) {
    org = user.org_id.ForeignElem.name;
    code = codeOrgStruct[org];
    doc = OpenDoc(UrlFromDocID(user.id));
    userCode = String(doc.TopElem.code).substr(2);
    doc.TopElem.login = String(code) + '*' + userCode;
    doc.TopElem.code = String(code) + '/' + userCode;
    doc.TopElem.custom_elems.ObtainChildByKey('userCode').value = userCode;
    try {
        doc.Save();
        ok++;
    } catch (e) {
        err++;
        alert('Не удалось сохранить карточку сотрудника с логином ' + user.login + ' по причине: ' + ExtractUserError(e));
    }
}
alert('!!!Агент по смене логинов завершил работу! Ошибок: ' + err + ', успешно обработно: ' + ok);