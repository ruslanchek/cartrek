<?php
    Class AboutMap extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => '_default',
                'title' => 'О наших картах',
                'dir'   => '/control/about-map',
                'static_content' => $this->getStaticContent()
            ));
        }

        public function __destruct(){
            $this->deInit();
        }

        private function getStaticContent(){
$html = <<<EOF
    <p>
        Картрек использует карты <a href="http://www.mapbox.com/" target="_blank">MapBox</a>,
        созданные на&nbsp;основе данных картографического сервиса
        <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>,&nbsp;распространяемых
        по&nbsp;лицензии <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA.</a>
        Картографический пользовательский интерфейс Картрека создан при помощи библиотеки
        с&nbsp;открытым кодом <a href="http://leaflet.cloudmade.com/" target="_blank">Leaflet</a>.
    </p>
EOF;

            return $html;
        }
    };
?>