---
title: "Routing"
description: "Routing with Neoroute."
---

# Routers
Neorrouters are the base of our routing system, you need at least one to host any routes or middleware. 
```go
router := neoroute.NewNeoRouter[neoroute.NoData](neoroute.Config{})
```
**Note:** Neorouters have a default error handling function, but it is preferred for you to set you own. You can do that by setting the ErrorHandler field in the `neoroute.Config`.<br>
This base router can be used directly to route [handler](/neoroute/guides/route-variants) and apply [middleware](/neoroute/guides/middleware), or it can be [grouped with other Neorouters](/neoroute/guides/router-grouping) or [route groups can be created](/neoroute/guides/grouping)

# Paths and Route naming
For the names of your routes you can use characters from a select list. Within those limits you can name the routes whatever you want. <br>
To separate routes and their sub-routes we use `/`. When providing a route in a function, you can either provide just one `some-route` or you can create a whole path directly without any groups or sub-routers with `some-sub-route/some-route`. <br>
Below is a list of all allowed characters:
* -
* /
* _
* ~
* .
* a-z
* A-Z
* 0-9

If your route contains illegal characters or has bad formatting in any other way, Neoroute will clean the route for you when adding a handler or middleware.