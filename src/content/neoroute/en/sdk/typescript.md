---
title: "Neoroute TypeScript Client SDK"
description: "How to connect to a Neoroute server with TypeScript."
---

Official SDK for **TypeScript** - [GitHub](https://github.com/Liphium/neoroute-ts) - [NPM registry](https://www.npmjs.com/package/@liphium/neoroute-ts)

If you want to connect to your Neoroute server from NodeJS or the browser, you can follow this guide on how to install the official SDK. Actual functionality and usage is explained in the relevant pages under the Client category of the documentation.

We, ourselves, **only test this SDK with TypeScript** since that's what we use. However, you should also be able to get it to work in JavaScript.

## Installation

You literally just install the package.

```sh
npm install @liphium/neoroute-ts
```

For how to actually connect, follow the [WebSocket](/neoroute/client/websocket) or [HTTP](/neoroute/client/http) page.

## Features

- Written in modern TypeScript using only Browser APIs and [MessagePack for JavaScript](https://github.com/msgpack/msgpack-javascript)
- Supports [WebSocket](/neoroute/client/websocket) and [HTTP](/neoroute/client/http) transporters (everything available in Neoroute as of writing this)
- Basically equivalent to the [official Go client SDK](https://github.com/Liphium/neoroute/tree/main/client)
- Code generation support via [neogen](/neoroute/utility/neogen)

## Examples

We have some examples available in the [GitHub repository](https://github.com/Liphium/neoroute-ts/tree/main/examples). They're mostly ported over from the Go side of things, meaning you need to run the server from the Go examples to actually be able to test them out.

Guides for how to run them are available in the README of all the examples.

## Runtime support

We verified that the browser and NodeJS both work without problems in our tests. The only dependency we have is [MessagePack](https://github.com/msgpack/msgpack-javascript), the encoding we use instead of JSON.

Other than that, we use the native Browser APIs like `fetch` and `WebSocket`. For this reason, there should not be any issues. If you still find an environment that has problems or there is something wrong with our SDK, please kindly let us know on [GitHub](https://github.com/Liphium/neoroute-ts/issues).
