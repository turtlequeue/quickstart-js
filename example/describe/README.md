<p align="center">
  <img alt="turtlequeue" src="https://turtlequeue.com/logo_black.png" width="230">
</p>

<h3 align="center">TurtleQueue</h3>

# Query the internal state

Simply use the SDK's methods to query the state:

These are the relevant methods: https://github.com/turtlequeue/quickstart-js/blob/7e5c6ae71285e6ebcc26bfa2111a9e1958eb1698/example/describe/index.js#L96-L101

## How to use

### Authentication

Export you Api Key, and User Token, found in [the dashboard](https://turtlequeue.com/dashboard/security.html)

```sh
export TURTLEQUEUE_USER_TOKEN="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
export TURTLEQUEUE_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

This has to be done for __*every*__ new terminal.

```
node examples/describe/index.js
```

Observe the output of the describe function:
```
Hello TurtleQueue
Connecting...
Ready { type: 'ws',
  open: true,
  everOpened: true,
  firstOpen: true,
  uid:
   'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..DHvlvUZXxzyvbEGorP5rDQ.V69tawyJXbF3Z26r8kodRxaog2JaQYe1fAsUzMlqPjJ_2vW3X8cm9ztAdzdZpYF5yuGFxlf07Rrd-NKApaTvfwGvQ1kgYD95dYiua0tl-XCax8PhHGImdxYafRTQO35xV8-Kb0LbhRSN9hyxUG4pwVh9ysF4X94A5W3_eOeHQe8e8QS6TFe4DeEOeJ3NqFzP.sppzc8LkFHXzFhZ1Lr3rCg',
  auth: { status: 'authenticated' } }
---------------------
connectionState { type: 'ws', everOpened: true, firstOpen: true, isOpen: true }
authStatus { status: 'authenticated' }
listSubscriptions {}
listHandlers { ready: [ [Function] ],
  error: [ [Function] ],
  disconnect: [ [Function] ]
  }
---------------------
```
