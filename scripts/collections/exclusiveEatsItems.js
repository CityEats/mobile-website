define(['backbone', 'models/exclusiveEatsItem'],
	function (Backbone, ExclusiveEatsItem) {
	    var ExclusiveEatsItems = Backbone.Collection.extend({
	        model: ExclusiveEatsItem
	    });

	    return ExclusiveEatsItems;
	}
);