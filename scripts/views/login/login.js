﻿define(['marionette', 'underscore', 'basicItemView', 'text!templates/login/content.html'], function (Marionette, _, BasicItemView, loginHtml) {

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
            var fbLink = "/auth/facebook?callback_url=/auth/facebook/callback/back";
            this.ui.fbLoginBtn.attr('href', fbLink);

            if (this.options.isEmailSent === true) {
                alert('You will receive an email with instructions about how to reset your password in a few minutes.');
            }
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