define(['marionette', 'backbone', 'underscore', 'app', 'text!templates/shared/error.html'],
function (Marionette, Backbone, _, app, topBarHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(topBarHtml),
        events: {
            'click .btnRefresh': 'btnRefreshClick',
            'click .btnHome': 'btnHomeClick',
        },
        serializeData: function () {
            return {
                error: this.options.error || 'An error has occurred, please try refresh data'
            };
        },

        btnRefreshClick: function (evt) {
            evt.preventDefault();
            //hint to reload current page
            var url = Backbone.history.fragment;
            if (Backbone.history.fragment != null) {
                Backbone.history.fragment = null;
                Backbone.history.navigate(url, true);
            }
        },

        btnHomeClick: function (evt) {
            evt.preventDefault();
            app.router.navigate('', { trigger: true })
        }
    });

    return ItemView;
});