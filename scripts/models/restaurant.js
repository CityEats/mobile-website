define(['backbone'],
	function (Backbone) {
	    var Restaurant = Backbone.Model.extend({
	        defaults: {
	            name: 'test'
	        }
	    });

	    return Restaurant;
	}
);