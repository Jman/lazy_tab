(function (tabs, windows) {

  "use strict";

  /**
   * @param {chrome.windows.Window} win
   */
  function discardWindowTabs(win) {
    const minimized = win.state === 'minimized';

    win.tabs.forEach(tab => {
      if (tab.discarded) { return; }
      if (tab.pinned) { return; }
      if (tab.active && !minimized) { return; }
      try {
        tabs.discard(tab.id);
      } catch (e) { }
    });
  }

  function handleEvent() {
    windows.getAll({ populate: true }, windowsList => {
      windowsList.forEach(discardWindowTabs);
    });
  };

  function handleEventDelayed() {
    setTimeout(handleEvent, 7000);
  };

  chrome.action.onClicked.addListener(handleEvent);
  chrome.runtime.onStartup.addListener(handleEventDelayed);
  windows.onCreated.addListener((win) => {
    windows.get(win.id, { populate: true }).then((populatedWin) => {
      discardWindowTabs(populatedWin);
    });
  });

})(chrome.tabs, chrome.windows);
