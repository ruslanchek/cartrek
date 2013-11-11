<!DOCTYPE html>
<html style="background: #2e2c30;">
    <head>
        {include file="common/head.tpl"}

        <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.css" />

        <!--[if lte IE 8]>
        <link rel="stylesheet" href="/control/resources/mapping-tools/leaflet/dist/leaflet.ie.css" />
        <![endif]-->

        <script src="/control/resources/mapping-tools/leaflet/dist/leaflet.js"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/proto/proto.js"></script>

        <script src="https://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Google.js"></script>
        <script src="/control/resources/mapping-tools/leaflet/plugins/tiles/Bing.js"></script>

        <script src="/control/resources/js/prototypes.map.js"></script>
    </head>

    <body>
        {include file="common/header.tpl"}

        <div class="main-frame">
            <div class="nav-tools">
                {include file="common/menu.tpl"}
            </div>

            <div class="content-block">
                <div class="content-header">
                    <h1>{$core->module.title}</h1>
                </div>

                {include file="common/breadcrumbs.tpl"}

                {include file="modules/`$core->module.name`.tpl"}
            </div>
        </div>
    </body>
</html>