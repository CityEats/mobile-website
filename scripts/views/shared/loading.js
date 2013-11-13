define(['marionette', 'underscore'], function (Marionette, _) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template('<img src="/img/spinner.gif" />')        
    });

    return ItemView;
});