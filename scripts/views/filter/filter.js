define(['app', 'marionette', 'underscore', 'text!templates/filter/content.html'], function (app, Marionette, _, filterHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(filterHtml),
        events: {
            'click .byCuisines': 'goToCuisines',
            'click .byNeighborhoods': 'goToNeighborhoods',
            'click #btnSubmit': 'applyFilter',
            'click .btnDistance' : 'btnDistanceClick',
            'change .radiosLineInput[type="checkbox"]': 'pricesChanged',
            'change .radiosLineInput[type="radio"]': 'sortByChanged'
        },

        ui:{
            btnDistance: '.btnDistance'
        },

        initialize: function () {
            this.model.prepareData();
            this.backUrl = this.options.isRestaurants ?
                'restaurants':
                'search-results/party/' + this.options.searchSettings.party + '/date/' + this.options.searchSettings.date + '/time/' + this.options.searchSettings.time;

            this.cuisinesUrl = this.options.isRestaurants ?
                'restaurants/filter/cuisines' :
                'search-results/party/' + this.options.searchSettings.party + '/date/' + this.options.searchSettings.date + '/time/' + this.options.searchSettings.time + '/filter/cuisines';

            this.neighborhoodsUrl = this.options.isRestaurants ?
                'restaurants/filter/neighborhoods' :
                'search-results/party/' + this.options.searchSettings.party + '/date/' + this.options.searchSettings.date + '/time/' + this.options.searchSettings.time + '/filter/neighborhoods';
        },

        onRender: function () {            
            this.checkChanges();
            if (this.options.isLocation) this.ui.btnDistance.removeClass('disabled');
            else this.ui.btnDistance.addClass('disabled');
            
        },

        btnDistanceClick: function(evt){
            if (this.options.isLocation !== true){
                evt.preventDefault();
            }
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
            evt.preventDefault();
            var that = this;
            
            var sortBy = parseInt(this.$('input[name="sort"]:checked').attr('itemId'), 10) || 0,
                prices = [];

            var priceElemets = this.$('.prices input[type="checkbox"]:checked');
            priceElemets.each(function (i, item) {
                prices.push(parseInt(that.$(item).attr('itemId'), 10) || 0)
            });

            this.model.set('sortBy', sortBy);
            this.model.set('prices', prices);
            app.execute('SaveFilter', this.model);
            
            app.router.navigate(this.backUrl, { trigger: true });
        },

        pricesChanged: function () {
            this.checkChanges();
        },

        sortByChanged: function(){
            this.checkChanges();
        },

        checkChanges: function () {
            var priceElemets = this.$('.prices input[type="checkbox"]:checked');
            var sortBy = parseInt(this.$('input[name="sort"]:checked').attr('itemId'), 10) || 0;

            var isDefault = priceElemets.length == 0 &&
                (this.options.isLocation && sortBy == 1 || !this.options.isLocation && sortBy == 2) &&
                this.model.get('cuisineIds').length == 0 &&
                this.model.get('neighborhoodIds').length == 0;

            this.trigger('filterChanged', isDefault);
        },

        resetFilter: function () {
            this.model.resetFilter();
            this.render();
        }
    });

    return ItemView;
}); 