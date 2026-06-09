(function (tabs, windows) {
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

  function burstDectecor({ limit, timeout, handler }) {
    let timer = null;
    let eventCount = 0;

    return function detect() {
      eventCount++;
      if (timer) return;

      timer = setTimeout(() => {
        if (eventCount >= limit) handler();
        eventCount = 0;
        timer = null;
      }, timeout);
    };
  }

  chrome.action.onClicked.addListener(handleEvent);
  chrome.runtime.onStartup.addListener(handleEvent);

  tabs.onCreated.addListener(
    burstDectecor({ limit: 5, timeout: 60, handler: handleEvent })
  );

})(chrome.tabs, chrome.windows);
