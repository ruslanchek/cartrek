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
                    MIN(`datetime`) AS `date`
                FROM
                    `tracks`
                WHERE
                    `acct` = '".$this->db->quote($this->acct)."'
            ";

            $result = $this->db->assocItem($query);
            return $result['date'];
        }

        public function setCurrentDate($date = false){
            $expire = 86400 - 3600*date("H") - date("i") - date("s");
            $expire = time() +11;
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
                    `secret`,
                    `name`,
                    `model`,
                    `make`,
                    `g_id`,
                    `color`
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
                unset($device['secret']);
                $result[] = $device;
            };

            return $result;
        }

        //Get data of user device, selected by id
        public function getUserDevice($id){
            $query = "
                SELECT
                    `devices`.`id`,
                    `devices`.`secret`,
                    `devices`.`name`,
                    `devices`.`model`,
                    `devices`.`make`,
                    `devices`.`g_id`
                FROM
                    `devices`
                WHERE
                    `user_id`   = 1 &&
                    `active`    = 1 &&
                    `id`        = ".intval($id)."
            ";

            return $this->db->assocItem($query);
        }

        public function getUserDeviceCode($id){
            $device = $this->getUserDevice($id);
            return $device['id'].':'.$device['secret'];
        }

        //Last registered device point
        public function getLatestDevicePoint($id, $date_related = true){
            $d = substr($this->current_date, 0, 2);
            $m = substr($this->current_date, 3, 2);
            $y = '20'.substr($this->current_date, 8, 2);

            $date = $y.'-'.$m.'-'.$d;

            if(!$date_related){
                $date_related_where = " && (`datetime` >= '".$this->db->quote($date)." 00:00:00' && `datetime` <= '".$this->db->quote($date)." 23:59:59')";
            }else{
                $date_related_where = "";
            };

            $query = "
                SELECT
                    `id`,
                    `dev`,
                    `g_lng`         AS `lng`,
                    `g_lng_p`       AS `lng_p`,
                    `g_lat`         AS `lat`,
                    `g_lat_j`       AS `lat_j`,
                    `g_velocity`    AS `velocity`,
                    `g_bb`          AS `bb`,
                    `datetime`      AS `date`
                FROM
                    `tracks`
                WHERE
                    `acct`      = '".$this->db->quote($this->acct)."' &&
                    `dev`       = '".$this->db->quote($this->getUserDeviceCode($id))."'
                    ".$date_related_where."
                ORDER BY
                    `datetime` DESC
                LIMIT
                    1
            ";

            return $this->db->assocItem($query);
        }

        public function getPoints($id){
            $d = substr($this->current_date, 0, 2);
            $m = substr($this->current_date, 3, 2);
            $y = '20'.substr($this->current_date, 8, 2);

            $date = $y.'-'.$m.'-'.$d;
            $date_related_where = " && (`datetime` >= '".$this->db->quote($date)." 00:00:00' && `datetime` <= '".$this->db->quote($date)." 23:59:59')";

            $query = "
                SELECT
                    `id`,
                    `dev`,
                    `g_lng`         AS `lng`,
                    `g_lng_p`       AS `lng_p`,
                    `g_lat`         AS `lat`,
                    `g_lat_j`       AS `lat_j`,
                    `g_velocity`    AS `velocity`,
                    `g_bb`          AS `bb`,
                    `datetime`      AS `date`
                FROM
                    `tracks`
                WHERE
                    `acct`      = '".$this->db->quote($this->acct)."' &&
                    `dev`       = '".$this->db->quote($this->getUserDeviceCode($id))."'
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