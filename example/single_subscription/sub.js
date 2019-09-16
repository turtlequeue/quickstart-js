const aTurtleParent = require('turtlequeue').create
const websocket = require('websocket')
const program = require('commander')

const USER_TOKEN = process.env.TURTLEQUEUE_USER_TOKEN
const API_KEY = process.env.TURTLEQUEUE_API_KEY

if (!USER_TOKEN) {
  console.log('Missing USER_TOKEN')
}

if (!API_KEY) {
  console.log('Missing API_KEY')
}

program.option('-c, --channel <topic>', 'the topic you wish to subscribe to')
program.parse(process.argv)

const q = aTurtleParent.make()

const uniqueSubscriptionId = 'someUniqueId2';

const subscribe = function subscribe() {
  // NOTE: when using an id the rest of the parameters cannot be changed later on
  return q.subscribe(
    {
      id: uniqueSubscriptionId,
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

q.connect({
  userToken: USER_TOKEN,
  apiKey: API_KEY,
})
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
  return q.reader({ subscriptionId: uniqueSubscriptionId, startMessageId: 'earliest' })
    .then(async function (reader) {
      for await (const msg of readAllFromReader(reader)) {
        msgs.push(msg);
      }
      if(msgs[0]) {
        console.log('There were ' + msgs.length + ' previous messages');
        console.log(msgs.map(m => m.data))
      } else {
        console.log('No previous messages for this subscription')
      }

      })
    .catch(err => {console.log('error creating reader', err)})
}
