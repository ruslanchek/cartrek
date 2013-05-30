<?php

Class Statistics extends Core
{
    public $fleet_id = 0;

    public function __construct()
    {
        parent::__construct();

        $this->init(array(
            'name' => 'statistics',
            'title' => 'Статистика',
            'dir' => '/control/statistics'
        ));

        if ($this->ajax_mode) {
            switch ($_GET['action']) {
                case 'getDivicesPositions' :
                {
                    header('Content-type: application/json');
                    //print json_encode($this->devices->getUserDevices()); //TODO: можно оптимизировать!
                }
                    break;

                case 'setDivicesSorting' :
                {
                    //$this->setDivicesSorting();
                }
                    break;
            }

            exit;
        }

        $this->template = 'statistics.tpl';
    }

    public function __destruct()
    {
        $this->deInit();
    }
}