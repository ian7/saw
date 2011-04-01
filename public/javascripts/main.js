//Configure RequireJS
require({
    //Load jQuery before any other scripts, since jQuery plugins normally
    //assume jQuery is already loaded in the page.
    priority: ['jquery.min']
});

//Load scripts.
require(['jquery.min', 'jquery.tools.min','underscore','jquery.autogrowtextarea','backbone/backbone'] );

//$.noConflict();


