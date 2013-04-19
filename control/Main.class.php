<?php

Class Main extends Core
{
    public function __construct()
    {
        parent::__construct();

        $this->init(array(
            'name' => 'main',
            'title' => 'Пользователь',
            'dir' => '/control'
        ));
    }

    public function __destruct()
    {
        $this->deInit();
    }
}