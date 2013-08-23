define(['marionette', 'underscore', 'text!templates/chooseCity/dont_see_city.html'], function (Marionette, _, dontSeeCity) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(dontSeeCity)
    });

    return ItemView;
});