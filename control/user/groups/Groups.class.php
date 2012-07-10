<?php
    Class Groups extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'user.groups',
                'title' => 'Группы',
                'dir'   => '/control/user/groups'
            ));
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>