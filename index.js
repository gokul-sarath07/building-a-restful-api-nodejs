/*
   Primary file for the api.
 */

// Dependencies
const http = require('http');
const url = require('url');

// The server should respond to all requests with a string.
const server = http.createServer((req, res) => {

   // Parse the url.
   const parsedUrl = url.parse(req.url, true);

   // Get the path.
   const path = parsedUrl.pathname;
   const trimmedPath = path.replace(/^\/+|\/+$/g, '');

   // Get the query string as an object.
   const queryStringAsObject = parsedUrl.query;

   // Get the http method.
   const method = req.method.toLowerCase();

   // Send the response.
   res.end("Hello World!");

   // Log the request path.
   console.log('Request received on path: ' + trimmedPath + ' with method: ' + method);
   console.log('with querys: ', queryStringAsObject);
})

// Start the server, and have it listen on port 3000.
server.listen(3000, () => {
   console.log("The server is listening on port 3000 now.");
})
