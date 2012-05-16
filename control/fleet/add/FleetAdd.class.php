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
                $form = $this->addCar();
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

        public function addCar(){
            if(isset($_POST['step'])){
                switch($_POST['step']){
                    case 1 : {
                        $form['submit_text']    = 'Далее';
                        $form['tip']            = '<p>Подсказка</p>';

                        if($_POST['secret']){
                            $_SESSION['add_car']['fields']['secret'] = $_POST['secret'];
                            $form['step'] = 2;
                        }else{
                            $form['status'] = false;
                            $form['message'] = 'Введите идентификатор';
                            $form['step'] = 1;

                            return $form;
                        };
                    }; break;

                    case 2 : {
                        $form['step']           = 3;
                        $form['submit_text']    = 'Далее';
                        $form['tip']            = '<p>Подсказка</p>';

                        if(!$_POST['name']){
                            $form['status'] = false;
                            $form['message'] = 'Введите название';
                            $form['step'] = 2;

                            return $form;
                        }else{
                            $_SESSION['add_car']['fields']['name']  = $_POST['name'];
                        };

                        if(!$_POST['make']){
                            $form['status'] = false;
                            $form['message'] = 'Введите марку автомобиля';
                            $form['step'] = 2;

                            return $form;
                        }else{
                            $_SESSION['add_car']['fields']['make']  = $_POST['make'];
                        };

                        if(!$_POST['model']){
                            $form['status'] = false;
                            $form['message'] = 'Введите модель автомобиля';
                            $form['step'] = 2;

                            return $form;
                        }else{
                            $_SESSION['add_car']['fields']['model']  = $_POST['model'];
                        };

                        if(!$_POST['g_id']){
                            $form['status'] = false;
                            $form['message'] = 'Введите госномер';
                            $form['step'] = 2;

                            return $form;
                        }else{
                            $_SESSION['add_car']['fields']['g_id']  = $_POST['g_id'];
                        };

                    }; break;

                    case 3 : {
                        $form['step']           = 'finish';
                        $form['submit_text']    = 'Далее';
                    }; break;
                };
            };

            return $form;
        }
    };
?>