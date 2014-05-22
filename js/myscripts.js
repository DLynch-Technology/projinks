

var App = {};
App.version = "0.0.0.1";


current_tab_url();
var pjk = new PJK();

$(document).ready(function(){
    //may need a timeout aspect to retriving storage.. It tends to not be ready 
    

    $('#btn-view-create-project').click(function(){
        create_project(pjk);
    });

    $("#pjk-action-pl").trigger("click");
});

