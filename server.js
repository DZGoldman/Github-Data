require('dotenv').config({
  silent: true
});

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
  User = sequelize.import(__dirname + "/Models/Github_User"),
  CronJob = require('cron').CronJob,
  fs = require('fs'),
  bodyParser = require('body-parser'),
  session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('combined'));

//set public/ views
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/Public'));

// Sync all tables in database:
sequelize.sync().then(function() {
  console.log('tables synced');
}).catch(function() {
  console.log('table problems');
})

//auth/sessions
var Auth = require('./Helpers/session-helpers.js')
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));

app.use(Auth.unless('/login', Auth.auth));

app.post('/login', Auth.login );

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.render('login');
  })

//home route
app.get('/', function(req, res) {
    res.render('index');
});

//Link server:
app.listen(process.env.PORT, function() {
  console.info('Listening on  port ' + process.env.PORT)
});

//Link up route files:
fs.readdirSync('./Routes').forEach(function(file) {
  if (file.substr(-3) == '.js') {
    route = require('./Routes/' + file);
    route.controller(app, User);
  }
});
