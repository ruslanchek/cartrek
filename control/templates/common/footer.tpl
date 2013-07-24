<footer>
    <div class="bottom-menu mbl bottom-container">
        <div class="container">
            <div class="row-fluid">
                <div class="span3 brand">
                    {if $core->module.name == 'main'}
                    <span class="cartrek-logo"></span>
                    {else}
                    <a href="/control" class="cartrek-logo"></a>
                    {/if}
                </div>

                <div class="span6">
                    <ul class="bottom-links">
                        <li><a href="#" class="tour-start">Помощь</a></li>
                        <li><a href="/control/about">О Картреке</a></li>
                        <li><a href="/control/about/feedback">Обратная связь</a></li>
                    </ul>
                </div>

                <div class="span3 text-right">
                    &copy; 2012&ndash;{date('Y')}, ГИС &laquo;Картрек&raquo;.
                </div>
            </div>
        </div>
    </div>
</footer>