<?php
    Class FleetAdd extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $form = array();
            $form['step'] = 1;

            if(isset($_POST['action']) && $_POST['action'] == 'add_car'){
                $form = $this->addDevice();
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
                    `user_id`   != 1 &&
                    `active`    != 1 &&
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
                    `user_id`   = ".intval($this->auth->user['data']['id']).",
                    `active`    = 1,
                    `name`      = '".$this->db->quote($_POST['name'])."',
                    `make`      = '".$this->db->quote($_POST['make'])."',
                    `model`     = '".$this->db->quote($_POST['model'])."',
                    `g_id`      = '".$this->db->quote($_POST['g_id'])."'
                WHERE
                    `code`      = '".$this->db->quote($code)."'
            ";

            $this->db->query($query);
        }

        public function addDevice(){
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
        }
    };
?>