<?php

Class Geozones extends Core
{
    private
        $geozones_limit = 20,
        $geozones_name_maxlen = 25,
        $geozones_name_minlen = 3;

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

                case 'editGeozone' :
                {
                    header('Content-type: application/json');
                    print json_encode($this->editGeozone($_POST['id'], $_POST['active'], $_POST['name'], $_POST['notify'], $_POST['color']));
                }
                    break;

                case 'deleteGeozone' :
                {
                    $this->deleteGeozone($_GET['id']);
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

    private function deleteGeozone($id)
    {
        $query = "
            DELETE FROM
                `geozones`
            WHERE
                `id` = " . intval($id) . " &&
                `user_id` = " . intval($this->auth->user['data']['id']);

        $this->db->query($query);
    }

    private function getGeozones()
    {
        $query = "
                SELECT
                    `id`,
                    `name`,
                    `points`,
                    `notify`,
                    `active`,
                    `color`
                FROM
                    `geozones`
                WHERE
                    `user_id` = " . intval($this->auth->user['data']['id']) . "
                ORDER BY
                    `id`
                DESC";

        return $this->db->assocMulti($query);
    }

    private function getGeozone($id)
    {
        $query = "
                SELECT
                    `id`,
                    `name`,
                    `points`,
                    `notify`,
                    `active`,
                    `color`
                FROM
                    `geozones`
                WHERE
                    `user_id` = " . intval($this->auth->user['data']['id']) . " &&
                    `id` = " . intval($id);

        return $this->db->assocItem($query);
    }

    private function editGeozone($id, $active, $name, $notify, $color)
    {
        $c = $this->db->countRows('geozones', '`user_id` = ' . intval($this->auth->user['data']['id']));

        if ($c > $this->geozones_limit) {
            return array(
                'status' => false,
                'message' => 'Достигнуто максимальное количество геозон &mdash; ' . $this->geozones_limit
            );
        } elseif ($this->db->checkRowExistance('geozones', 'name', $name, array($id), ' && `user_id` = ' . intval($this->auth->user['data']['id']))) {
            return array(
                'status' => false,
                'message' => 'Геозона с таким названием уже существует'
            );
        } elseif (mb_strlen($name) < $this->geozones_name_minlen) {
            return array(
                'status' => false,
                'message' => 'Название геозоны должно состоять минимум из ' . $this->geozones_name_minlen . ' знаков'
            );
        } elseif (mb_strlen($name) > $this->geozones_name_maxlen) {
            return array(
                'status' => false,
                'message' => 'Название геозоны должно состоять максимум из ' . $this->geozones_name_maxlen . ' знаков'
            );
        }

        $query = "
                UPDATE
                    `geozones`
                SET
                    `active` = " . intval($active) . ",
                    `name` = '" . $this->db->quote($name) . "',
                    `color` = '" . $this->db->quote($color) . "',
                    `notify` = " . intval($notify) . "
                WHERE
                    `id` = " . intval($id) . " &&
                    `user_id` = " . intval($this->auth->user['data']['id']);

        $this->db->query($query);

        return array(
            'status' => true,
            'data' => (object)array(
                'id' => $id,
                'name' => $name,
                'active' => $active,
                'notify' => $notify
            ),
            'message' => 'Данные сохранены'
        );
    }

    private function addGeozone($points)
    {
        $c = $this->db->countRows('geozones', '`user_id` = ' . intval($this->auth->user['data']['id']));

        if ($c < $this->geozones_limit) {
            $query = "
                    INSERT INTO
                        `geozones`
                    SET
                        `user_id`   = " . intval($this->auth->user['data']['id']) . ",
                        `active`    = 0,
                        `points`    = '" . $this->db->quote($points) . "',
                        `notify`    = 0
                ";

            $this->db->query($query);

            $id = $this->db->getMysqlInsertId();

            $query = "
                    UPDATE
                        `geozones`
                    SET
                        `name` = 'Геозона " . intval($id) . "'
                    WHERE
                        `id` = " . intval($id) . " &&
                        `user_id` = " . intval($this->auth->user['data']['id']);

            $this->db->query($query);

            $result = $this->getGeozone($id);

            return (object) $result;
        }
    }
}