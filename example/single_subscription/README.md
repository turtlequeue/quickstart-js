<p align="center">
  <img alt="turtlequeue" src="https://turtlequeue.com/logo_black.png" width="230">
</p>

<h3 align="center">TurtleQueue</h3>

# Single subscription

In a classic publish/subscribe scenario all subscribers receive all the messages sent to a particular topic.
Sometimes it is desirable to have

The trick here is to reuse the same `subscriptionId`, like so:
```
subscribe(
    {
      id: "someUniqueId",
      channel: program.channel,
    }
```
The messages that would go to that subscription would g

On the frontend/mobile this is generally a good practice if you know your users as you can use a userId and ensure a better history of messages.
On the he backend it can be useful to tie it to a specific node or app.

Note: it is possible to change the parameters to the `subscribe` method on a subsequent call, and they will be replaced.
This behavior can be changed with the "conflict" parameter however, like so:
```
subscribe(
    {
      id: "someUniqueId",
      channel: program.channel,
      conflict: "error"
    }
```

# Usage

```
node example/single_subscription/sub.js --channel "#singlesub"
```

```
node example/single_subscription/pub.js --channel "#singlesub" --message
```

Feel free to play around, changing the message content of the producer or replacing the channel with the same `subscriptionId`


# Round-robin example

terminal 1
```
 node example/single_subscription/sub.js --channel "#singlesub" --id "roundrobin"
```

terminal 2
```
 node example/single_subscription/sub.js --channel "#singlesub" --id "roundrobin"
```

terminal 3
```
node example/single_subscription/pub.js --channel "#singlesub" --message "somethinghere 1"
node example/single_subscription/pub.js --channel "#singlesub" --message "somethinghere 2"
node example/single_subscription/pub.js --channel "#singlesub" --message "somethinghere 3"
node example/single_subscription/pub.js --channel "#singlesub" --message "somethinghere 4"
node example/single_subscription/pub.js --channel "#singlesub" --message "somethinghere 5"
```
