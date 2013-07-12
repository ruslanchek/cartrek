<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}

        <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />

        <!--[if lte IE 8]>
        <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
        <![endif]-->

        <script src="/control/resources/mapping-tools/leaflet/dist/leaflet.js"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>

        <script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Google.js"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Bing.js"></script>

        <script type="text/javascript" src="/control/resources/plugins/chartjs/knockout-2.2.1.js"></script>
        <script type="text/javascript" src="/control/resources/plugins/chartjs/globalize.js"></script>
        <script type="text/javascript" src="/control/resources/plugins/chartjs/dx.chartjs.js"></script>
    </head>

    <body>
        <div id="wrapper">
            <div class="limiter">
                {include file="common/top.tpl"}

                <div class="cont h1">
                    <div class="container-padding">
                        <h1>{$core->module.title}<span id="current-fleet-and-car"></span></h1>
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