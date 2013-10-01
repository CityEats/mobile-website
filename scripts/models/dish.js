define(['backbone'],
	function (Backbone) {
	    var Dish = Backbone.Model.extend({
	        defaults: {
	            name: '',
	            description: '',
                price: 0.00,
                priceText: function () {
                    return (typeof this.price == 'number') ?
                        ('$' + this.price.toFixed(2)) :
                        this.price;
                },
	        }
	    });

	    return Dish;
	}
);