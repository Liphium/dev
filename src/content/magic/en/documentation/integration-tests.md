---
title: "Integration testing"
description: "How to test with Magic: How you can create integration tests, interact with the runtime and what might be useful."
---

The idea of integration testing with Magic is essentially the following:

- Magic will automatically start all Docker containers and services needed for your application.
- Magic will start your actual app in a separate goroutine in the same process as the testing runtime.
- All of your tests are executed by the Go testing runtime (like normal, with the same environment variables set as your application).

## Getting started

Before you can use Magic for integration testing, please make sure you have [set up Magic properly](/magic/documentation/integrating-magic).

From here on, it assumed that you know how to test projects in Go. If not, you may wanna research how to do that first.

Next, there is literally only one step: Go to any of your `[something]_test.go` files and integrate Magic like this:

```go
func TestMain(m *testing.M) {
	magic.PrepareTesting(m, /* the build function for your Magic config */)
}
```

If you want some inspiration and see real tests written with Magic, you can take a look at the ones in our [real project example](https://github.com/Liphium/magic/blob/main/examples/real-project/starter/start_test.go).

What you can now do:

- Create tests like normal, your app is running in the same process in a different goroutine.
- All of the environment variables are shared with your app, meaning `os.Getenv` will return the same in your app as in your tests (you can use this to get the path to your API if you're creating a web service for example).
- You can call scripts you have created to simplify some of your tests (as any other function).
  - If your scripts need the **Magic runner**, read below.

## The runtime

You may want to know more about how Magic runs your tests internally, since we of course also spin up all of your services, like when you do `go run .` normally.

### How it works under the hood

Magic has [profiles](/magic/getting-started/frequently-asked#can-i-run-multiple-instances-of-my-app-with-magic) that allow you to create multiple instances of your app (that can run in parallel with different database containers, etc.) and the same is done when you run your tests. For this, we use the `test` profile. So what happens before your tests run is essentially just `go run . --profile test` in a different goroutine. Your tests and your app are sharing the same process and same memory (in a way).

**Hint:** You can use `ctx.Profile()` to check which profile is currently being used in your `PlanDeployment` function in the config. This allows you to also set different environment variables specifically for testing by simple checking `ctx.Profile() == "test"`.

The only exception is that in this test profile all of your containers are **deleted** before your tests run, we do this to give you a predictable testing environment. **This is not done before every test, just before ALL of your tests within the same module run**.

### What this means

- You're essentially getting a fresh environment for every module where you use `magic.PrepareTesting`.
- Magic's test runner will make sure none of your tests write to the same containers at the same time using lock files.
- You can interact with your app's server or database however you want.
- Your app sees the same environment variables as you do (just like normal `go test`).
- Your app sees the same global state as you do (just like normal `go test`).

## Getting the Magic runner

For your tests, as for anything else in Magic, it's run by `mrunner.Runner`. This object provides you with a lot of useful functions and if you want to use any of its functionality in tests, you can get it like this:

```go
magic.GetTestRunner()
```

### Convenient methods

One of the things you may wanna do with it is, for example, drop all of the tables in your test database. For this reason, the runner provides you with some convenient methods:

- `runner.ClearTables()` will clear all tables in all databases. It just clears the content of the tables, they won't be dropped.
- `runner.DropTables()` will, as the name suggests, drop all tables in all databases.

If there is still anything you don't understand about Magic's testing runtime, let us know and we'll expand this section and, of course, hopefully explain it to you in a better way. If there is some functionality you are missing, you can always create feature requests in our repository.
