define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/nextDay.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        className: 'btnHolder',
        events: {
            'click .btn': 'btnClick'
        },

        btnClick: function (evt) {
            evt.preventDefault();
            this.trigger('dateSelected', this.model.get('key'));
        },

        //btnFirstDayClick: function (evt) {
        //    evt.preventDefault();
        //    this.selectDate(this.days[0].date);
        //},

        //btnSecondDayClick: function (evt) {
        //    evt.preventDefault();
        //},

        //btnThirdDayClick: function (evt) {
        //    evt.preventDefault();
        //},

        //selectDate: function (selectedDate) {
        //    this.trigger('dateSelected', selectedDate);
        //}
    });

    return ItemView;
});