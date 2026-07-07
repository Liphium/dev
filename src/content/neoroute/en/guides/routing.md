---
title: "Routing"
description: "Routing with Neoroute."
---

# When to use which routing type
There are 6 different routing types. These are needed to ensure type safety, while supporting all request use cases.The table below lists all existing Route functions and their differences.
| Routing function                  | Has request data | Has response data | Can error | Has response |
| --------------------------------- | ---------------- | ----------------- | --------- | ------------ |
| [Route](#route)                   | ✅                | ✅                 | ✅         | ✅            |
| [RouteNoRequest](#routenorequest) | ❌                | ✅                 | ✅         | ✅            |
| RouteOk                           | ✅                | ❌                 | ✅         | ✅            |
| RouteOkNoRequest                  | ❌                | ❌                 | ✅         | ✅            |
| RouteNoResponse                   | ✅                | ❌                 | ❌         | ❌            |
| RoutePing                         | ❌                | ❌                 | ❌         | ❌            |

For example you might not have any return data, but the request can still fail, then you could use RouteOk. Or you are using udp and just sending data to the server, in this case you want to neither send nor wait to receive a response, then RouteNoResponse is the type you should use. 

# How to use the Route variants
**Don't forget:** When using Routes that send or receive data, the types you can use have to implement the MessagePack functions, see [this](/neoroute/getting-started/introduction#messagepack) for more information.

## Route
Route is the default routing variant, it receives request data, and sends response data or an error. <br>
Example use case: The client wants to join a lobby and provides the lobby id as the request data, and receives their user id for the lobby as the response data.<br>
**The data structs:** 
```go
//go:generate msgp

type RequestData struct {
	SomeInt int `msg:"some_int"`
}

type ResponseData struct {
	SomeString string `msg:"some_string"`
}
```
**Actual route:** 
```go
// ... Other code and router creation

neoroute.Route(<ROUTER>, "some-route", func(c *neoroute.ResCtx[<SESSION_DATA_TYPE>, ResponseData, *ResponseData], req RequestData) error {
    return c.Respond(ResponseData{
        SomeString: fmt.Sprintf("%v", req.SomeInt),
    })
})
```

## RouteNoRequest
RouteNoRequest receives no request data, but still returns response data or an error. <br>
Example use case: Create a lobby, the user can create a lobby without any request data, but gets the lobby id as an response.<br>
**The data structs:** 
```go
//go:generate msgp

type ResponseData struct {
	SomeString string `msg:"some_string"`
}
```
**Actual route:** 
```go
// ... Other code and router creation

neoroute.RouteNoRequest(<ROUTER>, "some-route", func(c *neoroute.ResCtx[<SESSION_DATA_TYPE>, ResponseData, *ResponseData]) error {
    return c.Respond(ResponseData{
        SomeString: "some response",
    })
})
```

## RouteOk
RouteOk receives request data, but returns no response data, just ok or an error. <br>
Example use case: The user selects an character in the lobby, the character can already be selected, what would result in an error or the character is free and the server returns ok.<br>
**The data structs:** 
```go
//go:generate msgp

type RequestData struct {
	SomeInt int `msg:"some_int"`
}
```
**Actual route:** 
```go
// ... Other code and router creation

neoroute.RouteOk(<ROUTER>, "some-route", func(c *neoroute.OkCtx[<SESSION_DATA_TYPE>], req RequestData) error {
    return c.RespondOk()
})
```

## RouteOkNoRequest
RouteOkNoRequest receives no request data and returns no response data, just ok or an error. <br>
Example use case: Toggle the users ready state. It can could fail if the game is already running or work and the client gets an ok response.<br>
**Actual route:** 
```go
// ... Other code and router creation

neoroute.RouteOkNoRequest(<ROUTER>, "some-route", func(c *neoroute.OkCtx[<SESSION_DATA_TYPE>]) error {
    return c.RespondOk()
})
```

## RouteNoResponse
RouteNoResponse receives request data, but sends nothing to the client back as a response. <br>
Example use case: Voice package over UDP. Some packets may not arrive, so the client should not wait for a response from the server.<br>
**The data structs:** 
```go
//go:generate msgp

type RequestData struct {
	SomeInt int `msg:"some_int"`
}
```
**Actual route:** 
```go
// ... Other code and router creation

neoroute.RouteNoResponse(<ROUTER>, "some-route", func(c *neoroute.Ctx[<SESSION_DATA_TYPE>], req RequestData) {
    fmt.Println("received sime int: ", req.SomeInt)
})
```

## RoutePing
RoutePing receives no request data and sends nothing to the client back as a response <br>
Example use case: Connection heartbeats over UDP, where the client periodically pings the server to keep the session alive without needing any data exchange or confirmation back.<br>
**Actual route:** 
```go
// ... Other code and router creation

neoroute.RoutePing(<ROUTER>, "some-route", func(c *neoroute.OkCtx[<SESSION_DATA_TYPE>]) {
    fmt.Println("received request on some-route")
})
```