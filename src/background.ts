chrome.commands.onCommand.addListener((command) => {
  if (command === "open-keymark") {
    chrome.action.openPopup();
  }
});
