---
title: "Using a SurrealDB Database"
description: "A guide on how to set up Magic so it automatically starts a SurrealDB container on startup and how to create namespaces and databases within it."
---

Using [SurrealDB](https://surrealdb.com/) with Magic is really simple. Magic handles the lifecycle of the SurrealDB container so you can focus on your application logic.

The SurrealDB driver currently only supports **SurrealDB v3**.

## Usage

**1.** Import the `surrealdb` package from Magic that provides the driver using the following command:

```sh
go get -u github.com/Liphium/magic/pkg/databases/surrealdb@latest
```

**2.** You can now use the driver in your code like this:

```go
driver := surrealdb.NewDriver("surrealdb/surrealdb:v3") // Use any v3 image

// Create a new database like this:
driver.NewDatabase("liphium", "main")
```

Keep in mind that SurrealDB always scopes databases by **namespaces**, which is why `NewDatabase` takes two arguments: the first one is the namespace and the second one is the database itself.

This driver also supports a builder pattern, meaning you can do stuff like this:

```go
driver := surrealdb.NewDriver("surrealdb/surrealdb:v3").
	NewDatabase("liphium", "main").
	NewDatabase("liphium", "chat")
```

If you want to now **register the driver**, it is just the following code in your `PlanDeployment` function:

```go
ctx.Register(driver)
```

[Learn more here](/magic/documentation/configuring-magic) if you don't know what that is yet.

For environment values this driver provides, read more below.

## Environment values

As with every driver in Magic, the SurrealDB driver also provides some environment variables you may want to use to connect to a database it created (`ctx` is your `mconfig.Context`):

- `driver.Host(ctx)`: The hostname of the database (`127.0.0.1`, just use it anyway because it might change in the future).
- `driver.Port(ctx)`: The port of the database container on your local system.
- `driver.Username()`: The username for the database server (is always "root").
- `driver.Password()`: The password for the database server (is always "root").

While some of the values might seem redundant as they always return the same, it's still **best practice** to use them instead of defining them yourself as the defaults might change in the future. We don't have any plans to do this kind of thing, but it _could_ happen.

If you're wondering what the namespace and database name will be, that's just the things you passed into `driver.NewDatabase(/* into here */)`.

To connect to a database managed by this driver (for example with the [SurrealDB Go SDK](https://github.com/surrealdb/surrealdb.go)), use a WebSocket endpoint like `ws://<host>:<port>` and sign in with the root credentials from above. Magic creates all namespaces and databases for you automatically on startup.

## Instructions

The SurrealDB driver supports Magic's [instruction system](/magic/documentation/custom-drivers#instructions) for managing table data during tests. Both clearing tables and dropping all tables are supported:

- **Clear tables**: Deletes all records from every table in all managed namespaces/databases, while keeping the table definitions (schema) intact.
- **Drop tables**: Removes all table definitions entirely, leaving nothing behind.
