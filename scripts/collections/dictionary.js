define(['backbone', 'models/keyValue'],
	function (Backbone, KeyValue) {
	    var Dictionary = Backbone.Collection.extend({
	        model: KeyValue
	    });

	    return Dictionary;
	})