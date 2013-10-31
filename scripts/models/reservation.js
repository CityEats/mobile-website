define(['backbone', 'modules/helper'],
	function (Backbone, Helper) {
	    var Model = Backbone.Model.extend({
	        defaults: {
	            title: function () {	                
	                var time = Helper.formatTime(new Date(this.reserved_for));
	                return Helper.formatDateRelative(this.reserved_for, true) + ' ' + time.textSimple + time.amText + ' for ' + this.party_size + ' people';
	            }
	        },
	        isUpcoming: function () {
	            return this.get('state') == 'pending';
	        },
	        isPast: function () {
	            return this.get('state') == 'arrived';
	        },
	        isCanceled: function () {
	            return this.get('state') == 'cancelled';
	        },
	    });

	    return Model;
	}
);