
function VideoPlayer(instrument, src) {
  var base = this;
  base.src = src;
  var video = document.createElement("video");
  var source = document.createElement("source");

  var buffer = document.createElement("canvas");
  var buf = buffer.getContext('2d');

  var output = document.createElement("canvas");
  var out = output.getContext('2d');
	
  var width, height;
	
	var times = timing[src];
	console.log(times);
	var timeIndex = 0;
	
	base.auto = true;
	
	var max_thresh = src in thresholds ? thresholds[src] : 190;
	var opacity = 0;
	var destOpacity = 0;
	
  var videoFileUrl = "/assets/videos/" + src + ".mp4";
	
	base.x = rand(window.innerWidth * 3/4);
	base.y = rand(window.innerHeight * 3/4);

  output.style.position = "absolute";
  base.output = output;
	
	base.width = 0;
	base.height = 0;
	
  init();
	
  function init() {
    source.src = videoFileUrl;
    source.type = 'video/mp4; codecs="avc1.42E01E"';
    video.addEventListener('loadedmetadata', loaded, false);
    video.addEventListener('ended', base.seekToBeginning, false);
    video.appendChild(source);
		master.add();
  }
  function loaded () {
    buffer.width = video.videoWidth;
    buffer.height = video.videoHeight;
    base.width = width = video.videoWidth;
    base.height = height = video.videoHeight;
    output.width = width - 4;
    output.height = height - 4;
    video.currentTime = Math.random() * video.duration;
    video.play();
    output.style.width = base.width + "px";
    output.style.height = base.height + "px";
    base.setXY(base.x, base.y);
		document.body.appendChild(output);

		if (src in positions) {
			base.x = Math.floor( positions[src][0] * window.innerWidth - width/2 );
			base.y = Math.floor( positions[src][1] * window.innerHeight );
			console.log(src, base.x, base.y);
			base.setXY(base.x, base.y);
		}

  	console.log("video " + src + " ready ", width, height);
		master.loaded();
  }
  
	base.show = function(){
		output.style.display = "block";
		destOpacity = 1.0;
	}
	base.hide = function(){
		destOpacity = 0.0;
	}
   
  base.start = function (time) {
    base.seekToBeginning();
  }

  this.seekToBeginning = function () {
    video.pause();
    video.currentTime = 0;
    video.play();
	}
  this.seekToBeginningAndPause = function () {
    video.pause();
    video.currentTime = 0;
  }

	var active = false;
	base.hovering = false;

  this.loop = function(t){

		if (instrument.auto) {
			if (! active) {
				// if this segment has started
				if (timeIndex >= 0 && times[timeIndex][0] < t) {
					instrument.toggle.checkbox.checked = true;
					base.show();
					active = true;
				}
			}
			else {
				if (timeIndex >= 0 && times[timeIndex][1] < t) {
					instrument.toggle.checkbox.checked = false;
					base.hide();
					timeIndex++;
					if (timeIndex >= times.length) timeIndex = -1;
					active = false;
				}
			}
		}
		if (opacity == 0 && destOpacity == 0) return;

    buf.drawImage(video, 0, 0);
    
    var image = buf.getImageData(0, 0, width, height),
      imageData = image.data;
    if (imageData[0] === 0) return;

		if (opacity != destOpacity) {
			opacity = weightAverage(opacity, destOpacity, 10);
			
			if (destOpacity == 0 && opacity == 0) {
				output.style.display = "none";
				return;
			}
		}

		var thresh = THRESHOLD * opacity * max_thresh;

    if (INVERT) {
    	invert(imageData, thresh);
		} else {
			alpha(imageData, thresh);
		}

    if (base.hovering) {
    	drawAnts(imageData, width, height, t);
    }

		// out.save();
		// buf.putImageData(image, 0, 0, 0, 0, width, height);
		// out.drawImage(buffer, 0,0);
    out.putImageData(image, 0, 0, 0, 0, width, height);
		// out.restore();

    output.style.left = base.x + "px";
    output.style.bottom = base.y + "px";
  }

  output.onmouseover = function(e){
    if (! dragging) {
      base.hovering = true;
    }
  }
  output.onmouseout = function(e) {
    if (dragging != base) {
      base.hovering = false;
    }
  }
  output.onmousedown = function(e){
    x = base.x;
    y = base.y;
    startX = e.pageX;
    startY = e.pageY;
    dragging = base;
  }

  base.setXY = function(newx, newy) {
    base.x = clamp(newx, 0, window.innerWidth - width);
    base.y = clamp(newy, 0, window.innerHeight - height);
    output.style.left = base.x + "px";
    output.style.bottom = base.y + "px";
    output.style.zIndex = output.style.bottom;
  }
}

var startX = 0;
var startY = 0;
var x = 0;
var y = 0;
var dragging = false;
window.onmousemove = function(e){
  if (dragging) {
    var newX = x + e.pageX - startX;
    var newY = y + startY - e.pageY;
    dragging.setXY(newX, newY);
  }
}
window.onmouseup = function(){
  if (dragging) {
    dragging.output.className = "";
    dragging = false;
  }
}
var oldWidth = window.innerWidth;
var oldHeight = window.innerHeight;
window.onresize = function(){
	for (var i = 0; i < videos.length; i++) {
		var video = videos[i];
		var x_percent = video.x / (oldWidth - video.width);
		var y_percent = video.y / (oldHeight - video.height);
		video.setXY(x_percent * (window.innerWidth - video.width), y_percent * (window.innerHeight - video.height));
	}
	oldWidth = window.innerWidth;
	oldHeight = window.innerHeight;
}