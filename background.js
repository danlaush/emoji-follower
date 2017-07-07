// every time a page updates or gets opened
// check if the script has been executed
// if not executed
// - check if 

// can't use an init var saved at the browser scope, as injection is per page
// have to use messaging to determine whether script has been injected in page

var emojiOn = false;
localStorage.setItem('emojiOn', JSON.stringify(false));

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.nextEmojiStatus)
  console.log(message.nextEmojiStatus);
  emojiOn = message.nextEmojiStatus;
  var icon = (emojiOn) ? 'icon--on.png' : 'icon--off.png';
  chrome.browserAction.setIcon({'path': icon});

  chrome.tabs.query({active:true},function(tabs){

    if(tabs.length === 0) {
      console.log('no active tabs');
      return;
    }
    console.log('got the active tab: ', tabs[0].id);
    
    checkPresence(tabs[0].id);
  });        
});

// chrome.browserAction.onClicked.addListener(function (tab) {
// 	emojiOn = !emojiOn;
//   // Send a message to the current tab. If no response, inject script
// });

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

function checkPresence(tabId) {
  console.log('check for script');
  chrome.tabs.sendMessage(tabId, {nextStatus: emojiOn}, function(response) {
    console.log('response: ',response);
    if(response === undefined) {
      console.log('no script found, running injection')
      start(tabId);
    } else {
      console.log('found a script already');
    }
  });
}

function start(tabId) {
  console.log('injecting to tab', tabId);
	chrome.tabs.executeScript(tabId, {
		file: 'inject.js'
	});
}