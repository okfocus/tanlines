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
var edgeEnum = "NONE TOP TOP_RIGHT RIGHT BOTTOM_RIGHT BOTTOM BOTTOM_LEFT LEFT TOP_LEFT".split(" ");

// Detect if the mouse event (e) is close to the edge of an object on hover
// The absolute positioning is done with bottom instead of top..
// Using top positioning, it was easy to drag the guys offscreen, clamping didn't help.
function nearEdgeOfSelection (e, m) {
	var shim = 20,
	x = e.pageX,
	y = e.pageY,
	bottom = window.innerHeight - m.bottom,
	
	// bounds checking
	top_lower    = bottom - m.height - shim < y,
	top_upper    = y < bottom - m.height + shim,
	bottom_lower = bottom - shim < y,
	bottom_upper = y < bottom + shim,
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
	return 0;
}

(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable');
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);

$('#toolbar, #layers').drags({ 	handle: ".handle" });