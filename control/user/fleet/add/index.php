<?php
    //Подключаем основные классы
    require_once($_SERVER['DOCUMENT_ROOT'].'/api/Core.class.api.php');

    //Класс текущего модуля
    require_once('FleetAdd.class.php');

    //Запуск модуля
    $core = new FleetAdd();
?>