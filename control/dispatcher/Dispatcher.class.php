<?php
    Class Dispatcher extends Core {
        public $fleet_id = 0;

        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'dispatcher',
                'title' => 'Диспетчер',
                'dir'   => '/control/dispatcher'
            ));

            if($this->ajax_mode){
                switch($_GET['action']){
                    case 'getDivicesPositions' : {
                        print json_encode($this->devices->getUserDevices()); //TODO: можно оптимизировать!
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