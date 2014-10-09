var create_project = function(pjk){

    var try_push = pjk.pushToCollection($('#pname').val());
    if (try_push){
        pjk.saveStorage();
        $('#pjk-action-pl').trigger('click');
        return;
    }

    
}

var show_plist = function(pjk){

    if ( pjk.collection_count() > 0 ){
        var lt = pjk.collections;
        var ele = $('#prolist #projinks-listing ul');
        ele.html("");
        for ( var i = 0; i < lt.length; i++){
            ele.append(
                "<li class='open-project' rel='"+ i +"'>"+
                    "+ " +
                    lt[i] +
                "</li>"
                );
        }
        pjk.clean_recent_projects();

        var rele = $('#recent-list');
        rele.html('');
        var coll_length = pjk.recent_projinks.length;
        if ( coll_length > 5 ) coll_length = 5;
        for ( var i = 0; i < coll_length; i++){
            var pj_id = pjk.recent_projinks[i];
            var coll = pjk.collections[pj_id];
            var display_text = coll.charAt(0).toUpperCase();
            rele.append(
                "<article class='open-project letter-blocks' rel='"+ pj_id +"'>"
                + display_text
                + "</article>"
            );
        }

    } else {

        // no projects should have a fall back
    }

}

var current_tab_url = function(){
    if ( chrome.tabs == undefined) return;
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
        $('#live-url').val(tabs[0].url);
    });
}


var buildProjectView = function(pjk){
    vw = $('#plist');
    vw.html('');
    if ( pjk.active_project_id == undefined ) return;
    if ( pjk.projinks[pjk.active_project_id].links.length > 0 ){
        for( var i = 0; i < pjk.projinks[pjk.active_project_id].links.length; i++ ){
            vw.append( 
                "<li><span class='bigtext'>"+
                    pjk.projinks[pjk.active_project_id].links[i] + 
                    "</span>"+
                    "<input type='hidden' value='"+ pjk.projinks[pjk.active_project_id].links[i] +"' />"+
                    "<br /><a href='#' class='open-url' rel='"+ pjk.projinks[pjk.active_project_id].links[i] +"'>Open</a> "+
                    "<a href='#' class='open-url-new-tab' rel='"+ pjk.projinks[pjk.active_project_id].links[i] +"'>New Tab</a> "+
                    "<a href='#' class='copy-url' rel='"+ pjk.projinks[pjk.active_project_id].links[i] +"'>Copy to Clipboard</a> "+
                    "<a href='#' class='remove-link' rel='"+ i +"'>Delete</a>"+
                "</li>"
                );
        }
    }
}

var load_splash = function(pjk){
    setTimeout( function trigclick(){
        //should show active or plist if no active
        $("#pjk-action-pl").trigger("click");
    }, 100);
}

var map_rel_to_add_button = function(id){
    var button = $('#footer-add-url');
    button.attr('rel',id);
}
