<div class="threequarter">
    <form class="forms" action="" method="POST">
        <div class="form-item">
            <label for="category" class="bold">Категория вопроса или обращения</label>
            <select name="category" id="category">
                <option value="1">Общие вопросы</option>
                <option value="2">Техническая поддержка</option>
                <option value="3">Финансовые вопросы</option>
                <option value="4">Помощь по работе в системе</option>
            </select>
        </div>

        <div class="form-item">
            <label for="name" class="bold">Представьтесь</label>
            <input class="text" type="text" name="name" id="name" {*autofocus="autofocus"*} value="{$core->auth->user.data.name}" />
        </div>

        <div class="form-item">
            <label for="name" class="bold">Контактный e-mail</label>
            <input class="text" type="text" name="email" id="email" value="{$core->auth->user.data.email}" />
        </div>

        <div class="form-item">
            <section>
                <label for="message" class="bold">Ваше сообщение</label>
            </section>
            <textarea autofocus="autofocus" class="width-100" style="height: 15em;" name="message" id="message"></textarea>
        </div>

        <input type="submit" name="send" class="btn" value="Отправить" />
    </form>
</div>

<div class="quarter">
    {include file="modules/about.menu.tpl"}
</div>