<?php
    Class FleetAdd extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user_status['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'fleet_add',
                'title' => 'Добавление автомобиля',
                'dir'   => '/control/fleet/add'
            ));
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>