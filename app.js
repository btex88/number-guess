// Constants
const numbersArr = [
  ['a', 'b', 'c', 'e', 'f', 'g'],
  ['e', 'f'],
  ['a', 'e', 'd', 'c', 'g'],
  ['a', 'e', 'd', 'f', 'g'],
  ['b', 'e', 'd', 'f'],
  ['a', 'b', 'd', 'f', 'g'],
  ['a', 'b', 'c', 'd', 'f', 'g'],
  ['a', 'e', 'f'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  ['a', 'b', 'd', 'e', 'f', 'g'],
];

const api = {
  url: 'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300',

  get: () =>
    fetch(api.url)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => err),
};

const result = {};

const resultMessage = document.querySelector('.result_message');
const inputElement = document.getElementById('number_input');
const digit2 = document.querySelector('.digit_2');
const digit3 = document.querySelector('.digit_3');
const btnElement = document.getElementById('send_button');
const reloadBtnElement = document.getElementById('reload_button');

function handleAPI() {
  api.get().then((data) => {
    data.StatusCode
      ? handleError(data.StatusCode)
      : (result.value = data.value);
  });
}

// Function to limit the amount of value typed at input field
function limitInputLength(input) {
  const THREE = 3;
  const THREE_HUNDRED = 300;
  const ONE = 1;
  const ZERO = 0;
  if (input.value.length > THREE) input.value = input.value.slice(0, THREE);
  if (input.value > THREE_HUNDRED) input.value = THREE_HUNDRED;
  if (input.value < ZERO) input.value = ONE;
}

// Function to handle value and digits to be displayed at LED segments
function setNumberOn(arr, digit) {
  arr.forEach((value) => {
    const element = document.querySelector(`.digit_${digit} .segment_${value}`);
    element.classList.add('on');
  });
}

// Function to clear LED segments colors, appearance and result message
function clearAll() {
  const hiddenElements = document.querySelectorAll('.hide');
  const onElements = document.querySelectorAll('.on');
  const redElements = document.querySelectorAll('.red');
  const greenElements = document.querySelectorAll('.green');

  hiddenElements.forEach((element) => element.classList.remove('hide'));
  onElements.forEach((element) => element.classList.remove('on'));
  redElements.forEach((element) => element.classList.remove('red'));
  greenElements.forEach((element) => element.classList.remove('green'));
  resultMessage.classList.remove('error');
}

// Function to handle input values
function handleInputValue(num) {
  clearAll();
  const numArr = num.toString().split('');

  if (numArr.length === 1) {
    digit2.classList.add('hide');
    digit3.classList.add('hide');
  }

  if (numArr.length === 2) {
    digit3.classList.add('hide');
  }
  numArr.forEach((value, index) => setNumberOn(numbersArr[value], index + 1));
}

function newMatch() {
  handleAPI();
  clearResultMessage();
  clearAll();
  reloadBtnElement.classList.add('transparent');
  handleInputValue(0);
  inputElement.value = '';
}

function handleRightAnswer() {
  const allElements = document.querySelectorAll('.on');
  allElements.forEach((element) => {
    element.classList.remove('on');
    element.classList.add('green');
  });
  resultMessage.classList.add('equal');
  reloadBtnElement.classList.remove('transparent');
}

function checkResult() {
  if (Number(inputElement.value) > result.value) {
    resultMessage.classList.add('greater');
  } else if (Number(inputElement.value) < result.value) {
    resultMessage.classList.add('smaller');
  } else {
    handleRightAnswer();
  }
}

function clearResultMessage() {
  resultMessage.classList.remove('greater');
  resultMessage.classList.remove('smaller');
  resultMessage.classList.remove('equal');
}

// Function to handle send button click
function handleButtonClick() {
  clearResultMessage();
  if (inputElement.value) handleInputValue(inputElement.value);
  else setNumberOn(numbersArr[0]);
  checkResult();
  inputElement.value = '';
  console.log(result.value);
}

// Function to add event listeners for button element
function addEventToButton() {
  btnElement.addEventListener('click', () => handleButtonClick());
  reloadBtnElement.addEventListener('click', () => newMatch());
}

// Function to handle error on api request
function handleError(value) {
  handleInputValue(value);
  const allElements = document.querySelectorAll('.on');
  allElements.forEach((element) => {
    element.classList.remove('on');
    element.classList.add('red');
  });
  resultMessage.classList.add('error');
}

// Load this before browser load page
window.onload = () => {
  handleInputValue(0);
  addEventToButton();
  handleAPI();
};
