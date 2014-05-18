
var App = {};
App.version = "0.1";


var PJK = function(){
    this.version = App.version;
    this.collections = [];
    this.projinks = [];
    this.error_message = "";
    this.current_tab_url = "";

    this.init = function(){
        this.retrieveStorage(this);
    }
    this.retrieveStorage = function(pjk){
        var colls = [];
        chrome.storage.sync.get('content_store', function(result){
            if(jQuery.isEmptyObject(result)) return;
            pjk.setCollections(result.content_store.collections);
            pjk.setProjinks(result.content_store.projinks);
        });
        return;
    }
    this.setCollections = function (coll){
        this.collections = coll;
    }
    this.setProjinks = function(pjinks){
        this.projinks = pjinks;
    }
    this.pushToCollection = function(value){
        var ck = 0;
        var error_code = '';
        if ( value.length < 1 ){
            ck++; error_code = "STRING_EMPTY_ERROR"
        }
        if ( value.length > 25 ){
            ck++; error_code = "STRING_LENGTH_ERROR"
        }
        if ( !value.match(/^[a-z0-9\s]+$/i) ){
            ck++; error_code = "STRING_ALLOWED_CHARACTER_ERROR";
        }
        if ( ck > 0 ){
            this.error_message = error_code;
            return false;
        }

        this.collections.push(value);
        this.projinks.push({});
        return true;
    }
    this.saveStorage = function(){
        var content_store = {};
        content_store.collections = this.collections;
        content_store.projinks = this.projinks;
        chrome.storage.sync.set({'content_store' : content_store});
    }
    this.buildCurrentURL = function(){
        this.current_tab_url = $('#live-url').text();
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
    this.nextGenericName = function(){
        if (this.collection_count() < 1) return "Projink 1";
        // for loop / try match project 1 // or loop and no match go with that number
        return "";
    }
    this.init();
}

var pjk;

$(document).ready(function(){
    current_tab_url();
    
    pjk = new PJK();
    //pjk.buildCurrentURL();
    //not sure why i can't get the selector of liveURL right.. Tak
    var URL = $('#live-url').text();
    console.log(URL);

    $('#lk-cp').click(function(){
        $('.views').css('display','none');
        $('#pname').val(pjk.nextGenericName());
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

$(document).on("click", ".open-project", function(){
    var ele = $(this);
    $('.views').css('display', 'none');

    var vw = $('#projink-view');
    vw.find('h2').text(pjk.collections[ele.attr('rel')]);
    vw.show();
});

var current_tab_url = function(){
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
        $('#live-url').html(tabs[0].url);
    });
}

var create_project = function(pjk){

    var try_push = pjk.pushToCollection($('#pname').val());
    if (try_push){
        pjk.saveStorage();
        $('#lk-pl').trigger('click');
        return;
    }

    
}

var show_plist = function(pjk){

    if ( pjk.collection_count() ){
        var lt = pjk.collections;
        $('#prolist ul').html("");
        for ( var i = 0; i < lt.length; i++){
            $('#prolist ul').append("<li>"+ lt[i] +" <a href='#' rel='"+ i +"' class='remove-project'>remove</a> <a href='#' class='open-project' rel='"+ i +"'>open</a></li>");
        }
    }

}
