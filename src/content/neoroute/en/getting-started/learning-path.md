---
title: "Learning path"
description: "The best way to learn Neoroute and how a server is generally constructed."
---

While we do consider Neoroute a relatively simple framework, we do also recognize that we've introduced a lot of layers and objects that need explanations. This page is supposed to provide a structure and route through this documentation that allows you to learn Neoroute in a sensible way.

Or you could just follow our chat server guide [here](/neoroute/first-app/backend) to **learn by doing**. Whichever way you prefer.

## 0. Base knowledge

Before we get any of this started, I want to let you know that using Neoroute requires at least an intermediate understanding of [Go](https://go.dev). We use a lot of Go's recent features, which is why we literally require Go 1.27, the newest release as of writing this.

You need to know at least how to use Go's **generics** and know your way around Go's **testing framework**. We don't explain any of that here.

## 1. The router

The first basic object you need to use Neoroute is a `Router`. It is the layer that will receive and process messages coming into the server. It will _route_ the messages to the routes you register on it.

**1.1.** Because we use MessagePack, a little bit of a rare encoding format for your messages, you should also look into how that works. We have a little crash course [here](/neoroute/guides/msgp), but if you want to look into it more deeply, the [msgp repository](https://github.com/tinylib/msgp) has a great wiki covering everything.

**1.2.** When you have gotten to the level of being able to declare a encodable and decodable struct using [msgp](https://github.com/tinylib/msgp), you can continue to learn all about the `Router` object [here](/neoroute/guides/routing).

## 2. The transporter

Now that you have a router, you somehow need to expose some routes you have to the network. That's where the **Transporter** comes in. We have different ones, but all have the same job: They handle the actual networking needed to accept requests and more.

Choose your character (transporter): [HTTP](/neoroute/guides/http) or [WebSocket](/neoroute/guides/websocket). Do this based on the type of app you're trying to build.

**Optional:** If you chose WebSocket, you may also want to learn how to use [events & adapters](/neoroute/guides/events-adapters) to send your client some data from the server.

With the guide for the transporters, you should now also have a running web server. And what can I say, that's it for the server part, below we have listed some of the things we now always add in. And we **strongly encourage** you do too! Or skip to the [client part](#4-connecting-to-your-server).

## 3. Recommendations from here

**3.1.** Code generation: You don't want to paste the structs from your server to your client, so setup [neogen](/neoroute/utility/neogen). It's like a few lines of code, you can do it! **Very strong recommendation** here because this saves you so much time and suffering.

**3.2.** Debugger: You can't just generate definitions for your client from the setup you just did, you can also start our [debugging CLI neodebug](/neoroute/utility/neodebug) to send requests to your server and receive events from it. Also just a few lines, we **strongly recommend** you set this up.

**3.3.** Testing: We know you probably hate testing, but we make it very simple to call the route functions you have without having to install anything weird or using a client connection. Learn more [here](/neoroute/guides/testing). You probably wanna test your server at some point, right?

## 4. Connecting to your server

What is a server without a client? Well, useless. Let's change that and build something that can connect. Again also here, we recommend you use [code generation](/neoroute/utility/neogen).

**4.1.** Choose the language you want for your client: [Go](/neoroute/sdk/go) or [TypeScript](/neoroute/sdk/typescript).

**4.2.** Choose the connector you want to use for your client: [HTTP](/neoroute/client/http) or [WebSocket](/neoroute/client/websocket). This should match the transporter you chose for your server.

**4.3.** Learn how to send requests and receive events [here](/neoroute/client/events-and-requests).

And **THAT'S IT**. You have finally been **enlightened** with basically everything there is to know about this framework. We hope you love it just as much as we do now!
