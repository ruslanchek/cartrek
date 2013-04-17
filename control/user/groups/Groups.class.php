<?php

Class Groups extends Core
{
    public function __construct()
    {
        parent::__construct();

        if (!$this->auth->user['status']) {
            header('Location: /control/auth/login');
        }

        $this->template = 'user.tpl';

        $this->init(array(
            'name' => 'user.groups',
            'title' => 'Группы',
            'dir' => '/control/user/groups'
        ));

        if ($this->ajax_mode && isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'addNewFleet' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->devices->addNewFleet($_POST['name']));
                }
                    break;

                case 'editFleet' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->devices->editFleetData($_POST['id'], $_POST['name']));
                }
                    break;

                case 'deleteFleet' : {
                    $this->devices->deleteFleet($_GET['id']);
                }
                    break;
            }

            exit;
        } else {
            $this->createAdditionalButton('Добавить группу', '#');
        }
    }

    public function __destruct()
    {
        $this->deInit();
    }
}