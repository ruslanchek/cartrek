{if $core->page.form.message}
    <div class="alert {if $core->page.form.status}alert-success{else}alert-error{/if}">
        {$core->page.form.message}
    </div>
{/if}

<form class="form-horizontal" action="?action=go" method="POST">
    <fieldset>
        <div class="control-group">
            <label class="control-label" for="email">Email</label>
            <div class="controls">
                <input type="text" class="input-xlarge" id="email" name="email">
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="captcha_code">Код с картинки</label>

            <div class="controls captcha">
                <input type="text" class="input-xlarge" id="captcha_code" name="captcha_code" />

                <div class="clear" style="margin-top: 20px"></div>
                <img id="captcha" src="/securimage/securimage_show.php?0.15141636761836708" width="216" height="80">
                <a href="javascript:void(0)" onclick="document.getElementById('captcha').src = '/securimage/securimage_show.php?' + Math.random()">Обновить картинку</a>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
            &nbsp;&nbsp;&nbsp;<a href="/auth/">Авторизация</a>
            &nbsp;&nbsp;&nbsp;<a href="/auth/remember_pass/">Напомнить пароль</a>
        </div>
    </fieldset>
</form>