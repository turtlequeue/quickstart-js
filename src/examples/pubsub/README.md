<p align="center">
  <img alt="turtlequeue" src="https://turtlequeue.com/logo_black.png" width="230">
</p>

<h3 align="center">TurtleQueue</h3>

# CLI PubSub example

[![asciicast](https://asciinema.org/a/ltJs8T75RVszyyG2YnMkqtHY0.svg)](https://asciinema.org/a/ltJs8T75RVszyyG2YnMkqtHY0)

This is an example of command-line scripts: one for publishing, and one for subscribing.

Probably the most commonly used pattern, publish/subscribe allows decoupling producers of messages and consumers of messages as they do not need to know about each other. Instead messages are dynamically routed according to specific criteria (#channel, geolocation etc.)

## How to use

This example is intended to be used from multiple terminals. Follow the steps below:

### Authentication

Export you Api Key, and User Token, found in [the dashboard](https://turtlequeue.com/dashboard/security.html)

```sh
export TURTLEQUEUE_USER_TOKEN="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
export TURTLEQUEUE_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

This has to be done for __*every*__ new terminal.

### subscriber

On the terminal 1, we will open a subscriber that will consume the messages on the given channel `#pubsub-example`.

`node src/exampless/pubsub/sub.js --channel "#pubsub-example"`

### publisher

On the terimal 2, we will publish some messages to the above channel.

`node src/exampless/pubsub/pub.js --channel "#pubsub-example" --message "Hello (date +"%T")"`

Since the subscriber is "listening" to the above channel, it will receive the messages.
This can of course repeated as many times as desired.
