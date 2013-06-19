<?php

Class Meta extends Core
{
    public function __construct()
    {
        parent::__construct();

        $this->ajax_mode = true;

        $this->init(array(
            'name' => 'meta',
            'title' => 'Meta',
            'dir' => '/meta'
        ));

        if(isset($_GET['json'])){
            header('Content-type: application/json');
        }else{
            header('Content-type: application/x-javascript');
        }

        $global_params = new stdClass();
        $global_params->user_logged_in = false;

        if($this->auth->user && $this->auth->user['status'] == '1'){
            $global_params->user_logged_in = true;

            $global_params->timezone = new stdClass();
            $global_params->timezone->name = $this->auth->user['data']['user_timezone'];
            $global_params->timezone->offset = $this->params->tz_offset / 60;

            $global_params->user = new stdClass();
            $global_params->user->ui_settings = json_decode($this->auth->user['data']['ui_settings']);

            $global_params->system = new stdClass();
            $global_params->system->afk_margin = $this->config->settings->afk_margin;
        }

        if(isset($_GET['json'])){
            print stripslashes(json_encode($global_params));
        }else{
            print 'var global_params = JSON.parse(\''.stripslashes(json_encode($global_params)).'\')';
        }

    }

    public function __destruct()
    {
        $this->deInit();
    }
}