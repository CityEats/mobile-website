define(['backbone', 'collections/dishes'],
	function (Backbone, Dishes) {
	    var MenuCategory = Backbone.Model.extend({

	        getDishes: function () {
	            this.dishCollection || (this.dishCollection = new Dishes);

	            this.dishCollection.reset(this.get('dishes'));
	            return this.dishCollection;
	        }
	    });

	    return MenuCategory;
	}
);