---
title: "Schema and code generation for Neoroute"
description: "How to use neogen and neoschema to generate schemas or code from your Neoroute server."
---

When you've written some server code in Go, it's often really handy when you can just generate client code that can immediately connect to your server.

You get all of the same definitions as on the server, without having to write any of it yourself. Routes feel like functions and event handlers become completely type-safe.

Neoroute supports this code generation functionality for **all official client SDKs**. If you want to set it up, just follow this guide.

## Known limitations

Although like 99% of codebases should be fine, in case you use something very specific to MessagePack, there are a few known limitations with code generation.

- **Tuples** (when your entire message to or from the server is packed more tightly and efficiently) are currently **not supported**. We want to make this a thing at some point, but it's a pretty hard problem to solve due to the different ways MessagePack handles them in TypeScript and Go.
- Custom MessagePack types are currently **not supported**. We're however thinking about introducing a way to add your own definitions into the generated files.

## Setup

It's just this one command (I hope you have [the Go toolchain installed](https://go.dev/dl)):

```sh
go install github.com/Liphium/neoroute/cmd/neogen@latest
```

On top of that, any of the things Neoroute [requires by default](/neoroute/getting-started/introduction) (like msgp) need to be installed as well.

After that, try running:

```sh
neogen --help
```

If the command can't be found, you might have to add the Go binary directory to your `PATH`. The official guide can be found [here](https://go.dev/doc/install) (just choose your operating system).

## On the server side

Unfortunately neogen requires a few lines of code in your server to work as well. We need to be able to extract the schema after all.

This is how you use it (the neoschema packages is included in neoroute by default, so no extra install required):

```go
// Somewhere in your main function...
g := neoschema.NewGenerator()
g.Transporter("<NAME>", t) // t is any transporter you created

// Then let the program panic and print the schema when --neo-generate is set
g.PrintAndPanic()
```

When you now do the following command in your project folder, a (probably giant) JSON should be printed.

```sh
go run . --neo-generate
```

If you use [Magic](/magic), you might have to use a command like this:

```sh
go run -tags release . --neo-generate
```

Now, if there is anything else printed before **THE CODE GENERATION WILL NOT WORK**, so make sure the giant JSON is the only thing your program outputs.

If there is any kind of error, please report it to us, but this should normally just work.

## Generating the code

You can now go into any directory of your client project and run one of the following commands depending on which client SDK you use. The code will be generated into the folder you are currently in.

```sh prefix="sdk" name="Go" key="go"
neogen -path './path/to/your/server' -target go
```

```sh prefix="sdk" name="TypeScript" key="ts"
neogen -path './path/to/your/server' -target typescript
```

Additionally here are a few examples of other things you can do:

```sh name="Different schema generation command" key="schema"
neogen -command 'go run -tags release . --neo-generate'
```

```sh name="Running with debug logs" key="debug"
neogen -target typescript -v
```

## Using the generated code

On every client SDK, usage of the code is basically the same. What you get always are all of the structs you defined in your Go server, together with wrappers around the actual transporter implementation of the client SDK you chose.

You can use the generated connector just like you would use the main connector of the same transport type (HTTP, WebSocket, ...). Because of this, we recommend to look at the relevant guides for the wrapped transporters as well.

Now, here are the functions you get and some code examples:

```go prefix="sdk"
// Generated struct embedding the default connector
type YourConnector struct{}
func NewYourConnector(/* required arguments */) *YourConnector {}

// Generated function for receiving an event
func (c *YourConnector) ReceiveYourEvent(handler func(event YourEvent)) {}

// Generated function for sending a request (might be different based on the route type)
func (c *YourConnector) SendYourRoute(payload YourRequest) (YourResponse, error) {}

// ...

// Create the connector
c := NewYourConnector(/* required arguments */)

// Handle an event
c.ReceiveYourEvent(func(event YourEvent) {
	// Handle event here...
})

// Send a request
res, err := c.SendYourRoute(YourRequest{})
```

```ts prefix="sdk"
// This class will be generated as a wrapper around the normal transporter
export class YourConnector /* extends SomeTransporter */ {
	// ...

	// Generated function for receiving an event
	public onYourEvent(handler: (event: YourEvent) => void): void {}

	// Generated function for sending a request (might be different based on route type)
	public async yourRoute(
		payload: YourRequest,
	): Promise<YourResponse | UserError> {}
}

// ...

// Creating a new connector
const connector = new YourConnector();

// Registering an event handler
connector.onYourEvent((event) => {});

// Sending a request
let response = connector.yourRoute(/* request object */);
```

We hope this makes your life easier. If there are any issues with generated code or other things with schema generation, please let us know.

**Hint:** You can also use the schema generation you now have with [our official API / Debug CLI](/neoroute/utility/neodebug). It allows you to test your entire server, without writing any frontend code yet.
