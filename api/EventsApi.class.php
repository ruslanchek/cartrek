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

    public function getAllEventsCount($cond = 'all'){
        switch($cond){
            case 'unreaded' : {
                $cond_where = ' && `active` = 1';
            }; break;

            case 'readed' : {
                $cond_where = ' && `active` = 0';
            }; break;

            default : {
                $cond_where = '';
            }; break;
        };

        $query = "
            SELECT
                COUNT(*) AS `count`
            FROM
                `events`
            WHERE
                `user_id` = ".intval($this->auth->user['data']['id']).$cond_where."
        ";

        $result = $this->db->assocItem($query);
        return $result['count'];
    }

    public function getNewEvents(){
        $query = "
            SELECT
                `id`,
                `status`,
                `message`,
                `type`,
                `active`,
                CONVERT_TZ(`datetime`, 'Europe/Moscow', '".$this->db->quote(date('P'))."') AS `datetime`
            FROM
                `events`
            WHERE
                `user_id` = ".intval($this->auth->user['data']['id'])." &&
                `showed` = 0
            ORDER BY
                `id` DESC,
                `datetime` DESC
        ";

        $items = $this->db->assocMulti($query);

        $this->db->query("
            UPDATE
                `events`
            SET
                `showed` = 1
            WHERE
                `user_id` = ".intval($this->auth->user['data']['id'])
        );

        $total = $this->getAllEventsCount('unreaded');

        return array(
            'items' => $items,
            'total' => $total
        );
    }

    public function getEvents($step = 0, $per_step = 10, $offset = 0, $cond = 'all'){
        $offset = intval($offset);
        $current_party_from = $step * $per_step;
        $current_party_to = ($step * $per_step) + $per_step;

        switch($cond){
            case 'unreaded' : {
                $cond_where = ' && `active` = 1';
            }; break;

            case 'readed' : {
                $cond_where = ' && `active` = 0';
            }; break;

            default : {
                $cond_where = '';
            }; break;
        };

        $query = "
            SELECT
                `id`,
                `status`,
                `message`,
                `user_id`,
                `type`,
                `active`,
                CONVERT_TZ(`datetime`, 'Europe/Moscow', '".$this->db->quote(date('P'))."') AS `datetime`
            FROM
                `events`
            WHERE
                `user_id` = ".intval($this->auth->user['data']['id']).$cond_where."
            ORDER BY
                `id` DESC,
                `datetime` DESC
            LIMIT
                ".intval($current_party_from - $offset).", ".intval($per_step);

        $items = $this->db->assocMulti($query);
        $total = $this->getAllEventsCount($cond);

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
                `showed`
            ) VALUES (
                ".intval($status).",
                '".$this->db->quote($message)."',
                ".intval($user_id).",
                CONVERT_TZ(NOW(), 'SYSTEM', 'Europe/Moscow'),
                1,
                ".intval($type).",
                0
            )
        ";

        $this->db->query($query);
    }

    public function hideItem($id, $cond){
        $query = "
            UPDATE
                `events`
            SET
                `active`      = 0,
                `showed`      = 1
            WHERE
                `id`          = ".intval($id)." &&
                `user_id`     = ".intval($this->auth->user['data']['id']);

        $this->db->query($query);
        print $this->getNewEventsCount($cond);
    }

    public function hideAllItems(){
        $query = "
            UPDATE
                `events`
            SET
                `active`      = 0,
                `showed`      = 1
            WHERE
                `user_id`     = ".intval($this->auth->user['data']['id']);

        $this->db->query($query);
    }

    public function delItem($id, $cond){
        $query = "
            DELETE FROM
                `events`
            WHERE
                `id`          = ".intval($id)." &&
                `user_id`     = ".intval($this->auth->user['data']['id']);

        $this->db->query($query);
        print $this->getNewEventsCount($cond);
    }

    public function delAllItems(){
        $query = "
            DELETE FROM
                `events`
            WHERE
                `user_id`     = ".intval($this->auth->user['data']['id']);

        print $query;

        $this->db->query($query);
    }
};