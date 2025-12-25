state.listenForAction('FORM_FIELD_BLUR').subscribe((data) => {
    data = JSON.parse(data);
    const fieldValue = $(`[data-form-element="${data.formFieldIdx}"`).val();

    if (!fieldValue && !data.config.optional) {
        console.log('value not provided');
    } else if (fieldValue < data.config.min_value_allowed) {
        console.log('value out of range (min)');
    } else if (fieldValue > data.config.max_value_allowed) {
        console.log('value out of range (max)');
    }
});
