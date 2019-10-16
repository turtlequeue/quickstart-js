const aTurtleParent = require('turtlequeue').create
const program = require('commander')
require('websocket')
const config = require('../../config.js');

console.log('Hello TurtleQueue')

program
  .option('-c, --channel <topic>', 'the topic you wish to publish to')
  .option('-n, --num-messages <number>', 'how many messages you wish to receive', parseInt)
  .option('-i, --subscriber-id <string>', 'Optional subscriber id');

program.parse(process.argv)

console.log(program.opts())

const q = aTurtleParent.make(config.turtleConfig)

var count = 0;

const subscribe = function subscribe() {

  return q.subscribe(
    { id: program.subscriberId ,
      channel: program.channel
    },
    (err, data, metadata) => {
      count++;

      console.log('received', data.num, "( ", count, "/ ", program.numMessages, ")" );

      if (count === 1 ) {
        console.time('msg')
      } else if (count === program.numMessages) {
        console.timeEnd('msg')
      }

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

q.connect(config.connectConfig)

console.log('Connecting...')
