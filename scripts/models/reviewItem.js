define(['backbone', 'modules/helper'],
	function (Backbone, Helper) {
	    var ReviewItem = Backbone.Model.extend({
	        defaults: {
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
	            username: '',

	            ratingClass: function () {
	                return Helper.ratingClass(parseInt(this.overall_rating, 10));
	            },	            

	            date: function () {
	                return Helper.formatDateLong(this.created_at);
	            }
	        },

            maxLength: 100,

            getShortContent: function () {                
	            return this.get('madlibs').substring(0, this.maxLength);
	        }
	    });

	    return ReviewItem;
	}
);