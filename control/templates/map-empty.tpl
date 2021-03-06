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
                    <div class="container-padding">
                        <h1>Нет доступных устройств для наблюдения</h1>
                    </div>
                </div>

                <div class="cont main-content">
                    <div class="row container-padding">
                        <div class="alert alert-block">
                            <h4 class="alert-heading">Внимание!</h4>
                            У вас нет активных устройств для отслеживания, необходимо <a href="/control/user/fleet/add">добавить</a> или активировать устройство.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {include file="common/footer.tpl"}
    </body>
</html>