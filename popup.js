chrome.browserAction.onClicked.addListener(function() {
   chrome.windows.create({'url': 'popup.html', 'type': 'popup'}, function(window) {
   });
});

var current_tab_url = function(){
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
        $('#live-url').val(tabs[0].url);
    });
}