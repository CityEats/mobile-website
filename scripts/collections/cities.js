define(['backbone', 'models/city'],
	function (Backbone, City) {
	    var Cities = Backbone.Collection.extend({
	        model: City
	    });

	    return Cities;
	}
);