$(document).on("click", "#pjk-action-pl", function(){
    $('.views').css('display','none');
    $('#prolist').show();
    show_plist(pjk);
});

$(document).on("click", "#pjk-action-cp", function(){
    $('.views').css('display','none');
    $('#pname').val(pjk.nextGenericName());
    $('#view-create-project').show();
});

$(document).on("click", ".remove-projink",function() {
    
    pjk.removeCollection(pjk.active_project_id);

    var ele = $(this);
    removeElement(ele.parent().parent());
    pj_notify("projink removed");
});

$(document).on("click", ".open-project span.ptitle, .open-project span.expander", function(){

    var ele = $(this).parent();

    pjk.active_project_id = ele.attr('rel');

    toggle_projink(ele);

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
$(document).on("click", ".copy-url", function(){
    var ele = $(this).parent().find('input');
    var live_url = $('#live-url');
    live_url.val(ele.val());
    live_url.focus();
    live_url.select();
    document.execCommand('Copy');
    pj_notify("link copied to clipboard");
});


$(document).on("click", ".remove-link", function(){
    var ele = $(this);
    pjk.removeLinkFromActive(ele.attr('rel'));
    removeElement(ele.parent());
    pj_notify("link removed");
});

$(document).on("click", ".add-url", function(){
    var ele = $(this).parent();
    var actID = $(this).parent().attr('rel');
    console.log(actID);
    pjk.active_project_id = actID;
    pjk.addURL();

    var i = actID;
    var j = pjk.projinks[i].links.length - 1;

    links_holder = "";
    links_holder = append_pj_link(pjk,i,j);

    if (ele.find('ul.list-item-children').is(':visible')){} else{
        ele.find('ul.list-item-children').show();
    }
    ele.find('ul.list-item-children').append(links_holder);
    pj_notify("link added");
});

$(document).on("click", ".reset-projink", function(){
    pjk.clearActiveLinks();
    buildProjectView(pjk);
});

$(document).on("click", "#btn-view-create-project", function(){
    create_project(pjk);
});

$(document).on("click", ".logo img", function(){
    projinks_website("/");
});


$(function () {
    $('#projinks-listing ul').sortable({
        containment: 'parent', 
        tolerance: 'pointer', cursor: 'pointer',

        update: function( event, ui ) {
            save_sort();
        }

    });
});