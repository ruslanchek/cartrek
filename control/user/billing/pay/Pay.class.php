<?php

Class Pay extends Core
{
    private
        $account_id = 41534771,
        $login = 'ruslan@fortyfour.ru',
        $password = 'Loopusinfabula',
        $payment_password = '71462',
        $data_integrity_code = 'KJSKJ21KEUWNFMKKEJRX44',
        $currency = 'RUB';


    public function __construct()
    {
        parent::__construct();

        $this->template = 'user.tpl';

        $this->init(array(
            'name' => 'user.billing.pay',
            'title' => 'Оплата',
            'dir' => '/control/user/billing/pay'
        ));

        $this->deleteUnclosedTransactions();

        if(isset($_GET['action'])){

            switch($_GET['action']){
                case 'pay' : {

                } break;

                case 'check' : {

                } break;

                case 'fail' : {

                } break;

                case 'success' : {

                } break;
            }

        }else{
            $this->createTransaction();
        };
    }

    public function __destruct()
    {
        $this->deInit();
    }

    private function generateTransactionDescription($transaction_id)
    {
        return 'Оплата лицевого счета №' . $transaction_id . ' пользователя ' . $this->auth->user['data']['login'] . ' в системе Картрек';
    }

    private function deleteUnclosedTransactions(){
        $query = "
            DELETE FROM
                `transactions`
            WHERE
                `user_id` = " . intval($this->auth->user['data']['id']) . " &&
                `status` = 0
        ";

        $this->db->query($query);
    }

    private function createTransaction()
    {
        $query = "
            INSERT INTO `transactions` (
                `user_id`
            ) VALUES (
                " . intval($this->auth->user['data']['id']) . "
            )
        ";

        $this->db->query($query);

        return $this->db->getMysqlInsertId();
    }

    private function createTransactionSignature()
    {
        if(
            $this->transaction_data->MNT_ID &&
            $this->transaction_data->MNT_TRANSACTION_ID &&
            $this->transaction_data->MNT_AMOUNT &&
            $this->transaction_data->MNT_CURRENCY_CODE &&
            $this->transaction_data->MNT_TEST_MODE &&
            $this->data_integrity_code
        ){
            return md5(
                $this->transaction_data->MNT_ID.
                $this->transaction_data->MNT_TRANSACTION_ID.
                $this->transaction_data->MNT_AMOUNT.
                $this->transaction_data->MNT_CURRENCY_CODE.
                $this->transaction_data->MNT_TEST_MODE.
                $this->data_integrity_code
            );
        }
    }

    public function initTransaction()
    {
        $transaction_id = $this->createTransaction();
        $transaction_data = new stdClass();

        $transaction_data->MNT_ID               = $transaction_id;
        $transaction_data->MNT_TRANSACTION_ID   = $this->account_id;
        $transaction_data->MNT_CURRENCY_CODE    = $this->currency;
        $transaction_data->MNT_TEST_MODE        = '1';
        $transaction_data->MNT_DESCRIPTION      = $this->generateTransactionDescription($transaction_id);
        $transaction_data->MNT_AMOUNT           = '1.00';

        #$transaction_data->MNT_CUSTOM1         = '';
        #$transaction_data->MNT_CUSTOM2         = '';
        #$transaction_data->MNT_CUSTOM3         = '';

        #$transaction_data->MNT_SUCCESS_URL     = '';
        #$transaction_data->MNT_FAIL_URL        = '';

        $transaction_data->MNT_SIGNATURE        = $this->createTransactionSignature();

        $this->smarty->assign('transaction_data', $transaction_data);
    }
}