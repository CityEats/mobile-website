define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/confirmed.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        events: {
            'click .btnCancel': 'goToCanceled'
        },

        goToCanceled: function (evt) {
            evt.preventDefault();
            var url = 'restaurants/5/reservation-canceled';
            app.router.navigate(url, { trigger: true });
        }
    });

    return ItemView;
});