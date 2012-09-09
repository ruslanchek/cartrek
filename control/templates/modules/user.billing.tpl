<div class="page-header">
    <h1>{$core->module.title}</h1>
</div>

{include file="modules/user.menu.tpl"}

<div class="hero-unit">
    <h2>На вашем счете</h2>
    <h1>{$core->auth->user.data.balance|price} руб.</h1>
    <br>
    <a href="#" class="btn btn-primary btn-large">Пополнить</a>
</div>