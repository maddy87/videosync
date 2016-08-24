/***
 * Author : Rajesh Shetty
 * Description : Script that sync the Youtube player across multiple apps
 *
 * @type Javascript Document
 * References : https://developers.google.com/youtube/iframe_api_reference#Retrieving_video_information
 * References : http://tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript/
 */

///Youtube Player Initializaed to Zero
var youtubePlayer = 0;
//Set Refresh Interval
var refreshInterval = 0;
//Set syncVideo DB Store
var syncVideo = new Firebase('https://syncvideo.firebaseio.com/');
//Initialize Username
var username = "User"+Math.floor((Math.random() * 100000) + 1);
//syncVideo.push({ name : username  });
//Set the Time when the user Needs to start
var updatedTime = 0;
var syncChatRef = new Firebase('https://syncvideochats.firebaseio.com/');
var controls = syncVideo.child('control');
var seekVideo = syncVideo.child('progressbar');
var users = syncChatRef.child('users');
var chats = syncChatRef.child('chats');
var currprogress = syncChatRef.child('currprogress');
var userInfo = {};
userInfo[username]=0;
var syncOnce = false;
//syncChatRef.push('users/test');
/***
 * Function to initialize the Youtube Player in the iframe
 */
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtubePlaceholder', {
        width: 600,
        height: 400,
        videoId: '0vrdgDdPApQ', //Id of the video to be played
        playerVars: {
            color: 'white',
            playlist: 'PftcnRRAg0o,kjRAWql2A3E' //VideoId's of the Playlist to be played
        },
        events: {
            onReady: startSync //Start the syncing process
        }
    });
}
/***
 * Function to intialize the controls on the page and
 * default the values for the controllers
 */
function startSync(){

    //Initialize Control
    initControls();
    changeSeekTime(1);

    //Keep the seekBar updated
    refreshInterval = setInterval(function () {
        initControls();
        //updateProgressBar();
    }, 5000);
}

/***
 * Function that modifies the seek time to an specific
 * value specified
 * @param seekTime : Value of the frame to be initialized
 */
function changeSeekTime(seekTime){
    //Move the player to seek to the below value
    youtubePlayer.seekTo(seekTime);
}

/***
 * Function to Load Controls
 */
function initControls(){

    // Update current time text display.
    setDuration();
    setCurrentTime();
    setProgressBar();
    //Get the count of users

    users.once('value',function(snapshot){
        var count = snapshot.numChildren()-1;
        $('#usercount').text("Users Currently Watching : " +count);

        //console.log(snapshot.val());
    });
    var uTime = youtubePlayer.getDuration() * ($('#playerSeekBar').value / 100);
    var p = {};
    p[username] = youtubePlayer.getCurrentTime();
    console.log(youtubePlayer.getCurrentTime());
    currprogress.update(p);

    if(syncOnce) {

        currprogress.once('value', function (snapshot) {
            //var count = snapshot.numChildren()-1;
            //$('#usercount').text("Users Currently Watching : " +count);
            console.log("Here in currprogress");
            var min = 100;
            var data = snapshot.val();
            delete data["admin"];
            for (var value in data) {
                if (data[value] < min) {

                    min = data[value];
                    console.log("updated min value" + min);
                    //syncOnce = false;
                }
                console.log(data[value]);
            }
            var t = {};
            //t["admin"]=min;
            //currprogress.update(t);

            for (var key in data) {
                var x = data;
                if(Math.abs(x[key]-min) > 5){

                    x[key] = min;
                    console.log("updating value for key");
                    currprogress.update(x);
                    changeSeekTime(min);
                }
            }
            //var p = {};
            //p[username] = min;//youtubePlayer.getCurrentTime();
            //console.log(youtubePlayer.getCurrentTime());
            //currprogress.update(p);


            //syncOnce = false;
            console.log(snapshot.val());
        });
    }

}

//Give a Random UserName

$('#userName').val(username);
//var users = {}

users.push({username:username});
//currprogress.push(userInfo);

//Event Listener Chat Messages
$('#sendMessage').on('click', function () {
    //var name = $('#userName').val();
    console.log("Here in Chat message");
    var text = $('#chatMessage').val();
    if (text != '') {
        chats.push({name: username, text: text});
        $('#chatMessage').val('');
    }
});

//Auto Sync
$('#autoSync').on('click', function () {
    //var name = $('#userName').val();
    syncOnce = true;
    console.log("syncing again");

});


//Send Messages when the chats are in sync
chats.on('child_added', function(snapshot) {
    var message = snapshot.val();
    users.once('value',function(snapshot){
        var count = snapshot.numChildren()-1;
        $('#usercount').text("Users Currently Watching"+count);
    });
    $('<div/>').text(message.text).prepend($('<b/>').text(message.name+' : ')).appendTo($('#chatBox'));
    $('#chatBox')[0].scrollTop = $('#chatBox')[0].scrollHeight;
});

//Event Listener For the Play Button
$('#playerPlay').on('click', function () {
    youtubePlayer.playVideo();
    controls.update({play:true});
});

//Event Listener For the Pause Button
$('#playerPause').on('click', function () {
    youtubePlayer.pauseVideo();
    controls.update({play:false});
});


//Trigger the NextVideo in the playList
$('#playerNext').on('click', function () {
    youtubePlayer.nextVideo()
});

//Trigger the previous video in the playlist
$('#playerPrev').on('click', function () {
    youtubePlayer.previousVideo()
});

/***
 * Load the video from the queueList if Requested
 */
$('.queue').on('click', function () {

    var url = $(this).attr('data-video-id');
    youtubePlayer.cueVideoById(url);

});



/**
 * Sets the current time for the video
 * converstion for the video is done
 * at the convert time method
 */
function setCurrentTime(){
    //Update the current time from the youtubePlayers current time
    $('#current-time').text(convertTime( youtubePlayer.getCurrentTime() ));
}

/**
 * Finds the length of the video and sets the
 * duration value for the same
 */
function setDuration(){
    $('#duration').text(convertTime( youtubePlayer.getDuration() ));
}

/***
 * Sets the progress bar value based on the value from
 * the player
 */
function setProgressBar(){
    $('#playerSeekBar').val((youtubePlayer.getCurrentTime() / youtubePlayer.getDuration()) * 100);
}

// This function is called by startSync()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
    $('#playerSeekBar').val((youtubePlayer.getCurrentTime() / youtubePlayer.getDuration()) * 100);
}


//Event ListenerFor ProgressBar
//Updates the current Progress Value and sends it across
//to clients to update.
$('#playerSeekBar').on('mouseup touchend', function (e) {

    //Get the current time from the value of the progress bar clicked.
    updatedTime = youtubePlayer.getDuration() * (e.target.value / 100);

    //Move the video update to the updatedTime that was calculated.
    youtubePlayer.seekTo(updatedTime);
    seekVideo.update({progressbar:updatedTime});

});

/***
 * Converts the time to the desired format
 * @param time
 * @returns {string}
 */
function convertTime(time){
    time = Math.round(time);
    var seconds =  time - Math.floor(time / 60)  * 60;
    var newSeconds = seconds < 10 ? '0' + seconds : seconds;
    return Math.floor(time / 60)+":"+newSeconds;

}

/***
 * Function to listen to any updates from the other
 * peers regarding the change in code
 */
seekVideo.on('child_changed',function(snapshot){
    console.log("Here in syncvideo");
    console.log(snapshot.val());
    changeSeekTime(snapshot.val());
});

/***
 * Function to listen to any updates from the other
 * peers regarding the change in code
 */
controls.on('child_changed',function(snapshot){
    console.log("Here in controls");
    console.log(snapshot.val());
    changePlayBehaviour(snapshot.val());
});



function changePlayBehaviour(status){
    //Play or Pause the video
    //based on the status
    console.log("In Changebehaviour");
    if(status === true)
    {youtubePlayer.playVideo();}
    else{
        console.log("in else ");
        youtubePlayer.pauseVideo();
    }
}

