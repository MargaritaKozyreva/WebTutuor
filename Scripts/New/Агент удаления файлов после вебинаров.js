// --------------------------------------------------------------------------------------------------------------------------------
// автор:   AF
// создан: 25.03.2015
// -----------------------------------------------------------Описание-------------------------------------------------------------
// Агент удаления файлов из Ресурсов базы,остающихся после проведения Вебинаров
//
//Во время проведения мероприятия типа вебинар при загрузке в него презентации и показе во время проведения в
// Ресурсах базы появляются:
//    - ресурс с файлом самой презентации
//- и ресурсы с файлами-картинками *.png, по одному на каждый слайд (см. скриншот).
//    Необходимо написать Агент, который будет удалять для вебинаров в статусе Завершен в
// Ресурсах базы все ресурсы с картинками по каждому слайду презентации.
//    Для вебинаров, которые удалены из базы - удалять в Ресурсах базы как ресурсы с картинками презентации,
// так и ресурс с самой презентацией
// -----------------------------------------------------------Предупреждение-------------------------------------------------------
// <нет>
// -----------------------------------------------------------Параметры агента-----------------------------------------------------
// <нет>
// -----------------------------------------------------------Константы------------------------------------------------------------

// x-local://wtv/agents/WEBSOFT_WEBINAR_DEL_IMAGE.js

// ***********************************************************
function delShapeImage(itemShapeImage)
{
    try
    {

        try
        {
            docResourceImage = OpenDoc(UrlFromDocID(Int(itemShapeImage.fileID)));
            resourceDocImage = docResourceImage.TopElem;
        }
        catch(e)
        {
            alert(e)
            return false;
        }

        try
        {
            // Удалим сам файл
            DeleteFile(resourceDocImage.file_url);
        }
        catch (e)
        {
            alert('Ошибка при удаления файла: ' + resourceDocImage.file_url + ', id-ресурса базы: ' + docResourceImage.DocID + '. ' + e);
        }

        try
        {
            // Удалим ресурс-картинку
            DeleteDoc(UrlFromDocID(docResourceImage.DocID));
        }
        catch (e)
        {
            alert('Ошибка при удалении ресурса базы: ' + docResourceImage.DocID + '. ' + e)
        }
    }
    catch (e)
    {
        alert('Ошибка в delShapeImage(): ' + e)
    }

}
// ***********************************************************
function delImageInPresentation(docResourcePresentation, resourceDocPresentation)
{
    try
    {
        for (_slide in resourceDocPresentation.presentation.slides)
        {
            arrShapeImage = ArraySelect(_slide.shapes, 'This.class == "com.websoft.vclass.vo.graphics.shapes.Image" ');
            for (itemShapeImage in arrShapeImage)
            {
                // Удаляем ресурс-картику и файл-картинку
                delShapeImage(itemShapeImage);

                // Удаляем в слайде ссылку на картинку
                itemShapeImage.Delete();
                docResourcePresentation.Save();
            }
        }
    }
    catch (e)
    {
        alert('Ошибка в delImageInPresentation(): ' + e)
    }
}
// ***********************************************************
function webinarPresentationDelImage()
{
    try
    {
        _resources = XQuery('for $r in resources ' +
        ' where $r/type = "ppt"  ' +
        ' return $r ');

        for (_resource in _resources)
        {
            try
            {
                docResourcePresentation = OpenDoc(UrlFromDocID(_resource.id));
                resourceDocPresentation = docResourcePresentation.TopElem;
            }
            catch(e)
            {
                alert(e)
                continue;
            }
            for (_link  in resourceDocPresentation.links)
            {
                if (_link.object_catalog != 'event') continue;

                flagDelWebinar = false;
                try
                {
                    eventDoc = OpenDoc(UrlFromDocID(_link.object_id)).TopElem;
                }
                catch (e)
                {
                    flagDelWebinar = true;
                }

                if (flagDelWebinar == false)
                {
                    if (eventDoc.type_id != 'webinar') continue;

                    if (eventDoc.status_id == 'close')
                    {
                        delImageInPresentation(docResourcePresentation, resourceDocPresentation);
                    }
                }
                else if (flagDelWebinar == true)
                {
                    delImageInPresentation(docResourcePresentation, resourceDocPresentation);

                    // Удалим файл-презентацию
                    try
                    {
                        DeleteFile(resourceDocPresentation.file_url);
                    }
                    catch (e)
                    {
                    }

                    // Удалим ресурс-презентацию
                    try
                    {
                        DeleteDoc(UrlFromDocID(docResourcePresentation.DocID));
                    }
                    catch (e)
                    {
                    }
                }
            }
        }
    }
    catch (e)
    {
        alert('Ошибка в webinarPresentationDelImage(): ' + e);
    }
}
// ******************ОСНОВНАЯ ОБЛАСТЬ*************************
alert("Агент удаления файлов из Ресурсов базы,остающихся после проведения Вебинаров...");
try
{

    // Удалим для вебинаров в статусе Завершен в Ресурсах базы все ресурсы с картинками
    // по каждому слайду презентации

    // Удалим Презетации и Картинки у которых ресурсы-вебинары удалены
    webinarPresentationDelImage();

}
catch (e)
{
    alert(e);
}

alert("Агент удаления файлов из Ресурсов базы,остающихся после проведения Вебинаров завершен.\n");