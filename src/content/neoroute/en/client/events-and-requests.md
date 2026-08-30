---
title: "Receiving events & sending requests"
description: "How to use the different client SDKs to send requests to Neoroute and handle events coming from the server."
---

Before reading this guide, you should have a `Client` object capable of either [HTTP](/neoroute/client/http) or [WebSocket](/neoroute/client/websocket). Please follow the relevant guides first, if you do not have this object yet.

But now let's learn how you actually use the `Client` you now have.

## Sending requests

**Hint:** Because filling out the send functions might be confusing, we recommend using [neogen](/neoroute/utility/neogen). That way you can completely forget about route types.

For sending requests, there are multiple functions that map exactly to the same ones on the server. Here's a table of the ones that exist (have the same names with different case variations in different SDKs):

| Routing function | Client equivalent | Description                                   |
| ---------------- | ----------------- | --------------------------------------------- |
| Route            | Send              | Request + Response (with data) + UserError    |
| RouteNoRequest   | SendNoRequest     | No request + Response (with data) + UserError |
| RouteOk          | SendOk            | Request + Response (no data) + UserError      |
| RouteOkNoRequest | SendOkNoRequest   | No request + Response (no data) + UserError   |
| RouteNoResponse  | SendNoResponse    | Request + No response                         |
| RoutePing        | SendPing          | Request (no data) + No response               |

`UserError` refers to an error that can be returned by the server. This object is commonly used to return error messages from the server.

Now, let's cover how you might actually use the different send functions in the different SDKs. We'll only look at `Send` since all other send functions are basically derived from how it works.

```go prefix="sdk"
// c is the client object
response, err := c.Send[SomeResponse]("your_route", SomeRequest{/* data */})
if err != nil {
	if err, ok := err.(*client.UserError); ok {
		// This would be the case where your server returned an error, but the request arrived
		log.Println("Got error message from server:", err)
	} else {
		// This would be called when something actually goes completely wrong
		log.Println("Failed to send request: ", err)
	}
	return err
}

// You can now safely use response
```

```ts prefix="sdk"
const response = await client.Send<SomeRequest, SomeResponse>("your_route", {
	/* data */
});
if (response instanceof UserError) {
	console.error("something went wrong with some_route:", response);
	return;
}

// You can now safely use response
```

## Receiving events

**Hint:** To synchronize your event structs with the ones you have on your server, we recommend using [neogen](/neoroute/utility/neogen). That way you get end-to-end type safety.

For receiving events, there is really just one function. One important thing however is that there **can only be one event handler per event**. Read more below if you want to know the reasoning behind this decision.

```go prefix="sdk"
// c is the client object
c.Receive("some_event", func(c *client.Ctx, event SomeEvent) {
	// Your handling logic
})

// You can of course also use external functions to receive events
c.Receive("some_event", SomeFunction)
func SomeFunction(c *client.Ctx, event SomeEvent) { /* your logic */ }
```

```ts prefix="sdk"
client.receive("some_event", (c: Ctx, event: YourEvent) => {
	/* handle */
});
```

### Why only one event handler?

Only giving you the ability to register one event handler has the following reasons:

- **Main reason:** Handling events in multiple places can lead to a lot of chaos in your architecture.
- If we gave you a way to register multiple event handlers, we would also need to give you a way to unregister them which will lead to you having to somehow manage all of the event handlers you have registered.
  - With one event handler, you can just register a new one and know that no-one else will hear about the event.
- **Minor:** When there are multiple event handlers, we need to also iterate through a slice of functions, instead of just calling the function you gave us. This leads to a lot of overhead when there is just one function handling the event most of the time.

We hope you understand our reasoning. If you have some kind of special need that you think requires multiple event handlers, feel free to implement your own solution on top of our client SDK. It should not be so difficult.
