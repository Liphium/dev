# Introduction

The Pomomon Club Leaderboard Standard provides a unified interface for a play-time leaderboard that should track the time spent in the focus phase of Pomomon Farm. This leaderboard should give players more motivation to study and give them a way to compete against other players or measure how much time they spent studying in a certain period of time.

This specification describes how to add submissions, authenticate with the leaderboard or even just query it normally.

## Error handling and requests

When a request to an endpoint fails, the HTTP status code will be an error code as well. The body will contain a human-readable message that you may not show to users, but log in the console to potentially help you fix an error or help the server provider fix issues on their side.

All the endpoints listed below in the specification only specify their request when a body should be set (so only POST requests) and any other parameters are in the URL. The description of all endpoints will state what is needed or not based on the output you desire. For how to call authorized endpoints, refer to the section below. 

## Calling authorized endpoints

To call an authorized endpoint, you only have to specify the Authorization header with the **session token** returned from the endpoints below.

```javascript
Authorization: Bearer %SESSION_TOKEN%
```

# Session management & auth

Sessions in the Pomomon Club API let you add submissions to your account and also see your own spot in the leaderboard with an endpoint that dynamically changes pages based on your current position.

Each session has a **token** that lets you call authorized endpoints. How authorization works is covered in the Authorization section below. All endpoints that require a session token have authorized in their title below.

However, to protect against cheating a few restrictions apply.

- There can only be one active game session at a time. Creating a new session overwrites the old one and its token will be invalidated.
- You have to log into sessions using an account from a third-party provider that proves your identity. In the case of our main server, that provider is the Ulm University's GitLab instance to make sure only people creating Pomomon Farm games or attending classes here can submit to the leaderboard.
- Session tokens may expire after a certain amount of time.

## Authentication flow

1. Create a new authentication session by doing the following request.

```javascript
PUT /api/sessions
```

2. Redirect the user to the URL returned by the endpoint to let them log into Pomomon Club.
3. Your client can now occasionally query the status of the session by doing the following request.

```javascript
GET /api/sessions?token=%AUTHENTICATION_SESSION_TOKEN%
```

4. When the endpoint tells you that the session is verified, you can use the session token in the response to call authorized endpoints.

## PUT /api/sessions

This endpoint creates a new authentication session and returns a token for it. This is **not** the final token you can use to call authorized endpoints. Read the Authentication flow section above to see what this endpoint is good for.

Response:

```json
{
	"token": "some_token",
	"auth_url": "https://api.pomomon.club/some/example"
}
```

## GET /api/sessions?token=%token%

This endpoint checks if a authentication session has been successfully completed. If completed, it will also return the session token you can use to call authorized endpoints. Additionally, the error flag specifies if the user encountered any kind of error during their authentication. When the error flag is true, your may want to show an error popup and let the user complete the auth again.

Response:

```json
{
	"verified": true,
	"error": false,
	"session_token": "some_token"
}
```

# Submissions

The start endpoint should be called only when starting a focus-phase. The duration of the focus-phase can be provided in minutes and or seconds. When the focus-phase ends, the end endpoint has to be called to complete the phase and submit the score to the leaderboard. The end endpoint should be called directly after the phase ends. If the start endpoint gets called before the previous phase has ended, the old submission gets overwritten.

## POST /api/submissions/start (authorized)

The request registers the focus-phase with the provided duration starting when the request reaches the server. In this example the duration is 720 seconds. Both parameters have to be set, only one can have a value of 0.

Minutes:

- min: 0
- max: 280

Seconds:

- min: 0
- max: 16800

Request:

```json
{
	"minutes": 10,
	"seconds": 120
}
```

Response: 200 SUCCESS

## POST /api/submissions/end (authorized)

This verifies the session end and submits the score to the leaderboard.

Response: 200 SUCCESS

# Leaderboard

## GET /api/leaderboard?self=%self%&page=%page% 

This endpoint creates a server-sent event stream, that sends the client the current leaderboard selection and all updates if the leaderboard changes. The page parameter returns the the given leaderboard page. When the client is authenticated the self parameter can be used instead, it selects the leaderboard page the player is on. When no parameter is provided page 0 is selected as the default. A leaderboard page contains 15 entries or less if it's the last page and not enough entries are left.

Page: 

- min: 0
- max: last page of the leaderboard (provided in the sse stream)

Self: 

- true/false

Response sent through the SSE stream:

```javascript
{
	"page": 2,
	"scores": [
		{
			"id": "some user id",
			"name": "a cool username",
			"score": 1020000
		},
		{
			"id": "some user id",
			"name": "c00l p3rs0n",
			"score": 480000
		},
		...
	],
	"max_page": 12
}
```


