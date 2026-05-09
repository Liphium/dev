---
title: "Game entrypoint & scene manager"
description: "How the game entrypoint & scene manager works in Scaff and how to work with scenes."
---

Here you'll learn about the main `Game` struct that contains all parts of scene management and is pretty much gonna be the entrypoint to every Scaff project. When using Scaff, your `main` function should probably look a little bit like this:

```go
// Configure various Ebiten things (check their documentation for that)
ebiten.SetWindowSize(900, 600)
ebiten.SetWindowResizingMode(ebiten.WindowResizingModeEnabled)

// Create a new scaff game and load a sample scene
g := scaff.NewGame()
g.Goto(&SomeScene{})
if err := ebiten.RunGame(g); err != nil {
	log.Fatal(err)
}
```

This `Game` object contains useful methods and wraps the entire Ebiten Game interface to serve Scenes.

In Scaff, scenes can be stacked on top of each other for things like menus and more. Here's how you manage them (these are all methods the `Game` struct provides):

- **Goto**: Remove all scenes and go to a new scene (will be the new, one and only scene in the scene stack).
- **Push**: Let's you push something to the top of the current scene stack.
- **Pop**: Remove the current top scene from the scene stack.
- **PopUntil**: Pop until a certain scene in the scene stack (that scene will still be there).

### Ordering

Let's say we do the following on Pop operations on the game for scenes with the following ids: test1, test2, test3. Here's what the order should be for the different types of functions:

- **Load**: test1, test2, test3 (to allow the base to still load stuff in case the other layers on top are somehow waiting for it, just to match expectations really)
- **Update**: test3, test2, test1 (to allow input handling in the top layer first)
- **Draw**: test1, test2, test3 (to allow layering, if Focused is false, you should not react to any mouse position or anything)

### Transitions

If a scene is pushed while a transition is going on, it is inserted without a transition to prevent transition queueing and discourage sudden scene changes since they should be handled in a better way, and not by the scene manager.

There are no transition presets and this stuff should be handled differently for every scene. This makes sure you make some really amazing transitions without a lot of work. In the scene context, that you get for both the `Update` and `Draw` functions, there is a `cmath.Timeframe` object that you can use to do linear interpolation between stuff. For an out transition, the remaining time is reversed so you can easily reuse code. Just do everything with the linear interpolation functions directly available on the `cmath.Timeframe` and you'll not have any problems with transitions.

To configure the transitions themselves, implement the `Transition(in bool)` function. Through the `TransitionProperties` it returns you can configure the transition. Isolated transitions will run after the other state has transitioned in / out, while non-isolated transitions run at the same time. Transitioning is over when both transitions are over, but that shouldn't impact your code.

More information will be available in a scene architecture section that will be added at some point.
