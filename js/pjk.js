var PJK = function(){
    this.version = App.version;
    this.collections = [];
    this.projinks = [];
    this.error_message = "";
    this.current_tab_url = "";
    this.active_project_id = "";

    this.init = function(){
        this.retrieveStorage(this);
    }
    this.retrieveStorage = function(pjk){
        chrome.storage.sync.get('content_store', function(result){
            if(jQuery.isEmptyObject(result)) return;
            pjk.setCollections(result.content_store.collections);
            pjk.setProjinks(result.content_store.projinks);
        });
        return;
    }
    this.setCollections = function (coll){
        this.collections = coll;
    }
    this.setProjinks = function(pjinks){
        this.projinks = pjinks;
    }
    this.pushToCollection = function(value){
        var ck = 0;
        var error_code = '';
        if ( value.length < 1 ){
            ck++; error_code = "STRING_EMPTY_ERROR"
        }
        if ( value.length > 25 ){
            ck++; error_code = "STRING_LENGTH_ERROR"
        }
        if ( !value.match(/^[a-z0-9\s]+$/i) ){
            ck++; error_code = "STRING_ALLOWED_CHARACTER_ERROR";
        }
        if ( ck > 0 ){
            this.error_message = error_code;
            return false;
        }

        this.collections.push(value);
        this.projinks.push({
            links : [],
            created_date : Math.round(new Date().getTime() / 1000),
        });
        return true;
    }
    this.saveStorage = function(){
        var content_store = {};
        content_store.collections = this.collections;
        content_store.projinks = this.projinks;
        chrome.storage.sync.set({'content_store' : content_store});
    }
    this.addURL = function(){
        this.buildCurrentURL();
        this.projinks[this.active_project_id].links.push(this.current_tab_url);
        this.saveStorage();
    }
    this.buildCurrentURL = function(){
        this.current_tab_url = $('#live-url').val();
    }
    this.removeCollection = function(id_to_remove){
        this.collections.splice(id_to_remove,1);
        this.projinks.splice(id_to_remove, 1);
        this.saveStorage();
    }
    this.removeLinkFromActive = function(index){
        this.projinks[this.active_project_id].links.splice(index,1);
        this.saveStorage();

    }
    this.collection_count = function(){
        if ( this.collections == undefined ) return 0;
        return this.collections.length;
    }
    this.nextGenericName = function(){
        if (this.collection_count() < 1) return "Projink 1";
        // for loop / try match project 1 // or loop and no match go with that number
        return "";
    }
    this.init();
}