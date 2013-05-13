<?php

Class User extends Core
{
    private
        $phones_limit = 5;

    public function __construct()
    {
        parent::__construct();

        $this->template = 'user.tpl';

        $this->init(array(
            'name' => 'user',
            'title' => 'Настройка аккаунта',
            'dir' => '/control/user'
        ));

        if (isset($_GET['exit'])) {
            $this->auth->exitUser();
            exit;
        }

        //If user have any actve devices
        if ($this->ajax_mode && isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'processForm' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->processForm());
                }
                    break;

                case 'phoneEdit' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->phoneEdit($_POST['active'], $_POST['phone'], $_POST['index']));
                }
                    break;

                case 'phoneDelete' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->phoneDelete($_POST['phone'], $_POST['index']));
                }
                    break;

                case 'phoneAdd' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->phoneAdd($_POST['active'], $_POST['phone']));
                }
                    break;
            }

            exit;
        }
    }

    public function __destruct()
    {
        $this->deInit();
    }

    private function setUserData($data)
    {
        $cols = "";

        if (is_array($data) && !empty($data)) {
            foreach ($data as $item) {
                $cols .= "`" . $item->key . "` = '" . $this->db->quote($item->val) . "',";
            }

            $cols = substr($cols, 0, strlen($cols) - 1);

            $query = "
                    UPDATE
                        `public_users`
                    SET
                        " . $cols . "
                    WHERE
                        `id` = " . intval($this->auth->user['data']['id']);

            $this->db->query($query);
        }
    }

    private function preparePhoneAndCode($phone)
    {

    }

    private function phoneAdd($active, $phone)
    {
        $phone = $this->utils->clearPhoneStr($phone);

        if (!$phone || $phone == '') {
            return array(
                'status' => false,
                'message' => 'Введите номер телефона'
            );
        }

        if ($phone && strlen($phone) < 10) {
            return array(
                'status' => false,
                'message' => 'Номер телефона &mdash; не менее 10 цифр'
            );
        }

        $orig_phones = json_decode($this->auth->user['data']['phones']);
        $dublicate = false;

        if (count($orig_phones) >= $this->phones_limit) {
            return array(
                'status' => false,
                'message' => 'Достигнуто максимальное количество номеров &mdash; ' . $this->phones_limit
            );
        }

        for ($i = 0, $l = count($orig_phones); $i < $l; $i++) {
            if ($orig_phones[$i]->phone == $phone) {
                $dublicate = true;
            };
        }

        if ($dublicate === true) {
            return array(
                'status' => false,
                'message' => 'Номер ' . $this->utils->formatPhoneStr($phone, 7) . ' уже добавлен'
            );
        } else {
            if (
                isset($_SESSION) &&
                isset($_SESSION['phone_adding_request']) &&
                $_POST['init'] != '1'
            ) {
                if($_SESSION['phone_adding_request']->code != $_POST['code'] || $_SESSION['phone_adding_request']->phone != $phone){
                    return array(
                        'status' => false,
                        'message' => 'Неверный код подтверждения'
                    );
                }

                array_push($orig_phones, (object) array('active' => (($_SESSION['phone_adding_request']->active == 'true') ? true : false), 'phone' => $_SESSION['phone_adding_request']->phone));

                $orig_phones = json_encode($orig_phones);

                $query = "
                    UPDATE
                        `public_users`
                    SET
                        `phones` = '" . $this->db->quote($orig_phones) . "'
                    WHERE
                        `id` = " . intval($this->auth->user['data']['id']);

                $this->db->query($query);

                unset($_SESSION['phone_adding_request']);

                return array(
                    'status' => true,
                    'action' => 'added',
                    'message' => 'Номер добавлен',
                    'phones' => json_decode($orig_phones)
                );
            }else{
                unset($_SESSION['phone_adding_request']);

                $_SESSION['phone_adding_request'] = new stdClass();

                $_SESSION['phone_adding_request']->active = $active;
                $_SESSION['phone_adding_request']->phone = $phone;
                $_SESSION['phone_adding_request']->code = $this->utils->createRandomCode(4);

                $this->sms->send(array($phone), 'Ваш проверочный код: '.$_SESSION['phone_adding_request']->code);

                return array(
                    'status' => true,
                    'action' => 'request',
                    'phone' => $this->utils->formatPhoneStr($phone),
                    'message' => 'Код подтверждения выслан на номер ' . $this->utils->formatPhoneStr($phone, 7)
                );
            }
        }
    }

    private function phoneEdit($active, $phone, $index)
    {
        $orig_phones = json_decode($this->auth->user['data']['phones']);

        for ($i = 0, $l = count($orig_phones); $i < $l; $i++) {
            if ($orig_phones[$i]->phone == $phone && $i == $index) {
                $orig_phones[$i]->active = ($active == 'true') ? true : false;
            };
        }

        $orig_phones = json_encode($orig_phones);

        $query = "
                UPDATE
                    `public_users`
                SET
                    `phones` = '" . $this->db->quote($orig_phones) . "'
                WHERE
                    `id` = " . intval($this->auth->user['data']['id']);

        $this->db->query($query);

        return array(
            'status' => true,
            'message' => 'Данные сохранены',
            'phones' => json_decode($orig_phones)
        );
    }

    private function phoneDelete($phone, $index)
    {
        $orig_phones = json_decode($this->auth->user['data']['phones']);

        for ($i = 0, $l = count($orig_phones); $i < $l; $i++) {
            if ($orig_phones[$i]->phone == $phone && $i == $index) {
                unset($orig_phones[$i]);
            };
        }

        $orig_phones = json_encode($orig_phones);

        $query = "
                UPDATE
                    `public_users`
                SET
                    `phones` = '" . $this->db->quote($orig_phones) . "'
                WHERE
                    `id` = " . intval($this->auth->user['data']['id']);

        $this->db->query($query);

        return array(
            'status' => true,
            'message' => 'Номер удален',
            'phones' => json_decode($orig_phones)
        );
    }

    private function processForm()
    {
        $form_data = new stdClass();
        $form_data->login = $this->auth->user['data']['login'];
        $form_data->email = $this->auth->user['data']['email'];
        $form_data->email = $this->auth->user['data']['phones'];
        $form_data->name = $this->auth->user['data']['name'];
        $form_data->user_timezone = $this->auth->user['data']['user_timezone'];

        $form_errors = new stdClass();
        $form_errors->login = false;
        $form_errors->email = false;
        $form_errors->name = false;

        if (isset($_POST) && strtolower($_SERVER['REQUEST_METHOD']) == 'post') {
            $form_data->login = $_POST['login'];
            $form_data->email = $_POST['email'];
            $form_data->name = $_POST['name'];
            $form_data->user_timezone = $_POST['user_timezone'];

            $form_data->login = $this->utils->convertUrl($form_data->login);

            $no_errors = true;

            if (!$form_data->login) {
                $form_errors->login = 'Введите логин';
                $no_errors = false;
            }

            if ($this->auth->checkAlreadyByLogin($form_data->login, array($this->auth->user['data']['id']))) {
                $form_errors->login = 'Уже используется';
                $no_errors = false;
            }

            if (!$form_data->email) {
                $form_errors->email = 'Введите адрес почты';
                $no_errors = false;
            } else {
                if (!$this->utils->matchPattern($form_data->email, 'email')) {
                    $form_errors->email = 'Адрес почты неправильный';
                    $no_errors = false;
                }
            }

            if ($this->auth->checkAlreadyByEmail($form_data->email, array($this->auth->user['data']['id']))) {
                $form_errors->email = 'Уже используется';
                $no_errors = false;
            }

            if (!$form_data->name) {
                $form_errors->name = 'Введите имя';
                $no_errors = false;
            }

            if ($no_errors === true) {
                $this->setUserData(array(
                    (object)array('key' => 'login', 'val' => $form_data->login),
                    (object)array('key' => 'email', 'val' => $form_data->email),
                    (object)array('key' => 'name', 'val' => $form_data->name),
                    (object)array('key' => 'user_timezone', 'val' => $form_data->user_timezone)
                ));
            }

            return (object)array(
                'form_data' => $form_data,
                'form_errors' => $form_errors,
                'result' => $no_errors
            );
        }
    }
}