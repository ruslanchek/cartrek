<?php

Class FleetAdd extends Core
{
    public function __construct()
    {
        parent::__construct();

        $this->template = 'user.tpl';

        $this->init(array(
            'name' => 'user.fleet.add',
            'title' => 'Добавление машины',
            'dir' => '/control/user/fleet/add'
        ));

        if ($this->ajax_mode && isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'check_device_by_sn' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->checkDeviceBySN($_GET['code']));
                }
                    break;

                case 'set_new_device_data' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->setNewDeviceData());
                }
                    break;
            }

            exit;
        }

        if (!$this->ajax_mode && isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'set_device' :
                {

                }
                    break;

                case 'finish' :
                {
                    $this->finish();
                }
                    break;
            }
        }
    }

    public function __destruct()
    {
        $this->deInit();
    }

    private function finish()
    {
        $cs = $this->checkSN($_SESSION['code_approved']);

        if ($cs->status === true) {
            $query = "
                    UPDATE
                        `devices`
                    SET
                        `user_id`   = " . intval($this->auth->user['data']['id']) . ",
                        `active`    = 1,
                        `activated` = 1,
                        `name`      = '" . $this->db->quote($_SESSION['new_car_data']->name) . "',
                        `make`      = '" . $this->db->quote($_SESSION['new_car_data']->make) . "',
                        `model`     = '" . $this->db->quote($_SESSION['new_car_data']->model) . "',
                        `g_id`      = '" . $this->db->quote($_SESSION['new_car_data']->g_id) . "'
                    WHERE
                        `code`      = '" . $this->db->quote($_SESSION['code_approved']) . "'
                ";

            $this->db->query($query);

            $this->smarty->assign('new_device_data', $this->devices->getUserDevice($cs->id));

        } else {
            header('Location:/control/user/fleet/add/');
        }
    }

    private function checkSN($code)
    {
        $query = "
            SELECT
                `id`
            FROM
                `devices`
            WHERE
                `user_id`   = 0 &&
                `active`    != 1 &&
                `activated` != 1 &&
                `code`      = '" . $this->db->quote(strtoupper($code)) . "'
        ";

        $data = $this->db->assocItem($query);

        $result = new stdClass();

        $result->id = $data['id'];

        if ($data['id'] > 0) {
            $result->status = true;
        } else {
            $result->status = false;
        }
        ;

        return $result;
    }

    public function checkDeviceBySN($code)
    {
        $form_data = new stdClass();
        $form_data->code = false;

        $form_errors = new stdClass();
        $form_errors->code = false;

        $no_errors = true;
        $form_data->code = $code;

        if (strlen($code) < 12 && strlen($code) > 0 && $code != '4815162342') {
            $form_errors->code = 'Минимум 12 символов';
            $no_errors = false;

        } elseif (strlen($code) <= 0 && !$code) {
            $form_errors->code = 'Введите код';
            $no_errors = false;

        }elseif($code == '4815162342'){
            $form_errors->code = '108 minutes left, have a nice day!';
            $no_errors = false;

        }elseif($code == '014007892203'){
            $form_errors->code = 'Nice try! :-)';
            $no_errors = false;

        } else {
            $result = $this->checkSN($form_data->code)->status;

            if ($result !== true) {
                $form_errors->code = 'Несуществующий код';
                $no_errors = false;
            }

            if (strlen($code) > 12) {
                $form_errors->code = 'Максимум 12 символов';
                $no_errors = false;
            }

            if ($no_errors === true) {
                $_SESSION['code_approved'] = $form_data->code; // TODO сделать фильтр значений от вредоносных
            }
        }

        return (object)array(
            'form_data' => $form_data,
            'form_errors' => $form_errors,
            'result' => $no_errors
        );
    }

    private function setNewDeviceData()
    {
        $form_data = new stdClass();
        $form_data->code = false;
        $form_data->name = false;
        $form_data->make = false;
        $form_data->model = false;
        $form_data->g_id = false;

        $form_errors = new stdClass();
        $form_errors->code = false;
        $form_errors->name = false;
        $form_errors->make = false;
        $form_errors->model = false;
        $form_errors->g_id = false;

        $no_errors = true;
        $form_data->code = $_SESSION['code_approved'];

        $result = $this->checkSN($form_data->code)->status;

        if ($result !== true) {
            $form_errors->global = 'Ошибка, несуществующий код, начните процесс активации заново';
            $no_errors = false;
        }

        if (strtolower($_SERVER['REQUEST_METHOD']) == 'post') {
            $form_data->name = $_POST['name'];
            $form_data->make = $_POST['make'];
            $form_data->model = $_POST['model'];
            $form_data->g_id = $_POST['g_id'];

            if (!$form_data->name) {
                $form_errors->name = 'Введите название';
                $no_errors = false;
            } else if (strlen($form_data->name) < 3) {
                $form_errors->name = 'Минимум 3 символа';
                $no_errors = false;
            } else if (strlen($form_data->name) > 20) {
                $form_errors->name = 'Максимум 20 символов';
                $no_errors = false;
            }

            if (!$form_data->make || $form_data->make == '') {
                $form_errors->make = 'Выберите прозводителя';
                $no_errors = false;
            } else if (strlen($form_data->make) > 20) {
                $form_errors->make = 'Максимум 20 символов';
                $no_errors = false;
            }

            if (!$form_data->model) {
                $form_errors->model = 'Введите модель';
                $no_errors = false;
            } else if (strlen($form_data->model) > 20) {
                $form_errors->model = 'Максимум 20 символов';
                $no_errors = false;
            }

            if (!$form_data->g_id) {
                $form_errors->g_id = 'Введите госномер';
                $no_errors = false;
            } else if (strlen($form_data->g_id) > 20) {
                $form_errors->g_id = 'Максимум 20 символов';
                $no_errors = false;
            }

            if ($no_errors === true) {
                $_SESSION['new_car_data'] = $form_data;
            }
        }

        return (object)array(
            'form_data' => $form_data,
            'form_errors' => $form_errors,
            'result' => $no_errors
        );
    }
}