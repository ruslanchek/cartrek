<?php

Class Billing extends Core {
    public function __construct(){
        parent::__construct();

        if(!$this->auth->user['status']){
            header('Location: /control/auth/login');
        };

        $this->template = 'user.tpl';

        $this->init(array(
            'name'  => 'user.billing',
            'title' => 'Баланс',
            'dir'   => '/control/user/billing'
        ));
    }

    public function __destruct(){
        $this->deInit();
    }
};