define(['backbone', 'models/dish'],
	function (Backbone, Dish) {
	    var Dishes = Backbone.Collection.extend({
	        model: Dish
	    });

	    return Dishes;
	});