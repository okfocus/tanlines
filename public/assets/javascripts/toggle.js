
function Toggle (instrument, key) {
	var base = this;
  var span = document.createElement("span");
  document.getElementById("controls").appendChild(span);

  base.checkbox = document.createElement("input");
  base.checkbox.type = "checkbox";
	base.checkbox.className = key;
  base.checkbox.checked = false;
  base.checkbox.onclick = function(){
		if ( base.checkbox.checked ) {
			instrument.show();
		} else {
			instrument.hide();
		}
	}

	span.appendChild(base.checkbox);
}


var THRESHOLD = 1.0;
document.getElementById("threshold").onchange = function(){
  THRESHOLD = parseInt(this.value) / 100;
  $("#thresh").val(this.value);
};

var BG = "checker";
var INVERT = false;
document.getElementById("invert").onclick = function(){
  INVERT = this.checked;
  document.body.className = INVERT ? "invert" : BG;
};

function Background (bgz, def) {
	var br = document.createElement("br");
	document.getElementById("controls").appendChild(br);
	for (var i = 0; i < bgz.length; i++) {
		var span = document.createElement("span");
		var toggle = document.createElement("input");
		toggle.type = "radio";
		toggle.name = "bg";
		toggle.value = bgz[i];
		toggle.onclick = function(){
			document.body.className = this.value;
			BG = this.value;
		}
		if (bgz[i] == def) {
			toggle.checked = true;
			document.body.className = bgz[i];
		}
		span.appendChild(toggle);
		document.getElementById("controls").appendChild(span);

	}
}
