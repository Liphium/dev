---
title: "Connecting to Neoroute with WebSocket"
description: "How to use the different client SDKs to connect to Neoroute using WebSocket."
---

No matter what client SDK you use, this guide will teach you how to connect to your server using a WebSocket transporter.

**Hint:** You can make your life a lot easier by using [code generation](/neoroute/utility/neogen). Just pointing it out, this guide will basically be equivalent.

## Creating the client

Before opening the actual connection, you need to create a client (this is the object you'll be using to send requests).

This is an abstraction we put over the actual connection since you could also be connecting to the server in a different way. The actual message you send is the same between WebSocket and HTTP.

```go prefix="sdk"
// Import both the transporter (client version) and the client package.
import (
	"github.com/Liphium/neoroute/client"
	"github.com/Liphium/neoroute/client/transporter/websocket"
)

// ...

// 1. Create a new client (there are more options, we just showcase the most important ones)
c := client.NewClient(client.Config{
	// The ErrorHandler will be called for every error that happens inside of the client.
	//
	// Errors like that aren't returned from requests, like invalid events, are also returned
	// through here which is why we recommend definitely using this for WebSocket.
	ErrorHandler: func(err error) {
		log.Println("WebSocket error", err)
	},
})

// 2. Create a new WebSocket transporter
transporter := websocket.NewWebSocketTransporter(c)
```

```ts prefix="sdk"
// Import @liphium/neoroute-ts

// ...

// 1. Create a new client
const client = new Client({
	// Called for any errors that happen (also in the transporter).
	errorHandler: (err: Error) => {
		console.error("websocket error:", err);

		// In case this error handler was called from a request, this
		// will be returned in the UserError.
		return "Something went wrong!";
	},
});

// 2. Create the WebSocket transporter
const transporter = new WebSocketTransporter(client, {
	// Implement to handle the WebSocket connection opening
	onOpen: () => {},
});
```

## Connecting to the server

Since WebSocket has persistent connections, you need to actually connect to the server using the `Connect` function (or whatever it is called in your SDK, look below).

```go prefix="sdk"
// 1. Parse the URL to your server
url, err := url.Parse("http://example.com")
if err != nil { /* handle error */ }

// 2. Call the connect function with your URL
done, err := transporter.Connect(url)
// ^ done is a channel that will return something when the connection is closed, by any means.
```

```ts prefix="sdk"
// Just connect to the URL, you don't actually have to handle the error here.
// Any errors from this will be forwarded to errorHandler, if the connection opens
// onOpen is called.
transporter.connect("ws://localhost:6121/ws");
```

## Closing the connection

If you want to close the connection you established, you can use the `Close` function (or equivalent).

```go prefix="sdk"
// Might return an error when something went wrong during close.
err := transporter.Close()
```

```ts prefix="sdk"
// This will also call the errorHandler, regardless of a closing error.
transporter.close();
```

## From now

Depending on what SDK you use, you can now [send requests](/neoroute/client/requests) to your server or [receive events](/neoroute/client/events) from your server over the WebSocket connection. Click on any of the links to learn more about those capabilities.
