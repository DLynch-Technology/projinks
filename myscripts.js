

$(document).ready(function(){
	make_current_url_live();
	$('#button-go-to-url').click(function(){
		var live_url = $('#live-url').val();
		chrome.tabs.update({ url: live_url });
		//if url doesn't have prefix http:// add it before submit
	});
	$('#add-url-to-list').click(function(){
		chrome.storage.sync.set({ 'last_url' : $('#live-url').val() });

		chrome.storage.sync.get('last_url', function(val){
			console.log(val.last_url);
		});

	});

	$('#lk-cp').click(function(){
		$('.views').css('display','none');
		$('#view-create-project').show();

	});

	$('#btn-view-create-project').click(function(){
		create_project();
	});
});

var make_current_url_live = function(){
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    	document.getElementById('live-url').value = tabs[0].url;
	});
}

var create_project = function(){
	alert(434);
}
