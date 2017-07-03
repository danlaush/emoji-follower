// this is the background code...
console.log('loaded extension');
var init = false;
var emojiOn = false;
// listen for our browerAction to be clicked
chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	init = true;
	emojiOn = !emojiOn;
	console.log('switching emojiOn to: ', emojiOn);
	start(tab);
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {nextStatus: emojiOn}, function(response) {
	  	
        
        var icon = (emojiOn) ? 'icon--on.png' : 'icon--off.png';
        chrome.browserAction.setIcon({'path': icon});
	  });
	});
	// init = true;
	// if(!init) {
	// } else {
	// }
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	console.log('page changed');
  if (changeInfo.status == 'complete') {

    // do your things
    if(init && emojiOn) {

    	start(tab);
    }
  }
})

function start(tab) {
	chrome.tabs.executeScript(tab.ib, {
		file: 'inject.js'
	});
}