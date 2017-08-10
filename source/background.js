(function(request, tabs, windows){

    "use strict";

    let activeTabs = [],
        handlers = {
            onBeforeRequest(details) {
                let tabId = details.tabId,
                    url = details.url;
                if( activeTabs.indexOf(tabId) !== -1 || url.indexOf('favicon.ico') !== -1){
                    return {};
                }
                return { redirectUrl : 'about:blank' };
            },
            onActivated(tab){
                if(!tab || activeTabs.indexOf(tab.tabId) !== -1){ return false; }
                activeTabs.push(tab.tabId);
                tabs.reload(tab.tabId);
            },
            onUpdated(tabId, details, tab ) {
                //The extensions gallery cannot be scripted
                let notAllowed = /chrome\.google\.com|chrome-search:\/\//;
                if(details.url && notAllowed.test(details.url)){
                    return;
                }
                if(activeTabs.indexOf(tabId) === -1 && details.status === "loading"){
                    tabs.executeScript(tabId, {code: "window.stop()", runAt : "document_start"});
                }
            },
            onCreated() {
                request.onBeforeRequest.removeListener(onBeforeRequest);
                tabs.onUpdated.removeListener(onUpdated);
            },
            onQueryActivateTab(tabsList) {
                activeTabs = activeTabs.concat( tabsList.map( (tab) => tab.id) );
            }
        };

    tabs.query({'active':true}, handlers.onQueryActivateTab);

    tabs.query({'pinned':true}, handlers.onQueryActivateTab);


    request.onBeforeRequest.addListener( handlers.onBeforeRequest,
        {
            urls  : ["http://*/*", "https://*/*"],
            types : ["sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
        },
        ["blocking"]
    );

    tabs.onUpdated.addListener(handlers.onUpdated);
    tabs.onCreated.addListener(handlers.onCreated);
    tabs.onActivated.addListener(handlers.onActivated);
    windows.onCreated.addListener(handlers.onCreated);

})(chrome.webRequest, chrome.tabs, chrome.windows);
