arrUsers = XQuery("for $elem in colaborators return $elem");
for (user in arrUsers) {
    doc = OpenDoc(UrlFromDocID(user.id));
    doc.Save();
}