
Server.Execute("include/user_init.html");
//-=Раздел объявления переменных=-
dateTest = (Request.Query.HasProperty("datetest") ? Trim(String(Request.Query.datetest)) : "");
timeTest = (Request.Query.HasProperty("timetest") ? Trim(String(Request.Query.timetest)) : "");
codeTest = (Request.Query.HasProperty("codetest") ? Trim(String(Request.Query.codetest)) : "");

alert(codeTest + " " + dateTest + " " + timeTest);

arr = [];
arr = dateTest.split(",");
if (ArrayCount(arr) < 3 || ArrayCount(arr) > 3) {
    //TODO ошибка формата
} else {
    dateTest = arr[1] + arr[2];
}

alert(ParseDate(dateTest));

if (dateTest == "" || timeTest == "" || codeTest == "") {
    Request.Redirect("test_order.html?m=1");
    Cancel();
}
//поиск теста
tests = XQuery("for $elem in assessments where $elem/code='" + codeTest + "' return $elem");
if (ArrayCount(tests) > 1) {
    Request.Redirect("test_order.html?m=2");
    Cancel();
} else if (ArrayCount(tests) == 0) {
    Request.Redirect("test_order.html?m=2");
    Cancel();
} else if (ArrayCount(tests) == 1) {
    for (test in tests) {
        idTest = test.id;
        nameTest = test.title;
    }
}

try {
    newOrder = OpenNewDoc("x-local://udt/udt_cc_testorder.xmd");
    newOrder.BindToDb(DefaultDb);
    newOrder.TopElem.userid = curUserID;
    newOrder.TopElem.usercode = curUser.code;
    newOrder.TopElem.username = curUser.fullname;
    newOrder.TopElem.testcode = idTest;
    newOrder.TopElem.testname = nameTest;
    newOrder.TopElem.testdate = ParseDate(dateTest);
    newOrder.TopElem.testtime = timeTest;
    newOrder.Save();
} catch (e) {
    alert("Ошибка при записи на тестирование: " + e);
}
Request.Redirect("view_doc.html?mode=test_order");
Cancel();
