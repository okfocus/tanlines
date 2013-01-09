
function invert (imageData, thresh) {
	for (var i = 0, len = imageData.length; i < len; i = i + 4) {
		imageData[i+3] = imageData[i] >= thresh ? 0 : 255;
		imageData[i] = 255 - imageData[i];
		imageData[i+1] = 255 - imageData[i+1];
		imageData[i+2] = 255 - imageData[i+2];
	}
}

function alpha (imageData, thresh) {
	for (var i = 3, len = imageData.length; i < len; i = i + 4) {
		imageData[i] = imageData[i-2] >= thresh ? 0 : 255;
	}
}

function drawAnts (imageData, width, height, t) {
	var tt = Math.floor( t * 10 ) % 8;
	var off = ((height - 5) * width) % 8;
	for (var i = 0; i < width; i++) {
		var q = (i + tt) % 8 < 4 ? 255 : 0;
		imageData[i * 4 + 0] = q;
		imageData[i * 4 + 1] = q;
		imageData[i * 4 + 2] = q;
		imageData[i * 4 + 3] = 255;

		var bot = (height - 5) * width + i;
		var q = (off + bot + tt) % 8 < 4 ? 0 : 255;
		imageData[bot * 4 + 0] = q;
		imageData[bot * 4 + 1] = q;
		imageData[bot * 4 + 2] = q;
		imageData[bot * 4 + 3] = 255;
	}

	var off = ((height) * width - 6) % 8;
	for (var i = 0; i < height; i++) {
		var q = (i + tt) % 8 < 4 ? 255 : 0;
		imageData[width * i * 4 + 0] = q;
		imageData[width * i * 4 + 1] = q;
		imageData[width * i * 4 + 2] = q;
		imageData[width * i * 4 + 3] = 255;

		var side = ((width * i) + width - 5);
		var q = (off + i + tt) % 8 < 4 ? 255 : 0;
		imageData[side * 4 + 0] = q;
		imageData[side * 4 + 1] = q;
		imageData[side * 4 + 2] = q;
		imageData[side * 4 + 3] = 255;
	}
}
