---
title: "Connecting to Neoroute with HTTP"
description: "How to use the different client SDKs to connect to Neoroute using HTTP."
---

No matter what client SDK you use, this guide will teach you how to connect to your server using a HTTP transporter.

## Creating the sender

Before opening the actual connection, you need to create a sender (this is the object you'll be using to send requests).

This is an abstraction we put over the actual connection since you could also be connecting to the server over WebSocket. The actual message you send is the same between WebSocket and HTTP.

```go prefix="sdk"
// Import both the transporter (client version) and the client package.
import (
	"github.com/Liphium/neoroute/client"
	"github.com/Liphium/neoroute/client/transporter/http"
)

// ...

// 1. Parse the URL to your server
url, err := url.Parse("http://example.com")
if err != nil { /* handle error */ }

// 2. Create a new sender (there are more options, we just showcase the most important ones)
sender := client.NewSender(client.Config{
	// The ErrorHandler will be called for every error that happens inside of the client.
	// For HTTP though, you should probably handle the errors directly when sending requests.
	ErrorHandler: func(err error) {
		log.Println("HTTP error", err)
	},
})

// 3. Make the sender send HTTP requests
http.ApplyHTTP(sender, "POST" /* method used, depends on your server */, url)
```

```ts prefix="sdk"
// Import @liphium/neoroute-ts

// 1. Create a new sender
const sender = new Sender({
	// THIS IS REQUIRED.
	// This also has the responsibility of converting any error into a string, that
	// will be returned inside of the UserError returned by send functions.
	errorHandler: (err: Error) => console.log("Global HTTP receiver error:", err),
});

// 2. Let the sender send HTTP requests
applyHTTP(
	sender,
	"POST" /* request method, depends on your server */,
	"http://example.com",
);
```

## Important things

- Neoroute does not care about which request method you use, but we recommend using `POST` since it's the method that describes this usage of HTTP the best. We send your request, encoded in MessagePack, in the request body and the response from the server lives in the response body to the request. It's also the default for HTTP transporters in `neodebug`.

## Sending requests

Depending on what SDK you use, you can now send requests to your server using HTTP. Follow [this guide](/neoroute/client/requests) to learn how.
