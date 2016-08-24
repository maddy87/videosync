/***
 *
 * Author : Rajesh Shetty
 * Description : Socket connection to sync messages between users *
 ***/

    /*
var videoApp = require('express')();
var http = require('http').Server(videoApp);

videoApp.get('/',function(req,res){
   res.sendfile('index.html');
});

http.listen(3333,function(){
   console.log('Started Express Server On :3333');
});
*/
var staticServer = require('node-static');
var http = require('http');
var file = new(staticServer.Server)();
var app = http.createServer(function (req, res) {
   file.serve(req, res);
}).listen(8080);

//Initialize socket Connection
var io = require('socket.io')(http);
//var currSocket  = io();
io.on('connection',function(socket){
   console.log('A new viewer has logged in');

   //Identify when the user was disconnected
});



