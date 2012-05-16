<div class="page-header">
    <h1>{$core->module.title}</h1>
</div>

<div class="row-fluid">
    <div class="span9">
        <form class="form-horizontal" action="" method="POST">
            <input type="hidden" name="action" value="add_car">
            <input type="hidden" name="step" value="{$core->module.form.step}">

            {if $core->module.form.step == 1}
                <div class="progress progress-striped">
                    <div class="bar" style="width: {(100/3*$core->module.form.step)}%;">Шаг {$core->module.form.step} из 3</div>
                </div>
            {/if}

            {if isset($core->module.form.message)}
                <div class="alert {if $core->module.form.status}alert-success{else}alert-error{/if}">
                    <a class="close" data-dismiss="alert" href="javascript:void(0)">×</a>
                    {$core->module.form.message}
                </div>
            {/if}

            <fieldset>
            {if $core->module.form.step == 1}
                <div class="control-group">
                    <label class="control-label" for="secret">Идентификатор</label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="secret" name="secret" value="">
                    </div>
                </div>
            {/if}

            {if $core->module.form.step == 2}
                <div class="control-group">
                    <label class="control-label" for="name">Название</label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="name" name="name">
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="make">Марка</label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="make" name="make">
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="model">Модель</label>
                    <div class="controls">
                        <input type="text" class="input-xlarge" id="model" name="model">
                    </div>
                </div>
            {/if}

            {if $core->module.form.step == 3}
                ыыы
            {/if}
            </fieldset>

            <div class="form-actions">
                <button id="submit" type="submit" class="btn btn-primary" autocomplete="off">{$core->module.form.submit_text}</button>
            </div>
        </form>
    </div>
    <div class="span3">
        <p>{$core->module.form.tip}</p>

        {$core->module.form|print_r}
    </div>
</div>