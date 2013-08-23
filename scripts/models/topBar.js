define(['backbone'],
	function (Backbone) {
	    var TopBar = Backbone.Model.extend({
	        defaults: {
	            leftText: 'Home',
	            rightText: '',
	            title: ''
	        }
	    });

	    return TopBar;
	}
);