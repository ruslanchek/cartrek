<?php

Class Main extends Core
{
    public function __construct()
    {
        parent::__construct();

        $this->init(array(
            'name' => 'main',
            'title' => 'Добро пожаловать в Картрек, '.$this->auth->user['data']['name'],
            'dir' => '/control'
        ));
    }

    public function __destruct()
    {
        $this->deInit();
    }
}