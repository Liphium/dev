---
title: "Using SeaweedFS S3-compatible storage"
description: "A guide on how to set up Magic so it automatically starts a SeaweedFS container and creates any buckets you want."
---

Using [SeaweedFS](https://seaweedfs.com/) with Magic is really simple. Magic handles the lifecycle of the SeaweedFS container so you can focus on your application logic.

We also have an [official example](https://github.com/Liphium/magic/tree/main/examples/file-sharing) you can check out to learn more about using the driver.

## Usage

**1.** Import the `seaweedfs` package from Magic that provides the driver using the following command:

```sh
go get -u github.com/Liphium/magic/pkg/services/seaweedfs@latest
```

**2.** You can now use the driver in your code like this (use the latest version, the `latest` tag is not supported due to new major versions of SeaweedFS potentially causing problems with the container):

```go
driver := seaweedfs.NewDriver("chrislusf/seaweedfs:4.41") // Supports SeaweedFS 4.41 and above
```

If you want to now **register the driver**, it is just the following code in your `PlanDeployment` function:

```go
ctx.Register(driver)
```

[Learn more here](/magic/documentation/configuring-magic) if you don't know what that is yet.

## Creating buckets

The most important part about S3-compatible storage is of course to create buckets. You can do that the following way:

```go
driver.NewBucket("name")
```

You can create as many as your heart desires, but too many might take Magic some time to create.

## Environment values

As with every driver in Magic, the SeaweedFS driver provides environment variables you can use to connect to the instance (`ctx` is your `mconfig.Context`):

- `driver.Host(ctx)`: The hostname of the database (returns `127.0.0.1`).
- `driver.Port(ctx)`: The port of the SeaweedFS container on your local system.
- `driver.AccessKey()`: The access key / key id for the S3 API (always `"admin"`).
- `driver.SecretKey()`: The secret key for the S3 API (always `"secret"`).

While some values might seem predictable, it's still **best practice** to use these methods instead of hardcoding values, as the underlying networking or defaults might change in future versions of Magic.

## Instructions

The SeaweedFS driver supports Magic's [instruction system](/magic/documentation/custom-drivers#instructions) to clear all files. Only `mconfig.InstructionClearFiles` is supported.
