const form = document.querySelector('form');
const formInput = document.querySelector('form input');
const errorDiv = document.querySelector('.error');
const address = document.querySelector('.details .address p');
const locale = document.querySelector('.details .location p');
const timezone = document.querySelector('.details .timezone p');
const region = document.querySelector('.details .region p');
const isp = document.querySelector('.details .isp p');
const myMap = L.map('map');

form.addEventListener('submit', handleSubmit);

async function init() {
  try {
    // const { data } = await axios.get('https://www.cloudflare.com/cdn-cgi/trace', {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   },
    // });

    // const ipAdd = data
    //   .split('\n')
    //   .find((el) => el.includes('ip'))
    //   .split('=')[1];

    const response = await axios.post(`${window.location.origin}/search`);

    updateDetails(response.data);
    updateMap(response.data);
  } catch (error) {
    const response = await axios.post(`${window.location.origin}/search`, {
      ip: '',
    });

    updateDetails(response.data);
    updateMap(response.data);
  }
}

function updateMap(responseData) {
  myMap.setView([responseData.latitude, responseData.longitude], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 17,
  }).addTo(myMap);

  L.marker([responseData.latitude, responseData.longitude]).addTo(myMap).openPopup();
}

function updateDetails(responseData) {
  address.textContent = responseData.ip;
  isp.textContent = responseData.carrier?.name || responseData.company.name;
  timezone.textContent = `UTC ${responseData.time_zone.offset}`;
  locale.textContent = `${responseData.city}, ${responseData.country_name}`;
  region.textContent = responseData.region;
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
    // regex for ipv4 address
    const isValid = ipAddress.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm);
    if (isValid) {
      const { data } = await axios.post(`${window.location.origin}/search`, {
        ip: isValid[0],
      });

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
