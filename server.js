var express = require('express'),
  app = express(),
  morgan = require('morgan'),
  request = require('request'),
  pg = require('pg'),
  secrets = require('./secrets.js'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize('postgres://localhost/githubdata-dev', {
    dialect: 'postgres',
    port: 5432
   }),
  User = sequelize.import(__dirname + "/User"),
  sheetHelpers = require('./Helpers/sheet-helpers.js'),
  skillHelpers = require('./Helpers/skills-helpers.js'),
  CronJob = require('cron').CronJob,
  fs = require ('fs');

  sequelize.sync().then(function () {
    console.log('tables synced');
  }).catch(function () {
    console.log('table problems');
  })

// find all users that have certain skills, query:
//select Count(*) from users where skills @> '{JavaScript, Ruby}'::text[];

var requestOptions = {
  url: '', //URL to hit
  method: 'GET', //Specify the method
  headers: {
    'user-agent': secrets.username
  },
  auth: {
    user: secrets.username,
    password: secrets.password
  }
}
app.use(  express.static(__dirname+'/public'));


app.use(morgan('combined'));

//GET RATE LIMIT
function rateLimit(req, res) {
  sequelize.sync().then(function() {
    User.count().then(function(c) {
      console.log(c);
    })

    requestOptions.url = 'https://api.github.com/rate_limit'
    request(requestOptions, function(err, resp, body) {
      res.send(body)
    })
  })
}
app.get('/ratelimit', rateLimit);


app.get('/testing', function (req, res) {
  function getCount(){
    return User.count()
    .then(function (c) {
      console.log(c);
    })
  };
  var x =getCount()
  console.log('?',x);


})







app.get('/', function(req, res) {
  res.send('landing page')
});


app.listen(3000, function() {
  console.info('Listening on  port 3000...')
})



fs.readdirSync('./routes').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./routes/' + file);
      route.controller(app, User);
  }
});
