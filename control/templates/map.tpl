<!DOCTYPE HTML>
<html>
    <head>
        {include file="common/head.tpl"}

        <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />
        <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/plugins/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.css" />

        <!--[if lte IE 8]>
        <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
        <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/plugins/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.ie.css" />
        <![endif]-->

        <script src="/control/resources/mapping-tools/leaflet/dist/leaflet.js"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-locatecontrol-gh-pages/src/L.Control.Locate.js"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js"></script>

        <script src="https://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Google.js"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Bing.js"></script>

        <script src="/control/resources/js/prototypes.map.js"></script>
    </head>

    <body>
        <div id="wrapper">
            <div class="limiter">
                {include file="common/top.tpl"}

                <div class="global-left">
                    {include file="common/side-menu.tpl"}
                </div>

                <div class="global-right">
                    <div class="cont main-content" style="padding: 0">
                        {include file="modules/`$core->module.name`.tpl"}
                    </div>
                </div>
            </div>
        </div>

        {include file="common/footer.tpl"}
    </body>
</html>