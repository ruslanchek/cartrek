<?php
    Class FleetAdd extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->template = 'user.tpl';

            $this->init(array(
                'name'  => 'user.fleet.add',
                'title' => 'Добавление устройства',
                'dir'   => '/control/user/fleet/add'
            ));

            if($this->ajax_mode && isset($_GET['action'])){
                switch($_GET['action']){
                    case 'check_device_by_sn' : {
                        header('Content-type: application/json');
                        print json_encode($this->checkDeviceBySN($_GET['code']));
                    }; break;
                };

                exit;
            };

            if(!$this->ajax_mode && isset($_GET['action'])){
                switch($_GET['action']){
                    case 'set_device' : {

                    }; break;
                };
            };
        }

        public function __destruct(){
            $this->deInit();
        }

        public function checkDeviceBySN($code){
            $form_data          = new stdClass();
            $form_data->code    = false;

            $form_errors        = new stdClass();
            $form_errors->code  = false;

            $no_errors          = true;
            $form_data->code    = $code;

            if(strlen($code) < 12 && strlen($code) > 0){
                $form_errors->code  = 'Ошибка, код должен состоять не менее, чем из 12 символов';
                $no_errors          = false;
            }elseif(strlen($code) <= 0 && !$code){
                $form_errors->code  = 'Ошибка, введите код';
                $no_errors          = false;
            }else{
                $query = "
                    SELECT
                        COUNT(*) AS `count`
                    FROM
                        `devices`
                    WHERE
                        `user_id`   != ".intval($this->auth->user['data']['id'])." &&
                        `active`    != 1 &&
                        `activated` != 1 &&
                        `code`      = '".$this->db->quote(strtoupper($form_data->code))."'
                ";

                $result = $this->db->assocItem($query);

                if($result['count'] < 1){
                    $form_errors->code  = 'Ошибка, несуществующий код';
                    $no_errors          = false;
                };

                if($no_errors === true){
                    $_SESSION['code_approved'] = $form_data->code;
                };
            };

            return (object) array(
                'form_data'     => $form_data,
                'form_errors'   => $form_errors,
                'result'        => $no_errors
            );
        }

        public function bindNewDevice($code){
            $query = "
                UPDATE
                    `devices`
                SET
                    `user_id`   = ".intval($this->auth->user['data']['id']).",
                    `active`    = 1,
                    `activated` = 1,
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