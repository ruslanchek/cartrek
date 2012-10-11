<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>

<div class="threequarter">
    <h2>{$core->module.title}</h2>
    <h1>{$core->auth->user.data.balance|price} руб.</h1>
    <br>
    <a href="#" class="btn btn-primary btn-large">Пополнить</a>
</div>