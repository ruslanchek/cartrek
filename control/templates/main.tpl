<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        {include file="common/head.tpl"}
    </head>

    <body>
        <div class="wrapper">
            {include file="common/top.tpl"}

            <div class="middle-container">
                <div class="container">
                    {include file="modules/`$core->module.name`.tpl"}
                </div>
            </div>
        </div>

        {include file="common/footer.tpl"}
    </body>
</html>