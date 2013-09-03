define(['marionette', 'underscore', 'text!templates/account/profile/edit.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),

        events: {
            //'click .scheduleLink': 'goTocompleteReservation'
        },

        goTocompleteReservation: function (evt) {
            evt.preventDefault();
            var url = 'restaurans/5/complete-reservation';
            app.router.navigate(url, { trigger: true });
        }
    });

    return ItemView;
});