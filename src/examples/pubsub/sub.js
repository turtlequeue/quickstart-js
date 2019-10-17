const aTurtleParent = require('turtlequeue').create
const websocket = require('websocket')
const program = require('commander')
const config = require('../../config.js')

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

q.connect(config.connectConfig)
console.log('Connecting...')
