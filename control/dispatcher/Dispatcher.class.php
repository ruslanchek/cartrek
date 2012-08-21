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
                        header('Content-type: application/json');
                        print json_encode($this->devices->getUserDevices()); //TODO: можно оптимизировать!
                    }; break;

                    case 'setDivicesSorting' : {
                        $this->setDivicesSorting();
                    }; break;
                };

                exit;
            };
        }

        public function __destruct(){
            $this->deInit();
        }

        private function setDivicesSorting(){
            $q = "INSERT INTO devices (id, sort) VALUES ";
            $c = false;

            foreach($_POST['sorting_result'] as $item){
                if($item['id'] > 0 && $item['sort'] > 0){
                    $q .= " (".intval($item['id']).",".intval($item['sort'])."),";
                };

                $c = true;
            };

            $q = substr($q, 0, strlen($q) - 1);
            $q .= " ON DUPLICATE KEY UPDATE sort=VALUES(sort)";

            if($c){
                $this->db->query($q);
            };
        }
    };
?>