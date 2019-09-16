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

const subscribe = function subscribe() {
  return q.subscribe(
    {
      channel: program.channel,
    },
    (err, data, metadata) => {
      console.log('data received:', data)
    }
  )
}

q.on('ready', evt => {
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
