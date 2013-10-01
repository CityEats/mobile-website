define(['backbone', 'collections/menuCategories'],
	function (Backbone, MenuCategories) {
	    var MenuItem = Backbone.Model.extend({

	        getMenuCategories: function () {
	            this.menuCategoryCollection || (this.menuCategoryCollection = new MenuCategories);

	            this.menuCategoryCollection.reset(this.get('categories'));
	            return this.menuCategoryCollection;
	        }
	    });

	    return MenuItem;
	}
);