const test_ = require('tape')
// as browser-tap is weirdly bundled, ensure compatibility between node and browser
const test = test_.default || test_

const api = require('turtlequeue').api
console.log('Testing version', {
  version: api.version,
  commitVersion: api.commitVersion,
  buildNum: api.buildNum,
})

const aTurtleParent = require('turtlequeue').create

require('websocket')

const TURTLEQUEUE_USER_TOKEN = process.env.TURTLEQUEUE_USER_TOKEN
const TURTLEQUEUE_API_KEY = process.env.TURTLEQUEUE_API_KEY
const TURTLEQUEUE_HOST = process.env.TURTLEQUEUE_HOST || 'turtlequeue.com'
const TURTLEQUEUE_PROTOCOL = process.env.TURTLEQUEUE_PROTOCOL || 'https'
const TURTLEQUEUE_TYPE = process.env.TURTLEQUEUE_TYPE || 'ws'
const TURTLEQUEUE_TIMEOUT = process.env.TURTLEQUEUE_TIMEOUT || 10000

test('test setup', t => {
  process.on('unhandledRejection', error => {
    t.fail('unhandledRejection' + error)
  })

  if (!TURTLEQUEUE_USER_TOKEN) {
    t.fail('missing user token')
  } else {
    t.pass('user token')
  }

  if (!TURTLEQUEUE_API_KEY) {
    t.fail('missing api key')
  } else {
    t.pass('api key')
  }

  t.end()
})

const opts = {
  host: TURTLEQUEUE_HOST,
  type: TURTLEQUEUE_TYPE,
  protocol: TURTLEQUEUE_PROTOCOL,
}

const channel = '#test-node-' + new Date().getTime()

console.log('Connecting with ', JSON.stringify(opts, null, 2))

const q = aTurtleParent.make(opts)

test('turtlequeue connect', { timeout: TURTLEQUEUE_TIMEOUT }, async t => {
  q.on('handshake', evt => t.pass('handshake', evt))

  q.on('error', err => t.fail('should not have an error' + err))

  q.on('ready', evt => {
    t.pass('ready')

    if (evt.auth.status === 'authenticated') {
      t.pass('authenticated')
    } else {
      t.fail('not authenticated')
    }
    t.end()
  })

  t.pass('init')

  await q
    .connect({
      userToken: TURTLEQUEUE_USER_TOKEN,
      apiKey: TURTLEQUEUE_API_KEY,
    })
    .then(data => t.pass('connected promise'))
    .catch(err => t.fail('connected err ' + err))
})

var subscriptionId

test('turtlequeue pubsub', { timeout: TURTLEQUEUE_TIMEOUT }, async t => {
  const message = {
    m: 'hello',
    b: true,
    n: [1.2, null, Infinity],
    d: new Date(),
    blob: Buffer.from(new ArrayBuffer(10), {type: 'application/octet-stream'}),
  }

  q.on('error', err => t.fail('should not have an error' + err))

  const subscriptionRes = await q
    .subscribe(
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
        if (err) t.fail('subscribe cb err' + err)
        t.deepEqual(data, message, 'should receive the message')
        t.end()
      }
    )
    .catch(err => t.fail('subscribe failed' + err))

  subscriptionId = subscriptionRes.data.id

  await q
    .publish(
      {
        payload: message,
        channel: channel,
        location: {
          lon: 2.1204,
          lat: 48.8049,
          annotation: 'Versailles',
        },
      },
      (err, data, metadata) => {
        if (err) t.fail('publish cb err' + err)

        if (data.publishedCount === 1) t.pass('published to 1')
      }
    )
    .then(data => t.pass('published'))
    .catch(err => t.fail('publish failed' + err))
})

test('turtlequeue reader', { timeout: TURTLEQUEUE_TIMEOUT }, async t => {
  const reader = await q
    .reader({ subscriptionId: subscriptionId, startMessageId: 'earliest' })
    .then(reader => {
      t.pass('create reader')
      return reader
    })
    .catch(err => {
      t.fail('cannot create reader' + err)
    })

  await reader
    .readNext()
    .then(msg => {
      t.pass('reader: can read next')
      t.end()
    })
    .catch(err => {
      t.fail('reader: cannot read next' + err)
    })
})

test('turtlequeue disconnect', { timeout: TURTLEQUEUE_TIMEOUT }, async t => {
  q.on('error', err => t.fail('should not have an error' + err))

  q.on('disconnect', evt => {
    t.pass('disconnected')

    t.end()
  })

  t.assert(q.connectionState()['isOpen'], 'should be connected at this point')

  q.disconnect()

  t.assert(
    !q.connectionState()['open?'],
    'should be disconnected after disconnection'
  )

  // I feel like this is cheating :{
  t.end()
  if (typeof process.exit !== 'undefined') process.exit()
})
