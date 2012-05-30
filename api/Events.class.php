<?php
    Class Events extends Core {
        public function __construct(){
            parent::__construct();
        }

        public function getUserEvents($step = 0, $per_step = 30){
            $query = "
                SELECT
                    *
                FROM
                    `devices`
                WHERE
                    `user_id` = ".intval($this->auth->user_status['userdata']['id'])."
                LIMIT
                    ".intval($step * $per_step).", ".intval(($step * $per_step) + $step);

            return $this->db->assocMulti($query);
        }
    };
?>