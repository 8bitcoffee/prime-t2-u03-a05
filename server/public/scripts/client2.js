console.log("JS Sourced");

let storedValue = resetStoredValue();
let lastPressedType = "none";

window.onload = displayHistory();

function resetStoredValue() {

    let newObject = {
        number1: "0",
        operator: "",
        number2: "",
        solution: ""
    };

    axios.get('/history').then((response) =>{
        let id = response.data.length + 1;
        newObject.id = id;
    }).catch((error) => {
        console.error(error);
        alert("Error in GET '/history'. See console.");
    });

    return newObject;
}

function displayCurrent(){
    let currentEquation = document.querySelector('#clear');
    currentEquation.innerHTML = "";
    currentEquation.innerHTML = `${storedValue.number1} ${storedValue.operator}`;
}

function unhighlightOperators(){
    let operators = ["add","subtract","multiply","divide"];
    for (let buttonId of operators){
        let opButton = document.getElementById(`${buttonId}`);
        opButton.classList.replace("operator-selected", "operator");
    }
}

function keypress(inputStr){
    let clearBtn = document.querySelector('#clear');
    let numberDisplay = document.querySelector('#number-display');

    console.log("keypress: ", inputStr);
    console.log('/keymap/' + inputStr);

    axios.get(`/keymap/${inputStr}`).then((response) => {
        let keymap = response.data;
        console.log(keymap);
        if (storedValue.number1 == "0" && storedValue.operator == "" && storedValue.solution == ""){
            if (keymap.type == 'number'){
                if (numberDisplay.value == '0' && inputStr != 'decimal'){
                    numberDisplay.value = keymap.keypress;
                    storedValue.number1 = keymap.keypress;
                }
                else {
                    numberDisplay.value += keymap.keypress;
                    storedValue.number1 += keymap.keypress;
                }
            }
            else if (keymap.type == "operator"){
                unhighlightOperators();
                let opButton = document.getElementById(`${keymap.id}`);
                opButton.classList.replace("operator", "operator-selected");
                storedValue.operator = keymap.keypress;
                displayCurrent();
            }
            else if (keymap.type == "function"){

            }
            else if (keymap.type == "equals"){
                storedValue.solution = "0";
                numberDisplay.value = "0";
                evaluate(inputStr);
            }
        }

        lastPressedType = keymap.type;

    }).catch((error) => {
        console.error(error);
        alert("Error in GET '/keymap'. See console.");
    });
}

function evaluate(inputStr){
    axios.post('/history', storedValue).then((response)=>{
        console.log("POST to /history successful");
        displayHistory();
    }).catch((error) => {
        console.error(error);
        alert("Error in POST '/history'. See console.");
    });

}

function clear(){

}

function clearAll(){

}

function clearHistory(id){
    axios.delete(`/history/${id}`).then((response) =>{
        if (id == "all"){
            console.log("Equation history cleared");
        }
        else {
            console.log(`Equation id: ${id} deleted`);
        }
        displayHistory();
    }).catch((error) => {
        console.error(error);
        alert("Error in DELETE '/history'. See console.");
    });
}

function displayHistory(){

    axios.get('/history').then((response) =>{

        let history = document.querySelector('#history');
        history.innerHTML = "";
        let counter = document.querySelector('#counter');
        counter.innerHTML = "";

        let historyData = response.data;

        let historyStr = "";

        if (response.data.length == 0){
            historyStr += `
                <tr>
                    <td>123</td>
                    <td>+</td>
                    <td>456</td>
                    <td>=</td>
                    <td>579</td>
                    <td><button onclick="displayhistory()">Delete Equation</button></td>
                </tr>
            `;
        }
        else {
            for (let equation of historyData){
                historyStr += `
                    <tr>
                        <td>${equation.number1}</td>
                        <td>${equation.operator}</td>
                        <td>${equation.number2}</td>
                        <td>=</td>
                        <td>${equation.solution}</td>
                        <td><button onclick="clearHistory(${equation.id})">Delete Equation</button></td>
                    </tr>
                `;
            }
        }

        history.innerHTML = historyStr;
        counter.innerHTML = `Equation history count: ${historyData.length}`;
        

    }).catch((error) => {
        console.error(error);
        alert("Error in GET '/history'. See console.");
    });
}