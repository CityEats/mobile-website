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
        },

        onRender: function () {
            this.pricesChanged(this.model.isDefault());
        },

        goToCuisines: function (evt) {
            app.router.navigate('filter/' + this.options.cityId + '/cuisines', { trigger: true });
            evt.preventDefault();
        },

        goToNeighborhoods: function (evt) {
            app.router.navigate('filter/' + this.options.cityId + '/neighborhoods', { trigger: true });
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
            app.router.navigate('browse-all/' + this.options.cityId, { trigger: true });

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