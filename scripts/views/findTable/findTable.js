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
            'click .btnLogOut': 'btnLogOutClick'
        },

        ui: {
            pnlLogin: '.pnlLogin',
            pnlUser: '.pnlUser',
            pnlLogOut: '.pnlLogOut'            
        },

        onRender: function () {
            if (this.options.user) {
                this.ui.pnlUser.show();
                this.ui.pnlLogOut.show();
                this.ui.pnlLogin.hide();
                this.ui.pnlUser.find('.btnText').text(this.options.user);
            } else {
                this.ui.pnlUser.hide();
                this.ui.pnlLogOut.hide();
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
            this.goTo(evt, 'profile');
        },

        goToSearchResults: function (evt) {
            this.trigger('findTableClicked');
        },

        goToBrowseAll: function (evt) {            
            this.goTo(evt, 'restaurants');
        },

        btnLogOutClick: function (evt) {
            evt.preventDefault();
            this.trigger('logOut');
        },

        goTo: function (evt, url) {
            evt.preventDefault();
            app.router.navigate(url, { trigger: true });            
        }
    });

    return ItemView;
});