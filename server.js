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
  apiCalls = require('./Helpers/api-calls.js'),
  skillHelpers = require('./Helpers/skills-helpers.js'),
  CronJob = require('cron').CronJob,
  fs = require ('fs'),
  bodyParser = require('body-parser');

  app.use(  express.static(__dirname+'/public'));
  app.use(bodyParser())

  //Sync all tables in database:
  sequelize.sync().then(function () {
    console.log('tables synced');
  }).catch(function () {
    console.log('table problems');
  })

app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.send('landing page')
});

//Get current rate limit status (5000 calls per hour)
app.get('/api/ratelimit', apiCalls.rateLimit);

//route for testing thiings out
app.get('/playground', function (req, res) {
  function getCount(){
    return User.count()
    .then(function (c) {
      console.log(c);
    })
  };
});

//Link server:
app.listen(3000, function() {
  console.info('Listening on  port 3000...')
});

//Link up route files:
fs.readdirSync('./routes').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./routes/' + file);
      route.controller(app, User);
  }
});
