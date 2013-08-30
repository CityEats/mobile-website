define(['backbone'],
	function (Backbone) {
	    var TextBlock = Backbone.Model.extend({
	        defaults: {
	            title: '',
                lines: []
	        }
	    });

	    return TextBlock;
	}
);