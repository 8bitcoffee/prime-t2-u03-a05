let express = require('express');
let router = express.Router();

let keymap = [
    {keypress: "0", id: "zero", type:"number"},
    {keypress: "1", id: "one", type:"number"},
    {keypress: "2", id: "two", type:"number"},
    {keypress: "3", id: "three", type:"number"},
    {keypress: "4", id: "four", type:"number"},
    {keypress: "5", id: "five", type:"number"},
    {keypress: "6", id: "six", type:"number"},
    {keypress: "7", id: "seven", type:"number"},
    {keypress: "8", id: "eight", type:"number"},
    {keypress: "9", id: "nine", type:"number"},
    {keypress: ".", id: "decimal", type:"number"},
    {keypress: "+", id: "add", type:"operator"},
    {keypress: "-", id: "subtract", type:"operator"},
    {keypress: "*", id: "multiply", type:"operator"},
    {keypress: "/", id: "divide", type:"operator"},
    {keypress: "clearAll", id: "clear-all", type:"function"},
    {keypress: "clear", id: "clear", type:"function"},
    {keypress: "%", id: "percent", type:"function"},
    {keypress: "+/-", id: "pos-neg", type:"function"},
    {keypress: "=", id: "equals", type:"evaluate"},
]
    





module.exports = router;