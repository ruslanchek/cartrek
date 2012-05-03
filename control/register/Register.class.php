<?php
    Class Register extends Core {
        public function __construct(){
            parent::__construct();

            $this->init(array(
                'name'  => 'register',
                'title' => 'Регистрация'
            ));
        }

        public function __destruct(){
           $this->deInit();
       }
    };
?>