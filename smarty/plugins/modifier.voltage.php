<?php
function smarty_modifier_voltage($value)
{
    return round(($value*4.6*11)/4096, 2);
} 
?>