<?php

Class Pay extends Core
{
    public function __construct()
    {
        parent::__construct();

        if (isset($this->uri_chain[4])) {
            switch ($this->uri_chain[4]) {
                case 'pay' :
                {
                    $this->utils->writeLogFile("PAY");
                    $this->ajax_mode = true;
                    $this->payment->pay();
                    exit;
                }
                    break;

                case 'check' :
                {
                    $this->utils->writeLogFile("CHECK");
                    $this->ajax_mode = true;
                    $this->payment->check();
                    exit;
                }
                    break;

                case 'fail' :
                {
                    $this->utils->writeLogFile("FAIL");
                    $this->initView();
                }
                    break;

                case 'success' :
                {
                    $this->utils->writeLogFile("SUCCESS");
                    $this->initView();
                }
                    break;
            }

        } else if ($this->auth->user['status']) {
            $this->initView();

        } else {
            $this->auth->redirect();
        }
    }

    public function __destruct()
    {
        $this->deInit();
    }

    private function initView()
    {
        $this->payment->deleteUnclosedTransactions();

        $this->template = 'user.tpl';

        $this->init(array(
            'name' => 'user.billing.pay',
            'title' => 'Оплата',
            'dir' => '/control/user/billing/pay'
        ));

        $transaction_data = $this->payment->initTransaction();
        $this->smarty->assign('transaction_data', $transaction_data);
    }
}