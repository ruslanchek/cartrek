<?php

Class Devices extends Core
{
    public
        $current_date,
        $devices_present = false;

    private
        $fleets_limit = 20,
        $fleets_name_maxlen = 25,
        $fleets_name_minlen = 3;

    public function __construct()
    {
        parent::__construct();

        $this->checkForDevices();

        if (isset($_GET['date'])) {
            $date = $_GET['date'];
        } else {
            $date = false;
        }

        $this->setCurrentDate($date); //Сделать прием даты через AJAX
    }

    public function checkForDevices()
    {
        $query = "
                SELECT
                    COUNT(*) AS `count`
                FROM
                    `devices`
                WHERE
                    `user_id`   = " . intval($this->auth->user['data']['id']) . " &&
                    `active`    = 1 &&
                    `activated` = 1
            ";

        $result = $this->db->assocItem($query);

        if ($result['count'] >= 1) {
            $this->devices_present = true;
        }
    }

    public function updateDeviceData($id, $data)
    {
        if (is_array($data) && !empty($data) && count($data) > 0) {
            $set = "";

            foreach ($data as $item) {
                if($item->value === '1' || $item->value === '0'){
                    $set .= "`" . $item->key . "` = " . intval($item->value) . ",";
                }else{
                    $set .= "`" . $item->key . "` = '" . $this->db->quote($item->value) . "',";
                }
            }

            $set = substr($set, 0, strlen($set) - 1);

            $query = "
                    UPDATE
                        `devices`
                    SET
                        " . $set . "
                    WHERE
                        `user_id`   = " . intval($this->auth->user['data']['id']) . " &&
                        `id`        = " . intval($id);

            $this->db->query($query);
        }
    }

    public function getMinDate()
    {
        $query = "
                SELECT
                    `id`
                FROM
                    `devices`
                WHERE
                    `user_id`   = " . intval($this->auth->user['data']['id']) . " &&
                    `active`    = 1 &&
                    `activated` = 1
            ";

        $devices = $this->db->assocMulti($query);

        $in = "";

        foreach ($devices as $device) {
            $in .= "'" . $this->db->quote($device['id']) . "', ";
        }

        $in = substr($in, 0, strlen($in) - 2);

        $query = "
                SELECT
                    min(CONVERT_TZ(`datetime`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "')) AS `date`
                FROM
                    `tracks`
                WHERE
                    `device_id` IN (" . $in . ")
            ";

        $result = $this->db->assocItem($query);
        return $result['date'];
    }

    public function setCurrentDate($date = false)
    {
        if (!$date) {
            $this->current_date = date('d') . '-' . date('m') . '-' . date('Y');
        } else {
            $this->current_date = $date;
        }
    }

    //Get complete list of user's cars with last points
    public function getUserDevices($include_unactive = false)
    {
        if ($include_unactive) {
            $addition = " && `d`.`activated` = 1";
        } else {
            $addition = " && `d`.`active` = 1 && `d`.`activated` = 1";
        }

        if (isset($_GET['fleet']) && $_GET['fleet'] >= 1) {
            $addition .= " && `d`.`fleet_id` = " . intval($_GET['fleet']);
        }

        $query = "
                SELECT
                	`d`.`id`,
                	`d`.`imei`,
                	`d`.`name`,
                	`d`.`model`,
                	`d`.`make`,
                	`d`.`online`,
                	`d`.`g_id`,
                	`d`.`color`,
                	`d`.`active`,
                	`d`.`fleet_id`,
                	`d`.`extensions`,
                	CONVERT_TZ(`d`.`last_update`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "') AS `last_update`,
                	`f`.`name` AS `fleet_name`,
                	max(CONVERT_TZ(`t`.`datetime`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "')) AS `last_point_date`
                FROM
                	`devices` `d`
                LEFT JOIN
                    `fleets` `f`
                ON
                    `d`.`fleet_id` = `f`.`id` && `f`.`user_id` = " . intval($this->auth->user['data']['id']) /*. $addition TODO: What it motherfucking means??? What the hell are addition does here? */ . "
                LEFT JOIN
                    `tracks` `t`
                ON
                    `t`.`device_id` = `d`.`id`
                WHERE
                	`d`.`user_id` = " . intval($this->auth->user['data']['id']) . $addition . "
                GROUP BY
                	`d`.`id`
                ORDER BY
                	`d`.`sort` ASC
            ";

        $devices = $this->db->assocMulti($query);

        return $devices;
    }

    // TM flag - флоаг тайммашины, который указывает на то, что нужно грузить startpoint вместо endpoint в качестве текущего положения тачки
    public function getDynamicDevicesData($cars, $tm_flag)
    {
        if ($cars && count($cars) > 0) {
            $in = '';

            foreach ($cars as $car) {
                $in .= intval($car) . ",";
            }

            $in = substr($in, 0, strlen($in) - 1);

            $d = intval(substr($this->current_date, 0, 2));
            $m = intval(substr($this->current_date, 3, 2));
            $y = intval('20' . substr($this->current_date, 8, 2));

            $date_start = date("Y-m-d H-i-s", mktime(0, 0, 0, $m, $d, $y));
            $date_end = date("Y-m-d H-i-s", mktime(23, 59, 59, $m, $d, $y));

            $query = "
                    SELECT
                        `d`.`id`,
                        `d`.`hdop`,
                        `d`.`csq`,
                        `d`.`journey`,
                        `d`.`active`,
                        `d`.`online`,
                        `d`.`params`,
                        `d`.`sat_count`,
                        CONVERT_TZ(`d`.`last_update`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "') AS `last_update`
                    FROM
                        `devices` `d`
                    WHERE
                        `d`.`user_id` = " . intval($this->auth->user['data']['id']) . " &&
                        `d`.`id` IN (" . $in . ") &&
                        `d`.`activated` = 1
                    GROUP BY
                        `d`.`id`
                ";

            $devices = $this->db->assocMulti($query);

            if ($tm_flag == '1') {
                $order = 'ASC';
            } else {
                $order = 'DESC';
            }

            for ($i = 0, $l = count($devices); $i < $l; $i++) {
                $query = "
                        SELECT
                            CONVERT_TZ(`tracks`.`datetime`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "') AS `last_point_date`,
                            `tracks`.`id` AS `point_id`,
                            `tracks`.`lat`,
                            `tracks`.`lon`,
                            `tracks`.`speed`,
                            `tracks`.`heading`,
                            `tracks`.`altitude`
                        FROM
                            `tracks`
                        WHERE
                            `tracks`.`device_id` = " . intval($devices[$i]['id']) . " &&
                            `tracks`.`datetime` >= CONVERT_TZ('" . $date_start . "', 'Europe/Moscow', '" . $this->db->quote(date('P')) . "') &&
                            `tracks`.`datetime` <= CONVERT_TZ('" . $date_end . "', 'Europe/Moscow', '" . $this->db->quote(date('P')) . "')
                        ORDER BY
                            `tracks`.`datetime` " . $order . "
                        LIMIT 1
                    ";

                $track = $this->db->assocItem($query);

                if ($track) {
                    $devices[$i] = array_merge($devices[$i], $track);
                }
            }

            return $devices;
        }
    }

    //Get complete list of user's cars with last points
    public function getUserFleetsAndDevices()
    {
        $result = new StdClass();

        $result->fleets = $this->getFleetsList();
        $result->devices = $this->getUserDevices();

        return $result;
    }

    //Get data of user device, selected by id
    public function getUserDevice($id)
    {
        $query = "
                SELECT
                    `id`,
                    `imei`,
                    `name`,
                    `model`,
                    `make`,
                    `g_id`,
                    `color`,
                    `hdop`,
                    `csq`,
                    `journey`,
                    `active`,
                    `online`,
                    `extensions`,
                    `params`,
                    CONVERT_TZ(`last_update`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "') AS `last_update`
                FROM
                    `devices`
                WHERE
                    `user_id`   = " . intval($this->auth->user['data']['id']) . " &&
                    `active`    = 1 &&
                    `activated` = 1 &&
                    `id`        = " . intval($id) . "
            ";

        return $this->db->assocItem($query);
    }

    //Last registered device point
    public function getLatestDevicePoint($id, $date_related = true)
    {
        $d = intval(substr($this->current_date, 0, 2));
        $m = intval(substr($this->current_date, 3, 2));
        $y = intval('20' . substr($this->current_date, 8, 2));

        $date_start = date("Y-m-d H-i-s", mktime(0, 0, 0, $m, $d, $y));
        $date_end = date("Y-m-d H-i-s", mktime(23, 59, 59, $m, $d, $y));

        if (!$date_related) {
            $date_related_where = " && (`datetime` >= '" . $this->db->quote($date_start) . "' && `datetime` <= '" . $this->db->quote($date_end) . "')";
        } else {
            $date_related_where = "";
        }

        $query = "
                SELECT
                    `id`,
                    `lat`,
                    `lon`,
                    `speed`,
                    `heading`,
                    `altitude`,
                    `csq`,
                    `hdop`,
                    max(CONVERT_TZ(`datetime`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "')) AS `date`
                FROM
                    `tracks`
                WHERE
                    `device_id` = '" . $this->db->quote($id) . "'
                    " . $date_related_where . "
                ORDER BY
                    `datetime` DESC
            ";

        return $this->db->assocItem($query);
    }

    public function getPoints($id, $gt_id)
    {
        $d = intval(substr($this->current_date, 0, 2));
        $m = intval(substr($this->current_date, 3, 2));
        $y = intval('20' . substr($this->current_date, 8, 2));

        $date_start = date("Y-m-d H-i-s", mktime(0, 0, 0, $m, $d, $y));
        $date_end = date("Y-m-d H-i-s", mktime(23, 59, 59, $m, $d, $y));

        $date_related_where = " && (`datetime` >= '" . $this->db->quote($date_start) . "' && `datetime` <= '" . $this->db->quote($date_end) . "')";

        if ($gt_id > 0) {
            $gt_id = " && `id` > " . intval($gt_id);
        } else {
            $gt_id = "";
        }

        $query = "
                SELECT
                    `id`,
                    `lat`,
                    `lon`,
                    `speed`,
                    `heading`,
                    `altitude`,
                    CONVERT_TZ(`datetime`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "') AS `date`
                FROM
                    `tracks`
                WHERE
                    `device_id` = '" . $this->db->quote($id) . "'
                    " . $date_related_where . $gt_id . "
                ORDER BY
                    `datetime` ASC
            ";

        return $this->db->assocMulti($query);
    }

    //TODO : Сделать отдельный API-класс для работы с группами
    public function getFleetsList()
    {
        $query = "
                SELECT
                    `f`.`id`        AS `id`,
                    `f`.`name`      AS `name`,
                    COUNT(`d`.`id`) AS `cars`
                FROM
                    `fleets` `f`
                LEFT JOIN
                    `devices` `d`
                ON
                    `d`.`fleet_id` = `f`.`id`
                WHERE
                    `f`.`user_id`  = " . intval($this->auth->user['data']['id']) . "
                GROUP BY
                    `f`.`name`
                ORDER BY
                    `f`.`id`
                DESC
            ";

        return $this->db->assocMulti($query);
    }

    public function addNewFleet($name)
    {
        $c = $this->db->countRows('fleets', '`user_id` = ' . intval($this->auth->user['data']['id']));

        if ($c > $this->fleets_limit) {
            return array(
                'status' => false,
                'message' => 'Достигнуто максимальное количество групп &mdash; ' . $this->fleets_limit
            );
        } elseif ($this->db->checkRowExistance('fleets', 'name', $name, false, ' && `user_id` = ' . intval($this->auth->user['data']['id']))) {
            return array(
                'status' => false,
                'message' => 'Группа с таким названием уже существует'
            );
        } elseif (mb_strlen($name) < $this->fleets_name_minlen) {
            return array(
                'status' => false,
                'message' => 'Название группы должно состоять минимум из ' . $this->fleets_name_minlen . ' знаков'
            );
        } elseif (mb_strlen($name) > $this->fleets_name_maxlen) {
            return array(
                'status' => false,
                'message' => 'Название группы должно состоять максимум из ' . $this->fleets_name_maxlen . ' знаков'
            );
        } else {
            $this->db->query("
                    INSERT INTO `fleets` (
                        `name`,
                        `user_id`
                    ) VALUES (
                        '" . $this->db->quote($name) . "',
                        " . intval($this->auth->user['data']['id']) . "
                    )
                ");

            $id = $this->db->getMysqlInsertId();

            $name = htmlspecialchars($name, ENT_QUOTES, null, true);

            return array(
                'status' => true,
                'data' => (object)array(
                    'id' => $id,
                    'name' => $name
                ),
                'message' => 'Группа &laquo;' . $name . '&raquo; создана'
            );
        }
    }

    public function editFleetData($id, $name)
    {
        if ($this->db->checkRowExistance('fleets', 'name', $name, array($id), ' && `user_id` = ' . intval($this->auth->user['data']['id']))) {
            return array(
                'status' => false,
                'message' => 'Группа с таким названием уже существует'
            );
        } elseif (mb_strlen($name) < $this->fleets_name_minlen) {
            return array(
                'status' => false,
                'message' => 'Название группы должно состоять минимум из ' . $this->fleets_name_minlen . ' знаков'
            );
        } elseif (mb_strlen($name) > $this->fleets_name_maxlen) {
            return array(
                'status' => false,
                'message' => 'Название группы должно состоять максимум из ' . $this->fleets_name_maxlen . ' знаков'
            );
        } else {
            $query = "
                UPDATE
                    `fleets`
                SET
                    `name` = '" . $this->db->quote($name) . "'
                WHERE
                    `user_id` = " . intval($this->auth->user['data']['id']) . " &&
                    `id` = " . intval($id);

            $this->db->query($query);

            return array(
                'status' => true,
                'data' => (object)array(
                    'id' => $id,
                    'name' => $name
                ),
                'message' => 'Данные сохранены'
            );
        }
    }

    public function deleteFleet($id)
    {
        if ($this->auth->user['data']['id'] > 0) {
            $this->db->query("
                    UPDATE
                        `devices`
                    SET
                        `fleet_id` = 0
                    WHERE
                        `fleet_id` = " . intval($id) . " &&
                        `user_id` = " . intval($this->auth->user['data']['id']) . "
                ");

            $this->db->query("
                    DELETE FROM
                        `fleets`
                    WHERE
                        `id` = " . intval($id) . " &&
                        `user_id` = " . intval($this->auth->user['data']['id']) . "
                ");
        }
    }
}
