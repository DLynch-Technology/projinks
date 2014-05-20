chrome.browserAction.onClicked.addListener(function() {
   chrome.windows.create({'url': 'popup.html', 'type': 'popup'}, function(window) {
   });
});

