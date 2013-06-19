<?php
error_reporting(E_ALL | E_STRICT);
session_start();

date_default_timezone_set('Europe/Moscow');

Class Config{
    public $db_vars = array();

    public $settings = array(
        'allow_register'    => false,
        'afk_margin'        => 3600000
    );

    public $default_user_settings = array(
        'path_width'        => 5
    );

    public function __construct(){
        /* App fog */
        /*$services_json = json_decode(getenv("VCAP_SERVICES"),true);
        $mysql_config = $services_json["mysql-5.1"][0]["credentials"];

        $this->db_vars = array(
            'host'  => $mysql_config["hostname"],
            'db'    => $mysql_config["name"],
            'user'  => $mysql_config["username"],
            'pass'  => $mysql_config["password"],
            'port'  => $mysql_config["port"]
        );*/

        $this->db_vars = array(
            'host'  => 'server.cartrek.ru',
            'db'    => 'cartrek',
            'user'  => 'cartrek',
            'pass'  => 'Tukzara',
            'port'  => '3306'
        );
    }

    //public $yandex_maps_api_key = 'AGZOc08BAAAA7AGgVQMAN-Zv3AH9T_SickfIRKaGBWPt6lUAAAAAAAAAAABfuEjMQhwWcAaQkE4J-qk7YcdyBQ==';
    //public $yandex_maps_api_key = 'AGTjck8BAAAAPOmnWwIA5d-qAgIQ-PeEKoOtMabp-5hdMqsAAAAAAAAAAAA8F9u46PKrR4jAftmcjvWMKDKG2w==';
};