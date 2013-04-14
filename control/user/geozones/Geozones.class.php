<?php

Class Geozones extends Core
{
    public function __construct()
    {
        parent::__construct();

        if (!$this->auth->user['status']) {
            header('Location: /control/auth/login');
        }

        $this->template = 'user.tpl';

        $this->init(array(
            'name' => 'user.geozones',
            'title' => 'Геозоны',
            'dir' => '/control/user/geozones'
        ));

        if ($this->ajax_mode && isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'getGeozones' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->getGeozones());
                }
                    break;

                case 'addGeozone' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->addGeozone($_POST['points']));
                }
                    break;
            }

            exit;
        }
    }

    public function __destruct()
    {
        $this->deInit();
    }

    private function getGeozones()
    {
        $query = "
                SELECT
                    `id`,
                    `name`,
                    `points`
                FROM
                    `geozones`
                WHERE
                    `user_id` = " . intval($this->auth->user['data']['id']) . " &&
                    `active` = 1
            ";

        return $this->db->assocMulti($query);
    }

    private function addGeozone($points)
    {
        $query = "
                INSERT INTO
                    `geozones`
                SET
                    `user_id`   = " . intval($this->auth->user['data']['id']) . ",
                    `active`    = 1,
                    `points`    = '" . $this->db->quote($points) . "'
            ";

        $this->db->query($query);
        $result = new stdClass();

        $result->id = $this->db->getMysqlInsertId();
        $result->name = 'Geozone ' . $this->db->getMysqlInsertId();

        return $result;
    }
}