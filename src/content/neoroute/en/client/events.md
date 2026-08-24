---
title: "Receiving events from Neoroute"
description: "How to receive events from Neoroute servers using any of the Neoroute client SDKs."
---

```ts prefix="sdk"
const event = await client.waitForEvent("example-event");
console.log(event.payload);
```

```go prefix="sdk"
result := client.WaitForEvent("example-event")
fmt.Println(result.Payload)
```

Some text and here are the install guidelines:

```sh prefix="sdk" name="TypeScript SDK" key="ts"
const value: number = 1;
```

```sh prefix="sdk" name="Go" key="go"
value := 1
```
