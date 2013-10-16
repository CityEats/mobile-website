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
        },

        btnForMyselfClick: function (evt) {
            evt.preventDefault();
            this.ui.pnlAccountInfo.show();
            this.ui.pnlReservationInfo.hide();
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

            return this.model || {
                isNotAuthorized: true,
                firstName: this.ui.txtFirstName.val(),
                lastName: this.ui.txtLastName.val(),
                email: this.ui.txtEmail.val(),
                phone: this.ui.txtPhone.val(),
            };
        }
    });

    return ItemView;
});