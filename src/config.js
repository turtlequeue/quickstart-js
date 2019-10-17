const USER_TOKEN = process.env.TURTLEQUEUE_USER_TOKEN
const API_KEY = process.env.TURTLEQUEUE_API_KEY
const HOST =  process.env.TURTLEQUEUE_HOST || 'turtlequeue.com'
const TYPE =  process.env.TURTLEQUEUE_TYPE || 'ws'
const PROTOCOL = process.env.TURTLEQUEUE_PROTOCOL || 'https'

if (!USER_TOKEN) {
  throw(new Error('Missing USER_TOKEN'));
}

if (!API_KEY) {
  throw(new Error('Missing API_KEY'));
}

const turtleConfig = {
  host: HOST,
  type: TYPE,
  protocol: PROTOCOL,
};

const connectConfig = {
  userToken: USER_TOKEN,
  apiKey: API_KEY,
}

module.exports = {
  API_KEY: API_KEY,
  USER_TOKEN: USER_TOKEN,
  HOST: HOST,
  PROTOCOL: PROTOCOL,
  turtleConfig: turtleConfig,
  connectConfig: connectConfig
}
