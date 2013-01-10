
// Browser detection
var VIDEO_EXTENSION, VIDEO_MIME, AUDIO_EXTENSION, AUDIO_MIME;

if ($.browser.firefox) {
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
}

// PI requestAnimationFrame polyfill
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
})();

// Random integer [0..x-1]
function rand(x) { return Math.floor(Math.random() * x); }

// Clamp x to [a..b]
function clamp(x,a,b) { return Math.min(Math.max(x,a),b); }

// Weighted average, used to tween n to m
function weightAverage(n, m, weight) {
	n = (n * (weight - 1) + m) / weight;
	if (m == 0 && n < 0.03) {
		return 0;
	}
	else if (m == 1 && n > 0.97) {
		return 1;
	}
	else return n;
}

// Enum used for edge detection
var TOP = 1,
TOP_RIGHT = 2,
RIGHT = 3,
BOTTOM_RIGHT = 4,
BOTTOM = 5,
BOTTOM_LEFT = 6;
LEFT = 7,
TOP_LEFT = 8;

// Detect if the mouse event (e) is close to the edge of an object on hover
function nearEdgeOfSelection (e, m) {
	var shim = 10,
	x = e.pageX,
	y = e.pageY,
	
	// bounds checking
	top_lower    = m.top - shim < y,
	top_upper    = y < m.top + shim,
	bottom_lower = m.top + m.height - shim < y,
	bottom_upper = y < m.top + m.height + shim,
	left_lower   = m.left - shim < x,
	left_upper   = x < m.left + shim,
	right_lower  = m.left + m.width - shim < x,
	right_upper  = x < m.left + m.width + shim;

	if (top_upper && top_lower) {
		if (left_upper && left_lower) {
			return TOP_LEFT;
		} else if (right_upper && right_lower) {
			return TOP_RIGHT;
		} else if (left_lower && right_upper) {
			return TOP;
		}
	} else if (bottom_upper && bottom_lower) {
		if (left_upper && left_lower) {
			return BOTTOM_LEFT;
		} else if (right_upper && right_lower) {
			return BOTTOM_RIGHT;
		} else if (left_lower && right_upper) {
			return BOTTOM;
		}
	} else if (top_lower && bottom_upper) {
		if (left_upper && left_lower) {
			return LEFT;
		} else if (right_upper && right_lower) {
			return RIGHT;
		}
	}
	return false;
}
