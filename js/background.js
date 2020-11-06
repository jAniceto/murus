// Open new tab when clicking Murus icon
chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({"url": "chrome://newtab"})  
})