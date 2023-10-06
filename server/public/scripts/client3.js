console.log("JS Sourced");

let lastPressed = {}

window.onload = function (){
    displayHistory();
    displayCurrent();
    restoreLastPressed();
    restoreDisplay();
}

function restoreDisplay(){
    let numberDisplay = document.querySelector('#number-display'); 
    let currentEquation = document.querySelector('#current-equation');
    if (currentEquation.innerHTML == ""){
        numberDisplay.innerHTML = '0';
    }
    else {
        let currentArray = currentEquation.innerHTML.split(' ');
        if (currentArray.includes("=")){
            numberDisplay.innerHTML = currentArray[currentArray.indexOf("=") + 1];
        }
        else if (
            currentArray.includes("+") ||
            currentArray.includes("-") ||
            currentArray.includes("*") ||
            currentArray.includes("/")
        ){
            let plusidx = currentArray.lastIndexOf("+");
            let minusidx = currentArray.lastIndexOf("-");
            let multidx = currentArray.lastIndexOf("*");
            let dividx = currentArray.lastIndexOf("/");

            let greatestidx = 0
            for (let idx of [plusidx,minusidx,multidx,dividx]){
                if (idx > greatestidx){
                    greatestidx = idx
                }
            }
            numberDisplay.innerHTML = currentArray[greatestidx + 1];
        }
        else {
            numberDisplay.innerHTML = currentArray[currentArray.length-1];
        }
    }
}

function restoreLastPressed(){
    let lastPressedStored = "";
    axios.get('/temp').then((response) =>{
        let storedValue = response.data;
        let currentEquationString = "";
        
        if (storedValue.equation.length == 0){
            lastPressed = {
                keypress: "",
                id: "",
                type: ""
            }
            return
        }
        else if (storedValue.solution == ""){
            for (let value of storedValue.equation){
                currentEquationString += `${value} `;
            }
            lastPressedStored = currentEquationString.charAt(currentEquationString.length-2);
        }
        else {
            for (let value of storedValue.equation){
                currentEquationString += `${value} `;
            }
            currentEquationString += `= ${storedValue.solution}`;

            lastPressedStored = currentEquationString.charAt(currentEquationString.length-1);
        }   

        if (lastPressedStored != ""){
            axios.get(`/keymap/all`).then((response) => {
                let keymap = response.data;
                let lastPressedArray = keymap.filter(key => key.keypress == lastPressedStored);
                lastPressed = lastPressedArray[0];
            }).catch((error) =>{
                console.error(error);
                alert(`Error in GET '/keymap/all'. See console.`);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        alert("Error in GET '/temp'. See console.");
    });
}

function clearStoredValue() {
    axios.get('/history').then((response) =>{
        let id = response.data.length + 1;

        axios.delete(`/temp/${id}`).catch((error) =>{
            console.error(error);
            alert(`Error in DELETE '/temp/${id}'. See console.`);
        });

    }).catch((error) => {
        console.error(error);
        alert("Error in GET '/history'. See console.");
    });
}

function clearCurrent(){
    let currentEquation = document.querySelector('#current-equation');
    currentEquation.innerHTML = "";
}

function displayCurrent(){
    clearCurrent();
    let currentEquation = document.querySelector('#current-equation');

    axios.get('/temp').then((response) =>{
        let storedValue = response.data;
        let currentEquationString = "";
        
        if (storedValue.equation == []){
            
        }
        else if (storedValue.solution == ""){
            for (let value of storedValue.equation){
                currentEquationString += `${value} `;
            }
        }
        else {
            for (let value of storedValue.equation){
                currentEquationString += `${value} `;
            }
            currentEquationString += `= ${storedValue.solution}`;
        }   
        currentEquation.innerHTML = currentEquationString;
    })
    .catch((error) => {
        console.error(error);
        alert("Error in GET '/temp'. See console.");
    });
}

function unhighlightOperators(){
    let operators = ["add","subtract","multiply","divide"];
    for (let buttonId of operators){
        let opButton = document.getElementById(`${buttonId}`);
        opButton.classList.replace("operator-selected", "operator");
    }
}

function clear(){
    console.log("clear pressed");
    let numberDisplay = document.querySelector('#number-display');
    if (lastPressed.type == "number"){
        numberDisplay.innerHTML = "0";
        changeToClearAll();
    }
    else if (lastPressed.type == "operator"){
        unhighlightOperators();
        changeToClearAll();

        axios.get('/temp').then((response) => {
            let storedValue = response.data;
            storedValue.equation.pop();
            let lastVal = storedValue[storedValue.length-1];
            let lastChar = lastVal.charAt(lastVal.length-1);

            axios.get(`keymap/${lastChar}`).then((response) =>{
                lastPressed = response.data;
            }).catch((error) => {
                console.error(error);
                console.error("Inside GET '/keymap' inside clear()");
                alert("Error in GET '/keymap'. See console.");
            })

        }).catch((error) => {
            console.error(error);
            console.error("Inside GET '/temp' inside clear()");
            alert("Error in GET '/temp'. See console.");
        })
    }
    else if (lastPressed.type == "function"){

    }
    else if (lastPressed.type == "equals"){
        numberDisplay.innerHTML = "0";
        changeToClearAll();
    }
}

function clearAll(){
    let numberDisplay = document.querySelector('#number-display');
    numberDisplay.innerHTML = '0';
    clearStoredValue();
    restoreLastPressed();
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

function changeToClear(){
    let btn = document.getElementById("clear");
    btn.setAttribute("onclick", "clear()");
    btn.innerHTML = "C";
}

function changeToClearAll(){
    let btn = document.getElementById("clear");
    btn.setAttribute("onclick", " clearAll()");
    btn.innerHTML = "AC";
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
                    <td>123 + 456</td>
                    <td>=</td>
                    <td>579</td>
                    <td><button onclick="displayhistory()">Delete Equation</button></td>
                </tr>
            `;
        }
        else {
            for (let line of historyData){
                historyStr += `
                    <tr>
                        <td>
                `;
                for (let i=0; i<line.equation.length; i++){
                    if (i != line.equation.length - 1){
                        historyStr += `${line.equation[i]} `;
                    }
                    else {
                        historyStr += `${line.equation[i]}</td>
                            <td>=</td>
                            <td>${line.solution}</td>
                            <td><button onclick="clearHistory(${line.id})">Delete Equation</button></td>
                        </tr>`;
                    }
                }
            }
        }

        history.innerHTML = historyStr;
        counter.innerHTML = `Equation history count: ${historyData.length}`;
        

    }).catch((error) => {
        console.error(error);
        alert("Error in GET '/history'. See console.");
    });
}

function keypress(keyId){
    console.log("keypress: ", keyId);
    let numberDisplay = document.querySelector('#number-display');

    axios.get(`/keymap/${keyId}`).then((response) => {
        let keymap = response.data;
        console.log(keymap);

        axios.get('/temp').then((response) =>{
            let storedValue = response.data;

            if (lastPressed.type == ""){
                if (keymap.type == 'number'){
                    if (keyId == 'zero'){
                        
                    }
                    else if (keyId == 'decimal'){
                        numberDisplay.innerHTML += keymap.keypress;
                        lastPressed = keymap;
                        changeToClear();
                    }
                    else {
                        numberDisplay.innerHTML = keymap.keypress;
                        lastPressed = keymap;
                        changeToClear();
                    }
                }
                else if (keymap.type == 'operator'){
                    unhighlightOperators();
                    let opButton = document.getElementById(`${keymap.id}`);
                    opButton.classList.replace("operator", "operator-selected");
                    storedValue.equation.push(0);
                    storedValue.equation.push(keymap.keypress);
                    lastPressed = keymap;
                    changeToClear();
                }
                else if (keymap.type == 'function'){

                }
                else if (keymap.type == 'equals'){

                }
            }
            else if (lastPressed.type == "number"){
                if (keymap.type == "number"){

                }
                else if (keymap.type == "operator"){

                }
                else if (keymap.type == "function"){

                }
                else if (keymap.type == "equals"){
                    
                }
            }
            else if (lastPressed.type == "function"){
                if (keymap.type == "number"){

                }
                else if (keymap.type == "operator"){

                }
                else if (keymap.type == "function"){

                }
                else if (keymap.type == "equals"){

                }
            }
            else if (lastPressed.type == "equals"){
                if (keymap.type == "number"){

                }
                else if (keymap.type == "operator"){

                }
                else if (keymap.type == "function"){

                }
                else if (keymap.type == "equals"){

                }
            }

            axios.post('/temp', storedValue).then((response) =>{
                console.log("POST to '/temp' successful")
                displayCurrent();
            }).catch((error) => {
                console.error(error);
                alert("Error in POST '/temp'. See console.")
            });
        }).catch((error) => {
            console.error(error);
            alert("Error in GET '/temp'. See console.")
        });
    }).catch((error) => {
        console.error(error);
        alert("Error in GET '/keymap'. See console.");
    });
}


function formatNumber(num) {
    if (num === 0) {
      return "0";
    }
    else if (Math.abs(num) >= 1e15) {
      // Use exponent notation for large numbers
      const exponent = Math.floor(Math.log10(Math.abs(num)));
      const mantissa = num / 10 ** exponent;
      return `${mantissa.toFixed(15)}e${exponent}`;
    }
    else if (num === Math.floor(num)) {
      // Handle whole numbers
      return num.toString();
    }
    else {
      // Handle fractions
      const decimalPart = num - Math.floor(num);
      const decimalStr = decimalPart.toFixed(16).substring(1);
      return `${Math.floor(num)}.${decimalStr}`;
    }
}
  
 
function add(num1, num2){
    return num1 + num2;
}
function subtract(num1, num2){
    return num1 - num2;
}
function multiply(num1, num2){
    return num1 * num2;
}
function divide(num1, num2){
    return num1 / num2;
}