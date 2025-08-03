
// Fetches elements
const inputSlider = document.querySelector("[data-lengthSlider]") // custom attribute syntax
const lengthDisplay = document.querySelector("[data-lengthNumber]")

const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '+-*/,.<>?`@#%!^"&:;~()[]{}$_=|'


// intial pass is empty
let password = "";
// pass length is 10 initally
let passwordlength = 10;
// one checkbox will be checked initally
let checkcount = 0;
setindicator("#ccc");

// calling
handleslider();

function handleslider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;


    // set slider color as per value and else part to be transperant
    const min = inputSlider.min;
    const max = inputSlider.max;

    const percent = ((passwordlength - min) * 100) / (max - min);

    inputSlider.style.background = `linear-gradient(to right, #1abc9c ${percent}%, #ccc ${percent}%)`;
}


// genrate a single digit random for a number and alphabet
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function generateRandomNumber() {
    return getRndInteger(0, 9);
}


function generatelowercase() {
    // lower case ascii values a to z
    // String.fromCharCode ascii to char
    return String.fromCharCode(getRndInteger(97, 123));
}


function generateUppercase() {
    // lower case ascii values Ato Z
    return String.fromCharCode(getRndInteger(65, 91));
}


function generateSymbol() {
    // symbols.length return str length
    const randNum = getRndInteger(0, symbols.length)
    // charAt tells the value at specified index
    return symbols.charAt(randNum);
}


function calStrength() {

    // default value of all check box false
    let hasUppper = false
    let hasLower = false
    let hasNum = false
    let hasSym = false


    // status of check box if check or not ,if checked true 
    if (uppercaseCheck.checked) hasUppper = true
    if (lowercaseCheck.checked) hasLower = true
    if (numbersCheck.checked) hasNum = true
    if (symbolsCheck.checked) hasSym = true

    // rules to set color strong or weak password
    if (hasLower && hasUppper && (hasNum || hasSym) && passwordlength >= 9) {
        setindicator("#0f0");
    }
    else if ((hasUppper || hasLower) && (hasNum || hasSym) && passwordlength >= 5) {
        setindicator("#ff0");
    }
    else {
        setindicator("#f00");
    }

}

// color as per pass strength
function setindicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


// to copy from clipboard
async function copyContent() {

    try {
        // navigator.clipboard return a promise
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    // makes visible
    copyMsg.classList.add("active")

    // makes invisible
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);

}

// eventlistner to link slider to pass length
inputSlider.addEventListener("input", (e) => { //e represents the inputslider
    passwordlength = parseInt(e.target.value);
    handleslider();
})


copyBtn.addEventListener("click", () => {
    // if pass is not empty call the fun
    if (passwordDisplay.value) {
        copyContent();
    }
})


// count the checkbox
function handlecheckbox() {
    checkcount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkcount++;
        }
    });

    //  if scalerinput < checkbox checked
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleslider();
    }
}
// to find the change in checkbox
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handlecheckbox);
})


generateBtn.addEventListener("click", () => {
    // no checkbox is selected no pass generate
    if (checkcount == 0)
        return;

    // pass len < checkcount
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleslider();
    }

    //Creating password

    // removing default pass
    password = "";

    // to store pass in array
    let funArr = [];

    if (uppercaseCheck.checked) {
        funArr.push(generateUppercase);
    }
    if (lowercaseCheck.checked) {
        funArr.push(generatelowercase);
    }
    if (symbolsCheck.checked) {
        funArr.push(generateSymbol);
    }
    if (numbersCheck.checked) {
        funArr.push(generateRandomNumber);
    }

    // password as per checkbox checked
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    // remaining password random pass
    for (let i = 0; i < passwordlength - funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        console.log("RandomIndex" + randIndex);
        password += funArr[randIndex]();
    }

    // shuffle the password
    password = generateShuffle(Array.from(password)); //  passing password string in from of array

    // display pass on ui
    passwordDisplay.value = password;
    // calculate strength
    calStrength();

});

function generateShuffle(array) {
    // fisher yates method

    for (let i = array.length - 1; i > 0; i--) {
        // random j
        const j = Math.floor(Math.random() * (i + 1));

        // swap
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
