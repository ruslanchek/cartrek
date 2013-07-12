<?php

error_reporting(0);

Class Payment extends Core
{
    private
        $account_id = '41534771',
        $test_mode = '1',
        $data_integrity_code = 'KJSKJ21KEUWNFMKKEJRX44',
        $currency = 'RUB';

    public function __construct()
    {
        parent::__construct();
    }

    private function generateTransactionDescription()
    {
        return 'Оплата лицевого счета пользователя ' . $this->auth->user['data']['login'] . ' в системе Картрек';
    }

    public function deleteUnclosedTransactions()
    {
        $query = "
           DELETE FROM
               `transactions`
           WHERE
               `user_id` = " . intval($this->auth->user['data']['id']) . " &&
               `status` = 0
       ";

        $this->db->query($query);
    }

    public function updateTransaction($id, $data)
    {
        if (is_array($data) && !empty($data) && count($data) > 0) {
            $set = "";

            foreach ($data as $item) {
                $set .= "`" . $item->key . "` = '" . $this->db->quote($item->value) . "',";
            }

            $set = substr($set, 0, strlen($set) - 1);

            $query = "
                UPDATE
                    `transactions`
                SET
                    " . $set . "
                WHERE
                    `id`        = " . intval($id);

            $this->db->query($query);
        }
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

    public function initTransaction()
    {
        $transaction_id = $this->createTransaction();
        $transaction_data = new stdClass();

        $transaction_data->MNT_ID = $this->account_id;
        $transaction_data->MNT_TRANSACTION_ID = $transaction_id;
        $transaction_data->MNT_CURRENCY_CODE = $this->currency;
        $transaction_data->MNT_TEST_MODE = $this->test_mode;
        $transaction_data->MNT_DESCRIPTION = $this->generateTransactionDescription();
        $transaction_data->MNT_AMOUNT = '1.00';

        #$transaction_data->MNT_CUSTOM1         = '';
        #$transaction_data->MNT_CUSTOM2         = '';
        #$transaction_data->MNT_CUSTOM3         = '';

        #$transaction_data->MNT_SUCCESS_URL     = '';
        #$transaction_data->MNT_FAIL_URL        = '';

        $transaction_data->MNT_SIGNATURE =
            md5(
                $transaction_data->MNT_ID .
                    $transaction_data->MNT_TRANSACTION_ID .
                    $transaction_data->MNT_AMOUNT .
                    $transaction_data->MNT_CURRENCY_CODE .
                    $transaction_data->MNT_TEST_MODE .
                    $this->data_integrity_code
            );

        return $transaction_data;
    }

    public function getTransaction($transaction_id)
    {
        $query = "
           SELECT * FROM
               `transactions`
           WHERE
               `id` = " . intval($transaction_id);

        return (object)$this->db->assocItem($query);
    }

    public function pay()
    {
        if (isset($_POST['MNT_ID']) && isset($_POST['MNT_TRANSACTION_ID']) && isset($_POST['MNT_OPERATION_ID'])
            && isset($_POST['MNT_AMOUNT']) && isset($_POST['MNT_CURRENCY_CODE']) && isset($_POST['MNT_TEST_MODE'])
            && isset($_POST['MNT_SIGNATURE'])
        ) {
            $mnt_sugnature = md5("{$_POST['MNT_ID']}{$_POST['MNT_TRANSACTION_ID']}{$_POST['MNT_OPERATION_ID']}{$_POST['MNT_AMOUNT']}{$_POST['MNT_CURRENCY_CODE']}{$_POST['MNT_TEST_MODE']}" . $this->data_integrity_code);

            if ($_POST['MNT_SIGNATURE'] == $mnt_sugnature) {
                $order_id = $_POST['MNT_TRANSACTION_ID'];

                $order = $this->getTransaction($order_id);

                if ($order) {
                    if ($order->status == 1) {
                        // Нельзя оплатить уже оплаченный заказ
                        die('FAIL');
                    } else {
                        ////////////////////////////////////
                        // Проверка суммы платежа
                        ////////////////////////////////////

                        // Сумма, которую заплатил покупатель. Дробная часть отделяется точкой.
                        $amount = $_POST['MNT_AMOUNT'];

                        // Сумма заказа
                        $order_amount = round($order->amount, 2);

                        // Должна быть равна переданной сумме
                        if ($order_amount != $amount || $amount <= 0) {
                            die('FAIL');
                        } else {
                            // Установим статус оплачен
                            $this->updateTransaction($order->order_id, array(
                                'status' => 1,
                                'payment_date' => 'NOW()',
                                'amount' => $order_amount
                            ));

                            $order = $this->getTransaction($order_id);

                            die('SUCCESS');
                        }
                    }
                } else {
                    die('FAIL');
                }
            } else {
                die('FAIL');
            }
        } else {
            die('FAIL');
        }


        /*$transaction_data = new stdClass();

        $transaction_data->MNT_ID = @$_POST['MNT_ID'];
        $transaction_data->MNT_TRANSACTION_ID = @$_POST['MNT_TRANSACTION_ID'];
        $transaction_data->MNT_OPERATION_ID = @$_POST['MNT_OPERATION_ID'];
        $transaction_data->MNT_AMOUNT = @$_POST['MNT_AMOUNT'];
        $transaction_data->MNT_CURRENCY_CODE = @$_POST['MNT_CURRENCY_CODE'];
        $transaction_data->MNT_TEST_MODE = @$_POST['MNT_TEST_MODE'];
        $transaction_data->MNT_SIGNATURE = @$_POST['MNT_SIGNATURE'];
        $transaction_data->MNT_USER = @$_POST['MNT_USER'];
        $transaction_data->paymentSystem_unitId = @$_POST['paymentSystem.unitId'];
        $transaction_data->MNT_CORRACCOUNT = @$_POST['MNT_CORRACCOUNT'];

        #$transaction_data->MNT_CUSTOM1         = $_POST['MNT_CUSTOM1'];
        #$transaction_data->MNT_CUSTOM2         = $_POST['MNT_CUSTOM2'];
        #$transaction_data->MNT_CUSTOM3         = $_POST['MNT_CUSTOM3'];

        $signature =
            md5(
                $transaction_data->MNT_ID .
                    $transaction_data->MNT_TRANSACTION_ID .
                    $transaction_data->MNT_OPERATION_ID .
                    $transaction_data->MNT_AMOUNT .
                    $transaction_data->MNT_CURRENCY_CODE .
                    $transaction_data->MNT_TEST_MODE .
                    $this->data_integrity_code
            );

        if ($signature == $transaction_data->MNT_SIGNATURE) {
            print 'SUCCESS';
        } else {
            print 'FAIL';
        }

        $str = "============\r\n";

        foreach ($_POST as $key => $value) {
            $str .= $key . ': ' . $value . "\r\n";
        }

        $str .= 'PAYMENT SIGTEST. REC:' . $transaction_data->MNT_SIGNATURE . ', CLC:' . $signature . "\r\n";

        $this->utils->writeLogFile($str);

        exit;*/
    }

    /*public function check()
    {
        $transaction_data = new stdClass();

        $transaction_data->MNT_COMMAND = @$_POST['MNT_COMMAND'];
        $transaction_data->MNT_ID = @$_POST['MNT_ID'];
        $transaction_data->MNT_TRANSACTION_ID = @$_POST['MNT_TRANSACTION_ID'];
        $transaction_data->MNT_OPERATION_ID = @$_POST['MNT_OPERATION_ID'];
        $transaction_data->MNT_AMOUNT = @$_POST['MNT_AMOUNT'];
        $transaction_data->MNT_CURRENCY_CODE = @$_POST['MNT_CURRENCY_CODE'];
        $transaction_data->MNT_TEST_MODE = @$_POST['MNT_TEST_MODE'];
        $transaction_data->MNT_SIGNATURE = @$_POST['MNT_SIGNATURE'];
        $transaction_data->MNT_USER = @$_POST['MNT_USER'];
        $transaction_data->paymentSystem_unitId = @$_POST['paymentSystem.unitId'];
        $transaction_data->MNT_CORRACCOUNT = @$_POST['MNT_CORRACCOUNT'];

        #$transaction_data->MNT_CUSTOM1         = $_POST['MNT_CUSTOM1'];
        #$transaction_data->MNT_CUSTOM2         = $_POST['MNT_CUSTOM2'];
        #$transaction_data->MNT_CUSTOM3         = $_POST['MNT_CUSTOM3'];

        $action = '';
        $checked = false;

        $signature = md5(
            $transaction_data->MNT_ID .
                $transaction_data->MNT_TRANSACTION_ID .
                $transaction_data->MNT_OPERATION_ID .
                $transaction_data->MNT_AMOUNT .
                $transaction_data->MNT_CURRENCY_CODE .
                $transaction_data->MNT_TEST_MODE .
                $this->data_integrity_code
        );

        if ($signature == $transaction_data->MNT_SIGNATURE) {
            $action = 'notify';
            $checked = true;

        } else {
            $signature = md5(
                $transaction_data->MNT_COMMAND .
                    $transaction_data->MNT_ID .
                    $transaction_data->MNT_TRANSACTION_ID .
                    $transaction_data->MNT_CURRENCY_CODE .
                    $transaction_data->MNT_TEST_MODE .
                    $this->data_integrity_code
            );
        }

        if ($signature == $transaction_data->MNT_SIGNATURE && !$checked) {
            $action = 'check';
            $checked = true;

        } else if (!$checked) {
            $signature = md5(
                $transaction_data->MNT_COMMAND .
                    $transaction_data->MNT_ID .
                    $transaction_data->MNT_TRANSACTION_ID .
                    $transaction_data->MNT_OPERATION_ID .
                    $transaction_data->MNT_AMOUNT .
                    $transaction_data->MNT_CURRENCY_CODE .
                    $transaction_data->MNT_TEST_MODE .
                    $this->data_integrity_code
            );
        }


        if ($signature == $transaction_data->MNT_SIGNATURE && !$checked) {
            $action = 'check';
            $checked = true;
        }

        if ($checked === false) {
            exit;
        }

        $data = $this->getTransaction($transaction_data->MNT_TRANSACTION_ID);
        $result_code = '';

        if ($action == 'check') {
            switch ($data->status) {
                case '0' :
                {
                    $result_code = '402';
                }
                    break;

                case '1' :
                {
                    $result_code = '302';
                }
                    break;

                case '2' :
                {
                    $result_code = '200';
                }
                    break;

                case '3' :
                {
                    $result_code = '500';
                }
                    break;
            }

        } else if ($action == 'notify') {
            $this->updateTransaction($transaction_data->MNT_TRANSACTION_ID, array(
                'status' => '2',
                'amount' => $transaction_data->MNT_AMOUNT
            ));
        }

        header("content-type: text/xml");
        $xml = '<?xml version="1.0" encoding="UTF-8"?>
                <MNT_RESPONSE>
                   <MNT_ID>' . $this->account_id . '</MNT_ID>
                   <MNT_TRANSACTION_ID>' . $transaction_data->MNT_TRANSACTION_ID . '</MNT_TRANSACTION_ID>
                   <MNT_RESULT_CODE>' . $result_code . '</MNT_RESULT_CODE>
                   <MNT_DESCRIPTION></MNT_DESCRIPTION>
                   <MNT_AMOUNT>' . (($transaction_data->MNT_AMOUNT) ? $transaction_data->MNT_AMOUNT : '') . '</MNT_AMOUNT>
                   <MNT_SIGNATURE>' . md5($result_code . $this->account_id . $transaction_data->MNT_TRANSACTION_ID . $this->data_integrity_code) . '</MNT_SIGNATURE>
                </MNT_RESPONSE>';

        print $xml;
        exit;
    }*/
}