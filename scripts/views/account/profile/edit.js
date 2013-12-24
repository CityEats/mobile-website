define(['marionette', 'underscore', 'basicItemView', 'text!templates/account/profile/edit.html'], function (Marionette, _, BasicItemView, itemHtml) {

    var ItemView = BasicItemView.extend({
        template: _.template(itemHtml),

        events: {
            'click .byNeighborhoods': 'btnByNeighborhoodsClicked',
            'click .byCuisines': 'btnByCuisinesClicked',
            'click .btnSubmit': 'btnSubmitClicked',
        },

        ui: {
            txtFirstName: '.txtFirstName',
            txtFirstNameError: '.txtFirstNameError',
            txtLastName: '.txtLastName',
            txtLastNameError: '.txtLastNameError',
            txtEmail: '.txtEmail',
            txtEmailError: '.txtEmailError',
            txtPhone: '.txtPhone',
            txtPhoneError: '.txtPhoneError'
        },

        templateHelpers: {
            neighborhoodsClass: function () {
                return this.neighborhoodItems && this.neighborhoodItems.length > 0 ? "updated" : "";
            },
            cuisinesClass: function () {
                return this.cuisineItems && this.cuisineItems.length > 0 ? "updated" : "";
            },
            neighborhoods: function () {
                return this.neighborhoodItems && this.neighborhoodItems.length > 0 ? this.neighborhoodItems.map(function (item) { return item.get('value') }).join(', ') : "Favorite Neighborhoods";
            },
            cuisines: function () {
                return this.cuisineItems && this.cuisineItems.length > 0 ? this.cuisineItems.map(function (item) { return item.get('value') }).join(', ') : "Favourite Cuisines";
            }
        },

        serializeData: function () {
            var result = this.model.toJSON();
            return _.extend(
                result,
                {
                    cuisineItems: this.options.cuisineItems,
                    neighborhoodItems: this.options.neighborhoodItems
                });
        },

        btnSubmitClicked: function (evt) {
            var user = {
                first_name: this.ui.txtFirstName.val(),
                last_name: this.ui.txtLastName.val(),
                email: this.ui.txtEmail.val(),
                phone_number: this.ui.txtPhone.val()
            };
            this.trigger('userSaved', user);
        },

        btnByNeighborhoodsClicked: function (evt) {
            evt.preventDefault();
            this.trigger('ByNeighborhoodsClicked');
        },

        btnByCuisinesClicked: function (evt) {
            evt.preventDefault();
            this.trigger('ByCuisinesClicked');
        },

        showErrors: function (err) {
            var errors;
            if (err.responseText && err.responseText.length > 0) {
                errors = JSON.parse(err.responseText);
            }

            if (errors) {
                if (errors.phone_number) this.showError(errors.phone_number.join(', '), this.ui.txtPhone, this.ui.txtPhoneError);
                else this.hideError(this.ui.txtPhone, this.ui.txtPhoneError);

                if (errors.email) this.showError(errors.email.join(', '), this.ui.txtEmail, this.ui.txtEmailError);
                else this.hideError(this.ui.txtEmail, this.ui.txtEmailError);

                if (errors.first_name) this.showError(errors.first_name.join(', '), this.ui.txtFirstName, this.ui.txtFirstNameError);
                else this.hideError(this.ui.txtFirstName, this.ui.txtFirstNameError);

                if (errors.last_name) this.showError(errors.last_name.join(', '), this.ui.txtLastName, this.ui.txtLastNameError);
                else this.hideError(this.ui.txtLastName, this.ui.txtLastNameError);
            } else {
                this.hideError(this.ui.txtPhone, this.ui.txtPhoneError);
                this.hideError(this.ui.txtEmail, this.ui.txtEmailError);
                this.hideError(this.ui.txtFirstName, this.ui.txtFirstNameError);
                this.hideError(this.ui.txtLastName, this.ui.txtLastNameError);
            }
        }
    });

    return ItemView;
});