define(['backbone', 'models/menuCategory'],
	function (Backbone, MenuCategory) {
	    var MenuCategories = Backbone.Collection.extend({
	        model: MenuCategory
	    });

	    return MenuCategories;
	});