define(['marionette', 'underscore', 'text!templates/account/reservations/item.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        tagName: 'li',
        className: 'accountReservationItem',
        events: {
            'click .accountReservationLink': 'goToReservation'
        },

        goToReservation: function (evt) {
            evt.preventDefault();
            var url = 'profile/reservations/' + this.model.get('order_id');

            app.router.navigate(url, { trigger: true });
        }
    });

    return ItemView;
});