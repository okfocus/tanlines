// Browser detection
var VIDEO_EXTENSION, VIDEO_MIME, AUDIO_EXTENSION, AUDIO_MIME;
var browserErrorMsg = 'Your browser doesn\'t support HTML5 video!<br>' +
            'Please try <a href="http://www.google.com/chrome">Chrome</a> or ' +
	          '<a href="http://www.getfirefox.org/">Firefox</a>';


// Master sync object
function Master() {
	var base = this;
	this.mediaCount = 0;
	this.readyCount = 0;
	this.error = false;
	var startTime = 0;
	var paused = false;

	function init (){
		checkBrowser();
	}
	function checkBrowser (){
		if ($.browser.firefox) {
			VIDEO_EXTENSION = "ogv";
			VIDEO_MIME = 'video/ogg';
			AUDIO_EXTENSION = "ogg";
			AUDIO_MIME = 'audio/ogg';
		}
		else if ($.browser.webkit) {
			VIDEO_EXTENSION = "mp4";
			VIDEO_MIME = 'video/mp4; codecs="avc1.42E01E"';
			AUDIO_EXTENSION = "mp3";
			AUDIO_MIME = 'audio/mpeg';
		}
		else {
			// can't play html5 video..
			this.error = true;
			$("#error").html(browserErrorMsg);
			$("#error").show();
			return;
		}
	}

	// Public: A video tells the master it is being created
	this.add = function(){
		base.mediaCount++;
		$("#loaded").attr("max", base.mediaCount);
		$("#loaded").attr("value", base.readyCount);
	}

	// Public: A video tells the master it has loaded
	this.loaded = function(){
		master.readyCount++;
		$("#loaded").attr("value", base.readyCount);
		if (base.mediaCount != base.readyCount) {
			if (base.readyCount >= base.mediaCount - 3) {
				console.log((base.mediaCount - base.readyCount) + " left")
			}
			return;
		}
		$("#loader").hide();
		console.log("ready!");
		base.ready();
	}
	
	// Public: All the players are ready, video starts automatically
	this.ready = function(){
		base.play();
		startTime = Date.now();
		loop(startTime);
	}
	
	// Public: Show all the videos from all the instruments
	this.showAll = function() {
		for (var i = 0; i < instruments.length; i++) {
			instruments[i].show();
		}
	}

	// Public: First reset the audio, then tell the audio to play,
	// ..then tell the videos to play.  Preserve sync as best we can.
	this.play = function (){
		for (var i = 0; i < instruments.length; i++) {
			instruments[i].audio.seekToBeginning();
		}
		for (var i = 0; i < instruments.length; i++) {
			instruments[i].audio.audio.play();
		}
		for (var i = 0; i < videos.length; i++) {
			videos[i].seekToBeginning();
		}
	}
	
	// Public: Pause/unpause the videos.
	this.pause = function (){
		if (! paused) {
			paused = true;
		} else {
			paused = false;
		}
	}
	
	this.seek = function(){
	}
	
	// Private: Animation loop.  Tell the videos to render themselves.
	function loop(){
		requestAnimFrame(loop);
		stats.begin();
		var position = (Date.now() - startTime) / 1000;
		for (var i = 0; i < videos.length; i++) {
			videos[i].loop(position);
		}
		stats.end();
	}
	
	init();
}
