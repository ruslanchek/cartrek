<?php

Class RememberPass extends Core
{
    public function __construct()
    {
        parent::__construct();

        $this->template = 'auth.tpl';

        $this->init(array(
            'name' => 'auth.remember_pass',
            'title' => 'Восстановление пароля',
            'dir' => '/control/auth/remember_pass',
            'bgclass' => 'city'
        ));

        if (isset($_POST['action'])) {
            switch ($_POST['action']) {
                case 'remember_pass' :
                {
                    $this->module['form'] = $this->auth->remember($_POST['login']);
                }
                    ;
                    break;
            }
            ;
        }
        ;

        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'password_recover' :
                {
                    $this->module['form'] = $this->auth->rememberCode($_GET['user_id'], $_GET['code']);
                }
                    ;
                    break;
            }
            ;
        }
        ;
    }

    public function __destruct()
    {
        $this->deInit();
    }
}