<?php
    Class System extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->template = 'user.tpl';

            $this->init(array(
                'name'  => 'user.system',
                'title' => 'Система',
                'dir'   => '/control/user/system'
            ));
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>