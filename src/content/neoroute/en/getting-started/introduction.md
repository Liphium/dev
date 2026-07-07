---
title: "Introduction"
description: "Neoroute."
---

# Introduction
TODO

# Installation
To use Neoroute you need Go version `1.26` or higher. <br>
Then you can install Neoroute using
```bash
go get github.com/Liphium/neoroute@latest
```

# Hello World
Get the http transporter:
```bash
go get github.com/Liphium/neoroute/transporter/http@latest
```
Create a `server.go` file for a simple http application:
```go
package main

import (
	"log"
	"net/http"

	"github.com/Liphium/neoroute"
	http_transporter "github.com/Liphium/neoroute/transporter/http"
)

func main() {

	router := neoroute.NewNeoRouter[any](neoroute.Config{})

	hook, _ := http_transporter.NewHTTPTransporter(router, func(r *http.Request) (any, bool) {
		return nil, true
	})

	neoroute.RouteOkNoRequest(router, "", func(c *neoroute.OkCtx[any]) error {
		return c.RespondOk()
	})

	mux := http.NewServeMux()
	mux.HandleFunc("/", hook)
	log.Fatal(http.ListenAndServe(":6121", mux))
}
```
And run it with
```bash
go run server.go
```
If you see no print don't worry, it just means that the server is running.

## Client
Get the http transporter and client:
```bash
go get github.com/Liphium/neoroute/client@latest
go get github.com/Liphium/neoroute/client/transporter/http@latest
```
To check that the server is working, you need a client that uses Neoroute, for this create a file named `client.go` in a `client` subfolder:
```go
package main

import (
	"log"
	"net/url"

	"github.com/Liphium/neoroute/client"
	http_transporter "github.com/Liphium/neoroute/client/transporter/http"
)

func main() {

	s := client.NewSender(client.Config{})

	u, _ := url.Parse("http://localhost:6121/")
	http_transporter.NewHTTPTransporter(s, "GET", u)

	err := client.SendOkNoRequest(s, "")
	if err != nil {
		log.Println("Error with ok send: ", err)
		return
	}

	log.Println("Successfully sent ok.")
}
```

And run it with
```bash
go run client.go
```

Now you should see a log that looks like this:
```
2026/07/07 01:08:29 Successfully sent ok.
```

# MessagePack
For fast and small messages we are using a binary format called [MessagePack](https://msgpack.org/) for request and response data encoding and for go specifically the [msgp](https://github.com/tinylib/msgp) implementation. <br>
If you want to sent or receive messages that contain data, you have to install the msgp binary application. For a detailed and up-to-date installation instruction consult the readme on their GitHub page. <br>
To use a struct in with Neoroute you have to do add msgp support to them, this can be achieved by adding `//go:generate msgp` in a source file and add the field names to structs just like you would with json.
```go
type Person struct {
	Name       string `msg:"name"`
	Address    string `msg:"address"`
	Age        int    `msg:"age"`
	Hidden     string `msg:"-"` // this field is ignored
	unexported bool             // this field is also ignored
}
```
After that run `go generate ./...` to code generate the un/marshalling functions needed to use it with Neoroute.