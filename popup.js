chrome.browserAction.onClicked.addListener(function() {
   chrome.windows.create({'url': 'popup.html', 'type': 'popup'}, function(window) {
   });
});

chrome.tabs.getSelected(null, function(tab) {
    document.getElementById('live-url').value = tab.url;
});