const form = document.querySelector('form');
const formInput = document.querySelector('form input');
const errorDiv = document.querySelector('.error');
const address = document.querySelector('.details .address p');
const locale = document.querySelector('.details .location p');
const timezone = document.querySelector('.details .timezone p');
const isp = document.querySelector('.details .isp p');
const myMap = L.map('map');

form.addEventListener('submit', handleSubmit);

async function init() {
  const { data } = await axios.get('https://www.cloudflare.com/cdn-cgi/trace');
  const ipAdd = data
    .split('\n')
    .find((el) => el.includes('ip'))
    .split('=')[1];

  const response = await axios.post('https://ip-reveal.herokuapp.com/search', {
    ip: ipAdd,
  });
  updateDetails(response.data);
  updateMap(response.data);
}

function updateMap(responseData) {
  myMap.setView([responseData.location.lat, responseData.location.lng], 15);
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

async function handleSubmit(e) {
  e.preventDefault();

  const ipAddress = formInput.value.trim();
  if (!ipAddress) {
    errorDiv.classList.add('show');
    errorDiv.textContent = 'Please enter an IP address';
    setTimeout(() => {
      errorDiv.classList.remove('show');
      errorDiv.textContent = '';
    }, 2000);
    return;
  } else {
    const isValid = ipAddress.match(
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm
    );
    if (isValid) {
      const { data } = await axios.post(
        'https://ip-reveal.herokuapp.com/search',
        {
          ip: isValid[0],
        }
      );
      updateDetails(data);
      updateMap(data);
    } else {
      errorDiv.classList.add('show');
      errorDiv.textContent = 'Please enter a valid IP address';
      setTimeout(() => {
        errorDiv.classList.remove('show');
        errorDiv.textContent = '';
      }, 2000);
    }
  }
}

init();
