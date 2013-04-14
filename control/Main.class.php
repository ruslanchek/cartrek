<?php

Class Main extends Core
{
    public function __construct()
    {
        parent::__construct();

        if (!$this->auth->user['status']) {
            header('Location: /control/auth/login');
        }
        ;

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