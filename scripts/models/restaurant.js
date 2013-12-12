define(['underscore', 'backbone', 'modules/helper', 'collections/reviews', 'collections/dictionary'],
	function (_, Backbone, Helper, Reviews, Dictionary) {
	    var Restaurant = Backbone.Model.extend({
	        defaults: {
	            distanceText: function () {
	                return this.distance_to_restaurant ? this.distance_to_restaurant.toFixed(2) + ' mi' : null;	                
	            },

	            cuisine_types: [],

	            cuisinesText: function (separator) {
	                separator = separator || ' / ';
	                return _(this.cuisine_types).map(function (item) { return item.name; }).join(separator);
	            },

	            priceSymbols: function () {
	                return (new Array(this.price_rating + 1)).join('$');
	            },

	            priceSymbolsReverse: function () {
	                return (new Array(5 - this.price_rating + 1)).join('$');
	            },

	            formatPhone: function () {
	                return Helper.formatPhone(this.phone_number);
	            },

	            slotsFormated: function() {
	                var times = this.selectedTime.split(':'),
	                    slots = this.slots;
	                var selectedHour = parseInt(times[0], 10),
                        selectedMin = parseInt(times[1], 10);

	                var date = new Date(2000, 1, 1, selectedHour, selectedMin);

	                var minus15 = new Date(date),
                        plus15 = new Date(date);
	                minus15.setMinutes(minus15.getMinutes() - 15);
	                plus15.setMinutes(plus15.getMinutes() + 15);	                

	                //unfortunately api returns all slots, but we need only 3 of them.	                

	                var times = [
                        {
                            text: Helper.formatTime(minus15.getHours(), minus15.getMinutes()).textSimple,
                            amText: Helper.formatTime(minus15.getHours(), minus15.getMinutes()).amText
                        },
                        {
                            text: Helper.formatTime(date.getHours(), date.getMinutes()).textSimple,
                            amText: Helper.formatTime(date.getHours(), date.getMinutes()).amText
                        },
	                    {
	                        text: Helper.formatTime(plus15.getHours(), plus15.getMinutes()).textSimple,
	                        amText: Helper.formatTime(plus15.getHours(), plus15.getMinutes()).amText
	                    }
	                ];

	                var result = new Array(3);
	                for (var i = 0; i < slots.length; i++) {
	                    var time = Helper.newDate(slots[i], this.current_time_offset),
                            h = time.getHours(),
	                        m = time.getMinutes();

	                    var position = -1
	                    if (h == selectedHour && m == selectedMin)
	                        position = 1;
	                    else if (h == minus15.getHours() && m == minus15.getMinutes())
	                        position = 0;
	                    else if (h == plus15.getHours() && m == plus15.getMinutes())
	                        position = 2;

	                    if (position >= 0)
	                        result[position] = {
	                            text: Helper.formatTime(h, m).textSimple,
	                            amText: Helper.formatTime(h, m).amText,
	                            value: Helper.formatTime(h, m).value,
	                            isEmpty: false
	                        };
	                }

	                for (var i = 0; i < result.length; i++) {
	                    if (typeof result[i] == 'undefined') {
	                        result[i] = {
	                            text: times[i].text,
	                            amText: times[i].amText,
	                            isEmpty: true
	                        };
	                    }
	                }

	                return result;
	            },

	            slotFormated: function (index) {
	                return Helper.formatDateShort2(this.slots[index]);
	            },

	            thumbImage: function () {
	                if (this.images.length > 0) return this.images[0].thumb_mobile_app;
	                else return '';
	            },

	            paymentsText: function () {
	                return this.payment_options.join(', ');
	            },

	            geoImageUrl: function () {
	                if (this.address.lat && this.address.lng) return 'http://maps.googleapis.com/maps/api/staticmap?center=' + this.address.lat + ',' + this.address.lng + '&zoom=12&size=292x73&sensor=false&&markers=color:red%7Clabel:R%7C' + this.address.lat + ',' + this.address.lng;
	                else return null;
	            },

	            selectedTimeFormated: function () {
	                return Helper.formatTime(this.selectedTime)
	            }
	        },

	        highlights: function () {
	            var result = _.find(this.get('lists'), function (item) { return item.list.title.toLowerCase() === 'highlights'; });
	            if (result) return (result.list.description || '').split('\n');
	            else return [];
	        },

	        goodToKnow: function () {
	            var result = _.find(this.get('lists'), function (item) { return item.list.title.toLowerCase() === 'good to know'; });
	            if (result) return (result.list.description || '').split('\n');
	            else return [];
	        },

	        recommendedDishes: function () {
	            var result = _.find(this.get('aside_lists'), function (item) { return item.classification.toLowerCase() === 'recommended-dishes' });
	            return result ? result.description : [];
	        },

	        recommendedMargaritas: function () {
	            var result = _.find(this.get('aside_lists'), function (item) { return item.classification.toLowerCase() === 'recommended-drinks' });
	            return result ? result.description : [];
	        },

	        getReviewCollection: function () {
	            this.reviewCollection || (this.reviewCollection = new Reviews);

	            this.reviewCollection.reset(_.map(this.get('reviews'), function (item) { return item.review; }));
	            return this.reviewCollection;
	        },

	        getFullSlots: function () {
	            var times = Helper.getTimes(),
                    that = this,
	                slots = _.map(this.get('slots'), function (item) {
	                    return Helper.formatTime(Helper.newDate(item, that.get('current_time_offset')))
	                });

	            return new Dictionary(_.map(times, function (item) {
	                var time = Helper.parseDate('2000-01-01', item.value),
	                    formated = Helper.formatTime(time.getHours(), time.getMinutes());

	                return {
	                    key: formated.value,
	                    value: formated,
	                    selected: _.some(slots, function (slot) { return slot.value == formated.value })
	                }
	            }));
	        },
	    });

	    return Restaurant;
	}
);