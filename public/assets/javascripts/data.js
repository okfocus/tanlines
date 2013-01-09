var positions = {
	piano: [],
	drum: [],
	guitars: [],
	synths: [],
	drums: [],
	strings: [],
};

var thresholds = {
	'piano': 196,
	'floortom': 202,
	'guitar-voice': 202,
	'microkorg': 213,
	'keyboard-with-amp': 200,
	'drums-guitar': 187,
	'strings': 173,
}

var timing = {
	'piano': [
		[  0.0,  280.00]	
	],
	'floortom': [
		[ 15.462,  200.40],
		[215.959,  249.00]
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
	'drums-guitar': [
		[ 71.642,  200.40],
		[215.959,  248.00]
	],
	'strings': [
		[ 127.274, 134.00]
	]
};

var master = new Master ();

var instruments = [
	new Instrument('piano',   [ 'piano' ]),
	new Instrument('vocals',  [ ]),
	new Instrument('drums',   [ 'drums-guitar', 'floortom' ]),
	new Instrument('synths',  [ 'microkorg', 'keyboard-with-amp' ]),
	new Instrument('guitars', [ 'guitar-voice' ]),
	new Instrument('strings', [ 'strings' ]),
];
