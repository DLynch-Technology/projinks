var PJK = function(){
    this.version = App.version;
    this.collections = [];
    this.projinks = [];
    this.error_message = "";
    this.current_tab_url = "";
    this.active_project_id = "";
    this.recent_projinks = [];

    this.init = function(){
        this.retrieveStorage(this);
    }
    this.packMeta = function(){
        return {
            'recent_projinks' : this.recent_projinks,
            'active_project_id' : this.active_project_id
        }
    }
    this.unpackMeta = function(obj){
        this.recent_projinks = obj.recent_projinks;
        this.active_project_id = obj.active_project_id;
    }
    this.saveStorage = function(){
        var content_store = {};
        content_store.meta = this.packMeta();
        content_store.collections = this.collections;
        content_store.projinks = this.projinks;
        chrome.storage.sync.set({'content_store' : content_store});
    }
    this.retrieveStorage = function(pjk){
        chrome.storage.sync.get('content_store', function(result){
            if(jQuery.isEmptyObject(result)) return;
            pjk.setCollections(result.content_store.collections);
            pjk.setProjinks(result.content_store.projinks);
            pjk.unpackMeta(result.content_store.meta);
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
        this.clean_recent_projects();

        var ck_exist = this.recent_projinks.indexOf(id_to_remove);
        if ( ck_exist > -1) this.recent_projinks.splice(ck_exist, 1);
        this.active_project_id = "";

        this.saveStorage();
    }
    this.isCollection = function(id){
        if ( id == null ) return false;
        if ( typeof this.projinks[id] == 'undefined') return false;
        return true;
    }
    this.clean_recent_projects = function(){
        for ( i = 0; i < this.recent_projinks.length; i++){
            if ( !this.isCollection(this.recent_projinks[i]) ) this.recent_projinks.splice(i, 1);
        }
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
    this.addToRecent = function(id){
        if ( pjk.recent_projinks.length == undefined ){
            pjk.recent_projinks.push(id);
            return;
        }

        var ck_4_val = pjk.recent_projinks.indexOf(id);
        if ( ck_4_val > -1 ){
            pjk.recent_projinks.splice(ck_4_val, 1);
        }

        pjk.recent_projinks.unshift(id);
    }
    this.clearActiveLinks = function(){
        this.projinks[this.active_project_id].links = [];
        this.saveStorage();
    }

    this.init();
}