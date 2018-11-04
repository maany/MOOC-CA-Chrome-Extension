//content script for kubernetes edx course
task_body = String($('body').html())
chrome.runtime.sendMessage({todo:"showPageAction"})
chrome.storage.sync.set({'task_title': "Kubernetes_edX"})
chrome.storage.local.set({'html': task_body})
console.log(task_body)