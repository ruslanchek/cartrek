<?php
    error_reporting(E_ALL | E_STRICT);
    date_default_timezone_set('Europe/Moscow');

    Class Config{
        public $db_vars = array(
            'host'  => '127.0.0.1',
            'db'    => 'cartrek',
            'user'  => 'root',
            'pass'  => '123'
        );

        //public $yandex_maps_api_key = 'AGZOc08BAAAA7AGgVQMAN-Zv3AH9T_SickfIRKaGBWPt6lUAAAAAAAAAAABfuEjMQhwWcAaQkE4J-qk7YcdyBQ==';
        //public $yandex_maps_api_key = 'AGTjck8BAAAAPOmnWwIA5d-qAgIQ-PeEKoOtMabp-5hdMqsAAAAAAAAAAAA8F9u46PKrR4jAftmcjvWMKDKG2w==';
    };
?>