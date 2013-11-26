define(['backbone', 'modules/helper'],
	function (Backbone, Helper) {
	    var Model = Backbone.Model.extend({
	        defaults: {
	            title: function () {
	                var date = Helper.newDate(this.reserved_for, this.current_time_offset);
	                var time = Helper.formatTime(date);
	                return Helper.formatDateRelative(date, true) + ' ' + time.textSimple + time.amText + ' for ' + this.party_size + ' people';
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