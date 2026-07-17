---
title: "Using a Redis Database"
description: "A guide on how to set up Magic so it automatically starts a Redis container on startup."
---

Using [Redis](https://redis.io/) with Magic is really simple. And yeah, I know it's not really what you might call a databases. Anyway, Magic handles the lifecycle of the Redis container so you can focus on your application logic.

## Usage

**1.** Import the `redis` package from Magic that provides the driver using the following command:

```sh
go get -u github.com/Liphium/magic/pkg/databases/redis@latest
```

**2.** You can now use the driver in your code like this:

```go
driver := redis.NewDriver("redis:8") // Supports Redis 7 and 8
```

If you want to now **register the driver**, it is just the following code in your `PlanDeployment` function:

```go
ctx.Register(driver)
```

[Learn more here](/magic/documentation/configuring-magic) if you don't know what that is yet.

## Environment values

As with every driver in Magic, the Redis driver provides environment variables you can use to connect to the instance (`ctx` is your `mconfig.Context`):

- `driver.Host(ctx)`: The hostname of the database (usually `127.0.0.1`).
- `driver.Port(ctx)`: The port of the Redis container on your local system.

While some values might seem predictable, it's still **best practice** to use these methods instead of hardcoding values, as the underlying networking or defaults might change in future versions of Magic.
