
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
                value="{$transaction_data->MNT_AMOUNT}"
                />
    </div>

    <input type="submit" name="send" class="btn blue" value="Оплатить" />

    <input type="hidden" name="MNT_ID"              value="{$transaction_data->MNT_ID}" />
    <input type="hidden" name="MNT_TRANSACTION_ID"  value="{$transaction_data->MNT_TRANSACTION_ID}" />
    <input type="hidden" name="MNT_CURRENCY_CODE"   value="{$transaction_data->MNT_CURRENCY_CODE}" />
    <input type="hidden" name="MNT_TEST_MODE"       value="{$transaction_data->MNT_TEST_MODE}" />
    <input type="hidden" name="MNT_DESCRIPTION"     value="{$transaction_data->MNT_DESCRIPTION}" />
    <input type="hidden" name="MNT_SIGNATURE"       value="{$transaction_data->MNT_SIGNATURE}" />
</form>
