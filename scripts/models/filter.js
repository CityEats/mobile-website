define(['backbone', 'app'],
	function (Backbone, app) {	    
	    var Filter = Backbone.Model.extend({	        
	        defaults: {	            
	            prices: [],	            
	            cuisineIds: [],	            
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

	        initialize: function(){
	            this.resetFilter();
	        },

	        prepareData: function () {
	            var cuisineIds = this.get('cuisineIds'),
	                neighborhoodIds = this.get('neighborhoodIds'),
	                cuisines = this.get('cuisines'),
                    neighborhoods = this.get('neighborhoods');

	            if (cuisines) {
	                cuisines.each(function (item) {
	                    item.set('checked', cuisineIds.indexOf(item.get('key')) != -1);
	                });
	            }

	            if (neighborhoods) {
	                neighborhoods.each(function (item) {
	                    item.set('checked', neighborhoodIds.indexOf(item.get('key')) != -1);
	                });
	            }
	        },

	        isDefault: function () {
	            var sortBy = this.get('sortBy');
	            var location = app.request('GetLocation');
                
	            return this.get('prices').length == 0 &&
                    this.get('cuisineIds').length == 0 &&
                    this.get('neighborhoodIds').length == 0 &&
                    (location && sortBy == 1 || !location && sortBy == 2);
	        },

	        resetFilter: function () {
	            var location = app.request('GetLocation');
	            this.set('neighborhoodIds', []);
	            this.set('cuisineIds', []);
	            this.set('prices', []);
	            this.set('sortBy', location ? 1 : 2);
	            this.prepareData();
	        }
	    });

	    return Filter;
	}
);