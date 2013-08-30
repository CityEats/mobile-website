define(['backbone'],
	function (Backbone) {
	    var ReviewItem = Backbone.Model.extend({
	        defaults: {
	            title: '',
	            rating: 0,
	            author: '',
	            date: '',
	            body: '',
	            ratingClass: function () {
	                switch (this.rating) {
	                    case 2:
	                        return 'two';
	                    case 3:
	                        return 'three';
	                    case 4:
	                        return 'four';
	                    case 5:
	                        return 'five';
	                    case 1:
	                    default:
	                        return 'one';
	                }
	            },

	            showReadMore: function () {
	                return this.body.length > 300;
	            }
	        }
	    });

	    return ReviewItem;
	}
);