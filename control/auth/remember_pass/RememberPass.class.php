<?php
    Class RememberPass extends Core {
        public function __construct(){
            parent::__construct();

            $this->init(array(
                'name'      => 'remember_pass',
                'title'     => 'Восстановление пароля',
                'dir'       => '/control/auth/remember_pass',
                'bgclass'   => 'city'
            ));

            if($this->ajax_mode){
                switch($_GET['action']){
                    case 'remember_pass' : {
                        print json_encode($this->auth->remember($_POST['login']));
                    }; break;
                };

                exit;
            };
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>