<?php
    Class Fleet extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user_status['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'fleet',
                'title' => 'Автопарк',
                'dir'   => '/control/fleet'
            ));
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>