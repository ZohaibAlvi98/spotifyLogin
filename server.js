var http = require("http");
var express = require("express");
var app = express()
var request = require('request')
  /* Create an HTTP server to handle responses */

  var client_id = '63409db3a7ad4078ad7f8d18d319436c'; // Your client id
  var client_secret = 'f58624d8da3d4f86b5570d5fb120bce1'; // Your secret
  var redirect_uri = 'http://localhost:4040/callback';
  


  app.get('/login', function(req, res) {
    var scopes = 'user-read-private user-read-email';
    let url = 'https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri);
    console.log(url)
    res.redirect(url);
    });
  app.get('/callback', function(req, res) {
   console.log('here') 
   console.log(req.query.code)
   request.post({ url: 'https://accounts.spotify.com/api/token',
   form: {
       grant_type: 'authorization_code',
       code: req.query.code,
       redirect_uri: 'http://localhost:4040/callback',
       client_id: '63409db3a7ad4078ad7f8d18d319436c',
       client_secret: 'f58624d8da3d4f86b5570d5fb120bce1'
   }

   }, function (err, httpResponse, body) {

   var data = JSON.parse(body)

   if(!err && httpResponse.statusCode == 200 && data.success != false){
    request({
      url: 'https://api.spotify.com/v1/me',
      headers: {
         'Authorization': 'Bearer '+ data.access_token
      },
      rejectUnauthorized: false
    }, async function(err, httpRes,body) {
          if(err) {
            console.error(err);
          } else {
            //console.log(body)
              let data = await JSON.parse(body)
              console.log(data.display_name)
              console.log(data.email)

        }
      })
     }
    })
})



app.listen(4040, function(){
  console.log('server started')
})
