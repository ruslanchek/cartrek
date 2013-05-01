<?php
Class Sms extends Core
{
    public function __construct()
    {
        parent::__construct();

        $this->init(array(
            'name' => 'sms'
        ));
    }

    public function send($message, $phones, $timezone)
    {
        $date = date('HH:MM:ss, dd-mm-yy');

        $message = $message . ' (' . $date . ')';
    }
}