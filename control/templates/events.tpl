<!DOCTYPE HTML>
<html>
    <head>
        {include file="common/head.tpl"}
    </head>

    <body>
        <div id="wrapper">
            <div class="limiter">
                {include file="common/top.tpl"}

                <div class="global-left">
                    {include file="common/side-menu.tpl"}
                </div>

                <div class="global-right">
                    <div class="cont h1">
                        <div class="container-padding">
                            <h1>События<span id="events_type_header_suffix"> / Непросмотренные</span></h1>
                        </div>
                    </div>

                    <div class="cont main-content">
                        <div class="row container-padding">
                            {include file="modules/`$core->module.name`.tpl"}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {include file="common/footer.tpl"}
    </body>
</html>