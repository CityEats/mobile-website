define(['backbone'],
	function (Backbone) {
	    var Filter = Backbone.Model.extend({
	        defaults: {
	            sortBy: 0,
	            price: 0,
	            cuisines: [],
	            cuisineIds: [],
	            neighborhoods: [],
	            neighborhoodIds: [],
	            cuisinesText: function () {
	                var items = this.cuisines.where({ 'checked': true });
	                return items.length > 0 ? items.map(function (item) { return item.get('value') }).join(',') : 'By Cuisine';

	            },

	            neighborhoodsText: function () {
	                var items = this.neighborhoods.where({ 'checked': true });
	                return items.length > 0 ? items.map(function (item) { return item.get('value') }).join(',') : 'By Neighborhood';
	            }
	        }
	    });

	    return Filter;
	}
);