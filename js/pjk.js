var PJK = function(){
    this.version = App.version;
    this.collections = [];
    this.projinks = [];
    this.error_message = "";
    this.current_tab_url = "";
    this.active_project_id = "";
    this.recent_projinks = [];
    this.live_projink = {};
    this.settings = {
        'sortby' : 0,
    };

    this.init = function(){
        this.upgrade();
        this.retrieveStorage(this);
        
    }

    this.setAppVersion = function(ver){
        this.version = ver;
    }

    this.packMeta = function(){
        return {
            'recent_projinks' : this.recent_projinks,
            'active_project_id' : this.active_project_id,
            'settings' : this.settings,
        }
    }
    this.unpackMeta = function(obj){
        this.recent_projinks = obj.recent_projinks;
        this.active_project_id = obj.active_project_id;
        this.settings = obj.settings;

    }
    this.saveStorage = function(){
        var content_store = {};
        content_store.meta = this.packMeta();
        content_store.collections = this.collections;
        content_store.projinks = this.projinks;
        content_store.app_version = this.version;

        chrome.storage.sync.set({'content_store' : content_store});
    }
    this.retrieveStorage = function(pjk){
        chrome.storage.sync.get('content_store', function(result){
            if(jQuery.isEmptyObject(result)) return;
            pjk.setCollections(result.content_store.collections);
            pjk.setProjinks(result.content_store.projinks);
            pjk.unpackMeta(result.content_store.meta);

            if (result.content_store.app_version == undefined){
                result.content_store.app_version = 0;
            }
            pjk.setAppVersion(result.content_store.app_version);


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
        // handle validation else where

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

    this.setActiveProjink = function(id){
        if (id == undefined) return false;
        this.active_project_id = id;
    }

    this.makeProjinkLive = function(id){
        this.live_projink = {
            'name' : this.collections[id],
            'links' : this.projinks[id].links,
            'id' : id,
            'description' : '',
        };
        if (this.projinks[id].description != undefined){
            this.live_projink.description = this.projinks[id].description;
        }
    }

    this.upgrade = function(){
        db_version = 0;
        
        chrome.storage.sync.get('content_store', function(result){
            if(jQuery.isEmptyObject(result)) return;
            tobj = result.content_store;
            var save = false;

            if(tobj.app_version == "0.0.0.2"){
                pjk.settings = {
                    'sortby' : 0,
                }
                tobj.app_version = "0.0.0.3";
                save = true;
            }
            if(tobj.app_version == "0.0.0.3"){
                save = true;
            }
            if ( save ){
                pjk.setAppVersion(App.version);
                pjk.saveStorage();
            }
            
        });

    }

    this.init();
}