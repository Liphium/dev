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

As with all of the times you use `go install`, make sure your `$GOPATH/bin` directory is in your path. Otherwise the following examples will not work.

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

## Further optimization

You can improve the performance of your encoding and decoding even more. We've collected a few ways for you to do this here. For even more fine-tuning though, the [msgp wiki](https://github.com/tinylib/msgp/wiki) is a great place.

### Tuples

By default, MessagePack encodes your structs like a map. This means when decoding a field we have to do a lookup for which type the field name has, and then decode into it properly.

The main wins summarized:

- Encoding large structs is **a lot faster**
- The size of the encoded output is smaller since we don't have to encode the field names anymore.
- Changing field names and the `msg` tag for fields in a struct (while keeping their type and order the same) does not break compatibility with older versions.

But it also has a few drawbacks, mainly these ones:

- If you change the **field order** of the struct, you have to regenerate the code and recompile your application.
- **Adding fields will break compatibility** with older versions.

However, since `v2.0.0`, [neogen](/neoroute/utility/neogen) can at least generate code for you to make sure tuples are properly handled. However, **TUPLE GENERATION REQUIRES ADDITIONAL SETUP**. Please check the [neogen documentation](/neoroute/utility/neogen#tuples-if-youre-using-them) to learn how to do this.

To make a struct a tuple, you can just add a `//msgp:tuple` comment above a struct in the following way:

```go
//msgp:tuple Person
type Person struct {
	Name       string `msg:"name"`
	Address    string `msg:"address"`
	Age        int    `msg:"age"`
	Hidden     string `msg:"-"` // this field is ignored
	unexported bool             // this field is also ignored
}
```

## Current limitations

There are quite a few things we don't support officially for MessagePack. If you use the defaults `msgp` provides, you should largely not have problems, but there are a few things we'd like to point out.

### Map keys

Neoroute schemas only support string map keys, such as `map[string]User`. Non-string keys, including numeric keys, are rejected. Use string keys to keep your models compatible with [neogen](/neoroute/utility/neogen) and [neodebug](/neoroute/utility/neodebug).

This is mainly because of the fact that `msgp` does not support non-string map keys in the code generator without extra flags. We do not want you to shoot your foot with this, which is why we just decided to disable them completely. You can of course still use them with the main framework, but our code generator (neogen) will not handle them as it doesn't know if you enabled them or not.

### Custom types

- **Complex numbers:** `msgp` has support for `complex64` and `complex128`, but the code generator does not support them yet and `msgp` seems to be the only library capable of handling these types. **Be careful with them**.
- **Custom types:** You can also specify your own encoding and decoding functions, as with every other encoding format. We **do not recommend** doing this due to the **lack of support** in the **code generator**. The main framework is of course capable of decoding and encoding these types though.

A good alternative to both of these problems is just using `[]byte` and encoding your custom type into that. That way the responsibility for handling it can all live in your code.

### Custom flags

You can have a lot of different flags in your generation command for `msgp`. We do not support any of them (like encoding unexported fields). Please be aware of this limitation.

We may add support for some flags in the future.

## Why MessagePack?

Since this will be asked anyway, here is a summary of all the reasons why we use MessagePack:

- **VS Protobuf:** No extra file format, extensions and other shit required.
- **VS JSON:** Smaller and faster thanks to binary encoding and code generation.
- **VS JSON:** `[]byte` can be encoded and decoded without Base64 or some other kind of hack.

We acknowledge the following downsides, but think that the positives far outweigh the negatives:

- **VS JSON:** Not human readable, but [neodebug](/neoroute/utility/neodebug) exists.
- **VS Protobuf:** Not as optimized in the default configuration. Performance highly varies per configuration and programming language for MessagePack. You can use [tuples](#tuples) to get close to Protobuf-level size and performance, at least for Go.
