<?php
    Class Login extends Core {
        public function __construct(){
            parent::__construct();

            $this->template = 'auth.tpl';

            if(isset($_POST['action'])){
                switch($_POST['action']){
                    case 'login' : {
                        $this->module['form'] = $this->auth->auth($_POST['login'], $_POST['password']);
                    }; break;
                };
            };

            if(isset($_GET['oauth'])){
                $this->auth->oAuth();
                exit;
            };

            $this->init(array(
                'name'      => 'auth.login',
                'title'     => 'Вход',
                'dir'       => '/control/auth/login',
                'bgclass'   => 'city'
            ));
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>