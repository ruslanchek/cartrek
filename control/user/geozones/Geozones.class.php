<?php
    Class Geozones extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->template = 'user.tpl';

            $this->init(array(
                'name'  => 'user.geozones',
                'title' => 'Автопарк',
                'dir'   => '/control/user/geozones'
            ));

            /*if($this->uri_chain[2]){

            };*/
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>