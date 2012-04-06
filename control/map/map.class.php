<?php
    Class Map extends Core {
        private $table = 'tracks';

        public function __construct(){
            parent::__construct();

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
                        print json_encode($this->getPoints());
                    }; break;
                };

                exit;
            };

            $this->smarty->assign('options', json_encode($this->getOptions()));
        }

        public function getOptions(){
            $options = new stdClass();
            $options->date = date('d').'-'.date('m').'-'.date('y');
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
                    `active` = 1
            ";

            $devices = $this->db->assocMulti($query);
            $result = array();

            foreach($devices as $device){
                $last_point = $this->getLatestPoint('test01', $device['id'].':'.$device['secret']);
                unset($device['secret']);
                $result[] = array_merge($device, $last_point);
            };

            return $result;
        }

        //Last registered device point
        private function getLatestPoint($acct, $dev){
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
                    `acct` = '".$this->db->quote($acct)."' &&
                    `dev` = '".$this->db->quote($dev)."'
                ORDER BY
                    `g_date` DESC,
                    `g_time` DESC
                LIMIT
                    1
            ";

            return $this->db->assocItem($query);
        }

        private function getPoints(){
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
                ORDER BY
                    `g_date` ASC,
                    `g_time` ASC
            ";

            return $this->db->assocMulti($query);
        }
    };
?>