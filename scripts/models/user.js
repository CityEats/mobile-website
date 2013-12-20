define(['backbone', 'modules/helper'],
	function (Backbone, Helper) {
	    var User = Backbone.Model.extend({
	        defaults: {
	            id: 0,
	            getFullName: function () {
	                return this.first_name + ' ' + this.last_name;
	            },

	            formatPhone: function () {
	                return Helper.formatPhone(this.phone_number);
	            },
	        }
	    });

	    return User;
	}
);