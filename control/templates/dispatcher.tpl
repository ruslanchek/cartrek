<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}
        <script src="https://maps.google.com/maps/api/js?sensor=false"></script>
    </head>

    <body>
        <div id="wrapper">
            <div class="limiter">
                {include file="common/top.tpl"}

                <div class="container h1">
                    <div class="container-padding">
                        <h1>{$core->module.title}</h1>
                    </div>
                </div>

                <div class="container main-content">
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