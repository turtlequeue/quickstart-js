const aTurtleParent = require('turtlequeue').create;
const config = require('../../config.js');
require('websocket');

console.log('Hello TurtleQueue');

const q = aTurtleParent.make(config.turtleConfig);

const date = new Date();
const channel = '#test-node-multiple-' + new Date().getDay() + '-' + new Date().getHours();

const publish = function publish() {
  console.log('Publishing!');

  q.publish(
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
  setInterval(publish, 2500)

  subscribe()
    .then(data => console.log('subscribe promise', data))
    .catch(err => console.log('subscribe promise err', err))
});

q.on('error', evt => {
  console.log('error');
});

q.on('disconnect', evt => {
  console.log('Disconnected');
  process.exit();
});

q.connect(config.connectConfig);
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
