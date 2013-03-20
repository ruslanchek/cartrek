<?php
    //Подключаем основные классы
    require_once($_SERVER['DOCUMENT_ROOT'].'/api/Core.class.php');

    //Класс текущего модуля
    require_once('security.php');

    //Запуск модуля
    $core = new Security();
?>