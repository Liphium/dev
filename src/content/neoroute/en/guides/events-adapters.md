---
title: "Sending Events using Adapters"
description: "Learn how to create events and send them to clients using adapters."
---

Events are Neoroute's primary way to send information from the server to the client. And the adapter is the thing you can send to.

## Creating & registering events

Before creating or sending any events, you first need to register them with Neoroute. We need this to couple event names and the structs you use for them.

To do this, create a new `EventRegistry` like this:

```go
var EventRegistry = neoroute.NewEventRegistry()
```

You can then add new events to it like this:

```go
//go:generate msgp

type SomeEvent struct { /* your data */ }

var CreateSomeEvent = EventRegistry.Register[SomeEvent]("some_event")
```

To explain this a little further:

- `//go:generate msgp` is needed to generate the definitions for [MessagePack](/neoroute/guides/msgp).
- `SomeEvent` is the struct that's gonna be arriving on the client.
- The `Register` function returns a creation function for the event, that way you don't have to type the event name, in this case `some_event`, every time you want to send it.

## Sending Events using Adapters

To make it easier for you to keep track of connections, we use what we call adapters. They are simply a wrapper around a connection to any transporter and are used to send events to clients.

### Registering an adapter

To actually be able to send though, you're going to first need a registry for all of your adapters:

```go
var AdapterRegistry = neoroute.NewAdapterRegistry()
```

Now, how do you get an adapter? Well, you simply get one from a session (the object you for example get in [routes](/neoroute/guides/routing#session)) and register it on the `AdapterRegistry`:

```go
// session can for example be gotten from a route context with ctx.Session()
adapter, err := session.Adapt()
if err != nil {
	panic(err) // TODO: Handle this properly
}

AdapterRegistry.Register("some-identifier", adapter)
```

Just so it doesn't cause confusion: `some-identifier` is the identifier for the adapter. Only one adapter per identifier can exist.

### Using AdapterRegistry

```go name="Send to one" key="one"
AdapterRegistry.Send("some-identifier", CreateSomeEvent(SomeEvent{ /* ... */ }))
```

```go name="Broadcast" key="broadcast"
AdapterRegistry.Broadcast(CreateSomeEvent(SomeEvent{ /* ... */ }))
```

```go name="Unregister" key="unregister"
AdapterRegistry.Unregister("some-identifier")
```

```go name="Unregister all" key="unregister_all"
AdapterRegistry.UnregisterAll()
```

### Disconnecting people

We also give you the powerful ability to disconnect users straight from adapters. When you call `Disconnect` or `DisconnectAll` on `AdapterRegistry` instead of `Unregister` or `UnregisterAll`, the adapters will be unregistered **and** the user(s) will be disconnected.

### Important things to know about adapters

- When a user disconnects, all adapters for them are unregistered automatically. You don't have to do anything.
- You can have multiple adapters per session. All of the events will reach them.
- You can have multiple `AdapterRegistry` objects. If you have multiple collections of connections that belong together, it's a common pattern to have one `AdapterRegistry` per collection containing all of the connections.
