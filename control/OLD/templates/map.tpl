<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <script src="https://maps.google.com/maps/api/js?sensor=false"></script>
        {include file="common/head.tpl"}
    </head>
    <body>
        {include file="common/top_nav.tpl"}

        <div class="container-fluid main_content">
            {include file="modules/`$core->module.name`.tpl"}
            <div class="clear"></div>
        </div>
    </body>
</html>