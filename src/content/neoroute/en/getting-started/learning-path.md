---
title: "Learning path"
description: "The best way to learn Neoroute and how a server is generally constructed."
---

While we do consider Neoroute a relatively simple framework, we do also recognize that we've introduced a lot of layers and objects that need explanations. This page is supposed to provide a structure and route through this documentation that allows you to learn Neoroute in a sensible way.

Or you could just follow our chat server guide [here](/neoroute/chat-app/backend) to **learn by doing**. Whichever way you prefer.

## 0. Base knowledge

Before we get any of this started, I want to let you know that using Neoroute requires at least an intermediate understanding of [Go](https://go.dev). We use a lot of Go's recent features, which is why we literally require Go 1.27, the newest release as of writing this.

You need to know at least how to use Go's **generics** and know your way around Go's **testing framework**. We don't explain any of that here.

## 1. The router

The first basic object you need to use Neoroute is a `Router`. It is the layer that will receive and process messages coming into the server. It will _route_ the messages to the routes you register on it.

**1.1.** Because we use MessagePack, a little bit of a rare encoding format for your messages, you should also look into how that works. We have a little crash course [here](/neoroute/guides/msgp), but if you want to look into it more deeply, the [msgp repository](https://github.com/tinylib/msgp) has a great wiki covering everything.

**1.2.** When you have gotten to the level of being able to declare a encodable and decodable struct using [msgp](https://github.com/tinylib/msgp), you can continue to learn all about the `Router` object [here](/neoroute/guides/routing).

## 2. The transporter

## 3. Recommendations from here

- code gen
- debugger
- testing
- client

## 4. Connecting to your server
