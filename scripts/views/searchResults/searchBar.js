define(['marionette', 'underscore', 'text!templates/searchResults/searchHeader.html'], function (Marionette, _, searchHeaderHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(searchHeaderHtml)
    });

    return ItemView;
});