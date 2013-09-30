define(['backbone', 'modules/helper'],
	function (Backbone, Helper) {
	    var ReviewItem = Backbone.Model.extend({
	        defaults: {
	            title: '',
	            rating: 0,
	            author: '',
	            date: '',
	            body: '',

	            atmosphere_rating: 0,
	            created_at: '',
	            dishes: [],
	            feedback: '',
	            food_rating: 0,
	            good_for: [],
	            madlibs: '',
	            overall_rating: '',
	            restaurant_id: 0,
	            service_rating: 0,
	            title: '',

	            ratingClass: function () {
	                return Helper.ratingClass(this.rating);
	            },

	            showReadMore: function () {
	                return this.body.length > 300;
	            }
	        }
	    });

	    return ReviewItem;
	}
);