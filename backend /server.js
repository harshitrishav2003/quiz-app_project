
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();


app.use(cors());

app.get('/quiz-data', (req, res) => {
  axios.get('https://api.jsonserve.com/Uw5CrX')
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error('Error fetching quiz data:', error);
      res.status(500).send('Error fetching quiz data');
    });
});


app.listen(3001, () => {
  console.log('Backend server is running on http://localhost:3001');
});
