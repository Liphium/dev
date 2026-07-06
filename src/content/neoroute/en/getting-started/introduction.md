---
title: "Introduction"
description: "Neoroute."
---

# Introduction
TODO

# Installation
To use Neoroute you need Go version `1.26` or higher. <br>
Then you can install Neoroute using `go get`
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
And run it:
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
To check that the server is working, you need a client that uses Neoroute, for this create a file `client.go` in a `client` subfolder:
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

And run it:
```bash
go run client.go
```

Now you should see a log that looks like this:
```
2026/07/07 01:08:29 Successfully sent ok.
```