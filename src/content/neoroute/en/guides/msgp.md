---
title: "How to use msgp (MessagePack)"
description: "How to use msgp (MessagePack), the encoding and decoding used in Neoroute."
---

Because it's faster than JSON and has really great support in Golang thanks to [msgp](https://github.com/tinylib/msgp), Neoroute uses MessagePack as its encoding format of choice for everything.

This page gives you a short crash course into how to use it and known limitations with Neoroute.

## Installing msgp

Just run the following command to install the CLI for code generation (this is different from `neogen`, `msgp` is required to generate the code that make your structs encodable and decodable):

```sh
go install github.com/tinylib/msgp@latest
```

As with all of the times you use `go install`, make sure your `$GOHOME/bin` directory is in your path. Otherwise the following examples will not work.

## Using msgp

Using `msgp` is actually not too different from json.

### 1. Declare the struct

Just like JSON, you can declare any kind of struct, but instead of using the `json` struct tag, you now have to use the `msg` struct tag like this:

```go
type Person struct {
	Name       string `msg:"name"`
	Address    string `msg:"address"`
	Age        int    `msg:"age"`
	Hidden     string `msg:"-"` // this field is ignored
	unexported bool             // this field is also ignored
}
```

### 2. Generate the code

Now, to the file your struct is in you have to add the following line:

```go
//go:generate msgp
```

This will tell `go generate` to run the specified command that is specified in the `//go:generate` comment. In this case, it will run `msgp` on the file.

You can now generate the encoding and decoding functions using:

```sh
go generate ./...
```

And just like this, you're done!

### Explore more

Since [msgp](https://github.com/tinylib/msgp) has lots of really cool features that you can all also use with Neoroute, except for the ones listed below, you can check out their wiki for everything that's possible.

## Current limitations

- **Tuples:** Using `//msgp:tuple <struct>` you can make the encoding and decoding of a lot of structs a lot faster. However, Neoroute does not currently support this feature very well, as **our code generator** for example still **doesn't know how to handle it**.
- **Custom types:** You can also specify your own encoding and decoding functions, as with every other encoding format. As with tuples though, we **do not recommend** doing this due to the **lack of support** in the **code generator**.

## Why MessagePack?

Since this will be asked anyway, here is a summary of all the reasons why we use MessagePack:

- **VS Protobuf:** No extra file format, extensions and other shit required.
- **VS JSON:** Smaller and faster thanks to binary encoding and code generation.
- **VS JSON:** `[]byte` can be decoded without Base64 or some other kind of hack.

We acknowledge the following downsides, but think that the positives far outweigh the negatives:

- **VS JSON:** Not human readable.
- **VS Protobuf:** No code generation support for all languages.
