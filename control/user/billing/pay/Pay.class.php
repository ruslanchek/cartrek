<?php

Class Pay extends Core
{
    private $account_id = 41534771,
        $login = 'ruslan@fortyfour.ru',
        $password = 'Loopusinfabula',
        $payment_password = '71462';


    public function __construct()
    {
        parent::__construct();

        if (!$this->auth->user['status']) {
            header('Location: /control/auth/login');
        }
        ;

        $this->template = 'user.tpl';

        $this->init(array(
            'name' => 'user.billing.pay',
            'title' => 'Оплата',
            'dir' => '/control/user/billing/pay'
        ));
    }

    public function __destruct()
    {
        $this->deInit();
    }


}