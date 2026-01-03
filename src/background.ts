chrome.commands.onCommand.addListener((command) => {
  if (command !== "open-keymark") return;
  const openFallbackWindow = () => {
    try {
      chrome.windows.create({
        url: chrome.runtime.getURL('index.html'),
        type: 'popup',
        focused: true,
        width: 480,
        height: 640
      });
    } catch (e) {
      console.error('Failed to open fallback window for Keymark', e);
    }
  };

  try {
    const result = (chrome.action as any).openPopup?.();

    if (result && typeof result.then === 'function') {
      result.catch((err: unknown) => {
        console.warn('chrome.action.openPopup() failed, falling back to window:', err);
        openFallbackWindow();
      });
    } else {
      try {
        (chrome.action as any).openPopup((/* maybe callback */) => {
          if (chrome.runtime.lastError) {
            console.warn('chrome.action.openPopup() lastError, falling back:', chrome.runtime.lastError);
            openFallbackWindow();
          }
        });
      } catch (e) {
        console.warn('chrome.action.openPopup() threw, falling back:', e);
        openFallbackWindow();
      }
    }
  } catch (e) {
    console.warn('Error calling chrome.action.openPopup(), falling back to window:', e);
    openFallbackWindow();
  }
});
