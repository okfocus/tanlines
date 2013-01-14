
function Toggle (instrument, key) {
	var base = this;
	var active = key == "vocals";

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
  
  if (active) base.activate();
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
		toggle.className = bg;
		toggle.innerHTML = '<span><input type="radio" name="bg"></span><img src="/assets/images/' + bg + '-small.jpg"><p>' + bg + '</p>';
		toggle.setAttribute("value", bg);
		toggle.onclick = function(){
			$("#instagram").hide();
			instagramming = false;
			$(".instagramtoggle input").attr('checked', instagramming);
			
			$("#layers").find("li").removeClass("selected");
			$(this).addClass("selected");
			var klass = this.getAttribute("value");
			if (klass == BG) {
				document.body.className = BG = "checker";
				$(this).find("input").attr("checked", false);
				$(".selected").removeClass("selected");
			} else {
				document.body.className = BG = klass;
				$(this).find("input").attr("checked","checked");
			}
		}

		$("#layers ul").append(toggle);
	}
}

var dumping = false, instagramming = false;
var DUMPFM_URL = "http://dump.fm/fullscreen?nologin=1";
var INSTAGRAM_URL =	"http://labs.okfoc.us/not-the-same/instagram.php";

$('.dumptoggle').click(function() {
	dumping = ! dumping;
	instagramming = false;
	$(".dumptoggle input").attr('checked', dumping);
	$(".instagramtoggle input").attr('checked', instagramming);
	$("#layers").find("li").removeClass("selected");
	$(this).addClass("selected");
	if (dumping) {
		var iframe = $("<iframe>").attr({ "id": "dumpfm", "src": DUMPFM_URL }).show();
		$("body").prepend( iframe );
	}
	else {
		$("#dumpfm").remove();
	}
	$("#instagram").remove();
});

$('.instagramtoggle').click(function() {
	instagramming = ! instagramming;
	dumping = false;
	$("#layers").find("input").attr("checked", false);
	$(".dumptoggle input").attr('checked', dumping);
	$(".instagramtoggle input").attr('checked', instagramming);
	$("#layers").find("li").removeClass("selected");
	$(this).addClass("selected");
	if (instagramming) {
		$("body").prepend( $("<iframe>").attr({ "id": "instagram", "src": INSTAGRAM_URL }).show() );
	}
	else {
		$("#instagram").remove();
	}
	$("#dumpfm").remove();

	if (instagramming) {
		document.body.className = BG = "checker";
	}
});