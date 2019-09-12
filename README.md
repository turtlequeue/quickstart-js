# Quickstart JS

How to TurtleQueue in JS

# Usage

Export your Api Key, and User Token, found in [the dashboard](https://turtlequeue.com/dashboard/security.html)

```sh
export TURTLEQUEUE_USER_TOKEN="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
export TURTLEQUEUE_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Run:

`node index.js`


# Multiple consumers

In a terminal:
```sh
 export TURTLEQUEUE_DEMO_ROLE=PRODUCER
 export TURTLEQUEUE_DEMO_CHANNEL=sometestchannel
 node index.js
```

Then do the same in another terminal, but this time launch a new consumer.
Repeat this as much as you want.

```sh
 export TURTLEQUEUE_DEMO_ROLE=CONSUMER
 export TURTLEQUEUE_DEMO_CHANNEL=sometestchannel
 node index.js
```

# Tests

run `npm run test:browser` visit http://localhost:8083, open the console

alternatively run `npm run test` to run the same test in node

# Questions/support

Feel free to [get in touch](https://turtlequeue.com/doc/latest/get_help.html)!
