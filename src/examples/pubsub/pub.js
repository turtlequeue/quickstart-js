const aTurtleParent = require('turtlequeue').create
const websocket = require('websocket')
const program = require('commander')
const config = require('../../config.js');

console.log('Hello TurtleQueue')

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

q.connect(config.connectConfig)
console.log('Connecting...')
