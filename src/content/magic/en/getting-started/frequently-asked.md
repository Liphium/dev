---
title: "Frequently asked questions"
description: "An answer to all the questions we frequently get about Magic. If you have some kind of question, the answer might be here."
---

All of your basic questions about Magic should be answered here. If they aren't, let us know and we'll put the answer to your question here, too! A good way to reach out is by creating an issue [here](https://github.com/Liphium/magic/issues).

## Can I run multiple instances of my app with Magic?

Yes, in fact, that's **one of the reasons we created Magic in the first place**.

The feature you can use for it is called **profiles**, you can learn more about it [here](/magic/getting-started/concepts#profiles).

## Is there a recommended project structure?

Yes, of course! While there isn't any documentation on how to set it up completely from scratch, _yet_, we do want to add it eventually.

For now, you can take a look at our [real project example](https://github.com/Liphium/magic/tree/main/examples/real-project) to get a basic idea of our recommended architecture. All of the files contain comments and explanations + the README has a nice explanation, too.

Another way to learn more about our use of Magic is by literally just looking into our projects. One of the easiest to understand ones is the recently released [Hytale Matchmaking](https://github.com/Liphium/hytale-matchmaking).

## Can Magic run tests in parallel?

Unfortunately, running tests in parallel is currently **not supported**. While it is theoretically pretty easy to implement, we at Liphium haven't had any issues requiring this kind of functionality.

However, Magic will detect when tests are trying to be run in parallel and waits until the other test runner has stopped.

If you want to add it, feel free to discuss how you may do so in our [issue tracker](https://github.com/Liphium/magic/issues).

## Why does Magic not stop containers after shutdown?

While Magic does properly stop containers when you use `go test .`, we don't do it when you simply run your app. This is our reasoning:

- Scripts may want to use the services or databases even after the app has stopped running
- Shutdown hooks are unstable and don't work properly a lot of the time (at least from my (Unbreathable's) testing)
  - When your app panics, they often don't get executed
  - Getting a cross-platform solution to work is rather tedious
- The better solution (in my eyes) is outlined below

Because of this, in the future, we'll try to provide you with a command that can stop the containers.
