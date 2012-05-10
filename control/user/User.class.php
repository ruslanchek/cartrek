<?php
    Class User extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user_status['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'user',
                'title' => 'Пользователь',
                'dir'   => '/control/user'
            ));

            if(isset($_GET['exit'])){
                $this->auth->exitUser();
                exit;
            };
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>