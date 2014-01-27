define(['marionette', 'underscore', 'basicItemView', 'text!templates/contactUs/content.html'], function (Marionette, _, BasicItemView, forgotPasswordHtml) {

    var ItemView = BasicItemView.extend({
        template: _.template(forgotPasswordHtml),
        ui: {
            txtName: '.txtName',
            txtNameError: '.txtNameError',
            txtEmail: '.txtEmail',
            txtEmailError: '.txtEmailError',
            txtSubject: '.txtSubject',
            txtSubjectError: '.txtSubjectError',
            txtMessage: '.txtMessage',
            txtMessageError: '.txtMessageError',
        },

        events: {
            'click .btnSubmit': 'btnSubmitClick'
        },

        onRender: function () {
            if (this.options.isDone) {
                alert("Thanks for being in touch! We'll review your feedback or inquiry and respond back soon.");
            }
        },

        btnSubmitClick: function (evt) {
            evt.preventDefault();
            if (this.validate()) {
                this.trigger('btnSubmitClicked', {
                    name: this.ui.txtName.val(),
                    email: this.ui.txtEmail.val(),
                    subject: this.ui.txtSubject.val(),
                    message: this.ui.txtMessage.val()
                });
            }
        },

        validate: function () {
            var isValid = true;

            if (!this.requireValidation('Name is a required field', this.ui.txtName, this.ui.txtNameError)) {
                isValid = false;
            }

            if (!this.requireValidation('Email is a required field', this.ui.txtEmail, this.ui.txtEmailError)) {
                isValid = false;
            }

            if (!this.requireValidation('Subject is a required field', this.ui.txtSubject, this.ui.txtSubjectError)) {
                isValid = false;
            }

            if (!this.requireValidation('Message is a required field', this.ui.txtMessage, this.ui.txtMessageError)) {
                isValid = false;
            }
            return isValid;
        }
    });

    return ItemView;
});