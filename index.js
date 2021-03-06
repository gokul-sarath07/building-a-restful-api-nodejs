/*
   Primary file for the api.
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string.
const server = http.createServer((req, res) => {

   // Parse the url.
   const parsedUrl = url.parse(req.url, true);

   // Get the path.
   const path = parsedUrl.pathname;
   const trimmedPath = path.replace(/^\/+|\/+$/g, '');

   // Get the query string as an object.
   const queryStringObject = parsedUrl.query;

   // Get the http method.
   const method = req.method.toLowerCase();

   // Get the headers as an object.
   const headers = req.headers;

   // Get the payload, if any
   const decoder = new StringDecoder('utf-8');
   let buffer = '';
   req.on('data', (data) => {
      buffer += decoder.write(data);
   })
   req.on('end', () => {
      buffer += decoder.end();

      // Choose the handler this request should go to, else go to the not found
      // handler.
      const pathExists = typeof(router[trimmedPath]) !== 'undefined';
      const chosenHandler = pathExists ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler.
      const data = {
         'trimmedPath': trimmedPath,
         'queryStringObject': queryStringObject,
         'method': method,
         'headers': headers,
         'payload': buffer
      };

      // Route the request to the handler specified in the router.
      chosenHandler(data, (statusCode, payload) => {
         // Use the status code called back by the handler, or default to 200.
         statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

         // Use the payback called back by the handler, or default to an empty.
         // object.
         payload = typeof(payload) == 'object' ? payload : {};

         // Convert the payload to a string.
         const payloadString = JSON.stringify(payload);

         // Return the response.
         res.setHeader('Content-Type', "application/json");
         res.writeHead(statusCode);
         res.end(payloadString);

         // Log the request path.
         console.log('Returning this response: ', statusCode, payloadString);
      });
   })
})

// Start the server, and have it listen on port 3000.
server.listen(3000, () => {
   console.log("The server is listening on port 3000 now.");
})

// Defining the handlers.
const handlers = {};

// Sample handler.
handlers.sample = (data, callback) => {
   // Callback a http status code, and payload object.
   callback(406, { 'name': 'Sample Handler'});
};

// Not found handler.
handlers.notFound = (data, callback) => {
   callback(404);
};

// Defining a request router.
const router = {
   'sample' : handlers.sample
}
