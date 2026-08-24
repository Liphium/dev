---
title: "Receiving events from Neoroute"
description: "How to receive events from Neoroute servers using any of the Neoroute client SDKs."
---

```ts
const event = await client.waitForEvent("example-event");
console.log(event.payload);
```

```go
result := client.WaitForEvent("example-event")
fmt.Println(result.Payload)
```
