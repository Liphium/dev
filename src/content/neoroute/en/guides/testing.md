---
title: "Testing Neoroute servers"
description: "How to test Neoroute routes, create fake sessions and more."
---

We all hate it, we all need to do it: Testing the slop we actually wrote. Neoroute luckily comes with a lot of helpers, including lots of assertion functions, built right into the library.

## Testing routes

**Note:** To test your routes, we **recommend** you **not embed them in the router**, but instead make them **separate functions**. We do this because this way you can keep type safety and get basically the same experience as with a simulated connection.

Let' say you have the following route:

```go
//go:generate msgp

type ExampleRequest struct {
	Password string
}

type ExampleResponse struct {
	Secret string
}

// This would be added to your router
func GetSecret(c *neoroute.ResCtx[neoroute.NoData, ExampleResponse], req ExampleRequest) error {
	if req.Password != "secret_password" {
		return neoroute.NewError("incorrect password")
	}
	return c.Respond(ExampleResponse{Secret: "Apples are red."})
}
```

This is how you write a test to make sure your secret isn't exposed to the wrong people:

```go
func TestGetSecret(t *testing.T) {
	t.Run("incorrect secret returns error", func(t *testing.T) {
		session := neoroute.NewTestingSession(neoroute.NoData{}, "session1")

		// The string there (currently get_secret) is the route name
		err := GetSecret(session.NewTestingResCtx[ExampleResponse]("get_secret"), ExampleRequest{
			Password: "invalid",
		})

		neoroute.AssertUserError(t, err, "incorrect password")
	})

	t.Run("returns secret for correct password", func(t *testing.T) {
		session := neoroute.NewTestingSession(neoroute.NoData{}, "session1")

		// The string there (currently get_secret) is the route name
		err := GetSecret(session.NewTestingResCtx[ExampleResponse]("get_secret"), ExampleRequest{
			Password: "secret_password",
		})

		neoroute.AssertResponse(t, err, ExampleResponse{
			Secret: "Apples are red.",
		})
	})
}
```

You should of course test more thoroughly in actual applications, but this shows how it can be done.

### Advanded

Here are some more advanced use cases:

```go name="Run after functions" key="after"
ctx := session.NewTestingResCtx[ExampleResponse]("get_secret")
err := GetSecret(ctx, ExampleRequest{
	Password: "secret_password",
})

// Like this you can run any functions that were registered with ctx.RunAfter
neoroute.EvaluateCtxTesting(ctx)
```

```go name="Advanced asserts" key="assert"
// Neoroute's assertions are built on gocmp, import it for advanced stuff
import "github.com/google/go-cmp/cmp/cmpopts"

ctx := session.NewTestingResCtx[ExampleResponse]("get_secret")
err := GetSecret(ctx, ExampleRequest{
	Password: "secret_password",
})

// Here this doesn't make sense, but you can use all kinds of things from cmpopts.
// Here is a demo of ignoring Secret for comparison:
neoroute.AssertResponse(t, err, ExampleResponse{
	Secret: "Apples are red.",
}, cmpopts.IgnoreFields(ExampleResponse{}, "Secret"))
```

## Testing event sending

**Note:** For testing your events, the `AdapterRegistry` through which the events are sent **needs to be accessible** in the test.

**1.** Create a new testing adapter and session:

```go
session := neoroute.NewTestingSession(neoroute.NoData{}, "connection")

// Add any event registries you want to receive from on this adapter.
// This function can take multiple.
adapter := neoroute.NewTestingAdapter(eventRegistry)
```

**2.** Add them to your `AdapterRegistry`:

```go
adapterRegistry.Register(session.Id(), adapter)
```

Any events will now be caught inside of the testing adapter. You can now use the following assertion functions with the adapter to see what events arrived:

```go
// First make sure the expected number of events arrived:
events := neoroute.AssertEvents(t, adapter, 1 /* number of events */)

// Then make sure the event you expect arrived
neoroute.AssertEvent(t, events, 0 /* index */, SomeEvent{ /* ... */ })

// Optional: You can also pass any cmp.Option to this for like this:
neoroute.AssertEvent(t, events, 0, SomeEvent{ /* ... */ },
	cmpopts.IgnoreFields(SomeEvent{}, "SomeField"))
```

## Testing with a real connection

This is **not really recommended**, but in a case where you really want to test with a real connection without any of our helper functions. You could use [neogen](/neoroute/utility/neogen) with our [Go SDK](/neoroute/sdk/go) to generate function definitions that you can use in your tests.

This is a lot more painful then what's described above though, so please just use the official testing functions and don't make yourself suffer more than you need to.
