define(['marionette', 'underscore', 'text!templates/searchResults/content.html'], function (Marionette, _, contentHtml) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            searchBar: "#searchForm",
            resultsHolder: '#allRestaurants',
            editorsPicks: '#editorsPicks'
        },

        onRender: function () {            
            if (!this.options.isBrowseAll) {
                this.$el.find('.resultsTitle, #editorsPicks').remove();
            } else {
                if (!this.options.isEditorsPicks) {
                    this.$el.find('.resultsTitle.pick, #editorsPicks').remove();
                }
            }            
        }
    });

    return ContentLayout;
});