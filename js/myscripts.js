var App = {};
App.version = "0.0.0.1";

var pjk;


$(document).on("click", "#pjk-action-pl", function(){
    $('.views').css('display','none');
    $('#prolist').show();
    show_plist(pjk);
});

$(document).ready(function(){

    current_tab_url();
    
    pjk = new PJK();
    console.log(pjk);
    $("#pjk-action-pl").trigger("click");

    $('#btn-view-create-project').click(function(){
        create_project(pjk);
    });


});

$(document).on("click", "#pjk-action-cp", function(){
    $('.views').css('display','none');
    $('#pname').val(pjk.nextGenericName());
    $('#view-create-project').show();
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
    if ( pjk.active_project_id == undefined ) return;
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
        $('#pjk-action-pl').trigger('click');
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
