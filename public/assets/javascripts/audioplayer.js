
function AudioPlayer(instrument, src) {
	var base = this;
	base.audio = document.createElement("audio");
  var source = document.createElement("source");
  var audioFileUrl = "/assets/sounds/" + src + ".mp3";
  
  function audioInit(){
    source.src = audioFileUrl;
    source.type = 'audio/mp3';

    base.audio.addEventListener('loadedmetadata', audioLoaded, false);
    base.audio.addEventListener('ended', base.seekToBeginning, false);
    base.audio.appendChild(source);
		master.add();
  }
  function audioLoaded () {
  	console.log("audio " + src + " ready");
		master.loaded();
	}
	base.seekToBeginning = function () {
		base.audio.pause();
		base.audio.currentTime = 0;
  	base.audio.volume = 1.0;
	}
  base.mute = function () {
  	base.audio.volume = 0.0;
  }
  base.unmute = function () {
  	base.audio.volume = 1.0;
  }
  base.setVolume = function (volume) {
  	base.audio.volume = volume;
  }
  audioInit();
}
