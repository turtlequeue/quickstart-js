const aTurtleParent = require('turtlequeue').create
const program = require('commander')
require('websocket')
const config = require('../../config.js');

console.log('Hello TurtleQueue')

config.turtleConfig.autoAck = false;
const tConfig = config.turtleConfig;

const q = aTurtleParent.make(tConfig)
const channel = '#test-ack-' + getRandomInt(0, 100000)

var count = 0;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function coinFlip() {
  return (Math.floor(Math.random() * 2) == 0);
}

const publish = function publish() {
  console.log('Publishing!', "message " + count)

  q.publish({
    payload: "message " + count,
    channel: channel,
  })
    .then(success => {
      //console.log('published', success.data)
    })
    .catch(err => console.log('publish promise err', err))

  count++;
}

const subscribe = function subscribe() {

  return q.subscribe(
    { id: 'ackTestSub',
      channel: channel
    },
    (err, data, metadata) => {

      if(coinFlip()) {
        console.log('Acknowledging', data);
        metadata.acknowledge()
      } else {
        console.log('negative-Acknowledging', data);
        metadata.negativeAcknowledge()
      }
    }
  )
}

q.on('ready', evt => {
  console.log('Ready', evt)

  setInterval(publish, 5000)

  subscribe()
    //.then(data => console.log('subscribe promise', data))
    .catch(err => console.log('subscribe promise err', err))

})

q.on('error', evt => {
  console.log('error', evt)
})

q.on('disconnect', evt => {
  console.log('Disconnected')
})

q.connect(config.connectConfig)

console.log('Connecting...')
