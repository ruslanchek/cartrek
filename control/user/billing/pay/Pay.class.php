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

    private function createTransactionId(){
        return md5(md5(rand(rand(0, 750000), rand(750001, 9000000))));
    }

    private function createTransaction(){
        $transaction_id = $this->createTransaction();

        $query = "
            INSERT INTO `transactions` (
                `user_id`,
                `transaction_id`
            ) VALUES (
                " . intval($this->auth->user['data']['id']) . ",
                " . $this->db->quote($transaction_id) . "
            )
        ";

        $this->db->query($query);


    }
}