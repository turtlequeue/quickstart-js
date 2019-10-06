<p align="center">
  <img alt="turtlequeue" src="https://turtlequeue.com/logo_black.png" width="230">
</p>

<h3 align="center">TurtleQueue</h3>

# Simple benchmark

## How to use

### Authentication

Export you Api Key, and User Token, found in [the dashboard](https://turtlequeue.com/dashboard/security.html)

```sh
export TURTLEQUEUE_USER_TOKEN="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
export TURTLEQUEUE_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

This has to be done for __*every*__ new terminal.

### Command-line usage

In one terminal:
```
node src/examples/bench/consumer.js --channel "benchmark"

```

In another terminal/device:
```
node src/examples/bench/producer.js --channel benchmark --payload-size "1KB" --num-messages 1000
```

Adapt it to match your use case more closely and see if the numbers are good enough :)
