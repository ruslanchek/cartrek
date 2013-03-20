<?php
    Class Security extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user['status']){
                header('Location: /control/auth/login');
            };

            $this->template = 'user.tpl';

            $this->init(array(
                'name'  => 'user.security',
                'title' => 'Пароль и авторизация',
                'dir'   => '/control/user/security'
            ));

            if(isset($_GET['exit'])){
                $this->auth->exitUser();
                exit;
            };

            //If user have any actve devices
            if($this->ajax_mode && isset($_GET['action'])){
                switch($_GET['action']){
                    case 'process_form' : {
                        header('Content-type: application/json');
                        print json_encode($this->processForm());
                    }; break;
                };

                exit;
            };

            if(isset($_GET['action']) && $_GET['action'] == 'bind_oauth'){
                if(isset($_GET['provider'])){
                    switch($_GET['provider']){
                        case 'vk' : {
                            $this->auth->oauthVK('bind');
                        }; break;

                        case 'fb' : {
                            $this->auth->oauthFB('bind');
                        }; break;
                    };
                };

            };
        }

        public function __destruct(){
            $this->deInit();
        }

        private function processForm(){
            $form_data                      = new stdClass();
            $form_data->old_password        = false;
            $form_data->new_password        = false;
            $form_data->new_password_again  = false;

            $form_errors                        = new stdClass();
            $form_errors->old_password          = false;
            $form_errors->new_password          = false;
            $form_errors->new_password_again    = false;

            if(isset($_POST) && strtolower($_SERVER['REQUEST_METHOD']) == 'post'){
                $form_data->old_password            = $_POST['old_password'];
                $form_data->new_password            = $_POST['new_password'];
                $form_data->new_password_again      = $_POST['new_password_again'];

                $no_errors = true;

                if($form_data->old_password){
                    $query = "
                        SELECT
                            `password`
                        FROM
                            `public_users`
                        WHERE
                            `id` = ".intval($this->auth->user['data']['id'])."
                        LIMIT 1
                    ";

                    $data = $this->db->assocItem($query);

                    if($data['password'] != md5(md5(trim($form_data->old_password)))){
                        $form_errors->old_password = 'Старый пароль не подходит';
                        $no_errors = false;
                    }else{
                        if(!$form_data->new_password){
                            $form_errors->new_password = 'Введите новый пароль';
                            $no_errors = false;
                        };

                        if($form_data->new_password && strlen($form_data->new_password) < 5){
                            $form_errors->new_password = 'Пароль не может быть короче 5 символов';
                            $no_errors = false;
                        };

                        if(!$form_data->new_password_again){
                            $form_errors->new_password_again = 'Введите новый пароль еще раз';
                            $no_errors = false;
                        };

                        if($form_data->new_password != $form_data->new_password_again){
                            $form_errors->new_password_again = 'Новый пароль не совпадает';
                            $no_errors = false;
                        };
                    };
                }else{
                    $form_errors->old_password = 'Введите старый пароль';
                    $no_errors = false;
                };

                if($no_errors === true){
                    $this->db->query("
                        UPDATE
                            `public_users`
                        SET
                            `password` = '".md5(md5(trim($form_data->new_password)))."'
                        WHERE
                            `id` = ".intval($this->auth->user['data']['id'])."
                    ");

                    $this->mail->send(
                        'Менеджер аккаунтов '.$_SERVER['SERVER_NAME'],
                        'account_manager@'.$_SERVER['SERVER_NAME'],
                        $this->auth->user['data']['email'],
                        'Пароль изменен',
                        'mailing/password_changed.tpl',
                        array(
                            'user_data' => $this->auth->user['data'],
                            'password' => $form_errors->new_password
                        )
                    );
                };

                return (object) array(
                    'form_data'     => $form_data,
                    'form_errors'   => $form_errors,
                    'result'        => $no_errors
                );
            };
        }
    };
?>