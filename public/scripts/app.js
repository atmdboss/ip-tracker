fetch('http://localhost:3000/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ip: '199.299.399.001',
    name: 'smth',
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
