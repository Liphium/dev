---
title: "Magic in CI/CD pipelines"
description: "How to set up a CI/CD pipeline with integration testing and everything else using Magic."
---

If you want to run Magic in CI/CD, the environment needs Docker, or anything Socket-compatible to Docker (like Podman), installed.

Since explaining all of this would be stupid anyway, we provide some samples for some providers below, if you are using any other CI/CD provider and created a config for them, [feel free to contribute](https://github.com/Liphium/dev).

Normally though, you can just use a normal pipeline for Go, as long as Docker is available in the pipeline.

## GitHub Actions

```yml
# This workflow tests the application and uploads the cover profile as an artifact

name: Test (Ubuntu)

on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: "1.25.7"

      - name: Test
        run: go test -timeout 20m -v ./... -coverpkg="./..." -coverprofile="coverage.out"

      - uses: actions/upload-artifact@v5.0.0
        with:
          name: test-coverage.out
          path: coverage.out
```
