daysCount = 7;// период за который отбираются мероприятия и по которым будут созданы напоминания ( текущая дата + daysCount )
OrgUser = "OrgUser";//пользователь, от имени которого будет создано в календаре напоминание
OrgUserMail = "";//адрес пользователя, от имени которого будет создано напоминание в календаре
DefCharset = "utf-8"//кодировка по умалчанию
ReminderDays = 1// частота создания напоминаний 
SendFeedback = false//отправлять пользователю от имени которого было послано напоминание сообщение о добавлении напоминания в календарь
SendInvitationsToParticipants = true//отправлять уведомление для создания напоминания преподавателям
SendInvitationsToLectors = true//If parameter is true then the invitations will be send to the trainers of the event
SendInvitationsToResponsibleOfEvent = true//отправлять уведомление для создания напоминания ответственным за проведения мероприятия
SendInvitationsToResponsibleOfEventPreparation = true//отправлять уведомление для создания напоминания ответственным за подготовку мероприятия
ShowShortDescription = false
//----------------------------------

ModDate = "28.04.2010 16:31"
ShowAlert = false;
alert('uniCalendarEntryAgent starts')
try {
    ReminderDays = Int(ReminderDays)
}
catch (ex) {
    alert('Impossible to convert ReminderDays number to integer. There will be no reminder in the calendar.')
    ReminderDays = 0;
}

if (ShowAlert) alert("ModDate=" + ModDate);
if (ShowAlert) {
    alert("daysCount=" + daysCount);
    alert("OrgUser=" + OrgUser);
    alert("OrgUserMail=" + OrgUserMail);
    alert("DefCharset=" + DefCharset);
    alert("ReminderDays=" + ReminderDays);
    alert("SendFeedback=" + ReminderDays);
    alert("SendInvitationsToParticipants=" + SendInvitationsToParticipants)
    alert("SendInvitationsToLectors=" + SendInvitationsToLectors)
    alert("SendInvitationsToResponsibleOfEvent=" + SendInvitationsToResponsibleOfEvent)
    alert("SendInvitationsToResponsibleOfEventPreparation=" + SendInvitationsToResponsibleOfEventPreparation)
    alert("ShowShortDescription=" + ShowShortDescription)
}

SmtpFound = false
try {
    _client = SmtpClient();
    if (global_settings.settings.own_org.smtp_server == '')
        return false;
    _client.OpenSession(global_settings.settings.own_org.smtp_server);

    if (global_settings.settings.own_org.use_smtp_authenticate)
        _client.Authenticate(global_settings.settings.own_org.smtp_login, global_settings.settings.own_org.smtp_password);

    SmtpFound = true;
}
catch (aa) {
    LogEvent('email', aa);
    alert(aa);
}

if (SmtpFound) {
    try {
        sender_address = global_settings.settings.own_org.email;

        _start_date = Date();
        _start_date = Date(DateNewTime(_start_date, 00, 00, 00));
        _end_date = RawSecondsToDate(DateToRawSeconds(_start_date) + (daysCount) * 86400);
        _end_date = Date(DateNewTime(_end_date, 23, 59, 59));



        if (ShowAlert) alert("start=" + _start_date + " end=" + _end_date);

        event_arr = XQuery("for $obj in events where $obj/status_id='plan' and $obj/start_date!= null() and $obj/start_date>= date('" + _start_date + "') and $obj/start_date<=date ('" + _end_date + "') return $obj");

        if (ShowAlert) alert('ArrayCount(event_arr)=' + ArrayCount(event_arr));

        for (_event in event_arr) {

            docEvent = OpenDoc(UrlFromDocID(_event.id));
            teEvent = docEvent.TopElem;

            file_id = String(_event.id).slice(String(_event.id).length - 6)

            //			curHostSettings = global_settings.settings;
            //			curWebDesign = global_settings.settings.web_designs.GetChildByKey(  curHostSettings.default_web_design );
            //			curWebDesignUrl = curWebDesign.url;
            // portal url accounting custom web design
            //			PORTAL_URL = ( curHostSettings.default_web_design != 'default' ? (global_settings.settings.portal_base_url + "/" + curWebDesignUrl) : 		global_settings.settings.portal_base_url );
            PORTAL_URL = global_settings.settings.portal_base_url;

            /*_doc = ArrayOptFirstElem( XQuery( "for $elem in documents where $elem/code = '" + objDocSec.Name + "' return $elem" ) );
            doc_id = ( _doc != undefined ? _doc.id : '' );
            URL = "/view_doc.html?mode=" + ( objDocSec.Name == "course" ? "course_info" : objDocSec.Name ) + "&doc_id=" + doc_id + "&object_id=" + objDocSecID;
            URL = UrlAppendPath( PORTAL_URL, URL);*/


            _header_host = UrlAppendPath(PORTAL_URL, '/view_doc.html?mode=');
            _as_ap = '"' + 'events' + '"';
            _as_ap_arr = XQuery('for $elem in documents where $elem/code=' + _as_ap + ' return $elem');
            _as_ap_arr_fe = ArrayOptFirstElem(_as_ap_arr);

            _doc_id = '';
            if (_as_ap_arr_fe != undefined) {
                _doc_id = _as_ap_arr_fe.id;
            }

            _subject = "Invitation: " + _event.name + " (" + _event.start_date + ")";

            if (ShowShortDescription) {
                text_str = 'Тема: "' + teEvent.name + '" <br/>' + _header_host + 'event&object_id=' + _event.id + '&doc_id=' + _doc_id;
            }
            else {
                text_str = 'Мероприятие "' + teEvent.name + '" запланировано: ' + _header_host + 'event&object_id=' + _event.id + '&doc_id=' + _doc_id;
            }
            if (ShowAlert) alert('teEvent.name=' + teEvent.name);
            _finish_date = Date(DateNewTime(_end_date, 23, 59, 59));

            if (teEvent.finish_date.HasValue) {
                _finish_date = teEvent.finish_date;
            }



            if (ShowShortDescription) {
                text = 'Тема: "' + teEvent.name + '" \r\n' + _header_host + 'event&object_id=' + _event.id + '&doc_id=' + _doc_id;
            }
            else {
                text = "Календарь\r\n\t " + text_str + "\n\t" + "Дата начала:" + teEvent.start_date + "\n\t" + "Дата окончания :" + _finish_date + "\n\t" + "Место проведения :" + teEvent.place + "\n\t" + "Комментарий:" + teEvent.comment + "\n\t";
            }
            //alert(StrReplace(StrReplace(StrXmlDate(Date()),'-',''),':',''))
            //alert(UtcToLocalDate(Date()))

            if (ShowShortDescription) {
                html_text = '
                    < html > <body>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#666666">
                            <tr>
                                <td>
                                    <table width="100%" cellspacing="1" cellpadding="0">
                                        <tr bgcolor="#FFFFFF">
                                            <td align="left">
                                                <font style="font:Arial" style="font-size:10px">'+text_str+'</font>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body></html >
                        '
            }
            else {
                html_text = '
                    < html > <body>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr valign="top"><td width="100%" valign="middle"><font size="2" color="#4B6A85">Календарь</font><br>
			</td></tr>
			</table>
		</td>
	</tr>
                                <tr>
                                    <td>

                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#666666">
                                            <tr>
                                                <td>
                                                    <table width="100%" cellspacing="1" cellpadding="0">
                                                        <tr bgcolor="#FFFFFF">
                                                            <td>
                                                                Мероприятие:
								</td>
                                                            <td align="left">
                                                                '+text_str+'
								</td>
                                                        </tr>
                                                        <tr bgcolor="#FFFFFF">
                                                            <td>
                                                                Дата начала:
								</td>
                                                            <td align="left">
                                                                '+teEvent.start_date+'
								</td>
                                                        </tr>
                                                        <tr bgcolor="#FFFFFF">
                                                            <td>
                                                                Дата окончания:
								</td>
                                                            <td align="left">
                                                                '+_finish_date+'
								</td>
                                                        </tr>
                                                        <tr bgcolor="#FFFFFF">
                                                            <td>
                                                                Место проведения:
								</td>
                                                            <td align="left">
                                                                '+teEvent.place+'
								</td>
                                                        </tr>
                                                        <tr bgcolor="#FFFFFF">
                                                            <td>
                                                                Комментарий:
								</td>
                                                            <td align="left">
                                                                '+teEvent.comment+'
								</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                    </td>
                                </tr>
</table>
</body></html>
                '
            }

            arrRecipients = Array();
            counter = 0;

            _arr_str = teEvent.custom_elems.ObtainChildByKey('f_n84u').value;
            _list = String(_arr_str).split(';');
            if (ShowAlert) alert('ArrayCount(_list)=' + ArrayCount(_list));
            _is_changed = false;
            if (SendInvitationsToParticipants) {
                for (iParticipantElem in teEvent.collaborators) {
                    _is_in_list = false;


                    for (_elem in _list) {
                        if (Trim(_elem) == Trim(iParticipantElem.collaborator_id)) {
                            _is_in_list = true;
                            break;
                        }
                    }
                    if (ShowAlert) alert('_is_in_list=' + _is_in_list);
                    if (_is_in_list != true) {

                        _arr_str = _arr_str + iParticipantElem.collaborator_id + ";";
                        person_arr = XQuery('for $obj in collaborators where $obj/id=' + iParticipantElem.collaborator_id + ' return $obj');

                        for (_person in person_arr) {
                            if (ShowAlert) (_person.fullname);
                            NewElem = new Object;
                            NewElem.email = _person.email;
                            NewElem.fullname = _person.fullname
                            arrRecipients[counter] = NewElem
                            counter++
                        }

                        _is_changed = true;
                    }
                    if (ShowAlert) alert('_is_changed=' + _is_changed);
                }

            }


            if (SendInvitationsToLectors) {
                for (iLectorElem in teEvent.lectors) {
                    _is_in_list = false;

                    for (_elem in _list) {
                        if (Trim(_elem) == Trim(iLectorElem.lector_id)) {
                            _is_in_list = true;
                            break;
                        }
                    }
                    if (ShowAlert) alert('_is_in_list=' + _is_in_list);
                    if (_is_in_list != true) {

                        _arr_str = _arr_str + iLectorElem.lector_id + ";";
                        person_arr = XQuery('for $obj in lectors where $obj/id=' + iLectorElem.lector_id + ' return $obj');

                        for (_person in person_arr) {
                            if (ShowAlert) (_person.person_fullname);
                            NewElem = new Object;
                            NewElem.email = _person.email;
                            NewElem.fullname = _person.person_fullname
                            arrRecipients[counter] = NewElem
                            counter++
                        }

                        _is_changed = true;
                    }
                    if (ShowAlert) alert('_is_changed=' + _is_changed);
                }

            }


            if (SendInvitationsToResponsibleOfEvent) {
                for (iTutorElem in teEvent.tutors) {
                    _is_in_list = false;


                    for (_elem in _list) {
                        if (Trim(_elem) == Trim(iTutorElem.collaborator_id)) {
                            _is_in_list = true;
                            break;
                        }
                    }
                    if (ShowAlert) alert('_is_in_list=' + _is_in_list);
                    if (_is_in_list != true) {

                        _arr_str = _arr_str + iTutorElem.collaborator_id + ";";
                        person_arr = XQuery('for $obj in collaborators where $obj/id=' + iTutorElem.collaborator_id + ' return $obj');

                        for (_person in person_arr) {
                            if (ShowAlert) (_person.fullname);
                            NewElem = new Object;
                            NewElem.email = _person.email;
                            NewElem.fullname = _person.fullname
                            arrRecipients[counter] = NewElem
                            counter++
                        }

                        _is_changed = true;
                    }
                    if (ShowAlert) alert('_is_changed=' + _is_changed);
                }

            }

            if (SendInvitationsToResponsibleOfEventPreparation) {
                for (iEventPreparationElem in teEvent.even_preparations) {
                    _is_in_list = false;


                    for (_elem in _list) {
                        if (Trim(_elem) == Trim(iEventPreparationElem.person_id)) {
                            _is_in_list = true;
                            break;
                        }
                    }
                    if (ShowAlert) alert('_is_in_list=' + _is_in_list);
                    if (_is_in_list != true) {

                        _arr_str = _arr_str + iEventPreparationElem.person_id + ";";
                        person_arr = XQuery('for $obj in collaborators where $obj/id=' + iEventPreparationElem.person_id + ' return $obj');

                        for (_person in person_arr) {
                            if (ShowAlert) (_person.fullname);
                            NewElem = new Object;
                            NewElem.email = _person.email;
                            NewElem.fullname = _person.fullname
                            arrRecipients[counter] = NewElem
                            counter++
                        }

                        _is_changed = true;
                    }
                    if (ShowAlert) alert('_is_changed=' + _is_changed);
                }

            }

            if (ShowAlert) {
                for (iRecipientElem in arrRecipients) {
                    alert(iRecipientElem.fullname + ' ' + iRecipientElem.email)
                }
            }

            if (_is_changed == true) {

                teEvent.custom_elems.ObtainChildByKey('f_n84u').value = _arr_str;
                docEvent.Save();
            }

            for (iRecipientElem in arrRecipients) {

                iValarmText = '';
                if (ReminderDays > 0) {
                    iValarmText = 'BEGIN:VALARM
                    TRIGGER: -P'+ReminderDays+'D
                    REPEAT: 2
                    DURATION: PT15M
                    ACTION: DISPLAY
                    DESCRIPTION: '+teEvent.name+' '+teEvent.start_date+'
                    X - WR - ALARMUID:'+StrHexInt(Int(_event.id)-1)+'
                    END: VALARM'
                }

                RSVP_STR = SendFeedback ? 'TRUE' : 'FALSE'

                iCalendarText = 'BEGIN:VCALENDAR
                VERSION: 2.0
                PRODID: -//Microsoft Corporation//Outlook 15.0 MIMEDIR//EN
                    METHOD:REQUEST
                BEGIN: VEVENT
                DTSTART: '+StrReplace(StrReplace(StrLeftRange(StrXmlDate(teEvent.start_date),StrXmlDate(teEvent.start_date).lastIndexOf(' + ')),' - ',''),':','')+'Z
                DTEND: '+StrReplace(StrReplace(StrLeftRange(StrXmlDate(_finish_date),StrXmlDate(_finish_date).lastIndexOf(' + ')),' - ',''),':','')+'Z
                DTSTAMP: '+StrReplace(StrReplace(StrLeftRange(StrXmlDate(Date()),StrXmlDate(Date()).lastIndexOf(' + ')),' - ',''),':','')+'Z
                SEQUENCE: 0
                DESCRIPTION: '+teEvent.comment+'\n
                SUMMARY: '+teEvent.name+'
                UID: '+StrHexInt(_event.id)+' - WebTutor_Generated
                '+iValarmText+'
                END: VEVENT
                END: VCALENDAR'
	
                if (ShowAlert) alert("iCalendarText=" + iCalendarText);

                message_body = 'X-Mru-BL: 0:0:2
                X - Mru - NR: 1
                X - Mru - OF: unknown(unknown)
                To: '+iRecipientElem.email+'
                Subject: '+_subject+'
                MIME - Version: 1.0
                From: '+sender_address+'
                Content - Type: multipart / alternative; boundary = "=004128EAC32576F1_="
                X - Spam: Not detected
                X - Mras: Ok

                --=004128EAC32576F1_=
                    MIME - Version: 1.0
                Content - Type: text / calendar; charset = "utf-8"; method = request

                '+iCalendarText+'

                --=004128EAC32576F1_= --'



                alert(message_body)
                try {
                    _client.SendMimeMessage(sender_address, iRecipientElem.email, message_body);
                    LogEvent('email', 'Email sending to ' + iRecipientElem.fullname + ' (e-mail: ' + iRecipientElem.email + ') successful.');
                }
                catch (aa) {
                    LogEvent('email', 'Email sending to ' + iRecipientElem.fullname + ' (e-mail: ' + iRecipientElem.email + ') failed. Error:' + aa);
                }
            }

        }
        _client.CloseSession();
        //return true;
    }
    catch (aa) {
        LogEvent('email', aa);
        alert(aa);
        _client.CloseSession();
        //return false;
    }
}