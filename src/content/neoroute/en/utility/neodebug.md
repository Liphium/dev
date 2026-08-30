---
title: "Debug your Neoroute server"
description: "How to connect to your Neoroute server with our in-house debugger CLI, neodebug."
---

When you want to test out some new routes or events you've created, you might want to test them before they're actually implemented in your client. That's where [neodebug](https://github.com/Liphium/neoroute/tree/main/pkg/neodebug) can come in handy.

**Note:** If you want to write actual tests with Neoroute, you can follow [this guide](https://www.youtube.com/watch?v=dQw4w9WgXcQ) instead. Here we only cover manual testing.

## Requirements

Neodebug builds on top of the [schema generation](/neoroute/utility/neogen) powered by neoschema. So please follow the guide on how to set that up first. Without it neodebug **will not work**.

## Adding neodebug to your server

Quite simple:

```sh
go get -u github.com/Liphium/neoroute/pkg/neodebug@latest
```

The reason why neodebug is a package and not a CLI tool is actually quite simple: That way it integrates better with [Magic](/magic).

But in general, this way you do not have to remember long commands and can just do a little thing like this:

```sh
go run . --debug
```

So, let's get into how you get that kind of functionality.

## Implementing debug functionality

In general, the entrypoint to neodebug should live in your server code or some package you have in your server (for example `your_project/cmd/debug`). While we usually put it in [Magic scripts](/magic/documentation/magic-scripts) so we can execute it quite easily, checking for an argument or creating a separate `cmd/debug` folder that you can then execute with `go run ./cmd/debug` are both things you can do.

Neodebug actually only exposes one function, `neodebug.Run`. After calling it, neodebug will generate your schema and open up a debugger CLI interface. Here's how you use the `Run` function:

```go
import (
	"github.com/Liphium/neoroute/pkg/neodebug"
	"github.com/Liphium/neoroute/pkg/neodebug/config"
)

neodebug.Run(config.DebugConfig{
	// The command required to generate the schema for your application.
	// Default: go run . --neo-generate
	GenerateCommand: "",

	// The name of the transporter you want to connect to (from your schema).
	TransporterName: "main",

	// The URL to that transporter.
	TransporterURL:  "http://localhost:6121",
})
```

We hope you enjoy your new debugger. But let's actually learn how to use it.

## Usage

While Neodebug is designed to be as simple as possible, it can be a little much in the beginning. Showing everything here with images is something we could do, but I think a video makes more sense here.

So go watch it: [https://www.youtube.com/watch?v=EM6WdF-U8go](https://www.youtube.com/watch?v=EM6WdF-U8go).
