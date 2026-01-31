---
title: "Integrating Magic into your app"
description: "How you might want to integrate Magic into your app: The process of doing it and what you need to modify."
---

When using Magic, it's important that all the parts of Magic you're using are in proper locations for you to easily integrate features like [Testing](/magic/documentation/integration-tests).

This is a comprehensive guide on where to put your things when you want to properly use Magic in real projects.

## What we'll change

Before actually getting into the installation, here's a quick overview over what we are going to do to your project. If you already know this much about Magic, feel free to go straight down to the installation section.

**1.** We'll move your `main` function into a different file to make it accessible from a new `main` function we're gonna create in the main package.

We do this so Magic can start your app from anywhere within itself. The main function is needed as a parameter for `magic.Config`, just so we can run your app after spinning up all the containers and services your app needs.

**2.** We'll create a separate function that generates a `magic.Config` that can run your app (no, it's not as complicated as it sounds).

When testing your app with Magic, our wrapper for the Go test runtime needs your config to be able to start your service in the background.

## Installation

Before actually getting into adding Magic to your project, make sure you have [Docker](https://docs.docker.com/engine/install/) and [Go](https://go.dev/dl) installed.

**1.** In your project folder, use the following command to add Magic to your `go.mod` file:

```sh
go get -u github.com/Liphium/magic/v2@latest
```

**2.** Create a new folder for a package (we'll go with `starter`) that will contain your current `main` function (the function that's currently the entrypoint to your program), or create a new function that will be your `main` function in there. You could do it like this:

```go
package starter

// ...

// This function needs to be public (more context below)
func Start() {
	// Your code here...
}

// ...
```

**3.** In the folder where you created the file containing your new entrypoint function, create a file named `config.go` (the name doesn't matter).

**4.** In this file, create a function for building the `magic.Config` for running your project like this:

```go
package starter

// ...

func BuildMagicConfig() magic.Config {
	return magic.Config{
		AppName: "your-app-name",

		// This is the function Magic will call when starting your app.
		// Make this the main function you created earlier here.
		StartFunction: start,
		// ...
	}
}

// ...

```

For filling the config with actual content, we'll soon have another guide. For now, you can look at the struct definition and the comments in the code. We've added a lot of comments and hope they help for now.

**5.** For your actual program entrypoint that Magic will use, let's create a new `main_magic.go` file in your root directory:

Just as a quick explainer, we're using [Go build tags](https://pkg.go.dev/cmd/go#hdr-Build_constraints) here to make sure we can build the app normally without it spinning up with Magic. How to actually do this is covered later.

```go
//go:build !release

package main

import (
	"your-project-name/starter"

	"github.com/Liphium/magic/v2"
)

func main() {
	magic.Start(starter.BuildMagicConfig())
}
```

**6.** For the actual entrypoint of your program, let's create a new `main.go` file in your project root:

```go
//go:build release

package main

import "your-project-name/starter"

func main() {
	starter.Start()
}
```

**7.** You're done. This is how you set up Magic properly. Now let's learn how to use this setup.

## Using this setup

With this setup, as explained earlier, you're using Go build tags to essentially be able to toggle between running your app with Magic and without it. Let's learn how this works.

### Starting your app

If you remember your `main_magic.go` file, you'll see the following at the top of it:

```go
//go:build !release
```

This means that when the build tag `release` is not activated, we want this file to be included.

This means you can just run your app like normal and Magic will run before your actual app starts:

```sh
go run .
```

If you want to run your app normally without Magic, you can just enable the `release` tag:

```sh
go run -tags release .
```

### How to build your app

Building actually works just like running the binary with the `release` tag. You can simply do the following:

```sh
go build -tags release . # Put any other arguments here #
```

**Note: When you build your app without the `release` tag, your app will run with Magic just like when doing `go run .`!**

### How to share a development version of your app

The fun thing when you built your app with Magic is that you can now also send someone a version of your app that can run anywhere where anything compatible with the Docker socket is installed. **DO NOT DO THIS IN PRODUCTION ENVIRONMENTS AS MAGIC USES EASY TO GUESS CREDENTIALS SINCE IT IS A DEVELOPMENT TOOL!**

To prevent you from ruining their development environment with an unfinished version however, here are a few things to keep in mind before you send the file to them:

- Change the `AppName` property in your `magic.Config` to something different (the safest being a random string). This prevents Docker containers with similar names potentially being overwritten (Magic always names containers like this: `mgc-%appName%-%profile%-%serviceName%`)
- Magic will create a `.magic` folder like normal. Tell them to clean it up after.
- Magic does not [stop containers after your app has finished](/magic/getting-started/frequently-asked#why-does-magic-not-stop-containers-after-shutdown).

Have fun with Magic, let's become great wizards together.
