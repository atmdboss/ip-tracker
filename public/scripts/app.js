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
    .then((data) => {
      updateDetails(data);
      updateMap(data);
    });
}

function updateMap(responseData) {
  const myMap = L.map('map').setView(
    [responseData.location.lat, responseData.location.lng],
    15
  );
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 15,
  }).addTo(myMap);

  L.marker([responseData.location.lat, responseData.location.lng])
    .addTo(myMap)
    .openPopup();
}

function updateDetails(responseData) {
  address.textContent = responseData.ip;
  isp.textContent = responseData.isp;
  timezone.textContent = `UTC ${responseData.location.timezone}`;
  locale.textContent = `${responseData.location.city}, ${responseData.location.country}`;
}

init();
