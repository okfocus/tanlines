
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

var INVERT = false;
document.getElementById("invert").onclick = function(){
  INVERT = this.checked;
  document.body.className = INVERT ? "invert" : "";
};
