<div class="threequarter">
    <form id="pay-form" class="forms" action="https://www.moneta.ru/assistant.htm" method="POST">
        <h2>Оплата</h2>

        <div class="form_message"></div>
        <div class="form-item">
            <label for="old_password" class="bold">Сумма платежа <span class="error"></span></label>
            <input
                    class="text width-100"
                    type="text"
                    name="MNT_AMOUNT"
                    id="MNT_AMOUNT"
                    value="1.00"
                    />
        </div>

        <input type="submit" name="send" class="btn blue" value="Оплатить" />

        <input type="hidden" name="MNT_ID"              value="41534771" />
        <input type="hidden" name="MNT_TRANSACTION_ID"  value="" />
        <input type="hidden" name="MNT_CURRENCY_CODE"   value="RUB" />
        <input type="hidden" name="MNT_TEST_MODE"       value="1" />
        <input type="hidden" name="MNT_DESCRIPTION"     value="Test payment" />
    </form>
</div>

<div class="quarter">
    {include file="modules/user.menu.tpl"}
</div>