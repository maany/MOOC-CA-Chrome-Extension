$(function(){
  console.log("READY")
  // storage variable list
  var html
  var url
  var task_title 
  var submit_url
  var token
  
  // fetch stored data
  chrome.storage.sync.get(
    [
      'url',
      'task_title',
      'submit_url',
      'token'
    ], function(data) {
          url = data.url
          task_title = data.task_title
          //TODO better place?
          $('#task_title').html(task_title)
          submit_url = data.submit_url
          token = data.token
  })
  // fetch html from chrome local storage
  chrome.storage.local.get(['html'], function(data){
    html = data.html
  })
  $('#options').click(function(){
      chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
  });
  $('#submit').click(function(){
    $.ajax({
      contentType: 'application/text',
      crossDomain: true,
      data: JSON.stringify({
        'url': url,
        'name': task_title,
        'html': html
      }),
      type: 'POST',
      url: submit_url,
             
      success: function(response){
        console.log("Task Submitted Successfully")
        $("#status").append("<p class='text-center alert alert-success'>" + "Submitted!!" + "</p>")
      },
      error: function(xhr){
        //TODO handle error 
        console.log('error' + xhr)
        $("#status").append("<p class='text-center alert alert-danger'>" + xhr.statusText + "</p>")
      },
      beforeSend: function(request){
        console.log(html) 
        request.setRequestHeader("Authorization", "Bearer " + token)
      }
    })
  })
});


  