<?php
    Class Devices extends Core {
        public
            $current_date,
            $devices_present = false;

        private
            $fleets_limit = 20;

        public function __construct(){
            parent::__construct();

            $this->checkForDevices();

            if(isset($_GET['date'])){
                $date = $_GET['date'];
            }else{
                $date = false;
            };

            $this->setCurrentDate($date); //Сделать прием даты через AJAX
        }

        public function checkForDevices(){
            $query = "
                SELECT
                    COUNT(*) AS `count`
                FROM
                    `devices`
                WHERE
                    `user_id`   = ".intval($this->auth->user['data']['id'])." &&
                    `active`    = 1
            ";

            $result = $this->db->assocItem($query);

            if($result['count'] >= 1){
                $this->devices_present = true;
            };
        }

        public function getMinDate(){
            $query = "
                SELECT
                    `id`
                FROM
                    `devices`
                WHERE
                    `user_id`   = ".intval($this->auth->user['data']['id'])." &&
                    `active`    = 1
            ";

            $devices = $this->db->assocMulti($query);

            $in = "";

            foreach($devices as $device){
                $in .= "'".$this->db->quote($device['id'])."', ";
            };

            $in = substr($in, 0, strlen($in) - 2);

            $query = "
                SELECT
                    MIN(CONVERT_TZ(`datetime`, 'Europe/Moscow', '".$this->db->quote(date('P'))."')) AS `date`
                FROM
                    `tracks`
                WHERE
                    `device_id` IN (".$in.")
            ";

            $result = $this->db->assocItem($query);
            return $result['date'];
        }

        public function setCurrentDate($date = false){
            if(!$date){
                $this->current_date = date('d').'-'.date('m').'-'.date('Y');
            }else{
                $this->current_date = $date;
            };
        }

        //Get complete list of user's cars with last points
        public function getUserDevices($include_unactive = false){
            if($include_unactive){
                $addition = "";
            }else{
                $addition = " && `devices`.`active` = 1";
            };

            if(isset($_GET['fleet']) && $_GET['fleet'] >= 1){
                $addition .= " && `devices`.`fleet_id` = ".intval($_GET['fleet']);
            };

            $query = "
                SELECT
                	`devices`.`id`,
                	`devices`.`imei`,
                	`devices`.`name`,
                	`devices`.`model`,
                	`devices`.`make`,
                	`devices`.`g_id`,
                	`devices`.`color`,
                	`devices`.`active`,
                	`devices`.`fleet_id`,
                	CONVERT_TZ(`devices`.`last_update`, 'Europe/Moscow', '".$this->db->quote(date('P'))."') AS `last_update`,
                	`fleets`.`name` AS `fleet_name`
                FROM
                	`devices`
                LEFT JOIN `fleets` ON `devices`.`fleet_id` = `fleets`.`id` && `fleets`.`user_id` = ".intval($this->auth->user['data']['id']).$addition."
                WHERE
                	`devices`.`user_id` = ".intval($this->auth->user['data']['id']).$addition."
                GROUP BY
                	`devices`.`id`
                ORDER BY
                	`devices`.`sort` ASC
            ";

            $devices = $this->db->assocMulti($query);

            for($i = 0, $l = count($devices); $i < $l; $i++){
                $query = "
                    SELECT
                        CONVERT_TZ(`tracks`.`datetime`, 'Europe/Moscow', '".$this->db->quote(date('P'))."') AS `last_point_date`
                    FROM
                        `tracks`
                    WHERE
                        `tracks`.`device_id` = ".intval($devices[$i]['id'])."
                    ORDER BY
                        `tracks`.`datetime` DESC
                    LIMIT 1
                ";

                $track = $this->db->assocItem($query);

                if($track){
                    $devices[$i] = array_merge($devices[$i], $track);
                };
            };

            return $devices;
        }

        // TM flag - флоаг тайммашины, который указывает на то, что нужно грузить startpoint вместо endpoint в качестве текущего положения тачки
        public function getDynamicDevicesData($cars, $tm_flag){
            if($cars && count($cars) > 0){
                $in = '';

                foreach($cars as $car){
                    $in .= intval($car).",";
                };

                $in = substr($in, 0, strlen($in) - 1);

                $d = intval(substr($this->current_date, 0, 2));
                $m = intval(substr($this->current_date, 3, 2));
                $y = intval('20'.substr($this->current_date, 8, 2));

                $date_start = date("Y-m-d H-i-s", mktime(0, 0, 0, $m, $d, $y));
                $date_end   = date("Y-m-d H-i-s", mktime(23, 59, 59, $m, $d, $y));

                $query = "
                    SELECT
                        `devices`.`id`,
                        `devices`.`hdop`,
                        `devices`.`csq`,
                        `devices`.`journey`,
                        `devices`.`active`,
                        `devices`.`params`,
                        `devices`.`sat_count`,
                        CONVERT_TZ(`devices`.`last_update`, 'Europe/Moscow', '".$this->db->quote(date('P'))."') AS `last_update`
                    FROM
                        `devices`
                    WHERE
                        `devices`.`user_id` = ".intval($this->auth->user['data']['id'])." &&
                        `devices`.`id` IN (".$in.")
                    GROUP BY
                        `devices`.`id`
                ";

                $devices = $this->db->assocMulti($query);

                if($tm_flag == '1'){
                    $order = 'ASC';
                }else{
                    $order = 'DESC';
                };

                for($i = 0, $l = count($devices); $i < $l; $i++){
                    $query = "
                        SELECT
                        	CONVERT_TZ(`tracks`.`datetime`, 'Europe/Moscow', '".$this->db->quote(date('P'))."') AS `last_point_date`,
                        	`tracks`.`id` AS `point_id`,
                        	`tracks`.`lat`,
                        	`tracks`.`lon`,
                        	`tracks`.`speed`,
                        	`tracks`.`heading`,
                        	`tracks`.`altitude`
                        FROM
                        	`tracks`
                        WHERE
                        	`tracks`.`device_id` = ".intval($devices[$i]['id'])." &&
                        	`tracks`.`datetime` >= CONVERT_TZ('".$date_start."', '+04:00', 'Europe/Moscow') &&
                        	`tracks`.`datetime` <= CONVERT_TZ('".$date_end."', '+04:00', 'Europe/Moscow')
                        ORDER BY
                        	`tracks`.`datetime` ".$order."
                        LIMIT 1
                    ";

                    $track = $this->db->assocItem($query);

                    if($track){
                        $devices[$i] = array_merge($devices[$i], $track);
                    };
                };

                return $devices;
            };
        }

        //Get complete list of user's cars with last points
        public function getUserFleetsAndDevices(){
            $result = new StdClass();

            $result->fleets = $this->getFleetsList();
            $result->devices = $this->getUserDevices();

            return $result;
        }

        //Get data of user device, selected by id
        public function getUserDevice($id){
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
                    CONVERT_TZ(`last_update`, 'Europe/Moscow', '".$this->db->quote(date('P'))."') AS `last_update`
                FROM
                    `devices`
                WHERE
                    `user_id`   = ".intval($this->auth->user['data']['id'])." &&
                    `active`    = 1 &&
                    `id`        = ".intval($id)."
            ";

            return $this->db->assocItem($query);
        }

        //Last registered device point
        public function getLatestDevicePoint($id, $date_related = true){
            $d = intval(substr($this->current_date, 0, 2));
            $m = intval(substr($this->current_date, 3, 2));
            $y = intval('20'.substr($this->current_date, 8, 2));

            $date_start = date("Y-m-d H-i-s", mktime(0, 0, 0, $m, $d, $y));
            $date_end   = date("Y-m-d H-i-s", mktime(23, 59, 59, $m, $d, $y));

            if(!$date_related){
                $date_related_where = " && (`datetime` >= '".$this->db->quote($date_start)."' && `datetime` <= '".$this->db->quote($date_end)."')";
            }else{
                $date_related_where = "";
            };

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
                    CONVERT_TZ(`datetime`, 'Europe/Moscow', '".$this->db->quote(date('P'))."') AS `date`
                FROM
                    `tracks`
                WHERE
                    `device_id` = '".$this->db->quote($id)."'
                    ".$date_related_where."
                ORDER BY
                    `datetime` DESC
                LIMIT
                    1
            ";

            return $this->db->assocItem($query);
        }

        public function getPoints($id, $gt_id){
            $d = intval(substr($this->current_date, 0, 2));
            $m = intval(substr($this->current_date, 3, 2));
            $y = intval('20'.substr($this->current_date, 8, 2));

            $date_start = date("Y-m-d H-i-s", mktime(0, 0, 0, $m, $d, $y));
            $date_end   = date("Y-m-d H-i-s", mktime(23, 59, 59, $m, $d, $y));

            $date_related_where = " && (`datetime` >= '".$this->db->quote($date_start)."' && `datetime` <= '".$this->db->quote($date_end)."')";

            if($gt_id > 0){
                $gt_id = " && `id` >= ".intval($gt_id);
            }else{
                $gt_id = "";
            };

            $query = "
                SELECT
                    `id`,
                    `lat`,
                    `lon`,
                    `speed`,
                    `heading`,
                    `altitude`,
                    CONVERT_TZ(`datetime`, 'Europe/Moscow', '".$this->db->quote(date('P'))."') AS `date`
                FROM
                    `tracks`
                WHERE
                    `device_id` = '".$this->db->quote($id)."'
                    ".$date_related_where.$gt_id."
                ORDER BY
                    `datetime` ASC
            ";

            return $this->db->assocMulti($query);
        }

        //TODO : Сделать отдельный API-класс для работы с группами
        public function getFleetsList(){
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
                    `f`.`user_id`  = ".intval($this->auth->user['data']['id'])."
                GROUP BY
                    `f`.`name`
                ORDER BY
                    `f`.`id`
                DESC
            ";

            return $this->db->assocMulti($query);
        }

        public function addNewFleet($name){
            $c = $this->db->countRows('fleets', '`user_id` = '.intval($this->auth->user['data']['id']));

            if($this->db->checkRowExistance('fleets', 'name', $name)){
                return array(
                    'status' => false,
                    'message' => 'Группа с таким названием уже существует'
                );
            }elseif($c > $this->fleets_limit){
                return array(
                    'status' => false,
                    'message' => 'Достигнуто максимальное количество групп &mdash; '.$this->fleets_limit
                );

            }else{
                $this->db->query("
                    INSERT INTO `fleets` (
                        `name`,
                        `user_id`
                    ) VALUES (
                        '".$this->db->quote($name)."',
                        ".intval($this->auth->user['data']['id'])."
                    )
                ");

                return array(
                    'status' => true,
                    'message' => 'Группа создана!'
                );
            };
        }

        public function deleteFleet($id){
            if($this->auth->user['data']['id'] > 0){
                $this->db->query("
                    UPDATE
                        `devices`
                    SET
                        `fleet_id` = 0
                    WHERE
                        `fleet_id` = ".intval($id)." &&
                        `user_id` = ".intval($this->auth->user['data']['id'])."
                ");

                $this->db->query("
                    DELETE FROM
                        `fleets`
                    WHERE
                        `id` = ".intval($id)." &&
                        `user_id` = ".intval($this->auth->user['data']['id'])."
                ");
            };
        }
    };
?>
