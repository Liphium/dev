---
title: "Accepting HTTP connections with Neoroute"
description: "How to allow clients to send requests to your Neoroute server over HTTP."
---

Using a HTTP transporter with Neoroute allows you to accept requests from clients over HTTP. However, unlike traditional HTTP frameworks, all of the routes are called through one central endpoint.

## Installation

Install the `http_transporter` package with `go`:

```sh
go get -u github.com/Liphium/neoroute/transporter/http@latest
```

## Usage

You can now create a new transporter like this:

```go
hook, t := http_transporter.NewTransporter(http_transporter.Config{
	HandshakeFunc: func
})
```
