define(['app', 'marionette', 'underscore', 'text!templates/filter/content.html'], function (app, Marionette, _, filterHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(filterHtml),
        events: {
            'click .byCuisines': 'goToCuisines',
            'click .byNeighborhoods': 'goToNeighborhoods',
            'click #btnSubmit': 'applyFilter',
            'change .radiosLineInput[type="checkbox"]': 'pricesChanged'
        },

        initialize: function () {
            this.model.prepareData();
            this.backUrl = this.options.isRestaurants ?
                'restaurants/' + this.options.cityId :
                'search-results/' + this.options.cityId + '/party/' + this.options.searchSettings.party + '/date/' + this.options.searchSettings.date + '/time/' + this.options.searchSettings.time;

            this.cuisinesUrl = this.options.isRestaurants ?
                'restaurants/' + this.options.cityId + '/filter/cuisines' :
                'search-results/' + this.options.cityId + '/party/' + this.options.searchSettings.party + '/date/' + this.options.searchSettings.date + '/time/' + this.options.searchSettings.time + '/filter/cuisines';

            this.neighborhoodsUrl = this.options.isRestaurants ?
                'restaurants/' + this.options.cityId + '/filter/neighborhoods' :
                'search-results/' + this.options.cityId + '/party/' + this.options.searchSettings.party + '/date/' + this.options.searchSettings.date + '/time/' + this.options.searchSettings.time + '/neighborhoods/cuisines';
        },

        onRender: function () {
            this.pricesChanged(this.model.isDefault());
        },

        goToCuisines: function (evt) {            
            app.router.navigate(this.cuisinesUrl, { trigger: true });
            evt.preventDefault();
        },

        goToNeighborhoods: function (evt) {
            app.router.navigate(this.neighborhoodsUrl, { trigger: true });
            evt.preventDefault();
        },

        applyFilter: function (evt) {
            var that = this;
            
            var sortBy = parseInt(this.$('input[name="sort"]:checked').attr('itemId'), 10) || 0,
                prices = [];

            priceElemets = this.$('.prices input[type="checkbox"]:checked');
            priceElemets.each(function (i, item) {
                prices.push(parseInt(that.$(item).attr('itemId'), 10) || 0)
            });

            this.model.set('sortBy', sortBy);
            this.model.set('prices', prices);
            app.execute('SaveFilter', this.model);
            
            app.router.navigate(this.backUrl, { trigger: true });

            evt.preventDefault();
        },

        pricesChanged: function () {
            priceElemets = this.$('.prices input[type="checkbox"]:checked');
            var isDefault = this.model.isDefault() && priceElemets.length == 0;
            this.trigger('filterChanged', isDefault);
        },

        resetFilter: function () {
            this.model.resetFilter();
            this.render();
        }
    });

    return ItemView;
}); 