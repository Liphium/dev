---
title: "Error handling"
description: "How your errors flow through Neoroute, and how to handle them."
---

While error handling in Neoroute is generally simple, this page gives you a more in-depth look into what kinds of errors you can get and where they are handled.

## Where errors are handled

Errors from anywhere in Neoroute are generally handled in one central place: In the `Router` object where you specified the `ErrorHandler`.

That `ErrorHandler` converts any error that happens to a `string` message that can be sent to the user.

### Errors that are forwarded to it

- **Any connection errors:** In case anything goes wrong before the Handshake, any errors like a missing upgrade for WebSocket, are forwarded to the `ErrorHandler`. The message will be sent along with the response to the client.
- **Errors in any routes:** Route errors (that are not created with `neoroute.NewError`) are passed to the function to get the text for the error message.
- Any other types of errors may also be forwarded to it.

### Default value

The default `ErrorHandler` always returns `"Something went wrong"` and logs the error to the console using Neoroute's default logger. Learn how to change it below.

## Setting the logger

Neoroute sometimes also logs things into your console. For this, we use `slog.Logger` from the standard library as it is pretty extensible and basically a standard.

You can set the logger Neoroute uses like this:

```go
neoroute.SetLogger(/* your logger */)
```

You can use this to format Neoroute's logs a [little colorful](https://github.com/mattn/go-colorable) or make them appear in JSON.
