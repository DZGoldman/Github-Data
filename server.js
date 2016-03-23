var express  = require('express');
var app      = express();
var morgan   = require ('morgan');
var mongoose = require('mongoose');

app.use(morgan('combined'));
app.use(  express.static(__dirname+'/public'));



app.get('/test', function (req, res) {
  res.send(req.body.data)

})

app.get('/', function(req,res){
  res.sendFile(__dirname+'/public/index.html')
})

mongoose.connect('mongodb://localhost/groceries-app', (err) => {
   if (err) {
      console.log(err);
   } else {
      console.log('connection successfull');
   }
});

app.listen(3000, function(){
  console.info('Listening on  port 3000...')
})
