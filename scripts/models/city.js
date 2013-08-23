define(['backbone'],
	function (Backbone) {
	    var City = Backbone.Model.extend({
	        defaults: {
	            name: 'test'
	        }
	    });

	    return City;
	}
);