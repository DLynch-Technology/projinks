

var App = {};
App.version = "0.0.0.1";

App.fadeIn = 600;
App.fadeOut = 600;

current_tab_url();
var pjk = new PJK();

$(document).ready(function(){
    load_splash(pjk);
});

