---
title: "Routing"
description: "How Neoroute's Router works, the different routing functions and advanced routing."
---

The base of all routing in Neoroute is the `Router` object. It's gonna be routing requests to all of your different routes. You can create one like this:

```go
router := neoroute.NewRouter[neoroute.NoData](neoroute.Config{
	// This function is pretty important, it converts any error you return from a handler
	// function to an error message that will be sent to the client.
	ErrorHandler: func(err error, c *Ctx[D]) string {}
})
```

Now, the place where `neoroute.NoData` currently is, is a generic value for any data associated with the connection. This data object is the one created in the `HandshakeFunc` of your transporter (most likely [HTTP](/neoroute/guides/http) or [WebSocket](/neoroute/guides/websocket)). You could use it to store account information, or anything else related to the connection.

## Creating routes

In Neoroute, there generally are six different route types with the following properties:

| Routing function     | Has request data | Has response data | Can error | Example use case         |
| -------------------- | ---------------- | ----------------- | --------- | ------------------------ |
| **Route**            | ✅               | ✅                | ✅        | Regular request response |
| **RouteNoRequest**   | ❌               | ✅                | ✅        | Getting something        |
| **RouteOk**          | ✅               | ❌                | ✅        | Selecting a character    |
| **RouteOkNoRequest** | ❌               | ❌                | ✅        | Toggling a switch        |
| **RouteNoResponse**  | ✅               | ❌                | ❌        | Voice packets            |
| **RoutePing**        | ❌               | ❌                | ❌        | Heartbeat signals        |

Their properties explained:

- **Has request data**: Means the route takes in a typed request struct.
- **Has response data**: Means the route returns a typed response struct to the client.
- **Can error**: The route sends a confirmation with an error message (in case there was an error) to the client.

If there is no response data and no error returned, it means that the client will not expect any confirmation for the request they sent. All of the different routes are handy in different use cases. Choose which route you want to use based on your minimum requirements.

### Naming conventions for routes

For naming your routes, we only the following characters: `-`, `/`, `_`, `~`, `.`, all lowercase letters (`a`-`z`) and all numbers (`0`-`9`). Any uppercase letters will be made lowercase and any other characters will be truncated, so please just don't use them.

To separate routes and their sub-routes we use `/`. Therefore, multiple `/` will also be reduced to just one. If the last character is a `/`, it will also be removed.

### Example route definitions

```go name="Route" key="route"
// Comment below generates the required code for the structs.
//go:generate msgp

type SomeRequest struct { /* some fields */ }
type SomeResponse struct { /* some fields */ }

router.Route("some-route", func(c *neoroute.ResCtx[neoroute.NoData, SomeResponse], req SomeRequest) error {
    return c.Respond(ResponseData{ /* fill out your struct */ })
})
```

```go name="RouteNoRequest" key="route-no-req"
// Comment below generates the required code for the structs.
//go:generate msgp

type SomeResponse struct { /* some fields */ }

router.Route("some-route", func(c *neoroute.ResCtx[neoroute.NoData, SomeResponse]) error {
	return c.Respond(ResponseData{ /* fill out your struct */ })
})
```

```go name="RouteOk" key="route-ok"
// Comment below generates the required code for the structs.
//go:generate msgp

type SomeRequest struct { /* some fields */ }

router.RouteOk("some-route", func(c *neoroute.OkCtx[neoroute.NoData], req SomeRequest) error {
    return c.RespondOk()
})
```

```go name="RouteOkNoRequest" key="route-ok-no-req"
router.RouteOkNoRequest("some-route", func(c *neoroute.OkCtx[neoroute.NoData]) error {
    return c.RespondOk()
})
```

```go name="RouteNoResponse" key="route-no-resp"
// Comment below generates the required code for the structs.
//go:generate msgp

type SomeRequest struct { /* some fields */ }

router.RouteNoResponse("some-route", func(c *neoroute.Ctx[neoroute.NoData], req SomeRequest) error {
    return c.RespondOk()
})
```

```go name="RoutePing" key="route-ping"
router.RoutePing("some-route", func(c *neoroute.Ctx[neoroute.NoData]) {
    // Do something
})
```

Returned errors will be handled in the `ErrorHandler` of the router. Returning `nil` **will cause a panic**. You can also return a UserError directly like this:

```go
return neoroute.NewError("your error message")
```

## Advanced routing

We recognize that you sometimes need more than just one router. Especially with complex setups grouping and middlewares can come in really handy.

### Grouping

When you want to create a router for a sub-route, you can use the `Group` function. Here is how that works:

```go
// group is a new router, with the exact same functions, but mounted into router
group := router.Group("some-group")

// This route will now be at some-group/some-ping
group.RoutePing("some-ping", func(c *neoroute.Ctx[neoroute.NoData]) {})
```

This is useful when you have a lot of routes that are related or in another module. But another thing they are useful for is middlewares, so let's learn what those are finally.

### Middlewares

A middleware is a function that lives in front of your actual route functions. You can use them to stop requests before they reach the route function. This is useful for things like checking permissions.

You can add a middleware to any router like this:

```go
router.Use("", func(c *neoroute.Ctx[neoroute.NoData]) bool {
	// Do some checks here, for example check if the user is logged in
})
```

The string parameter the `Use` function takes is the sub-route you want it to apply to. `""` means it applies to all routes in the router, while you could also specify individual routes or sub-routes like this:

```go
// Applies to some-group/* (or a route called some-group)
router.Use("some-group", func(c *neoroute.Ctx[neoroute.NoData]) bool {})

// You can also apply middlewares to just one route in case you want
group.RoutePing("some-ping", func(c *neoroute.Ctx[neoroute.NoData]) {}).
	Use("", func(c *neoroute.Ctx[neoroute.NoData]) bool {})
```

**Middlewares will only apply to routes (or groups) created on router where the middleware has been created.** Just a little example for you to understand this idea:

```go
pingGroup := router.Group("some-ping")

// This middleware will NOT apply to anything other than the routes in pingGroup.
pingGroup.Use("", func(c *neoroute.Ctx[neoroute.NoData]) bool {})

// The middleware above will NOT activate before this route is called.
router.RoutePing("some-ping", func(c *neoroute.Ctx[neoroute.NoData]) {})
```
