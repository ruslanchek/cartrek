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
            $options->start_point = $this->getLatestPoint($acct);

            return $options;
        }

        public function __destruct(){
            $this->deInit();
        }

        private function getLatestPoint($acct, $dev){
            $query = "
                SELECT
                    `id`,
                    `g_lat`         AS `lat`,
                    `g_lng`         AS `lng`
                FROM
                    `".$this->db->quote($this->table)."`
                ORDER BY
                    `g_date` DESC,
                    `g_time` DESC
                LIMIT
                    1
                WHERE
                    `acct` = '".$this->db->quote($acct)."',
                    `dev` = '".$this->db->quote($dev)."'
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