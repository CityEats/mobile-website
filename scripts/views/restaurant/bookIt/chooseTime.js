define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/chooseTime.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        events: {
            'click .datePicker': 'datePickerClick',
        },
        datePickerClick: function (evt) {
            evt.preventDefault();
            this.trigger('datePickerClicked', this.model.get('date'));
        },
    });

    return ItemView;
});