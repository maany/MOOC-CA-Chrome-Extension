$(function(){
    var auth_url
    var token_url
    var refresh_token_url
    var client_id
    var client_secret
    var submit_url
    var token
    // set redirect uri
    var redirect_uri = chrome.identity.getRedirectURL()
    $('#redirect_uri').html(redirect_uri)
    // set values for fields
    chrome.storage.sync.get(
        [
          'auth_url',
          'token_url',
          'refresh_token_url',
          'client_id',
          'client_secret',
          'submit_url',
          'token'
        ],  function(data) {
                auth_url = data.auth_url
                token_url = data.token_url
                refresh_token_url = data.refresh_token_url
                client_id = data.client_id
                client_secret = data.client_secret
                submit_url = data.submit_url
                token = data.token
                $('#auth_url').val(auth_url)
                $('#token_url').val(token_url)
                $('#refresh_token_url').val(refresh_token_url)
                $('#client_id').val(client_id)
                $('#client_secret').val(client_secret)
                $('#token').val(token)
                $('#submit_url').val(submit_url)
        })

    $('#save').click(function(){
        auth_url = $('#auth_url').val()
        token_url = $('#token_url').val()
        refresh_token_url = $('#refresh_token_url').val()
        client_id = $('#client_id').val()
        client_secret = $('#client_secret').val()
        submit_url = $('#submit_url').val()
        token = $('#token').val()
        chrome.storage.sync.set(
            {
                'auth_url': auth_url,
                'token_url': token_url,
                'refresh_token_url': refresh_token_url,
                'client_id': client_id,
                'client_secret': client_secret,
                'submit_url':submit_url,
                'token': token
            }, function(){
                close();
            })
    })

    $('#oauth_flow').click(function(){
        var id = {
            'url': auth_url + "?client_id=" + client_id + "&response_type=code" + "&redirect_uri=" + redirect_uri,
            'interactive': true
         };
         chrome.identity.launchWebAuthFlow(id, function(url){
            //TODO catch error
    
            //continue with processing
            var auth_code = url.substring(url.indexOf("=")+ 1)
            console.log("Auth Code: " + auth_code)

            // Exchange auth code for Token
            $.ajax({
                type: 'POST',
                aysnc: 'false',
                url: token_url,
                crossDomain: true,
                data: {
                  'code': auth_code,
                  'grant_type': 'authorization_code',
                  'redirect_uri': redirect_uri
                },
                beforeSend: function(request){
                  console.log("auth_code:" + auth_code)
                  console.log("client id:" + client_id)
                  console.log("client secret:" + client_secret)
                  console.log("redirect uri:" + redirect_uri)
                  request.setRequestHeader('Authorization', "Basic " + btoa(client_id + ":" + client_secret))
                },
                success: function(data){
                  console.log("Access_token " + data.access_token)
                  token = data.access_token
                  $('#token').val(token)
                  chrome.storage.sync.set({
                      'token' : token
                  }, function(){
                      console.log('token saved!')
                  })
                  console.log("expires in " + data.expires_in)
                  console.log("token type " + data.token_type)
                  console.log("Refresh_token " + data.refresh_token)
          
                }
            })
        })
    })
})

