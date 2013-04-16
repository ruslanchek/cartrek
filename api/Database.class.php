<?php

class Database extends Core
{
    private
        $link,
        $db_vars;

    public function __construct()
    {
        parent::__construct();

        $this->db_vars = $this->config->db_vars;
        $this->mySqlConnect();
        $this->query("SET `time_zone` = '" . $this->quote(date('P')) . "'");
    }

    //Connect to the DB
    private function mySqlConnect()
    {
        $this->link = new mysqli(
            $this->db_vars['host'],
            $this->db_vars['user'],
            $this->db_vars['pass'],
            $this->db_vars['db']
        );

        if (mysqli_connect_errno()) {
            $this->utils->debug('
                    <b>MySQL connect failed:</b><br>
                    ' . mysqli_connect_error() . '
                ');
        }

        $this->link->set_charset("utf8");
    }

    //Disconnect from DB
    public function mySqlDisconnect()
    {
        $this->link->close();
    }

    //Quote a sting
    public function quote($value)
    {
        if (get_magic_quotes_gpc()) {
            $value = stripslashes($value);
        }

        if (!is_numeric($value)) {
            $value = $this->link->real_escape_string($value);
        }

        return $value;
    }

    //Filtering query and save HTML-tags
    static public function quoteWithHTML($value)
    {
        if (get_magic_quotes_gpc()) {
            $value = stripslashes($value);
        }

        $value = mysql_real_escape_string($value);
        return $value;
    }

    //Return just inserted id
    public function getMysqlInsertId()
    {
        return mysqli_insert_id($this->link);
    }

    //Perform a query
    public function query($query)
    {
        $result = $this->link->query($query) or die(
        $this->utils->debug('
                    <b>MySQL Error:</b><br>
                    ' . $this->link->error . '<br><br>
                    <b>Query that been requested:</b><br>
                    <code>' . $query . '</code>
                ')
        );

        return $result;
    }

    //Return an associative array of a one row
    public function assocItem($query)
    {
        $sql = $this->query($query);
        $result = $sql->fetch_assoc();
        $sql->free();
        return $result;
    }

    //Return an associative array of a multiple rows
    public function assocMulti($query)
    {
        $rows = array();
        $sql = $this->query($query);

        while ($req = $sql->fetch_assoc()) {
            $rows[] = $req;
        }

        $sql->free();
        return $rows;
    }

    //Returns true, if exists
    public function checkRowExistance($table, $param, $value, $not = false, $additional_where = '')
    {
        if (is_numeric($value)) {
            $value = intval($value);
        } else {
            $value = "'" . $this->quote($value) . "'";
        }

        $exclude = "";

        if ($not && !empty($not)) {
            $exclude = " && `id` NOT IN (";

            foreach ($not as $item) {
                $exclude .= intval($item) . ",";
            }

            $exclude = substr($exclude, 0, strlen($exclude) - 1);
            $exclude .= ")";
        }

        $query = "
                SELECT
                    COUNT(*) AS `count`
                FROM
                    `" . $this->quote($table) . "`
                WHERE
                    `" . $this->quote($param) . "` = " . $value . $exclude . $additional_where . "
                LIMIT 1
            ";

        $row_count = $this->assocItem($query);

        if ($row_count['count'] > 0) {
            return true;
        } else {
            return false;
        }
    }

    //Returns true, if exists
    public function countRows($table, $where)
    {
        if ($where) {
            $where = " WHERE " . $where;
        }

        $query = "
                SELECT
                    COUNT(*) AS `count`
                FROM
                    `" . $this->quote($table) . "`
                " . $where . "
            ";

        $row_count = $this->assocItem($query);
        return $row_count['count'];
    }
}