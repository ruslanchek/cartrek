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

            if(isset($_POST['action'])){
                switch($_POST['action']){
                    case 'remember_pass' : {
                        $this->module['form'] = $this->auth->remember($_POST['login']);
                    }; break;
                };
            };
        }

        public function __destruct(){
            $this->deInit();
        }
    };
?>