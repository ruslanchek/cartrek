<?php

Class User extends Core
{
    public function __construct()
    {
        parent::__construct();

        if (!$this->auth->user['status']) {
            header('Location: /control/auth/login');
        }
        ;

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
        ;

        //If user have any actve devices
        if ($this->ajax_mode && isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'process_form' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->processForm());
                }
                    ;
                    break;
            }
            ;

            exit;
        }
        ;
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
            ;

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
        ;
    }

    private function processForm()
    {
        $form_data = new stdClass();
        $form_data->login = $this->auth->user['data']['login'];
        $form_data->email = $this->auth->user['data']['email'];
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
            ;

            if ($this->auth->checkAlreadyByLogin($form_data->login, array($this->auth->user['data']['id']))) {
                $form_errors->login = 'Уже используется';
                $no_errors = false;
            }
            ;

            if (!$form_data->email) {
                $form_errors->email = 'Введите адрес почты';
                $no_errors = false;
            } else {
                if (!$this->utils->matchPattern($form_data->email, 'email')) {
                    $form_errors->email = 'Адрес почты неправильный';
                    $no_errors = false;
                }
                ;
            }
            ;

            if ($this->auth->checkAlreadyByEmail($form_data->email, array($this->auth->user['data']['id']))) {
                $form_errors->email = 'Уже используется';
                $no_errors = false;
            }
            ;

            if (!$form_data->name) {
                $form_errors->name = 'Введите имя';
                $no_errors = false;
            }
            ;

            if ($no_errors === true) {
                $this->setUserData(array(
                    (object)array('key' => 'login', 'val' => $form_data->login),
                    (object)array('key' => 'email', 'val' => $form_data->email),
                    (object)array('key' => 'name', 'val' => $form_data->name),
                    (object)array('key' => 'user_timezone', 'val' => $form_data->user_timezone)
                ));
            }
            ;

            return (object)array(
                'form_data' => $form_data,
                'form_errors' => $form_errors,
                'result' => $no_errors
            );
        }
        ;
    }
}