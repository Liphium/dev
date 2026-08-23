---
title: "Custom drivers"
description: "Learn how to build custom drivers for Magic to support any kind of database or service."
---

Creating a custom driver for Magic is not actually as hard as you might think. We provide a lot of smart utilities to make it especially easy for you to integrate your favorite database, key-value store or just some random image you found on Docker Hub.

## The general interface

Before we get into anything, here is the actual interface a `mconfig.ServiceDriver` needs to furfill:

```go
type ServiceDriver interface {
	// This is a unique ID your driver needs to have, this will also be used
	// later to load / save it.
	GetUniqueId() string

	// Should return the amount of ports required to start the container.
	GetRequiredPortAmount() int

	// Should return the image. Magic will pull it automatically.
	GetImage() string

	// Create a new container for this type of service.
	CreateContainer(ctx context.Context, c *client.Client, a ContainerAllocation) (string, error)

	// This method should check if the container with the id is healthy
	// for this service.
	//
	// Called periodically by Magic during initialization.
	IsHealthy(ctx context.Context, c *client.Client, container ContainerInformation) (bool, error)

	// Called to initialize the container when it is healthy.
	//
	// You could for example create databases in here / do something else
	// to initialize the service.
	Initialize(ctx context.Context, c *client.Client, container ContainerInformation) error

	// An instruction sent down from Magic to potentially do something with
	// the container (not every service has to handle every instruction).
	//
	// When implementing, please look into the instructions you can support.
	HandleInstruction(ctx context.Context, c *client.Client, container ContainerInformation, instruction Instruction) error

	// For creating a new instance of the service driver with the loaded data
	Load(data string) (ServiceDriver, error)

	// Save the current data of the service driver into string form (will
	// be persisted in the plan)
	Save() (string, error)
}
```

You might have heard a few words you are not yet familiar yet, let's explain them.

- **Plan**: A JSON representation Magic creates of the entire environment your app is ran in (environment variables, etc.)
  - This is used for scripts to be able to run in the exact same environment as your app
- **Instruction**: Standardized actions across services (read more [below](#instructions))

## General implementation guide

To see how to best implement a driver, we recommend you look at one of our drivers in the actual Magic repository. For example, the [PostgreSQL driver](https://github.com/Liphium/magic/tree/main/pkg/databases/postgres).

This guide is just here to give you a general list of things to remember when you are making a driver and to introduce all of the concepts and utilities we provide to make your life a little easier.

When you think you are done implementing your driver, please go through the [check list](#check-list) below at least once to make sure everything works as it should.

### Creating the container

For container creation specifically, we provide a solid utility that should be able to cover basically all of your needs:

```go
// Returns the exact stuff expected by `ServiceDriver.CreateContainer`, helps you
// implement the function more easily.
mservices.CreateContainer(ctx, pgLog, c, a, mservices.ManagedContainerOptions{
	Image: "your-image:version",
	Env: []string{
		"SOME_VARIABLE=test",
	},
	// Magic will automatically search for ports that are open on your main system.
	//
	// These ports are the ones you want to expose from the container to the host system.
	//
	// The length of the ports list needs to be equivalent to the return value of
	// GetRequiredPortAmount() as all of the ports will automatically be mapped by this
	// function.
	Ports: []string{
		"1234/tcp",
	},
	// Volumes here are specifically used to persist data from one start to the next.
	Volumes: []mservices.ContainerVolume{
		{
			// A suffix appended to the actual name of the volume.
			//
			// The actual name will be a lot longer since multiple containers may exist.
			NameSuffix: "config",

			// Target is the path in the container the volume should be mounted to.
			Target: "/config"
		},
	},
})
```

### Running commands in the container

A common use case is to run commands inside of the container. Especially for health checks or potentially also the initialization, this can be really handy.

```go
// container is the `ContainerInformation` passed to IsHealthy or Initialize
resp, err := mservices.ExecuteCommand(ctx, c, container.ID, "echo Hello, world!")
if err != nil {
	return false, fmt.Errorf("couldn't execute command for readiness of container: %s", err)
}
```

### Various other utilities

Here are a few more functions that you might find useful:

- `mrunner.GetImageMajorVersion` might help you check if the image a user gave you is actually supported by your driver

## Check list

Here is a little check list to make sure your driver is actually doing everything it is supposed to (also in case you may be facing some weird issues):

- Your driver is registered using `mconfig.RegisterDriver` (this is required for the correct deserialization of a plan and therefore your driver's instructions being callable in scripts), the best way to do this is just:

```go
func init() {
	mconfig.RegisterDriver(&YourDriver{})
}
```

- Your driver properly uses the port that is given to it by Magic (a random one is assigned all the time, available through `ContainerInformation.Ports` (index matches the one in the `mservices.CreateContainer` ports option, in case you're using that))
- Any **instructions** you might want to support are implemented (read below)
  - Full list [here](https://github.com/Liphium/magic/tree/main/mconfig/services.go) (at the start of the file)

## Instructions

Instructions are Magic's standard to clearing state or performing other basic operations on all containers at once. This is mainly used for executing large scale clears during testing at the moment. Through this system, we can make sure you can easily clear all your state at once so users of Magic won't have to remember different functions by driver.

Below is a table of all instructions that currently exist. Depending on the kind of service you're creating, it may make sense to implement them / simply ignore them.

| Instruction                    | Description                                                               |
| ------------------------------ | ------------------------------------------------------------------------- |
| mconfig.InstructionDropTables  | Should drop all tables in a database                                      |
| mconfig.InstructionClearTables | Should clear all tables in the database (but not delete the actual table) |

You can also contribute new instructions if you feel like anything is missing, please [create an issue](https://github.com/Liphium/magic/issues) first in case you want to.

## Not enough?

While this guide can't cover everything, I hope it's enough to understand the basics of driver development for Magic. If you have any questions or problems with drivers or anything else, feel free to open an issue on GitHub or pinging me (Unbreathable) on our Discord (link on [main site](https://liphium.com)).
