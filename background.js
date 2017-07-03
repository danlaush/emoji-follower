// every time a page updates or gets opened
// check if the script has been executed
// if not executed
// - check if 

// can't use an init var saved at the browser scope, as injection is per page
// have to use messaging to determine whether script has been injected in page

var emojiOn = false;

chrome.browserAction.onClicked.addListener(function (tab) {
	emojiOn = !emojiOn;
  // Send a message to the current tab. If no response, inject script
  checkPresence(tab.id);
  var icon = (emojiOn) ? 'icon--on.png' : 'icon--off.png';
  chrome.browserAction.setIcon({'path': icon});
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  if(emojiOn) {
    console.log('active tab updated while extension on');
    checkPresence(activeInfo.tabId);
  } else {
    chrome.tabs.sendMessage(activeInfo.tabId, {nextStatus: emojiOn});
  }
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if(emojiOn) {
    console.log('page updated while extension on');
    checkPresence(tab.id);
  } else {
    chrome.tabs.sendMessage(tab.id, {nextStatus: emojiOn});
  }
});

function checkPresence(tabId, callback) {
  chrome.tabs.sendMessage(tabId, {nextStatus: emojiOn}, function(response) {
    console.log('response: ',response);
    if(response === undefined) {
      start(tabId);
    }
  });
}

function start(tabId) {
	chrome.tabs.executeScript(tabId, {
		file: 'inject.js'
	});
}