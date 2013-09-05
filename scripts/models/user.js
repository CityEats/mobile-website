﻿define(['backbone'],
	function (Backbone) {
	    var User = Backbone.Model.extend({
	        defaults: {
	            name: '',
	            id: 0
	        }
	    });

	    return User;
	}
);