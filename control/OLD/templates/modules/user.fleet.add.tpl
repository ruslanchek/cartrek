<div class="page-header">
    <h1>{$core->module.title}</h1>
</div>

{include file="modules/user.menu.tpl"}

<div class="row-fluid">
    {if $core->module.form.step == 1}
        <div class="span9">
            <form id="add_car_form" class="form-horizontal" action="" method="POST">
                <input type="hidden" name="action" value="add_car">
                <input type="hidden" name="step" value="1">

                <div class="progress progress-striped">
                    <div class="bar" style="width: 33%;">Шаг 1 из 3</div>
                </div>

                {if isset($core->module.form.message)}
                    <div class="alert {if $core->module.form.status}alert-success{else}alert-error{/if}">
                        <a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>
                        {$core->module.form.message}
                    </div>
                {/if}

                <fieldset>
                    <div class="control-group">
                        <label class="control-label" for="code">Серийный номер</label>
                        <div class="controls">
                            <input type="text" class="input-xlarge" id="code" name="code" value="{if isset($smarty.session.add_car.code)}{$smarty.session.add_car.code|escape}{elseif isset($smarty.post.code)}{$smarty.post.code|escape}{/if}">
                        </div>
                    </div>
                </fieldset>

                <div class="form-actions">
                    <button id="submit" type="submit" class="btn btn-primary" autocomplete="off">Далее</button>
                </div>
            </form>
        </div>
        <div class="span3">
            <div class="alert alert-info">
                <h3>Подсказка</h3>
                <p>
                    Серийный номер написан на карточке, вложенной в коробку с комплектом трекера.
                    Если вы не получали такой карточки, обратитесь к диллеру.
                </p>
            </div>
        </div>
    {/if}


    {if $core->module.form.step == 2}
        <div class="span9">
            <form id="add_car_form" class="form-horizontal" action="" method="POST">
                <input type="hidden" name="action" value="add_car">
                <input type="hidden" name="step" value="2">

                <div class="progress progress-striped">
                    <div class="bar" style="width: 66%;">Шаг 2 из 3</div>
                </div>

                {if isset($core->module.form.message)}
                    <div class="alert {if $core->module.form.status}alert-success{else}alert-error{/if}">
                        <a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>
                        {$core->module.form.message|escape}
                    </div>
                {/if}

                <fieldset>
                    <div class="control-group">
                        <label class="control-label" for="name">Название</label>
                        <div class="controls">
                            <input type="text" class="input-xlarge" id="name" name="name" value="{if isset($smarty.session.add_car.name)}{$smarty.session.add_car.name|escape}{elseif isset($smarty.post.name)}{$smarty.post.name|escape}{/if}">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="make">Марка</label>
                        <div class="controls">
                            <input type="text" class="input-xlarge" autocomplete="off" id="make" name="make" value="{if isset($smarty.session.add_car.make)}{$smarty.session.add_car.make|escape}{elseif isset($smarty.post.make)}{$smarty.post.make|escape}{/if}">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="model">Модель</label>
                        <div class="controls">
                            <input type="text" class="input-xlarge" id="model" name="model" value="{if isset($smarty.session.add_car.model)}{$smarty.session.add_car.model|escape}{elseif isset($smarty.post.model)}{$smarty.post.model|escape}{/if}">
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="g_id">Госномер</label>
                        <div class="controls">
                            <input type="text" maxlength="10" class="input-xlarge" id="g_id" name="g_id" value="{if isset($smarty.session.add_car.g_id)}{$smarty.session.add_car.g_id|escape}{elseif isset($smarty.post.g_id)}{$smarty.post.g_id|escape}{/if}">
                            <div class="help-inline" style="position: relative;"> &rarr; <span id="g_id_preview"><span class="g_id big default"><i class="shade"></i><span class="id"></span></span></span></div>
                            <script>{literal}$(function(){$('#g_id_preview').html(core.utilities.drawGId($('#g_id').val(), 'big'))}){/literal}</script>
                        </div>
                    </div>
                </fieldset>

                <div class="form-actions">
                    <button type="submit" name="back" class="btn" autocomplete="off">Назад</button>
                    <button id="submit" type="submit" class="btn btn-primary" autocomplete="off">Далее</button>
                </div>
            </form>
        </div>
        <div class="span3">
            <div class="alert alert-info">
                <h3>Подсказка</h3>
                <p>
                    Вводите госномер «как есть», он автоматически будет сконвертирован и отображен в графическом виде.
                </p>
                <p>
                    <div style="float: left; margin-right: 5px"><input readonly style="width: 60px; background: white; text-align: center; height: 18px; padding: 0 2px; margin-bottom: 0; font-size: 12px;" type="text" class="input" value="а000аа77"> &rarr; </div>
                    <span style="float: left; display: block;" id="demo_g_id"></span>
                    <div class="clear"></div>
                </p>
                
                <script>
                    {literal}
                        $(function(){
                            $('#demo_g_id').html(core.utilities.drawGId('а000аа77', 'small'));
                        });
                    {/literal}
                </script>
            </div>
        </div>
    {/if}

    {if $core->module.form.step == 3}
        <div class="span9">
            <div class="progress progress-striped progress-success">
                <div class="bar" style="width: 100%;">Шаг 3 из 3</div>
            </div>

            {if isset($core->module.form.message)}
                <div class="alert {if $core->module.form.status}alert-success{else}alert-error{/if}">
                    {$core->module.form.message}
                </div>
            {/if}

        </div>
        <div class="span3">
            <div class="alert alert-info">

            </div>
        </div>
    {/if}
</div>