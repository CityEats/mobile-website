define(['marionette', 'underscore', 'text!templates/shared/footer.html'], function (Marionette, _, topBarHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(topBarHtml),
        events: {
            'click .btnContactUs': 'gotToContactUs',
            'click .btnTermsPrivacy': 'gotToTermsPrivacy'
        },

        gotToContactUs: function (evt) {
            app.router.navigate('contact-us', { trigger: true });

            evt.preventDefault();
        },

        gotToTermsPrivacy: function (evt) {
            evt.preventDefault();
        },
    });

    return ItemView;
})