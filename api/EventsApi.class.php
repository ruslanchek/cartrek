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
                    `active` = 1 &&
                    `archive` = 0
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
                    `user_id` = ".intval($this->auth->user['data']['id'])." &&
                    `archive` = 0
            ";

            $result = $this->db->assocItem($query);
            return $result['count'];
        }

        public function getEvents($step = 0, $per_step = 10){
            $current_party_from = $step * $per_step;
            $current_party_to = ($step * $per_step) + $per_step;

            $query = "
                SELECT
                    `id`,
                    `status`,
                    `message`,
                    `user_id`,
                    `type`,
                    `active`,
                    CONVERT_TZ(`datetime`, 'GMT', '".$this->db->quote(date('P'))."') AS `datetime`
                FROM
                    `events`
                WHERE
                    `user_id` = ".intval($this->auth->user['data']['id'])." &&
                    `archive` = 0
                ORDER BY
                    `datetime` DESC
                LIMIT
                    ".intval($current_party_from).", ".intval($per_step);

            $items = $this->db->assocMulti($query);
            $total = $this->getAllEventsCount();

            if($current_party_to < $total){
                $more_items = true;
            }else{
                $more_items = false;
            };

            if(count($items) > 0){
                $in = "";

                foreach($items as $item){
                    $in .= "'".$this->db->quote($item['id'])."', ";
                };

                $in = substr($in, 0, strlen($in) - 2);

                $query = "
                    UPDATE
                        `events`
                    SET
                        `active`     = 0
                    WHERE
                        `id` IN (".$in.") &&
                        `user_id`     = ".intval($this->auth->user['data']['id']);

                $this->db->query($query);
            };

            return array(
                'items'         => $items,
                'more_items'    => $more_items
            );
        }

        /**
         * @param @integer $user_id Id of user, whom to push event.
         * @param @integer $status Status marker from 1 to 4 (1 - warning, 2 - attention, 3 - notify, 4 - success)
         * @param @integer $type Type of event (use for marking events with his caller: 1 - system, 2 - devices alerts, 3 - device statuses, 4 - finnances, 5 - social, 6 - geolocation)
         * @param @string $message Event message
         *
         * @return void add a event to user.
         */
        public function pushEvent($user_id, $status, $type, $message){
            $query = "
                INSERT INTO `events` (
                    `status`,
                    `message`,
                    `user_id`,
                    `datetime`,
                    `active`,
                    `type`,
                    `archive`
                ) VALUES (
                    ".intval($status).",
                    '".$this->db->quote($message)."',
                    ".intval($user_id).",
                    CONVERT_TZ(NOW(), 'SYSTEM', 'GMT'),
                    1,
                    ".intval($type).",
                    0
                )
            ";

            $this->query($query);
        }

        public function hideItem($id){
            $query = "
                UPDATE
                    `events`
                SET
                    `archive`     = 1
                WHERE
                    `id`          = ".intval($id)." &&
                    `user_id`     = ".intval($this->auth->user['data']['id']);

            $this->db->query($query);
        }
    };
?>