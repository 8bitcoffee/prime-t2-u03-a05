const express = require('express'); // Adding express

const app = express(); // Creating app
const port = process.env.port || 5001; // Declaring port use for node

app.use(express.json()); // Allowing POST on node.js
app.use(express.static('server/public')); // Setting folder access

// Initiates listening for node.
app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});