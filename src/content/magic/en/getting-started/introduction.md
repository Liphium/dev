---
title: "Introduction"
description: "An introduction to what Magic is, how to use it, the system and application requirements as well as why we made it in the first place."
---

**This project is still experimental and in early stages. Feel free to test it out, but expect major changes, bugs and of course also new features.**

Liphium Magic is a suite of tools for **Golang developers** to help build tests and provide a better developer experience, especially for complex web services with databases and multiple other dependent services. It helps you and your team easily jump from project to project without learning anything new.

We made it because we felt like it the barrier of making a contribution to our own projects was too high. When working on applications in a team, it's important that everyone can easily start the project and also use the same tools. When someone first joins your project, they should be able to get the app running within seconds instead of reading your deployment instructions.

That's the vision of Magic, our **all-in-one developer experience toolkit**. For testing your app, both automatically and manually (with scripts), as well as making your app runnable on your own (or any other) machine without complex setup.

## System requirements

- Desktop operating system (Windows, macOS or Linux)
- Docker (must be installed and the Go toolchain must have permissions to access the socket)
- Golang (you're not making a Go application without it)

## Application limitations

Magic only supports specific services, and while we do plan on increasing the amount of supported services, for now we only support the services listed below. If your application needs anything else, you're currently not the target audience for Magic.

### Supported databases

- PostgreSQL v18 or above

### Deprecated

- PostgreSQL v14-17

Other services may be supported in the future.

## Features

- Make your app runnable with one command on any machine that meets the System requirements
- Develop scripts that interact with your application or the database
  - Allows sharing of tools you're using for testing
- Test your application using integration tests (they can also call your scripts)
  - Test with a real database using a real connection

## Add Magic to your project

**Note:** This is just the quick version of this guide, you'll find a much more detailed version [on this page](/magic/documentation/integrating-magic).

**1.** Add Magic to your project:

```sh
go get -u github.com/Liphium/magic/v3@latest
```

**2.** Wrap your main function with `magic.Start` (please take a look at the [real project example](https://github.com/Liphium/magic/tree/main/examples/real-project) for how to really to do this, this just serves as a showcase):

```go
// ...

func main() {
	magic.Start(magic.Config{
		AppName: "magic-example",
		PlanDeployment: func(ctx *mconfig.Context) {
			// Create a new driver for PostgreSQL databases
			driver := postgres.NewDriver("postgres:18").
				// Create a PostgreSQL database for the posts service (the driver supports a builder pattern with this method)
				NewDatabase("posts")

			// Make sure to register the driver in the context
			ctx.Register(driver)

			// Allocate a new port for the service. This makes it possible to run multiple instances of this app
			// locally, without weird configuration hell. Magic will pick a port in case the preferred one is taken.
			port := ctx.ValuePort(8080)

			// Set up environment variables for the application
			ctx.WithEnvironment(mconfig.Environment{
				// Database connection environment variables
				"DB_HOST":     driver.Host(ctx),
				"DB_PORT":     driver.Port(ctx),
				"DB_USER":     driver.Username(),
				"DB_PASSWORD": driver.Password(),
				"DB_DATABASE": mconfig.ValueStatic("posts"),

				// Make the server listen on localhost using the port allocated by Magic
				"LISTEN": mconfig.ValueWithBase([]mconfig.EnvironmentValue{port}, func(s []string) string {
					return fmt.Sprintf("127.0.0.1:%s", s[0])
				}),
			})
		},
		StartFunction: Start,
	})
}

func Start() {
    // Start your application here (we have to take over your main function to be able to run code before)
}

// ...
```

**3.** You can now use `go run .` to run your app and a database will be created in a Docker container near you.

Become a great wizard! If you want to be a real great one though, I would take a look at the [real project example](https://github.com/Liphium/magic/tree/main/examples/real-project) to actually see how it's done.
