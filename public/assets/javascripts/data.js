// Initial positions of the guys (percentages: [ left, bottom ])
var positions = {
	'piano':             [ 0.15, 0.21 ],
	'floortom':          [ 0.69, 0.36 ],
	'synth':          	 [ 0.93, 0.22 ],
	'keyboard-with-amp': [ 0.30, 0.31 ],
	'drums-guitar':      [ 0.50, 0.36 ],
	'guitar-voice':      [ 0.60, 0.02 ],
	'microkorg':         [ 0.40, 0.06 ],
	'strings':           [ 0.81, 0.26 ]
};

// Max threshold used to key-out color
var thresholds = {
	'piano': 196,
	'floortom': 202,
	'guitar-voice': 202,
	'microkorg': 213,
	'keyboard-with-amp': 200,
	'drums-guitar': 187,
	'strings': 173,
	'synth': 200,
}

// Timeline for each video, when it fades in and out
var timing = {
	'piano': [
		[  0.0,  280.00]	
	],
	'floortom': [
		[ 15.462,  200.40],
		[215.959,  280.00]
	],
	'guitar-voice': [
		// voice enters at 47.676
		[ 31.440, 280.00]
	],
	'microkorg': [
		[ 71.642,  248.00]
	],
	'keyboard-with-amp': [
		[ 71.642,  248.00]
	],
	'synth': [
		[ 71.642,  248.00]
	],
	'drums-guitar': [
		[ 71.642,  200.40],
		[215.959,  248.00]
	],
	'strings': [
		// they are playing here
		// [127.274, 134.00]
		// this is the duration of the main section
		[ 71.642,  248.00]
	]
};

// Make a new master sync object
var master = new Master ();

// Initialize the instruments: an audio stem, and a list of corresponding videos
var instruments = [
	new Instrument('vocals',  [ ]),
	new Instrument('piano',   [ 'piano' ]),
	new Instrument('drums',   [ 'drums-guitar', 'floortom' ]),
	new Instrument('synths',  [ 'microkorg', 'keyboard-with-amp', 'synth' ]),
	new Instrument('guitars', [ 'guitar-voice' ]),
	new Instrument('strings', [ 'strings' ]),
];

// Start the videos loading, once the page has loaded.
// Once the media is ready, playback starts automatically.
$(function(){
	soundManager.setup({
		url: '/assets/swfs/',
		onready: function() {
			console.log("soundmanager ready");
			master.load();
		}
	});
});

// Initialize the background toggles
var bg = new Background ([
	"beach",
	"brooklynbridge",
	"badlands",
	"clouds",
	"forest",
	"milkyway",
	"nightlights",
	"jupiter"
]);

// Initialize the stats object

/*
	var stats = new Stats();
	stats.setMode( 0 );
	document.body.appendChild( stats.domElement );
*/
