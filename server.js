require('dotenv').config({silent: true});

console.log('db???',process.env.DATABASE_URL);
var express = require('express'),
  app = express(),
  morgan = require('morgan'),
  pg = require('pg'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize(process.env.DATABASE_URL||'postgres://localhost/githubdata2copy', {
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


  app.use(  express.static(__dirname+'/public'));
  app.use(bodyParser())

  //Sync all tables in database:
  sequelize.sync().then(function () {
    console.log('tables synced');
  }).catch(function () {
    console.log('table problems');
  })

app.use(morgan('combined'));

//home route
app.get('/', function(req, res) {
  res.send('landing page')
});

//route for testing thiings out
app.get('/playground', function (req, res) {
  // console.log(typeof process.env.TEST);
});

//Link server:
app.listen(process.env.PORT || 3000, function() {
  console.info('Listening on  port 3000...')
});

//Link up route files:
fs.readdirSync('./routes').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./routes/' + file);
      route.controller(app, User);
  }
});
