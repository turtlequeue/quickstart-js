const aTurtleParent = require('turtlequeue').create;
require('websocket');

const USER_TOKEN = process.env.TURTLEQUEUE_USER_TOKEN;
const API_KEY = process.env.TURTLEQUEUE_API_KEY;

console.log('Hello TurtleQueue');

if (!USER_TOKEN) {
	console.log('Missing USER_TOKEN');
}

if (!API_KEY) {
	console.log('Missing API_KEY');
}

const q = aTurtleParent.make({
	host: 'turtlequeue.com',
	type: 'ws',
	protocol: 'https'
});

const date = new Date();
const channel = '#test-node-multiple-' + new Date().getDay() + '-' + new Date().getHours();

const publish = function publish() {
	console.log('Publishing!');

	q
		.publish(
			{
				payload: {
					msg: 'anything goes in the payload'
				},
				channel: channel,
				location: {
					lon: 2.1204,
					lat: 48.8049,
					annotation: 'Versailles'
				}
			},
			(err, data, metadata) => {
				console.log('published', err, data, metadata);
			}
		)
		.then(data => console.log('publish promise success', data))
		.catch(err => console.log('publish promise err', err));
};

const subscribe = function subscribe() {
	return q.subscribe(
		{
			channel: channel,
			location: {
				radius: '50km',
				lon: 2.3522,
				lat: 48.8566,
				annotation: 'Paris'
			}
		},
		(err, data, metadata) => {
			console.log('data received in Paris#test', err, data, metadata);
		}
	);
};

q.on('ready', evt => {
	console.log('Ready', evt);

	if (process.env.TURTLEQUEUE_DEMO_ROLE === 'PRODUCER') {
		setInterval(publish, 2500);
	} else if (process.env.TURTLEQUEUE_DEMO_ROLE === 'CONSUMER') {
		subscribe()
			.then(data => console.log('subscribe promise', data))
			.catch(err => console.log('subscribe promise err', err));
	} else {
		// both
	}
});

q.on('error', evt => {
	console.log('error');
});

q.on('disconnect', evt => {
	console.log('Disconnected');
	process.exit();
});

q.connect({
	userToken: USER_TOKEN,
	apiKey: API_KEY
});
console.log('Connecting...');

const describe = function describe() {
        console.log('---------------------');
	console.log('connectionState', q.connectionState());
	console.log('authStatus', q.authStatus());
	console.log('listSubscriptions', q.listSubscriptions());
	console.log('listHandlers', q.listHandlers());
        console.log('---------------------');
};

setInterval(describe, 5000);

setTimeout(() => {
	console.log('Disconnecting after 40 secs');
	q.disconnect();
}, 40000);
