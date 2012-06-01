<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}

        <style>
            .main_content {
                background: url(/control/resources/img/bg/logo.png) no-repeat center 20px;
                padding-top: 180px;
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