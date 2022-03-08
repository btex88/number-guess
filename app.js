function setNumberOn(arr, digit) {
  arr.forEach((value) => {
    const element = document.querySelector(`.digit_${digit} .segment_${value}`);
    element.classList.add('on');
  });
}

function clearAll() {
  const hiddenElements = document.querySelectorAll('.hide');
  const onElements = document.querySelectorAll('.on');
  hiddenElements.forEach((element) => element.classList.remove('hide'));
  onElements.forEach((element) => element.classList.remove('on'));
}

function handleInputValue(num) {
  const numArr = num.toString().split('');

  if (numArr.length === 1) {
    const digit2 = document.querySelector('.digit_2');
    const digit3 = document.querySelector('.digit_3');
    digit2.classList.add('hide');
    digit3.classList.add('hide');
  }

  if (numArr.length === 2) {
    const digit3 = document.querySelector('.digit_3');
    digit3.classList.add('hide');
  }

  numArr.forEach((value, index) => setNumberOn(numbersArr[value], index + 1));
}

function handleButtonClick() {
  clearAll();
  const inputElement = document.getElementById('number_input');
  if (inputElement.value) {
    handleInputValue(inputElement.value);
  } else setNumberOn(numbersArr[0]);
  inputElement.value = '';
}

function getInputNumberOnClick() {
  const btnElement = document.getElementById('send_button');
  btnElement.addEventListener('click', handleButtonClick);
}

window.onload = () => {
  getInputNumberOnClick();
  handleInputValue(0);
};
