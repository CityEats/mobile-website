define(['backbone'],
	function (Backbone) {
	    var City = Backbone.Model.extend({
	        defaults: {
	            active: false,
	            created_at: '',
	            display_name: '',
	            id: 0,
	            lat: 0,
	            lng: 0,
	            short_name: '',
	            time_zone: '',

	            isCurrent: false
	        }
	    });

	    return City;
	}
);