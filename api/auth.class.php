<?php
	class Login extends Core{
		public
            $user_status;

        private
            $session_time,
            $addition_fields,
            $password_length;

        function __construct($core, $af){
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
                'fb_id'
            );

            $this->password_length = 6;

            $this->addition_fields = $af;

            $this->core = $core;
            $this->session_time = 60*60*12;
            
            $this->checkLogin();

            unset(
                $this->user_status['userdata']['password'],
                $this->user_status['userdata']['hash']
            );
        }

        //Get fields for user data
        private function getFields(){
            $result = '';

            foreach($this->fields as $items){
                $result .= '`'.$items.'`,';
            };

            foreach($this->addition_fields as $items){
                $result .= '`'.$items.'`,';
            };

            $result = substr($result, 0, strlen($result)-1);

            return $result;
        }

        //User authenticate
        public function forceLogin($data){
            $hash = md5(Utilities::getUniqueCode(10));

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

            $this->core->db->query($query);

            setcookie("id", $data['id'], time() + $this->session_time, "/");
            setcookie("hash", $hash, time() + $this->session_time, "/");

            $this->user_status['status'] = true;
            $this->user_status['message'] = 'Вы успешно авторизовались';
            $this->user_status['userdata'] = $data;
            $this->getUserSharedAccauntStatus();
        }

        //Set currently user activity
        private function setActivity(){
			$this->core->db->query("
			    UPDATE
			        `public_users`
			    SET
			        `last_activity` = NOW(),
			        `online` = '1'
			    WHERE
			        `id` = '".$this->user_status['userdata']['id']."'
			");
		}

        //Check user status
        private function checkLogin(){
            $query = "
                SELECT
                    ".$this->getFields()."
                FROM
                    `public_users`
                WHERE
                    `id` = '".intval($_COOKIE['id'])."'
                LIMIT 1
            ";

            $data = mysql_fetch_assoc($this->core->db->query($query));
            $interval = Utilities::datetimeToSeconds(date('Y-m-d H:i:s')) - Utilities::datetimeToSeconds($data['last_activity']);

            if($interval > $this->session_time){
                $this->exitUser();

            }else{
                if(($data['hash'] == $_COOKIE['hash'] && $data['id'] == $_COOKIE['id']) && !empty($data)){
                    $this->user_status['status']    = true;
                    $this->user_status['message']   = "Autherized";
                    $this->user_status['userdata']  = $data;
                    $this->getUserSharedAccauntStatus();

                    $this->setActivity();

                }else{
                    setcookie("id", "", time() - $this->session_time, "/");
                    setcookie("hash", "", time() - $this->session_time, "/");

                    $this->user_status['status'] = false;
                    $this->user_status['message'] = 'Autherization required';
                };
            };
        }

        //Check if user from a shared account
        private function getUserSharedAccauntStatus(){
            if(
                $this->user_status['userdata']['vk_id'] > 0 ||
                $this->user_status['userdata']['fb_id'] > 0
            ){
                $this->user_status['shared_account'] = true;
            }else{
                $this->user_status['shared_account'] = false;
            };
        }

        //Try to user autherize
        public function auth($login, $password){
            if(!$login && $password){
                $this->user_status['status'] = false;
                $this->user_status['message'] = "Вы не ввели логин";

            }elseif(!$password && $login){
                $this->user_status['status'] = false;
                $this->user_status['message'] = "Вы не ввели пароль";

            }elseif(!$password && !$login){
                $this->user_status['status'] = false;
                $this->user_status['message'] = "Вы не ввели логин и пароль";
                
            }else{
                if(Utilities::matchPattern($login, 'email')){
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

                $data = mysql_fetch_assoc($this->core->db->query($query));

                if($data['password'] === md5(md5($password))){
                    $this->forceLogin($data);
                }else{
                    $this->user_status['status'] = false;
                    $this->user_status['message'] = 'Вы ввели неправильный логин или пароль';
                };
            };           
        }

        //Exit
		public function exitUser(){
            $this->core->db->query("
			    UPDATE
			        `public_users`
			    SET
			        `hash` = '',
			        `online` = ''
			    WHERE
			        `id` = ".intval($this->user_status['userdata']['id'])."
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
                    `remember_code` = '".DB::quote($code)."'
                LIMIT 1
            ";

            $data = $this->core->db->assocItem($query);

            if($data['id'] > 0){
                $password = Utilities::getUniqueCode($this->password_length);

                $query = "
                    UPDATE
                        `public_users`
                    SET
                        `password` = '".md5(md5(trim($password)))."',
                        `remember_code` = ''
                    WHERE
                        `id` = ".intval($data['id'])."
                ";

                $this->core->db->query($query);

                $this->core->sendMail(
                    'Менеджер аккаунтов '.$_SERVER['SERVER_NAME'],
                    'account_manager@'.$_SERVER['SERVER_NAME'],
                    $data['email'],
                    'Пароль восстановлен',
                    'include/mailing/password_recover_password.tpl',
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
                if(Utilities::matchPattern($login, 'email')){
                    $query = "
                        SELECT
                            ".$this->getFields().",
                            `last_remember`
                        FROM
                            `public_users`
                        WHERE
                            `email` = '".DB::quote($login)."'
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
                            `login` = '".DB::quote($login)."'
                        LIMIT 1
                    ";
                };

                $data = $this->core->db->assocItem($query);

                if($data['id'] > 0){
                    $tl = Utilities::datetimeToSeconds($data['last_remember']);
                    $tn = Utilities::datetimeToSeconds(date('Y-m-d H:i:s'));

                    $ti = $tn - $tl;

                    if($ti > 300){
                        $code = md5(Utilities::getUniqueCode($this->password_length));



                        $query = "
                            UPDATE
                                `public_users`
                            SET
                                `remember_code` = '".$code."',
                                `last_remember` = '".DB::quote(date('Y-m-d H:i:s'))."'
                            WHERE
                                `id` = ".intval($data['id'])."
                        ";

                        $this->core->db->query($query);

                        $link = 'http://'.$_SERVER['HTTP_HOST'].'/auth/remember_pass/?action=password_recover&user_id='.$data['id'].'&code='.$code;

                        $this->core->sendMail(
                            'Менеджер аккаунтов '.$this->core->config['site_name'],
                            'account_manager@'.$this->core->config['site_name'],
                            $data['email'],
                            'Подтвердите восстановление пароля',
                            'include/mailing/password_recover_code.tpl',
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
                    if(Utilities::matchPattern($login, 'email')){
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
        public function checkAlreadyByEmail($email){
            return $this->core->db->checkRowExistance('public_users', 'email', mb_strtolower($email, "UTF-8"));
        }

        //Check user existance by login (true if present)
        public function checkAlreadyByLogin($login){
            return $this->core->db->checkRowExistance('public_users', 'login', mb_strtolower($login, "UTF-8"));
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
                    `id` = ".intval($this->user_status['userdata']['id'])."
                LIMIT 1
            ";

            $data = $this->core->db->assocItem($query);

            if($p_old && $p_new && $p_new_again){
                if($data['password'] == md5(md5(trim($p_old)))){
                    if($p_new == $p_new_again){
                        $this->core->db->query("
                            UPDATE
                                `public_users`
                            SET
                                `password` = '".DB::quote(md5(md5(trim($p_new))))."'
                            WHERE
                                `id` = ".intval($this->user_status['userdata']['id'])."
                        ");

                        $this->core->sendMail(
                            'Менеджер аккаунтов '.$_SERVER['SERVER_NAME'],
                            'account_manager@'.$_SERVER['SERVER_NAME'],
                            $this->user_status['userdata']['email'],
                            'Ваш пароль изменен',
                            'include/mailing/password_changed.tpl',
                            array(
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

        public function registerNewUser($data, $securimage){
            //Check for email is not empty
            if(!isset($data['email']) || $data['email'] == ''){
                $result = array(
                    'status' => false,
                    'message' => 'Введите e-mail'
                );
            }else{
                //Check for email is match the pattern
                if(!Utilities::matchPattern($data['email'], 'email')){
                    $result = array(
                        'status' => false,
                        'message' => 'E-mail указан неправильно'
                    );
                }else{
                    //Check for email is unique
                    if($this->checkAlreadyByEmail($data['email']) === true){
                        $result = array(
                            'status' => false,
                            'message' => 'Пользователь с таким e-mail-ом уже зарегистрирован'
                        );
                    }else{
                        //Check for captcha code is not empty
                        if(isset($data['captcha_code']) && $data['captcha_code'] != ''){

                            //Check for captcha code is ok
                            if($securimage->check($data['captcha_code']) === false){
                                $result = array(
                                    'status' => false,
                                    'message' => 'Неправильный код с картинки'
                                );
                            }else{
                                //All data is ok, doing a register
                                $login = $this->getLoginFromEmail($data['email']);

                                if($this->checkAlreadyByLogin($login)){
                                    $login = $this->getAnotherLogin($login);
                                };

                                $password = Utilities::getUniqueCode($this->password_length);

                                $this->core->db->query("
                                    INSERT INTO `public_users` (
                                        `password`,
                                        `name`,
                                        `email`,
                                        `login`,
                                        `reg_date`
                                    ) VALUES (
                                        '".DB::quote(md5(md5($password)))."',
                                        '".DB::quote($login)."',
                                        '".DB::quote($data['email'])."',
                                        '".DB::quote($login)."',
                                        NOW()
                                    )
                                ");

                                $this->core->sendMail(
                                    'Менеджер аккаунтов '.$_SERVER['SERVER_NAME'],
                                    'account_manager@'.$_SERVER['SERVER_NAME'],
                                    $data['email'],
                                    'Добро пожаловать на '.$_SERVER['SERVER_NAME'].'!',
                                    'include/mailing/register_success.tpl',
                                    array(
                                         'login' => $login,
                                         'password' => $password,
                                         'domain' => $_SERVER['SERVER_NAME']
                                    )
                                );

                                $this->auth($data['email'], $password);

                                $result = array(
                                    'status' => true,
                                    'message' => 'Спасибо, вы успешно зарегистрировались, сейчас страница обновится и вы автоматически войдете на сайт '
                                );
                            };
                        }else{
                            $result = array(
                                'status' => false,
                                'message' => 'Введите код с картинки'
                            );
                        };
                    };
                };
            };

            return $result;
        }

        /* Change user data */
        public function changeUserData($user_id){
            if(intval($user_id) > 0){
                $new_data = array(
                    'email' => $_POST['email'],
                    'login' => $_POST['login'],
                    'name' => $_POST['name']
                );

                if(!Utilities::matchPattern($new_data['email'], 'email')){
                    return array(
                        'status' => false,
                        'message' => 'E-mail указан неправильно'
                    );
                };

                if($this->core->db->checkRowExistance('public_users', 'email', mb_strtolower($new_data['email'], "UTF-8"), array($user_id)) === true){
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

                if($this->core->db->checkRowExistance('public_users', 'login', mb_strtolower($new_data['login'], "UTF-8"), array($user_id)) === true){
                    return array(
                        'status' => false,
                        'message' => 'Пользователь с логином <span>'.$new_data['login'].'</span> уже зарегистрирован'
                    );
                };

                $query = "
                    UPDATE
                        `public_users`
                    SET
                        `email` = '".DB::quote($new_data['email'])."',
                        `name` = '".DB::quote($new_data['name'])."'
                    WHERE
                        `id` = ".intval($user_id)."
                ";

                $this->core->db->query($query);

                $this->user_status['userdata']['email'] = $new_data['email'];
                $this->user_status['userdata']['login'] = $new_data['login'];
                $this->user_status['userdata']['name'] = $new_data['name'];

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
            };
        }

        private function showOAuthError($error, $error_description){
            if($error == 'access_denied'){
                header("Location: http://".$_SERVER['HTTP_HOST']);
            }else{
                $error = '<strong>Error: '.$error.'</strong>
                      <p>'.preg_replace('/\+/', ' ', $error_description).'</p>';

                die($error);
            };
        }

        private function getRequestString($url, $params){
            $parsed_params = '?';

            foreach($params as $key => $value){
                $parsed_params .= $key.'='.$value.'&';
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

        private function readGetRequest($section, $params, $json = true){
            $result = file_get_contents($this->getRequestString($section, $params));
            
            if($json){
                return json_decode($result);
            }else{
                return $result;
            };
        }

        private function registerFromOAuth($provider, $fields){
            if($fields['uid'] > 0){
                $id_row = $provider.'_id';

                if($this->core->db->checkRowExistance('public_users', $id_row, $fields['uid'])){
                    $query = "
                        SELECT
                            ".$this->getFields()."
                        FROM
                            `public_users`
                        WHERE
                            `".DB::quote($id_row)."` = '".DB::quote($fields['uid'])."'
                        LIMIT 1
                    ";

                    $this->forceLogin($this->core->db->assocItem($query));

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

                    $login = Utilities::convertUrl($login);

                    if($this->checkAlreadyByLogin($login)){
                        $login = $this->getAnotherLogin($login);
                    };

                    $this->core->db->query("
                        INSERT INTO `public_users` (
                            `".DB::quote($id_row)."`,
                            `name`,
                            `login`,
                            `reg_date`
                        ) VALUES (
                            '".DB::quote($fields['uid'])."',
                            '".DB::quote($name)."',
                            '".DB::quote($login)."',
                            NOW()
                        )
                    ");

                    $new_user_id = mysql_insert_id();

                    $query = "
                        SELECT
                            ".$this->getFields()."
                        FROM
                            `public_users`
                        WHERE
                            `id` = ".intval($new_user_id)."
                        LIMIT 1
                    ";

                    $this->forceLogin($this->core->db->assocItem($query));
                };
            };
        }

        private function oauthVK(){
            $oauth_client_id      = '2899938';
            $oauth_secure_key     = 'IX61G9joOfg8rG0F5tWb';
            $oauth_scope          = '';

            if(isset($_GET['error'])){
                $this->showOAuthError($_GET['error'], $_GET['error_description']);
                
            }else{
                switch($_GET['step']){
                    case 'auth' : {
                        $this->doGetRequest('https://api.vkontakte.ru/oauth/authorize', array(
                            'client_id'     => $oauth_client_id,
                            'scope'         => $oauth_scope,
                            'response_type' => 'code',
                            'redirect_uri'  => urlencode('http://'.$_SERVER['HTTP_HOST'].'?oauth&provider=vk&step=receive_code')
                        ));

                    }; break;

                    case 'receive_code' : {
                        $response = $this->readGetRequest('https://api.vkontakte.ru/oauth/access_token', array(
                            'client_id'     => $oauth_client_id,
                            'client_secret' => $oauth_secure_key,
                            'code'          => $_GET['code']
                        ));

                        if($response->error){
                            $this->showOAuthError($response->error, $response->error_description);
                        }else{
                            $response = $this->readGetRequest('https://api.vkontakte.ru/method/getProfiles', array(
                                'fields'        => 'uid,first_name,last_name,nickname,domain,sex,bdate,city,country,timezone,photo,photo_medium,photo_big,has_mobile,contacts',
                                'uid'           => $response->user_id,
                                'access_token'  => $response->access_token
                            ));

                            $data = $response->response[0];

                            $this->registerFromOAuth('vk', array(
                                'uid'               => $data->uid,
                                'first_name'        => $data->first_name,
                                'last_name'         => $data->last_name,
                                'name'              => $data->nickname,
                                'login'             => $data->nickname,
                                'sex'               => $data->sex,
                                'bdate'             => date("Y-m-d H:i:s", strtotime($data->bdate))
                            ));

                            header("Location: http://".$_SERVER['HTTP_HOST']);
                        };

                    }; break;
                };
            };
        }

        private function oauthFB(){
            $oauth_client_id      = '102395263228289';
            $oauth_secure_key     = '3463ac6e11e51fef2a20a7260698d6dd';
            $oauth_scope          = '';
            $redirect_uri         = urlencode('http://'.$_SERVER['HTTP_HOST'].'/?oauth&provider=fb');

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

                $this->registerFromOAuth('fb', array(
                    'uid'               => $data->id,
                    'first_name'        => $data->first_name,
                    'last_name'         => $data->last_name,
                    'name'              => $data->name,
                    'login'             => $data->username,
                    'sex'               => $sex,
                    'bdate'             => date("Y-m-d H:i:s", strtotime($data->birthday))
                ));

                header("Location: http://".$_SERVER['HTTP_HOST']);
            };
        }
    };
?>