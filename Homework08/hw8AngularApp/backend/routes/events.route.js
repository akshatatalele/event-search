const express = require('express');
const app = express();

const eventRoute = express.Router();

data = {"Key": "Value"}

eventRoute.route('/').get((req, res) => {
 console.log("In route /");
 res.json(data)
})

eventRoute.route('/get-event/:id').get((req, res) => {
  data['Key'] = req.params.id;
  console.log(req.params.id)
  res.json(data)
})

module.exports = eventRoute;
