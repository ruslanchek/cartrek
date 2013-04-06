<?php
    Class Fleet extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->template = 'user.tpl';

            $this->init(array(
                'name'  => 'user.fleet',
                'title' => 'Автопарк',
                'dir'   => '/control/user/fleet'
            ));

            /*if($this->uri_chain[2]){

            };*/

            #toggle_device

             //If user have any actve devices
            if($this->ajax_mode && isset($_GET['action'])){
                switch($_GET['action']){
                    case 'toggle_device' : {
                        header('Content-type: application/json');
                        $this->toggleDevice($_GET['id'], $_GET['activity']);
                    }; break;
                };

                exit;
            }else{
                $this->createAdditionalButton('Добавить автомобиль', '/control/user/fleet/add');

                $this->smarty->assign('devices', $this->devices->getUserDevices(true));
            };
        }

        public function __destruct(){
            $this->deInit();
        }

        private function toggleDevice($id, $activity){
            $activity = ($activity === '1') ? '1' : '0';

            $this->devices->updateDeviceData($id, array((object) array('key' => 'active', 'value' => $activity)));
        }
    };
?>