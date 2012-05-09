<?php
    Class Register extends Core {
        public function __construct(){
            parent::__construct();

            $this->init(array(
                'name'  => 'register',
                'title' => 'Регистрация',
                'dir'   => 'auth/register'
            ));

            if($this->ajax_mode){
                switch($_GET['action']){
                    case 'register' : {
                        print json_encode($this->auth->registerNewUser());
                    }; break;
                };

                exit;
            };
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>