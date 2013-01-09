
function Toggle (instrument, key) {
	var base = this;
  var span = document.createElement("span");
  document.getElementById("controls").appendChild(span);

  base.checkbox = document.createElement("input");
  base.checkbox.type = "checkbox";
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
