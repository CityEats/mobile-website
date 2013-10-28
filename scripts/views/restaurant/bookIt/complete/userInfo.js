define(['app', 'marionette', 'backbone', 'underscore', 'basicItemView', 'text!templates/restaurant/bookIt/complete/userInfo.html'],

function (app, Marionette, Backbone, _, BasicItemView, itemHtml) {

    var ItemView = BasicItemView.extend({
        template: _.template(itemHtml),
        ui: {
            pnLogIn: '#pnLogIn',
            pnlAccountInfo: '#pnlAccountInfo',
            pnlReservationInfo: '#pnlReservationInfo',
            btnSomeoneElse: '.btnSomeoneElse',
            btnEditProfile: '.btnEditProfile',
            pnlForMyself: '.pnlForMyself',

            txtFirstName: '.txtFirstName',
            txtFirstNameError: '.txtFirstNameError',
            txtLastName: '.txtLastName',
            txtLastNameError: '.txtLastNameError',
            txtEmail: '.txtEmail',
            txtEmailError: '.txtEmailError',
            txtPhone: '.txtPhone',
            txtPhoneError: '.txtPhoneError',
        },

        events: {
            'click .btnLogIn': 'btnLogInClick',
            'click .btnSomeoneElse': 'btnSomeoneElseClick',
            'click .btnForMyself': 'btnForMyselfClick',
        },

        onRender: function () {
            if (this.model == null) {
                this.ui.pnlAccountInfo.hide();
            } else {
                this.ui.pnLogIn.hide();
                this.ui.pnlReservationInfo.hide();
            }
        },

        btnLogInClick: function (evt) {
            evt.preventDefault();
            var backUrl = Backbone.history.fragment; //curent url
            app.router.navigate('login?' + encodeURIComponent(backUrl), { trigger: true });
        },

        btnSomeoneElseClick: function (evt) {
            evt.preventDefault();
            this.ui.pnlAccountInfo.hide();
            this.ui.pnlReservationInfo.show();
            this.ui.pnlForMyself.show();
            this.isSomeoneElse = true;
        },

        btnForMyselfClick: function (evt) {
            evt.preventDefault();
            this.ui.pnlAccountInfo.show();
            this.ui.pnlReservationInfo.hide();
            this.isSomeoneElse = false;
        },

        validate: function () {
            var isValid = true;

            if (this.ui.pnlReservationInfo.is(':visible')) {
                if (!this.requireValidation('First Name is a required field', this.ui.txtFirstName, this.ui.txtFirstNameError)) {
                    isValid = false;
                }

                if (!this.requireValidation('Last Name is a required field', this.ui.txtLastName, this.ui.txtLastNameError)) {
                    isValid = false;
                }

                if (!this.requireValidation('Email is a required field', this.ui.txtEmail, this.ui.txtEmailError)) {
                    isValid = false;
                }

                if (!this.requireValidation('Phone is a required field', this.ui.txtPhone, this.ui.txtPhoneError)) {
                    isValid = false;
                }
            }

            return isValid;
        },

        getModel: function () {
            if (!this.validate()) return null;

            var isAuthorized = this.model != null && this.isSomeoneElse != true;
            return {
                isAuthorized: isAuthorized,
                firstName: isAuthorized ? this.model.get('first_name') : this.ui.txtFirstName.val(),
                lastName: isAuthorized ? this.model.get('last_name') : this.ui.txtLastName.val(),
                email: isAuthorized ? this.model.get('email') : this.ui.txtEmail.val(),
                phone: isAuthorized ? this.model.get('phone_number') : this.ui.txtPhone.val(),
                id: isAuthorized ? this.model.get('id') : null,
            };
        }
    });

    return ItemView;
});