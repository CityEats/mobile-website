define(['marionette', 'underscore', 'text!templates/findTable/content.html'], function (Marionette, _, findTableHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(findTableHtml),

        events: {
            'click .btnLogIn': 'goToLogIn',
            'click .btnSignUp': 'goToSignUp',
            'click .btnChangeCity': 'goToChangeCity',
            'click .btnFindTable': 'goToSearchResults'
        },

        goToLogIn: function (evt) {
            this.goTo(evt, 'login');
        },

        goToSignUp: function (evt) {
            this.goTo(evt, 'signup');
        },
        
        goToChangeCity: function (evt) {
            this.goTo(evt, '');
        },

        goToSearchResults: function (evt) {
            this.goTo(evt, 'search-results');
        },

        goTo: function (evt, url) {
            app.router.navigate(url, { trigger: true });
            evt.preventDefault();
        },        
    });

    return ItemView;
});