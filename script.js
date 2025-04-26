
let count = 0;
const counterDisplay = document.getElementById('counter');
const zekrSelect = document.getElementById('zekrSelect');
const currentZekr = document.getElementById('currentZekr');

zekrSelect.addEventListener('change', () => {
  currentZekr.textContent = 'الذكر الحالي: ' + zekrSelect.value;
  count = 0;
  counterDisplay.textContent = count;
});

function increment() {
  count++;
  counterDisplay.textContent = count;
}

function resetCounter() {
  count = 0;
  counterDisplay.textContent = count;
}
