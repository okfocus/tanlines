
function Master() {
	var base = this;
	this.mediaCount = 0;
	this.readyCount = 0;
	var startTime = 0;
	var paused = false;

	this.add = function(){
		base.mediaCount++;
		$("#loaded").attr("max", base.mediaCount);
		$("#loaded").attr("value", base.readyCount);
	}

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
	
	this.ready = function(){
		base.play();
		startTime = Date.now();
		loop(startTime);

		for (var i = 0; i < instruments.length; i++) {
			instruments[i].show();
		}
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
