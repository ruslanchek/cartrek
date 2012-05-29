<div class="page-header">
    <h1>{$core->module.title}</h1>
</div>

<div class="row-fluid">
    <div class="span9">
        <form id="add_car_form" class="form-horizontal" action="" method="POST">
            <input type="hidden" name="action" value="add_car">
            <input type="hidden" name="step" value="{$core->module.form.step}">

            <div class="progress progress-striped{if $core->module.form.step == 'finish'} progress-success{/if} ">
                <div class="bar" style="width: {(100/4*$core->module.form.step)}%;">Шаг {$core->module.form.step} из 4</div>
            </div>

            {if isset($core->module.form.message)}
                <div class="alert {if $core->module.form.status}alert-success{else}alert-error{/if}">
                    <a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>
                    {$core->module.form.message}
                </div>
            {/if}

            <fieldset>
            {if $core->module.form.step == 1}
                <div class="control-group">
                    <label class="control-label" for="code">Серийный номер</label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="code" name="code" value="{if isset($smarty.session.add_car.fields.code)}{$smarty.session.add_car.fields.code}{/if}">
                    </div>
                </div>
            {/if}

            {if $core->module.form.step == 2}
                <div class="control-group">
                    <label class="control-label" for="name">Название</label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="name" name="name" value="{if isset($smarty.session.add_car.fields.name)}{$smarty.session.add_car.fields.name}{/if}">
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="make">Марка</label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" autocomplete="off" id="make" name="make" value="{if isset($smarty.session.add_car.fields.make)}{$smarty.session.add_car.fields.make}{/if}">
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="model">Модель</label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="model" name="model" value="{if isset($smarty.session.add_car.fields.model)}{$smarty.session.add_car.fields.model}{/if}">
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="g_id">Госномер</label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="g_id" name="g_id" value="{if isset($smarty.session.add_car.fields.g_id)}{$smarty.session.add_car.fields.g_id}{/if}">
                    </div>
                </div>
            {/if}

            {if $core->module.form.step == 3}
                ыыы
            {/if}

            {if $core->module.form.step == 4}
                ыыы1
            {/if}
            </fieldset>

            <div class="form-actions">
                {if isset($core->module.form.back_btn) && $core->module.form.back_btn}<button type="submit" name="back" class="btn" autocomplete="off">Назад</button>{/if}
                <button id="submit" type="submit" class="btn btn-primary" autocomplete="off">{$core->module.form.submit_text}</button>
            </div>
        </form>
    </div>
    <div class="span3">
        <div class="alert alert-info">{$core->module.form.tip}</div>

        {*$core->module.form|print_r*}
    </div>
</div>