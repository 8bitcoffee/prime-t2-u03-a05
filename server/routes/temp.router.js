let express = require('express');
let router = express.Router();

let temp = {
    id: "",
    equation: [],
    solution: ""
};

router.get('/', (req,res) =>{
    console.log("GET req made to '/temp'");
    res.send(temp);
});

router.post('/', (req,res) =>{
    console.log("POST request made to '/temp/'");
    temp = req.body;
    console.log(temp);
    res.sendStatus(201);
});

router.delete('/:id', (req,res) =>{
    console.log("DELETE request made to '/temp'");
    let tempId = req.params.id;
    temp = {
        id: tempId,
        equation: [],
        solution: ""
    };
    console.log(temp);
    res.sendStatus(200);
});


module.exports = router;