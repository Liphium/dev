---
title: "Error handling"
description: "How your errors flow through Neoroute, and how to handle them."
---

- Start with explanation of error handler in router
	- What kinds of errors get put in there (handshake errors also)
- Default error handler just returns "Something went wrong" and logs with neoroute.Logger
- All errors returned land in the router (for requests)
	- Mention localization use case
- Mention setting slog.Logger neoroute uses with SetLogger
