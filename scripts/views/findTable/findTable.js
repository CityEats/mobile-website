define(['marionette', 'underscore', 'text!templates/findTable/content.html'], function (Marionette, _, findTableHtml) {

    var ItemView = Marionette.Layout.extend({
        template: _.template(findTableHtml),
        regions: {
            'search': '#searchBar'
        },

        events: {
            'click .btnLogIn': 'goToLogIn',
            'click .btnSignUp': 'goToSignUp',
            'click .btnChangeCity': 'goToChangeCity',
            'click .btnFindTable': 'goToSearchResults',
            'click .btnBrowseAll': 'goToBrowseAll'
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
            var time = this.$('.time');
            var partySize = this.$('.partySize');
            //var date = this.el$('.date');

            var cityId = this.model.get('id');
            var date = '2013-09-10' //this.ui.date.text();
            var url = 'search-results/' + cityId + '/party/' + partySize.val() + '/date/' + date + '/time/' + time.val();
            this.goTo(evt, url);
        },

        goToBrowseAll: function (evt) {
            var cityId = this.model.get('id');
            this.goTo(evt, 'browse-all/' + cityId);
        },

        goTo: function (evt, url) {
            app.router.navigate(url, { trigger: true });
            evt.preventDefault();
        }
    });

    return ItemView;
});