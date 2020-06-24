(function(tabs, windows){

    "use strict";

    const discardAllTabs = () => {
        windows.getAll({ populate: true }, windowsList => windowsList.forEach( win => {
            const minimized = win.state === 'minimized';

            win.tabs.forEach( tab => {
                if(tab.discarded) { return; }
                if(tab.pinned) { return; }
                if(tab.active && !minimized) { return; }
                try{
                    tabs.discard(tab.id);
                } catch (e) {}
            } );
        } ));
    };

    chrome.browserAction.onClicked.addListener( discardAllTabs );
    chrome.runtime.onStartup.addListener( discardAllTabs );

})(chrome.tabs, chrome.windows);
