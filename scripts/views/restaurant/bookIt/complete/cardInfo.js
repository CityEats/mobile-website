define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/cardInfo.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        events: {
            'click .btnComplete': 'goToConfirmed'
        },

        goToConfirmed: function (evt) {
            evt.preventDefault();
            var url = 'restaurans/5/reservation-confirmed';
            app.router.navigate(url, { trigger: true });
        },
    });

    return ItemView;
});