define(['app', 'marionette', 'underscore', 'text!templates/signUp/content.html'], function (app, Marionette, _, signUpHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(signUpHtml),
        events: {
            'click .btnSubmit': 'btnSubmitClick',
            'click .cbAgree': 'cbAgreeClick',
        },
        ui: {
            txtFirstName: '.txtFirstName',
            txtFirstNameError: '.txtFirstNameError',
            txtLastName: '.txtLastName',
            txtLastNameError: '.txtLastNameError',
            txtEmail: '.txtEmail',
            txtEmailError: '.txtEmailError',
            txtPassword: '.txtPassword',
            txtPasswordError: '.txtPasswordError',
            txtPassword2: '.txtPassword2',
            txtPassword2Error: '.txtPassword2Error',
            txtZip: '.txtZip',
            txtZipError: '.txtZipError',
            txtPhone: '.txtPhone',
            txtPhoneError: '.txtPhoneError',
            txtError: '.txtError',
            cbAgree: '.cbAgree',
            ddlMonth: '.ddlMonth',
            ddlDay: '.ddlDay',
            ddlYear: '.ddlYear',
            ddlHowHear: '.ddlHowHear'
        },

        btnSubmitClick: function () {           
            //var user = {
            //    user: {
            //        "first_name": "Alexey",
            //        "last_name": "Grachov",
            //        "email": "grachov.alexey@gmail.com",
            //        "password": "secret",
            //        "password_confirmation": "secret",
            //        "postal_code": "03110",
            //        "phone_number": "",
            //        "birthday": ""
            //    }
            //};

            //app.execute('API:SignUp', user, function (err, data) {
            //    debugger
            //    if (err == null) {
                    
            //    }
            //});

            if (this.validate()) {
                this.trigger('loginSubmited', {
                    email: this.ui.txtEmail.val(),
                    password: this.ui.txtPassword.val(),
                    password_confirmation: this.ui.txtPassword2.val(),
                    first_name: this.ui.txtFirstName.val(),
                    last_name: this.ui.txtLastName.val(),
                    postal_code: this.ui.txtZip.val(),
                    phone_number: this.ui.txtPhone.val(),
                    birthdayM: this.ui.ddlMonth.val(),
                    birthdayD: this.ui.ddlDay.val(),
                    birthdayY: this.ui.ddlYear.val(),
                    howHear: this.ui.ddlHowHear.val(),
                });
            }
        },

        cbAgreeClick: function () {
            this.hideError(this.ui.cbAgree);
        },

        validate: function () {
            var isValid = true;            

            if (!this.requireValidation('First Name is a required field', this.ui.txtFirstName, this.ui.txtFirstNameError)) {
                isValid  = false;
            }

            if(!this.requireValidation('Last Name is a required field', this.ui.txtLastName, this.ui.txtLastNameError)) {
                isValid  = false;
            }

            if(!this.requireValidation('Email is a required field', this.ui.txtEmail, this.ui.txtEmailError)) {
                isValid  = false;
            }

            if(!this.requireValidation('Password is a required field', this.ui.txtPassword, this.ui.txtPasswordError)) {
                isValid  = false;
            }

            if(!this.requireValidation('Confirm Password is a required field', this.ui.txtPassword2, this.ui.txtPassword2Error)) {
                isValid  = false;
            }

            if(!this.requireValidation('Zip is a required field', this.ui.txtZip, this.ui.txtZipError)) {
                isValid  = false;
            }            

            if(!this.requireValidation('Phone is a required field', this.ui.txtPhone, this.ui.txtPhoneError)) {
                isValid  = false;
            }

            if (this.ui.cbAgree.is(':checked')) {
                this.hideError(this.ui.cbAgree);
            } else {
                this.showError(null, this.ui.cbAgree);
                isValid = false;
            }

            return isValid;
        },

        requireValidation: function (error, input, errorLabel) {
            var value = input.val();
            if (value.length == 0) {
                this.showError(error, input, errorLabel);
                return false;
            }
            else {
                this.hideError(input, errorLabel);
                return true;
            }
        },

        showError: function (error, input, errorLabel) {            
            if (input) {
                input.addClass('hasError');
            }

            if (errorLabel) {
                if (errorLabel == 'main') {
                    this.ui.txtError.text(error).show();
                } else {
                    errorLabel.text(error).show();
                }
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