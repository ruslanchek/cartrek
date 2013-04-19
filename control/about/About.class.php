<?php

Class About extends Core
{
    public function __construct()
    {
        parent::__construct();

        $this->init(array(
            'name' => 'about',
            'title' => 'О Картреке',
            'dir' => '/control/about',
            'static_content' => $this->getStaticContent()
        ));
    }

    public function __destruct()
    {
        $this->deInit();
    }

    private function getStaticContent()
    {
        $html = <<<EOF
    <a name="maps"></a>
    <H2>О наших картах</h2>
    <p>
        Картрек использует карты <a href="http://www.mapbox.com/" target="_blank">MapBox</a>,
        созданные на&nbsp;основе данных картографического сервиса
        <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>,&nbsp;распространяемых
        по&nbsp;лицензии <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA.</a>
    </p>
    <p>
        Картографический пользовательский интерфейс Картрека создан при помощи библиотеки
        с&nbsp;открытым кодом <a href="http://leaflet.cloudmade.com/" target="_blank">Leaflet</a>.
    </p>
EOF;

        return $html;
    }
}