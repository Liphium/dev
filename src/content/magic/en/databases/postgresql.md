---
title: "Using a PostgreSQL Database"
description: "A guide on how to set up Magic so it automatically starts a PostgreSQL container on startup and how to create databases within that container."
---

Using a [PostgreSQL](https://www.postgresql.org/) with Magic is really simple, but there are still a few things to keep in mind. There are currently two PostgreSQL drivers available that each support different versions due to changes that happened in PostgreSQL 18:

- **Postgres**: The normal driver that currently supports PostgreSQL 18.
- **Postgres Legacy (deprecated)**: Supports PostgreSQL 14-17. It will still be kept around until PostgreSQL 20 comes out.

This documentation focuses on the newer driver as that one will be actively maintained by us while the old one only receives bug fixes. However, all of the things shown here should work similarly for the legacy driver, in case you need it.
