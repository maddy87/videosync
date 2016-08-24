/***
 * File to handle all the socket connections
 */
//Initialize socket Connection
var http = require('http');
var io = require('socket.io')(http);
var soc  =io();
//var currSocket  = io();
var rooms =['room1']
//Initialize kar rha hu
io.on('connection',function(soc){
    console.log('A new viewer has logged in');

    //Identify when the user was disconnected
});
var users = [];
var messages = [];
// To broad cast message to all peers
function send_message(){
    // when the client clicks SEND
    var message = $('#message').val();
    message.append(message)
    $('#message').val('');
    // broadcast the message to clients
    socket.emit('message', message);
}

// on load of page  call sendmessage whenever the user hits send or enters enter in the chatbox
$(function(){
    // when the client clicks SEND
    $('#send').click( function() {
        send_message
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
        send_message
    });
});
//update room
    io.sockets.on('connection', function (soc) {
    //func receive_msg
    soc.on('adduser', function(user){
        // store the username in the socket session for this client
        soc.username = username;
        username.append(user)
        // room1 is the default room creaated
        soc.join('room1');
        // echo to client they've connected

        // echo to room 1 that a person has connected to their room
        soc.broadcast.to('room1').emit('update_users', 'SERVER', username + ' has been added to the room');
        soc.emit('update_room', rooms, 'room1');

    });});

    // when the client adds himelf to the room , broadcast message to all
    soc.on('adduser', function(user){
        // store the username in the socket session for this client
        soc.username = username;
        username.append(user)
        // room1 is the default room creaated
        soc.join('room1');
        // echo to client they've connected

        // echo to room 1 that a person has connected to their room
        soc.broadcast.to('room1').emit('update_users', 'SERVER', username + ' has been added to the room');
        soc.emit('update_room', rooms, 'room1');
    });

    //when the user disconnects
    soc.on('disconnect', function(){
        // remove the username from global usernames list
        delete usernames[soc.username];
        // update list of users on client-side
        io.sockets.emit('update_users', users);
        // signal all the peers that the user has left
        soc.broadcast.emit('updatechat', 'SERVER', soc.username + ' has disconnected');
        soc.leave(soc.room);
    });

//send seekTO

/**
 * Function to see at some time
 */
function seek_to(){
    var seekto =$('#seekto').val();
    send_message(seekto.toString());
}
//get Seekto

/**
 * Lisen on all getSeekTo
 */
soc.on('getSeekTO', function(user) {
    // store the username in the socket session for this client
    if (seekto > soc.seekTo) {
    }
    soc.seekTo = seekTo;
});


