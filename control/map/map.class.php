<?php
    Class Map extends Core {
        private $table = 'tracks';

        public $current_date;

        public function __construct(){
            parent::__construct();

            $this->setCurrentDate();

            $this->acct = 'test01';

            $this->init(array(
                'name'  => 'map',
                'title' => 'Карта'
            ));

            if($this->ajax_mode){
                switch($_GET['action']){
                    case 'getOptions' : {
                        print json_encode($this->getOptions());
                    }; break;

                    case 'getPoints' : {
                        print json_encode($this->getPoints($_GET['device_id']));
                    }; break;

                    case 'setCurrentDate' : {
                        $this->setCurrentDate($_GET['date']);
                    }; break;
                };

                exit;
            };

            $this->smarty->assign('options', json_encode($this->getOptions()));
        }

        private function setCurrentDate($date = false){
            if(!$date){
                if(!isset($_SESSION['current_date'])){
                    $_SESSION['current_date'] = date('d').'-'.date('m').'-'.date('y');
                };
            }else{
                $_SESSION['current_date'] = $date;
            };

            $this->current_date = $_SESSION['current_date'];
        }

        public function getOptions(){
            $options = new stdClass();
            $options->date = $this->current_date;
            $options->devices = $this->getUserDevices();

            return $options;
        }

        public function __destruct(){
            $this->deInit();
        }

        //Get complete list of user's cars with last points
        private function getUserDevices(){
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
                    `user_id` = 1 &&
                    `active` = 1
            ";

            $devices = $this->db->assocMulti($query);
            $result = array();

            foreach($devices as $device){
                $device['point'] = $this->getLatestDevicePoint($device['id']);
                unset($device['secret']);
                $result[] = $device;
            };

            return $result;
        }

        //Get data of user device, selected by id
        private function getUserDevice($id){
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
                    `user_id` = 1 &&
                    `active` = 1 &&
                    `id` = ".intval($id)."
            ";

            return $this->db->assocItem($query);
        }

        private function getUserDeviceCode($id){
            $device = $this->getUserDevice($id);

            return $device['id'].':'.$device['secret'];
        }

        //Last registered device point
        private function getLatestDevicePoint($id){
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
                    `".$this->db->quote($this->table)."`
                WHERE
                    `acct`  = '".$this->db->quote($this->acct)."' &&
                    `dev` = '".$this->db->quote($this->getUserDeviceCode($id))."' &&
                    `g_date` = '".$this->db->quote($date)."'
                ORDER BY
                    `g_date` DESC,
                    `g_time` DESC
                LIMIT
                    1
            ";

            return $this->db->assocItem($query);
        }

        private function getPoints($id){
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
                    `".$this->db->quote($this->table)."`
                WHERE
                    `acct` = '".$this->db->quote($this->acct)."' &&
                    `dev` = '".$this->db->quote($this->getUserDeviceCode($id))."' &&
                    `g_date` = '".$this->db->quote($date)."'
                ORDER BY
                    `g_date` ASC,
                    `g_time` ASC
            ";

            return $this->db->assocMulti($query);
        }
    };
?>