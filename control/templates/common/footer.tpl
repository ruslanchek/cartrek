<div class="container {if isset($map) && $map == true}wide{/if}">
    <div class="container-padding">
        <div class="third">
            &copy; 2012&ndash;{date('Y')}, ГИС &laquo;Картрек&raquo;.
        </div>

        <div class="third">
            {if $core->module.name == 'main'}
                <span title="Картрек" class="bottom-logo">Картрек</span>
            {else}
                <a title="Картрек" class="bottom-logo" href="/control">Картрек</a>
            {/if}
        </div>

        <div class="third text-right">
            <a href="/control/about">О Картреке</a>
            <a href="/control/about/feedback">Обратная связь</a>
        </div>
    </div>
</div>