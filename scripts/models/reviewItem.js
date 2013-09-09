define(['backbone', 'modules/helper'],
	function (Backbone, Helper) {
	    var ReviewItem = Backbone.Model.extend({
	        defaults: {
	            title: '',
	            rating: 0,
	            author: '',
	            date: '',
	            body: '',
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