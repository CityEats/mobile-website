define(['marionette', 'underscore', 'text!templates/account/profile/edit.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),

        events: {
            'click .byNeighborhoods': 'byNeighborhoodsClicked',
            'click .byCuisines': 'byCuisinesClicked',
            'click .btnSubmit': 'btnSubmitClicked',
        },

        ui: {
            txtFirstName: '.txtFirstName',
            txtLastName: '.txtLastName',
            txtEmail: '.txtEmail',
            txtPhone: '.txtPhone'
        },

        templateHelpers: {
            neighborhoodsClass: function () {
                return this.favorite_neighborhoods && this.favorite_neighborhoods.length > 0 ? "updated" : "";
            },
            cuisinesClass: function () {
                return this.favorite_cuisine_types && this.favorite_cuisine_types.length > 0 ? "updated" : "";
            },
            neighborhoods: function () {
                return this.favorite_neighborhoods && this.favorite_neighborhoods.length > 0 ? this.favorite_neighborhoods : "Favorite Neighborhoods";
            },
            cuisines: function () {
                return this.favorite_cuisine_types && this.favorite_cuisine_types.length > 0 ? this.favorite_cuisine_types : "Favourite Cuisines";
            }
        },

        btnSubmitClicked: function (evt) {
            this.model.set('first_name', this.ui.txtFirstName.val());
            this.model.set('last_name', this.ui.txtLastName.val());
            this.model.set('email', this.ui.txtEmail.val());
            this.model.set('phone_number', this.ui.txtPhone.val());            
            this.trigger('userSaved');
        },

        byNeighborhoodsClicked: function (evt) {
            evt.preventDefault();
            var url = 'profile/neighborhoods';
            app.router.navigate(url, { trigger: true });
        },

        byCuisinesClicked: function (evt) {
            evt.preventDefault();
            var url = 'profile/cuisines';
            app.router.navigate(url, { trigger: true });
        }
    });

    return ItemView;
});