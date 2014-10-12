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
            var links_holder = "";
            if ( pjk.projinks[i].links.length > 0 ){
                for( var j = 0; j < pjk.projinks[i].links.length; j++ ){
                    links_holder += append_pj_link(pjk,i,j);
                }
            }

            ele.append(
                "<li id='list-item"+ i +"'class='open-project' rel='"+ i +"'>"+
                    "<span class='expander'>+</span> " +
                    "<span class='ptitle'>" + lt[i] + "</span>" +
                    " <a href='#' class='add-url'>quick add</a>"+
                    "<ul style='display: none;' class='list-item-children'>" + links_holder + "</ul>" +
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

var append_pj_link = function(pjk,i,j){
    links_holder = "";
    links_holder += "<li><span class='bigtext'>";
    links_holder += pjk.projinks[i].links[j];
    links_holder += "</span>";
    links_holder += "<input type='hidden' value='"+ pjk.projinks[i].links[j] +"' />";
    links_holder += "<br /><a href='#' class='open-url' rel='"+ pjk.projinks[i].links[j] +"'>Open</a> ";
    links_holder += "<a href='#' class='open-url-new-tab' rel='"+ pjk.projinks[i].links[j] +"'>New Tab</a> ";
    links_holder += "<a href='#' class='copy-url' rel='"+ pjk.projinks[i].links[j] +"'>Copy to Clipboard</a> ";
    links_holder += "<a href='#' class='remove-link' rel='"+ j +"'>Delete</a>";
    links_holder += "</li>";
    return links_holder;
}

var current_tab_url = function(){
    if ( chrome.tabs == undefined) return;
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
        $('#live-url').val(tabs[0].url);
    });
}

// function to be deprecated
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

var toggle_projink = function(ele){
    var expander = ele.find('span.expander');
    switch_expander(expander);

    var subele = ele.find('ul.list-item-children');
    if ( subele.is(':visible') ){
        subele.hide();
    } else {
        subele.show();
    }
}

var switch_expander = function(ele){
    if ( ele.text() == "+"){
        ele.text("-");
    } else {
        ele.text("+");
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

var removeElement = function(ele){
    ele.remove();
}