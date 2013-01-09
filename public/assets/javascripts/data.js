var positions = {
	piano: [],
	drum: [],
	guitars: [],
	synths: [],
	drums: [],
	strings: [],
};

var timing = {
	'piano': [
		[  0.0,  260.00]	
	],
	'floortom': [
		[ 15.9,  237.00]
	],
	'guitar-voice': [
		[ 51.347, 237.00]
	],
	'microkorg': [
		[ 70.569,  237.00]
	],
	'keyboard-with-amp': [
		[ 70.569,  237.00]
	],
	'drums-guitar': [
		[ 77.569,  237.00]
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
