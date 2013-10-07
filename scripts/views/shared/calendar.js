define(['app', 'marionette', 'underscore', 'text!templates/shared/calendar.html'], function (app, Marionette, _, calendarHtml) {
    
    var ItemView = Marionette.ItemView.extend({
        template: _.template(calendarHtml),
        ui: {
            date: '#datepicker',
        },

        onRender: function () {
            var that = this,
                datepicker = this.ui.date;

            this.ui.date.datepicker({
                minDate: new Date(),
                maxDate: "+90d",
                dateFormat: 'yy-mm-dd',
                nextText: '&#9658',
                prevText: '&#9668',
                onSelect: function (dateText) {
                    var selectedDate = datepicker.datepicker('getDate');                    
                    that.trigger('dateSelected', selectedDate);
                }
            });

            if (this.options.date) {
                this.ui.date.datepicker('setDate', this.options.date);
            }
        }
    });

    return ItemView;
});