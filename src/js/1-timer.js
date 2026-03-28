import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;

const btnStart = document.querySelector('button[data-start]');
const inputData = document.querySelector('#datetime-picker');
const newValue = document.querySelectorAll('.value');

btnStart.disabled = true;

flatpickr(inputData, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (!userSelectedDate || userSelectedDate <= new Date()) {
      iziToast.warning({
        title: 'Warning',
        message: 'Please choose a date in the future',
      });
      btnStart.disabled = true;
    } else {
      btnStart.disabled = false;
    }
  },
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function startTimer() {
  if (!userSelectedDate || userSelectedDate <= new Date()) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please choose a date in the future',
    });
    btnStart.disabled = true;
    return;
  }

  btnStart.disabled = true;
  inputData.disabled = true;

  const timerId = setInterval(() => {
    const ms = userSelectedDate - new Date();

    if (ms <= 0) {
      clearInterval(timerId);
      inputData.disabled = false;

      newValue.forEach(el => (el.textContent = addLeadingZero(0)));

      iziToast.success({
        title: 'Info',
        message: 'Time is up!',
      });

      return;
    }

    const time = convertMs(ms);

    newValue[0].textContent = addLeadingZero(time.days);
    newValue[1].textContent = addLeadingZero(time.hours);
    newValue[2].textContent = addLeadingZero(time.minutes);
    newValue[3].textContent = addLeadingZero(time.seconds);
  }, 1000);
}

btnStart.addEventListener('click', startTimer);