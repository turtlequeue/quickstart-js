const aTurtleParent = require('turtlequeue').create
const program = require('commander')
const crypto = require('crypto')
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

const q = aTurtleParent.make({
  host: 'turtlequeue.localhost',
  type: 'ws',
  protocol: 'http',
})


program
  .option('-c, --channel <topic>', 'the topic you wish to publish to')
  .option('-m, --payload-size <content>', 'the message size you want to send in bytes')
  .option('-n, --num-messages <number>', 'how many messages you wish to publish', parseInt);

// possible additional scenarios:
// - with geolocation
// - with channel regex
// - with manual acknowledge
// ...
// TODO empty/delete channel before publishing?
//

program.parse(process.argv)

console.log(program.opts())


const publish = function publish(msg) {
  console.time(msg.num)
  console.log('Publishing', msg.num);
  q.publish(
    {
      payload: msg,
      channel: program.channel
    }
  ).then(data => {
    console.log('Published', msg.num);
    console.timeEnd(msg.num)
  })
   .catch(err => console.log('publish promise err', err))
}

const randomValueHex = (len) => {
  // from https://blog.abelotech.com/posts/generate-random-values-nodejs-javascript/
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, len) // return required number of characters
}

q.on('ready', evt => {
  console.log('Ready', evt)
  // generate messages upfront
  var msgs = [...Array(program.numMessages + 1).keys()].slice(1)
      .map(function (c) {
        return {num: c,
                msg: randomValueHex(program.payloadSize * 1024)
                //new Blob([new ArrayBuffer(program.payloadSize)], {type:
                // 'application/octet-stream'})
               }
      });

  console.time('Publishing')
  for (var i = 0; i < msgs.length; i++) {
    publish(msgs[i])
  }

  console.timeEnd('Publishing')
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
