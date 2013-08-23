define(['marionette', 'underscore', 'text!templates/searchResults/content.html'], function (Marionette, _, contentHtml) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            searchBar: "#searchForm",
            resultsHolder: '.resultsList'
        }
    });

    return ContentLayout;
});