---
title: "Changelog"
description: "When we ship breaking changes or change important things, you'll find them in here."
---

In case important things about Neoroute are changed, we'll mention them in a big changelog here with links into the documentation as well, so you can more easily adopt new stuff and now where new guidelines are.

## v2.0.0

With `v2.0.0` we're introducing the biggest update to Neoroute since it's initial `v1.0.0` release. We're adding a lot of quality of life features and making the framework a lot more resistant and secure.

The full changelog is available [here](https://github.com/Liphium/neoroute/releases/tag/v2.0.0).

### Why a new major?

The main reason for a new major version this time around is breaking changes for things that go on under the hood. If you've been using Neoroute correctly until now, you should just be able to upgrade without any kind of hassle. You just get a lot more options now. `v2` SDKs are only compatible with `v2` client SDKs. We don't provide options for backwards-compatability since this framework is not being used in important production apps, at least to our knowledge.

### New wire format

By far the most important change since the last version of the `v1` family is our new wire format.

All of the main headers and more that Neoroute attaches to your requests are now tuples. To put it quite simply, this means decoding performance as well as the size for all of your messages decreases by just a little bit. Tuples are also explained again below this. The most important reason for this change however is security. Because the order of things is now more predictable, we were able to make the framework a lot more robust against [DDoS attacks](https://en.wikipedia.org/wiki/Denial-of-service_attack).

You shouldn't expect a major performance increase just from upgrading to Neoroute `v2.0.0`. However, to improve performance for your application across the board there are a few other things this update makes a lot more easier.

### Tuple support

If you want to optimize the performance of your application to the absolute maximum, we now officially support **tuples** in code and schema generation.

You might rightfully ask what this means. In basic words, encoding a struct as a tuple means its encoded like a list and not like a map. You can read more about the benefits [here](/neoroute/guides/msgp#tuples).

To use tuple support simply add this for any of your structs:

```go
//msgp:tuple <struct_name>
type SomeStruct {
	neoschema.IsTuple `msg:"-"`
	// ...
}
```

All components of Neoroute support this functionality by default now meaning you shouldn't have any problems. Be careful of the neogen changes regarding this, though.

### Core framework

In the core of Neoroute a lot of under the hood things changed to make the framework more secure. One of the most important things for making things more secure, is setting clear limits on request sizes and how long it can take to send these requests.

This is why in `v2.0.0` you now get options to customize a maximum request size and also request timeout directly on the server, for every route and a default across all of them:

```go
// Global default is set directly on your router
router := neoroute.NewRouter[neoroute.NoData](neoroute.Config{
	ReadTimeout: 1 * time.Minute,
	MaxRequestSize: 1024,
})

// After that you can define it for every route individually
router.Route("some-route", /* route function */,
	neoroute.WithMaxRequestSize(512), neoroute.WithReadTimeout(-1))
```

Read more in the [advanced routing documentation](/neoroute/guides/advanced-routing#configuring-routes).

### Client SDKs

Something we also completely overlooked in `v1` was giving you customizable timeouts for every request in the client SDK. Sending a request to a file upload route or to a simple ping route should not have the same timeout.

You can now configure timeout per request (and a global default timeout) like this:

```go prefix="sdk"
// Global default timeout is set directly on your client
c := client.NewClient(client.Config{
	// ...
	RequestTimeout: 10 * time.Second,
})

// Individual timeouts
response, err := c.Send[SomeResponse]("your_route", SomeRequest{/* data */}, client.WithMaxRequestTimeout(30*time.Second))
```

```ts prefix="sdk"
// Global default timeout is set directly on your client
const client = new Client({
  // ...
  requestTimeout: 10000,
});

// Individual timeouts
const response = await client.send<SomeRequest, SomeResponse>(
  "your_route",
  {/* data */},
  { requestTimeout: 30000 },
);
```

For global timeouts, read more in the [WebSocket documentation](/neoroute/client/websocket#creating-the-client) or the [HTTP documentation](/neoroute/client/http#creating-the-client).

For individual request timeouts, check the [events and requests documentation](/neoroute/client/events-and-requests#setting-custom-timeouts).

### Neogen

For tuple support we changed the way neogen handles TypeScript generation to have a consistent format across tuple and non-tuple objects. Read more [here](/neoroute/utility/neogen#using-the-generated-code), specifically in the TypeScript section there.

To sum it up, neogen now generates `to` and `from` functions between a "wire" type and your regular object. The regular object is what's returned, the wire object is what actually gets sent. Based on whether your object is a tuple or not, the wire type will be different.

### Neodebug

Neodebug also got a lot of love this release.

[Presets](/neoroute/utility/neodebug#presets-since-v200) allow you to define custom requests that you can send and edit in a few clicks. This allows you to share valuable requests with your entire team and synchronize them across devices.

Fuzzy search was also added so you can now find routes and presets more easily.

## v1.0.0

`v1.0.0` was what got everything started with Neoroute. We started maintenance of this page since `v2.0.0` since that's the first time we shipped really major breaking changes and features throughout the entire framework.

Admittedly, this version was still pretty fragile looking at it from the future, but we should've polished most of these rough edges away with `v2.0.0`.

## Other changelogs

If you are interested in changelogs before this version, please refer to our `CHANGELOG.md` files. They are maintained automatically in every folder of the [Neoroute repository](https://github.com/Liphium/neoroute) automatically. Sometimes there are weird messages in there, just ignore those. Mistakes sometimes happen.
