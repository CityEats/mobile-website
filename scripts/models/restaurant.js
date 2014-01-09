define(['underscore', 'backbone', 'modules/helper', 'collections/reviews', 'collections/dictionary'],
	function (_, Backbone, Helper, Reviews, Dictionary) {
	    var Restaurant = Backbone.Model.extend({
	        defaults: {
	            distanceText: function () {
	                return this.distance_to_restaurant ? this.distance_to_restaurant.toFixed(2) * 1000 + ' mi' : null;
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

	            slotsFormated: function (specialMealId) {
	                var times = this.selectedTime.split(':'),
	                    slots,
	                    selectedHour = parseInt(times[0], 10),
                        selectedMin = parseInt(times[1], 10);

	                if (specialMealId) {
	                    var meals = _.findWhere(this.special_meals_slots, { id: specialMealId });
	                    slots = meals ? meals.slots : [];
	                } else {
	                    slots = this.slots;
	                }

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

	            slotFormated: function (index, specialMealId) {                    
	                var slots;
	                if (specialMealId) {
	                    var meals = _.findWhere(this.special_meals_slots, { id: specialMealId });
	                    slots = meals ? meals.slots : [];
	                } else {
	                    slots = this.slots;
	                }

	                return Helper.formatDateShort2(slots[index]);
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

	        getFullSlots: function (specialMealId, selectedDate) {
	            var selectedDate = new Date(selectedDate),
                    startDate,
                    endDate,
	                that = this,
                    items,
	                slots;

	            var openDay = _.chain(this.get('restaurant_open_hours'))
                    .where({ day_of_week: (selectedDate.getDay()) })
                    .map(function (item) {
                        var start = item.start_time.split(':');
                        var end = item.end_time.split(':');
                        return {
                            start_time: item.start_time,
                            start_time_h: parseInt(start[0], 10),
                            start_time_m: parseInt(start[1], 10),
                            end_time: item.end_time,
                            end_time_h: parseInt(end[0], 10),
                            end_time_m: parseInt(end[1], 10),
                            start_time_tmp: parseFloat(start[0] + '.' + start[1]),
                            end_time_tmp: parseFloat(end[0] + '.' + end[1]),
                        };
                    })
                    .value();

	            if (openDay.length > 0) {
	                var start_time = _.min(openDay, function (item) { return item.start_time_tmp; }),
                        end_time = _.max(openDay, function (item) { return item.end_time_tmp; });
                    
	                startDate = new Date(selectedDate);
	                startDate.setHours(start_time.start_time_h);
	                startDate.setMinutes(start_time.start_time_m);

	                endDate = new Date(selectedDate);
	                endDate.setHours(end_time.end_time_h);
	                endDate.setMinutes(end_time.end_time_m);

	                if (startDate > endDate) endDate.setDate(endDate.getDate() + 1);
	            }

                //get start time and end time
	            var times = Helper.getTimes(selectedDate, startDate, endDate);

	            if (specialMealId) {
	                var meals = _.findWhere(this.get('special_meals_slots'), { id: specialMealId });
	                items = meals ? meals.slots : [];
	            } else {
	                items = this.get('slots');
	            }

	            slots = _.map(items, function (item) {
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