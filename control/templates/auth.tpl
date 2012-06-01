<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}

        <style>
            body {
                background: url(/control/resources/img/bg/logo.png) no-repeat center 10px;
                padding: 170px 0 0 0;
            }

            hr {
                opacity: 0.2;
            }
        </style>
    </head>
    <body>
        <div class="container-fluid main_content">
            {include file="modules/`$core->module.name`.tpl"}
        </div>
    </body>
</html>