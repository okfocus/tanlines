
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
	for (var i = 0; i < bgz.length; i++) {
		var bg = bgz[i];

		var toggle = document.createElement("li");
		toggle.innerHTML = '<span><input type="radio" name="bg"></span><img src="/assets/images/' + bg + '.jpg"><p>' + bg + '</p>';
		toggle.setAttribute("value", bg);
		toggle.onclick = function(){
			var klass = this.getAttribute("value");
			if (klass == BG) {
				document.body.className = BG = "checker";
				$(this).find("input").attr("checked", false);
			} else {
				document.body.className = BG = klass;
				$(this).find("input").attr("checked","checked");
			}
		}

		$("#layers ul").append(toggle);
	}
	document.body.className = "checker";
}
