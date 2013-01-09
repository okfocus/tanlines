var videos = [];

function Instrument (key, videoList) {
	var base = this;
	base.ready = true;
	base.active = true;
	base.auto = true;
	
	base.toggle = new Toggle (base, key);
	base.audio = new AudioPlayer(base, key);
	base.videos = [];
	
	for (var i = 0; i < videoList.length; i++) {
		var video = new VideoPlayer(this, videoList[i])
		base.videos.push( video );
		videos.push( video );
	}
	
	base.show = function(){
		base.auto = true;
		base.audio.unmute();
		for (var i = 0; i < base.videos.length; i++) {
			base.videos[i].show();
		}
	}
	
	base.hide = function(){
		base.auto = false;
		base.audio.mute();
		for (var i = 0; i < base.videos.length; i++) {
			base.videos[i].hide();
		}
	}

}

