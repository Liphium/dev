---
title: "Integration testing"
description: "How to test with Magic: How you can create integration tests, interact with the runtime and what might be useful."
---

**This article is not complete yet, please don't follow it until this warning is gone.**

The idea of integration testing with Magic is essentially the following:

- Magic will automatically start all Docker containers and services needed for your application
- Magic will start your actual app in a separate goroutine in the same process as the testing runtime
- All of your tests are executed by the Go testing runtime (like normal, with the same environment variables set as your application)

## Getting started

Before you can use Magic for integration testing, please make sure you have [set up Magic properly](/magic/documentation/integrating-magic).
