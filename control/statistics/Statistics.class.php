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
                case 'getUserFleetsAndDevices' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->devices->getUserFleetsAndDevices());
                }
                    break;

                case 'getStatistics' :
                {
                    header('Content-type: application/json');
                    $this->devices->setCurrentDate($_GET['date']);
                    print json_encode($this->devices->getPoints($_GET['device_id'], false));
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