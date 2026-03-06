---
title: "Magic concepts explained"
description: "A few of Magic's internal wording for systems, explained. Here you'll find what we mean by profiles and more."
---

Here you'll find a few common words often used in this documentation, explained in a hopefully understandable manner. Feel free to create an issue if anything is unclear.

## Profiles

Magic has [profiles](/magic/getting-started/frequently-asked#can-i-run-multiple-instances-of-my-app-with-magic) that allow you to create multiple instances of your app (that can run in parallel with different database containers, etc.).

This is particularly useful when you need to test with multiple instances of your app.

You can start your app in a profile using the `-p` or `--profile` flag after `go run .`. The default profile is named, well, `default`. So if you do `go run . -p default` it's like you didn't specify the flag at all.

The `test` profile is reserved for the [testing runtime](/magic/documentation/integration-tests). Please don't use it for actually running your app as running tests after will delete all of the containers.

## Service drivers

All of the databases and other services you start using Magic are started by a **service driver**. It's what we call the thing managing the container and executing instructions on it.

Under the hood, this is just a common interface that all of the service drivers shipping with Magic implement, so you could also create your own one.
