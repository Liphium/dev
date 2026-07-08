---
title: "Router grouping"
description: "Router grouping with Neoroute."
---

# What is router grouping
As you might use multiple transporter and or transporter types, and probably don't want all of those to share the exact same routes, you can use router grouping to allow different router to share select routes. <br>
This explanation might seem confusing at first, you can take a look at the examples below to get a better understanding of when and how to use router grouping.<br>

**A simple base example to show you how router grouping works:**
```go
// This router will be used for the http transporter
httpRouter := neoroute.NewNeoRouter[neoroute.NoData](neoroute.Config{})

// This router will be used for the websocket transporter
wsRouter := neoroute.NewNeoRouter[neoroute.NoData](neoroute.Config{})

// Group the http and ws router together. 
// Everything that will be applied to this sharedRouter will be applied to all Routers it contains.
// In this case httpRouter and wsRouter.
sharedRouter := neorouter.NewRouterGroup(httpRouter, wsRouter)

// This route can be accessed by clients connected by either http or websocket
neoroute.Route(sharedRouter, "shared-route", <handlerFunction>)

// The httpRouter has an additional route, that won't be accessible through the websocket client.
// In this fictional case the reasoning behind it is: 
// The websocket server will send state updates via events, as the http transporter has no persistent connection
// to a client it needs this extra route for http clients to get the state.
neoroute.Route(httpRouter, "get-state", <handlerFunction>)
```

**Add a NeoRouter to an existing Router:**
```go
// This router will be used for the http transporter
httpRouter := neoroute.NewNeoRouter[neoroute.NoData](neoroute.Config{})

// All handler that will be applied to this router will be in the format account/<route_name>
accountRouter := httpRouter.Group("account")

// This router will be used for the websocket transporter
wsRouter := neoroute.NewNeoRouter[neoroute.NoData](neoroute.Config{})

// This router will be used for another custom transporter
customRouter := neoroute.NewNeoRouter[neoroute.NoData](neoroute.Config{})

// This will add the websocket Router to the account Group, 
// every handler applied with this router from now onwards will be available over both http and websocket and the custom transporter.
accountRouter.AddRouters(wsRouter, customRouter)

// This route can be accessed by clients connected by either http, websocket or the custom transporter 
neoroute.Route(sharedRouter, "shared-route", <handlerFunction>)

// The httpRouter has an additional route, that won't be accessible through the websocket client.
// In this fictional case the reasoning behind it is: 
// The websocket server will send state updates via events, as the http transporter has no persistent connection
// to a client it needs this extra route for http clients to get the state.
neoroute.Route(httpRouter, "get-state", <handlerFunction>)
```
But keep in mind for routers to be able to share routes, they have to use the same `SessionData` type. <br>
<br>
**Common pitfall:** The router returned by the AddRouters function is the router you called the function on. AddRouters **won't** create and return a new router. The return is just for chaining. <br>

**Do not use this code, this example demonstrates the miss use of the returned Router by AddRouters:**
```go
// This router will be used for the http transporter
httpRouter := neoroute.NewNeoRouter[neoroute.NoData](neoroute.Config{})

// This router will be used for the websocket transporter
wsRouter := neoroute.NewNeoRouter[neoroute.NoData](neoroute.Config{})

// Group the http and ws router together. 
// Everything that will be applied to this sharedRouter will be applied to all Routers it contains.
// In this case httpRouter and wsRouter.
sharedRouter := httpRouter.AddRouters(wsRouter)

// This route can be accessed by clients connected by either http or websocket
neoroute.Route(sharedRouter, "shared-route", <handlerFunction>)

// Because AddRouter was used on httpRouter, it will now apply the get-state route to the wsRouter too.
// In this case this was not intended by the user.
neoroute.Route(httpRouter, "get-state", <handlerFunction>)
```