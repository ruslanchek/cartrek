<?php
    Class Fleet extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'fleet',
                'title' => 'Автопарк',
                'dir'   => '/control/fleet'
            ));

            /*if($this->uri_chain[2]){

            };*/
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>