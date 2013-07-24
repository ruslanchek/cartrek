<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}
    </head>

    <body>
        <div id="wrapper">
            <div class="limiter">
                {include file="common/top.tpl"}

                <div class="row container-padding">
                    {include file="modules/`$core->module.name`.tpl"}
                </div>
            </div>
        </div>

        <footer>
            {include file="common/footer.tpl"}
        </footer>
    </body>
</html>