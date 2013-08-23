define(['marionette', 'underscore', 'text!templates/login/content.html'], function (Marionette, _, loginHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(loginHtml),
        events: {
            'click .btnForgotPassword': 'goToForgotPassword'
        },

        goToForgotPassword: function (evt) {
            app.router.navigate('forgot-password', { trigger: true });
            evt.preventDefault();
        }
    });

    return ItemView;
});