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

});

$(document).on("click", ".open-project span.ptitle, .open-project span.expander", function(){

    var ele = $(this).parent();

    pjk.active_project_id = ele.attr('rel');

    toggle_projink(ele);

    
    //map_rel_to_add_button(pjk.active_project_id);
    

    //$('.views').css('display', 'none');
    //var vw = $('#projink-view');
    //pjk.addToRecent(pjk.active_project_id);
    //pjk.saveStorage();  // saving all -- can probably just save one here investigate further

    
    //vw.find('h2').text(pjk.collections[pjk.active_project_id]);
    //buildProjectView(pjk);
    //vw.show();
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
});


$(document).on("click", ".remove-link", function(){
    var ele = $(this);
    pjk.removeLinkFromActive(ele.attr('rel'));
    removeElement(ele.parent());
    //buildProjectView(pjk);
});

$(document).on("click", ".add-url", function(){
    var ele = $(this).parent().parent();
    var actID = $(this).parent().parent().attr('rel');
    console.log(actID);
    pjk.active_project_id = actID;
    pjk.addURL();

    var i = actID;
    var j = pjk.projinks[i].links.length - 1;

    links_holder = "";
    links_holder = append_pj_link(pjk,i,j);

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