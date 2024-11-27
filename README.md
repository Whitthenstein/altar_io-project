# Getting Started

1. `npm install` on the root directory;
2. Then `npm install` on the `./server` and `./client` directories;
3. Finally to run them both: `npm run local` on the root directory.

App functions exactly the same has the previous stage (Payments Page). Since I implemented websockets as communication between frontend and backend, I didn't do much on this branch, since the app is ready for real time synchronization with multiple users. Just fixed an issue with the payments being shown on the client side, refactored the server a bit and removed the red circle that alert the user the app is live with the server to turn gray when the websocket disconnects from the server.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 18.0.0)
- [NPM](https://www.npmjs.com/) (>= 7.0.0)
