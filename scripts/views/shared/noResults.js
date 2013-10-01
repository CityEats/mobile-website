define(['marionette', 'underscore', 'text!templates/shared/noResults.html'], function (Marionette, _, noResultsHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(noResultsHtml)
    });

    return ItemView;
});