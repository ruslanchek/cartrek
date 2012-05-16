<?php
    Class FleetAdd extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user_status['status']){
                header('Location: /control/auth/login');
            };

            $form = array();

            $form['step']           = 1;
            $form['submit_text']    = 'Далее';
            $form['tip']            = '<p>Подсказка</p>';

            if(isset($_POST['action']) && $_POST['action'] == 'add_car'){
                if(isset($_POST['step'])){
                    switch($_POST['step']){
                        case 1 : {
                            $form['step']           = 2;
                            $form['submit_text']    = 'Далее';
                            $form['tip']            = '<p>Подсказка</p>';

                        }; break;

                        case 2 : {
                            $form['step']           = 3;
                            $form['submit_text']    = 'Далее';
                            $form['tip']            = '<p>Подсказка</p>';

                        }; break;

                        case 3 : {
                            $form['step']           = 'finish';
                            $form['submit_text']    = 'Далее';
                        }; break;
                    };
                };
            };

            $this->init(array(
                'name'  => 'fleet_add',
                'title' => 'Добавление автомобиля',
                'dir'   => '/control/fleet/add',
                'form'  => $form
            ));
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>