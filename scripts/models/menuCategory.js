define(['backbone'],
	function (Backbone) {
	    var MenuCategory = Backbone.Model.extend({
	        defaults: {
	            title: ''
	        }
	    });

	    return MenuCategory;
	}
);