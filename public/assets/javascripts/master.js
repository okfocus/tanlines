
function Master() {
	var base = this;
	this.mediaCount = 0;
	this.readyCount = 0;
	var startTime = 0;
	var paused = false;

	this.ready = function(){
		if (base.mediaCount != base.readyCount) {
			return;
		}
		console.log("ready!");

		base.play();
		startTime = Date.now();
		loop(startTime);
	}
	
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
	this.pause = function (){
	}
	this.seek = function(){
	}
	
	function loop(){
		requestAnimFrame(loop);
		stats.begin();
		var position = (Date.now() - startTime) / 1000;
		for (var i = 0; i < videos.length; i++) {
			videos[i].loop(position);
		}
		stats.end();
	}

}
