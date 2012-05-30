<?php
    Class EventsApi extends Core {
        public function __construct(){
            parent::__construct();
        }

        public function getNewEventsCount(){
            $query = "
                SELECT
                    COUNT(*) AS `count`
                FROM
                    `events`
                WHERE
                    `user_id` = ".intval($this->auth->user['data']['id'])." &&
                    `active` = 1
            ";

            $result = $this->db->assocItem($query);
            return $result['count'];
        }

        public function getAllEventsCount(){
            $query = "
                SELECT
                    COUNT(*) AS `count`
                FROM
                    `events`
                WHERE
                    `user_id` = ".intval($this->auth->user['data']['id'])."
            ";

            $result = $this->db->assocItem($query);
            return $result['count'];
        }

        public function getEvents($step = 0, $per_step = 10){
            $current_party_from = $step * $per_step;
            $current_party_to = ($step * $per_step) + $per_step;

            $query = "
                SELECT
                    *
                FROM
                    `events`
                WHERE
                    `user_id` = ".intval($this->auth->user['data']['id'])."
                ORDER BY
                    `datetime` DESC,
                    `active` DESC
                LIMIT
                    ".intval($current_party_from).", ".intval($per_step);

            $items = $this->db->assocMulti($query);
            $total = $this->getAllEventsCount();

            if($current_party_to < $total){
                $more_items = true;
            }else{
                $more_items = false;
            };

            return array(
                'items'         => $items,
                'more_items'    => $more_items
            );
        }
    };
?>