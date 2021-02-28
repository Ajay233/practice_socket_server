const express = require('express');
const route = express.Router();

route.get('/', (request, response) => {
  response.status(200).send('<h1>Welcome to my Socket Page</h1>')
})

module.exports = route;
