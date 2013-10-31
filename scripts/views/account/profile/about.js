define(['marionette', 'underscore', 'text!templates/account/profile/about.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),

        events: {
            'click .btnEdit': 'goToEdit',
            'click .tabsLink.active': 'goToVoid',
            'click .btnReservations': 'btnReservationsClick',
        },

        goToEdit: function (evt) {
            evt.preventDefault();
            var url = 'profile/edit';
            app.router.navigate(url, { trigger: true });
        },

        btnReservationsClick: function (evt) {
            evt.preventDefault();
            app.router.navigate('profile/reservations', { trigger: true });
        },

        goToVoid: function (evt) {
            evt.preventDefault();
        }
    });

    return ItemView;
});