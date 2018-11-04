//chrome.app.runtime.onLaunched.addListener(function() {
//    chrome.app.window.create('popup.html', 
//      { "innerBounds": { "width": 400, "height": 300 },
//        "id": "popup"
//      });
//  });

chrome.pageAction.onClicked.addListener(function(tab){
    chrome.runtime.sendMessage({todo:"submit"})
})
// activate plugin on course progress pages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo =="showPageAction"){
        chrome.tabs.query({"active":true, "currentWindow": true}, function(tabs){
            currentTab = tabs[0]
            chrome.pageAction.show(currentTab.id)
            chrome.storage.sync.set({'url': currentTab.url})
        });
    }
    else if(request.todo == "submit"){
        console.log("YOYOYOYOYOYO")
    }
})

function helloFromBackground(){
    print("running in background")
}