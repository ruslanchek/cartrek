<?php
function smarty_modifier_price($string)
{
    $string = floatval($string);
    $string = round($string, 2);
    return number_format($string, 2, ',', ' ');
} 
?>