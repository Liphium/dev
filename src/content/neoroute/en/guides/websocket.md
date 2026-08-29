---
title: "Accepting WebSocket connections with Neoroute"
description: "How to allow clients to connect to your Neoroute server over WebSocket."
---

Using a WebSocket transporter with Neoroute allows clients to send requests to your server and receive events from your server.

## Installation

Install the `websocket_transporter` package with `go`:

```sh
go get -u github.com/Liphium/neoroute/transporter/websocket@latest
```

## Usage

While creating the transporter is really simple, you're **going to need a [router](/neoroute/guides/routing)** to actually add routes (things receiving requests) to your server.

### Creating the transporter

You can now create a new transporter like this:

```go
import (
	"net/http"
	"github.com/coder/websocket"
	websocket_transporter "github.com/Liphium/neoroute/transporter/websocket"
)

hook, t := websocket_transporter.NewTransporter(router, websocket_transporter.Config[neoroute.NoData]{
	// In this function, you can set data that the session (an object you get in all routes),
	// will contain.
	// If you return false here, the connection will not be accepted.
	HandshakeFunc: func(r *http.Request) (neoroute.NoData, bool) {
		return neoroute.NoData{}, true
	},

	// Accept options for the underlying websocket library we use.
	AcceptOptions: &websocket.AcceptOptions{
		// We usually disable verify, because we don't want to deal with TLS certificates
		// in development. If you turn this on, you'll need a valid certificate.
		InsecureSkipVerify: true,
	},

	// Function called when you a new connection is accepted, right after HandshakeFunc.
	//
	// Here you can already create adapters (don't worry if you don't know this yet).
	EnterNetworkFunc: func(session *neoroute.Session[neoroute.NoData]) {},

	// Function called when a connection is closed.
	DisconnectHandler: func(session *neoroute.Session[neoroute.NoData]) {}
})
```

`neoroute.NoData` in this case is just a type alias for `struct{}`. In an actual production application, you would want to use a struct filled with information about the user here. For example, after you check their sign-in status in `HandshakeFunc`, you could attach their account id and permission level straight to the session.

Now to explain what you get back:

- `hook` is a HTTP handler (`http.HandlerFunc`) you can mount into almost any Go Web Framework to accept Neoroute requests.
- `t` is the actual transporter powering the whole thing. You can for example put it into [neogen](/neoroute/utility/neogen) for schema and code generation.

### Mounting the hook

While we now have a hook, we don't actually have a HTTP server that serves the endpoint yet. While we can't possibly cover every framework, here is how you mount it into a few popular ones.

```go prefix="framework" name="Standard library" key="std"
import "net/http"

// 1. Register the hook as a handler for the root path
mux := http.NewServeMux()

// 2. Mount the hook from NewTransporter into the mux
mux.HandleFunc("GET /", hook)

// 3. Configure CORS so your endpoint can actually be called
mux.HandleFunc("OPTIONS /", func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.WriteHeader(http.StatusOK)
})

// 4. Listen for HTTP requests on port 8080
http.ListenAndServe(":8080", mux)
```

```go prefix="framework" name="Fiber" key="fiber"
import "github.com/gofiber/fiber/v3"

// 1. Create a new Fiber app
app := fiber.New()

// 2. Mount the hook from NewTransporter into Fiber
app.Get("/", hook)
// You should look up how to configure CORS for Fiber here

// 3. Open the server on :8080
app.Listen(":8080")
```

```go prefix="framework" name="Echo" key="echo"
import "github.com/labstack/echo/v5"

// 1. Create a new Echo app
e := echo.New()

// 2. Mount the hook from NewTransporter into Echo
e.GET("/", echo.WrapHandler(hook))
// You should look up how to configure CORS for Echo here

// 3. Start the server on :8080
e.Start(":8080")
```

If your framework is not covered here, you can just look up how to mount a `http.HandlerFunc` in your framework of choice. We would also appreciate a [contribution](https://github.com/Liphium/dev) if you're using a popular framework we're not covering here.

### Adding events

If you don't have an `EventRegistry` yet, learn how to create one [here](/neoroute/guides/events). When you actually have one, you can add it to the transporter like this:

```go
transporter.AddEventRegistry(registry)
```
