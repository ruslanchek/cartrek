<?php
    Class Billing extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'billing',
                'title' => 'Баланс',
                'dir'   => '/control/billing'
            ));
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>