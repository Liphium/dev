---
title: "Neoroute Go Client SDK"
description: "How to connect to a Neoroute server straight from Golang."
---

Official SDK for **Go** - [GitHub](https://github.com/Liphium/neoroute/tree/main/client) - [go doc](https://pkg.go.dev/github.com/Liphium/neoroute/client)

## Installation

Run the following command in your Go project:

```sh
go get -u github.com/Liphium/neoroute/client@latest
```

Depending on which transporter you would like to use, run one of the following commands as well:

```sh name="HTTP" key="http"
go get -u github.com/Liphium/neoroute/client/transporter/http@latest
```

```sh name="WebSocket" key="ws"
go get -u github.com/Liphium/neoroute/client/transporter/websocket@latest
```

## Features

- Supports [WebSocket](/neoroute/client/websocket) and [HTTP](/neoroute/client/http) transporters (everything available in Neoroute as of writing this)
- Code generation support via [neogen](/neoroute/utility/neogen)
- Stable, used in lots of projects, as well as [neodebug](/neoroute/utility/neodebug) and other internal Liphium projects

## Examples

There are multiple client examples in the main [Neoroute repository](https://github.com/Liphium/neoroute/tree/main/examples). All of the client examples in the repository are written in Go, and therefore use this SDK.

Guides for how to run them are available in the README of all the examples.
