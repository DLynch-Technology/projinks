

$(document).ready(function(){
	make_current_url_live();
	$('#button-go-to-url').click(function(){
		var live_url = $('#live-url').val();
		chrome.tabs.update({ url: live_url });
		//if url doesn't have prefix http:// add it before submit
	});
});

var make_current_url_live = function(){
	chrome.tabs.getSelected(null, function(tab) {
    	document.getElementById('live-url').value = tab.url;
	});
}