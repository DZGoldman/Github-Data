require('dotenv').config({silent: true});

var express = require('express'),
  app = express(),
  morgan = require('morgan'),
  pg = require('pg'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    // process.env.PORT ||
    port: 5432
   }),
  User = sequelize.import(__dirname + "/User"),
  apiCalls = require('./Helpers/api-calls.js'),
  skillHelpers = require('./Helpers/skills-helpers.js'),
  CronJob = require('cron').CronJob,
  fs = require ('fs'),
  bodyParser = require('body-parser');

  app.use(  express.static(__dirname+'/Public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  //Sync all tables in database:
  sequelize.sync().then(function () {
    console.log('tables synced');
  }).catch(function () {
    console.log('table problems');
  })

app.use(morgan('combined'));

//home route
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/Public/index.html')
});

//route for testing thiings out
app.get('/playground', function (req, res) {
  // console.log(typeof process.env.TEST);
});

//Link server:
app.listen(process.env.PORT, function() {
  console.info('Listening on  port ' + process.env.PORT)
});

//Link up route files:
fs.readdirSync('./routes').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./routes/' + file);
      route.controller(app, User);
  }
});
