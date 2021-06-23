var express = require('express'),
path = require('path'),
cors = require('cors')

const eventRoute1 = require('./routes/events.route')

var app = express()
app.use(cors());
// app.use(express.static(path.join(__dirname, 'dist/hw8AngularApp')));

//API root
app.use('/api', eventRoute1)

app.listen(8000, () =>{
  console.log("LISTENING ON PORT 8000")
})
