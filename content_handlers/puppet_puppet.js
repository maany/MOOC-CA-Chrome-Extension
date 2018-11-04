//content script for kubernetes edx course
task_body = String($('body').html())
$.get(chrome.extension.getURL('/popup.html'), function(data) {
    //$(data).appendTo('body');
    // Or if you're using jQuery 1.8+:
    $($.parseHTML(data)).appendTo('body');
});
chrome.runtime.sendMessage({todo:"showPageAction"})
chrome.storage.sync.set({'task_title': "Puppet_puppet"})
chrome.storage.local.set({'html': task_body})
console.log(task_body)