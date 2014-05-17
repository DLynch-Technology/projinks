
var App = {};
App.version = "0.1";


var PJK = function(){
	this.version = App.version;
	this.collections = [];


	this.init = function(){
		this.retrieveStorage(this);
	}

	this.retrieveStorage = function(pjk){
		var colls = [];
		chrome.storage.sync.get('content_store', function(result){
			if(jQuery.isEmptyObject(result)) return;
			pjk.setCollections(result.content_store.collections);
		});
		return;
	}

	this.setCollections = function (coll){
		this.collections = coll;
	}

	this.pushToCollection = function(value){
		this.collections.push(value);
	}

	this.saveStorage = function(){
		var content_store = {};
		content_store.collections = this.collections;
		chrome.storage.sync.set({'content_store' : content_store});
	}

	this.removeCollection = function(id_to_remove){
		console.log(id_to_remove);
		this.collections.splice(id_to_remove,1);
		this.saveStorage();
	}

	this.collection_count = function(){
		if ( this.collections == undefined ) return 0;
		return this.collections.length;
	}

	this.init();
}

var pjk;

$(document).ready(function(){

	pjk = new PJK();

	


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
		show_plist(pjk);
	});

	$('#btn-view-create-project').click(function(){
		create_project(pjk);
	});

});

$(document).on("click", ".remove-project",function() {
	var ele = $(this);
	var id_to_remove = ele.attr('rel');
	pjk.removeCollection(id_to_remove);
	ele.parent().remove();
});

var make_current_url_live = function(){
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    	document.getElementById('live-url').value = tabs[0].url;
	});
}

var create_project = function(pjk){
	//do validation here
	var pname = $('#pname').val();
	if ( pname.length < 1) return;

	pjk.pushToCollection(pname);
	pjk.saveStorage();

	$('#lk-pl').trigger('click');
}

var show_plist = function(pjk){

	if ( pjk.collection_count() ){
		var lt = pjk.collections;
		$('#prolist ul').html("");
		for ( var i = 0; i < lt.length; i++){
			$('#prolist ul').append("<li>"+ lt[i] +" <a href='#' rel='"+ i +"' class='remove-project'>remove</a></li>");
		}
	}

}
