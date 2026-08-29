---
title: "Routing"
description: "How Neoroute's Router works and the different routing functions."
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

## Defining routes

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

## Naming conventions for routes

For naming your routes, we only the following characters: `-`, `/`, `_`, `~`, `.`, all lowercase letters (`a`-`z`) and all numbers (`0`-`9`). Any uppercase letters will be made lowercase and any other characters will be truncated, so please just don't use them.

To separate routes and their sub-routes we use `/`. Therefore, multiple `/` will also be reduced to just one. If the last character is a `/`, it will also be removed.

## Example route definitions

Here are examples for all of the different route definition functions we have:

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

## Useful utilties in routes

When you're in a route, you get access to the `Session[neoroute.NoData]` object you might already know from the transporter guides. You can get this object in routes as well, by calling `ctx.Session()`.

Here are some useful things to know:

- `ctx.Session().UpdateData()` lets you modify the session data in case you want to, this is fully concurrency safe.
- `ctx.Session().Id()` is a unique id assigned to the session. It is guaranteed to be unique for the connection backing this session.
- `ctx.Session().Adapt()` gives you a new [adapter](/neoroute/guides/events-adapters).

## Error handling

Returned errors will be handled in the `ErrorHandler` of the router. Returning `nil` **will cause a panic**. You can also return an error message to the client directly like this:

```go
return neoroute.NewError("your error message")
```

Any `neoroute.NewError` returns will not be forwarded to the `ErrorHandler` in the router as the message passed in already is the error message returned to the client.

This is just a short excerpt, [here](/neoroute/guides/error-handling) you can learn more about error handling.
