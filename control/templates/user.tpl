<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}
    </head>

    <body>
        <div id="wrapper">
            <div class="limiter">
                {include file="common/top.tpl"}

                <div class="cont h1">
                    <div class="container-padding header-block">
                        <h1>Настройка{if $core->module.title}<span> / {$core->module.title}</span>{/if}{$core->module.header_additional}</h1>
                    </div>
                </div>

                <div class="cont main-content">
                    <div class="row container-padding">
                        {include file="modules/`$core->module.name`.tpl"}
                    </div>
                </div>
            </div>
        </div>

        <footer>
            {include file="common/footer.tpl"}
        </footer>
    </body>
</html>