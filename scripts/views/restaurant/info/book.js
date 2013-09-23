define(['marionette', 'underscore', 'text!templates/restaurant/info/book.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),

        events: {
            'click .scheduleLink': 'goToCompleteReservation'
        },

        goToCompleteReservation: function (evt) {
            evt.preventDefault();
            var url = 'restaurants/5/complete-reservation';
            app.router.navigate(url, { trigger: true });
        }
    });

    return ItemView;
});