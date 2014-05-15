

$(document).ready(function(){
	make_current_url_live();
	$('#button-go-to-url').click(function(){
		var live_url = $('#live-url').val();
		chrome.tabs.update({ url: live_url });
		//if url doesn't have prefix http:// add it before submit
	});
	$('#add-url-to-list').click(function(){
		alert(455);
		chrome.storage.sync.set({ 'last_url' : $('#live-url').val() });

		chrome.storage.sync.get('last_url', function(val){
			console.log(val.last_url);
		});

		

	});
});

var make_current_url_live = function(){
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    	document.getElementById('live-url').value = tabs[0].url;
	});
}