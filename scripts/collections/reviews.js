define(['backbone', 'models/reviewItem'],
	function (Backbone, ReviewItem) {
	    var Reviews = Backbone.Collection.extend({
	        model: ReviewItem
	    });

	    return Reviews;
	});