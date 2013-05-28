<?php

Class About extends Core
{
    public function __construct()
    {
        parent::__construct();

        $this->init(array(
            'name' => 'about',
            'title' => 'О Картреке',
            'dir' => '/control/about'
        ));
    }

    public function __destruct()
    {
        $this->deInit();
    }
}