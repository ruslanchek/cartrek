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

        public function setCurrentDate($date = false){
            if(!$date){
                if(!isset($_SESSION['current_date'])){
                    $_SESSION['current_date'] = date('d').'-'.date('m').'-'.date('Y');
                };
            }else{
                $_SESSION['current_date'] = $date;
            };

            $this->current_date = $_SESSION['current_date'];
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
            $date = substr($this->current_date, 0, 2).substr($this->current_date, 3, 2).substr($this->current_date, 8, 2);

            $date_related_where = '';

            if(!$date_related){
                $date_related_where = "&& `g_date` = '".$this->db->quote($date)."'";
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
                    `g_date`        AS `date`,
                    `g_time`        AS `time`
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
            $date = substr($this->current_date, 0, 2).substr($this->current_date, 3, 2).substr($this->current_date, 8, 2);

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
                    `g_date`        AS `date`,
                    `g_time`        AS `time`
                FROM
                    `tracks`
                WHERE
                    `acct`      = '".$this->db->quote($this->acct)."' &&
                    `dev`       = '".$this->db->quote($this->getUserDeviceCode($id))."' &&
                    `g_date`    = '".$this->db->quote($date)."'
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