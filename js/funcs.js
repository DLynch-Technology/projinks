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
        var ele = $('#prolist #plist-right ul');
        ele.html("");
        for ( var i = 0; i < lt.length; i++){
            ele.append(
                "<li class='open-project' rel='"+ i +"'>"+
                    lt[i] +
                    //" <a href='#' rel='"+ i +"' class='remove-project'>R</a>"+
                    //"<a href='#' class='open-project' rel='"+ i +"'>O</a>"+
                "</li>"
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

var load_splash = function(pjk){
    setTimeout( function trigclick(){
        //should show active or plist if no active
        $("#pjk-action-pl").trigger("click");
    }, 100);
}
