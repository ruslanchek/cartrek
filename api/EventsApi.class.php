<?php

Class EventsApi extends Core
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getNewEventsCount()
    {
        $query = "
            SELECT
                COUNT(*) AS `count`
            FROM
                `events`
            WHERE
                `user_id` = " . intval($this->auth->user['data']['id']) . " &&
                `active` = 1
        ";

        $result = $this->db->assocItem($query);
        return $result['count'];
    }

    private function getCondWhere($cond)
    {
        switch ($cond) {
            case 'unreaded' :
            {
                $cond_where = ' && `active` = 1';
            }
                break;

            case 'readed' :
            {
                $cond_where = ' && `active` = 0';
            }
                break;

            case 'error' :
            {
                $cond_where = ' && `status` = 1';
            }
                ;
                break;

            case 'notify' :
            {
                $cond_where = ' && `status` = 3';
            }
                break;

            case 'attention' :
            {
                $cond_where = ' && `status` = 2';
            }
                break;

            case 'success' :
            {
                $cond_where = ' && `status` = 4';
            }
                break;

            case 'all';
            default :
            {
                $cond_where = '';
            }
                break;
        }
        ;

        return $cond_where;
    }

    public function getAllEventsCount($cond = 'all')
    {
        $cond_where = $this->getCondWhere($cond);

        $query = "
            SELECT
                COUNT(*) AS `count`
            FROM
                `events`
            WHERE
                `user_id` = " . intval($this->auth->user['data']['id']) . $cond_where . "
        ";

        $result = $this->db->assocItem($query);

        return $result['count'];
    }

    public function getNewEvents()
    {
        $query = "
            SELECT
                `id`,
                `status`,
                `message`,
                `type`,
                `active`,
                CONVERT_TZ(`datetime`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "') AS `datetime`
            FROM
                `events`
            WHERE
                `user_id` = " . intval($this->auth->user['data']['id']) . " &&
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
                `user_id` = " . intval($this->auth->user['data']['id']));

        $total = $this->getAllEventsCount('unreaded');

        return array(
            'items' => $items,
            'total' => $total
        );
    }

    public function getEvents($step = 0, $per_step = 10, $offset = 0, $cond = 'all')
    {
        $offset = intval($offset);
        $current_party_from = $step * $per_step;
        $current_party_to = ($step * $per_step) + $per_step;

        $cond_where = $this->getCondWhere($cond);

        $query = "
            SELECT
                `id`,
                `status`,
                `message`,
                `user_id`,
                `type`,
                `active`,
                CONVERT_TZ(`datetime`, 'Europe/Moscow', '" . $this->db->quote(date('P')) . "') AS `datetime`
            FROM
                `events`
            WHERE
                `user_id` = " . intval($this->auth->user['data']['id']) . $cond_where . "
            ORDER BY
                `datetime` DESC
            LIMIT
                " . intval($current_party_from - $offset) . ", " . intval($per_step);

        $items = $this->db->assocMulti($query);
        $total = $this->getAllEventsCount($cond);

        if ($current_party_to < $total) {
            $more_items = true;
        } else {
            $more_items = false;
        }
        ;

        return array(
            'items' => $items,
            'more_items' => $more_items
        );
    }

    public function pushEvent($status, $type, $message, $showed = 0)
    {
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
                " . intval($status) . ",
                '" . $this->db->quote($message) . "',
                " . intval($this->auth->user['data']['id']) . ",
                CONVERT_TZ(NOW(), 'SYSTEM', 'Europe/Moscow'),
                1,
                " . intval($type) . ",
                " . intval($showed) . "
            )
        ";

        $this->db->query($query);
    }

    public function hideItem($id, $cond)
    {
        $query = "
            UPDATE
                `events`
            SET
                `active`      = 0,
                `showed`      = 1
            WHERE
                `id`          = " . intval($id) . " &&
                `user_id`     = " . intval($this->auth->user['data']['id']);

        $this->db->query($query);
        print $this->getNewEventsCount($cond);
    }

    public function hideAllItems()
    {
        $query = "
            UPDATE
                `events`
            SET
                `active`      = 0,
                `showed`      = 1
            WHERE
                `user_id`     = " . intval($this->auth->user['data']['id']);

        $this->db->query($query);
    }

    public function delItem($id, $cond)
    {
        $query = "
            DELETE FROM
                `events`
            WHERE
                `id`          = " . intval($id) . " &&
                `user_id`     = " . intval($this->auth->user['data']['id']);

        $this->db->query($query);
        print $this->getNewEventsCount($cond);
    }

    public function delAllItems()
    {
        $query = "
            DELETE FROM
                `events`
            WHERE
                `user_id`     = " . intval($this->auth->user['data']['id']);

        print $query;

        $this->db->query($query);
    }
}