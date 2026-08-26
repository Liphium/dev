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

Neodebug actually only exposes one function, `neodebug.Run`. The `Config` object it takes in is how you tell it what transporter it should connect to. Here's what that could look like in your code:

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

That's quite literally it. You can now execute this in [Magic scripts](/magic/documentation/magic-scripts) or after checking if a certain argument is set.

We hope you enjoy your new debugger. But let's actually learn how to use it.

## Usage

**TODO** (with images plz)
