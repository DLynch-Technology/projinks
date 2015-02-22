var set_tab_live = function(id){
    $('.topnav-item').each(function(){
        var ele = $(this);
        if(ele.attr('id') == id){
            ele.addClass('nav-live');
        } else {
            if( ele.hasClass('nav-live')){
                ele.removeClass('nav-live');
            }
        }
    });
}


var show_plist = function(){

    if ( pjk.collection_count() > 0 ){
        
        set_tab_live("pjk-action-pl");

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
                "<li id='list-item"+ i +"'class='open-project pj-parent' rel='"+ i +"'>"+
                    "<a href='#' class='par-icons add-url' alt='Add link to Projink' title='Add link to Projink'><i class='fa fa-chain'></i></a>" +
                    "<a href='#' class='pjk-action-edit par-icons' alt='Edit Projink' title='Edit Project'><i class='fa fa-edit'></i></a>" +
                    "<a href='#' class='par-cursor expander par-icons'><i class='fa fa-folder'></i></a> " +
                    "<span class='par-cursor ptitle'>" + lt[i] + "</span>" +
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

        $("#pjk-action-cp").trigger();
    }

}

var append_pj_link = function(pjk,i,j){
    var dis_url = pjk.projinks[i].links[j];
    var dis_url_short = trunc_url(dis_url, 60);
    links_holder = "";
    links_holder += "<li><span class='bigtext open-url-new-tab' rel='"+ dis_url +"'>";
    links_holder += dis_url_short;
    links_holder += "</span>";
    links_holder += "<input type='hidden' value='"+ dis_url +"' />";
    links_holder += "<br /><br />";
    // links_holder += "<a href='#' class='open-url' rel='"+ dis_url +"' alt='Open in current tab' title='Open in current tab'><i class='fa fa-flash'></i></a> ";
    links_holder += "<a href='#' class='open-url-new-tab' rel='"+ dis_url +"' alt='Open in new tab' title='Open in new tab'><i class='fa fa-external-link'></i></a> ";
    links_holder += "<a href='#' class='copy-url' rel='"+ dis_url +"' alt='Copy link to clipboard' title='Copy link to clipboard'><i class='fa fa-clipboard'></i></a> "; 
    links_holder += "<a href='#' class='remove-link' rel='"+ j +"' alt='remove link' title='remove link'><i class='fa fa-remove'></i></a>";
    links_holder += "</li>";
    return links_holder;
}

var trunc_url = function(str, len){
    if ( str.length <= len) return str;

    var sstr = str.substring(0, len);
    return sstr + "...";
}

var toggle_projink = function(ele){
    var expander = ele.find('a.expander i');
    switch_expander(expander);

    var subele = ele.find('ul.list-item-children');
    if ( subele.is(':visible') ){
        //removeElement(ele.find('nav'));
        subele.hide();
    } else {
        // var nav_html = "<nav class='pj-nav' style='display: inline-block;'>";
        // nav_html += "<a href='#' class='par-icons add-url' alt='Add link to Projink' title='Add link to Projink'><i class='fa fa-chain'></i></a>";
        // nav_html += "<a href='#' class='par-icons remove-projink' alt='Remove Projink' title='Remove Projink'><i class='fa fa-trash'></i></a>";
        // nav_html += "</nav>";
        // ele.find('.ptitle').after(nav_html);
        subele.show();
    }
}

var switch_expander = function(ele){
    if ( ele.hasClass('fa-folder')){
        ele.removeClass('fa-folder');
        ele.addClass('fa-folder-open');
    } else {
        ele.removeClass('fa-folder-open');
        ele.addClass('fa-folder');
    }

}

var load_splash = function(){
    setTimeout( function trigclick(){
        //should show active or plist if no active
        if ( pjk.collection_count() > 0 ){
            $("#pjk-action-pl").trigger("click");
        } else {
            $("#pjk-action-cp").trigger("click");
        }
    }, 100);
}

var map_rel_to_add_button = function(id){
    var button = $('#footer-add-url');
    button.attr('rel',id);
}

var removeElement = function(ele){
    ele.remove();
}
var projinks_website = function(uri){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        var url = "http://projinks.com" + uri;
        chrome.tabs.update(tab.id, {url: url});
    });
}

var pj_notify = function(mess){
    var blk = $('#notify');
    blk.fadeOut();
    blk.text(mess);
    blk.fadeIn(App.fadeIn).delay(1000).fadeOut(App.fadeOut);
}

var save_sort = function(){

    //overwrite object with new order
    var new_collections = Array();
    var new_projinks = Array(); 
    $('#projinks-listing ul.ui-sortable > li').each(function(){
        var ele = $(this).attr('rel');

        new_collections.push(pjk.collections[ele]);
        new_projinks.push(pjk.projinks[ele]);
    });

    pjk.collections = new_collections;
    pjk.projinks = new_projinks;
    pjk.saveStorage();
     
}

/** VIEW BUILDERS **/
var buildProjectView = function(pjk){
    vw = $('#plist');
    vw.html('');
    if ( pjk.active_project_id == undefined ) return;
    if ( pjk.projinks[pjk.active_project_id].links.length > 0 ){
        for( var i = 0; i < pjk.projinks[pjk.active_project_id].links.length; i++ ){
            vw.append( 
                "<li><span class='bigtext open-url' rel='"+ pjk.projinks[pjk.active_project_id].links[i] +"'>"+
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

var buildEditView = function(pj_id){
    pjk.makeProjinkLive(pj_id);
    var view = $('#view-project-edit');
    //set name
    view.find('h2').text(pjk.live_projink.name);
    view.find('form input[name=name]').val(pjk.live_projink.name);
    
    var desc = '';
    if ( pjk.live_projink.description ) desc = pjk.live_projink.description;
    view.find('form textarea').text(desc);
}

/** END VIEW BUILDERS **/


/** FORM ACTIONS **/
var create_projink = function(){
    var name = $('#pname').val();
    if (!validate_projink_name(name)){
        return false;
    }


    var obj = {
        'name' : name,
        'description' : '',
    }
    // apply this back later
    //if ($('#pdescription').val() != '') obj.description = $('#pdescription').val();

    var try_push = pjk.pushToCollection(obj);
    if (try_push){
        pjk.saveStorage();
        transition_to_plist();
        return;
    }
}

var saveProjinkEdit = function(){
    var frm = $('#save-projink-form');
    var name = frm.find('input[name=name]').val();
    var description = frm.find('textarea').val();

    if(!validate_projink_name(name)){
        pj_notify('Please try again with an acceptable name.');
        return false;
    }

    if (description != '') pjk.projinks[pjk.live_projink.id].description = description;
    pjk.collections[pjk.live_projink.id] = name;
    pjk.saveStorage();
    pj_notify('saved');
    return false;
}



/** END FORM ACTIONS **/
