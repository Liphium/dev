---
title: "Integrating Magic into your app"
description: "How you might want to integrate Magic into your app: The process of doing it and what you need to modify."
---

**This article is not complete yet, please don't follow it until this warning is gone.**

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

**2.** Create a new folder for a package (we'll go with `starter`) that will contain your current `main` function (the function that's currently the entrypoint to your program).
