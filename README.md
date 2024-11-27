# Getting Started

1. `npm install` on the root directory;
2. Then `npm install` on the `./server` and `./client` directories;
3. Finally to run them both: `npm run local` on the root directory.

App starts in the Generator page. The server starts creating grids and codes. User has to click on the "GENERATE 2D GRID" button to connect with the server and start receiving updates of grids and codes.
User can also input a letter on the top left box. Inserting a character sends it to the server, server sends an event for the client application to block this input, 4 seconds later the server sends another event to the client to unblock the input, and the user can once again insert another letter.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 18.0.0)
- [NPM](https://www.npmjs.com/) (>= 7.0.0)
