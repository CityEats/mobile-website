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
            'click .btnBrowseAll': 'goToBrowseAll',
            'click .btnUser': 'goToUser',
        },

        ui: {
            pnlLogin: '.pnlLogin',
            pnlUser: '.pnlUser'
        },

        onRender: function () {
            if (this.options.user) {
                this.ui.pnlUser.show();
                this.ui.pnlLogin.hide();
                this.ui.pnlUser.find('.btnText').text(this.options.user);
            } else {
                this.ui.pnlUser.hide();
                this.ui.pnlLogin.show();
            }
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

        goToUser: function (evt) {
            this.goTo(evt, '');
        },

        goToSearchResults: function (evt) {
            this.trigger('findTableClicked');
        },

        goToBrowseAll: function (evt) {
            var cityId = this.model.get('id');
            this.goTo(evt, 'restaurants/' + cityId);
        },

        goTo: function (evt, url) {
            app.router.navigate(url, { trigger: true });
            evt.preventDefault();
        }
    });

    return ItemView;
});