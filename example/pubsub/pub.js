const aTurtleParent = require('turtlequeue').create
const websocket = require('websocket')
const program = require('commander')

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
  .option('-m, --message <content>', 'the message you want to send')

program.parse(process.argv)

console.log(program.opts())

const q = aTurtleParent.make()

const publish = function publish() {
  console.log('Publishing!')

  q.publish({
    payload: program.message,
    channel: program.channel,
  })
    .then(success => {
      console.log('published', success.data)
      process.exit()
    })
    .catch(err => console.log('publish promise err', err))
}

q.on('ready', evt => publish())

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
