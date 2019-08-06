const aTurtleParent = require('turtlequeue').create
const websocket = require('websocket')

const USER_TOKEN = process.env.TURTLEQUEUE_USER_TOKEN
const API_KEY = process.env.TURTLEQUEUE_API_KEY

console.log('Hello TurtleQueue')

if (!USER_TOKEN) {
  console.log('Missing USER_TOKEN')
}

if (!API_KEY) {
  console.log('Missing API_KEY')
}

const q = aTurtleParent.make({
  host: 'turtlequeue.com',
  type: 'ws',
  protocol: 'https',
})

const channel = process.env.TURTLEQUEUE_DEMO_CHANNEL || "#test-node-" + new Date().getTime();

var pubId = 0;
const publish = function publish() {
  console.log('Publishing!')

  pubId++;

  q.publish(
    {
      payload: {
        msg: 'anything goes in the payload',
        pubSessionCount: pubId
      },
      channel: channel,
      location: {
        lon: 2.1204,
        lat: 48.8049,
        annotation: 'Versailles',
      },
    },
    (err, data, metadata) => {
      console.log('published', err, data, metadata)
    },
  ).then((data) => console.log('publish promise success', data))
  .catch((err) => console.log('publish promise err', err));
}

const subscribe = function subscribe() {
  return q.subscribe(
    {
      channel: channel,
      location: {
        radius: '50km',
        lon: 2.3522,
        lat: 48.8566,
        annotation: 'Paris',
      },
    },
    (err, data, metadata) => {
      console.log('data received in Paris#test', err, data, metadata)
    },
  )
}

q.on('ready', evt => {
  console.log('Ready', evt)


  if (process.env.TURTLEQUEUE_DEMO_ROLE === 'PRODUCER') {
    console.log('Publish only!')

    setInterval(publish, 2500)
  } else if (process.env.TURTLEQUEUE_DEMO_ROLE === 'CONSUMER') {
    console.log('Consume only!')

    subscribe()
      .then((data) => console.log('subscribe promise', data))
      .catch((err) => console.log('subscribe promise err', err));
  } else {
    // both
    // subscribe ...
    console.log('Publish and subscribe')
    subscribe()
      .then((data) => console.log('subscribe promise', data))
      .catch((err) => console.log('subscribe promise err', err));
    // ...and publish to it once every 2.5 secs
    setInterval(publish, 2500)
  }
})

q.on('error', evt => {
  console.log('error')
})

q.on('disconnect', evt => {
  console.log('Disconnected')
  process.exit()
})

q.connect({
  userToken: USER_TOKEN,
  apiKey: API_KEY,
})
console.log('Connecting...')

const describe = function describe() {
  console.log('connectionState', q.connectionState())
  console.log('authStatus', q.authStatus())
  console.log('listSubscriptions', q.listSubscriptions())
  console.log('listHandlers', q.listHandlers())
}

// setInterval(describe, 5000);
