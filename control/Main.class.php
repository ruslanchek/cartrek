<?php
    Class Main extends Core {
        public function __construct(){
            parent::__construct();

            if(!$this->auth->user_status['status']){
                header('Location: /control/auth/login');
            };

            $this->init(array(
                'name'  => 'main',
                'title' => 'Пользователь',
                'dir'   => '/control'
            ));
        }

        public function __destruct(){
            $this->deInit();
        }

        //Get complete list of user's cars
        public function getUserDevices(){
            $query = "
                SELECT
                    `id`,
                    `secret`,
                    `name`,
                    `model`,
                    `make`,
                    `g_id`,
                    `color`
                FROM
                    `devices`
                WHERE
                    `user_id` = 1
            ";

            return $this->db->assocMulti($query);
        }
    };
?>