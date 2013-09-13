define(['marionette', 'underscore', 'text!templates/login/content.html'], function (Marionette, _, loginHtml) {

    var ItemView = Marionette.ItemView.extend({
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
            txtError: '.txtError'
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
            var email = this.ui.txtEmail.val(),
                password = this.ui.txtPassword.val(),
                isValid = true;

            if (email.length == 0) {
                this.showError('Email is a required field.', this.ui.txtEmail, this.ui.txtEmailError);
                isValid = false;
            }
            else {
                this.hideError(this.ui.txtEmail, this.ui.txtEmailError);
            }

            if (password.length == 0) {
                this.showError('Password is a required field.', this.ui.txtPassword, this.ui.txtPasswordError);
                isValid = false;
            }
            else {
                this.hideError(this.ui.txtPassword, this.ui.txtPasswordError);
            }

            return isValid;
        },

        showError: function (error, input, errorLabel) {
            if (input) {
                input.addClass('hasError');
            }

            if (errorLabel) {
                errorLabel.text(error).show();
            } else {
                this.ui.txtError.text(error).show();
            }
        },

        hideError: function (input, errorLabel) {
            if (input) {
                input.removeClass('hasError');
            }

            if (errorLabel) {
                errorLabel.hide();
            } else {
                this.ui.txtError.hide();
            }            
        },
    });

    return ItemView;
});