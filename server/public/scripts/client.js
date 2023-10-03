console.log("JS Sourced");

let numberDisplay = document.querySelector('#number-display');
let inputExists = false;
const currentEquation = document.querySelector('#current-equation').innerHTML;


function keypress(inputStr){
    console.log("keypress: ", inputStr);
    let numbers = ['0','1','2','3','4','5','6','7','8','9','.'];
    let operators = ['+','-','*','/'];
    let functions = ['clearAll','clear','+/-','%'];

    if (numbers.includes(inputStr)){
        console.log("keypress is number");
        if (numberDisplay.value == '0' && inputStr != '.'){
            numberDisplay.value = inputStr;
            inputExists = true;
        }
        else {
            numberDisplay.value += inputStr;
            inputExists = true;
        }
    }
    else if (operators.includes(inputStr)){
        
    }
    else if (functions.includes(inputStr)){

    }
}

function evaluate(event){
    event.preventDefault();

}

function clearHistory(event){
    
}