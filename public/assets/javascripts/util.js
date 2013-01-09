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

function rand(x) { return Math.floor(Math.random() * x); }
function clamp(x,a,b) { return Math.min(Math.max(x,a),b); }

var stats = new Stats();
stats.setMode( 0 );
document.body.appendChild( stats.domElement );

var THRESHOLD = 190;
document.getElementById("threshold").onchange = function(){
  THRESHOLD = parseInt(this.value);
};
var INVERT = false;
document.getElementById("invert").onclick = function(){
  INVERT = this.checked;
  document.body.className = INVERT ? "invert" : "";
};

function weightAverage(n, m, steps) {
	n = (n * (steps - 1) + m) / steps;
	if (m == 0 && n < 0.03) {
		return 0;
	}
	else if (m == 1 && n > 0.97) {
		return 1;
	}
	else return n;
}
