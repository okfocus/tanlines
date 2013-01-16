
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
		instrument.active = active = true;
		base.$checkbox.addClass("active");
  }
  base.deactivate = function(){
		instrument.active = active = false;
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
  	if (BG == "checker") {
			document.body.className = "invert";
		}
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
			if (embedMode !== "dumpfm") {
				clearEmbeds(null, null, null);
			}

			$("#layers").find("li").removeClass("selected");
			$(this).addClass("selected");
			var klass = this.getAttribute("value");
			if (klass == BG) {
				BG = "checker";
				document.body.className = INVERT ? "invert" : BG;
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

var embedMode = "";
var DUMPFM_URL = "http://dump.fm/fullscreen?nologin=1";
var INSTAGRAM_URL =	"http://labs.okfoc.us/not-the-same/instagram.php";
var VIDEO_URL = "http://www.youtube.com/watch?v=66bnRxgHGcA";
var STREETCAM_URL = "http://labs.okfoc.us/not-the-same/gw.html";
var WHITEHOUSE_URL = "http://labs.okfoc.us/not-the-same/whitehouse.html";
var STREETVIEW_URL = "http://labs.okfoc.us/not-the-same/streetview.php";
var FISHCAM_URL = "http://labs.okfoc.us/not-the-same/fish.html";
var STONE_URL = "http://labs.okfoc.us/not-the-same/stone.html"
var ASDF_URL = "http://asdf.us/palm/";

$('.dumptoggle').click(function() {
	clearEmbeds(this, "dumpfm", function(){
		embedIframe( DUMPFM_URL );
	});
});

$('.instagramtoggle').click(function() {
	clearEmbeds(this, "instagram", function(){
		embedIframe( INSTAGRAM_URL );
	});
});

$('.streetcamtoggle').click(function(){
	clearEmbeds(this, "streetcam", function(){
		embedIframe( STREETCAM_URL );
	});
});

$('.streetviewtoggle').click(function(){
	clearEmbeds(this, "streetview", function(){
		embedIframe( STREETVIEW_URL );
	});
});

$('.whitehousetoggle').click(function(){
	clearEmbeds(this, "streetview", function(){
		embedIframe( WHITEHOUSE_URL );
	});
});

$('.fishtoggle').click(function(){
	clearEmbeds(this, "fishcam", function(){
		embedIframe( FISHCAM_URL );
	});
});

$('.stonetoggle').click(function(){
	clearEmbeds(this, "stonehenge", function(){
		embedIframe( STONE_URL );
	});
});

$('.asdftoggle').click(function(){
	clearEmbeds(this, "asdf", function(){
		embedIframe( ASDF_URL );
	});
});

function clearEmbeds(el, mode, callback) {
	$(".embedtoggle input").attr('checked', false);
	$("#layers").find("li").removeClass("selected");
	$('iframe.curtain,#okplayer-mask,#okplayer').remove();
	if (mode && mode != embedMode) {
		embedMode = mode;
		$('input', el).attr('checked', 'checked');
		$(el).addClass("selected");
		callback();
		if (embedMode != "dumpfm") {
			BG = "checker";
			document.body.className = INVERT ? "invert" : BG;
		}
	} else {
		embedMode = "";
	}
}

function embedIframe (url) {
	$("#pinwheel").show();
	var $iframe = $("<iframe>").attr({ "class": "curtain", "src": url });
	$iframe[0].onload = function(){
		$("#pinwheel").hide();
		$iframe.show();
	}
	$("body").prepend( $iframe );
}
