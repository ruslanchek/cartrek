<?php
/**
 *  Public utilities
 */
class Utilities extends Core
{
    public function __construct()
    {
        parent::__construct();
    }

    //Convert MYSQL-datetime to seconds
    static public function datetimeToSeconds($time)
    {
        $years = substr($time, 0, 4);
        $months = substr($time, 5, 2);
        $days = substr($time, 8, 2);
        $hours = substr($time, 11, 2);
        $minutes = substr($time, -5, 2);
        $seconds = substr($time, -2);

        return mktime($hours, $minutes, $seconds, $months, $days, $years);
    }

    //Checks string for match a pattern
    static public function matchPattern($str, $type)
    {
        switch ($type) {
            case 'email' :
            {
                $pattern = '/^[a-z0-9&\'\.\-_\+]+@[a-z0-9\-]+\.([a-z0-9\-]+\.)*+[a-z]{2}/is';
            }
                break;

            case 'number' :
            {
                $pattern = '/^(\d+).(\d+)$/';
            }
                break;
        }

        return preg_match($pattern, $str);
    }

    //Generate random code
    static public function getUniqueCode($length = 6, $allow_uppercase = true, $allow_numbers = true)
    {
        $out = '';
        $arr = array();

        for ($i = 97; $i < 123; $i++) {
            $arr[] = chr($i);
        }
        ;

        if ($allow_uppercase) {
            for ($i = 65; $i < 91; $i++) $arr[] = chr($i);
        }
        ;

        if ($allow_numbers) {
            for ($i = 0; $i < 10; $i++) $arr[] = $i;
        }

        shuffle($arr);

        for ($i = 0; $i < $length; $i++) {
            $out .= $arr[mt_rand(0, sizeof($arr) - 1)];
        }

        return $out;
    }

    //Translit
    static public function translit($str)
    {
        $tr = array(
            "А" => "a", "Б" => "b", "В" => "v", "Г" => "g",
            "Д" => "d", "Е" => "e", "Ё" => "e", "Ж" => "j", "З" => "z", "И" => "i",
            "Й" => "y", "К" => "k", "Л" => "l", "М" => "m", "Н" => "n",
            "О" => "o", "П" => "p", "Р" => "r", "С" => "s", "Т" => "t",
            "У" => "u", "Ф" => "f", "Х" => "h", "Ц" => "ts", "Ч" => "ch",
            "Ш" => "sh", "Щ" => "sch", "Ъ" => "", "Ы" => "yi", "Ь" => "",
            "Э" => "e", "Ю" => "yu", "Я" => "ya", "а" => "a", "б" => "b",
            "в" => "v", "г" => "g", "д" => "d", "е" => "e", "ё" => "e", "ж" => "j",
            "з" => "z", "и" => "i", "й" => "y", "к" => "k", "л" => "l",
            "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r",
            "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "h",
            "ц" => "ts", "ч" => "ch", "ш" => "sh", "щ" => "sch", "ъ" => "y",
            "ы" => "yi", "ь" => "", "э" => "e", "ю" => "yu", "я" => "ya"
        );

        return strtr($str, $tr);
    }

    //Translit an URL
    static function convertUrl($str)
    {
        $str = strtolower(Utilities::translit($str));
        $str = preg_replace("/[^a-zA-Z0-9-\.\?]/", "_", $str);
        return strtr($str, array(" " => "_", "__" => "_", "?" => ""));
    }

    //Print variables into a message
    static public function debug($var)
    {
        $result = '<div style="background: #fff; margin: 20px; border: 1px solid #666; color: #000; font-size: 12px; font-family: Arial;">
                            <div style="font-size: 1.2em; padding: 5px 10px; background: #666; color: #fff;">
                                <strong>Debug message</strong>
                            </div>
                            <div style="padding: 10px;">
                                ' . print_r($var, true) . '
                            </div>
                        </div>';

        print $result;
    }

    //Removes a double slashes from a path
    static public function removePathDoubleSlashes($path)
    {
        return preg_replace('/\/+/', '/', $path);
    }

    //Get unique filename
    static public function getUniqueFilename($path, $extension)
    {
        $name = Utilities::getUniqueCode(32);
        $file = Utilities::removePathDoubleSlashes($path . '/') . $name . '.' . $extension;

        while (file_exists($file)) {
            $name = Utilities::getUniqueCode(32);
            $file = Utilities::removePathDoubleSlashes($path . '/') . $name . '.' . $extension;
        }

        return $name;
    }

    //Write log
    static public function writeLogFile($data)
    {
        $file = $_SERVER['DOCUMENT_ROOT'] . '/log.txt';

        $content = '';

        if (file_exists($file) && is_readable($file)) {
            $file_handle = fopen($file, "r");

            while (!feof($file_handle)) {
                $content .= fgets($file_handle);
            }

            fclose($file_handle);
        }

        $content .= $data . "\n";

        $fp = fopen($file, "a");
        flock($fp, LOCK_EX);
        ftruncate($fp, 0);
        fputs($fp, $content);
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
    }

    //Return a random color in hex
    static public function getRandomColor($lower_register = false)
    {
        $random_color = substr('00000' . dechex(mt_rand(0, 0xffffff)), -6);

        if ($lower_register) {
            return $random_color;
        } else {
            return strtoupper($random_color);
        }
    }

    //Return a color, that maches a string hex
    static public function getColorByStringHash($str, $lower_register = false)
    {
        $color = substr(md5($str), 0, 6);

        if ($lower_register) {
            $result = $color;
        } else {
            $result = strtoupper($color);
        }

        return $result;
    }

    //Punicode decryptor
    static public function punycode_to_unicode($input)
    {
        $prefix = 'xn--';
        $safe_char = 0xFFFC;
        $base = 36;
        $tmin = 1;
        $tmax = 26;
        $skew = 38;
        $damp = 700;
        $output_parts = array();

        $enco_parts = (array)explode('.', $input);
        foreach ($enco_parts as $encoded) { // loop through each part of a host domain,  ie. subdomain.subdomain.domain.tld

            if (strpos($encoded, $prefix) !== 0 || strlen(trim(str_replace($prefix, '', $encoded))) == 0) {
                $output_parts[] = $encoded;
                continue;
            }

            $is_first = true;
            $bias = 72;
            $idx = 0;
            $char = 0x80;
            $decoded = array();
            $output = '';

            $delim_pos = strrpos($encoded, '-');
            if ($delim_pos > strlen($prefix)) {
                for ($k = strlen($prefix); $k < $delim_pos; ++$k) {
                    $decoded[] = ord($encoded{$k});
                }
            }
            $deco_len = count($decoded);
            $enco_len = strlen($encoded);

            for ($enco_idx = $delim_pos ? ($delim_pos + 1) : 0; $enco_idx < $enco_len; ++$deco_len) {
                for ($old_idx = $idx, $w = 1, $k = $base; 1; $k += $base) {
                    $cp = ord($encoded{$enco_idx++});
                    $digit = ($cp - 48 < 10) ? $cp - 22 : (($cp - 65 < 26) ? $cp - 65 : (($cp - 97 < 26) ? $cp - 97 : $base));
                    $idx += $digit * $w;
                    $t = ($k <= $bias) ? $tmin : (($k >= $bias + $tmax) ? $tmax : ($k - $bias));
                    if ($digit < $t) {
                        break;
                    }
                    $w = (int)($w * ($base - $t));
                }
                $delta = $idx - $old_idx;
                $delta = intval($is_first ? ($delta / $damp) : ($delta / 2));
                $delta += intval($delta / ($deco_len + 1));
                for ($k = 0; $delta > (($base - $tmin) * $tmax) / 2; $k += $base) {
                    $delta = intval($delta / ($base - $tmin));
                }
                $bias = intval($k + ($base - $tmin + 1) * $delta / ($delta + $skew));
                $is_first = false;
                $char += (int)($idx / ($deco_len + 1));
                $idx %= ($deco_len + 1);
                if ($deco_len > 0) {
                    for ($i = $deco_len; $i > $idx; $i--) {
                        $decoded[$i] = $decoded[($i - 1)];
                    }
                }
                $decoded[$idx++] = $char;
            }

            foreach ($decoded as $k => $v) {
                if ($v < 128) {
                    $output .= chr($v);
                } // 7bit are transferred literally
                elseif ($v < (1 << 11)) {
                    $output .= chr(192 + ($v >> 6)) . chr(128 + ($v & 63));
                } // 2 bytes
                elseif ($v < (1 << 16)) {
                    $output .= chr(224 + ($v >> 12)) . chr(128 + (($v >> 6) & 63)) . chr(128 + ($v & 63));
                } // 3 bytes
                elseif ($v < (1 << 21)) {
                    $output .= chr(240 + ($v >> 18)) . chr(128 + (($v >> 12) & 63)) . chr(128 + (($v >> 6) & 63)) . chr(128 + ($v & 63));
                } // 4 bytes
                else {
                    $output .= $safe_char;
                } //  'Conversion from UCS-4 to UTF-8 failed: malformed input at byte '.$k
            }
            $output_parts[] = $output;

        } // $enco_parts loop

        return implode('.', $output_parts);
    }

    //Purify string from spaces
    static public function clearString($str)
    {
        return preg_replace('#\s{2,}#', '', $str);
    }

    //Cut all of HTML ftom string
    static public function purifyText($str)
    {
        return Utilities::clearString(strip_tags($str));
    }

    //Plural form
    function pluralForm($number, $forms)
    {
        if (!$forms) {
            return '';
        } else {
            return $number % 10 == 1 && $number % 100 != 11 ? $forms[0] : ($number % 10 >= 2 && $number % 10 <= 4 && ($number % 100 < 10 || $number % 100 >= 20) ? $forms[1] : $forms[2]);
        }
    }

    //Return keywords array from html
    function getKeywords($str)
    {
        $min_word_length = 3;

        $search = array("'ё'",
            "'<script[^>]*?>.*?</script>'si", // Вырезается javascript
            "'<[\/\!]*?[^<>]*?>'si", // Вырезаются html-тэги
            "'([\r\n])[\s]+'", // Вырезается пустое пространство
            "'&(quot|#34);'i", // Замещаются html-элементы
            "'&(amp|#38);'i",
            "'&(lt|#60);'i",
            "'&(gt|#62);'i",
            "'&(nbsp|#160);'i",
            "'&(iexcl|#161);'i",
            "'&(cent|#162);'i",
            "'&(pound|#163);'i",
            "'&(copy|#169);'i",
            "'&#(\d+);'e");

        $replace = array("е",
            " ",
            " ",
            "\\1 ",
            "\" ",
            " ",
            " ",
            " ",
            " ",
            chr(161),
            chr(162),
            chr(163),
            chr(169),
            "chr(\\1)");

        $text = preg_replace($search, $replace, $str);

        $del_symbols = array(",", ".", ";", ":", "\"", "#", "\$", "%", "^",
            "!", "@", "`", "~", "*", "-", "=", "+", "\\",
            "|", "/", ">", "<", "(", ")", "&", "?", "¹", "\t",
            "\r", "\n", "{", "}", "[", "]", "'", "“", "”", "•",
            "как", "для", "что", "или", "это", "этих",
            "всех", "вас", "они", "оно", "еще", "когда",
            "где", "эта", "лишь", "уже", "вам", "нет",
            "если", "надо", "все", "так", "его", "чем",
            "при", "даже", "мне", "есть", "раз", "два",
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
        );

        $text = str_replace($del_symbols, array(" "), $text);
        $text = ereg_replace("( +)", " ", $text);
        $orig_arr = explode(" ", trim($text));

        $tmp_arr = array();

        foreach ($orig_arr as $val) {
            if (strlen($val) >= $min_word_length) {
                $val = strtolower($val);
                if (array_key_exists($val, $tmp_arr)) {
                    $tmp_arr[$val]++;
                } else {
                    $tmp_arr[$val] = 1;
                }
            }
        }

        arsort($tmp_arr);
        $modif_arr = $tmp_arr;

        $arr = array_slice($modif_arr, 0, 30);
        $str = "";

        foreach ($arr as $key => $val) {
            $str .= $key . ", ";
        }

        return trim(substr($str, 0, strlen($str) - 2));
    }

    static public function createRandomCode($length = 5) {
        return substr(number_format(time() * rand() , 0, '', ''), 0, intval($length, 10));
    }

    //Get current url without given get param
    static public function getParamstring($excl = '')
    {
        $excl = explode(',', $excl);

        $uri = mb_strtolower($_SERVER['REQUEST_URI'], "UTF-8");
        $uri = parse_url(preg_replace('/\/+/', "/", $uri, PHP_URL_PATH));
        $uri = preg_replace('/\/+/', "/", $uri['path'] . '/');

        $result = $uri . '?';

        foreach ($_GET as $key => $value) {
            if (!in_array($key, $excl) && $value != '') {
                $result .= '&' . $key . '=' . $value;
            }
        }

        $result = $result . '&';
        $result = preg_replace('/\?\&/', '?', $result);

        return $result;
    }

    //Get current page url
    static public function currentPageURL()
    {
        $pageURL = 'http';

        if ($_SERVER["HTTPS"] == "on") {
            $pageURL .= "s";
        }

        $pageURL .= "://";

        if ($_SERVER["SERVER_PORT"] != "80") {
            $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
        } else {
            $pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
        }

        return $pageURL;
    }

    static public function clearPhoneStr ($str) {
        $str = trim($str);

        if(substr($str, 0, 2) == '+7'){
            $str = substr($str, 2, strlen($str));
        }

        if(substr($str, 0, 1) == '7' || substr($str, 0, 1) == '8'){
            $str = substr($str, 1, strlen($str));
        }

        $str = preg_replace('/[^0-9]/', '', $str);

        return $str;
    }

    static public function formatPhoneStr ($str, $code = false) {
        $phone = preg_replace("/[^0-9]/", "", $str);
        $code_ins = '';

        if($code){
            $code_ins = '+'.$code.' ';
        }

        if(strlen($phone) == 7){
            return $code_ins.preg_replace("/([0-9]{3})([0-9]{2})([0-9]{2})/", "$1-$2-$3", $phone);
        }elseif(strlen($phone) == 10){
            return $code_ins.preg_replace("/([0-9]{3})([0-9]{3})([0-9]{2})([0-9]{2})/", "($1) $2-$3-$4", $phone);
        }else{
            return $code_ins.$phone;
        }
    }

    //Get list of timezones
    static public function generateTimeZonesList()
    {
        $timezones = array(
            'Pacific/Midway' => "(GMT-11:00) Midway Island",
            'US/Samoa' => "(GMT-11:00) Samoa",
            'US/Hawaii' => "(GMT-10:00) Hawaii",
            'US/Alaska' => "(GMT-09:00) Alaska",
            'US/Pacific' => "(GMT-08:00) Pacific Time (US &amp; Canada)",
            'America/Tijuana' => "(GMT-08:00) Tijuana",
            'US/Arizona' => "(GMT-07:00) Arizona",
            'US/Mountain' => "(GMT-07:00) Mountain Time (US &amp; Canada)",
            'America/Chihuahua' => "(GMT-07:00) Chihuahua",
            'America/Mazatlan' => "(GMT-07:00) Mazatlan",
            'America/Mexico_City' => "(GMT-06:00) Mexico City",
            'America/Monterrey' => "(GMT-06:00) Monterrey",
            'Canada/Saskatchewan' => "(GMT-06:00) Saskatchewan",
            'US/Central' => "(GMT-06:00) Central Time (US &amp; Canada)",
            'US/Eastern' => "(GMT-05:00) Eastern Time (US &amp; Canada)",
            'US/East-Indiana' => "(GMT-05:00) Indiana (East)",
            'America/Bogota' => "(GMT-05:00) Bogota",
            'America/Lima' => "(GMT-05:00) Lima",
            'America/Caracas' => "(GMT-04:30) Caracas",
            'Canada/Atlantic' => "(GMT-04:00) Atlantic Time (Canada)",
            'America/La_Paz' => "(GMT-04:00) La Paz",
            'America/Santiago' => "(GMT-04:00) Santiago",
            'Canada/Newfoundland' => "(GMT-03:30) Newfoundland",
            'America/Buenos_Aires' => "(GMT-03:00) Buenos Aires",
            'Greenland' => "(GMT-03:00) Greenland",
            'Atlantic/Stanley' => "(GMT-02:00) Stanley",
            'Atlantic/Azores' => "(GMT-01:00) Azores",
            'Atlantic/Cape_Verde' => "(GMT-01:00) Cape Verde Is.",
            'Africa/Casablanca' => "(GMT) Casablanca",
            'Europe/Dublin' => "(GMT) Dublin",
            'Europe/Lisbon' => "(GMT) Lisbon",
            'Europe/London' => "(GMT) London",
            'Africa/Monrovia' => "(GMT) Monrovia",
            'Europe/Amsterdam' => "(GMT+01:00) Amsterdam",
            'Europe/Belgrade' => "(GMT+01:00) Belgrade",
            'Europe/Berlin' => "(GMT+01:00) Berlin",
            'Europe/Bratislava' => "(GMT+01:00) Bratislava",
            'Europe/Brussels' => "(GMT+01:00) Brussels",
            'Europe/Budapest' => "(GMT+01:00) Budapest",
            'Europe/Copenhagen' => "(GMT+01:00) Copenhagen",
            'Europe/Ljubljana' => "(GMT+01:00) Ljubljana",
            'Europe/Madrid' => "(GMT+01:00) Madrid",
            'Europe/Paris' => "(GMT+01:00) Paris",
            'Europe/Prague' => "(GMT+01:00) Prague",
            'Europe/Rome' => "(GMT+01:00) Rome",
            'Europe/Sarajevo' => "(GMT+01:00) Sarajevo",
            'Europe/Skopje' => "(GMT+01:00) Skopje",
            'Europe/Stockholm' => "(GMT+01:00) Stockholm",
            'Europe/Vienna' => "(GMT+01:00) Vienna",
            'Europe/Warsaw' => "(GMT+01:00) Warsaw",
            'Europe/Zagreb' => "(GMT+01:00) Zagreb",
            'Europe/Athens' => "(GMT+02:00) Athens",
            'Europe/Bucharest' => "(GMT+02:00) Bucharest",
            'Africa/Cairo' => "(GMT+02:00) Cairo",
            'Africa/Harare' => "(GMT+02:00) Harare",
            'Europe/Helsinki' => "(GMT+02:00) Helsinki",
            'Europe/Istanbul' => "(GMT+02:00) Istanbul",
            'Asia/Jerusalem' => "(GMT+02:00) Jerusalem",
            'Europe/Kiev' => "(GMT+02:00) Kyiv",
            'Europe/Minsk' => "(GMT+02:00) Minsk",
            'Europe/Riga' => "(GMT+02:00) Riga",
            'Europe/Sofia' => "(GMT+02:00) Sofia",
            'Europe/Tallinn' => "(GMT+02:00) Tallinn",
            'Europe/Vilnius' => "(GMT+02:00) Vilnius",
            'Asia/Baghdad' => "(GMT+03:00) Baghdad",
            'Asia/Kuwait' => "(GMT+03:00) Kuwait",
            'Africa/Nairobi' => "(GMT+03:00) Nairobi",
            'Asia/Riyadh' => "(GMT+03:00) Riyadh",
            'Asia/Tehran' => "(GMT+03:30) Tehran",
            'Europe/Moscow' => "(GMT+04:00) Moscow",
            'Asia/Baku' => "(GMT+04:00) Baku",
            'Europe/Volgograd' => "(GMT+04:00) Volgograd",
            'Asia/Muscat' => "(GMT+04:00) Muscat",
            'Asia/Tbilisi' => "(GMT+04:00) Tbilisi",
            'Asia/Yerevan' => "(GMT+04:00) Yerevan",
            'Asia/Kabul' => "(GMT+04:30) Kabul",
            'Asia/Karachi' => "(GMT+05:00) Karachi",
            'Asia/Tashkent' => "(GMT+05:00) Tashkent",
            'Asia/Kolkata' => "(GMT+05:30) Kolkata",
            'Asia/Kathmandu' => "(GMT+05:45) Kathmandu",
            'Asia/Yekaterinburg' => "(GMT+06:00) Ekaterinburg",
            'Asia/Almaty' => "(GMT+06:00) Almaty",
            'Asia/Dhaka' => "(GMT+06:00) Dhaka",
            'Asia/Novosibirsk' => "(GMT+07:00) Novosibirsk",
            'Asia/Bangkok' => "(GMT+07:00) Bangkok",
            'Asia/Jakarta' => "(GMT+07:00) Jakarta",
            'Asia/Krasnoyarsk' => "(GMT+08:00) Krasnoyarsk",
            'Asia/Chongqing' => "(GMT+08:00) Chongqing",
            'Asia/Hong_Kong' => "(GMT+08:00) Hong Kong",
            'Asia/Kuala_Lumpur' => "(GMT+08:00) Kuala Lumpur",
            'Australia/Perth' => "(GMT+08:00) Perth",
            'Asia/Singapore' => "(GMT+08:00) Singapore",
            'Asia/Taipei' => "(GMT+08:00) Taipei",
            'Asia/Ulaanbaatar' => "(GMT+08:00) Ulaan Bataar",
            'Asia/Urumqi' => "(GMT+08:00) Urumqi",
            'Asia/Irkutsk' => "(GMT+09:00) Irkutsk",
            'Asia/Seoul' => "(GMT+09:00) Seoul",
            'Asia/Tokyo' => "(GMT+09:00) Tokyo",
            'Australia/Adelaide' => "(GMT+09:30) Adelaide",
            'Australia/Darwin' => "(GMT+09:30) Darwin",
            'Asia/Yakutsk' => "(GMT+10:00) Yakutsk",
            'Australia/Brisbane' => "(GMT+10:00) Brisbane",
            'Australia/Canberra' => "(GMT+10:00) Canberra",
            'Pacific/Guam' => "(GMT+10:00) Guam",
            'Australia/Hobart' => "(GMT+10:00) Hobart",
            'Australia/Melbourne' => "(GMT+10:00) Melbourne",
            'Pacific/Port_Moresby' => "(GMT+10:00) Port Moresby",
            'Australia/Sydney' => "(GMT+10:00) Sydney",
            'Asia/Vladivostok' => "(GMT+11:00) Vladivostok",
            'Asia/Magadan' => "(GMT+12:00) Magadan",
            'Pacific/Auckland' => "(GMT+12:00) Auckland",
            'Pacific/Fiji' => "(GMT+12:00) Fiji",
        );

        return $timezones;
    }
}