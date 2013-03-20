<?php

class Auth extends Core{
    public
        $user;

    private
        $session_time,
        $addition_fields,
        $password_length;

    function __construct(){
        parent::__construct();

        $this->fields = array(
            'id',
            'password',
            'name',
            'hash',
            'email',
            'login',
            'reg_date',
            'last_login',
            'last_activity',
            'online',
            'vk_id',
            'fb_id',
            'balance',
            'user_timezone',
            'phones',
            'daily_pay_amount'
        );

        $this->password_length = 6;
        $this->addition_fields = array();
        $this->session_time = 60*60*24;

        $this->checkLogin();

        unset(
            $this->user['data']['password'],
            $this->user['data']['hash']
        );
    }

    //Get fields for user data
    private function getFields(){
        $result = '';

        foreach($this->fields as $items){
            $result .= '`public_users`.`'.$items.'`,';
        };

        foreach($this->addition_fields as $items){
            $result .= '`public_users`.`'.$items.'`,';
        };

        $result = substr($result, 0, strlen($result)-1);

        return $result;
    }

    //User authenticate
    public function forceLogin($data){
        $hash = md5($this->utils->getUniqueCode(10));

        $query = "
            UPDATE
                `public_users`
            SET
                `hash` = '".$hash."',
                `ip` = INET_ATON('".$_SERVER['REMOTE_ADDR']."'),
                `online` = '1',
                `last_activity` = NOW(),
                `last_login` = NOW()
            WHERE
                `id` = '".intval($data['id'])."'
        ";

        $this->db->query($query);

        setcookie("id", $data['id'], time() + $this->session_time, "/");
        setcookie("hash", $hash, time() + $this->session_time, "/");

        $this->user['status'] = true;
        $this->user['message'] = 'Вы успешно авторизовались';
        $this->user['data'] = $data;

        $this->getUserSharedAccountStatus();

        header('Location: /control');
    }

    //Set currently user activity
    private function setActivity(){
        $this->db->query("
            UPDATE
                `public_users`
            SET
                `last_activity` = NOW(),
                `online` = '1'
            WHERE
                `id` = '".$this->user['data']['id']."'
        ");
    }

    //Check user status
    private function checkLogin(){
        if(isset($_COOKIE['id'])){
            $query = "
                SELECT
                    ".$this->getFields().",
                    COUNT(`events`.`id`) AS `new_events_count`
                FROM
                    `public_users`
                LEFT JOIN
                    `events` ON (`events`.`user_id` = `public_users`.`id` && `events`.`active` = 1)
                WHERE
                    `public_users`.`id` = '".intval($_COOKIE['id'])."'
                LIMIT 1
            ";

            $data = $this->db->assocItem($query);
            $interval = $this->utils->datetimeToSeconds(date('Y-m-d H:i:s')) - $this->utils->datetimeToSeconds($data['last_activity']);

            if($interval > $this->session_time){
                $this->exitUser();
            }else{
                if(($data['hash'] == $_COOKIE['hash'] && $data['id'] == $_COOKIE['id']) && !empty($data)){
                    $this->user['status']    = true;
                    $this->user['message']   = "Autherized";
                    $this->user['data']  = $data;
                    $this->getUserSharedAccountStatus();

                    $this->setActivity();

                }else{
                    setcookie("id", "", time() - $this->session_time, "/");
                    setcookie("hash", "", time() - $this->session_time, "/");

                    $this->user['status'] = false;
                    $this->user['message'] = 'Autherization required';
                };
            };
        };
    }

    //Check if user from a shared account
    private function getUserSharedAccountStatus(){
        if(
            $this->user['data']['vk_id'] > 0 ||
            $this->user['data']['fb_id'] > 0
        ){
            $this->user['shared_account'] = true;
        }else{
            $this->user['shared_account'] = false;
        };
    }

    //Try to user autherize
    public function auth($login, $password){
        if(!$login && $password){
            $this->user['status'] = false;
            $this->user['message'] = "Вы не ввели логин";

        }elseif(!$password && $login){
            $this->user['status'] = false;
            $this->user['message'] = "Вы не ввели пароль";

        }elseif(!$password && !$login){
            $this->user['status'] = false;
            $this->user['message'] = "Вы не ввели логин и пароль";

        }else{
            if($this->utils->matchPattern($login, 'email')){
                $query = "
                    SELECT
                        ".$this->getFields()."
                    FROM
                        `public_users`
                    WHERE
                        `email` = '".$login."'
                    LIMIT 1
                ";
            }else{
                $query = "
                    SELECT
                        ".$this->getFields()."
                    FROM
                        `public_users`
                    WHERE
                        `login` = '".$login."'
                    LIMIT 1
                ";
            };

            $data = $this->db->assocItem($query);

            if($data['password'] === md5(md5($password))){
                $this->forceLogin($data);
            }else{
                $this->user['status'] = false;
                $this->user['message'] = 'Вы ввели неправильный логин или пароль';
            };
        };

        return $this->user;
    }

    //Exit
    public function exitUser(){
        $this->db->query("
            UPDATE
                `public_users`
            SET
                `hash` = '',
                `online` = ''
            WHERE
                `id` = ".intval($this->user['data']['id'])."
        ");

        setcookie("id", "", time() - $this->session_time, "/");
        setcookie("hash", "", time() - $this->session_time, "/");
    }

    //Remember Code
    public function rememberCode($user_id, $code){
        $query = "
            SELECT
                ".$this->getFields()."
            FROM
                `public_users`
            WHERE
                `id` = ".intval($user_id)." &&
                `remember_code` = '".$this->db->quote($code)."'
            LIMIT 1
        ";

        $data = $this->db->assocItem($query);

        if($data['id'] > 0){
            $password = $this->utils->getUniqueCode($this->password_length);

            $query = "
                UPDATE
                    `public_users`
                SET
                    `password` = '".md5(md5(trim($password)))."',
                    `remember_code` = ''
                WHERE
                    `id` = ".intval($data['id'])."
            ";

            $this->db->query($query);

            $this->mail->send(
                'Менеджер аккаунтов '.$_SERVER['SERVER_NAME'],
                'account_manager@'.$_SERVER['SERVER_NAME'],
                $data['email'],
                'Пароль восстановлен',
                'mailing/password_recover_password.tpl',
                array(
                     'user_data' => $data,
                     'password' => $password
                )
            );

            return array(
                'status' => true,
                'message' => 'Восстановление прошло успешно, новый пароль выслан на вашу электронную почту'
            );
        }else{
            return array(
                'status' => false,
                'message' => 'Код не действителен, восстановление пароля не удалось'
            );
        };
    }

    //Remember
    public function remember($login){
        if(!$login){
            $result = array(
                'status' => false,
                'message' => 'Введите логин/e-mail'
            );

        }else{
            if($this->utils->matchPattern($login, 'email')){
                $query = "
                    SELECT
                        ".$this->getFields().",
                        `last_remember`
                    FROM
                        `public_users`
                    WHERE
                        `email` = '".$this->db->quote($login)."'
                    LIMIT 1
                ";
            }else{
                $query = "
                    SELECT
                        ".$this->getFields().",
                        `last_remember`
                    FROM
                        `public_users`
                    WHERE
                        `login` = '".$this->db->quote($login)."'
                    LIMIT 1
                ";
            };

            $data = $this->db->assocItem($query);

            if($data['id'] > 0){
                $tl = $this->utils->datetimeToSeconds($data['last_remember']);
                $tn = $this->utils->datetimeToSeconds(date('Y-m-d H:i:s'));

                $ti = $tn - $tl;

                if($ti > 300){
                    $code = md5($this->utils->getUniqueCode($this->password_length));



                    $query = "
                        UPDATE
                            `public_users`
                        SET
                            `remember_code` = '".$code."',
                            `last_remember` = '".$this->db->quote(date('Y-m-d H:i:s'))."'
                        WHERE
                            `id` = ".intval($data['id'])."
                    ";

                    $this->db->query($query);

                    $link = 'http://'.$_SERVER['HTTP_HOST'].'/control/auth/remember_pass/?action=password_recover&user_id='.$data['id'].'&code='.$code;

                    $this->mail->send(
                        'Менеджер аккаунтов '.$_SERVER['SERVER_NAME'],
                        'account_manager@'.$_SERVER['SERVER_NAME'],
                        $data['email'],
                        'Подтвердите восстановление пароля',
                        'mailing/password_recover_code.tpl',
                        array(
                             'user_data' => $data,
                             'code' => $code,
                             'code_link' => $link
                        )
                    );

                    $result = array(
                        'status' => true,
                        'message' => 'Инструкция по получению нового пароля выслана на адрес '.$data['email']
                    );
                }else{
                    $result = array(
                        'status' => false,
                        'message' => 'Пароль этого пользователя недавно восстанавливался, попробуйте через '.(5-floor($ti/60)).' мин.'
                    );
                };
            }else{
                if($this->utils->matchPattern($login, 'email')){
                    $eol = "такой электронной почтой";
                }else{
                    $eol = "таким логином";
                };

                $result = array(
                    'status' => false,
                    'message' => 'Пользователя с '.$eol.' не существует'
                );
            };
        };

        return $result;
    }

    /* REGISTER */
    //Check user existance by email (true if present)
    public function checkAlreadyByEmail($email, $not_id = false){
        return $this->db->checkRowExistance('public_users', 'email', mb_strtolower($email, "UTF-8"), $not_id);
    }

    //Check user existance by login (true if present)
    public function checkAlreadyByLogin($login, $not_id = false){
        return $this->db->checkRowExistance('public_users', 'login', mb_strtolower($login, "UTF-8"), $not_id);
    }

    //Generate another login
    public function getAnotherLogin($login){
        $login = $login.'_'.rand();

        if($this->checkAlreadyByLogin($login)){
            $login = $this->getAnotherLogin($login);
        };

        return $login;
    }

    //Extract username from email
    public function getLoginFromEmail($email){
        return preg_replace( "/^([^@]+)(@.*)$/", "$1", $email);
    }

    //Change password of current user
    public function changePassword($p_old, $p_new, $p_new_again){
        $query = "
            SELECT
                `password`
            FROM
                `public_users`
            WHERE
                `id` = ".intval($this->user['data']['id'])."
            LIMIT 1
        ";

        $data = $this->db->assocItem($query);

        if($p_old && $p_new && $p_new_again){
            if($data['password'] == md5(md5(trim($p_old)))){
                if($p_new == $p_new_again){
                    $this->db->query("
                        UPDATE
                            `public_users`
                        SET
                            `password` = '".$this->db->quote(md5(md5(trim($p_new))))."'
                        WHERE
                            `id` = ".intval($this->user['data']['id'])."
                    ");

                    $this->mail->send(
                        'Менеджер аккаунтов '.$_SERVER['SERVER_NAME'],
                        'account_manager@'.$_SERVER['SERVER_NAME'],
                        $this->auth->user['data']['email'],
                        'Пароль изменен',
                        'mailing/password_changed.tpl',
                        array(
                            'user_data' => $this->user['data'],
                            'password' => $p_new
                        )
                    );

                    $result = array(
                        'status' => true,
                        'message' => 'Пароль изменен и выслан вам на почту'
                    );
                }else{
                    $result = array(
                        'status' => false,
                        'message' => 'Пароли не совпадают'
                    );
                };
            }else{
                $result = array(
                    'status' => false,
                    'message' => 'Старый пароль не подходит'
                );
            };
        }else{
            $result = array(
                'status' => false,
                'message' => 'Необходимо ввести все пароли'
            );
        };

        return $result;
    }

    public function registerNewUser(){
        //Check for email is not empty
        if(!isset($_POST['email']) || $_POST['email'] == ''){
            $result = array(
                'status' => false,
                'message' => 'Введите e-mail'
            );
        }else{
            //Check for email is match the pattern
            if(!$this->utils->matchPattern($_POST['email'], 'email')){
                $result = array(
                    'status' => false,
                    'message' => 'E-mail указан неправильно'
                );
            }else{
                //Check for email is unique
                if($this->checkAlreadyByEmail($_POST['email']) === true){
                    $result = array(
                        'status' => false,
                        'message' => 'Пользователь с таким e-mail-ом уже зарегистрирован'
                    );
                }else{
                    //All data is ok, doing a register
                    $login = $this->getLoginFromEmail($_POST['email']);

                    if($this->checkAlreadyByLogin($login)){
                        $login = $this->getAnotherLogin($login);
                    };

                    $password = $this->utils->getUniqueCode($this->password_length);

                    $this->db->query("
                        INSERT INTO `public_users` (
                            `password`,
                            `name`,
                            `email`,
                            `login`,
                            `reg_date`
                        ) VALUES (
                            '".$this->db->quote(md5(md5($password)))."',
                            '".$this->db->quote($login)."',
                            '".$this->db->quote($_POST['email'])."',
                            '".$this->db->quote($login)."',
                            NOW()
                        )
                    ");

                    $this->mail->send(
                        'Менеджер аккаунтов '.$_SERVER['SERVER_NAME'],
                        'account_manager@'.$_SERVER['SERVER_NAME'],
                        $_POST['email'],
                        'Добро пожаловать на сервис мониторинга автотранспорта!',
                        'mailing/register_success.tpl',
                        array(
                             'login' => $login,
                             'password' => $password,
                             'domain' => $_SERVER['SERVER_NAME']
                        )
                    );

                    $this->auth($_POST['email'], $password);

                    $result = array(
                        'status' => true,
                        'message' => 'Спасибо, вы успешно зарегистрировались, сейчас страница обновится и вы автоматически авторизуетесь'
                    );
                };
            };
        };

        return $result;
    }

    /* Change user data */
    public function changeData($user_id){
        if(intval($user_id) > 0){
            $new_data = array(
                'email' => $_POST['email'],
                'login' => $_POST['login'],
                'name' => $_POST['name']
            );

            if(!$this->utils->matchPattern($new_data['email'], 'email')){
                return array(
                    'status' => false,
                    'message' => 'E-mail указан неправильно'
                );
            };

            if($this->db->checkRowExistance('public_users', 'email', mb_strtolower($new_data['email'], "UTF-8"), array($user_id)) === true){
                return array(
                    'status' => false,
                    'message' => 'E-mail <span>'.$new_data['email'].'</span> уже занят'
                );
            };

            if(strlen($new_data['login']) < 3){
                return array(
                    'status' => false,
                    'message' => 'Логин должен состоять не менее, чем из 3 символов'
                );
            };

            if(preg_match('/[^0-9a-zA-Z_-]/', $new_data['login'])){
                return array(
                    'status' => false,
                    'message' => 'Логин может состоять только из литинских символов алфавита, цифр и знаков «-» и «_»'
                );
            };

            if($this->db->checkRowExistance('public_users', 'login', mb_strtolower($new_data['login'], "UTF-8"), array($user_id)) === true){
                return array(
                    'status' => false,
                    'message' => 'Пользователь с логином <span>'.$new_data['login'].'</span> уже зарегистрирован'
                );
            };

            $query = "
                UPDATE
                    `public_users`
                SET
                    `email` = '".$this->db->quote($new_data['email'])."',
                    `name` = '".$this->db->quote($new_data['name'])."'
                WHERE
                    `id` = ".intval($user_id)."
            ";

            $this->db->query($query);

            $this->user['data']['email'] = $new_data['email'];
            $this->user['data']['login'] = $new_data['login'];
            $this->user['data']['name'] = $new_data['name'];

            return array(
               'status' => true,
               'message' => 'Данные успешно сохранены'
            );
        }else{
            return array(
               'status' => false,
               'message' => 'Пользователь не авторизован'
            );
        };
    }

    /* OAuth */
    public function oAuth(){
        switch($_GET['provider']){
            case 'vk' : $this->oauthVK(); break;
            case 'fb' : $this->oauthFB(); break;
            case 'tw' : $this->oauthTW(); break;
        };
    }

    private function showOAuthError($error, $error_description){
        if($error == 'access_denied'){
            header("Location: http://".$_SERVER['HTTP_HOST']);
        }else{
            $error = '<strong>Error '.$error.': </strong>'.preg_replace('/\+/', ' ', $error_description).'</p>';

            die($error);
        };
    }

    private function getRequestString($url, $params){
        $parsed_params = '?';

        foreach($params as $key => $value){
            $parsed_params .= $key.'='.urlencode($value).'&';
        };

        $parsed_params = trim($parsed_params, '&');

        if($params !== null){
            return $url.$parsed_params;
        }else{
            return $url;
        };
    }

    private function doGetRequest($section, $params){
        header("Location: ".$this->getRequestString($section, $params));
    }

    private function readPostRequest($section, $params, $json = true){
        $opts_parsed = '?';

        foreach($params as $key => $value){
            $opts_parsed .= $key.'='.urlencode($value).'&';
        };

        $opts_parsed = substr($opts_parsed, 0, strlen($opts_parsed) - 1);

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $section);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $opts_parsed);
        curl_setopt($curl, CURLOPT_USERAGENT, 'Cartrek 1.0');

        $res = curl_exec($curl);

        if(!$res){
            $error = curl_error($curl).'('.curl_errno($curl).')';
            return $error;
        }else{
            return ($json) ? json_decode($res) : $res;
        };

        curl_close($curl);
    }

    private function readGetRequest($section, $params, $json = true){
        $opts_parsed = '?';

        foreach($params as $key => $value){
            $opts_parsed .= $key.'='.urlencode($value).'&';
        };

        $opts_parsed = substr($opts_parsed, 0, strlen($opts_parsed) - 1);

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $section.$opts_parsed);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($curl, CURLOPT_USERAGENT, 'Cartrek 1.0');

        $res = curl_exec($curl);

        if(!$res){
            $error = curl_error($curl).'('.curl_errno($curl).')';
            return $error;
        }else{
            return ($json) ? json_decode($res) : $res;
        };

        curl_close($curl);
    }

    private function bindOAuth($provider, $fields){
        if($fields['uid'] > 0 && $this->user['data']['id'] > 0){
            $id_row = $provider.'_id';

            if(!$this->db->checkRowExistance('public_users', $id_row, $fields['uid'])){
                $this->db->query("
                    UPDATE `public_users`
                    SET `".$this->db->quote($id_row)."` = ".$fields['uid']."
                    WHERE `id` = ".intval($this->user['data']['id']));

                return true;
            };
        };
    }

    private function registerFromOAuth($provider, $fields){
        if($fields['uid'] > 0){
            $id_row = $provider.'_id';

            if($this->db->checkRowExistance('public_users', $id_row, $fields['uid'])){
                $query = "
                    SELECT
                        ".$this->getFields()."
                    FROM
                        `public_users`
                    WHERE
                        `".$this->db->quote($id_row)."` = '".$this->db->quote($fields['uid'])."'
                    LIMIT 1
                ";

                $this->forceLogin($this->db->assocItem($query));

            }else{
                if($fields['first_name'] != '' || $fields['last_name'] != ''){
                    $name = $fields['first_name'].' '.$fields['last_name'];
                }else if($fields['name'] != ''){
                    $name = $fields['name'];
                }else{
                    $name = $provider.'_user_'.$fields['uid'];
                };

                if($fields['name'] != ''){
                    $login = $fields['name'];
                }else if($fields['first_name'] != '' || $fields['last_name'] != ''){
                    $login = $fields['first_name'].' '.$fields['last_name'];
                }else{
                    $login = $provider.'_user_'.$fields['uid'];
                };

                $login = $this->utils->convertUrl($login);

                if($this->checkAlreadyByLogin($login)){
                    $login = $this->getAnotherLogin($login);
                };

                $this->db->query("
                    INSERT INTO `public_users` (
                        `".$this->db->quote($id_row)."`,
                        `name`,
                        `login`,
                        `reg_date`
                    ) VALUES (
                        '".$this->db->quote($fields['uid'])."',
                        '".$this->db->quote($name)."',
                        '".$this->db->quote($login)."',
                        NOW()
                    )
                ");

                $new_user_id = $this->db->getMysqlInsertId();

                $query = "
                    SELECT
                        ".$this->getFields().",
                        COUNT(`events`.`id`) AS `new_events_count`
                    FROM
                        `public_users`
                    LEFT JOIN
                        `events` ON (`events`.`user_id` = `public_users`.`id` && `events`.`active` = 1)
                    WHERE
                        `public_users`.`id` = ".intval($new_user_id)."
                    LIMIT 1
                ";

                $this->forceLogin($this->db->assocItem($query));
                header('Location: /control');
            };
        };
    }

    public function oauthVK($type = 'auth'){
        $oauth_client_id      = '3122226';
        $oauth_secure_key     = 'boPWbfhxxPdmbjt6zyp2';
        $oauth_scope          = '';

        if($type == 'auth'){
            $redirect_uri         = 'http://'.$_SERVER['HTTP_HOST'].'/control/auth/login/?oauth&provider=vk&step=receive_code&';
        }elseif($type == 'bind'){
            $redirect_uri         = 'http://'.$_SERVER['HTTP_HOST'].'/control/user/security/?action=bind_oauth&provider=vk&step=receive_code&';
        };

        if(isset($_GET['error'])){
            $this->showOAuthError($_GET['error'], $_GET['error_description']);

        }else{
            switch($_GET['step']){
                case 'auth' : {
                    $this->doGetRequest('http://oauth.vk.com/authorize', array(
                        'client_id'     => $oauth_client_id,
                        'scope'         => $oauth_scope,
                        'response_type' => 'code',
                        'redirect_uri'  => $redirect_uri
                    ));
                }; break;

                case 'receive_code' : {
                    $response = $this->readGetRequest('https://oauth.vk.com/access_token', array(
                        'client_id'     => $oauth_client_id,
                        'client_secret' => $oauth_secure_key,
                        'code'          => $_GET['code'],
                        'redirect_uri'  => $redirect_uri
                    ));

                    if(isset($response->error)){
                        $this->showOAuthError($response->error, $response->error_description);
                    }else{
                        $response = $this->readGetRequest('https://api.vk.com/method/getProfiles', array(
                            'fields'        => 'uid,first_name,last_name,nickname,domain,sex,bdate,city,country,timezone,photo,photo_medium,photo_big,has_mobile,contacts',
                            'uid'           => $response->user_id,
                            'access_token'  => $response->access_token
                        ));

                        if($response){
                            if(isset($response->error->error_code)){
                                $this->showOAuthError($response->error->error_code, $response->error->error_msg);
                            }else{
                                $data = $response->response[0];

                                if($type == 'auth'){
                                    $this->registerFromOAuth('vk', array(
                                        'uid'               => $data->uid,
                                        'first_name'        => $data->first_name,
                                        'last_name'         => $data->last_name,
                                        'name'              => $data->nickname,
                                        'login'             => $data->nickname,
                                        'sex'               => $data->sex,
                                        'bdate'             => date("Y-m-d H:i:s", strtotime($data->bdate))
                                    ));

                                    header("Location: http://".$_SERVER['HTTP_HOST'].'/control');

                                }elseif($type == 'bind'){
                                    $this->bindOAuth('vk', array(
                                        'uid'               => $data->uid
                                    ));

                                    header("Location: http://".$_SERVER['HTTP_HOST'].'/control/user/security');
                                };
                            };
                        };
                    };

                }; break;
            };
        };
    }

    public function oauthFB($type = 'auth'){
        $oauth_client_id      = '410104775715619';
        $oauth_secure_key     = '1bf606af6afd1286aadfd510fca8dd94';
        $oauth_scope          = '';

        if($type == 'auth'){
            $redirect_uri         = 'http://'.$_SERVER['HTTP_HOST'].'/control/auth/login?oauth&provider=fb';
        }elseif($type == 'bind'){
            $redirect_uri         = 'http://'.$_SERVER['HTTP_HOST'].'/control/user/security/?action=bind_oauth&provider=fb';
        };

        if(!isset($_GET["code"])){
            $this->doGetRequest('http://www.facebook.com/dialog/oauth', array(
                'client_id'     => $oauth_client_id,
                'scope'         => $oauth_scope,
                'redirect_uri'  => $redirect_uri
            ));
        }else{
            $access_token = $this->readGetRequest('https://graph.facebook.com/oauth/access_token', array(
                'client_id'     => $oauth_client_id,
                'redirect_uri'  => $redirect_uri,
                'client_secret' => $oauth_secure_key,
                'code'          => $_GET["code"]
            ), false);

            $graph_url = "https://graph.facebook.com/me?" . $access_token;
            $data = json_decode(file_get_contents($graph_url));

            if($data->gender == 'male'){
                $sex = '2';
            }elseif($data->gender == 'female'){
                $sex = '1';
            };

            if($type == 'auth'){
                $this->registerFromOAuth('fb', array(
                    'uid'               => $data->id,
                    'first_name'        => $data->first_name,
                    'last_name'         => $data->last_name,
                    'name'              => $data->name,
                    'login'             => $data->username,
                    'sex'               => $sex,
                    'bdate'             => date("Y-m-d H:i:s", strtotime($data->birthday))
                ));

                header("Location: http://".$_SERVER['HTTP_HOST'].'/control');
            }elseif($type == 'bind'){
                $this->bindOAuth('fb', array(
                    'uid'               => $data->id
                ));

                header("Location: http://".$_SERVER['HTTP_HOST'].'/control/user/security');
            };
        };
    }

    private function oauthTW(){
        $consumer_key       =   '4I58PJ3HvVSunPUrmAgcA';
        $consumer_secret    =   'ydK4nFQYqnyOrCLNfQMgFjaK3HUgdhaREzRaiefiQ9M';
        $url_callback       =   'http://dev.cartrek.ru/control/auth/login?oauth&provider=tw';

        $url_request_token  =   'https://api.twitter.com/oauth/request_token';
        $url_authorize      =   'https://api.twitter.com/oauth/authorize';
        $url_access_token   =   'https://api.twitter.com/oauth/access_token';
        $url_account_data   =   'http://twitter.com/users/show';

        $oauth_nonce = md5(uniqid(rand(), true));

        // время когда будет выполняться запрос (в секундых)
        $oauth_timestamp = time(); // 1310727371

        $oauth_base_text = "GET&";
        $oauth_base_text .= urlencode($url_request_token)."&";
        $oauth_base_text .= urlencode("oauth_callback=".urlencode($url_callback)."&");
        $oauth_base_text .= urlencode("oauth_consumer_key=".$consumer_secret."&");
        $oauth_base_text .= urlencode("oauth_nonce=".$oauth_nonce."&");
        $oauth_base_text .= urlencode("oauth_signature_method=HMAC-SHA1&");
        $oauth_base_text .= urlencode("oauth_timestamp=".$oauth_timestamp."&");
        $oauth_base_text .= urlencode("oauth_version=1.0");

        $key = $consumer_secret."&";

        $oauth_signature = base64_encode(hash_hmac("sha1", $oauth_base_text, $key, true));


        $url = $url_request_token;
        $url .= '?oauth_callback='.urlencode($url_callback);
        $url .= '&oauth_consumer_key='.$consumer_key;
        $url .= '&oauth_nonce='.$oauth_nonce;
        $url .= '&oauth_signature='.urlencode($oauth_signature);
        $url .= '&oauth_signature_method=HMAC-SHA1';
        $url .= '&oauth_timestamp='.$oauth_timestamp;
        $url .= '&oauth_version=1.0';

        $response = file_get_contents($url);

        print($response);
    }
};