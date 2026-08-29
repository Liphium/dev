---
title: "Introduction"
description: "Neoroute."
---

Neoroute is a **batteries-included remote procedure call (RPC) framework** for Golang, running exclusively on top of Web primitives (currently HTTP and WebSocket). With our rich tooling, you get **code generation**, an **interactive debugger** for sending requests and a lot more with minimal setup. We have everything you love about RPC and web frameworks, all in one **fully integrated package and ecosystem**.

## Installation

To use Neoroute you need Go version **1.27** or higher. Just add it to your project using `go`:

```bash
go get -u github.com/Liphium/neoroute@latest
```

## Features

- Use the same handlers over multiple protocols
- Rich [routing system](/neoroute/guides/routing) with support for middlewares, groups and more
- [Events & adapters](/neoroute/guides/events-adapters) for easy server to client communication
- Full support for [HTTP](/neoroute/guides/http) and [WebSocket](/neoroute/guides/websocket) transporters
- Fast and small messages thanks to [MessagePack](https://msgpack.org/)
  - Some of the fastest encoding and decoding thanks to [msgp](https://github.com/tinylib/msgp)'s code generation
- Client SDKs for [Go](/neoroute/sdk/go) and [TypeScript](/neoroute/sdk/typescript)
- Full code generation support for Go and TypeScript using [neogen](/neoroute/utility/neogen)
- Interactive debugging CLI using [neodebug](/neoroute/utility/neodebug)
- Lots of [testing utilities](/neoroute/guides/testing)

## Use with AI

We provide the entire documentation you're seeing right now for AI as well. It's index is available at [ai.liphium.dev/neoroute/index.md](https://ai.liphium.dev/neoroute/index.md).

You can install our `liphium-neoroute` skill that contains this information and some rules for Neoroute using:

```sh
npx skills add liphium/dev@liphium-neoroute
```

Your agent will love it.

## Learning resources

Neoroute is quite a simple RPC framework, but it has lots of features that you might also expect in normal Web Frameworks. This is by design, as we want Neoroute to be usable for all use cases: From game servers to web applications and even mobile apps, anything that needs a server should be able to use Neoroute.

### Learning path

We provide a rich [learning path](/neoroute/getting-started/learning-path) that you can read through in about 30 minutes or less. It gives you a clear guide through the entire documentation and shows you what pages to read when. After going through it, you should have a really good understanding of Neoroute and its features.

### Examples

There are various examples available in our [main repository](https://github.com/Liphium/neoroute/tree/main/examples). Feel free to check them out to get a feel for the framework.

## Contributing

We don't have any hard rules, but please keep in mind the following:

- No full AI PRs or issues: You should know what your code and writing contains, don't commit straight up slop.
- Be friendly with everyone, we're all here working on this project in our free time.

If you then want to contribute, follow this simple process:

1. Create an issue outlining what you want to add or the bug you found.
2. If it's a feature, discuss it with us and we'll see if we add anything like it. Specify if you want to work on it or have already started working on it.
3. If you chose contribution: Create a PR and iterate on it with us, we'll check and review when we have time.
4. When the feature / bug fix is out, the issue will be closed.

We really appreciate any contribution, even if it's just fixing a little thing or improving some documentation.

Thanks to everyone who contributed to Neoroute!

## Roadmap

There aren't actually lots of things we want to add to Neoroute. The framework is already powerful enough for basically anything and the current abstractions cover about everything you would wanna build. However, there are a few central pieces still missing, but ones that don't require you to change even a line of code.

### WebTransport support

Neoroute has been built because we wanted a framework for all kinds of servers. But there is one important part still missing: Unreliable transport.

Especially for games, this is kind of important and we've already got a test implementation done in the main repository. The only reason we've not published it yet is that we want to make sure we do this right. WebTransport is a lot harder to get working than something like WebSockets because you essentially get access to raw QUIC streams.

We'll update you when we have it ready.

### Closing the code generation moat

While [neogen](/neoroute/utility/neogen) is already super powerful and can generate a lot of code for you, there are certain aspects of [msgp](https://github.com/tinylib/msgp), the library we use for MessagePack, that we don't currently support.

Those are mainly the following things:

- **Tuples:** When you don't have string keys anymore and just put everything in one huge array. This would unlock better encoding and decoding performance across the board.
- **Custom types:** While MessagePack provides a lot of types, when you do something with inheritance or have different kinds of structured objects in your messages, you might want to use custom types. While we of course can't port code from Golang to TypeScript, we would at least like to give you the option to define custom encoding and decoding functions instead of relying on the generator.

We don't know when we'll work on any of these features, but this is what the future holds for Neoroute. If you of course feel like anything important is missing from the framework, let use know!
