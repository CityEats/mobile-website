define(['marionette', 'underscore', 'text!templates/chooseCity/dontSeeCity.html'], function (Marionette, _, dontSeeCity) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(dontSeeCity)
    });

    return ItemView;
});