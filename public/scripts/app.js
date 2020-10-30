const form = document.querySelector('form');
const formInput = document.querySelector('form input');
const address = document.querySelector('.details .address p');
const locale = document.querySelector('.details .location p');
const timezone = document.querySelector('.details .timezone p');
const isp = document.querySelector('.details .isp p');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  // add error handling for empty inputs
});

function init() {
  fetch('http://localhost:3000/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ip: '',
    }),
  })
    .then((response) => response.json())
    .then((data) => updateDetails(data));
}
function updateMap() {}
function updateDetails(responseData) {
  address.textContent = responseData.ip;
  isp.textContent = responseData.isp;
  timezone.textContent = `UTC ${responseData.location.timezone}`;
  locale.textContent = `${responseData.location.city}, ${responseData.location.country}`;
}
init();
