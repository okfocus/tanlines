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
	var reset = false;
	var ended = false;

	function init (){
		checkBrowser();
		$("#replay").click(base.replay);
/*
		setInterval(function(){
			base.readyCount += 0.05
			$("#loaded").css("width", Math.floor( 100 * base.readyCount / (base.mediaCount || 20) ) + "%" );
		}, 400);
*/
	}
	function checkBrowser (){
		if ($.browser.mozilla) {
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
		$("#loaded").css("width", Math.floor( 100 * base.readyCount / base.mediaCount ) + "%" );
	}

	// Public: A video tells the master it has loaded
	this.loaded = function(){
		master.readyCount++;
		$("#loaded").css("width", Math.floor( 100 * base.readyCount / base.mediaCount ) + "%" );
		if (base.mediaCount < base.readyCount) {
			if (base.readyCount >= base.mediaCount - 3) {
				console.log((base.mediaCount - base.readyCount) + " left")
			}
			return;
		}
		$("#loader").hide();
		$("body").removeClass("preload");
		$("body").addClass("checker");
		console.log("ready!");
		base.ready();
		
	}

	this.ended = function(){
		ended = true;
		base.hideAll();
		$("#finished").fadeIn(400);
	}
	
	this.replay = function(){
		reset = true;
		$("#finished").fadeOut(400, function(){
			base.seek(0);
		});
	}
	
	// Public: All the players are ready, video starts automatically
	this.ready = function(){
		base.play();
		startTime = Date.now();
		loop(startTime);
	}
	
	// Public: Show all the videos
	this.showAll = function() {
		for (var i = 0; i < instruments.length; i++) {
			instruments[i].show();
		}
	}

	// Public: Hide all the videos
	this.hideAll = function() {
		for (var i = 0; i < instruments.length; i++) {
			instruments[i].hide();
		}
	}

	// Public: First reset the audio, then tell the audio to play,
	// ..then tell the videos to play.  Preserve sync as best we can.
	this.play = function (){
		ended = false;
		for (var i = 0; i < instruments.length; i++) {
			instruments[i].audio.seekToBeginning();
		}
		for (var i = 0; i < instruments.length; i++) {
			instruments[i].audio.audio.play();
		}
		for (var i = 0; i < videos.length; i++) {
			videos[i].seekToBeginning();
		}
		startTime = Date.now();
	}
	
	// Public: Pause/unpause the videos.
	this.pause = function (){
		if (! paused) {
			paused = true;
		} else {
			paused = false;
		}
	}
	
	// Public: Seek to a specific time
	this.seek = function(when){
		reset = true;
		when = clamp(when, 0, 500);
		for (var i = 0; i < instruments.length; i++) {
			instruments[i].audio.audio.pause();
			instruments[i].audio.audio.currentTime = when;
			instruments[i].audio.audio.volume = 1.0;
			instruments[i].auto = true;
		}
		for (var i = 0; i < videos.length; i++) {
			videos[i].video.pause();
			videos[i].video.currentTime = when;
			videos[i].resetTimeline();
			videos[i].output.style.display = "none";
			videos[i].loop(0);
		}
		setTimeout(function(){
			reset = false;
			ended = false;
			startTime = Date.now() - (when * 1000);
			for (var i = 0; i < instruments.length; i++) {
				instruments[i].audio.audio.play();
			}
			for (var i = 0; i < videos.length; i++) {
				videos[i].video.play();
			}
			loop();
		}, 1200);
	}
	
	// Private: Animation loop.  Tell the videos to render themselves.
	function loop(){
		if (reset) return;
		requestAnimFrame(loop);

		var position = (Date.now() - startTime) / 1000;
		if (position > 282) {
			base.ended();
		}
//		if (stats) stats.begin();
		for (var i = 0; i < videos.length; i++) {
			videos[i].loop(position);
		}
//		if (stats) stats.end();
	}
	
	init();
}
