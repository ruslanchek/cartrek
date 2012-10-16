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
                        case 'getOptions' : {
                            header('Content-type: application/json');
                            print json_encode($this->getOptions());
                        }; break;

                        case 'getPoints' : {
                            header('Content-type: application/json');
                            print json_encode($this->devices->getPoints($_GET['device_id']));
                        }; break;

                        case 'setCurrentDate' : {
                            $this->devices->setCurrentDate($_GET['date']);
                        }; break;

                        case 'getRenewedData' : {
                            header('Content-type: application/json');
                            print json_encode($this->devices->getUserDevices()); //TODO: можно оптимизировать!
                        }; break;
                    };

                    exit;
                };

                $this->smarty->assign('options', json_encode($this->getOptions()));
                $this->template = 'map.tpl';
            }else{
                $this->template = 'main.tpl';
            };
        }

        public function getOptions(){
            $options = new stdClass();

            $options->date          = $this->devices->current_date;
            $options->now           = gmdate("Y-m-d H-i-s", time() + date("Z"));
            $options->gmt_offset    = date('Z');
            $options->min_date      = $this->devices->getMinDate();
            $options->devices       = $this->devices->getUserDevices();

            return $options;
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>