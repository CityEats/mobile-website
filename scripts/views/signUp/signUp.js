define(['app', 'marionette', 'underscore', 'basicItemView', 'text!templates/signUp/content.html'], function (app, Marionette, _, BasicItemView, signUpHtml) {

    var ItemView = BasicItemView.extend({
        template: _.template(signUpHtml),
        events: {
            'click .btnSubmit': 'btnSubmitClick',
            'click .cbAgree': 'cbAgreeClick',
            'click .btnTermsPrivacy': 'btnTermsPrivacyClick',
            'change .ddlMonth': 'ddlMonthChange',
            'change .ddlYear': 'ddlYearChange'
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
            ddlHowHeard: '.ddlHowHeard',
            fbLoginBtn: '.fbLoginBtn'
        },

        onRender: function () {
            //fb link
            var fbLink = "/auth/facebook?callback_url=/auth/facebook/callback/back";
            this.ui.fbLoginBtn.attr('href', fbLink);

            //render years
            var date = new Date;
            var years = ['<option>Year</option>'];
            var months = ['<option>Month</option>'];
            var howHeards = ['<option></option>'];
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var howHeardNames = [{ 'Word of Mouth': 1 }, { 'Online ad': 2 }, { 'Radio': 3 }, { 'TV': 4 }, { 'Print': 5 }, { 'Outdoor ad': 6 }, { 'Other': 7 }];

            for (var i = 1900; i <= date.getFullYear() ; i++) {
                years.push('<option value="' + i + '"> ' + i + '</option>');
            }

            for (var i = 0; i < monthNames.length; i++) {
                months.push('<option value="' + (i + 1) + '"> ' + monthNames[i] + '</option>');
            }

            for (var i = 0; i < howHeardNames.length; i++) {
                var keys = Object.keys(howHeardNames[i]);
                howHeards.push('<option value="' + howHeardNames[i][keys[0]] + '"> ' + keys[0] + '</option>');
            }

            this.ui.ddlYear.empty().append(years);
            this.ui.ddlMonth.empty().append(months);
            this.ui.ddlHowHeard.empty().append(howHeards);
            this.buildDays();
        },

        btnTermsPrivacyClick: function (evt) {
            app.router.navigate('terms-privacy', { trigger: true });
            evt.preventDefault();
        },

        btnSubmitClick: function (evt) {
            if (this.validate()) {
                var year = parseInt(this.ui.ddlYear.val(), 10),
                    month = parseInt(this.ui.ddlMonth.val(), 10),
                    day = parseInt(this.ui.ddlDay.val(), 10),
                    howHeard = parseInt(this.ui.ddlHowHeard.val());

                var user = {
                    email: this.ui.txtEmail.val(),
                    password: this.ui.txtPassword.val(),
                    password_confirmation: this.ui.txtPassword2.val(),
                    first_name: this.ui.txtFirstName.val(),
                    last_name: this.ui.txtLastName.val(),
                    postal_code: this.ui.txtZip.val(),
                    phone_number: this.ui.txtPhone.val()
                };

                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                    user["birthday(1i)"] = year.toString();
                    user["birthday(2i)"] = month.toString();
                    user["birthday(3i)"] = day.toString();
                }

                if (!isNaN(howHeard)) {
                    user["referral_type_id"] = howHeard;
                }

                this.trigger('loginSubmited', user);
            }
        },

        cbAgreeClick: function () {
            this.hideError(this.ui.cbAgree);
        },

        ddlMonthChange: function () {
            this.buildDays();
        },

        ddlYearChange: function () {
            this.buildDays();
        },

        buildDays: function () {
            var day = parseInt(this.ui.ddlDay.val(), 10),
                year = parseInt(this.ui.ddlYear.val(), 10) || 2001,
                month = parseInt(this.ui.ddlMonth.val(), 10) || 1,
                days = ['<option>Day</option>'];

            for (var i = 1; i <= new Date(year, month, 0).getDate() ; i++) {
                days.push('<option value="' + i + '"> ' + i + '</option>');
            }

            this.ui.ddlDay.empty().append(days);

            if (!isNaN(day)) this.ui.ddlDay.val(day);
        },

        validate: function () {
            var isValid = true;

            if (!this.requireValidation('First Name is a required field', this.ui.txtFirstName, this.ui.txtFirstNameError)) {
                isValid = false;
            }

            if (!this.requireValidation('Last Name is a required field', this.ui.txtLastName, this.ui.txtLastNameError)) {
                isValid = false;
            }

            if (!this.requireValidation('Email is a required field', this.ui.txtEmail, this.ui.txtEmailError)) {
                isValid = false;
            }

            if (!this.requireValidation('Password is a required field', this.ui.txtPassword, this.ui.txtPasswordError)) {
                isValid = false;
            } else {
                if (this.ui.txtPassword.val().length < 6) {
                    isValid = false;
                    this.showError('Password must be at least 6 characters long.', this.ui.txtPassword, this.ui.txtPasswordError);
                } else {
                    this.hideError(this.ui.txtPassword, this.ui.txtPasswordError);
                }
            }

            if (!this.requireValidation('Confirm Password is a required field', this.ui.txtPassword2, this.ui.txtPassword2Error)) {
                isValid = false;
            } else {
                if (this.ui.txtPassword.val() !== this.ui.txtPassword2.val()) {
                    isValid = false;
                    this.showError('Password Confirmation must match Password.', this.ui.txtPassword2, this.ui.txtPassword2Error);
                } else {
                    this.hideError(this.ui.txtPassword2, this.ui.txtPassword2Error);
                }
            }

            if (!this.requireValidation('Zip is a required field', this.ui.txtZip, this.ui.txtZipError)) {
                isValid = false;
            }

            if (!this.requireValidation('Phone is a required field', this.ui.txtPhone, this.ui.txtPhoneError)) {
                isValid = false;
            }

            if (this.ui.cbAgree.is(':checked')) {
                this.hideError(this.ui.cbAgree);
            } else {
                this.showError(null, this.ui.cbAgree);
                isValid = false;
            }

            return isValid;
        }
    });

    return ItemView;
});