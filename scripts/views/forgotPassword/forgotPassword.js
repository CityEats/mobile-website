define(['marionette', 'underscore', 'text!templates/forgotPassword/content.html'], function (Marionette, _, forgotPasswordHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(forgotPasswordHtml),
        events: {
            'click .btnSignUp': 'goToSignUp'
        },

        goToSignUp: function (evt) {
            app.router.navigate('signup', { trigger: true });
            evt.preventDefault();
        }
    });

    return ItemView;
});