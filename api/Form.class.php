<?php
    Class Form extends Core{
        private $listener;

        public function __construct(){
            parent::__construct();

            $this->init(array(
                'name'  => 'form',
                'title' => 'Слушатель форм'
            ));

            $this->createListener();
        }

        private function createListener(){
            $this->listener = new stdClass();
        }

        public function getListener(){
            return $this->listener();
        }
    }
?>