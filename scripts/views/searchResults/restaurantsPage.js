define(['marionette', 'underscore', 'app', 'views/searchResults/restaurants', 'text!templates/searchResults/page.html'], function (Marionette, _, app, RestaurantsView, pageHtml) {

    var ItemView = Marionette.Layout.extend({
        template: _.template(pageHtml),
        regions: {
            restaurants: '.allRestaurants',
            editorsPicks: '.editorsPicks'
        },

        ui: {
            picksLabel : '.resultsTitle.pick',
            restaurantsLabel: '.resultsTitle.all',
            editorsPicks: '.editorsPicks'
        },

        onRender: function () {            
            var editorsPicks = this.model.get('key');
            var restaurants = this.model.get('value');

            if (editorsPicks == null || editorsPicks.length == 0) {
                this.editorsPicks.close();
                this.ui.editorsPicks.hide();
                this.ui.picksLabel.hide();
            } else {
                this.editorsPicks.show(new RestaurantsView({
                    collection: editorsPicks,
                    showSimple: this.options.showSimple
                }));
            }
            this.restaurants.show(new RestaurantsView({
                collection: restaurants,
                showSimple: this.options.showSimple,
                party: this.options.party,
                date: this.options.date,
                time: this.options.time,
                cityId: this.options.cityId,
                timeOffset:  this.options.timeOffset
            }));

            if (!this.options.isBrowseAll) this.ui.restaurantsLabel.hide();
        }
    });

    return ItemView;
});