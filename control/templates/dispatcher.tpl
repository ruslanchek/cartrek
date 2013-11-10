<!DOCTYPE html>
<html style="background: #2e2c30;">
    <head>
        <title>Title</title>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="stylesheet" href="/control/resources/css/main.css" />

        <script src="http://code.jquery.com/jquery.min.js"></script>
        <script src="/control/resources/plugins/select/select.js"></script>
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
            </div>
        </div>
    </body>
</html>