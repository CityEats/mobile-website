define(['backbone', 'models/menuItem'],
	function (Backbone, MenuItem) {
	    var Menus = Backbone.Collection.extend({
	        model: MenuItem
	    });

	    return Menus;
	});