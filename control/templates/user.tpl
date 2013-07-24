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
            <div class="row-fluid">
                <div class="span9">
                    {include file="modules/`$core->module.name`.tpl"}
                </div>
                <div class="span3">
                    {include file="modules/user.menu.tpl"}
                </div>
            </div>
        </div>
    </div>
</div>

{include file="common/footer.tpl"}
</body>
</html>