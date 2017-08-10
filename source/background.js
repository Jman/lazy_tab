(function(tabs){

    "use strict";

    tabs.query({}, tabsList => {
        tabsList.forEach( tab => {
            if(tab.pinned || tab.active || tab.discarded) {
                return;
            }
            tabs.discard(tab.id);
        } )
    });

    chrome.browserAction.onClicked.addListener( tab => tabs.discard(tab.id) );

})(chrome.tabs);
