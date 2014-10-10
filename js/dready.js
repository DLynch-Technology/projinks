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
    $('#pjk-action-pl').trigger("click");

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
    buildProjectView(pjk);
});

$(document).on("click", ".add-url", function(){
    var actID = $(this).parent().attr('rel');
    pjk.active_project_id = actID;
    pjk.addURL();

    var ele = $(this);
    

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

    ele.find('ul.list-item-children').append(links_holder);

    //function to append url
    //buildProjectView(pjk);
});
$(document).on("click", ".reset-projink", function(){
    pjk.clearActiveLinks();
    buildProjectView(pjk);
});

$(document).on("click", "#btn-view-create-project", function(){
    create_project(pjk);
});