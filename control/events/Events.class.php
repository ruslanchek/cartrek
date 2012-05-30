<?php
    Class Events extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'events',
                'title' => 'Уведомления',
                'dir'   => '/control/events'
            ));

            if($this->ajax_mode){
                switch($_GET['action']){
                    case 'getItems' : {
                        print json_encode($this->eventsApi->getEvents($_GET['step']));
                    }; break;
                };

                exit;
            };
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>