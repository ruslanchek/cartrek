<?php
    Class Fleet extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'user.fleet',
                'title' => 'Автопарк',
                'dir'   => '/control/user/fleet'
            ));

            /*if($this->uri_chain[2]){

            };*/
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>