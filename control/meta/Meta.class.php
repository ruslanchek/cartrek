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

        header('Content-Type: application/x-javascript');

        $str = "
            var global_params = {};
        ";

        if($this->auth->user['data']['user_timezone']){
            $str .= "
                global_params.timezone = {
                    name: '".$this->auth->user['data']['user_timezone']."',
                    offset: ".($this->params->tz_offset / 60)."
                };
            ";
        }

        print $str;
    }

    public function __destruct()
    {
        $this->deInit();
    }
}