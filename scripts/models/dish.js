define(['backbone'],
	function (Backbone) {
	    var Dish = Backbone.Model.extend({
	        defaults: {
	            title: '',
                description: '',
                price: 0.00,
                priceText: function () {
                    return '$' + this.price.toFixed(2);
                },
	        }
	    });

	    return Dish;
	}
);