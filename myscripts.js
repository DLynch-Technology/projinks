
var App = {};
App.version = "0.1";


var PJK = function(){
    this.version = App.version;
    this.collections = [];
    this.projinks = [];
    this.error_message = "";
    this.current_tab_url = "";
    this.active_project_id = "";

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
        this.projinks.push({
            links : [],
            created_date : Math.round(new Date().getTime() / 1000),
        });
        return true;
    }
    this.saveStorage = function(){
        var content_store = {};
        content_store.collections = this.collections;
        content_store.projinks = this.projinks;
        chrome.storage.sync.set({'content_store' : content_store});
    }
    this.addURL = function(){
        this.buildCurrentURL();
        this.projinks[this.active_project_id].links.push(this.current_tab_url);
        this.saveStorage();
    }
    this.buildCurrentURL = function(){
        this.current_tab_url = $('#live-url').val();
    }
    this.removeCollection = function(id_to_remove){
        this.collections.splice(id_to_remove,1);
        this.projinks.splice(id_to_remove, 1);
        this.saveStorage();
    }
    this.removeLinkFromActive = function(index){
        this.projinks[this.active_project_id].links.splice(index,1);
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
    pjk.active_project_id = ele.attr('rel');
    vw.find('h2').text(pjk.collections[pjk.active_project_id]);
    buildProjectView(pjk);
    vw.show();
});
/* double clicking list item should do something someday */
$(document).on("click", ".open-url-new-tab", function(){
    var ele = $(this);
    chrome.tabs.create({ url: ele.attr('rel') });
});
$(document).on("click", ".open-url", function(){
    var ele = $(this);
    //window.location.href = ele.attr('rel');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {url: ele.attr('rel')});
    });
});
$(document).on("click", ".remove-link", function(){
    var ele = $(this);
    pjk.removeLinkFromActive(ele.attr('rel'));
    buildProjectView(pjk);
});

var buildProjectView = function(pjk){
    vw = $('#plist');
    vw.html('');

    if ( pjk.projinks[pjk.active_project_id].links.length > 0 ){
        for( var i = 0; i < pjk.projinks[pjk.active_project_id].links.length; i++ ){
            vw.append( 
                "<tr>"+

                "<td>"+
                    "<a href='#' class='open-url' rel='"+ pjk.projinks[pjk.active_project_id].links[i] +"'>open url</a> "+
                    "<a href='#' class='open-url-new-tab' rel='"+ pjk.projinks[pjk.active_project_id].links[i] +"'>o in new tab</a> "+
                    "<a href='#' class='remove-link' rel='"+ i +"'>remove</a>"+
                "</td>"+
                "<td>" + 
                    pjk.projinks[pjk.active_project_id].links[i] + 
                "</td></tr>"
                );
        }
    }
}

$(document).on("click", ".add-url", function(){
    pjk.addURL();
    buildProjectView(pjk)
});

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

var current_tab_url = function(){
    if ( chrome.tabs == undefined) return;
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
        $('#live-url').val(tabs[0].url);
    });
}
