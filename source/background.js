(function(request, tabs, windows){

    "use strict";

    var activated = [],
        blocked = [],
        on_before_request = function(details) {
            var tab_id = details.tabId,
                url = details.url;
            if( activated.indexOf(tab_id) !== -1 || url.indexOf('favicon.ico') !== -1){
                return {};
            }
            if(blocked.indexOf(tab_id) === -1){
                blocked[blocked.length] = tab_id;
            }
            return { redirectUrl : 'about:blank' };
        },
        check_tab = function(tab){
            if(!tab){
                return false;
            }
            if(activated.indexOf(tab.id) !== -1 || blocked.indexOf(tab.id) === -1){
                return false;
            }
            activated[activated.length] = tab.id;
            tabs.reload(tab.id);
            return true;
        },
        on_activated = function(data){
            tabs.get(data.tabId, check_tab);
        },
        on_created = function(){
            request.onBeforeRequest.removeListener(on_before_request);
        };


    request.onBeforeRequest.addListener( on_before_request,
        {
            urls  : ["http://*/*", "https://*/*"],
            types : ["sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
        },
        ["blocking"]
    );

    tabs.onCreated.addListener(on_created);
    tabs.onActivated.addListener(on_activated);

    windows.onCreated.addListener(on_created);

    tabs.query({'active':true}, function(tabs_list){
        var tab = tabs_list[0];
        activated[activated.length] = tab.id;
        if(tab.url.indexOf('http://') === 0 || tab.url.indexOf('https://') === 0){
            tabs.reload(tab.id);
        }
    });

})(chrome.webRequest, chrome.tabs, chrome.windows);
