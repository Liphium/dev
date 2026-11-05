---
title: "Schema and code generation for Neoroute"
description: "How to use neogen and neoschema to generate schemas or code from your Neoroute server."
---

When you've written some server code in Go, it's often really handy when you can just generate client code that can immediately connect to your server.

You get all of the same definitions as on the server, without having to write any of it yourself. Routes feel like functions and event handlers become completely type-safe.

Neoroute supports this code generation functionality for **all official client SDKs**. If you want to set it up, just follow this guide.

## Setup

It's just this one command (I hope you have [the Go toolchain installed](https://go.dev/dl)):

```sh
go install github.com/Liphium/neoroute/v2/cmd/neogen@latest
```

On top of that, any of the things Neoroute [requires by default](/neoroute/getting-started/introduction) (like msgp) need to be installed as well.

After that, try running:

```sh
neogen --version
```

If the command can't be found, you might have to add the Go binary directory to your `PATH`. The official guide can be found [here](https://go.dev/doc/install) (just choose your operating system).

## On the server side

Unfortunately neogen requires a few lines of code in your server to work as well. We need to be able to extract the schema after all.

This is how you use it (the neoschema packages is included in neoroute by default, so no extra install required):

```go
// Somewhere in your main function...
g := neoschema.NewGenerator()
g.Transporter("<NAME>", t) // t is any transporter you created

// Then let the program exits successfully and prints the schema when --neo-generate is set
g.PrintIfDesired()
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

### Integrating the command properly

```go prefix="sdk"
// For Go we recommend you create a separate folder for the generated code.
// You can then create a file in there with the following comment:

//go:generate neogen -path "./path/to/your/server" -target go

// Whenever you now run "go generate ./..." in your project, the definitions will
// be generated.
```

```json name="TypeScript" prefix="sdk" key="ts"
{
	"scripts": {
		// For TypeScript we recommend adding this script to your package.json.
		// We would also strongly encourage using a separate folder for generation output.
		"generate": "cd ./generated && neogen -path './path/to/your/server' -target typescript"
	}
}
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
// Models in TypeScript are generated into two different types:
// 1. The wire type (how it looks on the wire, needed for tuple support).
export type YourEventWire = {/* ... */};
// 2. The normal type (what you're probably gonna be using):
export type YourEvent = {/* ... */};

// Conversion functions are automatically generated too:
export function fromYourEventWire(wire: YourEventWire): YourEvent {}
export function toYourEventWire(event: YourEvent): YourEventWire {}

// You can just ignore this for most use cases, but having seen it once is
// probably helpful.

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
const connector = new YourConnector(/* some parameters */);

// Registering an event handler
connector.onYourEvent((event) => {});

// Sending a request
let response = await connector.yourRoute(/* request object / options */);
```

## Advanced

We added quite a lot of useful features to the code generation, but some of it you definitely won't need. Check here if you feel like something is missing.

### Tuples (if you're using them)

To properly use [tuples](/neoroute/guides/msgp#tuples) with code generation, you need to actually let us know that your struct is encoded as a tuple. Unlike `msgp` we only use go generics, meaning we can't read its comments.

For this reason, if your struct is marked with a `//msgp:tuple` comment, please add the following to your struct:

```go
//msgp:tuple Person
type Person struct {
	neoschema.IsTuple `msg:"-"`
	/* other fields */
}
```

### Custom objects

Have some structs you want to send to the client, but they aren't in any event, request or response? Just add them into the generator like this:

```go
// g is the generator from above
g.Add(SomeStruct{})
```

All of the structs in here will be generated into the client code, even if they aren't used anywhere.

Yes, you can do a lot with this, keep reading about using them for inheritance below.

### Inheritance with custom objects

When you're making something a little bit more complex you often quickly run into a case where you have something like a `type` attribute on an object you want to send to the client. These objects can then have different properties and maybe even share some.

We're gonna be looking at doing this in a **server to client** direction, but you can easily reverse this in the other direction without a lot of code.

We would like to use this section to recommend the most painless way (we found) to do this with our code generator. This is how you would lay out the structs in Go:

```go
type Animal struct {
	Type string `msg:"type"` // "dog" or "cat"
	Data []byte `msg:"data"`
}

type Dog struct {
	Breed string `msg:"name"`
}

type Cat struct {
	Color string `msg:"color"`
}
```

If you then want to send the client an `Animal`, that in our case is a `Dog`, you can do the following:

```go
dog := Dog{Breed: "Golden Retriever"}
dogBytes, err := dog.MarshalMsg(nil)
if err != nil {
	// Handle error
}
animal := Animal{
	Type: "dog",
	Data: dogBytes,
}
```

Then you would of course put `Animal` into some kind of normal response, or anything else.

Because `Dog` and `Cat` are structs that now officially don't use in any response or event (at least not directly), **neogen will not generate them by default**.

So, we add them as custom objects:

```go
g.Add(Dog{}, Cat{})
```

On the client, you can now decode the `Animal` like this after receiving it from a request or event:

```go name="Go" prefix="sdk"
// animal is the Animal struct we received
switch(animal.Type) {
	case "dog":
		var dog Dog
		_, err := dog.UnmarshalMsg(animal.Data)
		if err != nil {
			// Handle error
		}
	// Same for Cat...
}
```

```ts name="TypeScript" prefix="sdk"
import { decode } from "@msgpack/msgpack";
import { type Dog, type DogWire, fromDogWire, type Animal } from "./generated";

// const animal = new Animal(); (from whereever)
// We need to use the wire types here since those are the encoded forms.
// This is done by neogen so this also works with tuples.
switch (animal.type) {
	case "dog":
		const dogWire = decode(animal.data) as DogWire;
		const dog: Dog = fromDogWire(dogWire);
	// Same for Cat...
}
```

We know that it's a little bit more work than just running a command like you do for the normal code generation, but what you get out of it is a lot faster.

_It would probably be really cool to have some kind of helper function that does this for you..._

### Something missing?

Let us know your use case and what you feel like is missing in the framework. We might have a solution already and you just don't know about it yet!

## Known limitations

### Custom types

Although like 99% of codebases should be fine, in case you use something very specific to MessagePack, there are a few known limitations with code generation.

- Custom MessagePack types are currently **not supported**.
- Complex number types are not supported.

A good alternative to both of these problems is just using `[]byte` and encoding your custom type into that. That way the responsibility for handling it can all live in your code.

### Custom flags

You can have a lot of different flags in your generation command for `msgp`. We do not support any of them (like encoding unexported fields). Please be aware of this limitation.

We may add support for some flags in the future.

## Ending

We hope this makes your life easier. If there are any issues with generated code or other things with schema generation, please let us know.

**Hint:** You can also use the schema generation you now have with [our official API / Debug CLI](/neoroute/utility/neodebug). It allows you to test your entire server, without writing any frontend code yet.
