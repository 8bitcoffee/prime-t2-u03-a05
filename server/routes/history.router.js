let express = require('express');
let router = express.Router();

let history = [];

router.post('/', (req,res) =>{
    console.log("POST req made to '/history' ", req.body);
    history.push(req.body);
    console.log(history);
    res.sendStatus(201);
});

router.get('/', (req,res) =>{
    console.log("GET req made to '/history'");
    res.send(history);
});

router.delete('/:id', (req,res) =>{
    console.log(`DELETE req made for '/history - id: ${req.params.id}`);

    if (req.params.id == "all"){
        history = [];
    }
    else{
        history = history.filter(equation => equation.id != req.params.id);
    }

    console.log(history);
    res.sendStatus(200);
});

module.exports = router;