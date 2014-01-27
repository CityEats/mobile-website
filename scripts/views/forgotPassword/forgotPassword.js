define(['marionette', 'underscore', 'basicItemView', 'text!templates/forgotPassword/content.html'], function (Marionette, _, BasicItemView, forgotPasswordHtml) {

    var ItemView = BasicItemView.extend({
        template: _.template(forgotPasswordHtml),
        events: {
            'click .btnSignUp': 'goToSignUp',
            'click .btnSubmit': 'btnSubmitClick'
        },

        ui: {
            txtEmail: '.txtEmail',
            txtError: '.txtError'
        },

        goToSignUp: function (evt) {
            evt.preventDefault();
            app.router.navigate('signup', { trigger: true });            
        },

        btnSubmitClick: function (evt) {
            evt.preventDefault();
            this.trigger('btnSubmitClicked', this.ui.txtEmail.val());
        }
    });

    return ItemView;
});