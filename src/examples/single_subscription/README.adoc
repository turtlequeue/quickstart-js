<p align="center">
  <img alt="turtlequeue" src="https://turtlequeue.com/logo_black.png" width="230">
</p>

<h3 align="center">TurtleQueue</h3>

# Single subscription

In a classic publish/subscribe scenario all subscribers receive all the messages sent to a particular topic.
Sometimes it is desirable to have one subscription have a unique identity.

The trick here is to reuse the same `subscriptionId`, like so:
```
subscribe(
    {
      id: "someUniqueId",
      channel: program.channel,
    }
```
The messages that go on the #channel would go to all the subscribers as usual, one message per subscription id. In other words if you call the above multiple times with the same id "someUniqueId", only ONE of these would get the message. This is very useful to load balance messages for instance.

It it also a good practice to give this id a meaningful name, that can be tied to your users or your worker nodes or a specific app as this makes it easier to retrieve a history of messages.

Note: it is possible to change the parameters to the `subscribe` method on a subsequent call, and they will be replaced. The history of messages will still stay attached to the subscription.
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
node src/examples/single_subscription/sub.js --channel "#singlesub"
```

```
node src/examples/single_subscription/pub.js --channel "#singlesub" --message
```

Feel free to play around, changing the message content of the producer or replacing the channel with the same `subscriptionId`


# Round-robin example

[![asciicast](https://asciinema.org/a/TM15C0gG4zbwRSHEMUFqx1Iuy.svg)](https://asciinema.org/a/TM15C0gG4zbwRSHEMUFqx1Iuy)


terminal 1
```
echo "Subscribing"
node src/examples/single_subscription/sub.js --channel "#single-sub" --id "round-robin"
```

terminal 2
```
echo "Subscribing"
node src/examples/single_subscription/sub.js --channel "#single-sub" --id "round-robin"
```

terminal 3
```
echo "Publishing 5 messages"
node src/examples/single_subscription/pub.js --channel "#single-sub" --message "somethinghere 1"
node src/examples/single_subscription/pub.js --channel "#single-sub" --message "somethinghere 2"
node src/examples/single_subscription/pub.js --channel "#single-sub" --message "somethinghere 3"
node src/examples/single_subscription/pub.js --channel "#single-sub" --message "somethinghere 4"
node src/examples/single_subscription/pub.js --channel "#single-sub" --message "somethinghere 5"
```
