

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
	$('#lk-pl').click(function(){
		$('.views').css('display','none');
		$('#prolist').show();
		show_plist();
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
	var pname = $('#pname').val();
	if ( pname.length < 1) return;

	var psaved_list;
	chrome.storage.sync.get('mainlist', function(saved_list){
		console.log(saved_list);
		
		if(jQuery.isEmptyObject(saved_list)) {

			saved_list.mainlist = {};
			saved_list.mainlist.plist = [];
		}

		if ( saved_list.mainlist.plist == undefined ){
			saved_list.mainlist.plist = [];
		}
		saved_list.mainlist.plist.push($('#pname').val());

		
		save_project(saved_list.mainlist);
	});
	$('#lk-pl').trigger('click');

}

var save_project = function(obj){

	chrome.storage.sync.set({'mainlist' : obj });
}

var show_plist = function(){
	chrome.storage.sync.get('mainlist', function(saved_list){
		var lt = saved_list.mainlist.plist;
		$('#prolist ul').html("");
		for ( var i = 0; i < lt.length; i++){
			$('#prolist ul').append("<li>"+ lt[i] +"</li>");
		}
	});
}