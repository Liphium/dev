---
title: "Configure Magic to your liking"
description: "How to configure Magic and deploy different services your app may need. This will specifically teach you how to set up environment variables and more."
---

This part of the documentation will specifically cover everything there is to know about `magic.Config`, the config for Magic. If you have not integrated Magic yet, [follow the setup guide first](/magic/documentation/integrating-magic).

## Basic config values

First, let's go over the simplest parts of the config.

- **AppName**: This is the name Magic is going to prefix all of the Docker containers with. Make sure it's unique by project. Collisions with other projects could cause containers to overwrite each other.
- **StartFunction**: The start function of your application. Magic needs this to start up your app after all of the containers have been started.

## Deployment planning

Now for the more difficult part: In `PlanDeployment` you need to specify all of the containers that your app is going to need for starting up successfully. This also includes **environment variables**.

While you can find documentation for the different services in the sidebar, here we'll go into some basics.

### The context

The only argument you're getting in the `PlayDeployment` function is the `mconfig.Context`. This context includes a lot of useful information you might want to use. Below it's abbreviated as `ctx`. Here are some useful functions (more is explained in the sections below as well):

- `ctx.Profile()` gives you the current [profile](/magic/getting-started/concepts#profiles).
- `ctx.ProjectDirectory()` is the directory of your project.

You could for example use `ctx.ProjectDirectory()` to create a new directory for some files that you might wanna use for testing. You could check specifically for the `test` profile to make sure it's the testing runtime.

### Environment variables

Magic handles environment variables not as strings, but as functions. We call these functions before your app starts to "generate the environment variables".

You specify environment variables in the `PlayDeployment` function by using `ctx.WithEnvironment()`. If you want to load environment variables from a file, you can also use `ctx.LoadSecretsToEnvironment("path/to/file")`.

Additionally, a lot of [service drivers](/magic/getting-started/concepts#service-drivers) have functions that let you retrieve some values that you can pass directly into `ctx.WithEnvironment()`.

Because looking at code is probably easier, below is a little cheatsheet:

```go
func PlanDeployment(ctx *mconfig.Context) {
	port := mconfig.ValueStatic("6000") // For later

	ctx.WithEnvironment(mconfig.Environment{

		// Create a static value
		"HELLO": mconfig.ValueStatic("WORLD"),

		// Create a value from a function
		"FROM_FUNCTION": mconfig.ValueFunction(func() string {
			return "HELLO_FROM_FUNCTION"
		}),

		// Additionally, you can create environment variables based on others (index in []mconfig.EnvironmentValue = index in []string)
		"LISTEN": mconfig.ValueWithBase([]mconfig.EnvironmentValue{port}, func(args []string) string {
			return fmt.Sprintf("127.0.0.1:%s", args[0])
		})
	})
}
```

### Allocating ports

Using environment values you can actually also allocate ports for your app to use. This is how Magic can run multiple instances of your app without them colliding on the same port:

```go
func PlanDeployment(ctx *mconfig.Context) {
	port := mconfig.ValuePort(8080) // 8080 will be used when the port is open

	ctx.WithEnvironment(mconfig.Environment{

		// You can just set the port
		"PORT": port,

		// You can use your port to generate other values
		"LISTEN": mconfig.ValueWithBase([]mconfig.EnvironmentValue{port}, func(args []string) string {
			return fmt.Sprintf("127.0.0.1:%s", args[0])
		})
	})
}
```

### Adding services / databases

Now, for the most interesting bit, you might wanna actually start services for your app to use: This is the main reason we made Magic.

It's actually also pretty simple, since all you have to do is use `ctx.Register(driver)` with a [service driver](/magic/getting-started/concepts#service-drivers) like this:

```go
func PlanDeployment(ctx *mconfig.Context) {
	// Example with the PostgreSQL driver
	driver := postgres.NewDriver("postgres:18").NewDatabase("posts")

	// Make sure to register the driver in the context
	ctx.Register(driver)
}
```

**Hint:** `ctx.Register(driver)` actually gives you the driver right back, meaning you can also use it like this:

```go
func PlanDeployment(ctx *mconfig.Context) {
	// Example with the PostgreSQL driver
	driver := ctx.Register(postgres.NewDriver("postgres:18").NewDatabase("posts"))
}
```

## Scripts

While scripts have [their own documentation](/magic/documentation/magic-scripts) where you can more about how to actually write them, here is how you actually register them in your config.

The `Scripts` value in your config accepts a `[]scripting.Script` which you can fill by using `scripting.CreateScript(...)`. Here is a more concrete code example:

```go
scripting.CreateScript("your-script", "Your description.", YourFunction)
```

I feel like if you're using Magic you should know how to fill an array, so we'll skip that part.

## Example config

If you now want to look at an example config, you can find one that has basically everything you're ever going to have in the [real project example](https://github.com/Liphium/magic/blob/main/examples/real-project/starter/config.go).
