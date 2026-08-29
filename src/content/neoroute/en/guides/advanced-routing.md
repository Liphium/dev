---
title: "Advanced routing"
description: "A look into grouping and middlewares for advanced routing."
---

We recognize that you sometimes need more than just one router. Especially with complex setups grouping and middlewares can come in really handy.

## Grouping

When you want to create a router for a sub-route, you can use the `Group` function. Here is how that works:

```go
// group is a new router, with the exact same functions, but mounted into router
group := router.Group("some-group")

// This route will now be at some-group/some-ping
group.RoutePing("some-ping", func(c *neoroute.Ctx[neoroute.NoData]) {})
```

This is useful when you have a lot of routes that are related or in another module. But another thing they are useful for is middlewares, so let's learn what those are finally.

## Middlewares

A middleware is a function that lives in front of your actual route functions. You can use them to stop requests before they reach the route function. This is useful for things like checking permissions.

### Adding middlewares

You can add a middleware to any router like this:

```go
router.Use("", func(c *neoroute.Ctx[neoroute.NoData]) error {
	// Do some checks here, for example check if the user is logged in
})
```

The string parameter the `Use` function takes is the sub-route you want it to apply to. `""` means it applies to all routes in the router, while you could also specify individual routes or sub-routes like this:

```go
// Applies to some-group/* (or a route called some-group)
router.Use("some-group", func(c *neoroute.Ctx[neoroute.NoData]) error {})

// You can also apply middlewares to just one route in case you want
group.RoutePing("some-ping", func(c *neoroute.Ctx[neoroute.NoData]) {}).
	Use("", func(c *neoroute.Ctx[neoroute.NoData]) error {})
```

### How middlewares work

The `error` you return from a middleware has the following meaning:

- `nil`: The route will be executed like normal or we go to the next middleware.
- `neoroute.NewError`: The error message you passed in there will be returned to the client. `ErrorHandler` on the router will not be called.
- Any other `error`: `ErrorHandler` will be called to determine an error message that will then be returned to the client.

**Note:** In case a middleware is executed for a route that does not have a response, any `error` you return will simply be ignored and still not sent to the user (`ErrorHandler` will still be executed). The route will simply not be executed.

### Important things about middlewares

**Middlewares will only apply to routes (or groups) created on router where the middleware has been created.** Just a little example for you to understand this idea:

```go
pingGroup := router.Group("some-ping")

// This middleware will NOT apply to anything other than the routes in pingGroup.
pingGroup.Use("", func(c *neoroute.Ctx[neoroute.NoData]) error {})

// The middleware above will NOT activate before this route is called.
router.RoutePing("some-ping", func(c *neoroute.Ctx[neoroute.NoData]) {})
```
