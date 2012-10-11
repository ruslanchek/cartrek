<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" class="auth_body">
    <head>
        {include file="common/head.tpl"}
    </head>
    <body>
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container-fluid">
                    <a class="brand logo" href="/control" title="Картек"></a>
                </div>
            </div>
        </div>

        <div class="container-fluid main_content">
            {include file="modules/`$core->module.name`.tpl"}
        </div>
    </body>
</html>