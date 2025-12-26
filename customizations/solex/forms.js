state.listenForAction('FORM_FIELD_BLUR').subscribe((data) => {
    data = JSON.parse(data);
    const fieldValue = $(`[data-form-element="${data.formFieldIdx}"`).val();

    if (!fieldValue && !data.config.optional) {
        u.toast.showError({ msg: 'value not provided', direction: 'topRight' });
    } else if (fieldValue < data.config.min_value_allowed) {
        u.toast.showError({ msg: 'value out of range (min)', direction: 'topRight' });
    } else if (fieldValue > data.config.max_value_allowed) {
        u.toast.showError({ msg: 'value out of range (max)', direction: 'topRight' });
    }
});
