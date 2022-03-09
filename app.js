// Array to hold segment patterns for each value. Each index is a pattern match
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

// Object for setting API request structure
const api = {
  url: 'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300',

  get: () =>
    fetch(api.url)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => err),
};

// Constant to hold fetched value from API
const result = {};

// Constants for elements that are globally available
const resultMessage = document.querySelector('.result_message');
const inputElement = document.getElementById('number_input');
const digit2 = document.querySelector('.digit_2');
const digit3 = document.querySelector('.digit_3');
const btnElement = document.getElementById('send_button');
const reloadBtnElement = document.getElementById('reload_button');
const bottomContainer = document.querySelector('.bottom_container');
const spoilerButton = document.getElementById('spoiler');

// Function to handle API request and error responses
function handleAPI() {
  api.get().then((data) => {
    if (data.StatusCode) {
      handleError(data.StatusCode)
    } else {
      result.value = data.value;
      disableSpoilerButton(false)
    }
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

// Function to reload match
function newMatch() {
  disableSpoilerButton(true);
  handleAPI();
  clearResultMessage();
  clearAll();
  reloadBtnElement.classList.add('transparent');
  handleInputValue(0);
  inputElement.value = '';
  disableInputAndButton(false);
}

// Function to handle the disable/enable status of input and button
function disableInputAndButton(type) {
  if (type) {
    bottomContainer.classList.add('disabled');
    btnElement.disabled = type;
  } else {
    bottomContainer.classList.remove('disabled');
    btnElement.disabled = type;
  }
}

// Function to handle segments styling when right awnser is submitted
function handleRightAnswer() {
  const allElements = document.querySelectorAll('.on');
  allElements.forEach((element) => {
    element.classList.remove('on');
    element.classList.add('green');
  });
  resultMessage.classList.add('equal');
  bottomContainer.classList.add('disabled');
  reloadBtnElement.classList.remove('transparent');
  btnElement.disabled = true;
  disableSpoilerButton(true);
}

// Function to check result value against submitted value
function checkResult() {
  if (Number(inputElement.value) < result.value) {
    resultMessage.classList.add('greater');
  } else if (Number(inputElement.value) > result.value) {
    resultMessage.classList.add('smaller');
  } else {
    handleRightAnswer();
  }
}

// Function to clear messages that appear when a value is submitted
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
}

// Function to add event listeners for button element
function addEventToButton() {
  btnElement.addEventListener('click', () => handleButtonClick());
  reloadBtnElement.addEventListener('click', () => newMatch());
  spoilerButton.addEventListener('click', () => handleSpoilerClick());
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
  reloadBtnElement.classList.remove('transparent');
  disableInputAndButton(true);
  disableSpoilerButton(true);
}

// Function to handle result spoiler
function handleSpoilerClick() {
  handleInputValue(result.value);
  disableSpoilerButton(true)
}

// Function to handle the disable/enable status of spoiler button
function disableSpoilerButton(type) {
  if (type) {
    spoilerButton.classList.add('disabled');
    spoilerButton.disabled = type;
  } else {
    spoilerButton.classList.remove('disabled');
    spoilerButton.disabled = type;
  }
}

// Load this before browser load page
window.onload = () => {
  disableSpoilerButton(true);
  handleInputValue(0);
  addEventToButton();
  handleAPI();
};
