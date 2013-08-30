define(['backbone'],
	function (Backbone) {
	    var MenuItem = Backbone.Model.extend({
	        defaults: {
	            title: ''	            
	        }
	    });

	    return MenuItem;
	}
);