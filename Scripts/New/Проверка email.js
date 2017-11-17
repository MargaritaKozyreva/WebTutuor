var i = 0;
users = XQuery("for $elem in collaborators where $elem/email!='' return $elem");
for (user in users) {
    doc = OpenDoc(UrlFromDocID(user.id));
    email = doc.TopElem.email;
    if (StrEnds(email, '@nlmk.ru', true)) {
        email = StrLowerCase(StrReplace(email, '@nlmk.ru', '@nlmk.com'));
        i++;
    } else if (StrEnds(email, '@nlmk.com', true)) {
        email = StrLowerCase(email);
    } else {
        email = '';
        i++;
    }
    doc.TopElem.email = email;
    doc.Save();
}
alert('Выполнено ' + i + ' замен');