# How to run:

following packages need to be installed:

    $ npm install cors
    $ npm install axios

To run the vite server that serves the frontend:
    $ npm run dev

The API key is intentionally not hardcoded. Use the following command to export the key into a local variable before running the node server:
For Linux -

    $ export GOOGLE_API_KEY="google-maps-key"

For Windows -

    $env:GOOGLE_API_KEY="google-maps-key"

To run the backend server:
    $ node backend/server.js


