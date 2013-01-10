// Videos lookup for fast access
var videos = [];

// Instruments coordinate turning on and off videos and stems.
function Instrument (key, videoList) {
	var base = this;
	base.ready = true;
	base.active = true;
	base.auto = true;

	// Private: Initialize the videos, audio, and channel toggle
	function init(){	
		base.toggle = new Toggle (base, key);
		base.audio = new AudioPlayer(base, key);
		base.videos = [];
		
		for (var i = 0; i < videoList.length; i++) {
			var video = new VideoPlayer(base, videoList[i])
			base.videos.push( video );
			videos.push( video );
		}
	}
	
	// Public: show the videos, unmute audio
	base.show = function(){
		base.auto = true;
		base.audio.unmute();
		for (var i = 0; i < base.videos.length; i++) {
			base.videos[i].show();
		}
	}
	
	// Public: hide the videos, mute audio
	base.hide = function(){
		base.auto = false;
		base.audio.mute();
		for (var i = 0; i < base.videos.length; i++) {
			base.videos[i].hide();
		}
	}

	init();
}

