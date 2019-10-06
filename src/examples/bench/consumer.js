const aTurtleParent = require('turtlequeue').create
const program = require('commander')
require('websocket')

const USER_TOKEN = process.env.TURTLEQUEUE_USER_TOKEN
const API_KEY = process.env.TURTLEQUEUE_API_KEY

console.log('Hello TurtleQueue')

if (!USER_TOKEN) {
  console.log('Missing USER_TOKEN')
}

if (!API_KEY) {
  console.log('Missing API_KEY')
}

program
  .option('-c, --channel <topic>', 'the topic you wish to publish to')
  .option('-n, --num-messages <number>', 'how many messages you wish to receive', parseInt);

program.parse(process.argv)

console.log(program.opts())

const q = aTurtleParent.make({
  host: 'turtlequeue.localhost',
  type: 'ws',
  protocol: 'http',
})

var count = 0;

const subscribe = function subscribe() {
  return q.subscribe(
    { id: "bench", // optional
      channel: program.channel
    },
    (err, data, metadata) => {
      console.log('received', data.num, "( ", count, "/ ", program.numMessages, ")" );

      if (count === 0 ) {
        console.time('msg')
      } else if (count === program.numMessages) {
        console.timeEnd('msg')
      }
      count++;
    }
  )
}

q.on('ready', evt => {
  console.log('Ready', evt)

  subscribe()
    .then(data => console.log('subscribe promise', data))
    .catch(err => console.log('subscribe promise err', err))
})

q.on('error', evt => {
  console.log('error', evt)
})

q.on('disconnect', evt => {
  console.log('Disconnected')
})

q.connect({
  userToken: USER_TOKEN,
  apiKey: API_KEY,
})

console.log('Connecting...')
