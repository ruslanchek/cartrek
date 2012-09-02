<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}

        <script src="https://maps.google.com/maps/api/js?sensor=false"></script>
    </head>
    <body>
        {include file="common/top_nav.tpl"}

        <div class="container-fluid main_content">
            {include file="modules/`$core->module.name`.tpl"}
            <div class="clear"></div>
        </div>
    </body>
</html>