<?php
    Class Login extends Core {
        public function __construct(){
            parent::__construct();

            $this->init(array(
                'name'  => 'login',
                'title' => 'Регистрация',
                'dir'   => '/control/auth/login'
            ));

            if($this->ajax_mode){
                switch($_GET['action']){
                    case 'login' : {
                        print json_encode($this->auth->auth($_POST['login'], $_POST['password']));
                    }; break;
                };

                exit;
            };

            if(isset($_GET['oauth'])){
                $this->auth->oAuth();
                exit;
            };
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>