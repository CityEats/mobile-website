mobile-website
==============

Mobile Website
##Libs
Backbone.js, Marionette.js, Require.js, Text.js (Require.js plugin for load html templates), JQuery.rateit (jquery plugin for render stars as some rating).

##Build production
```
git clone https://github.com/CityEats/mobile-website.git
install node.js
npm install -g requirejs
cd mobile-website/scripts
r.js.cmd -o build.js
cd ..
run under web server where API located
```

##Build dev
```
git clone https://github.com/CityEats/mobile-website.git
cd mobile-website\
change line 12 in  index.html from <script type="text/javascript" data-main="/scripts/main-built" src="/scripts/vendors/require/require.js"*</script> to <script type="text/javascript" data-main="/scripts/main" src="/scripts/vendors/require/require.js"></script>
run under web server where API located
```

##Structure
*	index.html – single page, start point.

*	mockups/ - folder with mock-ups files.

*	folder with *.csss and *.css files.

*	fonts/, css/ and img/ - are content folders.

*	scripts/ - all libs, html templates and files with business logic.

*	scripts/build.js – source file for require.js optimizer (r.js).

*	scripts/main-built.js – output file after build and optimization process.

*	scripts/app.js - 	Marionette application file.

*	scripts/main.js – configuration file for Require.js

*	scripts/router.js – configuration file for basic page layout (regions)  and for all Marionette routes.

*	scripts/collections/ - folder with Backbone collections files.

*	scripts/collections/controllers/ - folder with Marionette controllers files. Controller contains business logic and logic for binding models with correct views.

*	scripts/models/ - folder with Backbone models files.

*	scripts/modules/data.js – cache data module. This module contains cached models, objects and logic for maintains this objects.

*	scripts/modules/helper.js – module contains different helper’s methods like date and time formatting, etc.

*	scripts/modules/messages.js – module defines different subscriptions for working with API and with cached data. All commands and request with prefix “API:” are respond for working with API (build requests, parse response). All commands and request without prefix “API:” are respond for working with data objects and encapsulate API commands calls.  That’s why please don’t use API commands from business layer (controllers, views). Use only wrapped commands.

*	scripts/modules/: restaurant/completeReservation.js, restaurant/exclusiveEats.js, contactUs.js, forgotPassword.js are drafted files and will be removed as soon as this features implement. 

*	scripts/templates/ - folder with underscore.js templates.

*	scripts/vendors/ - folder with different js libs and frameworks.

*	scripts/views/ - folder with Marionette views files.