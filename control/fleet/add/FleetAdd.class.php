<?php
    Class FleetAdd extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user_status['status']){
                header('Location: /control/auth/login');
            };

            $form = array();
            $form['step'] = 1;

            if(isset($_POST['action']) && $_POST['action'] == 'add_car'){
                $form = $this->addCar();
            };

            $this->init(array(
                'name'  => 'fleet_add',
                'title' => 'Добавление устройства',
                'dir'   => '/control/fleet/add',
                'form'  => $form
            ));
        }

        public function __destruct(){
            $this->deInit();
        }

        public function checkDeviceBySN($code){
            $query = "
                SELECT
                    COUNT(*) AS `count`
                FROM
                    `devices`
                WHERE
                    `user_id`   = 0 &&
                    `active`    = 0 &&
                    `code`      = '".$this->db->quote($code)."'
            ";

            $result = $this->db->assocItem($query);

            if($result['count'] >= 1){
                return true;
            };
        }

        public function bindNewDevice($code){
            $query = "
                UPDATE
                    `devices`
                SET
                    `user_id` = ".intval($this->auth->user_status['userdata']['id']).",
                    `active` = 1,
                    `name` = '".$this->db->quote($_POST['name'])."',
                    `make` = '".$this->db->quote($_POST['make'])."',
                    `model` = '".$this->db->quote($_POST['model'])."',
                    `g_id` = '".$this->db->quote($_POST['g_id'])."'
                WHERE
                    `code` = '".$this->db->quote($code)."'
            ";

            $this->db->query($query);
        }

        public function addCar(){
            switch($_POST['step']){
                case '1' : {
                    if(isset($_POST['code']) && $_POST['code']){
                        $_SESSION['add_car']['code'] = $_POST['code'];

                        if(!$this->checkDeviceBySN($_POST['code'])){
                            return array(
                                'step'      => 1,
                                'status'    => false,
                                'message'   => 'Неверный серийный номер'
                            );
                        };

                        return array(
                            'step'      => 2,
                            'status'    => true
                        );
                    }else{
                        return array(
                            'step'      => 1,
                            'status'    => false,
                            'message'   => 'Введите серийный номер'
                        );
                    };
                }; break;

                case '2' : {
                    if(isset($_POST['back'])){
                        return array(
                            'step'      => 1,
                            'status'    => true
                        );
                    };

                    if(!$_POST['name']){
                        return array(
                            'step'      => 2,
                            'status'    => false,
                            'message'   => 'Введите название'
                        );
                    }else{
                        $_SESSION['add_car']['name']  = $_POST['name'];
                    };

                    if(!$_POST['make']){
                        return array(
                            'step'      => 2,
                            'status'    => false,
                            'message'   => 'Введите название'
                        );
                    }else{
                        $_SESSION['add_car']['make']  = $_POST['make'];
                    };

                    if(!$_POST['model']){
                        return array(
                            'step'      => 2,
                            'status'    => false,
                            'message'   => 'Введите модель автомобиля'
                        );
                    }else{
                        $_SESSION['add_car']['model']  = $_POST['model'];
                    };

                    if(!$_POST['g_id']){
                        return array(
                            'step'      => 2,
                            'status'    => false,
                            'message'   => 'Введите госномер'
                        );
                    }else{
                        $_SESSION['add_car']['g_id']  = $_POST['g_id'];
                    };

                    $this->bindNewDevice($_SESSION['add_car']['code']);

                    return array(
                        'step'      => 3,
                        'status'    => true,
                        'message'   => 'Устройство добавлено успешно!'
                    );
                }; break;
            };



            /*if(isset($_POST['step'])){
                switch($_POST['step']){
                    case 1 : {
                        $form['submit_text']    = 'Далее';
                        $form['tip']            = '<h3>Подсказка</h3><p>Серийный номер написан на карточке, вложенной в коробку с комплектом трекера. Если вы не получали такой карточки, обратитесь к диллеру.</p>';

                        if(isset($_POST['code']) && $_POST['code']){
                            $_SESSION['add_car']['fields']['code'] = $_POST['code'];
                            $form['step']           = 2;
                            $form['back_btn']       = true;
                        }else{
                            $form['status']     = false;
                            $form['message']    = 'Введите идентификатор';
                            $form['step']       = 1;

                            return $form;
                        };
                    }; break;

                    case 2 : {
                        $form['step']           = 3;
                        $form['submit_text']    = 'Далее';
                        $form['back_btn']       = true;
                        $form['tip']            = '<h3>Подсказка</h3><p>Называйте устройства по возможности именами владельцев, это облегчит идентефикацию в дальнейшем.</p>';

                        if(isset($_POST['back'])){
                            $form['step'] = 1;
                            $form['back_btn'] = false;
                            return $form;
                        };

                        if(!$_POST['name']){
                            $form['status']     = false;
                            $form['message']    = 'Введите название';
                            $form['step']       = 2;

                            return $form;
                        }else{
                            $_SESSION['add_car']['fields']['name']  = $_POST['name'];
                        };

                        if(!$_POST['make']){
                            $form['status']     = false;
                            $form['message']    = 'Введите марку автомобиля';
                            $form['step']       = 2;

                            return $form;
                        }else{
                            $_SESSION['add_car']['fields']['make']  = $_POST['make'];
                        };

                        if(!$_POST['model']){
                            $form['status']     = false;
                            $form['message']    = 'Введите модель автомобиля';
                            $form['step']       = 2;

                            return $form;
                        }else{
                            $_SESSION['add_car']['fields']['model']  = $_POST['model'];
                        };

                        if(!$_POST['g_id']){
                            $form['status']     = false;
                            $form['message']    = 'Введите госномер';
                            $form['step']       = 2;

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

            return $form;*/
        }
    };
?>