<?php
    session_start();

    //Подключаем основные классы
    require_once($_SERVER['DOCUMENT_ROOT'].'/api/Core.class.php');

    //Класс текущего модуля
    require_once('Register.class.php');

    //Запуск модуля
    $core = new Register();
?>