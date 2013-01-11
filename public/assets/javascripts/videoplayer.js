
// The VideoPlayer coordinates playback of an individual video to a canvas,
// keying out white, mouse events, etc..
function VideoPlayer(instrument, src) {
	if (master.error) return;
  var base = this;
  base.src = src;
  
  // HTML5 video object. Not displayed.
  var video = document.createElement("video");
  var source = document.createElement("source");

	// Buffer canvas, write the video to this first. Not displayed.
  var buffer = document.createElement("canvas");
  var buf = buffer.getContext('2d');

	// Output canvas, write to this post-processing. Displayed.
  var output = document.createElement("canvas");
  var out = output.getContext('2d');
  output.style.position = "absolute";
  base.output = output;
  base.$output = $(output);
	
	// Fetch timeline data
	var times = src in timing ? timing[src] : timing['piano'];
	var timeIndex = 0;
	
	// Fetch key-out threshold of this video
	var max_thresh = src in thresholds ? thresholds[src] : 190;
	var opacity = 0;
	var destOpacity = 0;
	
	// Should this video be active..?
	var active = false;

	// Is the mouse hovering over this video?
	base.hovering = false;

	// URL to the video
  var videoFileUrl = "/assets/videos/" + src + "." + VIDEO_EXTENSION;
	
	// Geometry data
  var width, height;
	base.m = {};
	base.width = 0;
	base.height = 0;
	base.x = rand(window.innerWidth * 3/4);
	base.y = rand(window.innerHeight * 3/4);
	base.flip = false;
	base.flop = false;
	
  init();

	// Private: Build the video object
  function init() {
    source.src = videoFileUrl;
    source.type = VIDEO_MIME;
    video.addEventListener('loadedmetadata', loaded, false);
    video.addEventListener('ended', base.seekToBeginning, false);
    video.appendChild(source);
		master.add();
  }
  
  // Private: When the video has loaded..
  function loaded () {
    buffer.width = video.videoWidth;
    buffer.height = video.videoHeight;

    base.width = width = video.videoWidth;
    base.height = height = video.videoHeight;

    output.width = width - 4;
    output.height = height - 4;

    output.style.width = base.width + "px";
    output.style.height = base.height + "px";

		// Position the video based on a percentage
		if (src in positions) {
			base.x = Math.floor( positions[src][0] * window.innerWidth - width/2 );
			base.y = Math.floor( positions[src][1] * window.innerHeight );
		}

    base.setXY(base.x, base.y);
		base.makeMarquee();
		
		document.body.appendChild(output);

  	console.log("video " + src + " ready ", width, height);
		master.loaded();
  }
  
	// Public: Show a video
	base.show = function(){
		output.style.display = "block";
		destOpacity = 1.0;
	}
	// Private: Hide a video. Does not change display type because it will do a fade.
	base.hide = function(){
		destOpacity = 0.0;
	}

	// Public: Rewind and start playing a video
  this.seekToBeginning = function () {
    video.pause();
    video.currentTime = 0;
    video.play();
	}
	
	// Public: Just rewind the video and pause
  this.seekToBeginningAndPause = function () {
    video.pause();
    video.currentTime = 0;
  }

	// Private: Check if the video should be displayed at this time
	function advanceTimeline(t){
		if (instrument.auto) {
			if (! active) {
				// if this segment has started
				if (timeIndex >= 0 && times[timeIndex][0] < t) {
					instrument.toggle.activate();
					base.show();
					active = true;
				}
			}
			else {
				if (timeIndex >= 0 && times[timeIndex][1] < t) {
					instrument.toggle.deactivate();
					base.hide();
					timeIndex++;
					if (timeIndex >= times.length) timeIndex = -1;
					active = false;
				}
			}
		}
	}

	// Public: Animation loop, called each frame.
  this.loop = function(t){

		// Check if this video is turning off or on.
		advanceTimeline(t);
		if (opacity == 0 && destOpacity == 0) return;

		// Fade the threshold one step, if necessary
		if (opacity != destOpacity) {
			opacity = weightAverage(opacity, destOpacity, 10);

			if (destOpacity == 0 && opacity == 0) {
				output.style.display = "none";
				return;
			}
		}

		// Draw the video to the buffer.
    buf.drawImage(video, 0, 0);
    
    // Fetch the pixel data;
    var image = buf.getImageData(0, 0, width, height);
    var imageData = image.data;
    
    // Don't show anything if the video is black.
    if (imageData[0] === 0) return;

		// Get the current key-out threshold, based on the slider, the fade, and the video.
		var thresh = THRESHOLD * opacity * max_thresh;

		// Perform the alpha transparency key-out
    if (INVERT) {
    	invert(imageData, thresh);
		} else {
			alpha(imageData, thresh);
		}

		// If we're hovering, draw a moving dashed selection rectangle.
    if (base.hovering) {
    	drawAnts(imageData, width, height, t);
    }

		// Draw the transparent image to a canvas and we're done.
		// Commented-out functions were used when painting to a single master canvas.

		// out.save();
		// buf.putImageData(image, 0, 0, 0, 0, width, height);
		// out.drawImage(buffer, 0,0);

    out.putImageData(image, 0, 0, 0, 0, width, height);

		// out.restore();
  }

	// Public: Move the canvas to a specific position.
  base.setXY = function(newx, newy) {
    base.x = clamp(newx, 0, window.innerWidth - width);
    base.y = clamp(newy, 0, window.innerHeight - height);
    output.style.left = base.x + "px";
    output.style.bottom = base.y + "px";
    output.style.zIndex = window.innerHeight - base.y;
  }

	// Public: Generate a marquee object, suitable for being passed to $.css
	base.makeMarquee = function () {
		base.m = {
			bottom: base.y,
			left: base.x,
			width: base.width,
			height: base.height
		};
	}

	// When we start hovering over a video..
  output.onmouseover = function(e){
    if (! dragging) {
      base.hovering = true;
    }
  }
  
	// When we stop hovering over a video..
  output.onmouseout = function(e) {
    if (dragging != base) {
      base.hovering = false;
    }
  }
  
  // When we click on a video..
  output.onmousedown = function(e){
    x = base.x;
    y = base.y;
    startX = e.pageX;
    startY = e.pageY;
    dragging = base;

		base.makeMarquee();
		
		// Are we resizing, or just dragging?
		resizing = nearEdgeOfSelection(e, base.m);

		if (resizing) {
			currentlyFlipped = base.flip;
			currentlyFlopped = base.flop;
			resizeMarquee = $.extend({}, base.m);
		}
  }
}

// Globals involved in dragging/resizing
var startX = 0;
var startY = 0;
var x = 0;
var y = 0;
var dragging = false;
var resizing = false;
var currentlyFlipped = false;
var currentlyFlopped = false;
var resizeMarquee = {};

// While we're dragging/resizing..
// The mouse move/up functions are global because otherwise you lose focus easily.
window.onmousemove = function(e){
  if (dragging) {
  	if (resizing) {
			var dy = e.pageY - startY;
			var dx = e.pageX - startX;
			var m = resizeMarquee;
			var klass = "";

			switch (resizing) {
				case TOP:
				case TOP_LEFT:
				case TOP_RIGHT:
					// m.height = clamp(dragging.m.height - dy, 10, window.innerHeight);
					m.height = dragging.m.height - dy;
					break;
				case BOTTOM:
				case BOTTOM_LEFT:
				case BOTTOM_RIGHT:
					// m.bottom = clamp(dragging.m.bottom - dy, dragging.m.bottom - dy, dragging.m.bottom + dragging.m.height - 10);
					// m.height = clamp(dragging.m.height + dy, 10, window.innerHeight);
					m.bottom = dragging.m.bottom - dy;
					m.height = dragging.m.height + dy;
					break;
			}
			switch (resizing) {
				case LEFT:
				case TOP_LEFT:
				case BOTTOM_LEFT:
					// m.left = clamp(dragging.m.left + dx, dragging.m.left + dx, dragging.m.left + dragging.m.width - 10);
					// m.width = clamp(dragging.m.width - dx, 10, window.innerWidth);
					m.left = dragging.m.left + dx;
					m.width = dragging.m.width - dx;
					break;
				case RIGHT:
				case TOP_RIGHT:
				case BOTTOM_RIGHT:
					// m.width = clamp(dragging.m.width + dx, 10, window.innerWidth);
					m.width = dragging.m.width + dx;
					break;
			}
			
			flip = dragging.flip, flop = dragging.flop;
			if (m.width < 0) {
				m.width = Math.abs(m.width);
				switch (resizing) {
					case LEFT:
					case TOP_LEFT:
					case BOTTOM_LEFT:
						m.left = dragging.m.left + dragging.m.width;
						break;
					case RIGHT:
					case TOP_RIGHT:
					case BOTTOM_RIGHT:
						m.left = dragging.m.left - m.width;
						break;
				}
				flip = ! flip;
			}
			if (m.height < 0) {
				m.height = Math.abs(m.height);

				switch (resizing) {
					case TOP:
					case TOP_LEFT:
					case TOP_RIGHT:
						m.bottom = dragging.m.bottom - m.height;
						break;
					case BOTTOM:
					case BOTTOM_LEFT:
					case BOTTOM_RIGHT:
						m.bottom = dragging.m.bottom + dragging.m.height;
						break;
				}
				flop = ! flop;
			}
			if (flip && flop) klass = "flip flop";
			else if (flip) klass = "flip";
			else if (flop) klass = "flop";

			dragging.output.className = klass;
			dragging.$output.css(m);
  	}
  	else {
			var newX = x + e.pageX - startX;
			var newY = y + startY - e.pageY;
			dragging.setXY(newX, newY);
		}
  }
}

// When we're done dragging, store the new state.
window.onmouseup = function(){
  if (dragging) {
  	if (resizing) {
  		dragging.m = resizeMarquee;
  		dragging.width = resizeMarquee.width;
  		dragging.height = resizeMarquee.height;
  		dragging.flip = flip;
  		dragging.flop = flop;
  		dragging.setXY(resizeMarquee.left, resizeMarquee.bottom);
  	}
		for (var i = 0; i < videos.length; i++) {
			videos[i].hovering = false;
		}
    dragging = false;
    resizing = false;
  }
}

// When we resize the window, reposition the videos proportionally.
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
