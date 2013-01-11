
function Toggle (instrument, key) {
	var base = this;
	var active = false;

  base.$checkbox = $("#toolbar ul li." + key);
  base.$checkbox.click(function(){
		if (! active) {
			instrument.show();
			base.activate();
		} else {
			base.deactivate();
			instrument.hide();
		}
  });
  
  base.activate = function(){
		active = true;
		base.$checkbox.addClass("active");
  }
  base.deactivate = function(){
			active = false;
			base.$checkbox.removeClass("active");
  }
}


var THRESHOLD = 1.0;
document.getElementById("threshold").onchange = function(){
  THRESHOLD = parseInt(this.value) / 100;
  $("#thresh").val(this.value);
};

var BG = "checker";
var INVERT = false;
$("#toolbar .color").click(function(){
  INVERT = ! INVERT;
  if (INVERT) {
  	$("#toolbar .color").addClass("invert");
		document.body.className = "invert";
  }
  else {
  	$("#toolbar .color").removeClass("invert");
		document.body.className = BG;
  }
});

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
