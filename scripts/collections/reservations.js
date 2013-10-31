define(['backbone', 'models/reservation'],
	function (Backbone, ReservationItem) {
	    var Reservations = Backbone.Collection.extend({
	        model: ReservationItem
	    });

	    return Reservations;
	});