console.log("JS Sourced");

let numberDisplay = document.querySelector('#number-display');
let id = 0;
let storedValue = resetStoredValue();
let lastPressedType = "none";


const clearBtn = document.querySelector('#clear');
const currentEquation = document.querySelector('#current-equation');
const history = document.querySelector('#history');

function resetStoredValue() {
    id += 1;

    let newObject = {
        id: id,
        number1: "0",
        operator: "",
        number2: "",
        solution: ""
    }

    return newObject;
}

function keypress(inputStr){
    console.log("keypress: ", inputStr);
    console.log('/keymap/' + inputStr);

    axios.get(`/keymap/${inputStr}`).then((response) => {
        let keymap = response.data;
        console.log(keymap);
        if (lastPressedType == "none"){
            if (keymap.type == 'number'){
                if (numberDisplay.value == '0' && inputStr != 'decimal'){
                    numberDisplay.value = keymap.keypress;
                }
                else {
                    numberDisplay.value += keymap.keypress;
                }
                storedValue += keymap.keypress;
            }
            else if (keymap.type == 'operator'){
                let opButton = document.getElementById(`${keymap.id}`);
                opButton.classList.replace("operator", "operator-selected");
                storedValue += `0 ${keymap.keypress}`;
                currentEquation.innerHTML = `${storedValue}`;
            }
            else if (keymap.type == 'function'){
    
            }
            clearBtn.innerHTML = "C";
        }
        else if (lastPressedType == 'number') {
            if (keymap.type == 'number'){
                if (numberDisplay.value == '0' && inputStr != 'decimal'){
                    numberDisplay.value = keymap.keypress;
                }
                else {
                    numberDisplay.value += keymap.keypress;
                }
                storedValue += keymap.keypress;
            }
            else if (keymap.type == 'operator'){
                let opButton = document.getElementById(`${keymap.id}`);
                opButton.classList.replace("operator", "operator-selected");

                if (storedValue.split(' ').length == 2){

                }
                else{
                    storedValue += ` ${keymap.keypress}`;
                    currentEquation.innerHTML = `${storedValue}`;
                }
            }
            else if (keymap.type == 'function'){
    
            }
        }
        else if (lastPressedType == 'operator'){

        }
        else if(lastPressedType == 'function'){

        }
        else if(lastPressedType == 'equals'){

        }

        lastPressedType = keymap.type;

    }).catch((error) => {
        console.error(error);
        alert("Error in GET '/keymap'. See console.");
    });
}

function evaluate(event){
    event.preventDefault();

}

function clear(){
    let currentEquationArray = currentEquation.innerHTML.split(' ');

}

function clearAll(){

}

function clearHistory(event){
    
}