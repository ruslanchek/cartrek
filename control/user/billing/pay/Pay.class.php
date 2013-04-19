<?php

Class Pay extends Core
{
    private
        $account_id = '41534771',
        $login = 'ruslan@fortyfour.ru',
        $password = 'Loopusinfabula',
        $payment_password = '71462',
        $data_integrity_code = 'KJSKJ21KEUWNFMKKEJRX44',
        $currency = 'RUB';


    public function __construct()
    {
        parent::__construct();

        if(isset($_GET['action'])){
            switch($_GET['action']){
                case 'pay' : {
                    $this->ajax_mode = true;
                    $this->pay();
                } break;

                case 'check' : {
                    $this->ajax_mode = true;
                    $this->check();
                } break;

                case 'fail' : {

                } break;

                case 'success' : {

                } break;
            }

        }else{
            if($this->auth->user['status']){
                $this->initView();
                $this->initTransaction();
            };
        }
    }

    public function __destruct()
    {
        $this->deInit();
    }

    private function initView(){
        $this->template = 'user.tpl';

        $this->init(array(
            'name' => 'user.billing.pay',
            'title' => 'Оплата',
            'dir' => '/control/user/billing/pay'
        ));

        $this->deleteUnclosedTransactions();
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

    private function initTransaction()
    {
        $transaction_id = $this->createTransaction();
        $transaction_data = new stdClass();

        $transaction_data->MNT_ID               = $this->account_id;
        $transaction_data->MNT_TRANSACTION_ID   = $transaction_id;
        $transaction_data->MNT_CURRENCY_CODE    = $this->currency;
        $transaction_data->MNT_TEST_MODE        = '1';
        $transaction_data->MNT_DESCRIPTION      = $this->generateTransactionDescription($transaction_id);
        $transaction_data->MNT_AMOUNT           = '1.00';

        #$transaction_data->MNT_CUSTOM1         = '';
        #$transaction_data->MNT_CUSTOM2         = '';
        #$transaction_data->MNT_CUSTOM3         = '';

        #$transaction_data->MNT_SUCCESS_URL     = '';
        #$transaction_data->MNT_FAIL_URL        = '';

        $transaction_data->MNT_SIGNATURE        =
        md5(
            $transaction_data->MNT_ID.
            $transaction_data->MNT_TRANSACTION_ID.
            $transaction_data->MNT_AMOUNT.
            $transaction_data->MNT_CURRENCY_CODE.
            $transaction_data->MNT_TEST_MODE.
            $this->data_integrity_code
        );

        $this->smarty->assign('transaction_data', $transaction_data);
    }

    private function getTransaction($transaction_id){
        $query = "
            SELECT * FROM
                `transactions`
            WHERE
                `id` = " . intval($transaction_id);

        return $this->db->assocItem($query);
    }

    private function pay(){
        $transaction_data = new stdClass();

        $transaction_data->MNT_ID               = @$_POST['MNT_ID'];
        $transaction_data->MNT_TRANSACTION_ID   = @$_POST['MNT_TRANSACTION_ID'];
        $transaction_data->MNT_OPERATION_ID     = @$_POST['MNT_OPERATION_ID'];
        $transaction_data->MNT_AMOUNT           = @$_POST['MNT_AMOUNT'];
        $transaction_data->MNT_CURRENCY_CODE    = @$_POST['MNT_CURRENCY_CODE'];
        $transaction_data->MNT_TEST_MODE        = @$_POST['MNT_TEST_MODE'];
        $transaction_data->MNT_SIGNATURE        = @$_POST['MNT_SIGNATURE'];
        $transaction_data->MNT_USER             = @$_POST['MNT_USER'];
        $transaction_data->paymentSystem_unitId = @$_POST['paymentSystem.unitId'];
        $transaction_data->MNT_CORRACCOUNT      = @$_POST['MNT_CORRACCOUNT'];

        #$transaction_data->MNT_CUSTOM1         = $_POST['MNT_CUSTOM1'];
        #$transaction_data->MNT_CUSTOM2         = $_POST['MNT_CUSTOM2'];
        #$transaction_data->MNT_CUSTOM3         = $_POST['MNT_CUSTOM3'];

        $transaction_data->MNT_SIGNATURE        =
        md5(
            $transaction_data->MNT_ID.
            $transaction_data->MNT_TRANSACTION_ID.
            $transaction_data->MNT_OPERATION_ID.
            $transaction_data->MNT_AMOUNT.
            $transaction_data->MNT_CURRENCY_CODE.
            $transaction_data->MNT_TEST_MODE.
            $this->data_integrity_code
        );

        print 'SUCCESS';
    }

    private function check(){
        $transaction_data = new stdClass();

        $transaction_data->MNT_COMMAND          = @$_POST['MNT_COMMAND'];
        $transaction_data->MNT_ID               = @$_POST['MNT_ID'];
        $transaction_data->MNT_TRANSACTION_ID   = @$_POST['MNT_TRANSACTION_ID'];
        $transaction_data->MNT_OPERATION_ID     = @$_POST['MNT_OPERATION_ID'];
        $transaction_data->MNT_AMOUNT           = @$_POST['MNT_AMOUNT'];
        $transaction_data->MNT_CURRENCY_CODE    = @$_POST['MNT_CURRENCY_CODE'];
        $transaction_data->MNT_TEST_MODE        = @$_POST['MNT_TEST_MODE'];
        $transaction_data->MNT_SIGNATURE        = @$_POST['MNT_SIGNATURE'];
        $transaction_data->MNT_USER             = @$_POST['MNT_USER'];
        $transaction_data->paymentSystem_unitId = @$_POST['paymentSystem.unitId'];
        $transaction_data->MNT_CORRACCOUNT      = @$_POST['MNT_CORRACCOUNT'];

        #$transaction_data->MNT_CUSTOM1         = $_POST['MNT_CUSTOM1'];
        #$transaction_data->MNT_CUSTOM2         = $_POST['MNT_CUSTOM2'];
        #$transaction_data->MNT_CUSTOM3         = $_POST['MNT_CUSTOM3'];

        $transaction_data->MNT_SIGNATURE        =
        md5(
            $transaction_data->MNT_COMMAND.
            $transaction_data->MNT_ID.
            $transaction_data->MNT_TRANSACTION_ID.
            $transaction_data->MNT_OPERATION_ID.
            $transaction_data->MNT_AMOUNT.
            $transaction_data->MNT_CURRENCY_CODE.
            $transaction_data->MNT_TEST_MODE.
            $this->data_integrity_code
        );

        header ("content-type: text/xml");
        print  '<?xml version="1.0" encoding="UTF-8"?>
                <MNT_RESPONSE>
                    <MNT_ID>' . $this->account_id . '</MNT_ID>
                    <MNT_TRANSACTION_ID>' . $transaction_data->MNT_TRANSACTION_ID . '</MNT_TRANSACTION_ID>
                    <MNT_RESULT_CODE>' . $transaction_data->MNT_RESULT_CODE . '</MNT_RESULT_CODE>
                    <MNT_DESCRIPTION>' . $transaction_data->MNT_DESCRIPTION . '</MNT_DESCRIPTION>
                    <MNT_AMOUNT>' . $transaction_data->MNT_TRANSACTION_ID . '</MNT_AMOUNT>
                    <MNT_SIGNATURE>' . $transaction_data->MNT_SIGNATURE . '</MNT_SIGNATURE>
                </MNT_RESPONSE>';
    }
}