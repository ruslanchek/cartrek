<?php
Class Sms extends Core
{
    private
        $user = 'ruslanchek@gmail.com',
        $key = 'OaEwqp',
        $ssl = true,
        $sender = 'Cartrek';

    public function __construct()
    {
        parent::__construct();

        $this->init(array(
            'name' => 'sms'
        ));
    }

    public function send($phones, $message)
    {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/proto/Sms.proto.class.php';

        $api = new LittleSMS($this->user, $this->key, $this->ssl);

        $recipients = implode(",", $phones);

        // отправка СМС
        $ids = $api->messageSend($recipients, $message, $this->sender);
        if ($ids) {
            return (object)array(
                'status' => true,
                'ids' => $ids
            );
        } else {
            return (object)array(
                'status' => false,
                'response' => $api->getResponse()
            );
        }
    }
}