define(['app', 'marionette', 'underscore', 'text!templates/filter/content.html'], function (app, Marionette, _, filterHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(filterHtml),
        events: {
            'click .byCuisines': 'goToCuisines',
            'click .byNeighborhoods': 'goToNeighborhoods',
            'click #btnSubmit' : 'applyFilter'
        },

        goToCuisines: function (evt) {
            app.router.navigate('favorite-cuisines', { trigger: true });
            evt.preventDefault();
        },

        goToNeighborhoods: function (evt) {
            app.router.navigate('favorite-neighborhoods', { trigger: true });
            evt.preventDefault();
        },

        applyFilter: function (evt) {
            var sortBy = parseInt(this.$('input[name="sort"]:checked').attr('itemId'), 10),
                price = parseInt(this.$('input[name="levelPrice"]:checked').attr('itemId'), 10);

            this.model.set('sortBy', sortBy);
            this.model.set('price', price);
            app.execute('Filter:save', this.model);
            app.router.navigate('browse-all', { trigger: true });

            evt.preventDefault();
        }
    });

    return ItemView;
}); 