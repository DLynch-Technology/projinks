
var current_tab_url = function(){
    if ( chrome.tabs == undefined) return;
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
        $('#live-url').val(tabs[0].url);
        $('#live-title').val(tabs[0].title);

    });
}


var App = {};
App.version = "0.0.0.4";

App.fadeIn = 600;
App.fadeOut = 600;

current_tab_url();


var pjk = new PJK();


$(document).ready(function(){
    load_splash();
});