
// The AudioPlayer coordinates playback and muting of one of the stems.
function AudioPlayer(instrument, src) {
	if (master.error) return;

	var base = this;
	base.audio = document.createElement("audio");
  var source = document.createElement("source");
  var audioFileUrl = "/assets/sounds/" + src + "." + AUDIO_EXTENSION;
  base.loaded = false;
  
  // Private: Initialize the HTML5 audio object
  function audioInit(){
    source.src = audioFileUrl;
    source.type = AUDIO_MIME;
//    base.audio.addEventListener('loadedmetadata', audioLoaded, false);
//    base.audio.addEventListener('error', error, false);
		master.add(base);
  }

	// Public: Tell this channel to load
	base.load = function(){
    // base.audio.appendChild(source);
		base.sound = soundManager.createSound({
			id: src,
			url: audioFileUrl,
			onload: function(){
				audioLoaded();
			}
		});
		base.sound.load();

    // base.audio.src = source.src;
	}
  
  // Private: When it loads, tell the master track
  function audioLoaded () {
  	console.log("audio " + src + " ready");
  	base.loaded = true;
		master.loaded();
	}
	
	// Public: Rewind the video
	base.seekToBeginning = function () {
		base.audio.pause();
		base.audio.currentTime = 0;
  	base.sound.unmute();
	}
	
	// Public: Mute the video
  base.mute = function () {
  	base.sound.mute();
//  	base.audio.volume = 0.0;
  }
  
  // Public: Unmute the video
  base.unmute = function () {
  	base.sound.unmute();
//  	base.audio.volume = 1.0;
  }
  
  // Public: Set the volume to an arbitrary value
  base.setVolume = function (volume) {
  	base.audio.volume = volume;
  }

  audioInit();
}
