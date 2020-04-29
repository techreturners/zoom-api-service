const jwt = require('jsonwebtoken');
const serverless = require('serverless-http');
const express = require('express')
const app = express()
const axios = require('axios');

app.use(express.json());

app.post('/zoom', function (req, res) {
  const payload = {
    iss: process.env.ZOOM_API_KEY,
    exp: ((new Date()).getTime() + 5000)
  };
  const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);
  const userToRegister = {
    email : req.body.email,
    first_name : req.body.firstName,
    last_name : req.body.lastName,
    org : req.body.organisation
  }
  // Make a request for a user with a given ID
  axios.post(`https://api.zoom.us/v2/webinars/${req.body.webinarID}/registrants`, userToRegister, { headers: {"Authorization" : `Bearer ${token}`} })
    .then(function (response) {
      // handle success
      res.json(response.data)
    })
    .catch(function (error) {
      // handle error
      console.error(error);
      res.status(500).json({error})
    })
})

module.exports.zoom = serverless(app);
