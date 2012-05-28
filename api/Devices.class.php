<?php
    Class Devices extends Core {
        public
            $current_date;

        private
            $acct;

        public function __construct(){
            parent::__construct();
            $this->acct = 'test01';
            $this->setCurrentDate();
        }

        public function getMinDate(){
            $query = "
                SELECT
                    `id`
                FROM
                    `devices`
                WHERE
                    `user_id`   = 1 &&
                    `active`    = 1
            ";

            $devices = $this->db->assocMulti($query);

            $on = "";

            foreach($devices as $device){
                $on .= "'".$this->db->quote($device['id'])."', ";
            };

            $on = substr($on, 0, strlen($on) - 2);

            $query = "
                SELECT
                    MIN(CONVERT_TZ(`datetime`, 'GMT', '".$this->db->quote(date('P'))."')) AS `date`
                FROM
                    `tracks`
                WHERE
                    `device_id` IN (".$on.")
            ";

            $result = $this->db->assocItem($query);
            return $result['date'];
        }

        public function setCurrentDate($date = false){
            $expire = 86400 - 3600 * date("H") - date("i") - date("s");
            $expire = time() + $expire;
            $now = date('d').'-'.date('m').'-'.date('Y');

            if(!$date){
                if(!isset($_COOKIE['current_date'])){
                    setcookie("current_date", $now, $expire, '/');
                };
            }else{
                setcookie("current_date", $date, $expire, '/');
            };

            if(!isset($_COOKIE['current_date'])){
                $this->current_date = $now;
            }else{
                $this->current_date = $_COOKIE['current_date'];
            };
        }

        //Get complete list of user's cars with last points
        public function getUserDevices(){
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
                    CONVERT_TZ(`last_update`, 'GMT', '".$this->db->quote(date('P'))."') AS `last_update`
                FROM
                    `devices`
                WHERE
                    `user_id`   = 1 &&
                    `active`    = 1
            ";

            $devices    = $this->db->assocMulti($query);
            $result     = array();

            foreach($devices as $device){
                $device['point']                    = $this->getLatestDevicePoint($device['id'], false);
                $device['last_registered_point']    = $this->getLatestDevicePoint($device['id'], true);
                $result[] = $device;
            };

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
                    `hdop`,
                    `csq`,
                    `journey`,
                    CONVERT_TZ(`last_update`, 'GMT', '".$this->db->quote(date('P'))."') AS `last_update`
                FROM
                    `devices`
                WHERE
                    `user_id`   = 1 &&
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

            $date_start = gmdate("Y-m-d H-i-s", mktime(0, 0, 0, $m, $d, $y));
            $date_end   = gmdate("Y-m-d H-i-s", mktime(23, 59, 59, $m, $d, $y));

            if(!$date_related){
                $date_related_where = " && (`datetime` >= '".$this->db->quote($date_start)."' && `datetime` <= '".$this->db->quote($date_end)."')";
            }else{
                $date_related_where = "";
            };

            $query = "
                SELECT
                    `id`,
                    `longitude_dms`         AS `lng`,
                    `lattitude_dms`         AS `lat`,
                    `speed`                 AS `velocity`,
                    `heading`               AS `bb`,
                    `altitude`              AS `altitude`,
                    `csq`,
                    `hdop`,
                    CONVERT_TZ(`datetime`, 'GMT', '".$this->db->quote(date('P'))."') AS `date`
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

        public function getPoints($id){
            $d = intval(substr($this->current_date, 0, 2));
            $m = intval(substr($this->current_date, 3, 2));
            $y = intval('20'.substr($this->current_date, 8, 2));

            $date_start = gmdate("Y-m-d H-i-s", mktime(0, 0, 0, $m, $d, $y));
            $date_end   = gmdate("Y-m-d H-i-s", mktime(23, 59, 59, $m, $d, $y));

            $date_related_where = " && (`datetime` >= '".$this->db->quote($date_start)."' && `datetime` <= '".$this->db->quote($date_end)."')";

            $query = "
                SELECT
                    `id`,
                    `longitude_dms`         AS `lng`,
                    `lattitude_dms`         AS `lat`,
                    `speed`                 AS `velocity`,
                    `heading`               AS `bb`,
                    `altitude`              AS `altitude`,
                    `csq`,
                    `hdop`,
                    CONVERT_TZ(`datetime`, 'GMT', '".$this->db->quote(date('P'))."') AS `date`
                FROM
                    `tracks`
                WHERE
                    `device_id` = '".$this->db->quote($id)."'
                    ".$date_related_where."
                ORDER BY
                    `datetime` ASC
            ";

            return $this->db->assocMulti($query);
        }

        public function getSatusFromPoint($point){
            if($point['velocity'] > 0){
                return '<a href="javascript:void(0)" class="label label-success">В пути</a>';
            }else{
                return '<a href="javascript:void(0)" class="label label-info">Остановка</a>';
            };
        }
    };
?>