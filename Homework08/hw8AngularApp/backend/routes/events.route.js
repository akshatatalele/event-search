const express = require('express');
const app = express();

const eventRoute = express.Router();

data = {"Key": "Value"}

eventRoute.route('/').get((req, res) => {
 console.log("In route /");
 res.json(data)
})

eventRoute.route('/get-event').get((req, res) => {
  // data['Key'] = req.params.id;
  console.log(req.params)
  res.json(data)
})

module.exports = eventRoute;
