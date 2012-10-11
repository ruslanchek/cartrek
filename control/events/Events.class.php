<?php
    Class Events extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'events',
                'title' => 'События',
                'dir'   => '/control/events'
            ));

            if($this->ajax_mode){
                switch($_GET['action']){
                    case 'getItems' : {
                        header('Content-type: application/json');
                        print json_encode($this->eventsApi->getEvents($_GET['step'], 10, $_GET['offset'], $_GET['cond']));
                    }; break;

                    case 'delItem' : {
                        $this->eventsApi->delItem($_GET['id'], $_GET['cond']);
                    }; break;

                    case 'hideItem' : {
                        $this->eventsApi->hideItem($_GET['id'], $_GET['cond']);
                    }; break;

                    case 'checkForNewEvents' : {
                        header('Content-type: application/json');
                        print json_encode($this->eventsApi->getNewEvents());
                    }; break;

                    case 'delAllItems' : {
                        $this->eventsApi->delAllItems();
                    }; break;

                    case 'hideAllItems' : {
                        $this->eventsApi->hideAllItems();
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