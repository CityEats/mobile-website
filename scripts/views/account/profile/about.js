define(['marionette', 'app', 'underscore', 'text!templates/account/profile/about.html'], function (Marionette, app, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),

        events: {
            'click .btnEdit': 'goToEdit',
            'click .tabsLink.active': 'goToVoid',
            'click .btnReservations': 'btnReservationsClick',
        },

        templateHelpers: {
            neighborhoods: function () {
                return this.favorite_neighborhoods.length > 0 ? this.favorite_neighborhoods.split(',') : '';
            },

            cuisines: function () {
                return this.favorite_cuisine_types.length > 0 ? this.favorite_cuisine_types.split(',') : '';
            }
        },

        goToEdit: function (evt) {
            evt.preventDefault();
            var url = 'profile/edit';
            app.router.navigate(url, { trigger: true });
        },

        btnReservationsClick: function (evt) {
            evt.preventDefault();
            app.vent.trigger('showLoading');
            app.router.navigate('profile/reservations', { trigger: true });
        },

        goToVoid: function (evt) {
            evt.preventDefault();
        }
    });

    return ItemView;
});