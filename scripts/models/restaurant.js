define(['underscore', 'backbone','modules/helper'],
	function (_, Backbone, Helper) {
	    var Restaurant = Backbone.Model.extend({	       
	        defaults: {
	            distance: 5,
	            distanceText: function () {
	                return this.distance.toFixed(2) + ' mi';
	            },
	            cuisine_types: [],
	            cuisinesText: function () {
	                return _(this.cuisine_types).map(function (item) { return item.name; }).join(' / ');
	            },	            

	            priceSymbos: function () {
	                return (new Array(this.price_rating + 1)).join('$');
	            },

	            ratingClass: function () {
	                return Helper.ratingClass(parseInt(this.rating, 10));
	            },

	            slotsFromated: function () {

	                var times = this.selectedTime.split(':');
	                var selectedHour = parseInt(times[0], 10),
                        selectedMin = parseInt(times[1], 10);
                    
	                var result = new Array(3);                    
	                for (var i = 0; i < this.slots.length; i++) {
	                    var time = new Date(this.slots[i]),
                        h = time.getHours(time),
	                    m = time.getMinutes(time);
	                    var position = 0
	                    if (h < selectedHour || m < selectedMin) {
	                        position = 0;
	                    } else if (h == selectedHour && m == selectedMin) {                            
	                        position = 1;
	                    }
	                    else if (h > selectedHour || m > selectedMin) {
	                        position = 2;
	                    }

	                    result[position] = {
	                        text: Helper.formatTime(h, m).textSimple,
	                        value: this.slots[i],
	                        isEmpty: false
	                    };
	                }
	                return result;
	            },	            
	        },	        

	        
	    });

	    return Restaurant;
	}
);