const aTurtleParent = require('turtlequeue').create
const websocket = require('websocket')
const program = require('commander')
const config = require('../../config.js')

program.option('-c, --channel <topic>', 'the topic you wish to subscribe to')
       .option('-i, --id <id>', 'the subscription name you wish to use');
program.parse(process.argv)

const q = aTurtleParent.make(config.turtleConfig)

//
// give a subscription an `id`
// this allows you to find it back later instead of creating a new subscription
// and eventually resume consuming from the exact same subscription
//
const subscribe = function subscribe() {
  // NOTE: when using an id the rest of the parameters cannot be changed later on
  return q.subscribe(
    {
      id: program.id,
      channel: program.channel
    },
    (err, data, metadata) => {
      console.log('data received:', data)
    }
  )
}

q.on('ready', async function (evt) {

  await replayAll()

  subscribe()
    .then(data => console.log('listening to ', program.channel))
    .catch(err => console.log('subscribe promise err', err))


})

q.on('error', evt => {
  console.log('error')
})

q.on('disconnect', evt => {
  console.log('Disconnected')
  process.exit()
})

q.connect(config.connectConfig)
console.log('Connecting...')


async function* readAllFromReader(reader) {
  while (true) {
    let hasNext = await reader.hasMessageAvailable();
    if (hasNext.data) {
      const nextMessage = await reader.readNext();
      yield nextMessage;
    } else {
      return;
    }
  }}

async function replayAll() {
  var msgs = [];
  return q.reader({ subscriptionId: program.id, startMessageId: 'earliest' })
    .then(async function (reader) {
      for await (const msg of readAllFromReader(reader)) {
        msgs.push(msg);
      }
      if(msgs[0]) {
        console.log('There were ' + msgs.length + ' previous messages');
        console.log(msgs.map(m => m.data))
      } else {
        console.log('No previous messages for this subscription', program.id, program.channel)
      }

      })
    .catch(err => {console.log('error creating reader', err)})
}
