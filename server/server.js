const express = require('express'); // Adding express
const historyRouter = require('./routes/history.router.js'); // Adding router for '/history'
const keymapRouter = require('./routes/keymap.router.js'); // Adding router for '/keymap'

const app = express(); // Creating app
const port = process.env.port || 5001; // Declaring port use for node

app.use(express.json()); // Allowing POST on node.js
app.use(express.static('server/public')); // Setting folder access
app.use('/history', historyRouter); // Router for '/history' requests
app.use('/keymap', keymapRouter); // Router for '/keymap' requests

// Initiates listening for node.
app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});