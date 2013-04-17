<?php

Class Pay extends Core {
    public function __construct(){
        parent::__construct();

        if(!$this->auth->user['status']){
            header('Location: /control/auth/login');
        };

        $this->template = 'user.tpl';

        $this->init(array(
            'name'  => 'user.billing.pay',
            'title' => 'Оплата',
            'dir'   => '/control/user/billing/pay'
        ));
    }

    public function __destruct(){
        $this->deInit();
    }

    private function monetaRu(){
        require_once 'monetaru/MonetaWebService.php';

        // Здесь указан тестовый URL (рабочий https://www.moneta.ru/services.wsdl)
        // Также нужно указать логин и пароль
        $service = new MonetaWebService("https://demo.moneta.ru/services.wsdl", "test@moneta.ru", "password");

        try {
            // получить данные счета
            $response = $service->FindAccountById(10999);

            echo "Current balance:\n";
            echo "balance: {$response->account->availableBalance}\n";
            echo "currency: {$response->account->currency}\n\n";

            // перевод

            $mtr = new MonetaTransferRequest(); //MonetaTransactionRequestType();
            $mtr->amount = 10;
            $mtr->payee = 12345678;
            $mtr->payer = 10999;
            $mtr->paymentPassword = "12345";

            $trt = $service->Transfer($mtr);

            // данные транзакции
            echo "Transfer result:\n";
            echo "status: {$trt->status}\n";
            echo "date: {$trt->dateTime}\n";
            echo "trxId: {$trt->transaction}\n\n";


            // проверить данные счета
            $response = $service->FindAccountById(10999);
            echo "Balance after transfer:\n";
            echo "balance: {$response->account->availableBalance}\n";
            echo "currency: {$response->account->currency}\n";

        } catch (Exception $e){
            echo $e->getMessage();
            echo $e->getTraceAsString();
        };
    }
};