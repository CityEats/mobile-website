define(['backbone'],
	function (Backbone) {
	    var Filter = Backbone.Model.extend({
	        defaults: {
	            sortBy: 2,
	            prices: [],
	            cuisines: [],
	            cuisineIds: [],
	            neighborhoods: [],
	            neighborhoodIds: [],
	            cuisinesText: function () {	                
	                var items = this.cuisines.length > 0 ? this.cuisines.where({ 'checked': true }) : [];
	                return items.length > 0 ? items.map(function (item) { return item.get('value') }).join(',') : 'By Cuisine';
	            },

	            neighborhoodsText: function () {
	                var items = this.neighborhoods.length > 0 ? this.neighborhoods.where({ 'checked': true }) : [];
	                return items.length > 0 ? items.map(function (item) { return item.get('value') }).join(',') : 'By Neighborhood';
	            }
	        },

	        prepareData: function () {                
	            var cuisineIds = this.get('cuisineIds'),
	                neighborhoodIds = this.get('neighborhoodIds');

	            this.get('cuisines').each(function (item) {
	                item.set('checked', cuisineIds.indexOf(item.get('key')) != -1);
	            });

	            this.get('neighborhoods').each(function (item) {
	                item.set('checked', neighborhoodIds.indexOf(item.get('key')) != -1);
	            });
	        },

	        isDefault: function () {                
	            return this.get('prices').length == 0 &&
                    this.get('cuisineIds').length == 0 &&
                    this.get('neighborhoodIds').length == 0;
	        },

	        resetFilter: function () {
	            this.set('neighborhoodIds', []);
	            this.set('cuisineIds', []);
	            this.set('prices', []);
	            this.set('sortBy', 2);
	            this.prepareData();
	        }
	    });

	    return Filter;
	}
);