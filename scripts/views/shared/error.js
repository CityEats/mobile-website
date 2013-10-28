define(['marionette', 'backbone', 'underscore', 'text!templates/shared/error.html'], function (Marionette, Backbone,_, topBarHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(topBarHtml),
        events: {
            'click .btnRefresh': 'btnRefreshClick',
        },
        serializeData: function() {
            return {
                error : this.options.error || 'An error has occurred, please try refresh data'
            };
        },

        btnRefreshClick: function (evt) {           
            evt.preventDefault();
            //var url = this.options.refreshUrl
            //hint to reload current page
            var url = Backbone.history.fragment;
            if (Backbone.history.fragment != null) {
                Backbone.history.fragment = null;
                Backbone.history.navigate(url, true);
            }
        }
    });

    return ItemView;
})