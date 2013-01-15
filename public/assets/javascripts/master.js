// Browser detection
var VIDEO_EXTENSION, VIDEO_MIME, AUDIO_EXTENSION, AUDIO_MIME;
var browserErrorMsg = 'Your browser doesn\'t support HTML5 video!<br>' +
            'Please use <a href="http://www.google.com/chrome">Chrome</a>' +
//          ' or <a href="http://www.getfirefox.org/">Firefox</a>' + 
	          ' ;(';

// Master sync object
function Master() {
	var base = this;
	this.mediaCount = 14;
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
		if ($.browser.webkit) {
			VIDEO_EXTENSION = "mp4";
			VIDEO_MIME = 'video/mp4; codecs="avc1.42E01E"';
			AUDIO_EXTENSION = "mp3";
			AUDIO_MIME = 'audio/mpeg';
		}
/*
		else if ($.browser.mozilla) {
			VIDEO_EXTENSION = "ogv";
			VIDEO_MIME = 'video/ogg';
			AUDIO_EXTENSION = "ogg";
			AUDIO_MIME = 'audio/ogg';
		}
*/
		else {
			// can't play html5 video..
			this.error = true;
			$("#error").html(browserErrorMsg);
			$("#error").show();
			return;
		}
	}

	var players = [];
	var loadIndex = 0;
	var loading = 0;

	// Public: A video tells the master it is being created
	this.add = function(player){
		players.push(player);
	}
	this.report = function(){
		console.log(loadIndex, loading);
	}
	this.load = function(){
		while (loadIndex < master.mediaCount) {
			//for (; loading < 4; loading++) {
				if (! players[loadIndex].loaded) {
					players[loadIndex].load();
				}
				loadIndex += 1;
			//}
		}
	}
	
	function updateProgress (){
		var percent = Math.floor( clamp((109 * base.readyCount / base.mediaCount), 0, 100) );
		$("#loaded").css("width", percent + "%" );
		if (percent >= 95) {
			$("#loaded").addClass("done");
		}
		else if (percent >= 80) {
			
		}
	}

	// Public: A video tells the master it has loaded
	this.loaded = function(){
		master.readyCount++;
		loading--;
		updateProgress();
		if (base.readyCount != base.mediaCount) {
			if (base.readyCount >= base.mediaCount - 3) {
				console.log((base.mediaCount - base.readyCount) + " left")
			}
			if (loading < 4) {
				base.load();
			}
			return;
		}
		$("#loader").hide();
		$("body").removeClass("preload");
		$("body").addClass("checker");
		console.log("ready!");
		setTimeout( base.ready, 1000);
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
			// instruments[i].audio.seekToBeginning();
		}
		for (var i = 0; i < instruments.length; i++) {
			// instruments[i].audio.audio.play();
			instruments[i].audio.sound.play()
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
			instruments[i].audio.sound.pause();
			instruments[i].audio.sound.setPosition( when * 1000 );
			instruments[i].audio.sound.unmute();
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
				instruments[i].audio.sound.play();
			}
			for (var i = 0; i < videos.length; i++) {
				videos[i].video.play();
			}
			loop();
		}, 1500);
	}
	
	// Private: Animation loop.  Tell the videos to render themselves.
	function loop(){
		if (reset) return;
		requestAnimFrame(loop);

		var position = (Date.now() - startTime) / 1000;

		// vocals is its own audio player, needs to mock-activate here
		if (31.440 < position && position < 32.000) {
			console.log("ACTIVATE VOCALS")
			vocalsInstrument.toggle.activate();
		}
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
