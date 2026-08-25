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
// TODO
```

## Receiving events

**TODO**
