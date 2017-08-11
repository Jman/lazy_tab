(function(tabs){

    "use strict";

    const specialUrls =/chrome-extension:|chrome:|chrome-devtools:|file:|chrome.google.com\/webstore/;

    let discardAllTabs = () => {
        tabs.query({}, tabsList => {
            tabsList.forEach( tab => {
                if(tab.pinned || tab.active || tab.discarded) { return; }
                if(tab.url && specialUrls.test(tab.url)){ return; }
                tabs.discard(tab.id);
            } )
        });
    };

    chrome.browserAction.onClicked.addListener( discardAllTabs );
    chrome.runtime.onStartup.addListener( discardAllTabs );

})(chrome.tabs);
