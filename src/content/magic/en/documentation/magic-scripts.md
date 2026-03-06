---
title: "Magic's scripting system"
description: "How you can add scripts to your Magic config. This allows you to share tools with contributors or call functions in your codebase through the CLI."
---

When working on your project, you might want to share some tools or functions you use in tests with the rest of your team. Scripts allow you to integrate those tools directly into your codebase. No more weird bash scripts needed.

## Creating scripts

A script is literally just any old function you may have in your codebase. There are just two requirements it needs to furfill:

- Only have one struct (or none) and a `mrunner.Runner` (or none) as the parameters of the function.
- Have an `error` as the **last** returned value.

Valid functions could be:

```go
func CreateSomething(something SomeStruct) error
func SomeList() ([]string, error)
func SomeRunnerScript(runner *mrunner.Runner) error
func SomeScript([]database.Post, runner *mrunner.Runner) error
func SomeScript2(runner *mrunner.Runner, something SomeStruct) error
```

Lists of structs are not allowed.

### Requirements for the struct

Currently Magic only supports a few types for the fields in the struct, this includes:

- Any number types (`int`, `uint`, etc.)
- Strings

If you have a non-supported type in a struct, but you don't need it in the script, you can use the `magic:"ignore"` struct tag to make Magic skip it.

Additionally, you can use the struct tag `validate:"some-options"` to add validations. This uses the [validator package](https://github.com/go-playground/validator), find a list of supported validations over there.

### How your script is run

For how to run your script, read more [below](#using-scripts). This covers how your script gets executed internally.

Scripts are run separately from your main app process. You **DO NOT** have access to any internal state of your app in scripts. All we do is give you the same environment variables as your main app process, which should still prove plenty useful.

Containers will also not be started, you have to start your app for that to happen.

### Registering your script

Now that you have a function you can register as a script, you can learn how to register it over in the [config documentation](magic/documentation/configuring-magic#scripts).

## Using scripts

When you want to run a script, you can use the `--run` or `-r` flag straight after `go run .` like this:

```sh
go run . -r [script_name]
```

When you want to list all of the scripts available, you can just do:

```sh
go run . --scripts
```

This works in any codebase with Magic allowing you to easily interact with it.

### Skipping the form

When you run a script, you may be prompted with a terminal form. Since that sometimes gets annoying, you can also pass the arguments in directly just after the script name. If you have this script function:

```go
type Post struct {
	Author  string `prompt:"Author name" validate:"required"`
	Content string `prompt:"Content of the post" validate:"required,max=256"`
}

func CreatePost(post database.Post) error {
	// ...
	return nil
}
```

To fill a particular struct field, the index of the argument must match with it. Here is how you could call this script if it was named "create-post":

```sh
go run . -r create-post [author] [content]
```

Magic will still validate all of the fields or show you an error if you don't specify one of them.

## Script examples

If you now want to look at example scripts, you can find some in our real project example. There are ones [using the database and runner](https://github.com/Liphium/magic/blob/main/examples/real-project/starter/scripts_database.go) as well as ones just [calling the API](https://github.com/Liphium/magic/blob/main/examples/real-project/starter/scripts_endpoints.go).
