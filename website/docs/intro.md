---
sidebar_position: 1
---

# Introduction

**Chatfall** is a fully-featured self-hosted commenting system for easily adding comments to any webpage. 

It is built using [Bun](https://bun.sh), [ElysiaJS](https://elysiajs.com/), [React](https://react.dev/) and [PostgreSQL](https://www.postgresql.org/) and has a whole host of features, including:

* Easily embeddable into any webpage.
* Fully customizable styling, including dark theme support.
* Threaded comment view with unlimited depth.
* Mobile-friendly responsive interface.
* Easy deployment - server-side backend executable is a single binary with no dependencies.
* Quick and simple registration by email.
* Reply to and like any comment at any depth.
* Sort comments by: newest/oldest, most/least replied-to, most/least liked.
* Real-time in-page notifications of new comments (uses [Websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)).
* Comprehensive administration features:
  * Set the minimum amount of time a user must wait before posting again.
  * Ban by email and/or email domain.
  * Delete unwanted comments.
  * Mark all comments as requiring moderation.
  * Approve/deny comments marked as requiring moderation.
  * Set banned words - users will not be able to create comments containing these words.

Chatfall comes as a full-stack solution, with both a server-side and client-side component:

* Server-side: 
    * Responsible for reading/writing comments from/to your database, authenticating users, sending emails, etc.
    * Distributed as single binary executable on the [Github releases page](https://github.com/hiddentao/chatfall/releases). 
* Client-side:
    * To be embedded into webpages where comments are needed. Designed to load and render quickly.
    * Distributed as a JS and companion CSS file available on the Github releases page but also via the [@chatfall/client NPM package](https://www.npmjs.com/package/@chatfall/client).

The best way to discover what Chatfall has to offer is to follow the instructions in the [Tutorial](./tutorial/setup-the-server.mdx) to get it up and running locally.