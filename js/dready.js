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

$(document).on("click", ".add-url", function(){
    pjk.addURL();
    buildProjectView(pjk)
});
