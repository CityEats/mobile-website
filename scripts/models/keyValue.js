define(['backbone'],
	function (Backbone) {
	    var KeyValue = Backbone.Model.extend({
	        defaults: {
	            key: '',
	            value: 0,
	            checked: false
	        }
	    });

	    return KeyValue;
	}
);