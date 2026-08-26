---
title: "Accepting HTTP connections with Neoroute"
description: "How to allow clients to send requests to your Neoroute server over HTTP."
---

Using a HTTP transporter with Neoroute allows you to accept requests from clients over HTTP. However, unlike traditional HTTP frameworks, all of the routes are called through one central endpoint.

**Note:** The HTTP transporter **only supports accepting requests**. Events can not be sent through it since HTTP is a request-response protocol. If you want to send events as well, you could consider [WebSocket](/neoroute/transporter/websocket).

## Installation

Install the `http_transporter` package with `go`:

```sh
go get -u github.com/Liphium/neoroute/transporter/http@latest
```

## Usage

While creating the transporter is really simple, you're **going to need a [router](/neoroute/guides/routing)** to actually add routes (things receiving requests) to your server.

### Creating the transporter

You can now create a new transporter like this:

```go
import (
	"net/http"
	http_transporter "github.com/Liphium/neoroute/transporter/http"
)

hook, t := http_transporter.NewTransporter(router, http_transporter.Config[neoroute.NoData]{
	// In this function, you can set data that the session (an object you get in all routes),
	// will contain.
	// If you return false here, the request will not go through.
	HandshakeFunc: func(r *http.Request) (neoroute.NoData, bool) {
		return neoroute.NoData{}, true
	},
})
```

Now to explain what you get back:

- `hook` is a HTTP handler (`http.HandlerFunc`) you can mount into almost any Go Web Framework to accept Neoroute requests.
- `t` is the actual transporter powering the whole thing. For HTTP, this object does actually not have a lot of use, but you can for example put it into [neogen](/neoroute/utility/neogen) for schema and code generation.

### Mounting the hook

While we now have a hook, we don't actually have a HTTP server that serves the endpoint yet. While we can't possibly cover every framework, here is how you mount it into a few popular ones.

```go prefix="framework" name="Standard library" key="std"
import "net/http"

// 1. Register the hook as a handler for the root path
mux := http.NewServeMux()

// 2. Mount the hook from NewTransporter into the mux
mux.HandleFunc("POST /", hook)

// 3. Listen for HTTP requests on port 8080
http.ListenAndServe(":8080", mux)
```

```go prefix="framework" name="Fiber" key="fiber"
import "github.com/gofiber/fiber/v3"

// 1. Create a new Fiber app
app := fiber.New()

// 2. Mount the hook from NewTransporter into Fiber
app.Post("/", hook)

// 3. Open the server on :8080
app.Listen(":8080")
```

```go prefix="framework" name="Echo" key="echo"
import "github.com/labstack/echo/v5"

// 1. Create a new Echo app
e := echo.New()

// 2. Mount the hook from NewTransporter into Echo
e.POST("/", echo.WrapHandler(hook))

// 3. Start the server on :8080
e.Start(":8080")
```

If your framework is not covered here, you can just look up how to mount a `http.HandlerFunc` in your framework of choice. We would also appreciate a [contribution](https://github.com/Liphium/dev) if you're using a popular framework we're not covering here.
