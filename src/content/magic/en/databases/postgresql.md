---
title: "Using a PostgreSQL Database"
description: "A guide on how to set up Magic so it automatically starts a PostgreSQL container on startup and how to create databases within that container."
---

Using [PostgreSQL](https://www.postgresql.org/) with Magic is really simple, but there are still a few things to keep in mind. There are currently two PostgreSQL drivers available that each support different versions due to changes that happened in PostgreSQL 18:

- **Postgres**: The normal driver that currently supports PostgreSQL 18.
- **Postgres Legacy (deprecated)**: Supports PostgreSQL 14-17. It will still be kept around until PostgreSQL 20 comes out.

This documentation focuses on the newer driver as that one will be actively maintained by us while the old one only receives bug fixes. However, all of the things shown here should work similarly for the legacy driver, in case you need it.

## Usage

**1.** Import the `postgres` package from Magic that provides the driver using the following command:

```sh
go get -u github.com/Liphium/magic/v3/pkg/databases/postgres@latest
```

**2.** You can now use the driver in your code like this:

```go
driver := postgres.NewDriver("postgres:18") // Make sure you use a version that is supported

// Create a new database like this:
driver.NewDatabase("test")
```

This driver also supports a builder pattern, meaning you can do stuff like this:

```go
driver := postgres.NewDriver("postgres:18").
	NewDatabase("test").
	NewDatabase("test2")
```

For environment values this driver provides, read more below. If you want to now **register the driver** and don't know how to do that yet, [learn more here](/magic/documentation/configuring-magic).

## Environment values

As with every driver in Magic, the PostgreSQL driver also provides some environment variables you may want to use to connect to a database it created (`ctx` is your `mconfig.Context`):

- `driver.Host(ctx)`: The hostname of the database (`127.0.0.1`, just use it anyway because it might change in the future).
- `driver.Port(ctx)`: The port of the database container on your local system.
- `driver.Username()`: The username for the database server (is always "postgres").
- `driver.Password()`: The password for the database server (is always "postgres").

While some of the values might seem redundant as they always return the same, it's still **best practice** to use them instead of defining them yourself as the defaults might change in the future. We don't have any plans to do this kind of thing, but it _could_ happen.

If you're wondering what the database name will be, that's just the thing you passed into `driver.NewDatabase(/* into here */)`.
