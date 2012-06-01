<?php
    Class Register extends Core {
        public function __construct(){
            parent::__construct();

            $this->template = 'auth.tpl';

            $this->init(array(
                'name'      => 'register',
                'title'     => 'Регистрация',
                'dir'       => '/control/auth/register',
                'bgclass'   => 'city'
            ));

            if(isset($_POST['action'])){
                switch($_POST['action']){
                    case 'register' : {
                        $this->module['form'] = $this->auth->registerNewUser();
                    }; break;
                };
            };
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>