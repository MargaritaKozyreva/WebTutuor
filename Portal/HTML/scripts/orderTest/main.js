$('#multiSelect').multipleSelect({
    width: 800,
    filter: true,
    single: true,
    placeholder: "Выберите тесты"
});
$('#singleSelect').multipleSelect({
    width: 350,
    single: true,
    placeholder: "Выберите время"
});
$.datepicker.regional['ru'] = {
    closeText: 'Закрыть',
    prevText: '&#x3c;Пред',
    nextText: 'След&#x3e;',
    currentText: 'Сегодня',
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ],
    monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
                'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
            ],
    dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dateFormat: 'dd.mm.yy',
    firstDay: 1,
    isRTL: false
};

$.datepicker.setDefaults($.datepicker.regional['ru']);
$("#datepicker").datepicker({
    minDate: +0,
    maxDate: "+1M",
    showOn: "button",
    buttonImage: "pics/calendar.png",
    buttonImageOnly: true,
    buttonText: "Нажмите для выбора даты",
    dateFormat: "DD, d MM, yy"
});

document.body.addEventListener("click", function(event) {
	if (event.target.id == "removeOrder") {
		if (!(confirm("Удалить заявку?"))) {
			event.preventDefault();
		} else {
			targetURL = "test_order_server.html?mode=remove&id="+event.target.attributes["iddoc"].value+"&curobjectid="+$("#curobjectid").val()+"&curdocid="+$("#curdocid").val();
			document.location.href = targetURL;
			event.preventDefault();			
		}
	}
});

$("#btSend").click(function () {
    if (document.getElementById("datepicker").value == "") {
        alert("Выберите дату");
        return false;
    }


    vv = document.form_order_test.singleSelect;
    vvv = vv.options;
    vvs = "";
    for (i = 0; i < vvv.length; i++) {
        if (vvv[i].selected) {
            if (vvs == "") {
                vvs = vvv[i].value
            } else {
                vvs = vvs + "~" + vvv[i].value
            }
        }
    }
    if (vvs == '') {
        alert("Выберите время");
        $("#dialog").dialog("open");
        return false;
    } else {
        document.form_order_test.testTime.value = vvs;
    }
    vv = document.form_order_test.multiSelect;
    vvv = vv.options;
    vvs = "";
    for (i = 0; i < vvv.length; i++) {
        if (vvv[i].selected) {
            if (vvs == "") {
                vvs = vvv[i].value
            } else {
                vvs = vvs + "~" + vvv[i].value
            }
        }
    }

    if (vvs == '') {
        alert("Не выбран ни один тест!");
        return false;
    } else {
        document.form_order_test.testCodes.value = vvs;
    }

    document.form_order_test.submit();
})
