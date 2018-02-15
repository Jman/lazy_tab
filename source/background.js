(function(tabs, windows){

    "use strict";

    const specialUrls =/chrome-extension:|chrome:|chrome-devtools:|file:|chrome.google.com\/webstore/;

    let discardAllTabs = () => {
        windows.getAll({populate: true}, windowsList => windowsList.forEach( win => {
            const minimized = win.state === 'minimized';

            win.tabs.forEach( tab => {
                if(tab.discarded) { return; }
                if(tab.pinned) { return; }
                if(tab.active && !minimized) { return; }
                if(tab.url && specialUrls.test(tab.url)){ return; }
                tabs.discard(tab.id);
            } )
        } ));
    };

    chrome.browserAction.onClicked.addListener( discardAllTabs );
    chrome.runtime.onStartup.addListener( discardAllTabs );

})(chrome.tabs, chrome.windows);
