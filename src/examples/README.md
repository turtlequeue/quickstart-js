<p align="center">
  <img alt="turtlequeue" src="https://turtlequeue.com/logo_black.png" width="230">
</p>

<h3 align="center">TurtleQueue</h3>

# Examples

This repository contains examples of common scenarios.
Some very useful patterns will be demonstrated in the examples.

## Simple functionnalities

These reference examples show off specific capabilities of turtlequeue SDK.
These are the building blocks of your messaging infrastructure.


- [describe](describe/README.md): demonstrates how the SDK's state can be queried
- geolocation: demonstrates how to send messages based on a specific geolocation [WIP]
- single subscription: avoid creating a new subscription every time, but reuse it instead.
- point-to-point: reach another single turtlequeue client directly [WIP]

## Communication patterns

These contain useful references that can be used to implement common patterns:

- [pubsub](pubsub/README.md): a classic publish/subscribe, one consumer
- [load balance](single_subscription.md): load balance messages for one subscription
- request/response: [WIP]
- master/worker: [WIP]
- benchmark: [WIP]
