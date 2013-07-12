<?php
    //Подключаем основные классы
    require_once($_SERVER['DOCUMENT_ROOT'].'/api/Core.api.class.php');

    //Класс текущего модуля
    require_once('Meta.class.php');

    //Запуск модуля
    $core = new Meta();
?>