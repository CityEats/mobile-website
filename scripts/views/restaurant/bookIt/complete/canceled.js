define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/canceled.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        events: {
            'click .btnFindTable': 'goToFindTable'
        },

        goToFindTable: function (evt) {
            evt.preventDefault();
            var url = 'find-table/5';
            app.router.navigate(url, { trigger: true });
        },
    });

    return ItemView;
});