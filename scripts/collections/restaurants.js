define(['backbone', 'models/restaurant'],
	function (Backbone, Restaurant) {
	    var Restaurants = Backbone.Collection.extend({
	        model: Restaurant
	    });

	    return Restaurants;
	})
