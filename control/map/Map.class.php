<?php
    Class Map extends Core {
        public function __construct(){
            parent::__construct();

            //If user not logged in
            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'map',
                'title' => 'Наблюдение',
                'dir'   => '/control/map'
            ));

            //If user have any actve devices
            if($this->devices->devices_present){
                if($this->ajax_mode && isset($_GET['action'])){
                    switch($_GET['action']){
                        case 'getUserFleetsAndDevices' : {
                            header('Content-type: application/json');
                            print json_encode($this->devices->getUserFleetsAndDevices());
                        }; break;

                        case 'getPoints' : {
                            header('Content-type: application/json');
                            print json_encode($this->devices->getPoints($_GET['device_id'], $_GET['last_point_id']));
                        }; break;

                        case 'setCurrentDate' : {
                            $this->devices->setCurrentDate($_GET['date']);
                        }; break;

                        case 'getRenewedData' : {
                            header('Content-type: application/json');
                            print json_encode($this->devices->getUserDevices()); //TODO: можно оптимизировать!
                        }; break;

                        case 'getDynamicDevicesData' : {
                            header('Content-type: application/json');
                            print json_encode($this->devices->getDynamicDevicesData(json_decode($_POST['cars'])));
                        }; break;
                    };

                    exit;
                };

                $this->template = 'map.tpl';
            }else{
                $this->template = 'main.tpl';
            };
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>
