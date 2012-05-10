<?php
    Class User extends Core {
        public function __construct(){
            parent::__construct();

            $this->init(array(
                'name'  => 'user',
                'title' => 'Пользователь',
                'dir'   => 'user'
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