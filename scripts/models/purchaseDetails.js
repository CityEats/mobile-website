define(['backbone'],
	function (Backbone) {
	    var PurchaseDetails = Backbone.Model.extend({
	        defaults: {
	            price: 0,
	            accountBalance: 0,
	            chargeableAmount: function () {
	                var value = this.price - this.accountBalance;
	                return value > 0 ? value : 0;
	            },
	            remainingBalance: function () {
	                var value = this.accountBalance - this.price;
	                return value > 0 ? value : 0;
	            }
	        }
	    });

	    return PurchaseDetails;
	}
);