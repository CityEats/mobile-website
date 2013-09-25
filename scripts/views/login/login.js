define(['marionette', 'underscore', 'basicItemView', 'text!templates/login/content.html'], function (Marionette, _, BasicItemView, loginHtml) {

    var ItemView = BasicItemView.extend({
        template: _.template(loginHtml),
        events: {
            'click .btnForgotPassword': 'goToForgotPassword',
            'click .btnSubmit': 'btnSubmitClick'
        },

        ui: {
            txtEmail: '.txtEmail',
            txtPassword: '.txtPassword',
            txtEmailError: '.txtEmailError',
            txtPasswordError: '.txtPasswordError',
            txtError: '.txtError',
            fbLoginBtn: '.fbLoginBtn'
        },

        onRender: function () {
            //var fbLink = "https://www.facebook.com/dialog/oauth?client_id=" + this.options.appId + "&redirect_uri=" + this.options.redirectUri;
            var fbLink = "https://build-beta.cityeats.com/auth/facebook?callback_url=/api/v2/facebook_auth";
            this.ui.fbLoginBtn.attr('href', fbLink);
        },

        goToForgotPassword: function (evt) {
            evt.preventDefault();
            app.router.navigate('forgot-password', { trigger: true });
        },

        btnSubmitClick: function (evt) {
            evt.preventDefault();
            if (this.validate()) {
                this.trigger('loginSubmited', {
                    email: this.ui.txtEmail.val(),
                    password: this.ui.txtPassword.val()
                });
            }
        },

        validate: function () {
            var isValid = true;

            if (!this.requireValidation('Email is a required field.', this.ui.txtEmail, this.ui.txtEmailError)) {
                isValid = false;
            }

            if (!this.requireValidation('Password is a required field.', this.ui.txtPassword, this.ui.txtPasswordError)) {
                isValid = false;
            }
            return isValid;
        },
    });

    return ItemView;
});