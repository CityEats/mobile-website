define(['marionette', 'underscore', 'views/account/reservations/item', 'text!templates/account/reservations/all.html'], function (Marionette, _, ItemView, itemHtml) {

    var ItemView = Marionette.CompositeView.extend({
        template: _.template(itemHtml),
        itemView: ItemView,

        events: {
            'click .btnAbout': 'btnAboutClick',
            'click .tabsLink.active': 'goToVoid',
        },

        //templateHelpers: {
        //    upcoming: function () {
        //        return _.where(this, { state: 'pending' });
        //    },
        //    past: function () {
        //        return _.where(this, { state: 'arrived' });
        //    }
        //},

        appendHtml: function (collectionView, itemView, index) {
            var holder;
            if (itemView.model.isUpcoming()) {
                holder = collectionView.$('.upcomingReservations');
            }
            else if (itemView.model.isPast()) {
                holder = collectionView.$('.pastReservations');
            }
            else {
                holder = collectionView.$('.canceledReservations');
            }
            holder.append(itemView.el);
        },

        btnAboutClick: function (evt) {
            evt.preventDefault();
            app.router.navigate('profile', { trigger: true });
        },

        goToVoid: function (evt) {
            evt.preventDefault();
        }
    });

    return ItemView;
});