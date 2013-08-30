<!DOCTYPE HTML>
<html>
    <head>
        {include file="common/head.tpl"}
    </head>

    <body>
        <div id="wrapper">
            <div class="limiter">
                {include file="common/top.tpl"}

                <div class="cont h1">
                    <div class="container-padding header-block">
                        <h1>{$core->module.title}</h1>
                    </div>
                </div>

                <div class="row container-padding">
                    {include file="modules/`$core->module.name`.tpl"}
                </div>
            </div>
        </div>

        {include file="common/footer.tpl"}
    </body>
</html>